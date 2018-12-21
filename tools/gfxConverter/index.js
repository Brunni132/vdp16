const assert = require('assert');
const BigFile = require('./bigfile');
const fs = require('fs');
const { Map, Tile, Tileset } = require('./maps');
const Texture = require('./texture');
const utils = require('./utils');

const HI_COLOR_MODE = true;				// Generate 8-bit tiles and 256-color palettes
const QUANTIZE_PALETTES = false;		// To spare colors in RGBA4444 mode

class Palette {

	/**
	 * @param {string} name
	 * @param {number} numColors
	 */
	constructor(name, numColors = 0) {
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
		if (HI_COLOR_MODE && !QUANTIZE_PALETTES) return color;
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
		// TODO Florian -- A sprite should just be a tileset with one entry. Get rid of all that…
		this.name = name;
		this.width = width;
		this.height = height;
		this.palette = palette;
		/** @type {Array} */
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
	 * @param {number} horizAlignment how many texels to align to (for instance, you should align 4-bit words to 8 texels since
	 * they will be packed as 32-bit RGBA words in the final texture).
	 */
	constructor(destTexture, horizAlignment) {
		this.currentLineX = 0;
		this.currentLineY = 0;
		this.currentLineHeight = 0;
		this.width = destTexture.width;
		this.height = destTexture.height;
		this.destTexture = destTexture;
		/** @type {number} */
		this.alignment = horizAlignment;
	}

	/**
	 * @param width {number}
	 * @param height {number}
	 * @param name {string}
	 * @param cb {function(Texture, number, number)}
	 */
	bake(width, height, name, cb) {
		// Need a new line?
		if (this.remainingSpace().x < width) {
			this.startNewLine();
		}
		if (this.remainingSpace().y < height) {
			throw new Error(`Not enough space to add sprite ${name} of ${width}x${height} on sprite list (now at ${this.currentLineX}, ${this.currentLineY})`);
		}

		// Copy on dest texture
		const x = this.currentLineX, y = this.currentLineY;
		cb(this.destTexture, x, y);

		this.currentLineX += width;
		this.currentLineHeight = Math.max(this.currentLineHeight, height);

		if (this.alignment > 0) {
			this.currentLineX = utils.alignToUpperDivider(this.currentLineX, this.alignment);
		}
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

	/**
	 * Lo-color mode: 8192x1024 sprites (4 MB), 256x16 RGBA4444 color RAM (8 kB), 2048x1024 maps (4 MB)
	 * Hi-color mode: 4096x1024 sprites (4 MB), 256x256 RGBA8888 color RAM (256 kB), 2048x1024 maps (4 MB)
	 * @param compact {boolean} use a smaller video memory (512 kB)
	 */
	constructor(compact) {
		if (!compact) {
			/** @type {Texture} */
			this.mapTex = Texture.blank('maps', 2048, 1024, 16);
			/** @type {Texture} */
			this.spriteTex = Texture.blank('sprites', HI_COLOR_MODE ? 4096 : 8192, 1024, HI_COLOR_MODE ? 8 : 4);
			/** @type {Texture} */
			this.paletteTex = Texture.blank('palettes', HI_COLOR_MODE ? 256 : 16, 256, 32);
		} else {
			this.mapTex = Texture.blank('maps', 512, 512, 16);
			this.spriteTex = Texture.blank('sprites', HI_COLOR_MODE ? 1024 : 2048, 512, HI_COLOR_MODE ? 8 : 4);
			this.paletteTex = Texture.blank('palettes', HI_COLOR_MODE ? 256 : 16, 256, 32);
		}

		/** @type {Palette[]} */
		this.palettes = [];
		/** @type {Sprite[]} */
		this.sprites = [];
		/** @type {Tileset[]} */
		this.tilesets = [];
		/** @type {Map[]} */
		this.maps = [];
	}

	/**
	 * Adds a new map, which shouldn't change from there. Create via Map.*.
	 * @param map {Map}
	 */
	addMap(map) {
		if (this.maps.indexOf(map) >= 0) return;
		this.maps.push(map);
	}

	/**
	 * Adds a new sprite, which shouldn't change from there. Create it via Sprite.fromImage().
	 * @param sprite {Sprite}
	 */
	addSprite(sprite) {
		if (this.sprites.indexOf(sprite) >= 0) return;
		this.sprites.push(sprite);
	}

	/**
	 * Adds a tileset, which shouldn't change from there. Create it via Tileset.blank().
	 * @param tileset {Tileset}
	 */
	addTileset(tileset) {
		if (this.tilesets.indexOf(tileset) >= 0) return;
		this.tilesets.push(tileset);
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

	/**
	 * Finds the palette at a given location.
	 * @param {BigFile} bigFile
	 * @param x
	 * @param y
	 * @return {Palette | null}
	 */
	findPaletteAt(bigFile, x, y) {
		const result = Object.values(bigFile.sprites).find((entry) => {
			return x >= entry.x && x < entry.x + entry.w && y >= entry.y && y < entry.y + entry.h;
		});
		if (result) return this.paletteNamed(result.pal);
		return null;
	}

	/**
	 * @param writeSample {boolean}
	 */
	pack(writeSample) {
		/** @type {BigFile} */
		const resultJson = { pals: {}, sprites: {}, maps: {}, data: {} };

		// Convert all palettes to the palette tex
		for (let i = 0; i < this.palettes.length; i++) {
			if (this.palettes[i]) {
				resultJson.pals[this.palettes[i].name] = this.palettes[i].copyToTexture(this.paletteTex, 0, i);
			}
		}

		// Bake sprites
		const spriteBaker = new MasterPackBaker(this.spriteTex, HI_COLOR_MODE ? 4 : 8);
		for (let i = 0; i < this.sprites.length; i++) {
			const s = this.sprites[i];
			spriteBaker.bake(s.width, s.height, s.name, (destTexture, x, y) => {
				s.copyToTexture(destTexture, x, y);
				resultJson.sprites[s.name] = { x, y, w: s.width, h: s.height, hicol: HI_COLOR_MODE ? 1 : 0, pal: s.palette.name };
			});
		}

		// Tilesets too
		for (let i = 0; i < this.tilesets.length; i++) {
			const tileset = this.tilesets[i];
			spriteBaker.bake(tileset.usedWidth, tileset.usedHeight, tileset.name, (destTexture, x, y) => {
				tileset.copyToTexture(destTexture, x, y);
				resultJson.sprites[tileset.name] = { x, y, w: tileset.usedWidth, h: tileset.usedHeight, tw: tileset.tileWidth, th: tileset.tileHeight, hicol: HI_COLOR_MODE ? 1 : 0, pal: tileset.palettes[0].name };
			});
		}

		// Bake maps
		const mapBaker = new MasterPackBaker(this.mapTex, 2);
		for (let i = 0; i < this.maps.length; i++) {
			const m = this.maps[i];
			mapBaker.bake(m.width, m.height, m.name, (destTexture, x, y) => {
				m.copyToTexture(destTexture, x, y);
				resultJson.maps[m.name] = { x, y, w: m.width, h: m.height, til: m.tileset.name, pal: m.tileset.palettes[0].name };
			});
		}

		console.log(`Sprite usage: ${(100 * spriteBaker.memoryUsage()).toFixed(2)}%`.formatAs(utils.BRIGHT, utils.FG_CYAN));
		//console.log(masterSpriteList.spriteEntries.map(e => ({ x: e.x, y: e.y, w: e.width, h: e.height, pal: e.designPalette.name })));
		console.log(`Palette usage: ${(100 * (this.palettes.length / this.paletteTex.height)).toFixed(2)}%`.formatAs(utils.BRIGHT, utils.FG_CYAN));
		console.log(`Map usage: ${(100 * mapBaker.memoryUsage()).toFixed(2)}%`.formatAs(utils.BRIGHT, utils.FG_CYAN));
		if (writeSample) {
			console.log('Writing sample.png…');
			this.writeSampleImage(resultJson, 'sample.png');
		}

		// Write all textures
		console.log('Writing game data…');
		fs.writeFileSync('build/game.json', JSON.stringify(resultJson), function(err) {
				if (err) throw err;
				console.log('complete');
			}
		);
		this.mapTex.writeToPng('build/maps.png');
		this.spriteTex.writeToPng('build/sprites.png');
		this.paletteTex.writeToPng('build/palettes.png');
	}

	/**
	 * @param name {string}
	 * @returns {Palette|null}
	 */
	paletteNamed(name) {
		return this.palettes.find(pal => pal.name === name);
	}

	/**
	 * @param fileName {string}
	 * @param resultJson {BigFile}
	 */
	writeSampleImage(resultJson, fileName) {
		// Use only one palette
		const defaultPal = this.sprites[0].palette;
		const result = new Texture('sample', this.spriteTex.width, this.spriteTex.height, 32);
		this.spriteTex.forEachPixel((pix, x, y) => {
			const palette = this.findPaletteAt(resultJson, x, y) || defaultPal;
			result.setPixel(x, y, palette.colorData[pix]);
		});
		result.writeToPng(fileName);
	}
}

// ---------- Your program ------------
const conv = new MasterPack(true);

const palettes = [
	conv.createPalette('Default'),
	conv.createPalette('Mario'),
	conv.createPalette('Level1'),
	conv.createPalette('Text'),
];

conv.addSprite(Sprite.fromImage('gradient',
	Texture.fromPng32('gfx/gradient.png'), palettes[0]));

// conv.addSprite(Sprite.fromImage('font',
// 	Texture.fromPng32('gfx/font.png'), palettes[0]));

conv.addSprite(Sprite.fromImage('mario',
	Texture.fromPng32('gfx/mario-luigi-2.png').subtexture(80, 32, 224, 16), palettes[1]));

const tileset = Tileset.blank('level1-til', 8, 8, 32, 32, [palettes[2]]);
// TODO Florian -- Map conversion should first create an "optimized" tileset in 32-bit, then make a real tileset out of it, then map the tiles to the map with extended palette info
const map = Map.fromImage('level1',
	Texture.fromPng32('gfx/mario-1-1.png'), tileset);
conv.addTileset(tileset);
conv.addMap(map);

// TODO Florian -- Way to addTileset passing a sprite and a tile size
// TODO Florian -- Doesn't work because the tileset always adds a transparent tile… this should be an option of the map?
// TODO Florian -- Refactor to remove Sprite and use Tileset only
const textTileset = Tileset.fromImage('text', Texture.fromPng32('gfx/font.png'), 8, 8, [palettes[3]]);
conv.addTileset(textTileset);
conv.addMap(Map.blank('text', 40, 32, textTileset));

//if (USE_BIG_PALETTES) {
//	while (palettes[0].colorData.length < 127)
//		palettes[0].colorData.push(0);
//	// 127=red
//	palettes[0].colorData.push(0xffff0000);
//	// 128=green
//	palettes[0].colorData.push(0xff00ff00);
//	// 129=blue
//	palettes[0].colorData.push(0xff0000ff);
//	while (palettes[0].colorData.length < 254)
//		palettes[0].colorData.push(0);
//	// 254=yellow
//	palettes[0].colorData.push(0xffffff00);
//	// 255=magenta
//	palettes[0].colorData.push(0xffff00ff);
//
//	conv.sprites.texture.setPixel(0, 0, 127);
//	conv.sprites.texture.setPixel(1, 0, 128);
//	conv.sprites.texture.setPixel(2, 0, 129);
//	conv.sprites.texture.setPixel(3, 0, 254);
//	conv.sprites.texture.setPixel(4, 0, 255);
//}
//else {
//	while (palettes[0].colorData.length < 7)
//		palettes[0].colorData.push(0);
//	// 7=red
//	palettes[0].colorData.push(0xffff0000);
//	// 8=green
//	palettes[0].colorData.push(0xff00ff00);
//	// 9=blue
//	palettes[0].colorData.push(0xff0000ff);
//	while (palettes[0].colorData.length < 14)
//		palettes[0].colorData.push(0);
//	// 14=yellow
//	palettes[0].colorData.push(0xffffff00);
//	// 15=magenta
//	palettes[0].colorData.push(0xffff00ff);
//
//	conv.sprites.texture.setPixel(0, 0, 7);
//	conv.sprites.texture.setPixel(1, 0, 8);
//	conv.sprites.texture.setPixel(2, 0, 9);
//	conv.sprites.texture.setPixel(3, 0, 14);
//	conv.sprites.texture.setPixel(4, 0, 15);
//}

// TODO Florian -- Option to create that from command line
conv.pack(true);
// ---------- End program ------------

