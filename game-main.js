import {loadVdp, runProgram} from "./vdp/runloop";

/**
 * @param vdp {VDP}
 * @returns {IterableIterator<number>}
 */
function *main(vdp) {
	const mario = {
		x: 100, y: 0, w: 16, h: 22	, vx: 0, vy: 0
	};

	const level1Map = vdp.map('level1');
	const mapData = vdp.readMap(level1Map);
	let loop = 0;

	function mapCell(x, y) {
		return mapData[level1Map.w * Math.floor(y / 8) + Math.floor(x / 8)];
	}

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

		// if (loop % 10 === 0) {
		// 	const colors = vdp.readPalette('level1');
		// 	const firstColor = colors[0];
		// 	colors.forEach((c, ind) => {
		// 		colors[ind] = colors[ind + 1];
		// 	});
		// 	colors[colors.length - 1] = firstColor;
		// 	vdp.writePalette('level1', colors);
		// }

		vdp.drawBG('level1');
		vdp.drawObj('gradient', 0, 100, { prio: 1 });

		const marioSprite = vdp.sprite('mario').offsetted(0, 0, 16, 24);
		vdp.drawObj(marioSprite, mario.x, mario.y, { prio: 1 });
		console.log(`TEMP `, mario);

		loop += 1;

		yield 0;
	}
}

loadVdp(document.querySelector("#glCanvas")).then(vdp => runProgram(vdp, main(vdp)));
