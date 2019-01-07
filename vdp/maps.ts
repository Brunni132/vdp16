import {initShaderProgram, makeBuffer, TEMP_MakeDualTriangle} from "./utils";
import {
	colorSwaps,
	declareReadPalette,
	declareReadTexel,
	envColor,
	makeOutputColor,
	MAP_TEX_H,
	MAP_TEX_W,
	OTHER_TEX_H,
	OTHER_TEX_W,
	PALETTE_HICOLOR_FLAG,
	PALETTE_TEX_H,
	PALETTE_TEX_W
} from "./shaders";
import { DEBUG, VDP } from "./vdp";

const BG_BUFFER_STRIDE = 6;

export class MapBuffer {
	name: string;
	xyzp: Float32Array;
	mapInfo1: Float32Array;
	mapInfo2: Float32Array;
	mapInfo3: Float32Array;
	mapInfo4: Float32Array;
	usedVertices: number = 0;
	maxVertices: number;

	constructor(name: string, numVertices: number) {
		this.name = name;
		this.xyzp = new Float32Array(numVertices * 4);
		this.mapInfo1 = new Float32Array(numVertices * 4);
		this.mapInfo2 = new Float32Array(numVertices * 4);
		this.mapInfo3 = new Float32Array(numVertices * 4);
		this.mapInfo4 = new Float32Array(numVertices * 4);
		this.maxVertices = numVertices;
	}

	/**
	 * @returns {number} the index of the first vertice in the arrays (there are `usedVertices` then). Note that you'll
	 * need to multiply by OBJ_BUFFER_STRIDE * <components per entry> to address the arrays.
	 */
	get firstVertice(): number {
		return 	this.maxVertices - this.usedVertices;
	}

	get usedLayers(): number {
		return this.usedVertices / BG_BUFFER_STRIDE;
	}
}

