/**
 * @param vdp {VDP}
 * @returns {IterableIterator<number>}
 */
import {loadVdp, runProgram} from "./vdp/vdp";
import * as color32 from "./vdp/color32";
import {SCREEN_HEIGHT, SCREEN_WIDTH} from "./vdp/shaders";

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
	while (true) {
		// if (frameNo % 10 === 0) {
		// 	const firstCol = palData[1];
		// 	for (let i = 1; i < palData.length - 1; i++)
		// 		palData[i] = palData[i + 1];
		// 	palData[palData.length - 1] = firstCol;
		// 	vdp.writePalette('Level1', palData);
		// }
		// frameNo++;

		const gl = vdp.gl;
		vdp.setBlendMethod('none');
		vdp.drawBG('level1', { scrollX: scroll, winW: SCREEN_WIDTH * 0.75, prio: 1 });
		vdp.drawBG('level1', { scrollX: scroll, winX: SCREEN_WIDTH * 0.75, prio: 1, palette: 'Mario' });

		vdp.setBlendMethod('color', 0x0777, 0xffff);

		// Take the (0, 0, 16, 16) part of the big mario sprite
		const marioSprite = vdp.sprite('mario').offsetted(0, 0, 16, 16);
		// And draw it 32x32 (2x zoom)
		vdp.drawObj(marioSprite, scroll + 16, 160, {width: -32, height: 32, prio: 3 });

		vdp.drawObj('gradient', 0, 180, { height: 8, prio: 1 });
		vdp.drawObj('gradient', 0, 172, { height: 8, palette: 'Level1', prio: 1 });

		scroll += 0.05;


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

loadVdp(document.querySelector("#glCanvas")).then(vdp => runProgram(vdp, main(vdp)));
