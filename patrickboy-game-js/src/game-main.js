import {LineTransformationArray, startGame, VDP} from '../bundles/vdp-lib';
import {mat3, vec2} from "gl-matrix";

/**
 * @param {VDP} vdp
 */
function *main(vdp) {
	let loop = 0;

	const array = new LineTransformationArray();
	for (let i = 0; i < array.length; i++) {
		const t = mat3.create();
		mat3.translate(t, t, vec2.fromValues(i / 4, i));
		array.setLine(i, t);
	}
	vdp.configBDColor('#f00');

	while (true) {
		vdp.drawBG('level1', {lineTransform: array});
		loop += 1;
		yield 0;
	}
}

startGame(document.querySelector("#glCanvas"), vdp => main(vdp));
