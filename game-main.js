import {loadVdp, runProgram} from "./vdp/runloop";

/** @param vdp {VDP} */
function *main(vdp) {
	let loop = 0;

	// Black has been made transparent to spare one color
	vdp.configBDColor('#000');

	while (true) {
		// By opening the level2.tmx with Tiled, we know that the bush tile has ID 99, periodically swap with another bush tile (111)
		if (loop % 30 === 0) {
			const tile99 = vdp.readSprite(vdp.sprite('level2').tile(99));
			const tile111 = vdp.readSprite(vdp.sprite('level2').tile(111));
			vdp.writeSprite(vdp.sprite('level2').tile(99), tile111);
			vdp.writeSprite(vdp.sprite('level2').tile(111), tile99);
		}

		vdp.drawBG('level2', { scrollX: 0, wrap: false, scrollY: -32 });
		loop += 1;
		yield 0;
	}
}

loadVdp(document.querySelector("#glCanvas")).then(vdp => runProgram(vdp, main(vdp)));
