import { loadVdp, runProgram } from './vdp/runloop';
import { VDP } from './vdp/vdp';
import { color } from './vdp/color';

let vdp: VDP;

export function startStandalone(resourceDirectory: string, scriptFile: string) {
	Promise.all([
		window.fetch(scriptFile).then((res) => {
			if (!res.ok) throw new Error(`${scriptFile} not found`);
		 	return res.text();
		}),
		loadVdp(document.querySelector('#glCanvas'), resourceDirectory)
	]).then(([code, vdp]) => {
		// Strip imports
		code = code.replace(/^import .*?;/gm, '');
		code = `(function(vdp){var window ='Please play fair';${code};return main;})`;
		const mainFunc = eval(code)(vdp);
		if (!mainFunc) throw new Error('Check that your script contains a function *main()');
		runProgram(vdp, mainFunc());
	});
}

export function startGame(canvasSelector: string, loadedCb: (vdp: VDP) => IterableIterator<void>) {
	loadVdp(document.querySelector(canvasSelector), './build')
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
