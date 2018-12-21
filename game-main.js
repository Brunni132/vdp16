/**
 * @param vdp {VDP}
 * @returns {IterableIterator<number>}
 */
import {loadVdp, runProgram} from "./vdp/runloop";
import {SCREEN_WIDTH} from "./vdp/shaders";
import {color16} from "./vdp/color16";

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
	let scroll = 0;

	// const mapData = vdp.readMap('level1');
	// mapData.forEach((d, i) => {
	// 	mapData[i] = Math.max(0, mapData[i] - 4);
	// });
	// vdp.writeMap('level1', mapData);

	// const palData = vdp.readPalette('Level1');
	//palData.forEach((d, i) => {
	//	palData[i] = color32.blend(d, 0xff000000, 0);
	//});
	//vdp.writePalette('Level1', palData);

	// const defaultPal = vdp.readPalette('Default');
	// for (let i = 0; i < defaultPal.length; i++)
	// 	defaultPal[i] = i << 24 | 0xffffff;
	// vdp.writePalette('Default', defaultPal);

	//const defaultSprite = vdp.readSprite('gradient');
	//for (let i = 0; i < 256; i++)
	//	defaultSprite[i] = i % 16;
	//vdp.writeSprite('gradient', defaultSprite);

	TextLayer.setup(vdp);
	TextLayer.clear();

	const pal = vdp.readPalette('Mario');
	pal.forEach((c, i) => pal[i] = color16.blend(pal[i], 0xf00f, 0.5));
	vdp.writePalette('Mario', pal);

	//const pal2 = vdp.readPalette('Mario');
	//pal2.forEach((col, i) => {
	//	const c = color16.extract(pal2[i]);
	//	c.r = 15;
	//	pal2[i] = color16.make(c);
	//});
	//vdp.writePalette('Mario', pal2);

	//const map = vdp.readMap('level1');


	// function printCol(c) {
	// 	console.log(`TEMP `, (c & 0xff),
	// 		(c >>> 8 & 0xff),
	// 		(c >>> 16 & 0xff),
	// 		(c >>> 24 & 0xff));
	// }
	// printCol(vdp._getColor(0x11121314));

	// const trans = mat3.create();
	// mat3.scale(trans, trans, [2, 2]);
	// vdp.configOBJTransform({ obj1Transform: trans });

	const pals = vdp.readPaletteMemory(0, 0, 256, 5, vdp.SOURCE_CURRENT);
	pals.forEach((col, i) => pals[i] = 0);
	vdp.writePaletteMemory(0, 0, 256, 5, pals);


	while (true) {
		//if (scroll === 620) {
		//	const originalPal = vdp.readPalette('Mario', vdp.SOURCE_ROM);
		//	vdp.writePalette('Mario', originalPal);
		//}

		if (scroll >= 0 && scroll < 200 && scroll % 2 === 0 || scroll >= 500 && scroll < 600) {
			const rom = vdp.readPaletteMemory(0, 0, 256, 5, vdp.SOURCE_ROM);
			const current = vdp.readPaletteMemory(0, 0, 256, 5, vdp.SOURCE_CURRENT);
			rom[0] = 0xbfff;
			current.forEach((col, i) => {
				const finalCol = color16.extract(rom[i]);
				let {r, g, b} = color16.extract(current[i]);

				if (finalCol.b > b) b += 1;
				else if (finalCol.g > g) g += 1;
				else if (finalCol.r > r) r += 1;

				current[i] = color16.make(r, g, b);
			});
			vdp.writePaletteMemory(0, 0, 256, 5, current);
		}

		if (scroll >= 200 && scroll <= 400 && scroll % 4 === 0) {
			const pals = vdp.readPaletteMemory(0, 0, 256, 5, vdp.SOURCE_CURRENT);
			pals.forEach((col, i) => {
				let { r, g, b } = color16.extract(col);
				if (r > 0) r -= 1;
				else if (g > 0) g -= 1;
				else if (b > 0) b -= 1;
				pals[i] = color16.make(r, g, b);
			});
			vdp.writePaletteMemory(0, 0, 256, 5, pals);
		}

		// Note: reading from VRAM is very slow
		// const palData = vdp.readPalette('Mario');
		// const val = Math.floor(Math.min(15, scroll / 16));
		// palData.forEach((v, i) => {
		// 	palData[i] = val << 4 | val << 8 | val << 12;
		// });
		// vdp.writePalette('Mario', palData);

		// if (frameNo % 10 === 0) {
		// 	const firstCol = palData[1];
		// 	for (let i = 1; i < palData.length - 1; i++)
		// 		palData[i] = palData[i + 1];
		// 	palData[palData.length - 1] = firstCol;
		// 	vdp.writePalette('Level1', palData);
		// }
		// frameNo++;

		const gl = vdp.gl;
		// vdp.configFade('#fff', scroll);
		vdp.configBGTransparency({ op: 'add', blendDst: '#fff', blendSrc: '#fff' });
		// vdp.configOBJTransparency({ op: 'sub', blendSrc: '#fff', blendDst: '#fff' });
		// vdp.configOBJTransparency({ op: 'add', blendDst: '#fff', blendSrc: '#000', mask: true });
		vdp.configOBJTransparency({ op: 'add', blendDst: '#888', blendSrc: '#fff', mask: false});
		vdp.drawBG('level1', { scrollX: scroll });
		//vdp.drawBG('level1', { scrollX: scroll, winW: SCREEN_WIDTH * 0.5, prio: 0 });
		//vdp.drawBG('level1', { scrollX: scroll, winX: SCREEN_WIDTH * 0.5, prio: 2, transparent: true });

		TextLayer.drawText(1, 1, `Hello world ${scroll}`);
		TextLayer.drawLayer();

		vdp.drawObj('gradient', 0, 180, { height: 8, prio: 1, transparent: true });
		vdp.drawObj('gradient', 0, 172, { height: 8, palette: 'Level1', prio: 1, transparent: true });

		// Take the (0, 0, 16, 16) part of the big mario sprite
		 const marioSprite = vdp.sprite('mario').offsetted(0, 0, 16, 16);
		// And draw it 32x32 (2x zoom)
		 vdp.drawObj(marioSprite, scroll / 2, 0, {width: -256, height: 256, prio: 0, transparent: false });

		scroll += 1;

		// const spr = vdp.sprite('mario').offsetted(0, 0, 64, 64);
		// const opts = { palette: vdp.palette(spr.designPalette) };
		// for (let j = 0; j < 10; j++) {
		// 	for (let i = 0; i < 100; i++) {
		// 		vdp.drawObj(spr, i, j, opts);
		// 	}
		// }

		yield 0;
	}
}

loadVdp(document.querySelector("#glCanvas"), { resolution: 1 }).then(
	vdp => runProgram(vdp, main(vdp)));
