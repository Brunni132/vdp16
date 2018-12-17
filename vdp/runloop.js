import {MAX_ACCEPTABLE_DT, MAX_LATE, MIN_ACCEPTABLE_DT, REGULAR_DT, setParams} from "./shaders";
import {VDP} from "./vdp";

const DISPLAY_REFRESH_RATE = true;

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
	const times = [], deltas = [];
	let renderedFrames = 0, skippedFrames = 0;

	function step(timestamp) {
		// Timestamp is in milliseconds
		const timestampInt = Math.floor(timestamp / 1000);
		const diff = (timestamp - last) / 1000;

		if (timestampInt !== lastInt && times.length > 0) {
			console.log(`Avg=${times.reduce((a, b) => a + b) / times.length}ms, r=${renderedFrames}, s=${skippedFrames}, u=${times.length}`);
			if (DISPLAY_REFRESH_RATE && timestampInt % 5 === 0) console.log(`Refresh rate: ${deltas.length / deltas.reduce((a, b) => a + b)}`);
			times.length = 0;
			deltas.length = 0;
			renderedFrames = skippedFrames = 0;
		}

		if (diff > MAX_ACCEPTABLE_DT) {
			late += diff - MAX_ACCEPTABLE_DT;
			if (late > MAX_LATE) late = 0;
		} else if (diff < MIN_ACCEPTABLE_DT) {
			late += diff - MIN_ACCEPTABLE_DT;
		}

		last = timestamp;
		lastInt = timestampInt;
		if (DISPLAY_REFRESH_RATE) deltas.push(diff);

		if (late <= -REGULAR_DT) {
			late += REGULAR_DT;
		} else {
			while (true) {
				const before = window.performance.now();
				vdp._startFrame();
				coroutine.next();
				vdp._endFrame();
				times.push(window.performance.now() - before);

				if (late >= REGULAR_DT) {
					late -= REGULAR_DT;
					skippedFrames += 1;
				} else {
					break;
				}
			}
		}

		renderedFrames += 1;
		window.requestAnimationFrame(step);
	}

	window.requestAnimationFrame(step);
}
