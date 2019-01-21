import { initShaderProgram, makeBuffer, makeRangeArray, TEMP_MakeDualTriangle } from "./utils";
import {
	colorSwaps,
	declareReadPalette,
	declareReadTexel,
	envColor,
	makeOutputColor,
	PALETTE_HICOLOR_FLAG,
	PALETTE_TEX_H,
	SCREEN_HEIGHT,
	SCREEN_WIDTH
} from "./shaders";
import { DEBUG, VDP } from "./vdp";

// How big (tall/wide) a sprite can be before it's broken down in smaller units of OBJ_CELL_SIZE^2
export const OBJ_CELL_SIZE = 16;

const OBJ_BUFFER_STRIDE = 6;

// TODO Florian -- Refactor to use zero-based indexes (and document) for all helper functions, like MapBuffer
export class ObjBuffer {
	name: string;
	xyzp: Float32Array;
	uv: Float32Array;
	usedVertices: number = 0;
	maxVertices: number;

	/**
	 * @param name {string} for debugging
	 * @param numVertices {number}
	 */
	constructor(name, numVertices) {
		this.name = name;
		this.xyzp = new Float32Array(numVertices * 4);
		this.uv = new Float32Array(numVertices * 2);
		this.maxVertices = numVertices;
	}

	/**
	 * Returns the number of cells used.
	 */
	// computeUsedObjects(first: number = -1, count: number = -1): number {
	// 	let result = 0;
	// 	if (first < 0) first = this.firstSprite;
	// 	if (count < 0) count = this.usedSprites;
	//
	// 	for (let i = first; i < first + count; i++) {
	// 		result += this.computeObjectCells(this.getSizeOfObject(i));
	// 	}
	// 	return result;
	// }

	get firstSprite(): number {
		return this.firstVertice / OBJ_BUFFER_STRIDE;
	}

	/**
	 * Returns the first vertice to draw, which is also the last one inserted. In case you want to add a new component,
	 * subtract from usedVertices (typically 4 or 6 for a quad) then set the buffers at the position of the firstVertice.
	 * @returns {number} the index of the first vertice in the arrays (there are `usedVertices` then). Note that you'll
	 * need to multiply by OBJ_BUFFER_STRIDE * <components per entry> to address the arrays.
	 */
	get firstVertice(): number {
		return 	this.maxVertices - this.usedVertices;
	}

	/**
	 * @returns {number} the z component of an object at the index-th position
	 * @param index {number}
	 */
	getZOfObject(index): number {
		return this.xyzp[OBJ_BUFFER_STRIDE * 4 * index + 2];
	}

	/**
	 * Returns the size of an object at the index-th position.
	 */
	// getSizeOfObject(objectIndex: number): {w: number, h: number} {
	// 	// (left,top) in row 0.xy, (right,bottom) in row 2.xy
	// 	const vert = OBJ_BUFFER_STRIDE * 4 * objectIndex;
	// 	return {
	// 		w: Math.abs(this.xyzp[vert + 4 * 2] - this.xyzp[vert]),
	// 		h: Math.abs(this.xyzp[vert + 4 * 2 + 1] - this.xyzp[vert + 1])
	// 	};
	// }

	// /**
	//  * Modifies the OBJ list to fit within the number of cells. Use the return value to know how many sprites to draw.
	//  * @param maxCells {number} maximum allowed number of cells
	//  * @returns {number} sprites fully drawable for this list
	//  */
	// limitObjList(maxCells: number): number {
	// 	let cells = 0;
	// 	const endOfList = this.firstSprite + this.usedSprites;
	// 	for (let i = this.firstSprite; i < endOfList; i++) {
	// 		const size = this.getSizeOfObject(i);
	// 		const current = this.computeObjectCells(size);
	//
	// 		if (cells + current > maxCells) {
	//
	// 			// TODO Florian -- Limit the width of this sprite -- Doesn't work because we need to scale the UV too with floating point UV rendering
	// 			//const cellsTall = Math.ceil(size.h * layerTransform.scaling[1] / OBJ_CELL_SIZE);
	// 			//const allowedCellsWide = (maxCells - cells) / cellsTall;
	// 			//this.setWidthOfObject(i, allowedCellsWide * OBJ_CELL_SIZE);
	// 			//return i - this.firstSprite + 1;
	//
	// 			if (DEBUG) console.log('Too many OBJ cells on ${this.name} (discarded ${endOfList - i}/${this.usedSprites} entries)');
	// 			return i - this.firstSprite;
	// 		}
	// 		cells += current;
	// 	}
	// 	return this.usedSprites;
	// }

