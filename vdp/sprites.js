import {initShaderProgram, makeBuffer} from "./utils";
import {
	declareReadPalette,
	declareReadTexel, PALETTE_HICOLOR_FLAG,
	PALETTE_TEX_H,
	PALETTE_TEX_W
} from "./shaders";

const MAX_SPRITES = 128;

export function initSpriteShaders(vdp) {
	const gl = vdp.gl;
	// Vertex shader program
	const vsSource = `
			// The 3 first are the vertex position, the 4th is the palette ID
			attribute vec4 aXyzp;
			// The 2 first are the texture position
			attribute vec2 aUv;
	
			uniform mat4 uModelViewMatrix;
			uniform mat4 uProjectionMatrix;
	
			varying highp vec2 vTextureCoord;
			varying highp float vPaletteNo;
			uniform sampler2D uSamplerSprites, uSamplerPalettes;
		
			void main(void) {
				gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aXyzp.xyz, 1);
				vPaletteNo = aXyzp.w;
				vTextureCoord = aUv;
			}
		`;
	const fsSource = `
			precision highp float;
			
			varying highp vec2 vTextureCoord;
			varying highp float vPaletteNo;
			uniform sampler2D uSamplerSprites, uSamplerPalettes;
	
			${declareReadTexel()}
			${declareReadPalette()}
		
			void main(void) {
				float texel, palette;
				if (vPaletteNo >= ${PALETTE_HICOLOR_FLAG}.0) {
					texel = readTexel8(vTextureCoord.x, vTextureCoord.y);
					palette = (vPaletteNo - ${PALETTE_HICOLOR_FLAG}.0) / ${PALETTE_TEX_H}.0;
				}
				else {
					texel = readTexel4(vTextureCoord.x, vTextureCoord.y);
					palette = vPaletteNo / ${PALETTE_TEX_H}.0;
				}

				// Color zero
				if (texel < ${1.0 / (PALETTE_TEX_W)}) discard;
				gl_FragColor = readPalette(texel, palette);
			}
		`;

	const TOTAL_VERTICES = MAX_SPRITES * 4;
	const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

	vdp.spriteProgram = {
		program: shaderProgram,
		arrayBuffers: {
			xyzp: new Float32Array(TOTAL_VERTICES * 4),
			uv: new Float32Array(TOTAL_VERTICES * 2)
		},
		attribLocations: {
			xyzp: gl.getAttribLocation(shaderProgram, 'aXyzp'),
			uv: gl.getAttribLocation(shaderProgram, 'aUv'),
		},
		buffers: {
			xyzp: makeBuffer(gl, TOTAL_VERTICES * 4),
			uv: makeBuffer(gl, TOTAL_VERTICES * 2)
		},
		uniformLocations: {
			projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
			modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
			uSamplerSprites: gl.getUniformLocation(shaderProgram, 'uSamplerSprites'),
			uSamplerPalettes: gl.getUniformLocation(shaderProgram, 'uSamplerPalettes'),
		},
	};
}

export function drawSprite(vdp, xStart, yStart, xEnd, yEnd, uStart, vStart, uEnd, vEnd, palNo, hiColor) {
	xStart = Math.floor(xStart);
	yStart = Math.floor(yStart);
	xEnd = Math.floor(xEnd);
	yEnd = Math.floor(yEnd);
	uStart = Math.floor(uStart);
	vStart = Math.floor(vStart);
	uEnd = Math.floor(uEnd);
	vEnd = Math.floor(vEnd);

	if (hiColor) palNo |= PALETTE_HICOLOR_FLAG;

	const gl = vdp.gl;
	const prog = vdp.spriteProgram;
	const positions = [
		xStart, yStart, 0, palNo,
		xEnd, yStart, 0, palNo,
		xStart, yEnd, 0, palNo,
		xEnd, yEnd, 0, palNo,
	];

	const textureCoordinates = [
		uStart, vStart,
		uEnd, vStart,
		uStart, vEnd,
		uEnd, vEnd,
	];

	// TODO Florian -- batching, reuse the array instead of creating a new one
	// TODO Florian -- try STREAM_DRAW
	gl.bindBuffer(gl.ARRAY_BUFFER, prog.buffers.xyzp);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, prog.buffers.uv);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW);

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
		const num = 2, type = gl.FLOAT, normalize = false, stride = 0, offset = 0;
		gl.bindBuffer(gl.ARRAY_BUFFER, prog.buffers.uv);
		gl.vertexAttribPointer(prog.attribLocations.uv, num, type, normalize, stride, offset);
		gl.enableVertexAttribArray(prog.attribLocations.uv);
	}

	// Tell WebGL we want to affect texture unit 0
	gl.activeTexture(gl.TEXTURE0);
	// Bind the texture to texture unit 0
	gl.bindTexture(gl.TEXTURE_2D, vdp.spriteTexture);
	gl.activeTexture(gl.TEXTURE1);
	gl.bindTexture(gl.TEXTURE_2D, vdp.paletteTexture);

	// Tell the shader we bound the texture to texture unit 0
	gl.uniform1i(prog.uniformLocations.uSamplerSprites, 0);
	gl.uniform1i(prog.uniformLocations.uSamplerPalettes, 1);

	// Set the shader uniforms
	gl.uniformMatrix4fv(prog.uniformLocations.projectionMatrix, false, vdp.projectionMatrix);
	gl.uniformMatrix4fv(prog.uniformLocations.modelViewMatrix,false, vdp.modelViewMatrix);

	{
		const offset = 0;
		const vertexCount = 4;
		gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
	}
}
