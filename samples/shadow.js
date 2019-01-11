import {startGame, LineColorArray, color32, SCREEN_HEIGHT} from "./lib-main";

let mapData;

function mapCell(x, y) {
	return mapData.getElement(Math.floor(x / 8), Math.floor(y / 8));
}

/**
 * @param vdp {VDP}
 */
function *main(vdp) {
	let loop = 0;
	const mario = {
		x: 100, y: 0, w: 48, h: 48, vx: 0.5, vy: 0
	};

	// Take all background colors and make them 0 (transparent). Hack to be able to reuse the map.
	const bgTransp = [ new LineColorArray(1, 2), new LineColorArray(11, 2), new LineColorArray(12, 2), new LineColorArray(15, 2) ];
	bgTransp[0].setAll(0, 0);
	bgTransp[1].setAll(0, 0);
	bgTransp[2].setAll(0, 0);
	bgTransp[3].setAll(0, 0);
	vdp.configColorSwap(bgTransp);

	// Make BG palette clearer
	const bgPal = vdp.readPalette('level2');
	const white = color32.make('#fff');
	for (let i = 0; i < bgPal.width; i++)
		bgPal.setElement(i, 0, color32.blend(bgPal.getElement(i, 0), white, 0.5));
	vdp.writePalette('level2', bgPal);

	// Use level2's background as backdrop color
	vdp.configBDColor(bgPal.getElement(1, 0));

	mapData = vdp.readMap('level1');

	while (true) {
		mario.x += mario.vx;
		mario.y += mario.vy;
		mario.vy += 0.05; // gravity

		while (mapCell(mario.x + mario.w / 2, mario.y + mario.h) >= 202) {
			mario.vy = 0;
			mario.y = Math.floor(mario.y - 1);
		}

		// Fell down too much? Bring back up…
		if (mario.y > SCREEN_HEIGHT) mario.y = -mario.h;

		// Camera is 96 pixels behind Mario, but doesn't go beyond 0 (beginning of the map)
		const cameraX = Math.max(0, mario.x - 96);

		// Configure OBJ transparency as shadow
		vdp.configOBJTransparency({ op: 'add', blendDst: '#888', blendSrc: '#000' });
		vdp.drawBG('level2', { scrollX: cameraX / 2, scrollY: -24, wrap: false, prio: 0 });
		vdp.drawBG('level1', { scrollX: cameraX, wrap: false, prio: 1 });

		// Draw sprite with two shadow sprites, a small one with high prio (for planes with prio=0 and 1), a large one with low prio (for plane with prio=0)
		const marioTile = vdp.sprite('mario').tile(2);
		vdp.drawObj(marioTile, mario.x - cameraX, mario.y, { prio: 2, width: mario.w, height: mario.h });
		vdp.drawObj(marioTile, mario.x - cameraX + 2, mario.y + 2, { prio: 2, width: mario.w, height: mario.h, transparent: true });
		vdp.drawObj(marioTile, mario.x - cameraX + 5, mario.y + 5, { prio: 1, width: mario.w, height: mario.h, transparent: true });

		yield 0;
	}
}

startGame("#glCanvas", vdp => main(vdp));
