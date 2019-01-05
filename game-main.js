import {loadVdp, runProgram} from "./vdp/runloop";
import {color32} from "./vdp/color32";

/**
 * @param vdp {VDP}
 * @returns {IterableIterator<number>}
 */
function *main(vdp) {
	let loop = 0;

	//const pal = vdp.readPalette('level1');
	//pal.forEach((c, i) => {
	//	pal[i] = color32.sub(c, color32.parse('#888'));
	//});
	//vdp.writePalette('level1', pal);

	while (true) {
		//vdp.drawBG('level1');
		vdp.drawBG('tmx', {scrollX: loop*2});
		loop += 1;
		yield 0;
	}
}

loadVdp(document.querySelector("#glCanvas")).then(vdp => runProgram(vdp, main(vdp)));
