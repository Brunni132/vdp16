import {loadVdp, runProgram} from "./vdp/runloop";
import {color32} from "./vdp/color32";
import {LineTransformationArray} from "./vdp/vdp";
import {mat3} from "gl-matrix-ts/dist/index";
import {SCREEN_WIDTH, SCREEN_HEIGHT} from "./vdp/shaders";

/**
 * @param vdp {VDP}
 * @returns {IterableIterator<number>}
 */
function *main(vdp) {
	const mario = {
		x: 100, y: 0, w: 16, h: 22	, vx: 0, vy: 0
	};

	const mapData = vdp.readMap('level1');
	let loop = 0;

	function mapCell(x, y) {
		return mapData.getElement(Math.floor(x / 8), Math.floor(y / 8));
	}

	let loopIt = 0;
	while (true) {
		// if (x + width >= enemyX && x < enemyX + enemyWidth && y + height >= enemyY && y < enemyY + enemyHeight) {
		//
		// }

		mario.x += mario.vx;
		mario.y += mario.vy;
		mario.vy += 0.05; // gravity

		while (mapCell(mario.x + mario.w / 2, mario.y + mario.h) >= 205) {
			mario.vy = 0;
			mario.y = Math.floor(mario.y - 1);
		}

		// vdp.configFade('#000', 255 - loop * 10);

		if (loop >= 100 && loop % 8 === 0) {
			const colors = vdp.readPalette('level1');
			colors.forEach((c, ind) => {
				let { r, g, b, a } = color32.extract(c);
				if (loopIt === 0) r = Math.min(255, r + 16);
				if (loopIt === 1) g = Math.min(255, g + 16);
				if (loopIt === 2) b = Math.min(255, b + 16);
				//if (loopIt === 0) r = Math.max(0, r - 16);
				//if (loopIt === 1) g = Math.max(0, g - 16);
				//if (loopIt === 2) b = Math.max(0, b - 16);
				//if (r > 0) r = Math.max(0, r - 16);
				//else if (g > 0) g = Math.max(0, g - 16);
				//else if (b > 0) b = Math.max(0, b - 16);
				//if (r < 255) r = Math.min(255, r + 16);
				//else if (g < 255) g = Math.min(255, g + 16);
				//else if (b < 255) b = Math.min(255, b + 16);
				colors[ind] = color32.make(r, g, b, a);
			});
			vdp.writePalette('level1', colors);
			loopIt = (loopIt + 1) % 3;
		}

		vdp.drawBG('level1');

		const marioSprite = vdp.sprite('mario').offsetted(0, 0, 16, 24);
		vdp.drawObj(marioSprite, mario.x, mario.y);

		loop += 1;

		yield 0;
	}
}

loadVdp(document.querySelector("#glCanvas")).then(vdp => runProgram(vdp, main(vdp)));
