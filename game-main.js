import {startGame, VDP} from "./lib-main";
import {mat3} from 'gl-matrix';

/** @param vdp {VDP}*/
function *main(vdp) {
	let loop = 0;

	const firstBlankPalette = 0;
	const palMem = vdp.readPaletteMemory(0, firstBlankPalette, 16, 3, vdp.CopySource.blank);
	// Blue to red gradient
	for (let i = 0; i < 16; i++)
		palMem.setElement(i, 0, vdp.color.make(i * 16, 0, 0x88 - i * 8));
	// Red to yellow
	for (let i = 1; i < 16; i++)
		palMem.setElement(i, 1, vdp.color.make(255, i * 16, 0));
	vdp.writePaletteMemory(0, firstBlankPalette, 16, 3, palMem);

	const colorSwap = new vdp.LineColorArray(0, firstBlankPalette);
	// Color 0 will be transparent
	vdp.configBackdropColor(palMem.getElement(0, 0));
	for (let i = 3; i < 48; i++)
		colorSwap.setLine(i, i / 3, firstBlankPalette);
	for (let i = 4; i < 64; i++)
		colorSwap.setLine(i + 44, i / 4, firstBlankPalette + 1);
	for (let i = 108; i < 128; i++)
		colorSwap.setLine(i, 15, firstBlankPalette + 1);
	vdp.configColorSwap([colorSwap]);

	while (true) {
		vdp.drawObject('mario', 100, 100, { prio: 2 });
		loop++;
		yield;
	}
}

startGame('#glCanvas', vdp => main(vdp));
