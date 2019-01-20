import {LineColorArray} from "./vdp/vdp";
import {startGame} from "./lib-main";

/** @param vdp {VDP} */
function *main(vdp) {
	let loop = 0;

	// The color at (x, y) = (10, 3) in build/palettes.png is the one we want to modify
	const swaps = new LineColorArray(1, vdp.palette('level1').y);
	const sonicBgPaletteNo = vdp.palette('sonic1-bg').y;
	for (let i = 0; i < swaps.length; i++)
		swaps.setLine(i, 16 * i / swaps.length, sonicBgPaletteNo);
	vdp.configBackdropColor('#333');

	while (true) {
		vdp.drawBackgroundTilemap('level1', { scrollX: loop, scrollY: loop / 4 });
		vdp.configColorSwap([swaps]);
		loop += 1;
		yield;
	}
}

startGame('#glCanvas', vdp => main(vdp));
