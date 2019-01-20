import {LineTransformationArray, LineColorArray, startGame} from "./lib-main";
import {mat3} from "gl-matrix";

/** @param vdp {VDP} */
function *main(vdp) {
	let loop = 0;
	const mario = { x: 120, y: 128, w: 16, h: 16 };

	const maskBgPalNo = vdp.palette('mask-bg').y;
	// Replace color 0 (outside of mask) with opaque color 1 (gray)
	const colorReplacements = [ new LineColorArray(0, maskBgPalNo) ];
	colorReplacements[0].setAll(1, maskBgPalNo);

	while (true) {
		// Make mario turn around
		mario.x = 120 + Math.cos(loop / 90) * 64;
		mario.y = 120 + Math.sin(loop / 90) * 112;

		// Draw a spot using scale and translations each line
		const lineTransform = new LineTransformationArray();
		for (let y = 0; y < lineTransform.length; y++) {
			const center = { x: Math.floor(mario.x + mario.w / 2), y: Math.floor(mario.y + mario.h / 2) };
			let scale = 0;
			const circleRay = Math.max(32, 300 - loop * 3);
			// Circle visible on that line?
			if (Math.abs(y - center.y) < circleRay) {
				const angle = Math.asin((y - center.y) / circleRay);
				scale = Math.cos(angle) * circleRay;
			}

			const t = mat3.create();
			// Centered on the 4th pixel of the mask-bg horizontally (the black stripe)
			mat3.translate(t, t, [4, 0]);
			mat3.scale(t, t, [1 / scale, 1 / scale]);
			// This is a case where we want to use the row 0 all the time (the tilemap is only 8x1 pixels)
			mat3.translate(t, t, [-center.x, 0]);
			lineTransform.setLine(y, t);
		}

		vdp.configBackgroundTransparency({ op: 'sub', blendDst: '#fff', blendSrc: '#fff' });
		vdp.configColorSwap(colorReplacements);

		vdp.drawBackgroundMap('level1');
		vdp.drawBackgroundMap('mask-bg', { wrap: false, transparent: true, lineTransform });

		vdp.drawObject(vdp.sprite('mario').tile(0), mario.x, mario.y);

		loop += 1;
		yield;
	}
}

startGame('#glCanvas', vdp => main(vdp));
