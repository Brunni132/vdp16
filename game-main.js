/**
 * @param vdp {VDP}
 * @returns {IterableIterator<number>}
 */
import {loadVdp, runProgram} from "./vdp/runloop";
import {mat3} from "./gl-matrix";
import {SCREEN_HEIGHT, SCREEN_WIDTH} from "./vdp/shaders";

/** @param vdp {VDP} */
function *main(vdp) {
	let loop = 0;
	while (true) {
		const buffer = [];
		for (let i = 0; i < 256; i++) {
			const scale = 1 / (i + 1000);
			const mat = mat3.create();
			mat3.translate(mat, mat, [512, 0]);
			mat3.scale(mat, mat, [scale * 100, 1]);
			mat3.translate(mat, mat, [-SCREEN_WIDTH / 2, loop]);
			buffer.push(mat);
		}
		//vdp.drawBG('level1', { scrollX: 0, linescrollBuffer: buffer });

		//vdp.configFade('#000', 192);
		vdp.drawBG('road', {linescrollBuffer: buffer, winY: 0, wrap: false});

		loop += 1;
		yield 0;
	}
}

loadVdp(document.querySelector("#glCanvas")).then(vdp => runProgram(vdp, main(vdp)));
\