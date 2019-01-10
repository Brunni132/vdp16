import { loadVdp, runProgram } from './vdp/runloop';
import { VDP, LineTransformationArray, LineColorArray } from './vdp/vdp';
import { color32 } from './vdp/color32';

export function startGame(canvasSelector: string, loadedCb: (vdp: VDP) => IterableIterator<number>) {
	loadVdp(document.querySelector(canvasSelector))
		.then(vdp => runProgram(vdp, loadedCb(vdp)));
}

export {
	LineTransformationArray,
	LineColorArray,
	color32
};
