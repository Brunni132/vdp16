import {startGame, vdp} from "../lib-main";

function *main() {
	let loop = 0;
	while (true) {
		const lineTransform = new vdp.LineTransformationArray();
		for (let line = 0; line < 256; line++) {
			//lineTransform.scaleLine(line, [2, 2]);
			lineTransform.translateLine(line, [0, line / 2]);
		}

		vdp.drawBackgroundTilemap('level1', { scrollY: loop, lineTransform });
		loop += 1;
		yield;
	}
}

startGame('#glCanvas', vdp => {
	const { input, mat3, vec2, color } = vdp;
	Object.assign(window, { input, mat3, vec2, color });
	return main();
});
