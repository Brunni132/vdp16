import { loadVdp, runProgram } from './vdp/runloop';
import { VDP } from './vdp/vdp';

export function startGame(canvas: HTMLCanvasElement, loadedCb: (vdp: VDP) => IterableIterator<number>) {
	loadVdp(document.querySelector("#glCanvas"))
		.then(vdp => runProgram(vdp, loadedCb(vdp)));
}
