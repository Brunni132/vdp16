import {loadVdp} from "./vdp/vdp";
import {mat3, mat4} from "./gl-matrix";
import {readFromTexture16, readFromTexture32} from "./vdp/utils";
import {SCREEN_HEIGHT, SCREEN_WIDTH} from "./vdp/shaders";

main();

//
// start here
//
function main() {
  const canvas = document.querySelector("#glCanvas");
  loadVdp(canvas, (vdp) => {
  	const gl = vdp.gl;

		// Create a general-purpose texture
		// const dataTex = createDataTexture8(gl, 4096, 1024);
		// const dataTexData = new Uint8Array(8);
		// dataTexData[0] = 0;
		// dataTexData[1] = 1;
		// dataTexData[2] = 10;
		// dataTexData[3] = 255;
		// dataTexData[4] = 0;
		// dataTexData[5] = 0;
		// dataTexData[6] = 3;
		// dataTexData[7] = 1;
		// gl.texSubImage2D(gl.TEXTURE_2D, 0,
		// 	0, 0, // offs
		// 	2, 1, // size
		// 	gl.RGBA, gl.UNSIGNED_BYTE,
		// 	dataTexData
		// );

		// const dataTexData = new Uint8Array(8);
		// for (let i = 0; i < 8; i++) {
		// 	dataTexData[i] = i % 8;
		// }
		// gl.bindTexture(gl.TEXTURE_2D, vdp.spriteTexture);
		// gl.texSubImage2D(gl.TEXTURE_2D, 0,
		// 	0, 0,
		// 	2, 1,
		// 	gl.RGBA, gl.UNSIGNED_BYTE,
		// 	dataTexData);

		vdp.startFrame();

		const mapData = new Uint8Array(16 * 2);
		readFromTexture32(vdp.gl, vdp.mapTexture, 0, 0, 4/2, 4, mapData);
		for (let i = 0; i < 16; i++) mapData[i*2] = i;
		gl.bindTexture(gl.TEXTURE_2D, vdp.mapTexture);
		gl.texSubImage2D(gl.TEXTURE_2D, 0,
			0, 0,
			4/2, 4,
			gl.RGBA, gl.UNSIGNED_BYTE,
			mapData);

		// Only using 8 components, assuming that the last is always 1 (which is OK for affine transformations)
		const mat = mat3.create();
		mat3.translate(mat, mat, [16, 16]);
		mat3.rotate(mat, mat, Math.PI / 2);
		mat3.translate(mat, mat, [-SCREEN_WIDTH / 2, -SCREEN_HEIGHT / 2]);
		gl.bindTexture(gl.TEXTURE_2D, vdp.otherTexture);
		gl.texSubImage2D(gl.TEXTURE_2D, 0,
			0, 0,
			2, 1,
			gl.RGBA, gl.FLOAT,
			mat);


		// gl.activeTexture(gl.TEXTURE1);
		// gl.bindTexture(gl.TEXTURE_2D, dataTex);

		vdp.drawSprite(
			10, 10, 10+24*2, 10+24*2,
			0, 0, 24, 24,
			0);


		// mat4.scale(vdp.modelViewMatrix, vdp.modelViewMatrix, [1, 1, 1]);

		// vdp.drawSprite(0, 0, 160, 160, 0, 0, 8, 8, 1);
		// vdp.drawSprite(70, 50, 160+70, 160+50, 0, 0, 8, 8);
		vdp.drawMap(
			0, 0, // UV map
			0, 0, // UV tileset
			4, 4, // Map size
			16, 3, // Tileset size
			8, 8, // Tile size
			0, 0);
	});
}
