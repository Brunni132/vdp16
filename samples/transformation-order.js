import {loadVdp, runProgram} from "./vdp/runloop";
import {mat3} from 'gl-matrix-ts';

const TextLayer = {
	/**
	 * @param vdp {VDP}
	 */
	setup: function(vdp) {
		this.vdp = vdp;
		this.tileset = vdp.sprite('text');
		this.mapWidth = vdp.map('text').w;
		this.map = vdp.readMap('text', vdp.SOURCE_BLANK);
	},
	clear: function() {
		this.map.fill(0);
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
			this.map[this.mapWidth * y + x + i] = this.getCharTile(text.charCodeAt(i));
		}
	},
	drawLayer: function() {
		const buffer = [];
		for (let i = 0; i < 256; i++) {
			const mat = mat3.create();
			// Like this, it will scale and then move, meaning that the screen is double-sized and one tile (8 pixels) is scrolled left (16 pixels with double size). The 'translate x' parameter of the matrix is 8.
			// If we reversed those 2 lines, only half a tile would be scrolled, because we'd scroll 8 pixels and then scale, but 8 pixels is only half a 16x16 double-sized tile. The 'translate x' parameter of the matrix would be 4.
			mat3.translate(mat, mat, [8, 0]);
			mat3.scale(mat, mat, [0.5, 0.5]);
			// This scrolls an additional tile left (16/2=8), then scales the whole render x1.5, giving a x3 render centered around the 3rd tile
			mat3.translate(mat, mat, [16, 0]);
			mat3.scale(mat, mat, [0.75, 0.75]);
			// This is always necessary as the linebuffer always places the origin at the current line (like the GBA)
			mat3.translate(mat, mat, [0, i]);

			// Another sample
			//// The order is as is: advance so that the origin is at the texture center (128, 128)
			//mat3.translate(mat, mat, [128, 128]);
			//// Then rotate around the center
			//mat3.rotate(mat, mat, loop / 800);
			//// Now we're into a rotated world. Scaling doesn't affect this (it touches 2 independent matrix entries).
			//mat3.scale(mat, mat, [3, 3]);
			//// Then we translate back, in the rotated space. We'll only go partially back to the original place because of the transformation, which is what gives the impression of scaling/rotating around the center.
			//mat3.translate(mat, mat, [-128, -128]);

			//// The order is as is: advance so that the origin is at the texture center (128, 128)
			//mat3.translate(mat, mat, [8, 0]);
			//// Then rotate around the center
			////mat3.rotate(mat, mat, loop / 800);
			//// Now we're into a rotated world. Scaling doesn't affect this (it touches 2 independent matrix entries).
			//mat3.scale(mat, mat, [0.5, 0.5]);
			//// Then we translate back, in the rotated space.
			//mat3.translate(mat, mat, [-8, -0]);

			buffer.push(mat);
		}

		// Update and draw
		this.vdp.writeMap('text', this.map);
		this.vdp.drawBackgroundMap('text', { linescrollBuffer: buffer });
	}
};

/** @param vdp {VDP} */
function *main(vdp) {
	TextLayer.setup(vdp);
	TextLayer.clear();
	TextLayer.drawText(0, 0, `Hello world`);

	while (true) {
		TextLayer.drawLayer();
		yield;
	}
}

loadVdp(document.querySelector("#glCanvas")).then(vdp => runProgram(vdp, main(vdp)));
