/**
 * @param vdp {VDP}
 * @returns {IterableIterator<number>}
 */
import {loadVdp, runProgram} from "./vdp/runloop";
import {color32} from "./vdp/color32";

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
		// Update and draw
		this.vdp.writeMap('text', this.map);
		this.vdp.drawBG('text');
	}
};

/** @param vdp {VDP} */
function *main(vdp) {
	TextLayer.setup(vdp);
	TextLayer.clear();
	TextLayer.drawText(0, 0, `Hello world`);

	const pal = vdp.readPalette('text');
	pal[1] = color32.parse('#ff0');
	vdp.writePalette('text', pal);

	while (true) {
		vdp.drawBG('level1');
		TextLayer.drawLayer();


		yield 0;
	}
}

loadVdp(document.querySelector("#glCanvas")).then(vdp => runProgram(vdp, main(vdp)));
