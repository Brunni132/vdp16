
export class color32 {
	/**
	 * @param c color (32 bits)
	 * @returns {{r: number, g: number, b: number, a: number}}
	 */
	static extract(c) {
		return {
			a: c >>> 24,
			b: c >>> 16 & 0xff,
			g: c >>> 8 & 0xff,
			r: c & 0xff,
		};
	}

	/**
	 * @param c color (32 bits)
	 * @returns {{r: number, g: number, b: number, a: number}} result, 4 bit per component (0..15)
	 */
	static extract16(c) {
		return {
			a: c >>> 28,
			b: c >>> 20 & 0xf,
			g: c >>> 12 & 0xf,
			r: c >>> 4 & 0xf,
		};
	}

	/**
	 * Use make( { r: …, g: …, …} ) or make(r, g, b).
	 * @param r {number|{r: number, g: number, b: number, a: number}} red component (0 to 255) or color as extracted with
	 * color32.extract().
	 * @param [g] {number} green component (0 to 255)
	 * @param [b] {number} blue component (0 to 255)
	 * @param [a=255] {number} alpha component (not used, only required to make a valid color for your display adapter)
	 */
	static make(r, g, b, a = 0xff) {
		if (typeof r === 'number') return r | g << 8 | b << 16 | a << 24;
		return r.r | r.g << 8 | r.b << 16 | r.a << 24;
	}

	/**
	 * Extends a 16 bit RGBA color into a 32 bit RGBA color. Note that 0xRGBA will produce 0xAABBGGRR, reversing the byte
	 * order as OpenGL expects it.
	 * @param col {number}
	 * @returns {number}
	 */
	static extendColor16(col) {
		return color32.reverseColor32((col & 0xf) | (col & 0xf) << 4 |
			(col & 0xf0) << 4 | (col & 0xf0) << 8 |
			(col & 0xf00) << 8 | (col & 0xf00) << 12 |
			(col & 0xf000) << 12 | (col & 0xf000) << 16);
	}

	/**
	 * Parses a color, always in 32-bit RGBA format.
	 * @param col {number|string} either a 12-bit number (0xrgb0), a 32-bit number (0xaabbggrr)
	 * or a string (#rgb, #rrggbb, #rrggbbaa).
	 * @returns {number} the color in 32-bit RGBA format.
	 */
	static parse(col) {
		if (typeof col === 'string') {
			if (col.charAt(0) !== '#') col = ''; // fail

			// Invert byte order
			switch (col.length) {
			case 4:
				col = parseInt(col.substring(1), 16);
				return color32.extendColor16(col << 4 | 0xf);
			case 5:
				col = parseInt(col.substring(1), 16);
				return color32.extendColor16(col);
			case 7:
				col = parseInt(col.substring(1), 16);
				// Pass a RGBA with alpha=ff
				return color32.reverseColor32(col << 8 | 0xff);
			case 9:
				col = parseInt(col.substring(1), 16);
				return color32.reverseColor32(col);
			default:
				throw new Error(`Invalid color string ${col}`);
			}
		}

		if (col <= 0xffff) {
			// 16-bit to 32
			return color32.extendColor16(col);
		}
		else if (col <= 0xffffff) {
			// 24-bit to 32
			return col | 0xff << 24;
		}
		return col;
	}

	/**
	 * Reverses the byte order of a RGBA color.
	 * @param col {number}
	 * @returns {number}
	 */
	static reverseColor32(col) {
		return (col & 0xff) << 24 | (col >>> 8 & 0xff) << 16 | (col >>> 16 & 0xff) << 8 | (col >>> 24 & 0xff);
	}

	/**
	 * @param col {number} 32-bit color (0xAABBGGRR)
	 * @returns {number} 16-bit color (0xRGBA)
	 */
	static toColor16(col) {
		return (col & 0xf0) << 8 | (col >>> 8 & 0xf0) << 4 | (col >>> 16 & 0xf0) | col >>> 28;
	}


	static add(c, d) {
		let a = (c >>> 24) + (d >>> 24);
		let b = ((c >>> 16) & 0xff) + ((d >>> 16) & 0xff);
		let g = ((c >>> 8) & 0xff) + ((d >>> 8) & 0xff);
		let r = (c & 0xff) + (d & 0xff);
		if (a > 255) a = 255;
		if (b > 255) b = 255;
		if (g > 255) g = 255;
		if (r > 255) r = 255;
		return r | g << 8 | b << 16 | a << 24;
	}

	static sub(c, d) {
		let a = (c >>> 24) - (d >>> 24);
		let b = ((c >>> 16) & 0xff) - ((d >>> 16) & 0xff);
		let g = ((c >>> 8) & 0xff) - ((d >>> 8) & 0xff);
		let r = (c & 0xff) - (d & 0xff);
		if (a < 0) a = 0;
		if (b < 0) b = 0;
		if (g < 0) g = 0;
		if (r < 0) r = 0;
		return r | g << 8 | b << 16 | a << 24;
	}

	static mul(c, d) {
		let a = ((c >>> 24) * (d >>> 24)) / 255;
		let b = ((c >>> 16) & 0xff) * ((d >>> 16) & 0xff) / 255;
		let g = ((c >>> 8) & 0xff) * ((d >>> 8) & 0xff) / 255;
		let r = (c & 0xff) * (d & 0xff) / 255;
		return r | g << 8 | b << 16 | a << 24;
	}

	static blend(c, d, factor) {
		factor = Math.min(1, Math.max(0, factor));
		const invF = 1 - factor;

		const a = (c >>> 24) * invF + (d >>> 24) * factor;
		const b = ((c >>> 16) & 0xff) * invF + ((d >>> 16) & 0xff) * factor;
		const g = ((c >>> 8) & 0xff) * invF + ((d >>> 8) & 0xff) * factor;
		const r = (c & 0xff) * invF + (d & 0xff) * factor;
		return r | g << 8 | b << 16 | a << 24;
	}
}
