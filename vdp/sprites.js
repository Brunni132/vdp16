import {initShaderProgram, makeBuffer, makeRangeArray, TEMP_MakeDualTriangle} from "./utils";
import {
	declareReadPalette,
	declareReadTexel,
	envColor,
	makeOutputColor,
	PALETTE_HICOLOR_FLAG,
	PALETTE_TEX_H,
	PALETTE_TEX_W
} from "./shaders";

const OBJ_BUFFER_STRIDE = 6;

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

	sort(frontToBack = true) {
		const items = makeRangeArray(this.usedVertices / OBJ_BUFFER_STRIDE);
		if (frontToBack) {
			items.sort((a, b) =>
				// First vertice, z component (3rd)
				this.xyzp[OBJ_BUFFER_STRIDE * 4 * b + 2] - this.xyzp[OBJ_BUFFER_STRIDE * 4 * a + 2]);
		} else {
			items.sort((a, b) =>
				this.xyzp[OBJ_BUFFER_STRIDE * 4 * a + 2] - this.xyzp[OBJ_BUFFER_STRIDE * 4 * b + 2]);
		}

		const originalXyzp = this.xyzp.slice();
		const originalUv = this.uv.slice();
		for (let i = 0; i < items.length; i++) {
			this.xyzp.set(
				originalXyzp.subarray(OBJ_BUFFER_STRIDE * 4 * items[i], OBJ_BUFFER_STRIDE * 4 * (items[i] + 1)),
				OBJ_BUFFER_STRIDE * 4 * i);
			this.uv.set(
				originalUv.subarray(OBJ_BUFFER_STRIDE * 2 * items[i], OBJ_BUFFER_STRIDE * 2 * (items[i] + 1)),
				OBJ_BUFFER_STRIDE * 2 * i);
		}
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
				gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(floor(aXyzp.xy), aXyzp.z, 1);
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
	if (objBuffer.usedVertices < 3) return;

	const prog = vdp.spriteProgram;
	const gl = vdp.gl;

	const firstVertice = objBuffer.maxVertices - objBuffer.usedVertices;
	gl.bindBuffer(gl.ARRAY_BUFFER, prog.glBuffers.xyzp);
	gl.bufferData(gl.ARRAY_BUFFER, objBuffer.xyzp.subarray(firstVertice * 4), gl.STREAM_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, prog.glBuffers.uv);
	gl.bufferData(gl.ARRAY_BUFFER, objBuffer.uv.subarray(firstVertice * 2), gl.STREAM_DRAW);

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

	// Start from the end
	objBuffer.usedVertices += OBJ_BUFFER_STRIDE;
	const firstVertice = objBuffer.maxVertices - objBuffer.usedVertices;

	objBuffer.xyzp.set(TEMP_MakeDualTriangle([
		xStart, yStart, z, palNo,
		xEnd, yStart, z, palNo,
		xStart, yEnd, z, palNo,
		xEnd, yEnd, z, palNo,
	], 4), 4 * firstVertice);

	objBuffer.uv.set(TEMP_MakeDualTriangle([
		uStart, vStart,
		uEnd, vStart,
		uStart, vEnd,
		uEnd, vEnd,
	], 2), 2 * firstVertice);

}

/**
 * @param numSprites {number}
 * @returns {ObjBuffer}
 */
export function makeObjBuffer(numSprites) {
	return new ObjBuffer(numSprites * OBJ_BUFFER_STRIDE);
}
