import { loadVdp, runProgram } from './vdp/runloop';
import { VDP, LineTransformationArray, LineColorArray, VDPCopySource } from './vdp/vdp';
import { color } from './vdp/color';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from './vdp/shaders';
import { InputKey } from './vdp/input';

export function startStandalone() {
	window.fetch('build/main.js').then((res) => {
		if (!res.ok) throw new Error('build/main.js not found');
	 	return res.text();
	}).then((code) => {
		eval(code);
	});
}

export function startGame(canvasSelector: string, loadedCb: (vdp: VDP) => IterableIterator<void>) {
	loadVdp(document.querySelector(canvasSelector))
		.then(vdp => runProgram(vdp, loadedCb(vdp)));
}

export {
	VDP,
	LineTransformationArray,
	LineColorArray,
	color,
	VDPCopySource,
	SCREEN_WIDTH,
	SCREEN_HEIGHT,
	InputKey
};
