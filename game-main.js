import {loadVdp, runProgram} from "./vdp/runloop";
import { mat3, mat4, vec3 } from 'gl-matrix-ts';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from "./vdp/shaders";

// Just an attempt, doesn't quite work. Use reference instead: https://www.coranac.com/tonc/text/mode7.htm
function *main(vdp) {
	let loop = 0;

	while (true) {
		const viewerPos = [512, 512 - loop * 0.01];
		const viewerAngle = 0;

		const buffer = [];
		for (let i = 0; i < SCREEN_HEIGHT; i++) {
			const scale = 100 / (i + 50);
			const mat = mat3.create();
			mat3.translate(mat, mat, viewerPos);
			mat3.rotate(mat, mat, viewerAngle);
			mat3.scale(mat, mat, [scale, scale]);
			mat3.translate(mat, mat, [-128, -256]);

			//mat3.rotate(mat, mat, 0.001 * loop);
			//mat3.translate(mat, mat, [0, -i]);
			//mat3.scale(mat, mat, [scale, 1]);
			//mat3.translate(mat, mat, [-128, i * scale]);
			//mat3.translate(mat, mat, [0, loop * 0.1]);
			//mat3.rotate(mat, mat, 0.01 * loop);
			buffer.push(mat);
		}
		//vdp.drawBG('level1', { scrollX: 0, linescrollBuffer: buffer });

		function computeSpritePos(spritePos) {
			const mat = mat3.create();
			mat3.translate(mat, mat, viewerPos);
			mat3.rotate(mat, mat, viewerAngle);
			mat3.translate(mat, mat, [-128, -256]);

			mat3.invert(mat, mat);
			const result = vec3.fromValues(spritePos[0], spritePos[1], 1);
			vec3.transformMat3(result, result, mat);
			console.log(`TEMP `, result);
		}

		// (x, z)
		computeSpritePos([512, 512]);

		//vdp.configFade('#000', 192);
		vdp.drawBG('road', {linescrollBuffer: buffer, winY: 0, wrap: false});


		//const buffer2 = [];
		//for (let i = 0; i < SCREEN_HEIGHT; i++) {
		//	const mat = mat3.create();
		//	mat3.translate(mat, mat, [0, loop / 100]);
		//	//mat3.translate(mat, mat, [0, -i * 2]);
		//	buffer2.push(mat);
		//}
		//
		//vdp.drawBG('level1', { scrollX: 0, linescrollBuffer: buffer2 });

		loop += 1;
		yield 0;
	}
}

loadVdp(document.querySelector("#glCanvas")).then(vdp => runProgram(vdp, main(vdp)));
