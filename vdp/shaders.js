import {initShaderProgram} from "./utils";

export function initSpriteShaders(vdp) {
	const gl = vdp.gl;
	const screenWidth = 320, screenHeight = 240;
	// Vertex shader program
	const vsSource = `
			// The 3 first are the vertex position, the 4th is the line buffer ID
			attribute vec4 aVertexPosition;
			// The 2 first are the texture position
			attribute vec2 aTextureCoord;
	
			uniform mat4 uModelViewMatrix;
			uniform mat4 uProjectionMatrix;
	
			varying highp vec2 vTextureCoord;
			uniform sampler2D uSamplerSprites, uSamplerPalettes;
		
			// int readU8(sampler2D sampler, int x) {
			// 	int texelXY = int(x / 4);
			// 	float texelX = mod(float(texelXY), 1024.0) / 1023.0;
			// 	float texelY = float(texelXY / 1024) / 1024.0;
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
			// 	float texelY = float(texelXY / 1024) / 1024.0;
			// 	vec4 read = texture2D(sampler, vec2(texelX, texelY));
			// 	int texelC = x - texelXY * 2;
			// 	if (texelC == 0) return int(read.r * 255.0) + 256 * int(read.g * 255.0);
			// 	return int(read.b * 255.0) + 256 * int(read.a * 255.0);
			// }
		
			void main(void) {
				// highp int xPos = int(texture2D(uSampler1, vec2(0, 0))[3] * 255.0);
				// int xPos = readU16(uSampler1, 2);
				// float xPos = texture2D(uSampler1, vec2(1.0 / 1023.0, 0))[2] * 255.0;
				// gl_Position = uProjectionMatrix * uModelViewMatrix * (aVertexPosition + vec4(xPos, 0, 0, 0));
				gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
				vTextureCoord = aTextureCoord;
			}
		`;
	const fsSource = `
			precision highp float;
			
			varying highp vec2 vTextureCoord;
			uniform sampler2D uSamplerSprites, uSamplerPalettes;
	
			// Returns a value between 0 and 1, ready to map a color in palette (0..255)
			float readTexel(float x, float y) {
				int texelId = int(x / 4.0);
				vec4 read = texture2D(uSamplerSprites, vec2(float(texelId), y));
				int texelC = int(x) - texelId * 4;
				if (texelC == 0) return read.r;
				if (texelC == 1) return read.g;
				if (texelC == 2) return read.b;
				return read.a;
			}
			
			vec4 readPalette(float x, float y) {
				return texture2D(uSamplerPalettes, vec2(x, y));
			}
		
			void main(void) {
				// mediump float x = gl_FragCoord.x, y = float(${screenHeight}) - gl_FragCoord.y;
				// gl_FragColor = texture2D(uSampler0, vTextureCoord) * vec4(x / float(${screenWidth}), y / float(${screenHeight}), 0, 1);
				
				gl_FragColor = readPalette(readTexel(vTextureCoord.x, vTextureCoord.y), 0.0);
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
			uSampler0: gl.getUniformLocation(shaderProgram, 'uSamplerSprites'),
			uSampler1: gl.getUniformLocation(shaderProgram, 'uSamplerPalettes'),
		},
	};
}
