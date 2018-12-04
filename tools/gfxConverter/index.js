const assert = require('assert');
const Texture = require('./texture');
const utils = require('./utils');

class Palette {

	/**
	 * @param {string} name
	 * @param {number} numColors
	 */
	constructor(name, numColors = 256) {
		/** @type {number[]} */
		this.colorData = [0];	// First color is always transparent (RGBA 0000)
		this.maxColors = numColors;
		this.name = name;
	}

	/**
	 * @param {Texture} texture
	 */
	initFromImage32(texture) {
		texture.forEachPixelLinear((color) => {
			this.pixelNumberInsidePalette(color, true);
		});
	}

	/**
	 * @param {Texture} destTexture
	 * @param {number} x
	 * @param {number} y
	 */
	copyToTexture32(destTexture, x, y) {
		for (let i = 0; i < this.colorData.length; i++) {
			destTexture.setPixel(x + i, y, this.colorData[i]);
		}
	}

	/**
	 * May return -1 if the color is not found and allowCreate = false or palette is full.
	 * @param {number} color 32-bit color
	 * @param {boolean} allowCreate
	 * @returns {number} the number inside the palette if this color already existed
	 */
	pixelNumberInsidePalette(color, allowCreate = true) {
		const noAlpha = color >>> 24 === 0;
		const found = this.colorData.findIndex(c => c === color || (noAlpha && (c >>> 24 === 0)));
		if (found >= 0 || !allowCreate) return found;

		assert(this.colorData.length < this.maxColors, 'too many colors');
		this.colorData.push(color);
		return this.colorData.length - 1;
	}
}

class Sprite {

	/**
	 * @param {number} width
	 * @param {number} height
	 * @param {Palette} palette
	 */
	constructor(width, height, palette) {
		this.width = width;
		this.height = height;
		this.palette = palette;
		this.pixelData = new Array(this.width * this.height);
	}

	/**
	 * @param {Texture} texture
	 * @param {Palette} palette
	 * @return {Sprite}
	 */
	static fromImage32(texture, palette) {
		const result = new Sprite(texture.width, texture.height, palette);
		texture.forEachPixel((pixel, x, y) => {
			// Add colors to the palette (or find them if they're already)
			result.pixelData[y * result.width + x] = palette.pixelNumberInsidePalette(pixel);
		});
		return result;
	}

	/**
	 * @param {Texture} destTexture
	 * @param {number} x
	 * @param {number} y
	 */
	copyToTexture32(destTexture, x, y) {
		let k = 0;
		for (let j = 0; j < this.height; j++) {
			for (let i = 0; i < this.width; i++) {
				destTexture.setPixel(x + i, y + j, this.pixelData[k++]);
			}
		}
	}
}

class BigFileSpriteEntry {
	/**
	 *
	 * @param name {string}
	 * @param texture {MasterSpriteTexture}
	 * @param designPalette {Palette}
	 * @param x {number}
	 * @param y {number}
	 * @param width {number}
	 * @param height {number}
	 */
	constructor(name, texture, designPalette, x, y, width, height) {
		/** @type {string} */
		this.name = name;
		/** @type {MasterSpriteTexture} */
		this.texture = texture;
		/** @type {Palette} */
		this.designPalette = designPalette;
		/** @type {number} */
		this.x = x;
		/** @type {number} */
		this.y = y;
		/** @type {number} */
		this.width = width;
		/** @type {number} */
		this.height = height;
	}
}

class MasterSpriteTexture {

	/**
	 * @param {Texture} spriteTexture
	 */
	constructor(spriteTexture) {
		this.currentLineX = 0;
		this.currentLineY = 0;
		this.currentLineHeight = 0;
		this.width = spriteTexture.width;
		this.height = spriteTexture.height;
		this.texture = spriteTexture;
		/** @type {BigFileSpriteEntry[]} */
		this.spriteEntries = [];
	}

	/**
	 * @param sprite {Sprite}
	 * @param name {string}
	 */
	addSprite(name, sprite) {
		// Need a new line?
		if (this.remainingSpace().x < sprite.width) {
			this.startNewLine();
		}

		const entry = new BigFileSpriteEntry(name, this, sprite.palette, this.currentLineX, this.currentLineY, sprite.width, sprite.height);
		this.spriteEntries.push(entry);

		sprite.copyToTexture32(this.texture, this.currentLineX, this.currentLineY);

		this.currentLineX += sprite.width;
		this.currentLineHeight = Math.max(this.currentLineHeight, sprite.height);
	}

