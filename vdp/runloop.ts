import { setParams } from "./shaders";
import { DEBUG, VDP } from "./vdp";
import { FramerateAdjuster, NOMINAL_FRAMERATE } from "./FramerateAdjuster";
import { Input } from './input';

export function loadVdp(canvas: HTMLCanvasElement): Promise<VDP> {
	//canvas.style.width = `${canvas.width * 2}px`;
	//canvas.style.height = `${canvas.height * 2}px`;
	setParams(canvas.width, canvas.height, false);
	return new Promise(function (resolve) {
		const vdp = new VDP(canvas, () => {
			vdp._startFrame();
			vdp.input = new Input();
			resolve(vdp);
		});
	});
}

export function runProgram(vdp: VDP, coroutine: IterableIterator<void>) {
	// All in seconds except last
	let lastInt = 0;
	const times = [];
	const framerateAdj = new FramerateAdjuster();
	let renderedFrames = 0, skippedFrames = 0, extraFrameCost = 1;

	function step(timestamp) {
		if (DEBUG) {
			// Timestamp is in milliseconds
			const timestampInt = Math.floor(timestamp / 1000);

			if (timestampInt !== lastInt && times.length > 0) {
				console.log(`Upd=${(times.reduce((a, b) => a + b) / times.length).toFixed(3)}ms; r=${renderedFrames}, s=${skippedFrames}, u=${times.length}; ${framerateAdj.getFramerate().toFixed(2)}Hz`, vdp._getStats());
				times.length = 0;
				renderedFrames = skippedFrames = 0;
			}

			lastInt = timestampInt;
		}

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
			if (extraFrameCost-- > 1) continue;
			const before = window.performance.now();
			vdp._startFrame();
			coroutine.next();
			extraFrameCost = vdp._endFrame();
			times.push(window.performance.now() - before);
		}

		if (DEBUG) {
			if (toRender > 0) renderedFrames += 1;
			if (toRender > 1) skippedFrames += toRender - 1;
		}
		window.requestAnimationFrame(step);

		// Do not do every frame, but only every drawn frame to let the user time to react
		vdp.input._process();
	}

	window.requestAnimationFrame(step);
}
