import {getScalingFactorOfMatrix, initShaderProgram, makeBuffer, makeRangeArray, TEMP_MakeDualTriangle} from "./utils";
import {
	declareReadPalette,
	declareReadTexel,
	envColor,
	makeOutputColor,
	PALETTE_HICOLOR_FLAG,
	PALETTE_TEX_H,
	PALETTE_TEX_W
} from "./shaders";
import {mat3} from "../gl-matrix";

// How big (tall/wide) a sprite can be before it's broken down in smaller units of OBJ_CELL_SIZE^2
const OBJ_CELL_SIZE = 32;

const OBJ_BUFFER_STRIDE = 6;

// TODO Florian -- Refactor to use zero-based indexes (and document) for all helper functions, like MapBuffer
class ObjBuffer {
	/**
	 * @param name {string} for debugging
	 * @param numVertices {number}
	 */
	constructor(name, numVertices) {
		/** @type {string} */
		this.name = name;
		/** @type {Float32Array} */
		this.xyzp = new Float32Array(numVertices * 4);
		/** @type {Float32Array} */
		this.uv = new Float32Array(numVertices * 2);
		/** @type {number} */
		this.usedVertices = 0;
		/** @type {number} */
		this.maxVertices = numVertices;
	}

	/**
	 *
	 * @param scaling {vec3}
	 * @param first {number}
	 * @param count {number}
	 * @returns	{number} number of cells used
	 */
	computeUsedObjects(scaling, first = -1, count = -1) {
		let result = 0;
		if (first < 0) first = this.firstSprite;
		if (count < 0) count = this.usedSprites;

		for (let i = first; i < first + count; i++) {
			result += this._computeObjectCells(this.getSizeOfObject(i), scaling);
		}
		return result;
	}

	get firstSprite() {
		return this.firstVertice / OBJ_BUFFER_STRIDE;
	}

	/**
	 * Returns the first vertice to draw, which is also the last one inserted. In case you want to add a new component,
	 * subtract from usedVertices (typically 4 or 6 for a quad) then set the buffers at the position of the firstVertice.
	 * @returns {number} the index of the first vertice in the arrays (there are `usedVertices` then). Note that you'll
	 * need to multiply by OBJ_BUFFER_STRIDE * <components per entry> to address the arrays.
	 */
	get firstVertice() {
		return 	this.maxVertices - this.usedVertices;
	}

	/**
	 * @returns {number} the z component of an object at the index-th position
	 * @param index {number}
	 */
	getZOfObject(index) {
		return this.xyzp[OBJ_BUFFER_STRIDE * 4 * index + 2];
	}

	/**
	 * @returns {{w: number, h: number}} the size of an object at the index-th position.
	 * @param index {number}
	 */
	getSizeOfObject(index) {
		// (left,top) in row 0.xy, (right,bottom) in row 2.xy
		const vert = OBJ_BUFFER_STRIDE * 4 * index;
		return {
			w: Math.abs(this.xyzp[vert + 4 * 2] - this.xyzp[vert]),
			h: Math.abs(this.xyzp[vert + 4 * 2 + 1] - this.xyzp[vert + 1])
		};
	}

	/**
	 * Limit the width of an object (usually as a result of going outside of the sprite limit).
	 * @param index {number}
	 * @param width {number} new width of the object
	 */
	setWidthOfObject(index, width) {
		// (left,top) in row 0.xy, (right,bottom) in row 2.xy
		const vert = OBJ_BUFFER_STRIDE * 4 * index;
		this.xyzp[vert + 4 * 2] = this.xyzp[vert] + width;
	}

