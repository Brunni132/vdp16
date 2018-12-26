import {loadVdp, runProgram} from "./vdp/runloop";
import {mat3, mat4, vec3} from "./gl-matrix";
import {SCREEN_HEIGHT, SCREEN_WIDTH} from "./vdp/shaders";

// Just an attempt, doesn't quite work. Use reference instead: https://www.coranac.com/tonc/text/mode7.htm
function *main(vdp) {
	let loop = 0;

	const projectionMat = mat4.create();
	const viewMat = mat4.create();
	mat4.perspective(projectionMat, 60 * Math.PI / 180, 1, 0.3, 1000.0);
	mat4.lookAt(viewMat, vec3.fromValues(0, 0, 0), vec3.fromValues(0, 0, 1), vec3.fromValues(0, 1, 0));

	const worldMat = mat4.create();
	mat4.mul(worldMat, projectionMat, viewMat);

	const points = [
		vec3.fromValues(-5, -3.59, 8.91),
		vec3.fromValues(5, -3.59, 8.91),
		vec3.fromValues(5, -3.59, 18.91),
		vec3.fromValues(-5, -3.59, 18.91),
	];

	const transformed = [];
	points.forEach(p => {
		const t = vec3.create();
		vec3.transformMat4(t, p, worldMat);
		transformed.push(t);
	});

	//const lowerLeft = transformed[0], lowerRight = transformed[1], upperRight = transformed[2], upperLeft = transformed[3];
	console.log(`TEMP `, transformed, worldMat);

	const lowerLeft = vec3.fromValues(1.3834271430969238, 0.9933006763458252, 1.096475601196289);
	const lowerRight = vec3.fromValues(1.3834271430969238, 0.9933006763458252, 1.086475601196289);
	const upperLeft = vec3.fromValues(-1, 0, 1);
	const upperRight = vec3.fromValues(1, 0, 1);
	const invertWorldMat = mat4.create();
	mat4.invert(invertWorldMat, worldMat);
	vec3.transformMat4(lowerLeft, lowerLeft, invertWorldMat);
	vec3.transformMat4(lowerRight, lowerRight, invertWorldMat);
	vec3.transformMat4(upperLeft, upperLeft, invertWorldMat);
	vec3.transformMat4(upperRight, upperRight, invertWorldMat);

	console.log(`TEMP `, lowerLeft, lowerRight, upperLeft, upperRight);

	while (true) {
		const buffer = [];
		for (let i = 0; i < SCREEN_HEIGHT; i++) {
			//const scale = 1 / (i + 1000);
			//const mat = mat3.create();
			//mat3.translate(mat, mat, [512, 0]);
			//mat3.scale(mat, mat, [scale * 100, 1]);
			//mat3.translate(mat, mat, [-SCREEN_WIDTH / 2, loop]);
			buffer.push(mat);
		}
		//vdp.drawBG('level1', { scrollX: 0, linescrollBuffer: buffer });

		//vdp.configFade('#000', 192);
		vdp.drawBG('road', {linescrollBuffer: buffer, winY: 0, wrap: false});

		loop += 1;
		yield 0;
	}
}

loadVdp(document.querySelector("#glCanvas")).then(vdp => runProgram(vdp, main(vdp)));
