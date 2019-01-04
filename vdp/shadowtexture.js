import {readFromTexture32} from "./utils";

export class ShadowTexture {
	/**
	 *
	 * @param buffer {Uint8Array|Uint16Array|Uint32Array} original texture to construct this shadow texture from (no copy made! use .slice() if required).
	 * @param width {number} width of the original texture (in texels)
	 * @param height {number} height of this texture (in texels)
	 * @param pixelsPerTexel {number}
	 */
	constructor(buffer, width, height, pixelsPerTexel) {
		/** @type {Uint8Array|Uint16Array|Uint32Array} */
		this.buffer = buffer;
		/** @type {number} */
		this.width = width;
		/** @type {number} */
		this.height = height;
		/** @type {number} */
		this.pixelsPerTexel = pixelsPerTexel;
	}

	/**
	 * @returns {ShadowTexture} deep copy
	 */
	clone() {
		return new ShadowTexture(this.buffer.slice(0), this.width, this.height, this.pixelsPerTexel);
	}

	/**
	 *
	 * @param x {number}
	 * @param y {number}
	 * @param w {number}
	 * @param h {number}
	 * @param result {Uint8Array|Uint16Array|Uint32Array} sliced data
	 */
	readToBuffer(x, y, w, h, result) {
		if (typeof this.buffer !== typeof result) throw new Error('readFromShadowTexture: dest buffer must be of same type');

		const texWidth = this.width * this.pixelsPerTexel;
		let src = x + y * texWidth, dst = 0;
		for (let i = 0; i < h; i++) {
			result.set(this.buffer.subarray(src, src + w), dst);
			src += texWidth;
			dst += w;
		}
	}

	/**
	 * @param x {number}
	 * @param y {number}
	 * @param w {number}
	 * @param h {number}
	 * @param data {Uint8Array|Uint16Array|Uint32Array} data to copy
	 */
	writeTo(x, y, w, h, data) {
		if (typeof this.buffer !== typeof data) throw new Error('writeToShadowTexture: data must be of same type');

		const texWidth = this.width * this.pixelsPerTexel;
		let src = 0, dst = x + y * texWidth;
		for (let i = 0; i < h; i++) {
			this.buffer.set(data.subarray(src, src + w), dst);
			src += w;
			dst += texWidth;
		}
	}

	/**
	 * Will update surrounding pixels accordingly so that the memory write is 32-bit aligned.
	 * @param gl {WebGLRenderingContext}
	 * @param texture {WebGLTexture} destination texture
	 * @param x {number} portion to write (top-left) in texel coordinates (32-bit)
	 * @param y {number} portion to write (top-left) in texel coordinates (32-bit)
	 * @param w {number} number of pixels to write in texels
	 * @param h {number} number of pixels to write in texels
	 */
	syncToVramTexture(gl, texture, x, y, w, h) {
		// Align width (upper) and x (lower, need an extra column)
		w = Math.ceil(w / this.pixelsPerTexel);
		if (x % this.pixelsPerTexel > 0) w += 1;
		x = Math.floor(x / this.pixelsPerTexel);

		// TODO Florian -- super inefficient because WebGL 1 doesn't support gl.PACK_ROW_LENGTH, so we have to create a separate buffer
		// The buffer needs to have a stride of w (the width of the sub-image) while we have a buffer with a stride of this.width.
		const tightlyPackedBuffer = new Uint32Array(w * h);
		const view = new Uint32Array(this.buffer.buffer);
		const temp = new ShadowTexture(view, this.width, this.height, 1);
		temp.readToBuffer(x, y, w, h, tightlyPackedBuffer);

		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.texSubImage2D(gl.TEXTURE_2D, 0, x, y, w, h, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(tightlyPackedBuffer.buffer));
	}
}

/**
 * @param gl {WebGLRenderingContext}
 * @param tex {LoadedTexture}
 * @returns {ShadowTexture}
 * @private
 */
export function makeShadowFromTexture8(gl, tex) {
	const typed = new Uint8Array(readFromTexture32(gl, tex.texture, 0, 0, tex.width, tex.height).buffer);
	return new ShadowTexture(typed, tex.width, tex.height, 4);
}

/**
 * @param gl {WebGLRenderingContext}
 * @param tex {LoadedTexture}
 * @returns {ShadowTexture}
 * @private
 */
export function makeShadowFromTexture16(gl, tex) {
	const typed = new Uint16Array(readFromTexture32(gl, tex.texture, 0, 0, tex.width, tex.height).buffer);
	return new ShadowTexture(typed, tex.width, tex.height, 2);
}

/**
 * @param gl {WebGLRenderingContext}
 * @param tex {LoadedTexture}
 * @returns {ShadowTexture}
 * @private
 */
export function makeShadowFromTexture32(gl, tex) {
	const typed = new Uint32Array(readFromTexture32(gl, tex.texture, 0, 0, tex.width, tex.height).buffer);
	return new ShadowTexture(typed, tex.width, tex.height, 1);
}
