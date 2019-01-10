import {LineTransformationArray, startGame} from "./lib-main";
import {LineColorArray} from "./vdp/vdp";
import {mat3} from "gl-matrix";

/** @param vdp {VDP} */
function *main(vdp) {
	let loop = 0;

	const maskBgPalNo = vdp.palette('mask-bg').y;
	const colorReplacement = new LineColorArray(maskBgPalNo, 0);
	colorReplacement.setAll(maskBgPalNo, 1);

	while (true) {
		const lineTransform = new LineTransformationArray();
		for (let i = 0; i < lineTransform.length; i++) {
			const center = { x: 128, y: 128 };
			const angle = (i - center.y) * Math.PI / 128;
			const scale = (Math.abs(angle) < Math.PI / 2) ? Math.cos(angle) * 32 : 0;
			const t = mat3.create();
			mat3.translate(t, t, [4, 0]);
			mat3.scale(t, t, [1 / scale, 1 / scale]);
			mat3.translate(t, t, [-center.x, 0]);
			lineTransform.setLine(i, t);
		}

		// Separate the render into two because we don't want to
		vdp.drawBG('tmx');

		vdp.configBGTransparency({ op: 'sub', blendDst: '#fff', blendSrc: '#fff' });
		vdp.configColorSwap([colorReplacement]);
		vdp.drawBG('mask-bg', { wrap: false, transparent: true, lineTransform });

		loop += 1;
		yield 0;
	}
}

startGame("#glCanvas", vdp => main(vdp));
