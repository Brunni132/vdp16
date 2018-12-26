import {loadVdp, runProgram} from "./vdp/runloop";
import {mat3} from 'gl-matrix-ts';

/** @param vdp {VDP} */
function *main(vdp) {
	let loop = 0;

	while (true) {
		yield 0;
	}
}

loadVdp(document.querySelector("#glCanvas")).then(vdp => runProgram(vdp, main(vdp)));
