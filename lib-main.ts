import { loadVdp, runProgram } from './vdp/runloop';
import { CopySource, LineColorArray, LineTransformationArray, VDP } from './vdp/vdp';
import { color } from './vdp/color';
import { Input } from './vdp/input';
import { vec2, mat3 } from 'gl-matrix';

let vdp: VDP;
let input: Input;

// Used by samples
export function startStandalone({ resourceDir, scriptFile }: { resourceDir: string, scriptFile: string }) {
	resourceDir = resourceDir || 'build/';
	scriptFile = scriptFile || (resourceDir + 'game-main.js');
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
		code = `(function(vdp,input,color,vec2,mat3){var window ='Please play fair';${code};return main;})`;
		const mainFunc = eval(code)(vdp, vdp.input, vdp.color, vdp.vec2, vdp.mat3);
		if (!mainFunc) throw new Error('Check that your script contains a function *main()');
		runProgram(vdp, mainFunc());
	});
}

// Used in direct mode
export function startGame(canvasSelector: string, loadedCb: (vdp: VDP) => IterableIterator<void>, {resourceDir, onError}: { resourceDir?: string, onError?: (Error) => void } = {}) {
	function onException(exception) {
		onError && onError(exception);
		console.error('Exception in the game', exception);
	}
	if (typeof resourceDir !== 'string') resourceDir = './build/';

	loadVdp(document.querySelector(canvasSelector), resourceDir)
		.then(_vdp => {
			vdp = _vdp;
			input = vdp.input;
			try {
				runProgram(_vdp, loadedCb(_vdp), onException);
			} catch (error) {
				onException(error);
			}
		})
		.catch(onException);
}

export {
	vdp, color, input,
	vec2, mat3,
	VDP, CopySource, LineColorArray, LineTransformationArray
};
