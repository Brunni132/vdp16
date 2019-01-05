import {loadVdp, runProgram} from "./vdp/runloop";

/**
 * @param vdp {VDP}
 * @returns {IterableIterator<number>}
 */
function *main(vdp) {
	let loop = 0;

	while (true) {
		vdp.drawBG('level1');
		loop += 1;
		yield 0;
	}
}

loadVdp(document.querySelector("#glCanvas")).then(vdp => runProgram(vdp, main(vdp)));
