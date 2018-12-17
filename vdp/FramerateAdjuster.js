// Framerate expectations (works OK on a 60 Hz display; if you have a higher resolution display, you may want to set MIN_ACCEPTABLE_DT=REGULAR_DT=MAX_ACCEPTABLE_DT)
export const NOMINAL_FRAMERATE = 59.94;
const MIN_ACCEPTABLE_DT = 1 / (NOMINAL_FRAMERATE + 1);
const REGULAR_DT = 1 / NOMINAL_FRAMERATE;
const MAX_ACCEPTABLE_DT = 1 / (NOMINAL_FRAMERATE - 1);
const MAX_LATE = 1 / 4.0;
const FRAMERATE_SAMPLES = 30;

export class FramerateAdjuster {
	constructor() {
		this.last = 0;
		this.late = 0;
		this._framerateSum = REGULAR_DT * FRAMERATE_SAMPLES;
	}

	/**
	 * Strategy that maximizes smoothness on display close to the target framerate.
	 * @param timestamp {number} current timestamp (ms)
	 * @returns {number} the number of frames to render (0..n, the n-1 first should not be rendered).
	 */
	doForSmoothness(timestamp) {
		const diff = this._timeDiff(timestamp);
		this._addToFramerate(diff);

		if (diff > MAX_ACCEPTABLE_DT) {
			this.late += diff - MAX_ACCEPTABLE_DT;
			if (this.late > MAX_LATE) this.late = 0;
		} else if (diff < MIN_ACCEPTABLE_DT) {
			this.late += diff - MIN_ACCEPTABLE_DT;
		}

		this.last = timestamp;

		if (this.late <= -REGULAR_DT) {
			this.late += REGULAR_DT;
			return 0;
		} else {
			if (this.late >= REGULAR_DT) {
				const skipFrames = Math.floor(this.late / REGULAR_DT);
				this.late -= skipFrames * REGULAR_DT;
				return 1 + skipFrames;
			}
			return 1;
		}
	}

	/**
	 * Never skips a frame. Use only if you're very close to the target framerate.
	 * @param timestamp {number} current timestamp (ms)
	 * @returns {number} the number of frames to render (0..n, the n-1 first should not be rendered).
	 */
	doSimplest(timestamp) {
		const diff = this._timeDiff(timestamp);
		this._addToFramerate(diff);
		this.last = timestamp;
		return 1;
	}

	/**
	 * Standard frameskipping strategy.
	 * @param timestamp {number}
	 * @returns {number} the number of frames to render (0..n, the n-1 first should not be rendered).
	 */
	doStandard(timestamp) {
		const diff = this._timeDiff(timestamp);
		this._addToFramerate(diff);

		this.late += diff - REGULAR_DT;
		if (this.late > MAX_LATE) this.late = 0;
		this.last = timestamp;

		if (this.late >= REGULAR_DT) {
			const skipFrames = Math.floor(this.late / REGULAR_DT);
			this.late -= skipFrames * REGULAR_DT;
			return 1 + skipFrames;
		}
		else if (this.late <= -REGULAR_DT) {
			this.late += REGULAR_DT;
			return 0;
		}
		return 1;
	}

	getFramerate() {
		return FRAMERATE_SAMPLES / this._framerateSum;
	}

	/**
	 *
	 * @param diff {number}
	 * @private
	 */
	_addToFramerate(diff) {
		this._framerateSum = this._framerateSum * (FRAMERATE_SAMPLES - 1) / FRAMERATE_SAMPLES + diff;
	}

	/**
	 * @param timestamp {number}
	 * @returns {number}
	 */
	_timeDiff(timestamp) {
		return (timestamp - this.last) / 1000;
	}
}
