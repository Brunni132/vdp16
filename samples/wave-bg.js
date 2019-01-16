import {startGame, color32, LineTransformationArray, VDPCopySource} from "./lib-main";
import { mat3 } from 'gl-matrix';

const TextLayer = {
	/**
	 * @param vdp {VDP}
	 */
	setup: function(vdp) {
		this.vdp = vdp;
		this.tileset = vdp.sprite('text');
		this.mapWidth = vdp.map('text').w;
		this.map = vdp.readMap('text', VDPCopySource.blank);
	},
	clear: function() {
		this.map.buffer.fill(0);
		this.vdp.writeMap('text', this.map);
	},
	getCharTile: function(c) {
		if (c >= '0'.charCodeAt(0) && c <= '9'.charCodeAt(0)) return 1 + c - '0'.charCodeAt(0);
		if (c >= 'a'.charCodeAt(0) && c <= 'z'.charCodeAt(0)) return 17 + c - 'a'.charCodeAt(0);
		if (c >= 'A'.charCodeAt(0) && c <= 'Z'.charCodeAt(0)) return 17 + c - 'A'.charCodeAt(0);
		if (c === ':'.charCodeAt(0)) return 11;
		if (c === '-'.charCodeAt(0)) return 14;
		if (c === ' '.charCodeAt(0)) return 0;
		if (c === '©'.charCodeAt(0)) return 16;
		if (c === '®'.charCodeAt(0)) return 46;
		// ? for all other chars
		return 15;
	},
	drawText: function (x, y, text) {
		for (let i = 0; i < text.length; i++) {
			this.map.setElement(x + i, y, this.getCharTile(text.charCodeAt(i)));
		}
	},
	drawLayer: function() {
		// Update and draw
		this.vdp.writeMap('text', this.map);
		this.vdp.drawBackgroundMap('text');
	}
};

/** @param vdp {VDP} */
function *main(vdp) {
	TextLayer.setup(vdp);
	TextLayer.clear();
	TextLayer.drawText(0, 0, `Hello world`);

	const pal = vdp.readPalette('text');
	pal[1] = color32.make('#ff0');
	vdp.writePalette('text', pal);

	let loop = 0;
	while (true) {
		const buffer = new LineTransformationArray();
		for (let i = 0; i < buffer.length; i++) {
			const mat = mat3.create();
			mat3.translate(mat, mat, [Math.sin((i + loop) / 20) * 10, i]);
			buffer.setLine(i, mat);
		}

		vdp.drawBackgroundMap('level1', { lineTransform: buffer, scrollX: 0 });
		TextLayer.drawLayer();

		loop += 1;
		yield;
	}
}

startGame('#glCanvas', vdp => main(vdp));
