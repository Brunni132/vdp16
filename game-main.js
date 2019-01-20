import {startGame, SCREEN_WIDTH, SCREEN_HEIGHT, VDPCopySource} from "./lib-main";

const TextLayer = {
	setup: function(vdp) {
		this.map = vdp.readMap('text2', VDPCopySource.blank);
	},
	getCharTile: function(c) {
		if (c >= 32 && c < 128) return c - 32;
		return 31; // ?
	},
	drawText: function (x, y, text) {
		for (let i = 0; i < text.length; i++) {
			this.map.setElement(x + i, y, this.getCharTile(text.charCodeAt(i)));
		}
	},
	drawLayer: function(vdp) {
		vdp.writeMap('text2', this.map);
		vdp.drawBackgroundTilemap('text2');
	}
};

/** @param vdp {VDP} */
function *main(vdp) {

	TextLayer.setup(vdp);
	TextLayer.drawText(16, 10, 'Window demo');

	while (true) {
		TextLayer.drawText(16, 12, ' From top  ');
		for (let loop = 0; loop < SCREEN_HEIGHT; loop++) {
			vdp.drawBackgroundTilemap('level2', {winY: loop});
			vdp.drawWindowTilemap('level1');
			TextLayer.drawLayer(vdp);
			yield;
		}

		TextLayer.drawText(16, 12, 'From bottom');
		for (let loop = 0; loop < SCREEN_HEIGHT; loop++) {
			vdp.drawBackgroundTilemap('level1', {winH: 255 - loop});
			vdp.drawWindowTilemap('level2');
			TextLayer.drawLayer(vdp);
			yield;
		}

		TextLayer.drawText(16, 12, ' From left ');
		for (let loop = 0; loop < SCREEN_WIDTH; loop++) {
			vdp.drawBackgroundTilemap('level2', {winX: loop});
			vdp.drawWindowTilemap('level1');
			TextLayer.drawLayer(vdp);
			yield;
		}

		TextLayer.drawText(16, 12, 'From right ');
		for (let loop = 0; loop < SCREEN_HEIGHT; loop++) {
			vdp.drawBackgroundTilemap('level1', {winW: 255 - loop});
			vdp.drawWindowTilemap('level2');
			TextLayer.drawLayer(vdp);
			yield;
		}
	}
}

startGame('#glCanvas', vdp => main(vdp));
