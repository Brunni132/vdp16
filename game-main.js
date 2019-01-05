import {loadVdp, runProgram} from "./vdp/runloop";
import {color32} from "./vdp/color32";

/**
 * @param vdp {VDP}
 * @returns {IterableIterator<number>}
 */
function *main(vdp) {
	let loop = 0;

	const pal = vdp.readPalette('tmx');
	pal.buffer.forEach((c, i) => {
		pal.buffer[i] = color32.sub(c, color32.parse('#888'));
	});
	vdp.writePalette('tmx', pal);

	while (true) {
		vdp.drawBG('level1', {scrollX: -loop});
		//vdp.drawBG('tmx', {scrollX: loop*2});
		loop += 1;
		yield 0;
	}
}

loadVdp(document.querySelector("#glCanvas")).then(vdp => runProgram(vdp, main(vdp)));
