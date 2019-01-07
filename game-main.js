import { mat3 } from 'gl-matrix';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from "./vdp/shaders";
import {LineColorArray, LineTransformationArray} from "./vdp/vdp";
import {startGame} from "./lib-main";

/** @param vdp {VDP} */
function *main(vdp) {
	let loop = 0;

	const swaps = new LineColorArray(3, 10);
	for (let i = 0; i < swaps.length; i++)
		swaps.setLine(i, 0, 1 + i / swaps.length * 15);

	while (true) {
		const array = new LineTransformationArray();
		for (let i = 0; i < array.length; i++) {
			const mat = mat3.create();
			mat3.translate(mat, mat, [loop, 0]);
			mat3.translate(mat, mat, [SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2]);
			mat3.rotate(mat, mat, loop / 800);
			mat3.translate(mat, mat, [-SCREEN_WIDTH / 2, -SCREEN_HEIGHT / 2]);
			mat3.translate(mat, mat, [0, i]);
			array.setLine(i, mat);
		}

		// vdp.configFade('#000', 192);
		vdp.drawBG('tmx', { scrollX: 0, lineTransform: array });
		vdp.configColorSwap([swaps]);
		loop += 1;
		yield 0;
	}
}

startGame(document.querySelector("#glCanvas"), vdp => main(vdp));
