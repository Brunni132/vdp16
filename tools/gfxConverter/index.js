const assert = require('assert');
const Texture = require('./texture');

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
		const found = this.colorData.indexOf(color);
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
			const color = palette.pixelNumberInsidePalette(pixel);
			result.pixelData[y * result.width + x] = color;
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
		this.name = name;
		this.texture = texture;
		this.designPalette = designPalette;
		this.x = x;
		this.y = y;
		this.width = width;
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

	remainingSpace() {
		return { x: this.currentLineX - this.width, y: this.currentLineY - this.height };
	}

	startNewLine() {
		this.currentLineX = 0;
		this.currentLineY += this.currentLineHeight;
	}

	writeSampleImage(fileName) {
		// Use only one palette
		const defaultPal = this.spriteEntries[0].designPalette;
		const result = new Texture('sample', this.texture.width, this.texture.height, 32);
		result.forEachPixel((pix, x, y) => {
			if (pix)
				console.log(`TEMP `, x, y, defaultPal.colorData[pix]);
			result.setPixel(x, y, defaultPal.colorData[pix]);
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
palettes.push(new Palette('Default palette'));

masterSpriteList.addSprite('font',
	Sprite.fromImage32(Texture.fromPng32('font.png'), palettes[0])
);

masterSpriteList.writeSampleImage('sample.png');
// ---------- End program ------------


// Convert all palettes to the palette tex
for (let j = 0; j < palettes.length; j++) {
	palettes[j].copyToTexture32(paletteTex, 0, j);
}

// console.log(`TEMP `, palettes[0].colorData[0]);
// console.log(`TEMP `, palettes[0].colorData[1]);
// console.log(`TEMP `, palettes[0].colorData[2]);
// console.log(`TEMP `, palettes[0].colorData[3]);
// console.log(`TEMP `, masterSpriteList.texture.getPixel(0, 10));
// console.log(`TEMP `, masterSpriteList.texture.getPixel(1, 10));

// Write all textures
mapTex.writeToPng('maps.png');
spriteTex.writeToPng('sprites.png');
paletteTex.writeToPng('palettes.png');
