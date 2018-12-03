import {loadVdp} from "./vdp/vdp";
import {mat3, mat4} from "./gl-matrix";
import {
	readFromTexture,
	readFromTexture16,
	readFromTexture32, readFromTextureFloat,
	readFromTextureU16,
	readFromTextureU8, writeToTextureFloat, writeToTextureU16,
	writeToTextureU8
} from "./vdp/utils";
import {SCREEN_HEIGHT, SCREEN_WIDTH} from "./vdp/shaders";

main();

//
// start here
//
function main() {
  const canvas = document.querySelector("#glCanvas");
  loadVdp(canvas, (vdp) => {
  	const gl = vdp.gl;

		vdp.startFrame();

		// 2x4 RGBA texels = 4x4 16-bit words
		const mapData = readFromTextureU16(gl, vdp.mapTexture, 0, 0, 2, 4);
		for (let i = 0; i < 16; i++) mapData[i] = i;
		writeToTextureU16(gl, vdp.mapTexture, 0, 0, 2, 4, mapData);

		// Only using 8 components, assuming that the last is always 1 (which is OK for affine transformations)
		const mat = mat3.create();
		mat3.translate(mat, mat, [16, 16]);
		mat3.rotate(mat, mat, Math.PI / 2);
		mat3.translate(mat, mat, [-SCREEN_WIDTH / 2, -SCREEN_HEIGHT / 2]);
		writeToTextureFloat(gl, vdp.otherTexture, 0, 0, 2, 1, mat);

		// 2x1 RGBA texels = 8x1 float words
		const testRead = readFromTextureFloat(gl, vdp.otherTexture, 0, 0, 2, 1);
		console.log(`TEMP read from float `, testRead);

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
