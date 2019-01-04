import {loadVdp, runProgram} from "./vdp/runloop";

// Just an attempt, doesn't quite work. Use reference instead: https://www.coranac.com/tonc/text/mode7.htm
function *main(vdp) {
	const mario = {
		x: 100, y: 0, w: 16, h: 14	, vx: 0, vy: 0
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

		vdp.drawBG('level1');

		const marioSprite = vdp.sprite('mario').offsetted(0, 0, 16, 24);
		vdp.drawObj(marioSprite, mario.x, mario.y, { prio: 1 });

		loop += 0.1;

		yield 0;
	}
}

loadVdp(document.querySelector("#glCanvas")).then(vdp => runProgram(vdp, main(vdp)));
