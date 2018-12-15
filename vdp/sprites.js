import {initShaderProgram, makeBuffer} from "./utils";
import {
	declareReadPalette,
	declareReadTexel, envColor, makeOutputColor, PALETTE_HICOLOR_FLAG,
	PALETTE_TEX_H,
	PALETTE_TEX_W
} from "./shaders";

class ObjBuffer {
	/**
	 * @param numVertices {number}
	 */
	constructor(numVertices) {
		/** @type {Float32Array} */
		this.xyzp = new Float32Array(numVertices * 4);
		/** @type {Float32Array} */
		this.uv = new Float32Array(numVertices * 2);
		/** @type {number} */
		this.usedVertices = 0;
		/** @type {number} */
		this.maxVertices = numVertices;
	}
}

export function initObjShaders(vdp) {
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
			uniform vec4 uEnvColor;
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

				vec4 color = readPalette(texel, palette);
				gl_FragColor = ${makeOutputColor('color')};
			}
		`;

	// TODO Florian -- Use indexed VAOs
	const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

	vdp.spriteProgram = {
		program: shaderProgram,
		attribLocations: {
			xyzp: gl.getAttribLocation(shaderProgram, 'aXyzp'),
			uv: gl.getAttribLocation(shaderProgram, 'aUv'),
		},
		glBuffers: {
			xyzp: makeBuffer(gl),
			uv: makeBuffer(gl)
		},
		uniformLocations: {
			envColor: gl.getUniformLocation(shaderProgram, 'uEnvColor'),
			projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
			modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
			uSamplerSprites: gl.getUniformLocation(shaderProgram, 'uSamplerSprites'),
			uSamplerPalettes: gl.getUniformLocation(shaderProgram, 'uSamplerPalettes'),
		},
	};
}

/**
 * @param vdp {VDP}
 * @param objBuffer {ObjBuffer}
 */
export function drawPendingObj(vdp, objBuffer) {
	const prog = vdp.spriteProgram;
	if (objBuffer.usedVertices < 3) return;

	const gl = vdp.gl;
	// TODO Florian -- does slice make a copy? No need if it does.
	gl.bindBuffer(gl.ARRAY_BUFFER, prog.glBuffers.xyzp);
	gl.bufferData(gl.ARRAY_BUFFER, objBuffer.xyzp.slice(0, 4 * objBuffer.usedVertices), gl.STREAM_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, prog.glBuffers.uv);
	gl.bufferData(gl.ARRAY_BUFFER, objBuffer.uv.slice(0, 2 * objBuffer.usedVertices), gl.STREAM_DRAW);

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

	gl.uniform4f(prog.uniformLocations.envColor, envColor[0], envColor[1], envColor[2], envColor[3]);

	gl.drawArrays(gl.TRIANGLES, 0, objBuffer.usedVertices);

	objBuffer.usedVertices = 0;
}

/**
 *
 * @param objBuffer {ObjBuffer}
 * @param xStart {number}
 * @param yStart {number}
 * @param xEnd {number}
 * @param yEnd {number}
 * @param uStart {number}
 * @param vStart {number}
 * @param uEnd {number}
 * @param vEnd {number}
 * @param palNo {number}
 * @param hiColor {boolean}
 * @param z {number}
 */
export function enqueueObj(objBuffer, xStart, yStart, xEnd, yEnd, uStart, vStart, uEnd, vEnd, palNo, hiColor, z = 0) {
	if (hiColor) palNo |= PALETTE_HICOLOR_FLAG;

	objBuffer.xyzp.set([
		xStart, yStart, z, palNo,
		xEnd, yStart, z, palNo,
		xEnd, yEnd, z, palNo,

		xStart, yStart, z, palNo,
		xEnd, yEnd, z, palNo,
		xStart, yEnd, z, palNo,
	], 4 * objBuffer.usedVertices);

	objBuffer.uv.set([
		uStart, vStart,
		uEnd, vStart,
		uEnd, vEnd,

		uStart, vStart,
		uEnd, vEnd,
		uStart, vEnd,
	], 2 * objBuffer.usedVertices);

	objBuffer.usedVertices += 6;
}

/**
 * @param numSprites {number}
 */
export function makeObjBuffer(numSprites) {
	return new ObjBuffer(numSprites * 6);
}
