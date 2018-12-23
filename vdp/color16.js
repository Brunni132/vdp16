import {color32} from "./color32";

export class color16 {
	/**
	 * @param c color (16 bits)
	 * @returns {{r: number, g: number, b: number, a: number}}
	 */
	static extract(c) {
		return {
			r: c >>> 12,
			g: c >>> 8 & 0xf,
			b: c >>> 4 & 0xf,
			a: c & 0xf
		};
	}

	/**
	 * Use make( { r: …, g: …, …} ) or make(r, g, b).
	 * @param r {number|{r: number, g: number, b: number, a: number}} red component (0 to 15) or color as extracted with
	 * color16.extract().
	 * @param [g] {number} green component (0 to 15)
	 * @param [b] {number} blue component (0 to 15)
	 * @param [a=15] {number} alpha component (not used, only required to make a valid color for your display adapter)
	 */
	static make(r, g, b, a = 0xf) {
		if (typeof r === 'number') return a | b << 4 | g << 8 | r << 12;
		return r.a | r.b << 4 | r.g << 8 | r.r << 12;
	}

	/**
	 * Parses a color, always in 32-bit RGBA format, and returns a corresponding 16-bit color.
	 * @param col {number|string} either a 12-bit number (0xrgb0), a 32-bit number (0xaabbggrr)
	 * or a string (#rgb, #rrggbb, #rrggbbaa).
	 * @returns {number} the color in 16-bit 0xRGBA format.
	 */
	static parse(col) {
		return color32.toColor16(color32.parse(col));
	}

	static add(c, d) {
		let r = (c >>> 12) + (d >>> 12);
		let g = ((c >>> 8) & 0xf) + ((d >>> 8) & 0xf);
		let b = ((c >>> 4) & 0xf) + ((d >>> 4) & 0xf);
		let a = (c & 0xf) + (d & 0xf);
		if (a > 0xf) a = 0xf;
		if (b > 0xf) b = 0xf;
		if (g > 0xf) g = 0xf;
		if (r > 0xf) r = 0xf;
		return a | b << 4 | g << 8 | r << 12;
	}

	static sub(c, d) {
		let r = (c >>> 12) - (d >>> 12);
		let g = ((c >>> 8) & 0xf) - ((d >>> 8) & 0xf);
		let b = ((c >>> 4) & 0xf) - ((d >>> 4) & 0xf);
		let a = (c & 0xf) - (d & 0xf);
		if (a < 0) a = 0;
		if (b < 0) b = 0;
		if (g < 0) g = 0;
		if (r < 0) r = 0;
		return a | b << 4 | g << 8 | r << 12;
	}

	static mul(c, d) {
		let r = ((c >>> 12) * (d >>> 12)) / 255;
		let g = ((c >>> 8) & 0xf) * ((d >>> 8) & 0xf) / 255;
		let b = ((c >>> 4) & 0xf) * ((d >>> 4) & 0xf) / 255;
		let a = (c & 0xf) * (d & 0xf) / 255;
		return a | b << 4 | g << 8 | r << 12;
	}

	static blend(c, d, factor) {
		factor = Math.min(1, Math.max(0, factor));
		const invF = 1 - factor;

		const r = (c >>> 12) * invF + (d >>> 12) * factor;
		const g = ((c >>> 8) & 0xf) * invF + ((d >>> 8) & 0xf) * factor;
		const b = ((c >>> 4) & 0xf) * invF + ((d >>> 4) & 0xf) * factor;
		const a = (c & 0xf) * invF + (d & 0xf) * factor;
		return a | b << 4 | g << 8 | r << 12;
	}
}
