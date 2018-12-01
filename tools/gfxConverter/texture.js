const assert = require('assert');
const fs = require('fs'), PNG = require('pngjs').PNG;

module.exports = class Texture {
	constructor(width, height, bitDepth) {
		this.width = width;
		this.height = height;
		this.bpp = bitDepth / 8;

		assert(this.bpp === 1 || this.bpp === 2 || this.bpp === 4);
		assert(this.width % this.bpp === 0);
		this.pixelData = new Array(this.width * this.height);
	}

	static blank(width, height, bitDepth) {
		return new Texture(width, height, bitDepth);
	}

	// Read a png and interprets it as a 8 bit texture (each RGBA component is one pixel in the resulting texture, which has 4x the width of the original texture)
	static readFromPng8(srcFileName) {
		const data = fs.readFileSync(srcFileName);
		const png = PNG.sync.read(data);
		const result = new Texture(png.width * 4, png.height, 8);
		for (let x = 0; x < png.height * png.width * 4; x++) {
			result.pixelData[x] = png.data[x];
		}
		return result;
	}

	static readFromPng16(srcFileName) {
		const data = fs.readFileSync(srcFileName);
		const png = PNG.sync.read(data);
		const result = new Texture(png.width, png.height, 16);
		for (let x = 0; x < png.height * png.width * 4; x += 2) {
			result.pixelData[x] = png.data[x] + (png.data[x + 1] << 8);
		}
		return result;
	}

	// Read a png as a 32 bit texture directly. Same width as original.
	static readFromPng32(srcFileName) {
		const data = fs.readFileSync(srcFileName);
		const png = PNG.sync.read(data);
		const result = new Texture(png.width, png.height, 32);
		for (let x = 0; x < png.height * png.width * 4; x += 4) {
			result.pixelData[x] = png.data[x] + (png.data[x + 1] << 8) + (png.data[x + 2] << 16) + (png.data[x + 3] << 24);
		}
		return result;
	}

	forEachPixelLinear(cb) {
		for (let x = 0; x < this.width * this.height; x++) {
			cb(this.pixelData[x], x);
		}
	}

	forEachPixel(cb) {
		for (let y = 0; y < this.height; y++)
			for (let x = 0; x < this.width; x++) {
				cb(this.pixelData[x], x, y);
			}
	}

	getPixel(x, y) {
		return this.pixelData[y * this.width + x];
	}

	makeSubtexture(x, y, width, height) {
		const result = Texture.blank(width, height, this.bpp * 8);
		for (let j = 0; j < result.height; j++) {
			for (let i = 0; i < result.width; i++) {
				result.setPixel(i, j, this.getPixel(i + x, j + y));
			}
		}
		return result;
	}

	setPixel(x, y, pix) {
		if ((pix >> (this.bpp * 8)) !== 0) {
			throw new Error(`${pix} too big to be written to a ${this.bpp * 8}bpp texture`);
		}
		this.pixelData[Math.floor(y) * this.width + Math.floor(x)] = pix;
	}

	// Writes the texture as a PNG file. Depending on the BPP, the texture will be smaller than the width specified.
	// For instance, a 1024x1024, 8bpp texture will be written to the disk as a 256x1024, 32bpp texture.
	writeToPng(destFileName) {
		const mapPng = new PNG({
			width: Math.floor(this.width * this.bpp / 4),
			height: this.height,
			filterType: -1,
			colorType: 6
		});

		let dstIdx = 0;
		for (let x = 0; x < this.height * this.width; x++) {
			mapPng.data[dstIdx++] = this.pixelData[x] & 0xff;
			if (this.bpp >= 2) mapPng.data[dstIdx++] = (this.pixelData[x] >> 8) & 0xff;
			if (this.bpp >= 3) mapPng.data[dstIdx++] = (this.pixelData[x] >> 16) & 0xff;
			if (this.bpp >= 4) mapPng.data[dstIdx++] = (this.pixelData[x] >> 24) & 0xff;
		}

		mapPng.pack().pipe(fs.createWriteStream(destFileName));
	}
};
