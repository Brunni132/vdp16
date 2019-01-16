import { loadVdp, runProgram } from './vdp/runloop';
import { VDP, LineTransformationArray, LineColorArray, VDPCopySource } from './vdp/vdp';
import { color32 } from './vdp/color32';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from './vdp/shaders';

export function startGame(canvasSelector: string, loadedCb: (vdp: VDP) => IterableIterator<void>) {
	loadVdp(document.querySelector(canvasSelector))
		.then(vdp => runProgram(vdp, loadedCb(vdp)));
}

export {
	LineTransformationArray,
	LineColorArray,
	color32,
	VDPCopySource,
	SCREEN_WIDTH,
	SCREEN_HEIGHT
};
