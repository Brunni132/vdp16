import {loadVdp, runProgram} from "./vdp/runloop";

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

	while (true) {
		// if (x + width >= enemyX && x < enemyX + enemyWidth && y + height >= enemyY && y < enemyY + enemyHeight) {
		//
		// }

		mario.x += mario.vx;
		mario.y += mario.vy;
		mario.vy += 0.05; // gravity

		while (mapCell(mario.x + mario.w / 2, mario.y + mario.h) >= 202) {
			mario.vy = 0;
			mario.y = Math.floor(mario.y - 1);
		}

		// vdp.configFade('#000', 255 - loop * 10);

		// if (loop % 10 === 0) {
		// 	const colors = vdp.readPalette('level1');
		// 	const firstColor = colors[0];
		// 	colors.forEach((c, ind) => {
		// 		colors[ind] = colors[ind + 1];
		// 	});
		// 	colors[colors.length - 1] = firstColor;
		// 	vdp.writePalette('level1', colors);
		// }

		vdp.drawBackgroundMap('level1');
		vdp.configObjectTransparency({ op: 'sub', blendSrc: '#fff', blendDst: '#fff' });
		vdp.drawObject('gradient', 0, 190, { transparent: true, prio: 1, height: 32 });

		vdp.drawObject(vdp.sprite('mario').tile(6), mario.x, mario.y);

		loop += 1;

		yield;
	}
}

loadVdp(document.querySelector("#glCanvas")).then(vdp => runProgram(vdp, main(vdp)));
