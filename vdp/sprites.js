import {initShaderProgram, makeBuffer} from "./utils";
import {
	declareReadPalette,
	declareReadTexel, MAX_SPRITES, PALETTE_HICOLOR_FLAG,
	PALETTE_TEX_H,
	PALETTE_TEX_W
} from "./shaders";

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
				gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(floor(aXyzp.xyz), 1);
				vPaletteNo = aXyzp.w;
				vTextureCoord = floor(aUv);
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

	// TODO Florian -- Use indexed VAOs
	const TOTAL_VERTICES = MAX_SPRITES * 6;
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
		glBuffers: {
			xyzp: makeBuffer(gl, TOTAL_VERTICES * 4),
			uv: makeBuffer(gl, TOTAL_VERTICES * 2)
		},
		pendingVertices: 0,
		uniformLocations: {
			projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
			modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
			uSamplerSprites: gl.getUniformLocation(shaderProgram, 'uSamplerSprites'),
			uSamplerPalettes: gl.getUniformLocation(shaderProgram, 'uSamplerPalettes'),
		},
	};
}

/**
 * @param vdp {VDP}
 */
export function drawPendingObj(vdp) {
	const prog = vdp.spriteProgram;
	if (prog.pendingVertices < 3) return;

	const gl = vdp.gl;
	// TODO Florian -- does slice make a copy? No need if it does.
	gl.bindBuffer(gl.ARRAY_BUFFER, prog.glBuffers.xyzp);
	gl.bufferData(gl.ARRAY_BUFFER, prog.arrayBuffers.xyzp.slice(0, 4 * prog.pendingVertices), gl.STREAM_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, prog.glBuffers.uv);
	gl.bufferData(gl.ARRAY_BUFFER, prog.arrayBuffers.uv.slice(0, 2 * prog.pendingVertices), gl.STREAM_DRAW);

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
		const num = 2, type = gl.FLOAT, normalize = false, stride = 0, offset = 0;
		gl.bindBuffer(gl.ARRAY_BUFFER, prog.glBuffers.uv);
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

	gl.drawArrays(gl.TRIANGLES, 0, prog.pendingVertices);

	prog.pendingVertices = 0;
}

export function drawObj(vdp, xStart, yStart, xEnd, yEnd, uStart, vStart, uEnd, vEnd, palNo, hiColor, z = 0) {
	if (hiColor) palNo |= PALETTE_HICOLOR_FLAG;

	const gl = vdp.gl;
	const prog = vdp.spriteProgram;

	prog.arrayBuffers.xyzp.set([
		xStart, yStart, z, palNo,
		xEnd, yStart, z, palNo,
		xEnd, yEnd, z, palNo,

		xStart, yStart, z, palNo,
		xEnd, yEnd, z, palNo,
		xStart, yEnd, z, palNo,
	], 4 * prog.pendingVertices);

	prog.arrayBuffers.uv.set([
		uStart, vStart,
		uEnd, vStart,
		uEnd, vEnd,

		uStart, vStart,
		uEnd, vEnd,
		uStart, vEnd,
	], 2 * prog.pendingVertices);

	prog.pendingVertices += 6;

	if (prog.pendingVertices >= MAX_SPRITES * 6) {
		console.log('Too many sprites');
		drawPendingObj(vdp);
	}
}
