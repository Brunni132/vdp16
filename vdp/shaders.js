import {initShaderProgram} from "./utils";

const SCREEN_WIDTH = 320, SCREEN_HEIGHT = 240;
const SPRITE_TEX_W = 1024, SPRITE_TEX_H = 1024;
const PALETTE_TEX_W = 256, PALETTE_TEX_H = 256;

// int readU8(sampler2D sampler, int x) {
// 	int texelXY = int(x / 4);
// 	float texelX = mod(float(texelXY), 1024.0) / 1023.0;
// 	float texelY = float(texelXY / 1024) / 1023.0;
// 	vec4 read = texture2D(sampler, vec2(texelX, texelY));
// 	int texelC = x - texelXY * 4;
// 	if (texelC == 0) return int(read.r * 255.0);
// 	if (texelC == 1) return int(read.g * 255.0);
// 	if (texelC == 2) return int(read.b * 255.0);
// 	return int(read.a * 255.0);
// }
//
// int readU16(sampler2D sampler, int x) {
// 	int texelXY = int(x / 2);
// 	float texelX = mod(float(texelXY), 1024.0) / 1023.0;
// 	float texelY = float(texelXY / 1024) / 1023.0;
// 	vec4 read = texture2D(sampler, vec2(texelX, texelY));
// 	int texelC = x - texelXY * 2;
// 	if (texelC == 0) return int(read.r * 255.0) + 256 * int(read.g * 255.0);
// 	return int(read.b * 255.0) + 256 * int(read.a * 255.0);
// }

export function initSpriteShaders(vdp) {
	const gl = vdp.gl;
	// Vertex shader program
	const vsSource = `
			// The 3 first are the vertex position, the 4th is the palette ID
			attribute vec4 aVertexPosition;
			// The 2 first are the texture position
			attribute vec2 aTextureCoord;
	
			uniform mat4 uModelViewMatrix;
			uniform mat4 uProjectionMatrix;
	
			varying highp vec2 vTextureCoord;
			varying highp float vPaletteNo;
			uniform sampler2D uSamplerSprites, uSamplerPalettes;
		
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
			vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
			textureCoord: gl.getAttribLocation(shaderProgram, 'aTextureCoord'),
		},
		uniformLocations: {
			projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
			modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
			uSamplerSprites: gl.getUniformLocation(shaderProgram, 'uSamplerSprites'),
			uSamplerPalettes: gl.getUniformLocation(shaderProgram, 'uSamplerPalettes'),
		},
	};
}
