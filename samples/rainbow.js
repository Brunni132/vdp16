import {startGame, color, VDPCopySource} from "./lib-main";

/** @param vdp {VDP} */
function *main(vdp) {
	let loop = 0;

	vdp.configBackdropColor('#000');

	while (true) {
		const pal = vdp.readPalette('level2', VDPCopySource.rom);
		pal.array.forEach((col, i) => {
			const hsl = color.toHsl(col);
			hsl.h += loop * 0.01;
			pal.array[i] = color.makeFromHsl(hsl);
		});
		vdp.writePalette('level2', pal);

		vdp.drawBackgroundMap('level2', { scrollX: loop, scrollY: -32, winY: 32, winH: 192 });
		loop += 1;
		yield;
	}
}

startGame("#glCanvas", vdp => main(vdp));
