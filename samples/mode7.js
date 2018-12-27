import {loadVdp, runProgram} from "./vdp/runloop";
import { mat3, mat4, vec3 } from 'gl-matrix-ts';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from "./vdp/shaders";

// Just an attempt, doesn't quite work. Use reference instead: https://www.coranac.com/tonc/text/mode7.htm
function *main(vdp) {
	let loop = 0;

	while (true) {
		const viewerPos = [512, 372];
		const viewerAngle = loop * 0.01;

		const buffer = [];
		for (let line = 0; line < SCREEN_HEIGHT + 64; line++) {
			const scale = 100 / (line + 50);
			const mat = mat3.create();
			mat3.translate(mat, mat, viewerPos);
			mat3.rotate(mat, mat, viewerAngle);
			mat3.scale(mat, mat, [scale, scale]);
			//mat3.scale(mat, mat, [0.5, 0.5]);
			mat3.translate(mat, mat, [-128, -256 + line]);
			buffer.push(mat);
		}

		function computeSpritePos(spritePos) {
			// I'll leave the computation to someone better at math than me ;)
			const mat = mat3.create();
			const untransformed = vec3.fromValues(spritePos[0], spritePos[1], 1);
			const result = vec3.create();
			let line, scale;
			for (line = buffer.length - 1; line >= 0; line--) {
				scale = 100 / (line + 50);
				mat3.invert(mat, buffer[line]);
				vec3.transformMat3(result, untransformed, mat);
				if (Math.abs(result[1] ) < scale * 2) {
					break;
				}
			}
			if (line <= 0) return;

			// The current (result[0], result[1]) are the positions of the (center, bottom) anchor of the sprite
			const obj = vdp.sprite('mario').offsetted(0, 0, 16, 16);
			scale = 1 / scale;
			vdp.drawObj(obj, result[0] - scale * obj.w / 2, line - scale * obj.h, { width: obj.w * scale, height: obj.h * scale, prio: 2 });
		}

		vdp.drawBG('road', {linescrollBuffer: buffer, winY: 0, wrap: true});

		// (x, z)
		computeSpritePos([512, 351]);

		loop += 1;
		yield 0;
	}
}

loadVdp(document.querySelector("#glCanvas")).then(vdp => runProgram(vdp, main(vdp)));
