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
	 * @param width
	 * @param height
	 * @returns {Tile}
	 */
	static filledWithZero(width, height) {
	 	const result = new Tile(width, height);
	 	for (let i = 0; i < result.width * result.height; i++) {
			result.pixelData[i] = 0;
		}
		return result;
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

	/**
	 * @param otherTile {Tile} tile to compare to
	 * @param [tolerance=0] {number} number of different pixels allowed
	 * @returns {boolean}
	 */
	equalsTile(otherTile, tolerance=0) {
		if (this.width !== otherTile.width || this.height !== otherTile.height) return false;
		for (let i = 0; i < this.pixelData.length; i++) {
			if (this.pixelData[i] !== otherTile.pixelData[i]) {
				if (tolerance-- === 0) return false;
			}
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
	 * @param [firstTileEmpty=false] {boolean}
	 */
	constructor(name, tileWidth, tileHeight, tilesWide, tilesTall, palettes, firstTileEmpty=false) {
		assert(palettes.length === 1, 'Does support only one palette for now');
		assert((tilesWide * tilesTall) >= 1, 'At least one tile required in tileset');
		/** @type {string} */
		this.name = name;
		/** @type {number} */
		this.tileWidth = tileWidth;
		/** @type {number} */
		this.tileHeight = tileHeight;
		/** @type {number} */
		this.tilesWide = tilesWide;
		/** @type {number} */
		this.tilesTall = tilesTall;
		/** @type {Palette[]} */
		this.palettes = palettes;
		/** @type {Tile[]} */
		this.tiles = [];

		// First tile is always transparent
		if (firstTileEmpty) this.tiles.push(Tile.filledWithZero(tileWidth, tileHeight));
	}

	/**
	 * Makes a blank tileset.
	 * @param name {string}
	 * @param tileWidth {number}
	 * @param tileHeight {number}
	 * @param tilesWide {number}
	 * @param tilesTall {number}
	 * @param palettes {Palette[]}
	 * @returns {Tileset}
	 */
	static blank(name, tileWidth, tileHeight, tilesWide, tilesTall, palettes) {
		return new Tileset(name, tileWidth, tileHeight, tilesWide, tilesTall, palettes);
	}

	/**
	 * Constructs a tileset from an image
	 * @param name {string}
	 * @param texture {Texture}
	 * @param tileWidth {number}
	 * @param tileHeight {number}
	 * @param palettes {Palette[]}
	 * @returns {Tileset}
	 */
	static fromImage(name, texture, tileWidth, tileHeight, palettes) {
		assert(texture.width % tileWidth === 0 || texture.height % tileHeight === 0, `Undividable tileset ${texture.width}x${texture.height} by ${tileWidth}x${tileHeight}`);

		const tilesWide = Math.ceil(texture.width / tileWidth);
		const tilesTall = Math.ceil(texture.height / tileHeight);
		const result = new Tileset(name, tileWidth, tileHeight, tilesWide, tilesTall, palettes);

		for (let y = 0; y < tilesTall; y++) {
			for (let x = 0; x < tilesWide; x++) {
				result.addTile(Tile.fromImage32(texture.subtexture(x * tileWidth, y * tileHeight, tileWidth, tileHeight), palettes[0]));
			}
		}
		return result;
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
	 * @param [tolerance=0] {number} tolerates a certain number of different pixels
	 * @returns {number} tile number in tileset
	 */
	findOrAddTile(texture, paletteNo, tolerance=0) {
		const resultConverted = Tile.fromImage32(texture, this.palettes[paletteNo]);

		for (let k = 0; k < this.tiles.length; k++) {
			if (resultConverted.equalsTile(this.tiles[k], tolerance)) {
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
		// TODO Florian -- Can create map without tileset (null)
		this.name = name;
		this.width = width;
		this.height = height;
		this.tileset = tileset;
		/** @type {Texture} */
		this.mapData = Texture.blank(name, width, height, 16);
	}

	/**
	 * Creates a blank map space in ROM.
	 * @param name {string}
	 * @param cellsWide {number}
	 * @param cellsTall {number}
	 * @param tileset {Tileset}
	 * @returns {Map} new instance
	 */
	static blank(name, cellsWide, cellsTall, tileset) {
		return new Map(name, cellsWide, cellsTall, tileset);
	}

	/**
	 * Generates a tilemap based on an image that may contain the same tiles multiple times. It adds tiles to the tileset
	 * and palettes referenced by it.
	 * @param name {string}
	 * @param image {Texture} original image (full color)
	 * @param tileset {Tileset} adds to it
	 * @param [tolerance=0] {number} tolerates a certain number of different pixels in tiles
	 * @returns {Map} new instance
	 */
	static fromImage(name, image, tileset, tolerance=0) {
		const mapWidth = Math.ceil(image.width / tileset.tileWidth);
		const mapHeight = Math.ceil(image.height / tileset.tileHeight);
		const map = new Map(name, mapWidth, mapHeight, tileset);

		// Subdivide in tiles
		for (let j = 0; j < mapHeight; j++) {
			for (let i = 0; i < mapWidth; i++) {
				const tile = image.subtexture(i * tileset.tileWidth, j * tileset.tileHeight, tileset.tileWidth, tileset.tileHeight);
				map.setTile(i, j, tileset.findOrAddTile(tile, 0, tolerance));
			}
		}
		return map;
	}

	/**
	 * @param {Texture} destTexture destination map texture receiving texel data (16 bit).
	 * @param {number} xDest
	 * @param {number} yDest
	 */
	copyToTexture(destTexture, xDest, yDest) {
		let k = 0;
		for (let j = 0; j < this.height; j++) {
			for (let i = 0; i < this.width; i++) {
				destTexture.setPixel(xDest + i, yDest + j, this.mapData.pixelData[k++]);
			}
		}
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
