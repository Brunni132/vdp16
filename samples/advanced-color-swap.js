import {LineColorArray, VDPCopySource} from "./vdp/vdp";
import {startGame} from "./lib-main";
import {color32} from "./vdp/color32";

/** @param vdp {VDP} */
function *main(vdp) {
	let loop = 0;

	// The colors at (x, y) in build/palettes.png that we want to modify.
	// First is the background of the first section of the 'tmx' map. Second is the red of the 'mario' sprite.
	const swaps = [new LineColorArray(3, 10), new LineColorArray(1, 1)];

	// Set up the 2 palettes with a gradient (32 and 33, make them far enough so that they're not used)
	const gradientPalette = vdp.readPaletteMemory(0, 32, 16, 2, VDPCopySource.blank);
	for (let i = 0; i < 16; i++) gradientPalette.setElement(i, 0, color32.make(i * 16, 0, 0));
	for (let i = 0; i < 16; i++) gradientPalette.setElement(i, 1, color32.make(i * 16, i * 16, i * 16));
	vdp.writePaletteMemory(0, 32, 16, 2, gradientPalette);

	// Note that the color (0, 32) is not used, it's transparent so it will let the backdrop appear
	vdp.configBDColor('#000');

	// Set up another gradient for Mario's costume. Note that where the color 0 is used, the sprite will be transparent.
	for (let i = 0; i < swaps[1].length; i++) {
		swaps[1].setLine(i, 33, Math.abs(i - swaps[1].length / 2) / 8);
	}

	while (true) {
		for (let i = 0; i < swaps[0].length; i++) {
			const intensity = 16 * i / swaps[0].length;
			const floatingPart = intensity - Math.floor(intensity);
			const blink = loop % 2 ? 1 : 0;
			const mesh = i % 2 ? blink : 0;
			let targetColorIndex;
			if (floatingPart <= 0.25 && i > 0) targetColorIndex = intensity - blink - mesh;
			else if (floatingPart <= 0.5) targetColorIndex = intensity - blink;
			else if (floatingPart <= 0.75) targetColorIndex = intensity - mesh;
			else targetColorIndex = intensity;
			swaps[0].setLine(i, 32, targetColorIndex);
		}

		vdp.drawBG('tmx', { scrollX: 32, scrollY: 0 });
		vdp.drawObj(vdp.sprite('mario').tile(0), 96, 96 + Math.sin(loop / 90) * 96, { width: 64, height: 64 });

		vdp.configColorSwap(swaps);
		loop += 1;
		yield 0;
	}
}

startGame("#glCanvas", vdp => main(vdp));
