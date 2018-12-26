const assert = require('assert');

const HI_COLOR_MODE = true;				// Generate 8-bit tiles and 256-color palettes
const QUANTIZE_PALETTES = true;		// To spare colors in RGBA4444 mode

class Palette {

	/**
	 * @param {string} name
	 * @param {number} numColors
	 */
	constructor(name, numColors = 0) {
		assert(numColors < 256, `Can't create a palette of ${numColors} (${name})`);
		/** @type {number[]} */
		this.colorData = [0]; // First color is always transparent (RGBA 0000)
		this.maxColors = numColors || (HI_COLOR_MODE ? 256 : 16);
		this.name = name;
	}

	/**
	 * @param texture {Texture} full color image
	 */
	initOptimizedFromImage(texture) {
		texture.forEachPixelLinear((color) => {
			this.pixelNumberInsidePalette(color, true);
		});
	}

	/**
	 * @param {Texture} destTexture in the destination pixel format for the colors (16 or 32-bit)
	 * @param {number} x
	 * @param {number} y
	 * @return {BigFile~Palette}
	 */
	copyToTexture(destTexture, x, y) {
		if (x + this.colorData.length > destTexture.width) {
			throw new Error(`Too many colors in palette ${this.name} to fit in ${destTexture.width} texture`);
		}

		for (let i = 0; i < this.colorData.length; i++) {
			destTexture.setPixel(x + i, y, this.colorData[i]);
		}

		return { y, size: this.colorData.length };
	}

	/**
	 * May return -1 if the color is not found and allowCreate = false or palette is full.
	 * @param {number} color 32-bit color
	 * @param {boolean} allowCreate
	 * @returns {number} the number inside the palette if this color already existed
	 */
	pixelNumberInsidePalette(color, allowCreate = true) {
		color = this.toDesintationFormat(color);

		const noAlpha = color >>> 24 === 0;
		const found = this.colorData.findIndex(c => c === color || (noAlpha && (c >>> 24 === 0)));
		if (found >= 0 || !allowCreate) return found;

		assert(this.colorData.length < this.maxColors, `max ${this.maxColors} colors exceeded in ${this.name}`);
		this.colorData.push(color);
		return this.colorData.length - 1;
	}

	/**
	 * @param color {number}
	 * @returns {number}
	 */
	toDesintationFormat(color) {
		if (!QUANTIZE_PALETTES) return color;
		const c = (color >>> 4 & 0x0f0f0f0f);
		return c | c << 4;
	}
}

module.exports = {
	Palette,
	QUANTIZE_PALETTES,
	HI_COLOR_MODE
};
