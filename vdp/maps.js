import {initShaderProgram, makeBuffer} from "./utils";
import {PALETTE_TEX_H, PALETTE_TEX_W, SCREEN_HEIGHT, SCREEN_WIDTH, SPRITE_TEX_H, SPRITE_TEX_W} from "./shaders";

const MAX_BGS = 8;

export function initMapShaders(vdp) {
	const gl = vdp.gl;
	// Vertex shader program
	const vsSource = `
			attribute vec4 aXyzp, aMapInfo1, aMapInfo2, aMapInfo3;
			uniform mat4 uModelViewMatrix, uProjectionMatrix;
	
			varying vec2 vTextureCoord;
			varying float vPaletteNo;
			// TODO Florian -- use vec4 and extract in fragment program
			varying vec2 vMapStart, vMapSize;
			varying vec2 vTilesetStart, vTilesetSize;
			varying vec2 vTileSize;
			
			uniform sampler2D uSamplerMaps, uSamplerSprites, uSamplerPalettes;
		
			void main(void) {
				gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aXyzp.xyz, 1);
				vPaletteNo = (aXyzp.w / ${PALETTE_TEX_H - 1}.0);
				vTextureCoord = aMapInfo3.zw;
			}
		`;
	const fsSource = `
			precision highp float;
			
			varying highp vec2 vTextureCoord;
			varying highp float vPaletteNo;
			varying vec2 vMapStart, vMapSize;
			varying vec2 vTilesetStart, vTilesetSize;
			varying vec2 vTileSize;
			uniform sampler2D uSamplerMaps, uSamplerSprites, uSamplerPalettes;
			
			float readMap(float x, float y) {
				return 0;
			}
	
			// Returns a value between 0 and 1, ready to map a color in palette (0..255)
			float readTexel(float x, float y) {
				int texelId = int(x / 4.0);
				vec4 read = texture2D(uSamplerSprites, vec2(float(texelId) / ${SPRITE_TEX_W - 1}.0, y / ${SPRITE_TEX_H - 1}.0));
				int texelC = int(x) - texelId * 4;
				if (texelC == 0) return read.r * float(${PALETTE_TEX_W / 256.0});
				if (texelC == 1) return read.g * float(${PALETTE_TEX_W / 256.0});
				if (texelC == 2) return read.b * float(${PALETTE_TEX_W / 256.0});
				return read.a * float(${PALETTE_TEX_W / 256.0});
			}
			
			vec4 readPalette(float x, float y) {
				return texture2D(uSamplerPalettes, vec2(x, y));
			}
		
			void main(void) {
				float mapTile = readMap(vTextureCoord.x, vTextureCoord.y);
				
				float texel = readTexel(vTextureCoord.x, vTextureCoord.y);
				
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
		},
		buffers: {
			xyzp: makeBuffer(gl, TOTAL_VERTICES * 4),
			mapInfo1: makeBuffer(gl, TOTAL_VERTICES * 4),
			mapInfo2: makeBuffer(gl, TOTAL_VERTICES * 4),
			mapInfo3: makeBuffer(gl, TOTAL_VERTICES * 4)
		},
		uniformLocations: {
			projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
			modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
			uSamplerMaps: gl.getUniformLocation(shaderProgram, 'uSamplerMaps'),
			uSamplerSprites: gl.getUniformLocation(shaderProgram, 'uSamplerSprites'),
			uSamplerPalettes: gl.getUniformLocation(shaderProgram, 'uSamplerPalettes'),
		},
	};
}

export function drawMap(vdp, uMap, vMap, uTileset, vTileset, mapWidth, mapHeight, tilesetWidth, tilesetHeight, tileWidth, tileHeight, palNo) {
	const gl = vdp.gl;
	const prog = vdp.mapProgram;

	// x, y position, base z, base palette no
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
	// map width, map height, tileset width, tileset height
	const infos2 = [
		mapWidth, mapHeight, tilesetWidth, tilesetHeight,
		mapWidth, mapHeight, tilesetWidth, tilesetHeight,
		mapWidth, mapHeight, tilesetWidth, tilesetHeight,
		mapWidth, mapHeight, tilesetWidth, tilesetHeight
	];
	// tile width, tile height, drawing uv
	const infos3 = [
		tileWidth, tileHeight, 0, 0,
		tileWidth, tileHeight, 1, 0,
		tileWidth, tileHeight, 0, 1,
		tileWidth, tileHeight, 1, 1
	];

	gl.bindBuffer(gl.ARRAY_BUFFER, prog.buffers.xyzp);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, prog.buffers.mapInfo1);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(infos1), gl.STATIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, prog.buffers.mapInfo2);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(infos2), gl.STATIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, prog.buffers.mapInfo3);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(infos3), gl.STATIC_DRAW);

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

	// Tell WebGL we want to affect texture unit 0
	gl.activeTexture(gl.TEXTURE0);
	// Bind the texture to texture unit 0
	gl.bindTexture(gl.TEXTURE_2D, vdp.spriteTexture);
	gl.activeTexture(gl.TEXTURE1);
	gl.bindTexture(gl.TEXTURE_2D, vdp.paletteTexture);
	gl.activeTexture(gl.TEXTURE2);
	gl.bindTexture(gl.TEXTURE_2D, vdp.mapTexture);

	// Tell the shader we bound the texture to texture unit 0
	gl.uniform1i(prog.uniformLocations.uSamplerSprites, 0);
	gl.uniform1i(prog.uniformLocations.uSamplerPalettes, 1);
	gl.uniform1i(prog.uniformLocations.uSamplerMaps, 2);

	// Set the shader uniforms
	gl.uniformMatrix4fv(prog.uniformLocations.projectionMatrix, false, vdp.projectionMatrix);
	gl.uniformMatrix4fv(prog.uniformLocations.modelViewMatrix,false, vdp.modelViewMatrix);

	{
		const offset = 0;
		const vertexCount = 4;
		gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
	}
}
