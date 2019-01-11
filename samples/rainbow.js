import {startGame, color32, VDPCopySource} from "./lib-main";

/** @param vdp {VDP} */
function *main(vdp) {
	let loop = 0;

	vdp.configBDColor('#000');

	while (true) {
		const pal = vdp.readPalette('level2', VDPCopySource.rom);
		pal.buffer.forEach((col, i) => {
			const hsl = color32.toHsl(col);
			hsl.h += loop * 0.01;
			pal.buffer[i] = color32.makeFromHsl(hsl);
		});
		vdp.writePalette('level2', pal);

		vdp.drawBG('level2', { scrollX: loop, scrollY: -32, winY: 32, winH: 192 });
		loop += 1;
		yield 0;
	}
}

startGame("#glCanvas", vdp => main(vdp));
