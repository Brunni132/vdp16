import {LineTransformationArray, startGame} from "./lib-main";
import {LineColorArray} from "./vdp/vdp";
import {mat3} from "gl-matrix";

/** @param vdp {VDP} */
function *main(vdp) {
	let loop = 0;
	const mario = { x: 120, y: 128, w: 16, h: 16 };

	const maskBgPalNo = vdp.palette('mask-bg').y;
	const colorReplacement = new LineColorArray(maskBgPalNo, 0);
	colorReplacement.setAll(maskBgPalNo, 1);

	while (true) {
		mario.y = 120 + Math.sin(loop / 90) * 112;

		const lineTransform = new LineTransformationArray();
		for (let y = 0; y < lineTransform.length; y++) {
			const center = { x: Math.floor(mario.x + mario.w / 2), y: Math.floor(mario.y + mario.h / 2) };
			let scale = 0;
			const circleRay = Math.max(32, 300 - loop * 3);
			// Visible on that line?
			if (Math.abs(y - center.y) < circleRay) {
				const angle = Math.asin((y - center.y) / circleRay);
				scale = Math.cos(angle) * circleRay;
			}

			const t = mat3.create();
			// Centered on the 4th pixel of the mask-bg horizontally
			mat3.translate(t, t, [4, 0]);
			mat3.scale(t, t, [1 / scale, 1 / scale]);
			// This is a case where we want to use the row 0 all the time (the tilemap is only 8x1 pixels)
			mat3.translate(t, t, [-center.x, 0]);
			lineTransform.setLine(y, t);
		}

		// Separate the render into two because we don't want to
		vdp.drawBG('level1');

		vdp.configBGTransparency({ op: 'sub', blendDst: '#fff', blendSrc: '#fff' });
		vdp.configColorSwap([colorReplacement]);
		vdp.drawBG('mask-bg', { wrap: false, transparent: true, lineTransform });

		vdp.drawObj(vdp.sprite('mario').tile(0), mario.x, mario.y);

		loop += 1;
		yield 0;
	}
}

startGame("#glCanvas", vdp => main(vdp));
