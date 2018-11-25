import {initShaderProgram} from "./utils";

// TODO Florian -- Move to shaders.js
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
				gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition.xyz, 1);
				vPaletteNo = (aVertexPosition.w / ${PALETTE_TEX_H - 1}.0);
				vTextureCoord = aTextureCoord;
			}
		`;
	const fsSource = `
			precision highp float;
			
			varying highp vec2 vTextureCoord;
			varying highp float vPaletteNo;
			uniform sampler2D uSamplerSprites, uSamplerPalettes;
	
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
				// mediump float x = gl_FragCoord.x, y = float(${SCREEN_HEIGHT}) - gl_FragCoord.y;
				// gl_FragColor = texture2D(uSampler0, vTextureCoord) * vec4(x / float(${SCREEN_WIDTH}), y / float(${SCREEN_HEIGHT}), 0, 1);
				
				float texel = readTexel(vTextureCoord.x, vTextureCoord.y);
				gl_FragColor = readPalette(texel, vPaletteNo);
			}
		`;

	const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
	vdp.spriteProgram = {
		program: shaderProgram,
		attribLocations: {
			xyzp: gl.getAttribLocation(shaderProgram, 'aXyzp'),
			mapInfo1: gl.getAttribLocation(shaderProgram, 'aMapInfo1'),
			mapInfo2: gl.getAttribLocation(shaderProgram, 'aMapInfo2'),
			mapInfo3: gl.getAttribLocation(shaderProgram, 'aMapInfo3'),
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
