import { loadVdp, runProgram } from './vdp/runloop';
import { VDP } from './vdp/vdp';
import { color } from './vdp/color';

export function startStandalone(resourceDirectory: string, scriptFile: string) {
	Promise.all([
		window.fetch(scriptFile).then((res) => {
			if (!res.ok) throw new Error(`${scriptFile} not found`);
		 	return res.text();
		}),
		loadVdp(document.querySelector('#glCanvas'), resourceDirectory)
	]).then(([code, vdp]) => {
		code = `(function(vdp,color){var window ='Please play fair';${code};return main;})`;
		const mainFunc = eval(code)(vdp, color);
		if (!mainFunc) throw new Error('Check that your script contains a function *main()');
		runProgram(vdp, mainFunc());
	});
}

export function startGame(canvasSelector: string, loadedCb: () => IterableIterator<void>) {
	loadVdp(document.querySelector(canvasSelector), './build')
		.then(vdp => {
			window['vdp'] = vdp;
			window['color'] = color;
			runProgram(vdp, loadedCb());
		});
}

export {
	VDP,
	color,
};
