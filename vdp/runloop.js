import {setParams} from "./shaders";
import {VDP} from "./vdp";
import {FramerateAdjuster, NOMINAL_FRAMERATE} from "./FramerateAdjuster";

/**
 * @param canvas {HTMLCanvasElement}
 * @param [params] {Object}
 * @param [params.resolution] {number} default is 0. 0=256x256, 1=320x224
 * @returns {Promise}
 */
export function loadVdp(canvas, params) {
	params = params || {};
	switch (params.resolution) {
	case 1:
		canvas.width = 320;
		canvas.height = 224;
		break;
	default:
		canvas.width = 256;
		canvas.height = 256;
		break;
	}
	canvas.style.width = `${canvas.width * 2}px`;
	canvas.style.height = `${canvas.height * 2}px`;
	setParams(canvas.width, canvas.height, false);
	return new Promise(function (resolve) {
		const vdp = new VDP(canvas, () => {
			vdp._startFrame();
			resolve(vdp);
		});
	});
}

/**
 * @param {VDP} vdp
 * @param {IterableIterator<number>} coroutine
 */
export function runProgram(vdp, coroutine) {
	// All in seconds except last
	let lastInt = 0;
	const times = [];
	const framerateAdj = new FramerateAdjuster();
	let renderedFrames = 0, skippedFrames = 0;

	function step(timestamp) {
		// Timestamp is in milliseconds
		const timestampInt = Math.floor(timestamp / 1000);

		if (timestampInt !== lastInt && times.length > 0) {
			console.log(`Upd=${(times.reduce((a, b) => a + b) / times.length).toFixed(3)}ms; r=${renderedFrames}, s=${skippedFrames}, u=${times.length}; ${framerateAdj.getFramerate().toFixed(2)}Hz`, vdp.getStats());
			times.length = 0;
			renderedFrames = skippedFrames = 0;
		}

		lastInt = timestampInt;

		// The algorithm depends on the refresh rate of the screen. Use smooth if close, use simple otherwise as smooth will produce some speed variations.
		const framerate = framerateAdj.getFramerate();
		let toRender;
		if (framerate >= NOMINAL_FRAMERATE - 1 && framerate <= NOMINAL_FRAMERATE + 1) {
			toRender = framerateAdj.doSimplest(timestamp);
		} else {
			toRender = framerateAdj.doStandard(timestamp);
		}

		// Render the expected number of frames
		for (let i = 0; i < toRender; i++) {
			const before = window.performance.now();
			vdp._startFrame();
			coroutine.next();
			vdp._endFrame();
			times.push(window.performance.now() - before);
		}

		if (toRender > 0) renderedFrames += 1;
		if (toRender > 1) skippedFrames += toRender - 1;

		window.requestAnimationFrame(step);
	}

	window.requestAnimationFrame(step);
}
