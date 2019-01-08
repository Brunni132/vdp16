import { loadVdp, runProgram } from './vdp/runloop';
import { VDP, LineTransformationArray } from './vdp/vdp';

export function startGame(canvasSelector: string, loadedCb: (vdp: VDP) => IterableIterator<number>) {
	loadVdp(document.querySelector(canvasSelector))
		.then(vdp => runProgram(vdp, loadedCb(vdp)));
}

export {
	LineTransformationArray
};
