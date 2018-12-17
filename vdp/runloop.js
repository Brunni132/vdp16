import {MAX_ACCEPTABLE_DT, MAX_LATE, MIN_ACCEPTABLE_DT, setParams} from "./shaders";
import {VDP} from "./vdp";

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
	let last = 0, lastInt = 0, late = 0;
	const times = [];
	let updateFrames = 0;

	function step(timestamp) {
		// Timestamp is in milliseconds
		const timestampInt = Math.floor(timestamp / 1000);
		const diff = (timestamp - last) / 1000;

		if (timestampInt !== lastInt && times.length > 0) {
			console.log(`Called ${times.length} times. Avg=${times.reduce((a, b) => a + b) / times.length}ms, framecount=${updateFrames}`);
			times.length = 0;
			updateFrames = 0;
		}

		if (diff >= MIN_ACCEPTABLE_DT && diff <= MAX_ACCEPTABLE_DT) {
		} else {
			late += diff;
			if (late > MAX_LATE) late = 0;
		}

		last = timestamp;
		lastInt = timestampInt;

		if (late > -MIN_ACCEPTABLE_DT) {
			const before = window.performance.now();
			while (true) {
				vdp._startFrame();
				coroutine.next();
				vdp._endFrame();
				updateFrames += 1;

				if (late >= MIN_ACCEPTABLE_DT) {
					late -= MIN_ACCEPTABLE_DT;
				} else {
					break;
				}
			}
			times.push(window.performance.now() - before);
		}

		window.requestAnimationFrame(step);
	}

	window.requestAnimationFrame(step);
}