	/**
	 * Finds the palette at a given location.
	 * @param x
	 * @param y
	 * @return {BigFileSpriteEntry | undefined}
	 */
	findPaletteAt(x, y) {
		return this.spriteEntries.find((entry) => {
			return x >= entry.x && x < entry.x + entry.width && y >= entry.y && y < entry.y + entry.height;
		});
	}

	/**
	 * Remaining space on the current line.
	 * @returns {{x: number, y: number}}
	 */
	remainingSpace() {
		return { x: this.width - this.currentLineX, y: this.height - this.currentLineY };
	}

	startNewLine() {
		this.currentLineX = 0;
		this.currentLineY += this.currentLineHeight;
	}

	/**
	 * @return {number} between 0 (empty) and 1 (full).
	 */
	memoryUsage() {
		const usageX = this.currentLineX / this.width;
		return this.currentLineY / this.height + usageX * (this.currentLineHeight / this.height);
	}

	/**
	 * @param fileName {string}
	 */
	writeSampleImage(fileName) {
		// Use only one palette
		const defaultPal = this.spriteEntries[0].designPalette;
		const result = new Texture('sample', this.texture.width, this.texture.height, 32);
		this.texture.forEachPixel((pix, x, y) => {
			const data = this.findPaletteAt(x, y);
			const palette = data ? data.designPalette : defaultPal;
			result.setPixel(x, y, palette.colorData[pix]);
		});
		result.writeToPng(fileName);
	}
}

const mapTex = Texture.blank('maps', 2048, 1024, 16);
const spriteTex = Texture.blank('sprites', 4096, 1024, 8);
const paletteTex = Texture.blank('palettes', 256, 256, 32);

/** @type {Palette[]} */
const palettes = [];
const masterSpriteList = new MasterSpriteTexture(spriteTex);

// ---------- Your program ------------
palettes.push(new Palette('Default'), new Palette('Mario'));

masterSpriteList.addSprite('font',
	Sprite.fromImage32(Texture.fromPng32('font.png'), palettes[0]));

masterSpriteList.addSprite('mario',
	Sprite.fromImage32(Texture.fromPng32('mario-luigi-2.png').subtexture(80, 32, 224, 16), palettes[1]));

masterSpriteList.texture.setPixel(0, 0, 127);
masterSpriteList.texture.setPixel(1, 0, 128);
masterSpriteList.texture.setPixel(2, 0, 129);
masterSpriteList.texture.setPixel(3, 0, 254);
masterSpriteList.texture.setPixel(4, 0, 255);

while (palettes[0].colorData.length < 127)
	palettes[0].colorData.push(0);
// 127=red
palettes[0].colorData.push(0xffff0000);
// 128=green
palettes[0].colorData.push(0xff00ff00);
// 129=blue
palettes[0].colorData.push(0xff0000ff);
while (palettes[0].colorData.length < 254)
	palettes[0].colorData.push(0);
// 254=yellow
palettes[0].colorData.push(0xffffff00);
// 255=magenta
palettes[0].colorData.push(0xffff00ff);
// ---------- End program ------------


// Convert all palettes to the palette tex
for (let j = 0; j < palettes.length; j++) {
	palettes[j].copyToTexture32(paletteTex, 0, j);
}

console.log(`Sprite usage: ${(100 * masterSpriteList.memoryUsage()).toFixed(2)}%`.formatAs(utils.BRIGHT, utils.FG_CYAN));
//console.log(masterSpriteList.spriteEntries.map(e => ({ x: e.x, y: e.y, w: e.width, h: e.height, pal: e.designPalette.name })));
console.log(`Palette usage: ${(100 * (palettes.length / paletteTex.height)).toFixed(2)}%`.formatAs(utils.BRIGHT, utils.FG_CYAN));
console.log('Writing sample.png…');
masterSpriteList.writeSampleImage('sample.png');

// Write all textures
console.log('Writing game data…');
mapTex.writeToPng('maps.png');
spriteTex.writeToPng('sprites.png');
paletteTex.writeToPng('palettes.png');
