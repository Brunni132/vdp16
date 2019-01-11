
export class color32 {
	/**
	 * @param c color (32 bits)
	 * @param [bitsPerComponent=8] {number} can be 2, 3, 4, 5 to return a reduced color value (x bits per component)
	 * @returns {{r: number, g: number, b: number, a: number}}
	 */
	static extract(c: number, bitsPerComponent: number = 8): { a: number; b: number; r: number; g: number } {
		c = color32.posterize(c, bitsPerComponent);
		return {
			a: c >>> 24,
			b: c >>> 16 & 0xff,
			g: c >>> 8 & 0xff,
			r: c & 0xff,
		};
	}

	/**
	 * Use make( { r: …, g: …, …} ) or make(r, g, b).
	 * @param r {number|{r: number, g: number, b: number, a: number}} red component (0 to 255) or color as extracted with
	 * color32.extract().
	 * @param [g] {number} green component (0 to 255)
	 * @param [b] {number} blue component (0 to 255)
	 * @param [a=255] {number} alpha component (not used, only required to make a valid color for your display adapter)
	 * @returns {number} resulting color
	 */
	static make(r: number|{r: number, g: number, b: number, a: number}, g: number = 0, b: number = 0, a: number = 0xff): number {
		if (typeof r === 'number') return Math.ceil(r) | Math.ceil(g) << 8 | Math.ceil(b) << 16 | Math.ceil(a) << 24;
		return Math.ceil(r.r) | Math.ceil(r.g) << 8 | Math.ceil(r.b) << 16 | Math.ceil(r.a) << 24;
	}

	/**
	 * Same but with colors components between 0 and 1.
	 * @param r {number} red component (0 to 1)
	 * @param g {number} green component (0 to 1)
	 * @param b {number} blue component (0 to 1)
	 * @param [a=1] {number} alpha component (not used, only required to make a valid color for your display adapter)
	 * @returns {number}
	 */
	static makeFactor(r: number, g: number, b: number, a: number = 1): number {
		return this.make(r * 255, g * 255, b * 255, a * 255);
	}

	/**
	 * Extends a 16 bit RGBA color into a 32 bit RGBA color. Note that 0xRGBA will produce 0xAABBGGRR, reversing the byte
	 * order as OpenGL expects it.
	 * @param col {number}
	 * @returns {number}
	 */
	static extendColor12(col: number): number {
		return color32.reverseColor32((col & 0xf) | (col & 0xf) << 4 |
			(col & 0xf0) << 4 | (col & 0xf0) << 8 |
			(col & 0xf00) << 8 | (col & 0xf00) << 12 |
			(col & 0xf000) << 12 | (col & 0xf000) << 16);
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
	 * Parses a color, always in 32-bit RGBA format.
	 * @param col {number|string} either a 12-bit number (0xrgb0), a 32-bit number (0xaabbggrr)
	 * or a string (#rgb, #rrggbb, #rrggbbaa).
	 * @returns {number} the color in 32-bit RGBA format.
	 */
	static parse(col: string|number): number {
		if (typeof col === 'string') {
			if (col.charAt(0) !== '#') col = ''; // fail

			// Invert byte order
			switch (col.length) {
			case 4:
				col = parseInt(col.substring(1), 16);
				return color32.extendColor12(col << 4 | 0xf);
			case 5:
				col = parseInt(col.substring(1), 16);
				return color32.extendColor12(col);
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

		if (col >>> 16 === 0) {
			// 16-bit to 32
			return color32.extendColor12(col);
		}
		else if (col >>> 24 === 0) {
			// 24-bit to 32
			return col | 0xff << 24;
		}
		return col;
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
	static reverseColor32(col: number): number {
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
