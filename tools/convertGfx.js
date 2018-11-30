const assert = require('assert');
const fs = require('fs'), PNG = require('pngjs').PNG;

class Texture {

	constructor(width, height, bitDepth) {
		this.width = width;
		this.height = height;
		this.bpp = bitDepth / 8;

		assert(this.bpp === 1 || this.bpp === 2 || this.bpp === 4);
		assert(this.width % this.bpp === 0);
		this.pixelData = new Array(this.width * this.height);
	}

	static readFromPng(srcFileName) {
		const data = fs.readFileSync(srcFileName);
		const png = PNG.sync.read(data);
		const result = new Texture(png.width, png.height, 32);
		for (let x = 0; x < png.height * png.width * 4; x++) {
			result.pixelData[x] = png.data[x];
		}
		return result;
	}

	getPixel(x, y) {
		return this.pixelData[y * this.width + x];
	}

	setPixel(x, y, pix) {
		this.pixelData[Math.floor(y) * this.width + Math.floor(x)] = pix;
	}

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
}

const read = Texture.readFromPng('test.png');
for (let i = 0; i < 16; i++)
	for (let j = 0; j < 16; j++)
		console.log(`TEMP `, read.getPixel(j, i));

const testBuffer = new Texture(16, 16, 8);
for (let i = 0; i < 16 * 16; i++) {
	if (i % 4 === 0) testBuffer.setPixel(i % 16, i / 16, 255);
	if (i % 4 === 1) testBuffer.setPixel(i % 16, i / 16, 255);
	if (i % 4 === 2) testBuffer.setPixel(i % 16, i / 16, 64);
	if (i % 4 === 3) testBuffer.setPixel(i % 16, i / 16, 129);
}
testBuffer.writeToPng('test.png');

