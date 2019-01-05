import {loadVdp, runProgram} from "./vdp/runloop";
import {color32} from "./vdp/color32";
import {VDPCopySource} from "./vdp/vdp";

let fadeFactor = 0;
let loopIt = 0;

function fadeToWhiteGameBoyColor(colors) {
	colors.forEach((c, ind) => {
		let { r, g, b, a } = color32.extract(c);
		if (loopIt === 0) r = Math.min(255, r + 16);
		if (loopIt === 1) g = Math.min(255, g + 16);
		if (loopIt === 2) b = Math.min(255, b + 16);
		colors[ind] = color32.make(r, g, b, a);
	});
	loopIt++;
}

function fadeToBlackGameBoyColor(colors) {
	colors.forEach((c, ind) => {
		let { r, g, b, a } = color32.extract(c);
		if (loopIt === 0) r = Math.max(0, r - 16);
		if (loopIt === 1) g = Math.max(0, g - 16);
		if (loopIt === 2) b = Math.max(0, b - 16);
		colors[ind] = color32.make(r, g, b, a);
	});
	loopIt++;
}

function fadeToBlackSega(colors) {
	colors.forEach((c, ind) => {
		let { r, g, b, a } = color32.extract(c);
		if (r > 0) r = Math.max(0, r - 16);
		else if (g > 0) g = Math.max(0, g - 16);
		else if (b > 0) b = Math.max(0, b - 16);
		colors[ind] = color32.make(r, g, b, a);
	});
}

function fadeToWhiteSega(colors) {
	colors.forEach((c, ind) => {
		let { r, g, b, a } = color32.extract(c);
		if (r < 255) r = Math.min(255, r + 16);
		else if (g < 255) g = Math.min(255, g + 16);
		else if (b < 255) b = Math.min(255, b + 16);
		colors[ind] = color32.make(r, g, b, a);
	});
}

function resetPatrickBoyFade(vdp) {
	fadeFactor = 0;
	vdp.configFade('#000', 0);
}

function fadeToWhitePatrickBoy(vdp) {
	vdp.configFade('#fff', fadeFactor);
	fadeFactor += 6;
}

function fadeToGrayPatrickBoy(vdp) {
	vdp.configFade('#888', fadeFactor);
	fadeFactor += 6;
}

function fadeToBlackPatrickBoy(vdp) {
	vdp.configFade('#000', fadeFactor);
	fadeFactor += 6;
}

/**
 * @param vdp {VDP}
 * @returns {IterableIterator<number>}
 */
function *main(vdp) {
	const FADE_SPEED = 3;
	let fadeType = 0;

	while (true) {
		let loop = 0;

		// Copy the original palette back
		vdp.writePalette('level1', vdp.readPalette('level1', VDPCopySource.rom));
		resetPatrickBoyFade(vdp);

		while (loop < 300) {
			if (loop >= 100 && loop % FADE_SPEED === 0) {
				const colors = vdp.readPalette('level1');
				switch (fadeType) {
				case 0:
					fadeToWhiteGameBoyColor(colors);
					break;
				case 1:
					fadeToBlackGameBoyColor(colors);
					break;
				case 2:
					fadeToBlackSega(colors);
					break;
				case 3:
					fadeToWhiteSega(colors);
					break;
				case 4:
					fadeToWhitePatrickBoy(vdp);
					break;
				case 5:
					fadeToGrayPatrickBoy(vdp);
					break;
				case 6:
					fadeToBlackPatrickBoy(vdp);
					break;
				}
				vdp.writePalette('level1', colors);
				loopIt = (loopIt + 1) % 3;
			}

			vdp.drawBG('level1');
			loop += 1;
			yield 0;
		}

		fadeType = (fadeType + 1) % 7;
	}
}

loadVdp(document.querySelector("#glCanvas")).then(vdp => runProgram(vdp, main(vdp)));
