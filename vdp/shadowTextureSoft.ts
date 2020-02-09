import { LoadedGLTexture } from "./utils";

// TODO Florian -- can actually be merged with shadowGLTexture, just find a clean way

/**
 * Typed buffer that represents a texture stored in RAM. Contrary to the OpenGL textures, the type doesn't need to be
 * 32-bit integers. You may pass 8, 16 or 32 bit data, and depending on that, you can read/write data with the
 * equivalent type.
 */
export class ShadowTexture {
	public readonly buffer: Uint8Array|Uint16Array|Uint32Array;
	public readonly width: number;
	public readonly height: number;
	private readonly pixelsPerTexel: number;
	private posterizeToBpp: number = -1;

	/**
	 * @param buffer {Uint8Array|Uint16Array|Uint32Array} original texture to construct this shadow texture from (no copy made! use .slice() if required).
	 * @param width {number} width of the original texture (in texels)
	 * @param height {number} height of this texture (in texels)
	 * @param pixelsPerTexel {number}
	 */
	constructor(buffer: Uint8Array|Uint16Array|Uint32Array, width: number, height: number, pixelsPerTexel: number) {
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
	clone(): ShadowTexture {
		const result = new ShadowTexture(this.buffer.slice(0), this.width, this.height, this.pixelsPerTexel);
		result.posterizeToBpp = this.posterizeToBpp;
		return result;
	}

	/**
	 * Reads a part of the shadow texture in typed units into a buffer (which needs to be of the same type that this
	 * ShadowTexture). The buffer is tightly packed (h lines of w typed elements).
	 */
	readToBuffer(x: number, y: number, w: number, h: number, result: Uint8Array|Uint16Array|Uint32Array) {
		if (typeof this.buffer !== typeof result) throw new Error('readToBuffer: dest buffer must be of same type');

		const texWidth = this.width * this.pixelsPerTexel;
		let src = x + y * texWidth, dst = 0;
		for (let i = 0; i < h; i++) {
			result.set(this.buffer.subarray(src, src + w), dst);
			src += texWidth;
			dst += w;
		}
	}

	/**
	 * Enables automatic posterization when writing from this ShaowedTexture to the VRAM. You can either pass -1 to
	 * disable it or pass a number of 2, 3, 4 or 5 (meaning that many bits per RGBA component).
	 */
	setPosterization(bitsPerPixel: number) {
		if (this.buffer.constructor !== Uint32Array) throw new Error('Posterization only available for color buffers (32-bit)');
		this.posterizeToBpp = bitsPerPixel;
	}

	get widthInPixels(): number {
		return this.width * this.pixelsPerTexel;
	}

	/**
	 * Writes data to the shadow texture. The data is tightly a packed buffer (h lines of w typed elements) of the same
	 * type as this ShadowTexture.
	 */
	writeTo(x, y, w, h, data) {
		if (typeof this.buffer !== typeof data) throw new Error('writeTo: data must be of same type');

		const texWidth = this.width * this.pixelsPerTexel;
		let src = 0, dst = x + y * texWidth;
		for (let i = 0; i < h; i++) {
			this.buffer.set(data.subarray(src, src + w), dst);
			src += w;
			dst += texWidth;
		}
	}
}

export function makeShadowFromTexture8(tex: LoadedGLTexture): ShadowTexture {
	const typed = new Uint8Array(tex.pixels.buffer);
	return new ShadowTexture(typed, tex.width, tex.height, 4);
}

export function makeShadowFromTexture16(tex: LoadedGLTexture): ShadowTexture {
	const typed = new Uint16Array(tex.pixels.buffer);
	return new ShadowTexture(typed, tex.width, tex.height, 2);
}

export function makeShadowFromTexture32(tex: LoadedGLTexture): ShadowTexture {
	const typed = new Uint32Array(tex.pixels.buffer);
	return new ShadowTexture(typed, tex.width, tex.height, 1);
}
