const assert = require('assert');
const utils = require('./utils');

// TODO Florian -- move and make part of conv
const g_config = {};
const ALLOW_MORE_COLORS = true;

class Palette {

	/**
	 * @param {string} name
	 * @param {number} numColors
	 */
	constructor(name, numColors = 0) {
		assert(numColors < 256, `Can't create a palette of ${numColors} (${name})`);
		/** @type {number[]} */
		this.colorData = [0]; // First color is always transparent (RGBA 0000)
		this.maxColors = numColors || (g_config.hiColorMode ? 256 : 16);
		this.name = name;
		/** @type {Boolean} */
		this.alreadyWarned = false;
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
	 * @param colorArray {Array<number>} must already be in destinationFormat! (call toDestinationFormat first)
	 */
	addColors(colorArray) {
		if (colorArray.length + this.colorData.length > this.maxColors) {
			throw new Error(`Can't add ${colorArray.length} colors to palette ${this.name}, would extend ${this.maxColors}`);
		}
		colorArray.forEach(c => {
			if (c >>> 24 === 0) {
				throw new Error(`Can't add color ${c} to palette ${this.name}: alpha needs to be non-zero`);
			}
			this.colorData.push(c);
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

		if (this.colorData.length < this.maxColors) {
			this.colorData.push(color);
			return this.colorData.length - 1;
		}

		if (ALLOW_MORE_COLORS && !this.alreadyWarned) {
			console.log(`Max ${this.maxColors} colors exceeded in ${this.name}`.formatAs(utils.BRIGHT, utils.FG_RED));
			this.alreadyWarned = true;
		}
		assert(ALLOW_MORE_COLORS, 'Exceeded color count in palette');

		// Approximate color (index 0 is excluded as it's transparent)
		let best = 1 << 24, bestIdx = 1;
		const rs = color & 0xff, gs = color >> 8 & 0xff, bs = color >> 16 & 0xff;
		for (let i = 1; i < this.colorData.length; i++) {
			const r = this.colorData[i] & 0xff, g = this.colorData[i] >>  8 & 0xff, b = this.colorData[i] >> 16 & 0xff;
			const diff = (r - rs) * (r - rs) + (g - gs) * (g - gs) + (b - bs) * (b - bs);
			if (diff < best) {
				best = diff;
				bestIdx = i;
			}
		}
		return bestIdx;
	}

	/**
	 * @param color {number}
	 * @returns {number}
	 */
	toDesintationFormat(color) {
		if (!g_config.quantizeColors) return color;
		const c = (color >>> 4 & 0x0f0f0f0f);
		return c | c << 4;
	}
}

module.exports = {
	g_config,
	Palette
};
