const assert = require('assert');
const Texture = require("./texture");

class Tile {

	/**
	 * @param {number} width
	 * @param {number} height
	 */
	constructor(width, height) {
		this.width = width;
		this.height = height;
		this.pixelData = new Array(this.width * this.height);
	}

	/**
	 * @param {Texture} texture
	 * @param {Palette} palette
	 * @return {Tile}
	 */
	static fromImage32(texture, palette) {
		const result = new Tile(texture.width, texture.height);
		texture.forEachPixel((pixel, x, y) => {
			// Add colors to the palette (or find them if they're already)
			result.pixelData[y * result.width + x] = palette.pixelNumberInsidePalette(pixel);
		});
		return result;
	}

	equalsTile(otherTile) {
		if (this.width !== otherTile.width || this.height !== otherTile.height) return false;
		for (let i = 0; i < this.pixelData.length; i++) {
			if (this.pixelData[i] !== otherTile.pixelData[i]) return false;
		}
		return true;
	}

	/**
	 * @param x {number}
	 * @param y {number}
	 * @returns {number}
	 */
	getPixel(x, y) {
		return this.pixelData[this.width * y + x];
	}
}

/**
 * Similar to Sprite.
 * @see {Sprite}
 */
class Tileset {

	/**
	 * @param name {string}
	 * @param tileWidth {number}
	 * @param tileHeight {number}
	 * @param tilesWide {number}
	 * @param tilesTall {number}
	 * @param palettes {Palette[]}
	 */
	constructor(name, tileWidth, tileHeight, tilesWide, tilesTall, palettes) {
		assert(palettes.length === 1, 'Does support only one palette for now');
		this.name = name;
		this.tileWidth = tileWidth;
		this.tileHeight = tileHeight;
		this.tilesWide = tilesWide;
		this.tilesTall = tilesTall;
		this.palettes = palettes;
		/** @type {Tile[]} */
		this.tiles = [];
	}

	static blank(name, tileWidth, tileHeight, tilesWide, tilesTall, palettes) {
		return new Tileset(name, tileWidth, tileHeight, tilesWide, tilesTall, palettes);
	}

	/***
	 *
	 * @param mappedTile {Tile}
	 * @returns {number} tile number in tileset
	 */
	addTile(mappedTile) {
		if (this.tiles.length >= this.maxTiles) {
			throw new Error(`Max ${this.tiles.length} tiles reached for tileset ${this.name}`);
		}

		this.tiles.push(mappedTile);
		return this.tiles.length -1;
	}

	/**
	 * @param {Texture} destTexture destination sprite texture receiving texel data (4 or 8 bit).
	 * @param {number} xDest
	 * @param {number} yDest
	 */
	copyToTexture(destTexture, xDest, yDest) {
		for (let k = 0; k < this.tiles.length; k++) {
			const { x, y } = this.tilePosition(k);
			let ptr = 0;

			for (let j = 0; j < this.tileHeight; j++) {
				for (let i = 0; i < this.tileHeight; i++) {
					destTexture.setPixel(xDest + x + i, yDest + y + j, this.tiles[k].pixelData[ptr++]);
				}
			}
		}
	}

	/**
	 * @param texture {Texture}
	 * @param paletteNo {number} palette to use
	 * @returns {number} tile number in tileset
	 */
	findOrAddTile(texture, paletteNo) {
		const resultConverted = Tile.fromImage32(texture, this.palettes[paletteNo]);

		for (let k = 0; k < this.tiles.length; k++) {
			if (resultConverted.equalsTile(this.tiles[k])) {
				return k;
			}
		}

		return this.addTile(resultConverted);
	}

	/** @returns {number} */
	get maxTiles() {
		return this.tilesWide * this.tilesTall;
	}

	/**
	 * @param tileNo {number}
	 * @returns {{x: number, y: number}}
	 */
	tilePosition(tileNo) {
		assert(tileNo <= this.tiles.length);
		return { x: (tileNo % this.tilesWide) * this.tileWidth, y: Math.floor(tileNo / this.tilesWide) * this.tileHeight };
	}

	/** @returns {number} */
	get usedHeight() {
		return Math.ceil(this.tiles.length / this.tilesWide) * this.tileWidth;
	}

	/** @returns {number} */
	get usedWidth() {
		return Math.min(this.tiles.length, this.tilesWide) * this.tileHeight;
	}
}

class Map {

	/**
	 * @param name {string}
	 * @param width {number}
	 * @param height {number}
	 * @param tileset {Tileset}
	 */
	constructor(name, width, height, tileset) {
		this.name = name;
		this.width = width;
		this.height = height;
		this.tileset = tileset;
		/** @type {Texture} */
		this.mapData = Texture.blank(name, width, height, 16);
	}

	/**
	 * Generates a tilemap based on an image that may contain the same tiles multiple times. It adds tiles to the tileset
	 * and palettes referenced by it.
	 * @param name {string}
	 * @param image {Texture} original image (full color)
	 * @param tileset {Tileset} adds to it
	 * @returns {Map}
	 */
	static fromImage(name, image, tileset) {
		const mapWidth = Math.ceil(image.width / tileset.tileWidth);
		const mapHeight = Math.ceil(image.height / tileset.tileHeight);
		const map = new Map(name, mapWidth, mapHeight, tileset);

		// Subdivide in tiles
		for (let j = 0; j < mapHeight; j++) {
			for (let i = 0; i < mapWidth; i++) {
				const tile = image.subtexture(i * tileset.tileWidth, j * tileset.tileHeight, tileset.tileWidth, tileset.tileHeight);
				map.setTile(i, j, tileset.findOrAddTile(tile, 0));
			}
		}
		return map;
	}

	getTile(x, y) {
		return this.mapData.getPixel(x, y);
	}

	setTile(x, y, tile) {
		this.mapData.setPixel(x, y, tile);
	}
}

module.exports = {
	Map,
	Tile,
	Tileset,
};
