import {initShaderProgram, makeBuffer} from "./utils";
import {
	MAP_TEX_H, MAP_TEX_W, OTHER_TEX_H, OTHER_TEX_W,
	PALETTE_TEX_H,
	PALETTE_TEX_W,
	SCREEN_HEIGHT,
	SCREEN_WIDTH,
	SPRITE_TEX_H,
	SPRITE_TEX_W
} from "./shaders";

const MAX_BGS = 8;

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
			varying float vTilesetWidth, vHighPrioTileZ;
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
				gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aXyzp.xyz, 1);
				vPaletteNo = (aXyzp.w / ${PALETTE_TEX_H}.0);
				vMapStart = aMapInfo1.xy;
				vTilesetStart = aMapInfo1.zw;
				vMapSize = aMapInfo2.xy;
				vTilesetWidth = aMapInfo2.z;
				vHighPrioTileZ = aMapInfo2.w;
				vTileSize = aMapInfo3.xy;
				vTextureCoord = aMapInfo3.zw;
				vOtherInfo = aMapInfo4.xy;
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
			varying float vTilesetWidth, vHighPrioTileZ;
			varying vec2 vTileSize;
			varying mat3 vTransformationMatrix;
			varying vec2 vOtherInfo;
			
			uniform mat4 uModelViewMatrix;
			uniform sampler2D uSamplerMaps, uSamplerSprites, uSamplerPalettes, uSamplerOthers;
			
			int intMod(int x, int y) {
				return int(mod(float(x), float(y)));
			}
			
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
	
			// Returns a value between 0 and 1, ready to map a color in palette (0..255)
			float readTexel(float x, float y) {
				int texelId = int(x / 4.0);
				vec4 read = texture2D(uSamplerSprites, vec2(float(texelId) / ${SPRITE_TEX_W}.0, y / ${SPRITE_TEX_H}.0));
				int texelC = int(x) - texelId * 4;
				if (texelC == 0) return read.r * float(${255.0 / 256.0 * PALETTE_TEX_W / 256.0});
				if (texelC == 1) return read.g * float(${255.0 / 256.0 * PALETTE_TEX_W / 256.0});
				if (texelC == 2) return read.b * float(${255.0 / 256.0 * PALETTE_TEX_W / 256.0});
				return read.a * float(${255.0 / 256.0 * PALETTE_TEX_W / 256.0});
			}
			
			vec4 readPalette(float x, float y) {
				return texture2D(uSamplerPalettes, vec2(x, y));
			}
		
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

				// Position of tile no in sprite texture, now we need to add the offset
				vec2 tilesetPos = positionInTexture(mapTileNo)
					+ vec2(mod(texCoord.x, vTileSize.x), mod(texCoord.y, vTileSize.y));
				float texel = readTexel(tilesetPos.x, tilesetPos.y);

				// Color zero
				if (texel < ${1.0 / PALETTE_TEX_W}) discard;
				gl_FragColor = readPalette(texel, vPaletteNo);
			}
		`;

	const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
	const TOTAL_VERTICES = MAX_BGS * 4;
	vdp.mapProgram = {
		program: shaderProgram,
		attribLocations: {
			xyzp: gl.getAttribLocation(shaderProgram, 'aXyzp'),
			mapInfo1: gl.getAttribLocation(shaderProgram, 'aMapInfo1'),
			mapInfo2: gl.getAttribLocation(shaderProgram, 'aMapInfo2'),
			mapInfo3: gl.getAttribLocation(shaderProgram, 'aMapInfo3'),
			mapInfo4: gl.getAttribLocation(shaderProgram, 'aMapInfo4')
		},
		buffers: {
			xyzp: makeBuffer(gl, TOTAL_VERTICES * 4),
			mapInfo1: makeBuffer(gl, TOTAL_VERTICES * 4),
			mapInfo2: makeBuffer(gl, TOTAL_VERTICES * 4),
			mapInfo3: makeBuffer(gl, TOTAL_VERTICES * 4),
			mapInfo4: makeBuffer(gl, TOTAL_VERTICES * 4)
		},
		uniformLocations: {
			projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
			modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
			uSamplerMaps: gl.getUniformLocation(shaderProgram, 'uSamplerMaps'),
			uSamplerSprites: gl.getUniformLocation(shaderProgram, 'uSamplerSprites'),
			uSamplerPalettes: gl.getUniformLocation(shaderProgram, 'uSamplerPalettes'),
			uSamplerOthers: gl.getUniformLocation(shaderProgram, 'uSamplerOthers'),
		},
	};
}

export function drawMap(vdp, uMap, vMap, uTileset, vTileset, mapWidth, mapHeight, tilesetWidth, tilesetHeight, tileWidth, tileHeight, palNo, linescrollBuffer) {
	const gl = vdp.gl;
	const prog = vdp.mapProgram;

	// x, y position, z for normal-prio tiles, base palette no
	const positions = [
		0, 0, 0, palNo,
		SCREEN_WIDTH, 0, 0, palNo,
		0, SCREEN_HEIGHT, 0, palNo,
		SCREEN_WIDTH, SCREEN_HEIGHT, 0, palNo,
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
		tileWidth, tileHeight, 0, 0,
		tileWidth, tileHeight, SCREEN_WIDTH, 0,
		tileWidth, tileHeight, 0, SCREEN_HEIGHT,
		tileWidth, tileHeight, SCREEN_WIDTH, SCREEN_HEIGHT
	];
	// linescroll buffer (row no in otherTexture), whether to wrap around map size (0=off, 1=on)
	const wrap = 0;
	const infos4 = [
		linescrollBuffer, wrap, 0, 0,
		linescrollBuffer, wrap, 0, 0,
		linescrollBuffer, wrap, 0, 0,
		linescrollBuffer, wrap, 0, 0
	];

	gl.bindBuffer(gl.ARRAY_BUFFER, prog.buffers.xyzp);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, prog.buffers.mapInfo1);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(infos1), gl.STATIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, prog.buffers.mapInfo2);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(infos2), gl.STATIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, prog.buffers.mapInfo3);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(infos3), gl.STATIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, prog.buffers.mapInfo4);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(infos4), gl.STATIC_DRAW);

	gl.useProgram(prog.program);
	{
		const numComponents = 4;  // pull out 4 values per iteration
		const type = gl.FLOAT;    // the data in the buffer is 32bit floats
		const normalize = false;  // don't normalize
		const stride = 0;         // how many bytes to get from one set of values to the next
															// 0 = use type and numComponents above
		const offset = 0;         // how many bytes inside the buffer to start from
		gl.bindBuffer(gl.ARRAY_BUFFER, prog.buffers.xyzp);
		gl.vertexAttribPointer(prog.attribLocations.xyzp, numComponents, type, normalize, stride, offset);
		gl.enableVertexAttribArray(prog.attribLocations.xyzp);
	}
	{
		const num = 4, type = gl.FLOAT, normalize = false, stride = 0, offset = 0;
		gl.bindBuffer(gl.ARRAY_BUFFER, prog.buffers.mapInfo1);
		gl.vertexAttribPointer(prog.attribLocations.mapInfo1, num, type, normalize, stride, offset);
		gl.enableVertexAttribArray(prog.attribLocations.mapInfo1);
	}
	{
		const num = 4, type = gl.FLOAT, normalize = false, stride = 0, offset = 0;
		gl.bindBuffer(gl.ARRAY_BUFFER, prog.buffers.mapInfo2);
		gl.vertexAttribPointer(prog.attribLocations.mapInfo2, num, type, normalize, stride, offset);
		gl.enableVertexAttribArray(prog.attribLocations.mapInfo2);
	}
	{
		const num = 4, type = gl.FLOAT, normalize = false, stride = 0, offset = 0;
		gl.bindBuffer(gl.ARRAY_BUFFER, prog.buffers.mapInfo3);
		gl.vertexAttribPointer(prog.attribLocations.mapInfo3, num, type, normalize, stride, offset);
		gl.enableVertexAttribArray(prog.attribLocations.mapInfo3);
	}
	{
		const num = 4, type = gl.FLOAT, normalize = false, stride = 0, offset = 0;
		gl.bindBuffer(gl.ARRAY_BUFFER, prog.buffers.mapInfo4);
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

	{
		const offset = 0;
		const vertexCount = 4;
		gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
	}
}
