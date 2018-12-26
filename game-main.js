import {loadVdp, runProgram} from "./vdp/runloop";
import { mat3 } from 'gl-matrix-ts';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from "./vdp/shaders";

/** @param vdp {VDP} */
function *main(vdp) {
	// https://www.coranac.com/tonc/text/mode7.htm
	let loop = 0;
	while (true) {
		const buffer = [];
		for (let i = 0; i < 256; i++) {
			const mat = mat3.create();
			mat3.translate(mat, mat, [loop, 0]);
			mat3.translate(mat, mat, [SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2]);
			mat3.rotate(mat, mat, loop / 800);
			mat3.translate(mat, mat, [-SCREEN_WIDTH / 2, -SCREEN_HEIGHT / 2]);
			buffer.push(mat);
		}

		vdp.configFade('#000', 192);
		vdp.drawBG('level1', { scrollX: 0, linescrollBuffer: buffer });
		loop += 1;
		yield 0;
	}
}

loadVdp(document.querySelector("#glCanvas")).then(vdp => runProgram(vdp, main(vdp)));
