import {LineColorArray, VDPCopySource} from "./vdp/vdp";
import {startGame} from "./lib-main";
import {color32} from "./vdp/color32";

/** @param vdp {VDP} */
function *main(vdp) {
	let loop = 0;

	// The colors at (x, y) in build/palettes.png that we want to modify
	const swaps1 = new LineColorArray(3, 10);

	// Use the two first palettes. One is a gradient black -> white, the other black -> red.
	const gradientPalette = vdp.readPaletteMemory(0, 0, 16, 1, VDPCopySource.blank);
	for (let i = 0; i < 16; i++) gradientPalette.buffer[i] = color32.make(i * 16, 0, 0);
	vdp.writePaletteMemory(0, 0, 16, 1, gradientPalette);

	while (true) {
		for (let i = 0; i < swaps1.length; i++) {
			const intensity = 16 * i / swaps1.length;
			const floatingPart = intensity - Math.floor(intensity);
			const blink = loop % 2 ? 1 : 0;
			const mesh = i % 2 ? blink : 0;
			let targetColorIndex;
			if (floatingPart <= 0.25 && i > 0) targetColorIndex = intensity - blink - mesh;
			else if (floatingPart <= 0.5) targetColorIndex = intensity - blink;
			else if (floatingPart <= 0.75) targetColorIndex = intensity - mesh;
			else targetColorIndex = intensity;
			swaps1.setLine(i, 0, targetColorIndex);
		}

		vdp.drawBG('tmx', { scrollY: loop / 2, scrollX: 300 - loop / 2 });
		vdp.configColorSwap([swaps1]);
		loop += 1;
		yield 0;
	}
}

startGame("#glCanvas", vdp => main(vdp));
