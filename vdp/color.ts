
export class color {
	/**
	 * Extract a 32-bit color, made by color.make or as gotten by readPalette, into it's red, green, blue and alpha
	 * sub-components.
	 * @param c color (32 bits)
	 * @param [bitsPerComponent=8] {number} can be 2, 3, 4, 5 to return a reduced color value (x bits per component)
	 * @returns {{r: number, g: number, b: number, a: number}}
	 */
	static extract(c: number, bitsPerComponent: number = 8): { a: number; b: number; r: number; g: number } {
		c = color.posterize(c, bitsPerComponent);
		return { a: c >>> 24, b: c >>> 16 & 0xff, g: c >>> 8 & 0xff, r: c & 0xff };
	}

	/**
	 * You can use make( { r: …, g: …, …} ), make(r, g, b) or make('#rgb'). Components are between 0 and 255.
	 * @param r {number|{r: number, g: number, b: number, a: number}} red component or color as extracted with
	 * color.extract().
	 * @param [g] {number} green component
	 * @param [b] {number} blue component
	 * @param [a=255] {number} alpha component (not used, only required to make a conceptually valid color)
	 * @returns {number} resulting color (a 32-bit number in the form of 0xaabbggrr)
	 */
	static make(r: number|{r: number, g: number, b: number, a: number}|string, g?: number, b?: number, a?: number): number {
		if (typeof r === 'number') {
			if (typeof a !== 'number') a = 255;  // Default alpha
			if (typeof b !== 'number') return r; // Already a well formed color
			return Math.ceil(Math.max(0, Math.min(255, r))) |
				Math.ceil(Math.max(0, Math.min(255, g))) << 8 |
				Math.ceil(Math.max(0, Math.min(255, b))) << 16 |
				Math.ceil(Math.max(0, Math.min(255, a))) << 24;
		}
		if (typeof r === 'string') {
			if (r.charAt(0) !== '#') r = ''; // fail

			// Invert byte order
			switch (r.length) {
				case 4:
					r = parseInt(r.substring(1), 16);
					return this.extendColor12(r << 4 | 0xf);
				case 5:
					r = parseInt(r.substring(1), 16);
					return this.extendColor12(r);
				case 7:
					r = parseInt(r.substring(1), 16);
					// Pass a RGBA with alpha=ff
					return this.reversecolor(r << 8 | 0xff);
				case 9:
					r = parseInt(r.substring(1), 16);
					return this.reversecolor(r);
				default:
					throw new Error(`Invalid color string ${r}`);
			}
		}
		return this.make(r.r, r.g, r.b, r.a);
	}

	/**
	 * Same as make but with colors components between 0 and 1 (floating point).
	 * @param r {number} red component
	 * @param g {number} green component
	 * @param b {number} blue component
	 * @param [a=1] {number} alpha component (not used, only required to make a conceptually valid color)
	 * @returns {number} a color
	 */
	static makeFromFloat(r: number, g: number, b: number, a: number = 1): number {
		return this.make(r * 255, g * 255, b * 255, a * 255);
	}

	static makeFromHsl(col: {h: number, s: number, l: number}): number {
		let r, g, b;

		if (col.s == 0) {
			r = g = b = col.l; // achromatic
		} else {
			// @ts-ignore
			function hue2rgb(p, q, t) {
				t -= Math.floor(t);
				if (t < 1/6) return p + (q - p) * 6 * t;
				if (t < 1/2) return q;
				if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
				return p;
			}

			const q = col.l < 0.5 ? col.l * (1 + col.s) : col.l + col.s - col.l * col.s;
			const p = 2 * col.l - q;

			r = hue2rgb(p, q, col.h + 1/3);
			g = hue2rgb(p, q, col.h);
			b = hue2rgb(p, q, col.h - 1/3);
		}

		return this.make(r * 255, g * 255, b * 255);
	}

	/**
	 * Extends a 16 bit RGBA color into a 32 bit RGBA color. Note that 0xRGBA will produce 0xAABBGGRR, reversing the byte
	 * order as OpenGL expects it.
	 * @param col {number}
	 * @returns {number}
	 */
	static extendColor12(col: number): number {
		return color.reversecolor((col & 0xf) | (col & 0xf) << 4 |
			(col & 0xf0) << 4 | (col & 0xf0) << 8 |
			(col & 0xf00) << 8 | (col & 0xf00) << 12 |
			(col & 0xf000) << 12 | (col & 0xf000) << 16);
	}

	/**
	 * @param c {number} color to affect
	 * @param bitsPerComponent {number} can be 2, 3, 4, 5 to return a reduced color value (x bits per component)
	 */
	static posterize(c: number, bitsPerComponent: number) {
		if (bitsPerComponent === 2) {
			let hiBits = (c >>> 6 & 0x01010101) | (c >>> 7 & 0x01010101);
			hiBits |= hiBits << 1;
			c = c >>> 6 & 0x03030303;
			return hiBits | hiBits << 2 | c << 4 | c << 6;
		} else if (bitsPerComponent === 3) {
			const hiBits = c >>> 6 & 0x03030303;
			c = (c >>> 5 & 0x07070707);
			return c | c << 5 | c << 2 | hiBits;
		} else if (bitsPerComponent === 4) {
			c = (c >>> 4 & 0x0f0f0f0f);
			return c | c << 4;
		} else if (bitsPerComponent === 5) {
			const hiBits = (c >>> 5 & 0x07070707);
			c = (c >>> 3 & 0x1f1f1f1f);
			return c << 3 | hiBits;
		}
		return c;
	}

	/**
	 * Reverses the byte order of a RGBA color.
	 * @param col {number}
	 * @returns {number}
	 */
	static reversecolor(col: number): number {
		return (col & 0xff) << 24 | (col >>> 8 & 0xff) << 16 | (col >>> 16 & 0xff) << 8 | (col >>> 24 & 0xff);
	}

	static toHsl(col: number): { h: number, s: number, l: number } {
		const rgb = this.extract(col);
		const r = rgb.r / 255, g = rgb.g / 255, b = rgb.b / 255;
		const max = Math.max(r, g, b), min = Math.min(r, g, b);
		let h, s, l = (max + min) / 2;

		if (max == min) {
			h = s = 0; // achromatic
		} else {
			const d = max - min;
			s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

			switch (max) {
				case r: h = (g - b) / d + (g < b ? 6 : 0); break;
				case g: h = (b - r) / d + 2; break;
				case b: h = (r - g) / d + 4; break;
			}

			h /= 6;
		}

		return {h, s, l};
	}

	static add(c: number, d: number): number {
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

	static sub(c: number, d: number): number {
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

	static mul(c: number, d: number): number {
		let a = ((c >>> 24) * (d >>> 24)) / 255;
		let b = ((c >>> 16) & 0xff) * ((d >>> 16) & 0xff) / 255;
		let g = ((c >>> 8) & 0xff) * ((d >>> 8) & 0xff) / 255;
		let r = (c & 0xff) * (d & 0xff) / 255;
		return r | g << 8 | b << 16 | a << 24;
	}

	static blend(c: number, d: number, factor: number): number {
		factor = Math.min(1, Math.max(0, factor));
		const invF = 1 - factor;

		const a = (c >>> 24) * invF + (d >>> 24) * factor;
		const b = ((c >>> 16) & 0xff) * invF + ((d >>> 16) & 0xff) * factor;
		const g = ((c >>> 8) & 0xff) * invF + ((d >>> 8) & 0xff) * factor;
		const r = (c & 0xff) * invF + (d & 0xff) * factor;
		return r | g << 8 | b << 16 | a << 24;
	}
}
