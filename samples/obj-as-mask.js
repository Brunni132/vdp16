import {startGame, SCREEN_WIDTH, SCREEN_HEIGHT, VDPCopySource} from "./lib-main";

/** @param vdp {VDP} */
function *main(vdp) {
	let loop = 0;

	while (true) {
		vdp.configObjectTransparency({ op: 'add', blendDst: '#fff', blendSrc: '#000' });
		vdp.configBackgroundTransparency({ op: 'add', blendDst: '#448', blendSrc: '#000' });
		vdp.drawBackgroundTilemap('tmx', { scrollX: loop });
		vdp.drawBackgroundTilemap('tmx', { transparent: true });

		const mario = vdp.sprite('mario');
		const anim = Math.floor(loop / 12) % 3;
		vdp.drawObject(mario.tile(anim), 96, 96, { width: 64, height: 64, transparent: true });

		loop++;
		yield;
	}
}

startGame('#glCanvas', vdp => main(vdp));
