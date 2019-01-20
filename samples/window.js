import {startGame, SCREEN_WIDTH, SCREEN_HEIGHT, VDPCopySource} from "./lib-main";

const TextLayer = {
	setup: function(vdp) {
		this.vdp = vdp;
		this.tileset = vdp.sprite('text');
		this.mapWidth = vdp.map('text').w;
		this.map = vdp.readMap('text', VDPCopySource.blank);
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
	drawLayer: function(opacity) {
		this.vdp.writeMap('text', this.map);
		this.vdp.drawBackgroundTilemap('text');
	}
};

/** @param vdp {VDP} */
function *main(vdp) {

	TextLayer.setup(vdp);
	TextLayer.drawText(10, 15, 'Window demo');

	while (true) {
		TextLayer.drawText(10, 16, ' From top  ');
		for (let loop = 0; loop < SCREEN_HEIGHT; loop++) {
			vdp.drawBackgroundTilemap('level2', {winY: loop});
			vdp.drawWindowTilemap('top', 'level1');
			TextLayer.drawLayer();
			yield;
		}

		TextLayer.drawText(10, 16, 'From bottom');
		for (let loop = 0; loop < SCREEN_HEIGHT; loop++) {
			vdp.drawBackgroundTilemap('level1', {winH: 255 - loop});
			vdp.drawWindowTilemap('bottom', 'level2');
			TextLayer.drawLayer();
			yield;
		}

		TextLayer.drawText(10, 16, ' From left ');
		for (let loop = 0; loop < SCREEN_WIDTH; loop++) {
			vdp.drawBackgroundTilemap('level2', {winX: loop});
			vdp.drawWindowTilemap('left', 'level1');
			TextLayer.drawLayer();
			yield;
		}

		TextLayer.drawText(10, 16, 'From right ');
		for (let loop = 0; loop < SCREEN_HEIGHT; loop++) {
			vdp.drawBackgroundTilemap('level1', {winW: 255 - loop});
			vdp.drawWindowTilemap('right', 'level2');
			TextLayer.drawLayer();
			yield;
		}
	}
}

startGame('#glCanvas', vdp => main(vdp));
