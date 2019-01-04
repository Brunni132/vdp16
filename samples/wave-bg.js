import {loadVdp, runProgram} from "./vdp/runloop";
import {color32} from "./vdp/color32";
import { mat3 } from 'gl-matrix-ts';
import {VDPCopySource} from "./vdp/vdp";

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

	let loop = 0;
	while (true) {
		// TODO Florian -- A good framework for that…
		const buffer = [];
		for (let i = 0; i < 256; i++) {
			const mat = mat3.create();
			mat3.translate(mat, mat, [Math.sin((i + loop) / 20) * 10, i]);
			buffer.push(mat);
		}

		vdp.drawBG('level1', { linescrollBuffer: buffer, scrollX: 0 });
		TextLayer.drawLayer();

		const chars = Math.min(loop, 255).toString(16);
		vdp.configOBJTransparency({ op: 'add', blendDst: '#000', blendSrc: `#${chars}${chars}${chars}`});
		vdp.drawObj('gradient', 0, 180, { prio: 2, width: 256, height: 16, transparent: true});

		loop += 1;
		yield 0;
	}
}

loadVdp(document.querySelector("#glCanvas")).then(vdp => runProgram(vdp, main(vdp)));
