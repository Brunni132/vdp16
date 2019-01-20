import { VDP, LineTransformationArray, LineColorArray, color, VDPCopySource, SCREEN_WIDTH, SCREEN_HEIGHT, InputKey, startGame} from '../bundles/vdp-lib';
import {mat3} from 'gl-matrix';

function scaleAtLine(line) { return 100 / (line + 50); }

/**
 * @param {VDP} vdp
 * @returns IterableIterator<void>
 */
function *main(vdp) {
	let loop = 0, angle = 0;

	vdp.configBackdropColor(
		'#20f'
	);
	while (true) {
		const lineTransform = new LineTransformationArray();
		for (let line = 0; line < SCREEN_HEIGHT; line++) {
			const transform = mat3.create();
			// let scrollFactor = 1;
			//
			// if (line < 32) scrollFactor = 0.7;
			// else if (line < 48) scrollFactor = 0.5;
			// else if (line < 64) scrollFactor = 0.3;
			// else if (line < 112) scrollFactor = 0.2;
			// else if (line < 152) scrollFactor = 0.4;
			// else scrollFactor = 0.45 + (line - 152) * 0.01;
			//
			// mat3.translate(transform, transform, [loop * scrollFactor, line]);

			mat3.translate(transform, transform, [512, 512]);
			mat3.rotate(transform, transform, angle);
			mat3.scale(transform, transform, [scaleAtLine(line), scaleAtLine(line)]);
			mat3.translate(transform, transform, [-SCREEN_WIDTH/2, -SCREEN_HEIGHT]);

			mat3.translate(transform, transform, [0, line]);
			lineTransform.setLine(line, transform);
		}

		vdp.drawBackgroundMap('road', { lineTransform });

		const mario = vdp.sprite('mario').tile(3);
		vdp.drawObject(mario, 0, 0);

		angle += 0.01;
		loop = loop + 1;
		yield;
	}
}

startGame('#glCanvas', vdp => main(vdp));
