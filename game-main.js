import {loadVdp, runProgram} from "./vdp/runloop";
import { mat3 } from 'gl-matrix';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from "./vdp/shaders";
import {LineTransformationArray} from "./vdp/vdp";

/** @param vdp {VDP} */
function *main(vdp) {
	let loop = 0;
	while (true) {
		const array = new LineTransformationArray();
		const mat = mat3.create();
		mat3.translate(mat, mat, [loop, 0]);
		mat3.translate(mat, mat, [SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2]);
		mat3.rotate(mat, mat, loop / 800);
		mat3.translate(mat, mat, [-SCREEN_WIDTH / 2, -SCREEN_HEIGHT / 2]);
		array.setAll(mat);

		vdp.drawBG('level1', { scrollX: 0, lineTransform: array });
		loop += 1;
		yield 0;
	}
}

loadVdp(document.querySelector("#glCanvas")).then(vdp => runProgram(vdp, main(vdp)));