	// Limit the width of an object (usually as a result of going outside of the sprite limit).
	// setWidthOfObject(objectIndex: number, width: number) {
	// 	// (left,top) in row 0.xy, (right,bottom) in row 2.xy
	// 	const vert = OBJ_BUFFER_STRIDE * 4 * objectIndex;
	// 	this.xyzp[vert + 4 * 2] = this.xyzp[vert] + width;
	// }

	sort(splitAtZ: number): number {
		const items = makeRangeArray(this.firstVertice / OBJ_BUFFER_STRIDE, this.usedVertices / OBJ_BUFFER_STRIDE);
		// if (frontToBack) {
			// First vertice, z component (3rd)
			// items.sort((a, b) => this.getZOfObject(b) - this.getZOfObject(a));
		items.sort((a, b) => this.getZOfObject(b) - this.getZOfObject(a));
		// } else {
		// 	items.sort((a, b) => this.getZOfObject(a) - this.getZOfObject(b));
		// }

		let hasSplitAt = items.length;
		for (let i = 0; i < items.length; i++) {
			// Return the first sprite number that is behind the Z asked
			if (this.getZOfObject(items[i]) <= splitAtZ) hasSplitAt = i;
		}

		const originalXyzp = this.xyzp.slice();
		const originalUv = this.uv.slice();
		const firstSprite = this.firstSprite;

		for (let i = 0; i < items.length; i++) {
			this.xyzp.set(
				originalXyzp.subarray(OBJ_BUFFER_STRIDE * 4 * items[i], OBJ_BUFFER_STRIDE * 4 * (items[i] + 1)),
				OBJ_BUFFER_STRIDE * 4 * (i + firstSprite));
			this.uv.set(
				originalUv.subarray(OBJ_BUFFER_STRIDE * 2 * items[i], OBJ_BUFFER_STRIDE * 2 * (items[i] + 1)),
				OBJ_BUFFER_STRIDE * 2 * (i + firstSprite));
		}

		return hasSplitAt;
	}

	get usedSprites(): number {
		return this.usedVertices / OBJ_BUFFER_STRIDE;
	}

	/**
	 * Computes the number of pixels that an object uses with the transform. Note that even offscreen pixels count toward
	 * the limit!
	 */
	// private computeObjectCells(size: {w: number, h: number}): number {
	// 	return Math.max(1, Math.ceil(size.w / OBJ_CELL_SIZE) * Math.ceil(size.h / OBJ_CELL_SIZE));
	// }
}

export function initObjShaders(vdp: VDP) {
	const gl = vdp.gl;
	// Vertex shader program
	const vsSource = `// The 3 first are the vertex position, the 4th is the palette ID
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
	vTextureCoord = aUv;
}`;
	const fsSource = `precision highp float;

varying highp vec2 vTextureCoord;
varying highp float vPaletteNo;
uniform vec4 uEnvColor, uColorSwaps;
uniform sampler2D uSamplerOthers, uSamplerSprites, uSamplerPalettes;

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

	vec4 color = readPalette(texel, palette);
	gl_FragColor = ${makeOutputColor('color')};
}`;

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
			colorSwaps: gl.getUniformLocation(shaderProgram, 'uColorSwaps'),
			envColor: gl.getUniformLocation(shaderProgram, 'uEnvColor'),
			projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
			modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
			uSamplerOthers: gl.getUniformLocation(shaderProgram, 'uSamplerOthers'),
			uSamplerSprites: gl.getUniformLocation(shaderProgram, 'uSamplerSprites'),
			uSamplerPalettes: gl.getUniformLocation(shaderProgram, 'uSamplerPalettes'),
		},
	};
}