	sort(frontToBack = true) {
		const items = makeRangeArray(this.firstVertice / OBJ_BUFFER_STRIDE, this.usedVertices / OBJ_BUFFER_STRIDE);
		if (frontToBack) {
			// First vertice, z component (3rd)
			items.sort((a, b) => this.getZOfObject(b) - this.getZOfObject(a));
		} else {
			items.sort((a, b) => this.getZOfObject(a) - this.getZOfObject(b));
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

	get usedSprites() {
		return this.usedVertices / OBJ_BUFFER_STRIDE;
	}

	/**
	 * Computes the number of pixels that an object uses with the transform. Note that even offscreen pixels count toward
	 * the limit!
	 * @param size {{w: number, h: number}}
	 * @param scaling {vec3}
	 * @returns {number} number of cells (32x32)
	 * @private
	 */
	_computeObjectCells(size, scaling) {
		return Math.max(1, Math.ceil(size.w * scaling[0] / OBJ_CELL_SIZE) * Math.ceil(size.h * scaling[1] / OBJ_CELL_SIZE));
	}

	/**
	 * Modifies the OBJ list to fit within the number of cells. Use the return value to know how many sprites to draw.
	 * @param scaling {vec3}
	 * @param maxCells {number} maximum allowed number of cells
	 * @returns {number} sprites fully drawable for this list
	 * @protected
	 */
	_limitObjList(scaling, maxCells) {
		let cells = 0;
		const endOfList = this.firstSprite + this.usedSprites;
		for (let i = this.firstSprite; i < endOfList; i++) {
			const size = this.getSizeOfObject(i);
			const current = this._computeObjectCells(size, scaling);

			if (cells + current > maxCells) {
				// Limit the width of this sprite -- Doesn't work because we need to scale the UV too with floating point UV rendering
				//const cellsTall = Math.ceil(size.h * layerTransform.scaling[1] / OBJ_CELL_SIZE);
				//const allowedCellsWide = (maxCells - cells) / cellsTall;
				//this.setWidthOfObject(i, allowedCellsWide * OBJ_CELL_SIZE);
				//return i - this.firstSprite + 1;

				console.log(`TEMP Too many OBJ cells on ${this.name} (discarded ${endOfList - i}/${this.usedSprites} entries)`);
				return i - this.firstSprite;
			}
			cells += current;
		}
		return this.usedSprites;
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
	
			uniform mat3 uModelViewMatrix;
			uniform mat4 uProjectionMatrix;
	
			varying highp vec2 vTextureCoord;
			varying highp float vPaletteNo;
			uniform sampler2D uSamplerSprites, uSamplerPalettes;
		
			void main(void) {
				// Only scale the final matrix (we can always say that the VDP supports fixed point math inside for matrix multiplication)
				gl_Position = uProjectionMatrix * vec4(floor(uModelViewMatrix * vec3(aXyzp.xy, aXyzp.z)), 1);
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
 * @param objLimit {number} max number of cells drawable
 */
export function drawPendingObj(vdp, objBuffer, objLimit = 0) {
	let numObjectsToDraw = objBuffer.usedSprites;
	if (objLimit > 0) {
		const scaling = getScalingFactorOfMatrix(vdp.modelViewMatrix);
		numObjectsToDraw = objBuffer._limitObjList(scaling, objLimit);
	}
	if (numObjectsToDraw <= 0) return;

	const prog = vdp.spriteProgram;
	const gl = vdp.gl;

	const firstVertice = objBuffer.firstVertice;
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
	gl.uniformMatrix3fv(prog.uniformLocations.modelViewMatrix,false, vdp.modelViewMatrix);

	gl.uniform4f(prog.uniformLocations.envColor, envColor[0], envColor[1], envColor[2], envColor[3]);

	gl.drawArrays(gl.TRIANGLES, 0, numObjectsToDraw * OBJ_BUFFER_STRIDE);

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

	if (objBuffer.usedVertices >= objBuffer.maxVertices) {
		console.log(`${objBuffer.name} overuse (max ${objBuffer.maxVertices / BG_BUFFER_STRIDE}), ignoring drawOBJ`);
		return;
	}

	// Start from the end
	objBuffer.usedVertices += OBJ_BUFFER_STRIDE;
	const firstVertice = objBuffer.firstVertice;

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
 * @param name {string}
 * @param numSprites {number}
 * @returns {ObjBuffer}
 */
export function makeObjBuffer(name, numSprites) {
	return new ObjBuffer(name, numSprites * OBJ_BUFFER_STRIDE);
}
