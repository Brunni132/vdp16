import {initShaderProgram, makeBuffer} from "./utils";
import {
	declareReadPalette,
	declareReadTexel, envColor, makeOutputColor,
	MAP_TEX_H, MAP_TEX_W, MAX_BGS, OTHER_TEX_H, OTHER_TEX_W, PALETTE_HICOLOR_FLAG,
	PALETTE_TEX_H,
	PALETTE_TEX_W,
	SCREEN_HEIGHT,
	SCREEN_WIDTH
} from "./shaders";
import {drawPendingObj} from "./sprites";

export const mapEnvColor = [1, 1, 1, 1];

export function initMapShaders(vdp) {
	const gl = vdp.gl;
	// Vertex shader program
	const vsSource = `
			attribute vec4 aXyzp;
			attribute vec4 aMapInfo1;
			attribute vec4 aMapInfo2;
			attribute vec4 aMapInfo3;
			attribute vec4 aMapInfo4;
			uniform mat4 uModelViewMatrix, uProjectionMatrix;

			varying vec2 vTextureCoord;
			varying float vPaletteNo;
			// TODO Florian -- use vec4 and extract in fragment program
			varying vec2 vMapStart, vMapSize;
			varying vec2 vTilesetStart;
			varying float vTilesetWidth;
			varying vec2 vTileSize;
			varying mat3 vTransformationMatrix;
			// [0] = linescroll buffer, if 0 use vTransformationMatrix always, [1] = whether to wrap around
			varying vec2 vOtherInfo;
			
			uniform sampler2D uSamplerMaps, uSamplerSprites, uSamplerPalettes, uSamplerOthers;
		
			mat3 readLinescrollBuffer(int bufferNo, int horizOffset) {
				float vOfs = float(bufferNo) / ${OTHER_TEX_H}.0;
				vec4 first = texture2D(uSamplerOthers, vec2(float(horizOffset) / ${OTHER_TEX_W}.0, vOfs));
				vec4 second = texture2D(uSamplerOthers, vec2(float(horizOffset + 1) / ${OTHER_TEX_W}.0, vOfs));
				return mat3(
					first.xy, first.z,
					vec2(first.a, second.r), first.g,
					second.ba, 1.0);
			}
		
			void main(void) {
				gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(floor(aXyzp.xyz), 1);
				vPaletteNo = floor(aXyzp.w);
				vMapStart = floor(aMapInfo1.xy);
				vTilesetStart = floor(aMapInfo1.zw);
				vMapSize = floor(aMapInfo2.xy);
				vTilesetWidth = floor(aMapInfo2.z);
				vTileSize = floor(aMapInfo3.xy);
				vTextureCoord = floor(aMapInfo3.zw);
				vOtherInfo = floor(aMapInfo4.xy);
				// If 0-255, use one transformation map-wide from the first line, if -1 never use transformations
				if (aMapInfo4.x >= 0.0 && aMapInfo4.x < 256.0) {
					vTransformationMatrix = readLinescrollBuffer(0, int(aMapInfo4.x) * 2);
				} else {
					vTransformationMatrix = mat3(
						1, 0, 0,
						0, 1, 0,
						0, 0, 1);
				}
			}
		`;
	const fsSource = `
			precision highp float;
			
			varying highp vec2 vTextureCoord;
			varying highp float vPaletteNo;
			varying vec2 vMapStart, vMapSize;
			// tilesetSize is in tiles!
			varying vec2 vTilesetStart;
			varying float vTilesetWidth;
			varying vec2 vTileSize;
			varying mat3 vTransformationMatrix;
			varying vec2 vOtherInfo;
			
			uniform mat4 uModelViewMatrix;
			uniform vec4 uEnvColor;
			uniform sampler2D uSamplerMaps, uSamplerSprites, uSamplerPalettes, uSamplerOthers;
						
			// y > 0! x can be negative or positive
			int intDiv(float x, float y) {
				if (x >= 0.0) return int(x / y);
				return int((x - y) / y);
			}

			mat3 readLinescrollBuffer(int bufferNo, int horizOffset) {
				float vOfs = float(bufferNo) / ${OTHER_TEX_H}.0;
				vec4 first = texture2D(uSamplerOthers, vec2(float(horizOffset) / ${OTHER_TEX_W}.0, vOfs));
				vec4 second = texture2D(uSamplerOthers, vec2(float(horizOffset + 1) / ${OTHER_TEX_W}.0, vOfs));
				return mat3(
					first.xy, first.z,
					vec2(first.a, second.r), first.g,
					second.ba, 1.0);
			}
			
			int readMap(int x, int y) {
				x = int(mod(float(x), vMapSize.x) + vMapStart.x);
				y = int(mod(float(y), vMapSize.y) + vMapStart.y);
				
				int texelId = x / 2;
				int texelC = x - texelId * 2;
				vec4 read = texture2D(uSamplerMaps, vec2(float(texelId) / ${MAP_TEX_W}.0, float(y) / ${MAP_TEX_H}.0));
				if (texelC == 0) return int(read.r * 255.0) + int(read.g * 255.0) * 256;
				return int(read.b * 255.0) + int(read.a * 255.0) * 256;
			}
			
			vec2 positionInTexture(int tileNo) {
				vec2 base = vTilesetStart;
				float rowNo = float(tileNo / int(vTilesetWidth));
				float colNo = mod(float(tileNo), vTilesetWidth);
				return base + vec2(colNo * vTileSize.x, rowNo * vTileSize.y);
			}
	
			${declareReadTexel()}
			${declareReadPalette()}
		
			void main(void) {
				mat3 transformationMatrix;
				// Per-line info
				if (vOtherInfo.x >= 256.0) {
					float y = float(${SCREEN_HEIGHT}) - gl_FragCoord.y;
					// 2 colors (8 float values) per matrix
					transformationMatrix = readLinescrollBuffer(int(vOtherInfo.x) - 256, int(y * 2.0));
				}
				else {
					transformationMatrix = vTransformationMatrix;
				}
							
				vec2 texCoord = (transformationMatrix * vec3(vTextureCoord.x, vTextureCoord.y, 1)).xy;
				int mapX = intDiv(texCoord.x, vTileSize.x), mapY = intDiv(texCoord.y, vTileSize.y);
				
				// Out of bounds?
				if (vOtherInfo.y < 1.0 && (mapX < 0 || mapY < 0 || mapX >= int(vMapSize.x) || mapY >= int(vMapSize.y))) {
					discard;
				}
				
				int mapTileNo = readMap(mapX, mapY);
				// Note: it's voluntarily done here, so that you may still force draw the tile 0 by using a palette offset (could be useful for sprites as a BG)
				if (mapTileNo < 1) discard;

				// Bits 12-15: palette No
				int palOfs = mapTileNo / ${1 << 12};
				float paletteOffset = float(palOfs);
				mapTileNo -= palOfs * ${1 << 12};

				// Position of tile no in sprite texture, now we need to add the offset
				vec2 tilesetPos = positionInTexture(mapTileNo)
					+ vec2(mod(texCoord.x, vTileSize.x), mod(texCoord.y, vTileSize.y));
				float texel;

				if (vPaletteNo >= ${PALETTE_HICOLOR_FLAG}.0) {
					texel = readTexel8(tilesetPos.x, tilesetPos.y);
					paletteOffset += (vPaletteNo - ${PALETTE_HICOLOR_FLAG}.0);
				}
				else {
					texel = readTexel4(tilesetPos.x, tilesetPos.y);
					paletteOffset += vPaletteNo;
				}

				// Color zero
				if (texel < ${1.0 / PALETTE_TEX_W}) discard;
				vec4 color = readPalette(texel, paletteOffset / ${PALETTE_TEX_H}.0);
				gl_FragColor = ${makeOutputColor('color')};
			}
		`;

	const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
	const TOTAL_VERTICES = MAX_BGS * 6;
	vdp.mapProgram = {
		program: shaderProgram,
		attribLocations: {
			xyzp: gl.getAttribLocation(shaderProgram, 'aXyzp'),
			mapInfo1: gl.getAttribLocation(shaderProgram, 'aMapInfo1'),
			mapInfo2: gl.getAttribLocation(shaderProgram, 'aMapInfo2'),
			mapInfo3: gl.getAttribLocation(shaderProgram, 'aMapInfo3'),
			mapInfo4: gl.getAttribLocation(shaderProgram, 'aMapInfo4')
		},
		glBuffers: {
			xyzp: makeBuffer(gl, TOTAL_VERTICES * 4),
			mapInfo1: makeBuffer(gl, TOTAL_VERTICES * 4),
			mapInfo2: makeBuffer(gl, TOTAL_VERTICES * 4),
			mapInfo3: makeBuffer(gl, TOTAL_VERTICES * 4),
			mapInfo4: makeBuffer(gl, TOTAL_VERTICES * 4)
		},
		uniformLocations: {
			envColor: gl.getUniformLocation(shaderProgram, 'uEnvColor'),
			projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
			modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
			uSamplerMaps: gl.getUniformLocation(shaderProgram, 'uSamplerMaps'),
			uSamplerSprites: gl.getUniformLocation(shaderProgram, 'uSamplerSprites'),
			uSamplerPalettes: gl.getUniformLocation(shaderProgram, 'uSamplerPalettes'),
			uSamplerOthers: gl.getUniformLocation(shaderProgram, 'uSamplerOthers'),
		},
	};
}