export function initMapShaders(vdp: VDP) {
	const gl = vdp.gl;
	// Vertex shader program
	const vsSource = `
			attribute vec4 aXyzp;
			attribute vec4 aMapInfo1;
			attribute vec4 aMapInfo2;
			attribute vec4 aMapInfo3;
			attribute vec4 aMapInfo4;
			uniform mat3 uModelViewMatrix;
			uniform mat4 uProjectionMatrix;

			varying vec2 vTextureCoord;
			varying float vPaletteNo;
			// TODO Florian -- use vec4 and extract in fragment program
			varying highp vec2 vMapStart;
			varying highp vec2 vMapSize;
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
					first.xy, 0,
					vec2(first.a, second.r), 0,
					second.ba, 1.0);
			}
		
			void main(void) {
				// Only scale the final matrix (we can always say that the VDP supports fixed point math inside for matrix multiplication)
				gl_Position = uProjectionMatrix * vec4(floor(uModelViewMatrix * aXyzp.xyz), 1);
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
			varying highp vec2 vMapStart;
			varying highp vec2 vMapSize;
			// tilesetSize is in tiles!
			varying vec2 vTilesetStart;
			varying float vTilesetWidth;
			varying vec2 vTileSize;
			varying mat3 vTransformationMatrix;
			varying vec2 vOtherInfo;
			
			uniform mat3 uModelViewMatrix;
			uniform vec4 uEnvColor, uColorSwaps;
			uniform sampler2D uSamplerMaps, uSamplerSprites, uSamplerPalettes, uSamplerOthers;

			int intDiv(float x, float y) {
				return int(floor(x / y));
			}

			/**
			 * Returns accurate MOD when arguments are approximate integers.
			 * https://stackoverflow.com/questions/33908644/get-accurate-integer-modulo-in-webgl-shader
			 */
			float modI(float a,float b) {
				float m=a-floor((a+0.5)/b)*b;
				return floor(m+0.5);
			}

			mat3 readLinescrollBuffer(int bufferNo, int horizOffset) {
				float vOfs = float(bufferNo) / ${OTHER_TEX_H}.0;
				vec4 first = texture2D(uSamplerOthers, vec2(float(horizOffset) / ${OTHER_TEX_W}.0, vOfs));
				vec4 second = texture2D(uSamplerOthers, vec2(float(horizOffset + 1) / ${OTHER_TEX_W}.0, vOfs));
				return mat3(
					first.r, first.g, 0,
					first.a, second.r, 0,
					second.b, second.a, 1);
			}
			
			int readMap(int x, int y) {
				x = int(modI(float(x), vMapSize.x) + vMapStart.x);
				y = int(modI(float(y), vMapSize.y) + vMapStart.y);
				
				int texelId = x / 2;
				int texelC = x - texelId * 2;
				vec4 read = texture2D(uSamplerMaps, vec2(float(texelId) / ${MAP_TEX_W}.0, float(y) / ${MAP_TEX_H}.0));
				if (texelC == 0) return int(read.r * 255.0) + int(read.g * 255.0) * 256;
				return int(read.b * 255.0) + int(read.a * 255.0) * 256;
			}
			
			vec2 positionInTexture(int tileNo) {
				vec2 base = vTilesetStart;
				float rowNo = float(tileNo / int(vTilesetWidth));
				float colNo = modI(float(tileNo), vTilesetWidth);
				return base + vec2(colNo * vTileSize.x, rowNo * vTileSize.y);
			}
		
			${declareReadTexel()}
			${declareReadPalette()}
		
			void main(void) {
				mat3 transformationMatrix;
				float y = vTextureCoord.y;
				// Per-line info
				if (vOtherInfo.x >= 256.0) {
					// 2 colors (8 float values) per matrix
					transformationMatrix = readLinescrollBuffer(int(vOtherInfo.x) - 256, int(y) * 2);
					y = 0.0;
				}
				else {
					transformationMatrix = vTransformationMatrix;
				}
				
				vec2 texCoord = floor((transformationMatrix * vec3(vTextureCoord.x, y, 1)).xy);
				int mapX = intDiv(texCoord.x, vTileSize.x), mapY = intDiv(texCoord.y, vTileSize.y);
				
				// Out of bounds?
				if (vOtherInfo.y < 1.0 && (mapX < 0 || mapY < 0 || mapX >= int(vMapSize.x) || mapY >= int(vMapSize.y))) {
					discard;
				}
				
				int mapTileNo = readMap(mapX, mapY);
				// Invisible tile (TODO Florian -- support in the converter)
				if (mapTileNo >= 65535) discard;

				// Bits 12-15: palette No
				int palOfs = mapTileNo / ${1 << 12};
				float paletteOffset = float(palOfs);
				mapTileNo -= palOfs * ${1 << 12};

				// Position of tile no in sprite texture, now we need to add the offset
				vec2 offsetInTile = vec2(int(texCoord.x) - mapX * int(vTileSize.x), int(texCoord.y) - mapY * int(vTileSize.y));
				vec2 tilesetPos = positionInTexture(mapTileNo) + offsetInTile;
				float texel;

				if (vPaletteNo >= ${PALETTE_HICOLOR_FLAG}.0) {
					texel = readTexel8(tilesetPos.x, tilesetPos.y);
					paletteOffset += (vPaletteNo - ${PALETTE_HICOLOR_FLAG}.0);
				}
				else {
					texel = readTexel4(tilesetPos.x, tilesetPos.y);
					paletteOffset += vPaletteNo;
				}

				// if (vTextureCoord.x < 16.0) {
				// 	vec4 color = vec4(0, 0, 0, 1);
				// 	// float ym = mod(float(mapY), vMapSize.y) + vMapStart.y;
				// 	// color.b = (float(mapY) - ( float(mapY / int(vMapSize.y))) / 2.0;
				// 	int times = intDiv(float(mapY), vMapSize.y - 0.001);
				// 	color.g = modI(float(mapY), vMapSize.y) / 2.0;
				// 	color.b = float(mapY) / 28.0;
				// 	gl_FragColor = color;
				// }
				// else {
					vec4 color = readPalette(texel, paletteOffset / ${PALETTE_TEX_H}.0);
					gl_FragColor = ${makeOutputColor('color')};
				// }
			}
		`;

	const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
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
			xyzp: makeBuffer(gl),
			mapInfo1: makeBuffer(gl),
			mapInfo2: makeBuffer(gl),
			mapInfo3: makeBuffer(gl),
			mapInfo4: makeBuffer(gl)
		},
		uniformLocations: {
			colorSwaps: gl.getUniformLocation(shaderProgram, 'uColorSwaps'),
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

export function drawPendingMap(vdp: VDP, mapBuffer: MapBuffer) {
	if (mapBuffer.usedVertices < 3) return;

	const gl = vdp.gl;
	const prog = vdp.mapProgram;
	const firstVertice = mapBuffer.firstVertice;

	gl.bindBuffer(gl.ARRAY_BUFFER, prog.glBuffers.xyzp);
	gl.bufferData(gl.ARRAY_BUFFER, mapBuffer.xyzp.subarray(firstVertice * 4), gl.STREAM_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, prog.glBuffers.mapInfo1);
	gl.bufferData(gl.ARRAY_BUFFER, mapBuffer.mapInfo1.subarray(firstVertice * 4), gl.STREAM_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, prog.glBuffers.mapInfo2);
	gl.bufferData(gl.ARRAY_BUFFER, mapBuffer.mapInfo2.subarray(firstVertice * 4), gl.STREAM_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, prog.glBuffers.mapInfo3);
	gl.bufferData(gl.ARRAY_BUFFER, mapBuffer.mapInfo3.subarray(firstVertice * 4), gl.STREAM_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, prog.glBuffers.mapInfo4);
	gl.bufferData(gl.ARRAY_BUFFER, mapBuffer.mapInfo4.subarray(firstVertice * 4), gl.STREAM_DRAW);

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
	gl.uniformMatrix3fv(prog.uniformLocations.modelViewMatrix,false, vdp.modelViewMatrix);

	gl.uniform4f(prog.uniformLocations.envColor, envColor[0], envColor[1], envColor[2], envColor[3]);
	gl.uniform4f(prog.uniformLocations.colorSwaps, colorSwaps[0], colorSwaps[1], colorSwaps[2], colorSwaps[3]);

	gl.drawArrays(gl.TRIANGLES, 0, mapBuffer.usedVertices);

	mapBuffer.usedVertices = 0;
}

export function enqueueMap(mapBuffer: MapBuffer, uMap: number, vMap: number, uTileset: number, vTileset: number, mapWidth: number, mapHeight: number, tilesetWidth: number, tileWidth: number, tileHeight: number, winX: number, winY: number, winW: number, winH: number, scrollX: number, scrollY: number, palNo: number, hiColor: boolean, linescrollBuffer: number = -1, wrap: number = 1, z: number = 0) {

	// Remove the + win* to start the map at the window instead of continuing it
	scrollX += winX;
	scrollY += winY;

	tilesetWidth = Math.floor(tilesetWidth / tileWidth);
	if (hiColor) palNo |= PALETTE_HICOLOR_FLAG;

	if (mapBuffer.usedVertices >= mapBuffer.maxVertices) {
		if (DEBUG) console.log(`${mapBuffer.name} overuse (max ${mapBuffer.maxVertices / BG_BUFFER_STRIDE}), ignoring drawBG`);
		return;
	}
	mapBuffer.usedVertices += BG_BUFFER_STRIDE;
	const firstVertice = mapBuffer.firstVertice;

	// x, y position, z for normal-prio tiles, base palette no
	mapBuffer.xyzp.set(TEMP_MakeDualTriangle([
		winX, winY, z, palNo,
		winX + winW, winY, z, palNo,
		winX, winY + winH, z, palNo,
		winX + winW, winY + winH, z, palNo,
	], 4), 4 * firstVertice);
	// u, v map base, u, v tileset base
	mapBuffer.mapInfo1.set(TEMP_MakeDualTriangle([
		uMap, vMap, uTileset, vTileset,
		uMap, vMap, uTileset, vTileset,
		uMap, vMap, uTileset, vTileset,
		uMap, vMap, uTileset, vTileset
	], 4), 4 * firstVertice);
	// map width, map height, tileset width, z for hi-prio tiles
	mapBuffer.mapInfo2.set(TEMP_MakeDualTriangle([
		mapWidth, mapHeight, tilesetWidth, 0,
		mapWidth, mapHeight, tilesetWidth, 0,
		mapWidth, mapHeight, tilesetWidth, 0,
		mapWidth, mapHeight, tilesetWidth, 0
	], 4), 4 * firstVertice);
	// tile width, tile height, drawing uv
	mapBuffer.mapInfo3.set(TEMP_MakeDualTriangle([
		tileWidth, tileHeight, scrollX, scrollY,
		tileWidth, tileHeight, scrollX + winW, scrollY,
		tileWidth, tileHeight, scrollX, scrollY + winH,
		tileWidth, tileHeight, scrollX + winW, scrollY + winH
	], 4), 4 * firstVertice);
	// linescroll buffer (row no in otherTexture), whether to wrap around map size (0=off, 1=on)
	mapBuffer.mapInfo4.set(TEMP_MakeDualTriangle([
		linescrollBuffer, wrap, 0, 0,
		linescrollBuffer, wrap, 0, 0,
		linescrollBuffer, wrap, 0, 0,
		linescrollBuffer, wrap, 0, 0
	], 4), 4 * firstVertice);
}

/**
 * @param name {string} for debugging
 * @param numMaps {number} number of maps that may be contained (batched) inside the map buffer.
 * @returns {MapBuffer}
 */
export function makeMapBuffer(name: string, numMaps: number): MapBuffer {
	return new MapBuffer(name, numMaps * BG_BUFFER_STRIDE);
}
