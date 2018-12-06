const assert = require('assert');
const BigFile = require('./bigfile');
const fs = require('fs');
const { Map, Tile, Tileset } = require('./maps');
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

/**
 * Similar to Tileset.
 * @see {Tileset}
 */
class Sprite {

	/**
	 * @param {string} name
	 * @param {number} width
	 * @param {number} height
	 * @param {Palette} palette
	 */
	constructor(name, width, height, palette) {
		this.name = name;
		this.width = width;
		this.height = height;
		this.palette = palette;
		this.pixelData = new Array(this.width * this.height);
	}

	/**
	 * @param {string} name
	 * @param {Texture} texture
	 * @param {Palette} palette
	 * @return {Sprite}
	 */
	static fromImage(name, texture, palette) {
		const result = new Sprite(name, texture.width, texture.height, palette);
		texture.forEachPixel((pixel, x, y) => {
			// Add colors to the palette (or find them if they're already)
			result.pixelData[y * result.width + x] = palette.pixelNumberInsidePalette(pixel);
		});
		return result;
	}

	/**
	 * @param {Texture} destTexture destination sprite texture receiving texel data (4 or 8 bit).
	 * @param {number} x
	 * @param {number} y
	 */
	copyToTexture(destTexture, x, y) {
		let k = 0;
		for (let j = 0; j < this.height; j++) {
			for (let i = 0; i < this.width; i++) {
				destTexture.setPixel(x + i, y + j, this.pixelData[k++]);
			}
		}
	}
}

class MasterPackBaker {

	/**
	 * @param {Texture} destTexture
	 */
	constructor(destTexture) {
		this.currentLineX = 0;
		this.currentLineY = 0;
		this.currentLineHeight = 0;
		this.width = destTexture.width;
		this.height = destTexture.height;
		this.destTexture = destTexture;
	}

	/**
	 * @param texture {Texture} in a format compatible with the destination texture
	 * @param width {number}
	 * @param height {number}
	 * @param name {string}
	 */
	bakeItem(texture, width, height, name) {
		// Need a new line?
		if (this.remainingSpace().x < width) {
			this.startNewLine();
		}
		if (this.remainingSpace().y < height) {
			throw new Error(`Not enough space to add sprite ${name} of ${width}x${height} on sprite list (now at ${this.currentLineX}, ${this.currentLineY})`);
		}

		// Copy on dest texture
		const x = this.currentLineX, y = this.currentLineY;
		for (let j = 0; j < this.height; j++) {
			for (let i = 0; i < this.width; i++) {
				this.destTexture.setPixel(x + i, y + j, texture.getPixel(i, j));
			}
		}

		this.currentLineX += width;
		this.currentLineHeight = Math.max(this.currentLineHeight, height);
		console.log(`TEMP now `, this.currentLineX, this.currentLineY, this.currentLineHeight);
	}

	/**
	 * @return {number} between 0 (empty) and 1 (full).
	 */
	memoryUsage() {
		const usageX = this.currentLineX / this.width;
		return this.currentLineY / this.height + usageX * (this.currentLineHeight / this.height);
	}

	/**
	 * Remaining space on the current line.
	 * @returns {{x: number, y: number}}
	 */
	remainingSpace() {
		return {x: this.width - this.currentLineX, y: this.height - this.currentLineY};
	}

	startNewLine() {
		this.currentLineX = 0;
		this.currentLineY += this.currentLineHeight;
	}
}

