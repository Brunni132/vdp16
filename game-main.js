/**
 * @param vdp {VDP}
 * @returns {IterableIterator<number>}
 */
import {loadVdp, runProgram} from "./vdp/runloop";
import {SCREEN_WIDTH} from "./vdp/shaders";
import {mat3} from "./gl-matrix";

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

	let frameNo = 0;
	vdp.configBDColor('#008');

	// function printCol(c) {
	// 	console.log(`TEMP `, (c & 0xff),
	// 		(c >>> 8 & 0xff),
	// 		(c >>> 16 & 0xff),
	// 		(c >>> 24 & 0xff));
	// }
	// printCol(vdp._getColor(0x11121314));

	 const trans = mat3.create();
	 mat3.scale(trans, trans, [2, 2]);
	 vdp.configOBJTransform({ obj1Transform: trans });

	while (true) {
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
		vdp.configBGTransparency({ op: 'add', blendSrc: '#0ff', blendDst: '#000' });
		// vdp.configOBJTransparency({ op: 'sub', blendSrc: '#fff', blendDst: '#fff' });
		// vdp.configOBJTransparency({ op: 'add', blendDst: '#fff', blendSrc: '#000', mask: true });
		vdp.configOBJTransparency({ op: 'add', blendDst: '#888', blendSrc: '#fff', mask: false});
		vdp.drawBG('level1', { scrollX: scroll, winW: SCREEN_WIDTH * 0.25, prio: 0 });
		vdp.drawBG('level1', { scrollX: scroll, winX: SCREEN_WIDTH * 0.25, prio: 0, transparent: true });

		vdp.drawObj('gradient', 0, 180, { height: 8, prio: 1, transparent: true });
		vdp.drawObj('gradient', 0, 172, { height: 8, palette: 'Level1', prio: 1, transparent: true });

		// Take the (0, 0, 16, 16) part of the big mario sprite
		const marioSprite = vdp.sprite('mario').offsetted(0, 0, 16, 16);
		// And draw it 32x32 (2x zoom)
		vdp.drawObj(marioSprite, scroll + 16, 0, {width: -256, height: 256, prio: 1, transparent: true });

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
