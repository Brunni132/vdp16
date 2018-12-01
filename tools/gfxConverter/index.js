const Texture = require('./texture');

class Palette {

	constructor(name, numColors = 256) {
		// First color is always transparent (RGBA 0000)
		this.colorData = [0];
		this.maxColors = numColors;
		this.name = name;
	}

	initFromImage32(texture) {
		texture.forEachPixelLinear((color) => {
			this.pixelNumberInsidePalette(color, true);
		});
	}

	copyToTexture32(destTexture, x, y) {
		for (let i = 0; i < this.usedColors; i++) {
			destTexture.setPixel(x + i, y, this.colorData[i]);
		}
	}

	// May return -1 if the color is not found and allowCreate = false or palette is full
	pixelNumberInsidePalette(pixel, allowCreate = true) {
		const found = this.colorData.indexOf(color);
		if (found >= 0 || !allowCreate) return found;

		assert(this.colorData.length < this.maxColors, 'too many colors');
		this.colorData.push(color);
		return this.colorData.length - 1;
	}
}

class MasterSpriteTexture {

	constructor(spriteTexture) {
		this.currentLineX = 0;
		this.currentLineY = 0;
		this.currentLineHeight = 0;
		this.width = spriteTexture.width;
		this.height = spriteTexture.height;
		this.texture = spriteTexture;
	}

	addSprite(sprite) {
		// Need a new line?
		if (this.remainingSpace().x < sprite.width) {
			this.startNewLine();
		}

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
}

class Sprite {

	/*
	 * @param {Number} width
	 * @param {Number} height
	 * @param {Palette} palette
	 * @param {String} name
	 */
	constructor(width, height, palette, name) {
		this.width = width;
		this.height = height;
		this.palette = palette;
		this.name = name;
		this.pixelData = new Array(this.width * this.height);
	}

	/*
	 * @param {String} name
	 * @param {Texture} texture
	 * @param {Palette} palette
	 */
	static fromImage32(name, texture, palette) {
		const result = new Sprite(texture.width, texture.height, palette, name);
		texture.forEachPixel((pixel, x, y) => {
			// Add colors to the palette (or find them if they're already)
			const color = palette.pixelNumberInsidePalette(pixel);
			result.pixelData[y * this.width + x] = color;
		});
	}

	/*
	 * @param {Texture} destTexture
	 * @param {Number} x
	 * @param {Number} y
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

const mapTex = Texture.blank(2048, 1024, 16);
const spriteTex = Texture.blank(4096, 1024, 8);
const paletteTex = Texture.blank(256, 256, 32);

const palettes = [ new Palette('Default palette')];
const masterSpriteList = new MasterSpriteTexture(spriteTex);

// Convert all palettes to the palette tex
for (let j = 0; j < palettes.length; j++) {
	palettes[j].copyToTexture32(paletteTex, 0, j);
}

// Write all textures
mapTex.writeToPng('maps.png');
spriteTex.writeToPng('sprites.png');
paletteTex.writeToPng('palettes.png');
