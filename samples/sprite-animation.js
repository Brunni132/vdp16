import {loadVdp, runProgram} from "./vdp/runloop";

/**
 * @param vdp {VDP}
 * @returns {IterableIterator<number>}
 */
function *main(vdp) {
	let loop = 0;
	let characterAnimation = 0;

	while (true) {
		vdp.configBGTransparency({ op: 'add', blendSrc: '#444', blendDst: '#000' });
		vdp.drawBG('level1', { transparent: true });

		const marioSprite = vdp.sprite('mario');
		if (loop % 10 === 0) {
			characterAnimation = (characterAnimation + 1) % marioSprite.tiles;
		}
		vdp.drawObj(marioSprite.tile(characterAnimation), 100, 120, { width: 64, height: 64 });

		loop += 1;
		yield 0;
	}
}

loadVdp(document.querySelector("#glCanvas")).then(vdp => runProgram(vdp, main(vdp)));
