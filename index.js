import {loadVdp} from "./vdp/vdp";
import {mat3, mat4} from "./gl-matrix";
import {
	readFromTextureColors,
	readFromTextureFloat, readFromTextureU16,
	readFromTextureU8, writeToTextureAuto, writeToTextureFloat
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
		writeToTextureAuto(gl, vdp.mapTexture, 0, 0, 2, 4, mapData);

		// Only using 8 components, assuming that the last is always 1 (which is OK for affine transformations)
		const mat = mat3.create();
		mat3.translate(mat, mat, [16, 16]);
		mat3.rotate(mat, mat, Math.PI / 2);
		mat3.translate(mat, mat, [-SCREEN_WIDTH / 2, -SCREEN_HEIGHT / 2]);
		writeToTextureFloat(gl, vdp.otherTexture, 0, 0, 2, 1, mat);

		// 2x1 RGBA texels = 8x1 float words
		//const testRead = readFromTextureFloat(gl, vdp.otherTexture, 0, 0, 2, 1);
		//console.log(`TEMP read from float `, testRead);
		//
		//// Make another palette, brighter
		//let brightColors = readFromTextureColors(gl, vdp.paletteTexture, 0, 1, 4, 1);
		//let darkColors = brightColors.slice(0);
		//for (let i = 0; i < brightColors.length; i += 4) {
		//	brightColors[i] *= 2;
		//	brightColors[i+1] *= 2;
		//	brightColors[i+2] *= 2;
		//	darkColors[i] = 255;
		//	darkColors[i+1] = 255;
		//	darkColors[i+2] = 255;
		//	darkColors[i+3] = 128;
		//}
		//writeToTextureAuto(gl, vdp.paletteTexture, 0, 2, 4, 1, brightColors);
		//writeToTextureAuto(gl, vdp.paletteTexture, 0, 3, 4, 1, darkColors);

		//let originalColors = readFromTextureColors(gl, vdp.paletteTexture, 1, 0, 1, 1);
		//originalColors[0] = 0;
		//writeToTextureAuto(gl, vdp.paletteTexture, 1, 0, 1, 1, originalColors);

		vdp.drawSprite(
			10, 10, 10+24*2, 10+24*2,
			0, 0, 24, 24,
			0);

		vdp.drawSprite(
			64, 80, 64+16, 80+16,
			128, 0, 128+16, 0+16,
			1);
		vdp.drawSprite(
			80, 80, 80+16, 80+16,
			128, 0, 128+16, 0+16,
			2);
		vdp.drawSprite(
			96, 80, 96+16, 80+16,
			128, 0, 128+16, 0+16,
			3);
		vdp.drawSprite(
			104, 88, 104+16, 88+16,
			128, 0, 128+16, 0+16,
			3);

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