/**
 * Compute the number of cells that an object located at (x0, y0) filling the screen until (x1, y1) takes.
 * @param {number} x0
 * @param {number} y0
 * @param {number} x1
 * @param {number} y1
 * @returns {number} the number of cells (e.g. 1 for a 16x16 square, 2 for a 17x16, etc.)
 */
export function computeObjectCells(x0: number, y0: number, x1: number, y1: number): number {
	if (x0 > x1) [x1, x0] = [x0, x1];
	if (y0 > y1) [y1, y0] = [y0, y1];
	const w = Math.round(Math.min(SCREEN_WIDTH, x1) - Math.max(0, x0));
	const h = Math.round(Math.min(SCREEN_HEIGHT, y1) - Math.max(0, y0));
	return Math.max(1, Math.ceil(w / OBJ_CELL_SIZE) * Math.ceil(h / OBJ_CELL_SIZE));
}

/**
 * @param vdp {VDP}
 * @param objBuffer {ObjBuffer}
 * @param first {number} the index of the first sprite to draw. Pass 0 if you want to draw the full buffer.
 * @param last {number} the index of the last sprite to draw (exclusive). Pass objBuffer.usedSprites to draw them all.
 */
export function drawPendingObj(vdp: VDP, objBuffer: ObjBuffer, first: number, last: number) {
	if (last <= first) return;

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
	gl.activeTexture(gl.TEXTURE3);
	gl.bindTexture(gl.TEXTURE_2D, vdp.otherTexture);

	// Tell the shader we bound the texture to texture unit 0
	gl.uniform1i(prog.uniformLocations.uSamplerSprites, 0);
	gl.uniform1i(prog.uniformLocations.uSamplerPalettes, 1);
	gl.uniform1i(prog.uniformLocations.uSamplerOthers, 3);

	// Set the shader uniforms
	gl.uniformMatrix4fv(prog.uniformLocations.projectionMatrix, false, vdp.projectionMatrix);
	gl.uniformMatrix3fv(prog.uniformLocations.modelViewMatrix,false, vdp.modelViewMatrix);

	gl.uniform4f(prog.uniformLocations.envColor, envColor[0], envColor[1], envColor[2], envColor[3]);
	gl.uniform4f(prog.uniformLocations.colorSwaps, colorSwaps[0], colorSwaps[1], colorSwaps[2], colorSwaps[3]);

	gl.drawArrays(gl.TRIANGLES, first * OBJ_BUFFER_STRIDE, last * OBJ_BUFFER_STRIDE);

	objBuffer.usedVertices = 0;
}

export function enqueueObj(objBuffer: ObjBuffer, xStart: number, yStart: number, xEnd: number, yEnd: number, uStart: number, vStart: number, uEnd: number, vEnd: number, palNo: number, hiColor: boolean, z = 0, flipH = false, flipV = false) {
	if (hiColor) palNo |= PALETTE_HICOLOR_FLAG;

	if (objBuffer.usedVertices >= objBuffer.maxVertices) {
		if (DEBUG) console.log(`${objBuffer.name} overuse (max ${objBuffer.maxVertices / OBJ_BUFFER_STRIDE}), ignoring drawOBJ`);
		return;
	}

	// Start from the end
	objBuffer.usedVertices += OBJ_BUFFER_STRIDE;
	const firstVertice = objBuffer.firstVertice;

	if (flipH) [uStart, uEnd] = [uEnd, uStart];
	if (flipV) [vStart, vEnd] = [vEnd, vStart];

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

export function makeObjBuffer(name: string, numSprites: number): ObjBuffer {
	return new ObjBuffer(name, numSprites * OBJ_BUFFER_STRIDE);
}
