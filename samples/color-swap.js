import {LineColorArray} from "./vdp/vdp";
import {startGame} from "./lib-main";

/** @param vdp {VDP} */
function *main(vdp) {
	let loop = 0;

	// The color at (x, y) = (3, 10) in build/palettes.png is the one we want to modify
	const swaps = new LineColorArray(3, 10);
	for (let i = 0; i < swaps.length; i++)
		swaps.setLine(i, 4, 1 + 15 * i / swaps.length);

	while (true) {
		vdp.drawBG('tmx', { scrollX: loop / 2, scrollY: loop });
		vdp.configColorSwap([swaps]);
		loop += 1;
		yield 0;
	}
}

startGame(document.querySelector("#glCanvas"), vdp => main(vdp));
