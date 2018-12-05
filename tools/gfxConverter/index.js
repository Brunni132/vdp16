const assert = require('assert');
const BigFile = require('../../vdp/bigfile');
const fs = require('fs');
const Texture = require('./texture');
const utils = require('./utils');

const HICOLOR_MODE = true;

class Palette {

	/**
	 * @param {string} name
	 * @param {number} numColors
	 */
	constructor(name, numColors = 0) {
		/** @type {number[]} */
		this.colorData = [0]; // First color is always transparent (RGBA 0000)
		this.maxColors = numColors || (HICOLOR_MODE ? 256 : 16);
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
	 * @return {BigFile.Palette}
	 */
	copyToTexture32(destTexture, x, y) {
		if (x + this.colorData.length > destTexture.width) {
			throw new Error(`Too many colors in palette ${this.name} to fit in ${destTexture.width} texture`);
		}

		for (let i = 0; i < this.colorData.length; i++) {
			destTexture.setPixel(x + i, y, this.colorData[i]);
		}

		return { x, y, size: this.colorData.length };
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
		if (HICOLOR_MODE) return color;
		const c = (color >>> 4 & 0x0f0f0f0f);
		return c | c << 4;
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

class ConverterBase {

	// Lo-color mode: 8192x1024 sprites (4 MB), 256x16 RGBA4444 color RAM (8 kB), 2048x1024 maps (4 MB)
	// Hi-color mode: 4096x1024 sprites (4 MB), 256x256 RGBA8888 color RAM (256 kB), 2048x1024 maps (4 MB)
	constructor() {
		/** @type {Texture} */
		this.mapTex = Texture.blank('maps', 2048, 1024, 16);
		/** @type {Texture} */
		this.spriteTex = Texture.blank('sprites', HICOLOR_MODE ? 4096 : 8192, 1024, HICOLOR_MODE ? 8 : 4);
		/** @type {Texture} */
		this.paletteTex = Texture.blank('palettes', HICOLOR_MODE ? 256 : 16, 256, 32);

		/** @type {Palette[]} */
		this.palettes = [];
		this.sprites = new MasterSpriteList(this.spriteTex);
	}

	pack() {
		/** @type {BigFile} */
		const resultJson = { pals: {}, sprites: {}, maps: {}, data: {} };

		// Convert all palettes to the palette tex
		for (let i = 0; i < this.palettes.length; i++) {
			resultJson.pals[this.palettes[i].name] = this.palettes[i].copyToTexture32(this.paletteTex, 0, i);
		}

		for (let i = 0; i < this.sprites.spriteEntries.length; i++) {
			const entry = this.sprites.spriteEntries[i];
			resultJson.sprites[entry.name] = entry.toBigFileEntry();
		}

		console.log(`Sprite usage: ${(100 * this.sprites.memoryUsage()).toFixed(2)}%`.formatAs(utils.BRIGHT, utils.FG_CYAN));
		//console.log(masterSpriteList.spriteEntries.map(e => ({ x: e.x, y: e.y, w: e.width, h: e.height, pal: e.designPalette.name })));
		console.log(`Palette usage: ${(100 * (this.palettes.length / this.paletteTex.height)).toFixed(2)}%`.formatAs(utils.BRIGHT, utils.FG_CYAN));
		console.log('Writing sample.png…');
		this.sprites.writeSampleImage('sample.png');

		// Write all textures
		console.log('Writing game data…');
		//fs.writeFileSync('game.json', JSON.stringify(data), function(err) {
		//		if (err) throw err;
		//		console.log('complete');
		//	}
		//);
		this.mapTex.writeToPng('maps.png');
		this.spriteTex.writeToPng('sprites.png');
		this.paletteTex.writeToPng('palettes.png');
	}
}

class MasterSpriteList {

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
		/** @type {MasterSpriteListSprite[]} */
		this.spriteEntries = [];
		/** @type {MasterSpriteListTileset[]} */
		this.tilesetEntries = [];
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

		const entry = new MasterSpriteListSprite(name, this, sprite.palette, this.currentLineX, this.currentLineY, sprite.width, sprite.height);
		this.spriteEntries.push(entry);

		sprite.copyToTexture32(this.texture, this.currentLineX, this.currentLineY);

		this.currentLineX += sprite.width;
		this.currentLineHeight = Math.max(this.currentLineHeight, sprite.height);
	}

	/**
	 * Finds the palette at a given location.
	 * @param x
	 * @param y
	 * @return {MasterSpriteListSprite | undefined}
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

class MasterSpriteListSprite {
	/**
	 *
	 * @param name {string}
	 * @param texture {MasterSpriteList}
	 * @param designPalette {Palette}
	 * @param x {number}
	 * @param y {number}
	 * @param width {number}
	 * @param height {number}
	 */
	constructor(name, texture, designPalette, x, y, width, height) {
		/** @type {string} */
		this.name = name;
		/** @type {MasterSpriteList} */
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

	/**
	 * @returns {BigFile.Sprite}
	 */
	toBigFileEntry() {
		return { x: this.x, y: this.y, w: this.width, h: this.height, pal: this.designPalette.name };
	}
}

class MasterSpriteListTileset extends MasterSpriteListSprite{
	/**
	 *
	 * @param name {string}
	 * @param texture {MasterSpriteList}
	 * @param designPalette {Palette}
	 * @param x {number}
	 * @param y {number}
	 * @param width {number}
	 * @param height {number}
	 */
	constructor(name, texture, designPalette, x, y, width, height) {
		super(name, texture, designPalette, x, y, width, height);
	}

	/**
	 * @returns {BigFile.Sprite}
	 */
	toBigFileEntry() {
		return { x: this.x, y: this.y, w: this.width, h: this.height, pal: this.designPalette.name };
	}
}

// ---------- Your program ------------
const conv = new ConverterBase();

conv.palettes.push(new Palette('Default'), new Palette('Mario'));

conv.sprites.addSprite('font',
	Sprite.fromImage32(Texture.fromPng32('font.png'), conv.palettes[0]));

conv.sprites.addSprite('mario',
	Sprite.fromImage32(Texture.fromPng32('mario-luigi-2.png').subtexture(80, 32, 224, 16), conv.palettes[1]));

if (HICOLOR_MODE) {
	while (conv.palettes[0].colorData.length < 127)
		conv.palettes[0].colorData.push(0);
	// 127=red
	conv.palettes[0].colorData.push(0xffff0000);
	// 128=green
	conv.palettes[0].colorData.push(0xff00ff00);
	// 129=blue
	conv.palettes[0].colorData.push(0xff0000ff);
	while (conv.palettes[0].colorData.length < 254)
		conv.palettes[0].colorData.push(0);
	// 254=yellow
	conv.palettes[0].colorData.push(0xffffff00);
	// 255=magenta
	conv.palettes[0].colorData.push(0xffff00ff);

	conv.sprites.texture.setPixel(0, 0, 127);
	conv.sprites.texture.setPixel(1, 0, 128);
	conv.sprites.texture.setPixel(2, 0, 129);
	conv.sprites.texture.setPixel(3, 0, 254);
	conv.sprites.texture.setPixel(4, 0, 255);
}
else {
	while (conv.palettes[0].colorData.length < 7)
		conv.palettes[0].colorData.push(0);
	// 7=red
	conv.palettes[0].colorData.push(0xffff0000);
	// 8=green
	conv.palettes[0].colorData.push(0xff00ff00);
	// 9=blue
	conv.palettes[0].colorData.push(0xff0000ff);
	while (conv.palettes[0].colorData.length < 14)
		conv.palettes[0].colorData.push(0);
	// 14=yellow
	conv.palettes[0].colorData.push(0xffffff00);
	// 15=magenta
	conv.palettes[0].colorData.push(0xffff00ff);

	conv.sprites.texture.setPixel(0, 0, 7);
	conv.sprites.texture.setPixel(1, 0, 8);
	conv.sprites.texture.setPixel(2, 0, 9);
	conv.sprites.texture.setPixel(3, 0, 14);
	conv.sprites.texture.setPixel(4, 0, 15);
}

conv.pack();
// ---------- End program ------------

