import {loadVdp, runProgram} from "./vdp/vdp";

function *program(vdp) {
	let scroll = 0;

	while (true) {
		vdp.drawBG('level1', {scrollX: scroll});

		// Take the (0, 0, 16, 16) part of the big mario sprite
		const marioSprite = vdp.sprite('mario').offsetted(0, 0, 16, 16);
		// And draw it 32x32 (2x zoom)
		vdp.drawSprite(marioSprite, 0, 0, {width: 32, height: 32});

		scroll += 0.5;
		yield 0;
	}
}

// Starts here
loadVdp(document.querySelector("#glCanvas")).then(vdp => {
	runProgram(vdp, program(vdp));
});