// TODO Florian -- Maybe this should just reference a list of maps, palettes and sprites (mutable) then pack the thing at the end?
class MasterPack {

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
		/** @type {MasterPackSpriteList} */
		this.sprites = new MasterPackSpriteList(this.spriteTex, this);
		/** @type {Map[]} */
		this.maps = [];
	}

	/**
	 * @param map {Map}
	 */
	addMap(map) {
		this.maps.push(map);
	}

	/**
	 * Adds a new sprite, which shouldn't change from there. Create it via Sprite.fromImage().
	 * @param sprite {Sprite}
	 */
	addSprite(sprite) {
		this.sprites.bakeSprite(sprite);
	}

	/**
	 * Adds a tileset, which shouldn't change from there. Create it via Tileset.blank().
	 * @param tileset {Tileset}
	 */
	addTileset(tileset) {
		this.sprites.bakeTileset(tileset);
	}

	/**
	 * Creates a palette and adds it to the build.
	 * @param name {string} palette name
	 * @param {number} [maxColors=0] max number of colors
	 * @returns {Palette} the newly created palette.
	 */
	createPalette(name, maxColors = 0) {
		const result = new Palette(name, maxColors);
		this.palettes.push(result);
		return result;
	}

	pack() {
		/** @type {BigFile} */
		const resultJson = { pals: {}, sprites: {}, maps: {}, data: {} };

		// Convert all palettes to the palette tex
		for (let i = 0; i < this.palettes.length; i++) {
			if (this.palettes[i]) {
				resultJson.pals[this.palettes[i].name] = this.palettes[i].copyToTexture(this.paletteTex, 0, i);
			}
		}

		// Sprites are automatically written on the go by MasterPackSpriteList (bake*)
		for (let i = 0; i < this.sprites.spriteEntries.length; i++) {
			const entry = this.sprites.spriteEntries[i];
			resultJson.sprites[entry.name] = entry.toBigFileEntry();
		}

		// Bake maps
		const mapBaker = new MasterPackBaker(this.mapTex);
		for (let i = 0; i < this.maps.length; i++) {
			mapBaker.bakeItem(this.maps[i].mapData, this.maps[i].width, this.maps[i].height, this.maps[i].name);
		}

		console.log(`Sprite usage: ${(100 * this.sprites.memoryUsage()).toFixed(2)}%`.formatAs(utils.BRIGHT, utils.FG_CYAN));
		//console.log(masterSpriteList.spriteEntries.map(e => ({ x: e.x, y: e.y, w: e.width, h: e.height, pal: e.designPalette.name })));
		console.log(`Palette usage: ${(100 * (this.palettes.length / this.paletteTex.height)).toFixed(2)}%`.formatAs(utils.BRIGHT, utils.FG_CYAN));
		console.log(`Map usage: ${(100 * mapBaker.memoryUsage()).toFixed(2)}%`.formatAs(utils.BRIGHT, utils.FG_CYAN));
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

// TODO Florian -- Refactor to use the MasterPackBaker
class MasterPackSpriteList {

	/**
	 * @param {Texture} spriteTexture
	 */
	constructor(spriteTexture, TEMP_masterPack) {
		this.currentLineX = 0;
		this.currentLineY = 0;
		this.currentLineHeight = 0;
		this.width = spriteTexture.width;
		this.height = spriteTexture.height;
		this.texture = spriteTexture;
		this.TEMP_masterPack = TEMP_masterPack;
		/** @type {MasterPackSprite[]} */
		this.spriteEntries = [];
		/** @type {MasterPackTileset[]} */
		this.tilesetEntries = [];
	}

	/**
	 * @param sprite {Sprite}
	 */
	bakeSprite(sprite) {
		const name = sprite.name;
		// Need a new line?
		if (this.remainingSpace().x < sprite.width) {
			this.startNewLine();
		}
		if (this.remainingSpace().y < sprite.height) {
			throw new Error(`Not enough space to add sprite ${name} of ${sprite.width}x${sprite.height} on sprite list (now at ${this.currentLineX}, ${this.currentLineY})`);
		}

		const entry = new MasterPackSprite(name, this.TEMP_masterPack, sprite.palette, this.currentLineX, this.currentLineY, sprite.width, sprite.height);
		this.spriteEntries.push(entry);

		sprite.copyToTexture(this.texture, this.currentLineX, this.currentLineY);

		this.currentLineX += sprite.width;
		this.currentLineHeight = Math.max(this.currentLineHeight, sprite.height);
	}

	/**
	 * @param tileset {Tileset}
	 */
	bakeTileset(tileset) {
		const name = tileset.name;
		// Need a new line?
		if (this.remainingSpace().x < tileset.usedWidth) {
			this.startNewLine();
		}
		if (this.remainingSpace().y < tileset.usedHeight) {
			throw new Error(`Not enough space to add sprite ${name} of ${tileset.usedWidth}x${tileset.usedHeight} on sprite list (now at ${this.currentLineX}, ${this.currentLineY})`);
		}
		assert(tileset.palettes.length === 1, 'Only supports tilesets with one palette');

		const entry = new MasterPackSprite(name, this.TEMP_masterPack, tileset.palettes[0], this.currentLineX, this.currentLineY, tileset.usedWidth, tileset.usedHeight);
		this.spriteEntries.push(entry);

		tileset.copyToTexture(this.texture, this.currentLineX, this.currentLineY);

		this.currentLineX += tileset.usedWidth;
		this.currentLineHeight = Math.max(this.currentLineHeight, tileset.usedHeight);
	}

	/**
	 * Finds the palette at a given location.
	 * @param x
	 * @param y
	 * @return {Palette | null}
	 */
	findPaletteAt(x, y) {
		const result = this.spriteEntries.find((entry) => {
			return x >= entry.x && x < entry.x + entry.width && y >= entry.y && y < entry.y + entry.height;
		});

		if (result) return result.designPalette;

		const result2 = this.tilesetEntries.find((entry) => {
			return x >= entry.x && x < entry.x + entry.width && y >= entry.y && y < entry.y + entry.height;
		});
		return result2 ? result2.designPalette : null;
	}

	/**
	 * @return {number} between 0 (empty) and 1 (full).
	 */
	memoryUsage() {
		const usageX = this.currentLineX / this.width;
		return this.currentLineY / this.height + usageX * (this.currentLineHeight / this.height);
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
	 * @param fileName {string}
	 */
	writeSampleImage(fileName) {
		// Use only one palette
		const defaultPal = this.spriteEntries[0].designPalette;
		const result = new Texture('sample', this.texture.width, this.texture.height, 32);
		this.texture.forEachPixel((pix, x, y) => {
			const palette = this.findPaletteAt(x, y) || defaultPal;
			result.setPixel(x, y, palette.colorData[pix]);
		});
		result.writeToPng(fileName);
	}
}

//class MasterPackPalette {
//	/**
//	 * @param name {string}
//	 * @param masterPack {MasterPack}
//	 * @param x {number}
//	 * @param y {number}
//	 * @param size {number} palette count
//	 */
//	constructor(name, masterPack, x, y, size) {
//		/** @type {string} */
//		this.name = name;
//		/** @type {MasterPack} */
//		this.masterPack = masterPack;
//		/** @type {number} */
//		this.x = x;
//		/** @type {number} */
//		this.y = y;
//		/** @type {number} */
//		this.size = size;
//	}
//
//	/**
//	 * @returns {BigFile~Palette}
//	 */
//	toBigFileEntry() {
//		return { x: this.x, y: this.y, size: this.size };
//	}
//}

class MasterPackSprite {
	/**
	 *
	 * @param name {string}
	 * @param masterPack {MasterPack}
	 * @param designPalette {Palette}
	 * @param x {number}
	 * @param y {number}
	 * @param width {number}
	 * @param height {number}
	 */
	constructor(name, masterPack, designPalette, x, y, width, height) {
		/** @type {string} */
		this.name = name;
		/** @type {MasterPack} */
		this.masterPack = masterPack;
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
	 * @returns {BigFile~Sprite}
	 */
	toBigFileEntry() {
		return { x: this.x, y: this.y, w: this.width, h: this.height, pal: this.designPalette.name };
	}
}

class MasterPackTileset {
	/**
	 *
	 * @param name {string}
	 * @param masterPack {MasterPack}
	 * @param designPalette {Palette}
	 * @param x {number}
	 * @param y {number}
	 * @param width {number}
	 * @param height {number}
	 * @param tileWidth {number}
	 * @param tileHeight {number}
	 */
	constructor(name, masterPack, designPalette, x, y, width, height, tileWidth, tileHeight) {
		/** @type {string} */
		this.name = name;
		/** @type {MasterPack} */
		this.masterPack = masterPack;
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
		/** @type {number} */
		this.tileWidth = tileWidth;
		/** @type {number} */
		this.tileHeight = tileHeight;
	}

	/**
	 * @returns {BigFile~Sprite}
	 */
	toBigFileEntry() {
		return { x: this.x, y: this.y, w: this.width, h: this.height, tw: this.tileWidth, th: this.tileHeight, pal: this.designPalette.name };
	}
}

//class MasterPackMap {
//	/**
//	 * @param name {string}
//	 * @param masterPack {MasterPack}
//	 * @param designTileset {MasterPackTileset}
//	 * @param x {number}
//	 * @param y {number}
//	 * @param width {number}
//	 * @param height {number}
//	 */
//	constructor(name, masterPack, designTileset, x, y, width, height) {
//		/** @type {string} */
//		this.name = name;
//		/** @type {MasterPackSpriteList} */
//		this.masterPack = masterPack;
//		/** @type {MasterPackTileset} */
//		this.designTileset = designTileset;
//		/** @type {number} */
//		this.x = x;
//		/** @type {number} */
//		this.y = y;
//		/** @type {number} */
//		this.width = width;
//		/** @type {number} */
//		this.height = height;
//	}
//
//	/**
//	 * @returns {BigFile~Map}
//	 */
//	toBigFileEntry() {
//		return { x: this.x, y: this.y, w: this.width, h: this.height,
//			til: this.designTileset.name, pal: this.designTileset.designPalette.name };
//	}
//}

// ---------- Your program ------------
const conv = new MasterPack();

const palettes = [
	conv.createPalette('Default'),
	conv.createPalette('Mario'),
	conv.createPalette('unused1'),
	conv.createPalette('unused2'),
	conv.createPalette('unused3'),
	conv.createPalette('Level1'),
];

conv.addSprite(Sprite.fromImage('font',
	Texture.fromPng32('font.png'), palettes[0]));

conv.addSprite(Sprite.fromImage('mario',
	Texture.fromPng32('mario-luigi-2.png').subtexture(80, 32, 224, 16), palettes[1]));

const tileset = Tileset.blank('level1-til', 8, 8, 32, 32, [palettes[5]]);
const map = Map.fromImage('level1',
	Texture.fromPng32('mario-1-1.png'), tileset);
conv.addTileset(tileset);
conv.addMap(map);

if (HICOLOR_MODE) {
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

	conv.sprites.texture.setPixel(0, 0, 127);
	conv.sprites.texture.setPixel(1, 0, 128);
	conv.sprites.texture.setPixel(2, 0, 129);
	conv.sprites.texture.setPixel(3, 0, 254);
	conv.sprites.texture.setPixel(4, 0, 255);
}
else {
	while (palettes[0].colorData.length < 7)
		palettes[0].colorData.push(0);
	// 7=red
	palettes[0].colorData.push(0xffff0000);
	// 8=green
	palettes[0].colorData.push(0xff00ff00);
	// 9=blue
	palettes[0].colorData.push(0xff0000ff);
	while (palettes[0].colorData.length < 14)
		palettes[0].colorData.push(0);
	// 14=yellow
	palettes[0].colorData.push(0xffffff00);
	// 15=magenta
	palettes[0].colorData.push(0xffff00ff);

	conv.sprites.texture.setPixel(0, 0, 7);
	conv.sprites.texture.setPixel(1, 0, 8);
	conv.sprites.texture.setPixel(2, 0, 9);
	conv.sprites.texture.setPixel(3, 0, 14);
	conv.sprites.texture.setPixel(4, 0, 15);
}

conv.pack();
// ---------- End program ------------

