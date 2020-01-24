import { loadVdp, runProgram } from './vdp/runloop';
import { VDP } from './vdp/vdp';
import { color } from './vdp/color';

let vdp: VDP;

// Used by samples
export function startStandalone({ resourceDir, scriptFile }: { resourceDir: string, scriptFile: string }) {
	scriptFile = scriptFile || (resourceDir + '/game-main.js');
	Promise.all([
		window.fetch(scriptFile).then((res) => {
			if (!res.ok) throw new Error(`${scriptFile} not found`);
		 	return res.text();
		}),
		loadVdp(document.querySelector('#glCanvas'), resourceDir)
	]).then(([code, vdp]) => {
		// Strip imports
		code = code
			.replace(/^import .*?;/gm, '')
			.replace(/^export function/gm, 'function');
		code = `(function(vdp){var window ='Please play fair';${code};return main;})`;
		const mainFunc = eval(code)(vdp);
		if (!mainFunc) throw new Error('Check that your script contains a function *main()');
		runProgram(vdp, mainFunc());
	});
}

// Used in direct mode
export function startGame(canvasSelector: string, loadedCb: (vdp: VDP) => IterableIterator<void>, {resourceDir}: { resourceDir?: string } = {}) {
	if (typeof resourceDir !== 'string') resourceDir = './build/';
	loadVdp(document.querySelector(canvasSelector), resourceDir)
		.then(_vdp => {
			vdp = _vdp;
			runProgram(_vdp, loadedCb(_vdp));
		});
}

export {
	vdp,
	VDP,
	color,
};
