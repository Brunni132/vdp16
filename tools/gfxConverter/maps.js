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
		const result = new Tile(texture.width, texture.height, palette);
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

	/***
	 *
	 * @param mappedTile {Tile}
	 * @returns {boolean}
	 */
	addTile(mappedTile) {
		if (this.tiles.length >= this.tilesWide * this.tilesTall) {
			throw new Error(`Max ${this.tiles.length} tiles reached for tileset ${this.name}`);
		}

		this.tiles.push(mappedTile);
	}

	/**
	 * @param {Texture} destTexture
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

	findOrAddTile(texture, paletteNo) {
		const resultConverted = Tile.fromImage32(texture, this.palettes[paletteNo]);

		for (let k = 0; k < this.tiles.length; k++) {
			if (resultConverted.equalsTile(this.tiles[k])) {
				return k;
			}
		}

		return this.addTile(resultConverted);
	}

	/**
	 * @param tileNo {number}
	 * @returns {{x: number, y: number}}
	 */
	tilePosition(tileNo) {
		assert(tileNo < this.tilesWide * this.tilesTall && tileNo <= this.usedTiles);
		return { x: (tileNo % this.tilesWide) * this.tileWidth, y: Math.floor(tileNo / this.tilesWide) * this.tileWidth };
	}
}

/**
 * @param image {Texture} original image (full color)
 * @param tileset {Tileset} adds to it
 * @returns {ArrayBuffer} map data (16 bit)
 */
export function generateTilemapFromImage(image, tileset) {

	const mapWidth = Math.ceil(image.width / tileset.tileWidth);
	const mapHeight = Math.ceil(image.height / tileset.tileHeight);
	const mapData = new ArrayBuffer(mapWidth * mapHeight);

	// Subdivide in tiles
	for (let j = 0; j < mapHeight; j++) {
		for (let i = 0; i < mapWidth; i++) {
			const tile = image.subtexture(i * tileset.tileWidth, j * tileset.tileHeight, tileset.tileWidth, tileset.tileHeight);
			mapData[j * mapHeight + i] = tileset.findOrAddTile(tile, 0);
		}
	}

	return mapData;
}


