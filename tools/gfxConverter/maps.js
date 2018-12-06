const Texture = require("./texture");

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
		this.pixelData = new Array(this.tileWidth * this.tilesWide * this.tileHeight * this.tilesTall);
		this.usedTiles = 0;
	}

	/***
	 *
	 * @param mappedTile {ArrayBuffer}
	 * @param paletteNo {number}
	 * @returns {boolean}
	 */
	addTile(mappedTile, paletteNo) {
		if (this.usedTiles >= this.tilesWide * this.tilesTall) {
			throw new Error(`Max ${this.usedTiles} tiles reached for tileset ${this.name}`);
		}

		const { x, y } = this.tilePosition(i);
		const width = this.tileWidth * this.tilesWide;
		for (let j = 0; j < text.height; j++) {
			for (let i = 0; i < mappedTileTex.width; i++) {
				this.setPixel(x + i, y + j, mappedTileTex[j * this.tileWidth + i]);
			}
		}
	}

	/**
	 * @param {Texture} destTexture
	 * @param {number} x
	 * @param {number} y
	 */
	copyToTexture32(destTexture, x, y) {
		let k = 0;
		for (let j = 0; j < this.tileHeight * this.tilesTall; j++) {
			for (let i = 0; i < this.tileWidth * this.tilesWide; i++) {
				destTexture.setPixel(x + i, y + j, this.pixelData[k++]);
			}
		}
	}

	/**
	 *
	 * @param mappedTileTex {ArrayBuffer}
	 * @param x {number} position in this tileset
	 * @param y {number} position in this tileset
	 * @returns {boolean}
	 */
	equalsTile(mappedTileTex, x, y) {
		const width = this.tileWidth * this.tilesWide;
		for (let j = 0; j < mappedTileTex.height; j++) {
			for (let i = 0; i < mappedTileTex.width; i++) {
				if (mappedTileTex[j * this.tileWidth + i] !== this.getPixel(i + x, j + y)) {
					return false;
				}
			}
		}
		return true;
	}

	findOrAddTile(texture, paletteNo) {
		const resultConverted = this.mapImageToPalette(texture, paletteNo);
		for (let i = 0; i < this.usedTiles; i++) {
			const { x, y } = this.tilePosition(i);
			if (this.equalsTile(resultConverted, x, y)) {
				return i;
			}
		}
		return this.addTile(resultConverted, paletteNo);
	}

	/**
	 * @param x {number}
	 * @param y {number}
	 * @returns {number}
	 */
	getPixel(x, y) {
		return this.pixelData[y * this.tileWidth * this.tilesWide + x];
	}

	/**
	 * @param texture {Texture} full-color image (from PNG…)
	 * @param paletteNo {number} 0 to this.palettes.length - 1
	 * @returns {ArrayBuffer} 8-bit texture with the colors from the palette, having optionally added some inside
	 */
	mapImageToPalette(texture, paletteNo) {
		// Use 8-bit for now
		const result = new ArrayBuffer(this.tileWidth * this.tileHeight);
		// Create the necessary colors (works because we use only one palette)
		texture.forEachPixel((pixel, x, y) => {
			result[y * this.tileWidth + x] = this.palettes[paletteNo].pixelNumberInsidePalette(pixel);
		});
		return result;
	}

	/**
	 * @param x {number}
	 * @param y {number}
	 * @param color {number}
	 */
	setPixel(x, y, color) {
		this.pixelData[y * this.tileWidth * this.tilesWide + x] = color;
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
 * @param image {Texture}
 * @param tileset {Tileset}
 */
export function generateTilemapFromImage(image, tileset) {

	const mapWidth = Math.ceil(image.width / tileset.tileWidth);
	const mapHeight = Math.ceil(image.height / tileset.tileHeight);

	// Subdivide in tiles
	for (let j = 0; j < mapHeight; j++) {
		for (let i = 0; i < mapWidth; i++) {
			const tile = image.subtexture(i * tileset.tileWidth, j * tileset.tileHeight, tileset.tileWidth, tileset.tileHeight);


		}
	}


}


