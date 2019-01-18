import {startGame, LineTransformationArray, SCREEN_HEIGHT} from "./lib-main";
import { mat3 } from 'gl-matrix';

/** @param vdp {VDP} */
function *main(vdp) {
	let loop = 0;
	while (true) {
		const transformationArray = new LineTransformationArray();
		const transformationMatrix = mat3.create();

		for (let line = 0; line < SCREEN_HEIGHT; line++) {
			const horizOffset = Math.sin((line + loop) / 20);
			mat3.fromTranslation(transformationMatrix, [horizOffset * 10, line]);
			transformationArray.setLine(line, transformationMatrix);
		}

		vdp.drawBackgroundMap('level2', { scrollX: 700, lineTransform: transformationArray });
		loop += 1;
		yield;
	}
}

startGame('#glCanvas', vdp => main(vdp));
