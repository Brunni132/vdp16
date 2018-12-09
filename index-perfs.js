/**
 * @param vdp {VDP}
 * @returns {IterableIterator<number>}
 */
import {loadVdp, runProgram} from "./vdp/vdp";
import * as color32 from "./vdp/color32";
import {SCREEN_WIDTH} from "./vdp/shaders";

/** @param vdp {VDP} */
function *main(vdp) {
	let scroll = 0;

	// const mapData = vdp.readMap('level1');
	// mapData.forEach((d, i) => {
	// 	mapData[i] = Math.max(0, mapData[i] - 4);
	// });
	// vdp.writeMap('level1', mapData);

	const palData = vdp.readPalette('Level1');
	let frameNo = 0;

	palData.forEach((d, i) => {
		palData[i] = color32.blend(d, 0xff000000, 0);
	});
	vdp.writePalette('Level1', palData);

	const defaultPal = vdp.readPalette('Default');
	for (let i = 0; i < defaultPal.length; i++)
		defaultPal[i] = i << 28 | i << 24 | 0x0080ff;
	vdp.writePalette('Default', defaultPal);

	const defaultSprite = vdp.readSprite('gradient');
	for (let i = 0; i < 256; i++)
		defaultSprite[i] = i % 16;
	vdp.writeSprite('gradient', defaultSprite);

	while (true) {
		// if (frameNo % 10 === 0) {
		// 	const firstCol = palData[1];
		// 	for (let i = 1; i < palData.length - 1; i++)
		// 		palData[i] = palData[i + 1];
		// 	palData[palData.length - 1] = firstCol;
		// 	vdp.writePalette('Level1', palData);
		// }
		// frameNo++;

		vdp.drawBG(vdp.map('level1'), { scrollX: scroll, winW: SCREEN_WIDTH / 2 });
		vdp.drawBG(vdp.map('level1'), { scrollX: scroll, winX: SCREEN_WIDTH / 2, palette: 'Mario' });

		// Take the (0, 0, 16, 16) part of the big mario sprite
		const marioSprite = vdp.sprite('mario').offsetted(0, 0, 16, 16);
		// And draw it 32x32 (2x zoom)
		vdp.drawObj(marioSprite, Math.floor(scroll), 200, {width: 32, height: 32});

		vdp.drawObj('gradient', 0, 180, { height: 32 });
		vdp.drawObj('gradient', 20, 190, { palette: 'Level1' });

		scroll += 0.05;
		yield 0;
	}
}

loadVdp(document.querySelector("#glCanvas")).then(vdp => runProgram(vdp, main(vdp)));
