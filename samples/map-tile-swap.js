import {loadVdp, runProgram} from "./vdp/runloop";
import {VDPCopySource} from "./vdp/vdp";

/** @param vdp {VDP} */
function *main(vdp) {
	let loop = 0, animStep = 0;

	// Black has been made transparent to spare one color
	vdp.configBDColor('#000');

	while (true) {
		// By opening level2.tmx with Tiled, we know that the bush tile has ID 97, periodically swap with another bush tile (109)
		if (loop % 30 === 0) {
			const tileNo = animStep % 2 === 0 ? 109 : 97;
			const tileData = vdp.readSprite(vdp.sprite('level2').tile(tileNo), VDPCopySource.rom);
			vdp.writeSprite(vdp.sprite('level2').tile(97), tileData);
			animStep = animStep + 1;
		}

		vdp.drawBG('level2', { scrollX: loop, wrap: false, scrollY: -32 });
		loop += 1;
		yield 0;
	}
}

startGame("#glCanvas", vdp => main(vdp));
