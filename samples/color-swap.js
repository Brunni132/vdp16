import {LineColorArray} from "./vdp/vdp";
import {startGame} from "./lib-main";

/** @param vdp {VDP} */
function *main(vdp) {
	let loop = 0;

	// The color at (x, y) = (3, 10) in build/palettes.png is the one we want to modify
	const swaps = new LineColorArray(3, 10);
	// The first palette contains a gradient of red. Just avoid the color zero, which is transparent.
	for (let i = 0; i < swaps.length; i++)
		swaps.setLine(i, 0, 1 + i / swaps.length * 15);

	while (true) {
		// vdp.configFade('#000', 192);
		vdp.drawBG('tmx', { scrollX: 0 });
		vdp.configColorSwap([swaps]);
		loop += 1;
		yield 0;
	}
}

startGame(document.querySelector("#glCanvas"), vdp => main(vdp));
