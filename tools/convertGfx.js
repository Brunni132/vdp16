const fs = require('fs'),
	PNG = require('pngjs').PNG;

const png = new PNG({
	width: 1024,
	height: 1024,
	filterType: -1
});

for (let y = 0; y < png.height; y++) {
	for (let x = 0; x < png.width; x++) {
		const idx = (png.width * y + x) << 2;
		png.data[idx  ] = 0 + 4 * (x % 2);
		png.data[idx+1] = 1 + 4 * (x % 2);
		png.data[idx+2] = 2 + 4 * (x % 2);
		png.data[idx+3] = 3 + 4 * (x % 2);
	}
}

png.pack().pipe(fs.createWriteStream('sprites.png'));

