import {readFromTexture32} from "./utils";

export class ShadowTexture {
	/**
	 *
	 * @param buffer {Uint8Array|Uint16Array|Uint32Array} original texture to construct this shadow texture from (no copy made! use .slice() if required).
	 * @param width {number}
	 * @param height {number}
	 * @param paletteTexture {boolean} pass true only if it's a UNSIGNED_SHORT_4_4_4_4 palette texture
	 */
	constructor(buffer, width, height, paletteTexture) {
		/** @type {Uint8Array|Uint16Array|Uint32Array} */
		this.buffer = buffer;
		/** @type {number} */
		this.width = width;
		/** @type {number} */
		this.height = height;
	}

	/**
	 * @returns {ShadowTexture}
	 */
	clone() {
		return new ShadowTexture(this.buffer.slice(0), this.width, this.height);
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

		let src = x, dst = 0;
		for (let i = 0; i < h; i++) {
			result.set(this.buffer.subarray(src, src + w), dst);
			src += this.width;
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

		let src = x, dst = 0;
		for (let i = 0; i < h; i++) {
			this.buffer.set(data.subarray(src, src + w), dst);
			src += w;
			dst += this.width;
		}
	}

	/**
	 *
	 * @param gl {WebGLRenderingContext}
	 * @param texture {WebGLTexture} destination texture
	 * @param x {number} portion to write (top-left) in texel coordinates (32-bit)
	 * @param y {number} portion to write (top-left) in texel coordinates (32-bit)
	 * @param w {number} number of pixels to write in texels
	 * @param h {number} number of pixels to write in texels
	 * @param pixelWidth {number} 1 for 32-bit per element in this ShadowTexture, 2 for 16-bit and 4 for 8-bit per element.
	 * Will update surrounding pixels accordingly so that the memory write is 32-bit aligned.
	 */
	syncToVramTexture(gl, texture, x, y, w, h, pixelWidth) {
		// Align width (upper) and x (lower, need an extra column)
		w = Math.ceil(w / pixelWidth);
		if (x % pixelWidth > 0) w += 1;
		x = Math.floor(x / pixelWidth);

		// TODO Florian -- super inefficient because WebGL 1 doesn't support gl.PACK_ROW_LENGTH
		const tightlyPackedBuffer = new Uint32Array(w * h);
		this.readToBuffer(x, y, w, h, tightlyPackedBuffer);

		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.texSubImage2D(gl.TEXTURE_2D, 0,
			x, y, w, h,
			gl.RGBA, gl.UNSIGNED_BYTE, tightlyPackedBuffer);
	}

	/**
	 *
	 * @param gl {WebGLRenderingContext}
	 * @param texture {WebGLTexture} destination texture
	 * @param x {number} portion to write (top-left) in texel coordinates (16-bit)
	 * @param y {number} portion to write (top-left) in texel coordinates (16-bit)
	 * @param w {number} number of pixels to write in texels
	 * @param h {number} number of pixels to write in texels
	 */
	syncToVramTexturePalette(gl, texture, x, y, w, h) {
		// TODO Florian -- super inefficient because WebGL 1 doesn't support gl.PACK_ROW_LENGTH
		const tightlyPackedBuffer = new Uint16Array(w * h);
		this.readToBuffer(x, y, w, h, tightlyPackedBuffer);

		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.texSubImage2D(gl.TEXTURE_2D, 0,
			x, y, w, h,
			gl.RGBA, gl.UNSIGNED_SHORT_4_4_4_4, tightlyPackedBuffer);
	}
}

/**
 * @param gl {WebGLRenderingContext}
 * @param texture {WebGLTexture}
 * @param image {HTMLImageElement}
 * @returns {ShadowTexture}
 * @private
 */
export function makeShadowFromTexture8(gl, texture, image) {
	const typed = new Uint8Array(readFromTexture32(gl, texture, 0, 0, image.width, image.height).buffer);
	return new ShadowTexture(typed, image.width, image.height);
}

/**
 * @param gl {WebGLRenderingContext}
 * @param texture {WebGLTexture}
 * @param image {HTMLImageElement}
 * @returns {ShadowTexture}
 * @private
 */
export function makeShadowFromTexture16(gl, texture, image) {
	const typed = new Uint16Array(readFromTexture32(gl, texture, 0, 0, image.width, image.height).buffer);
	return new ShadowTexture(typed, image.width, image.height);
}