export function drawMap(vdp, uMap, vMap, uTileset, vTileset, mapWidth, mapHeight, tilesetWidth, tileWidth, tileHeight, winX, winY, winW, winH, scrollX, scrollY, palNo, hiColor, linescrollBuffer = -1, wrap = 1, z = 0) {
	drawPendingObj(vdp);

	const gl = vdp.gl;
	const prog = vdp.mapProgram;

	// Remove the + win* to start the map at the window instead of continuing it
	scrollX = Math.floor(scrollX) + winX;
	scrollY = Math.floor(scrollY) + winY;

	tilesetWidth = Math.floor(tilesetWidth / tileWidth);
	if (hiColor) palNo |= PALETTE_HICOLOR_FLAG;

	// x, y position, z for normal-prio tiles, base palette no
	const positions = [
		winX, winY, z, palNo,
		winX + winW, winY, z, palNo,
		winX, winY + winH, z, palNo,
		winX + winW, winY + winH, z, palNo,
	];
	// u, v map base, u, v tileset base
	const infos1 = [
		uMap, vMap, uTileset, vTileset,
		uMap, vMap, uTileset, vTileset,
		uMap, vMap, uTileset, vTileset,
		uMap, vMap, uTileset, vTileset
	];
	// map width, map height, tileset width, z for hi-prio tiles
	const infos2 = [
		mapWidth, mapHeight, tilesetWidth, 0,
		mapWidth, mapHeight, tilesetWidth, 0,
		mapWidth, mapHeight, tilesetWidth, 0,
		mapWidth, mapHeight, tilesetWidth, 0
	];
	// tile width, tile height, drawing uv
	const infos3 = [
		tileWidth, tileHeight, scrollX, scrollY,
		tileWidth, tileHeight, scrollX + winW, scrollY,
		tileWidth, tileHeight, scrollX, scrollY + winH,
		tileWidth, tileHeight, scrollX + winW, scrollY + winH
	];
	// linescroll buffer (row no in otherTexture), whether to wrap around map size (0=off, 1=on)
	const infos4 = [
		linescrollBuffer, wrap, 0, 0,
		linescrollBuffer, wrap, 0, 0,
		linescrollBuffer, wrap, 0, 0,
		linescrollBuffer, wrap, 0, 0
	];

	gl.bindBuffer(gl.ARRAY_BUFFER, prog.glBuffers.xyzp);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STREAM_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, prog.glBuffers.mapInfo1);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(infos1), gl.STREAM_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, prog.glBuffers.mapInfo2);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(infos2), gl.STREAM_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, prog.glBuffers.mapInfo3);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(infos3), gl.STREAM_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, prog.glBuffers.mapInfo4);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(infos4), gl.STREAM_DRAW);

	gl.useProgram(prog.program);
	{
		const numComponents = 4;  // pull out 4 values per iteration
		const type = gl.FLOAT;    // the data in the buffer is 32bit floats
		const normalize = false;  // don't normalize
		const stride = 0;         // how many bytes to get from one set of values to the next
															// 0 = use type and numComponents above
		const offset = 0;         // how many bytes inside the buffer to start from
		gl.bindBuffer(gl.ARRAY_BUFFER, prog.glBuffers.xyzp);
		gl.vertexAttribPointer(prog.attribLocations.xyzp, numComponents, type, normalize, stride, offset);
		gl.enableVertexAttribArray(prog.attribLocations.xyzp);
	}
	{
		const num = 4, type = gl.FLOAT, normalize = false, stride = 0, offset = 0;
		gl.bindBuffer(gl.ARRAY_BUFFER, prog.glBuffers.mapInfo1);
		gl.vertexAttribPointer(prog.attribLocations.mapInfo1, num, type, normalize, stride, offset);
		gl.enableVertexAttribArray(prog.attribLocations.mapInfo1);
	}
	{
		const num = 4, type = gl.FLOAT, normalize = false, stride = 0, offset = 0;
		gl.bindBuffer(gl.ARRAY_BUFFER, prog.glBuffers.mapInfo2);
		gl.vertexAttribPointer(prog.attribLocations.mapInfo2, num, type, normalize, stride, offset);
		gl.enableVertexAttribArray(prog.attribLocations.mapInfo2);
	}
	{
		const num = 4, type = gl.FLOAT, normalize = false, stride = 0, offset = 0;
		gl.bindBuffer(gl.ARRAY_BUFFER, prog.glBuffers.mapInfo3);
		gl.vertexAttribPointer(prog.attribLocations.mapInfo3, num, type, normalize, stride, offset);
		gl.enableVertexAttribArray(prog.attribLocations.mapInfo3);
	}
	{
		const num = 4, type = gl.FLOAT, normalize = false, stride = 0, offset = 0;
		gl.bindBuffer(gl.ARRAY_BUFFER, prog.glBuffers.mapInfo4);
		gl.vertexAttribPointer(prog.attribLocations.mapInfo4, num, type, normalize, stride, offset);
		gl.enableVertexAttribArray(prog.attribLocations.mapInfo4);
	}

	// Tell WebGL we want to affect texture unit 0
	gl.activeTexture(gl.TEXTURE0);
	// Bind the texture to texture unit 0
	gl.bindTexture(gl.TEXTURE_2D, vdp.spriteTexture);
	gl.activeTexture(gl.TEXTURE1);
	gl.bindTexture(gl.TEXTURE_2D, vdp.paletteTexture);
	gl.activeTexture(gl.TEXTURE2);
	gl.bindTexture(gl.TEXTURE_2D, vdp.mapTexture);
	gl.activeTexture(gl.TEXTURE3);
	gl.bindTexture(gl.TEXTURE_2D, vdp.otherTexture);

	// Tell the shader we bound the texture to texture unit 0
	gl.uniform1i(prog.uniformLocations.uSamplerSprites, 0);
	gl.uniform1i(prog.uniformLocations.uSamplerPalettes, 1);
	gl.uniform1i(prog.uniformLocations.uSamplerMaps, 2);
	gl.uniform1i(prog.uniformLocations.uSamplerOthers, 3);

	// Set the shader uniforms
	gl.uniformMatrix4fv(prog.uniformLocations.projectionMatrix, false, vdp.projectionMatrix);
	gl.uniformMatrix4fv(prog.uniformLocations.modelViewMatrix,false, vdp.modelViewMatrix);

	gl.uniform4f(prog.uniformLocations.envColor, envColor[0], envColor[1], envColor[2], envColor[3]);

	{
		const offset = 0;
		const vertexCount = 4;
		gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
	}
}
