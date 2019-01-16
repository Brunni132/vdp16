import { loadVdp, runProgram } from './vdp/runloop';
import { VDP, LineTransformationArray, LineColorArray, VDPCopySource } from './vdp/vdp';
import { color } from './vdp/color';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from './vdp/shaders';

export function startGame(canvasSelector: string, loadedCb: (vdp: VDP) => IterableIterator<void>) {
	loadVdp(document.querySelector(canvasSelector))
		.then(vdp => runProgram(vdp, loadedCb(vdp)));
}

export {
	LineTransformationArray,
	LineColorArray,
	color,
	VDPCopySource,
	SCREEN_WIDTH,
	SCREEN_HEIGHT
};
