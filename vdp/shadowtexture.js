import {readFromTexture16, readFromTexture32} from "./utils";

export class ShadowTexture {
	/**
	 *
	 * @param buffer {Uint8Array|Uint16Array|Uint32Array} original texture to construct this shadow texture from (no copy made! use .slice() if required).
	 * @param width {number} width of the original texture (in texels)
	 * @param height {number} height of this texture (in texels)
	 * @param texture4444 {boolean} pass true only if it's a UNSIGNED_SHORT_4_4_4_4 palette texture
	 * @param pixelsPerTexel {number}
	 */
	constructor(buffer, width, height, texture4444, pixelsPerTexel) {
		/** @type {Uint8Array|Uint16Array|Uint32Array} */
		this.buffer = buffer;
		/** @type {number} */
		this.width = width;
		/** @type {number} */
		this.height = height;
		/** @type {boolean} */
		this.texture4444 = texture4444;
		/** @type {number} */
		this.pixelsPerTexel = pixelsPerTexel;
	}

	/**
	 * @returns {ShadowTexture} deep copy
	 */
	clone() {
		return new ShadowTexture(this.buffer.slice(0), this.width, this.height, this.texture4444, this.pixelsPerTexel);
	}

	/**
	 * @param bufferType {Uint8Array|Uint16Array|Uint32Array} destination array
	 * @returns {number} number of pixels per texel
	 */
	//pixelsPerTexel(bufferType) {
	//	if (typeof bufferType === typeof Uint16Array) return this.texture4444 ? 1 : 2;
	//	if (!this.texture4444) {
	//		if (typeof bufferType === typeof Uint8Array) return 4;
	//		if (typeof bufferType === typeof Uint32Array) return 1;
	//	}
	//	throw new Error(`Not allowed buffer type ${typeof bufferType}`);
	//}

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
		const tightlyPackedBuffer = this.texture4444 ? new Uint16Array(w * h) : new Uint32Array(w * h);
		const view = this.texture4444 ? new Uint16Array(this.buffer.buffer) : new Uint32Array(this.buffer.buffer);
		const temp = new ShadowTexture(view, this.width, this.height, false, 1);
		temp.readToBuffer(x, y, w, h, tightlyPackedBuffer);

		gl.bindTexture(gl.TEXTURE_2D, texture);
		if (this.texture4444) {
			gl.texSubImage2D(gl.TEXTURE_2D, 0, x, y, w, h, gl.RGBA, gl.UNSIGNED_SHORT_4_4_4_4, tightlyPackedBuffer);
		}
		else {
			gl.texSubImage2D(gl.TEXTURE_2D, 0, x, y, w, h, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(tightlyPackedBuffer.buffer));
		}
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
	return new ShadowTexture(typed, image.width, image.height, false, 4);
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
	return new ShadowTexture(typed, image.width, image.height, false, 2);
}

/**
 * @param gl {WebGLRenderingContext}
 * @param texture {WebGLTexture}
 * @param image {HTMLImageElement}
 * @returns {ShadowTexture}
 * @private
 */
export function makeShadowFromTexture4444(gl, texture, image) {
	const typed = readFromTexture16(gl, texture, 0, 0, image.width, image.height);
	return new ShadowTexture(typed, image.width, image.height, true, 1);
}

