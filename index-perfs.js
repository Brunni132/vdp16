import {loadVdp, runProgram} from "./vdp/vdp";
import {mat3} from "./gl-matrix";
import {writeToTextureFloat} from "./vdp/utils";

/**
 * @param vdp {VDP}
 * @returns {IterableIterator<number>}
 */
function *main(vdp) {
	let scroll = 0;

	while (true) {
		// const mat = mat3.create();
		// mat3.scale(mat, mat, [1, 1]);
		// mat3.translate(mat, mat, [scroll, 0, 0]);
		// writeToTextureFloat(vdp.gl, vdp.otherTexture, 0, 0, 2, 1, mat);

		vdp.drawBG('level1', { scrollX: scroll });

		// Take the (0, 0, 16, 16) part of the big mario sprite
		const marioSprite = vdp.sprite('mario').offsetted(0, 0, 16, 16);
		// And draw it 32x32 (2x zoom)
		vdp.drawObj('mario', Math.floor(scroll), 200, {width: 8, height: 8});

		scroll += 0.05;
		yield 0;
	}
}

// Starts here
loadVdp(document.querySelector("#glCanvas")).then(vdp => {
	runProgram(vdp, main(vdp));
});
