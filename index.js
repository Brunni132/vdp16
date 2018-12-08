import {loadVdp} from "./vdp/vdp";
import {mat3, mat4} from "./gl-matrix";
import {
	readFromTextureFloat, readFromTexture16,
	writeToTextureFloat, bindToFramebuffer, readFromTexture32, writeToTexture32
} from "./vdp/utils";
import {HICOLOR_MODE, SCREEN_HEIGHT, SCREEN_WIDTH} from "./vdp/shaders";
import {drawSprite} from "./vdp/sprites";
import {drawMap} from "./vdp/maps";

main();

//
// start here
//
function main() {
	const canvas = document.querySelector("#glCanvas");
	loadVdp(canvas, (vdp) => {
		const gl = vdp.gl;

		vdp.startFrame();

		// Only using 8 components, assuming that the last is always 1 (which is OK for affine transformations)
		const mat = mat3.create();
		//mat3.scale(mat, mat, [320 / 304.0, 1]);
		writeToTextureFloat(gl, vdp.otherTexture, 0, 0, 2, 1, mat);

		// 2x1 RGBA texels = 8x1 float words
		const testRead = readFromTextureFloat(gl, vdp.otherTexture, 0, 0, 2, 1);
		console.log(`TEMP read from float `, testRead);

		if (HICOLOR_MODE) {
			// Make another palette, brighter
			let brightColors = new Uint8ClampedArray(readFromTexture32(gl, vdp.paletteTexture, 0, 1, 4, 1).buffer);
			let darkColors = brightColors.slice(0);
			for (let i = 0; i < brightColors.length; i += 4) {
				brightColors[i] *= 2;
				brightColors[i + 1] *= 2;
				brightColors[i + 2] *= 2;
				darkColors[i] = 255;
				darkColors[i + 1] = 255;
				darkColors[i + 2] = 255;
				darkColors[i + 3] = 128;
			}
			writeToTexture32(gl, vdp.paletteTexture, 0, 2, 4, 1, new Uint8Array(brightColors.buffer));
			writeToTexture32(gl, vdp.paletteTexture, 0, 3, 4, 1, new Uint8Array(darkColors.buffer));

			let originalColors = new Uint8ClampedArray(readFromTexture32(gl, vdp.paletteTexture, 0, 0, 256, 1));
			for (let i = 0; i < 256; i++) {
				originalColors[i * 4 + 0] /= 2;
				originalColors[i * 4 + 1] /= 2;
				originalColors[i * 4 + 2] /= 2;
			}
			writeToTexture32(gl, vdp.paletteTexture, 0, 4, 256, 1, new Uint8Array(originalColors));

			originalColors = new Uint8ClampedArray(readFromTexture32(gl, vdp.paletteTexture, 1, 0, 1, 1));
			originalColors[2] = 200;
			writeToTexture32(gl, vdp.paletteTexture, 1, 0, 1, 1, new Uint8Array(originalColors.buffer));

			originalColors = new Uint8ClampedArray(readFromTexture32(gl, vdp.paletteTexture, 0, 5, 16, 1));
			for (let i = 0; i < 16; i++) {
				originalColors[i * 4 + 0] /= 2;
				originalColors[i * 4 + 1] /= 2;
				originalColors[i * 4 + 2] /= 2;
			}
			writeToTexture32(gl, vdp.paletteTexture, 0, 5, 16, 1, new Uint8Array(originalColors.buffer));
		}
		else {
		}

		vdp.drawBG('level1', { scrollX: 10, scrollY: 100 });
		const marioSprite = vdp.sprite('mario').offsetted(0, 0, 16, 16);
		vdp.drawSprite(marioSprite, 0, 0, { width: 16, height: 16 });

		//mat4.scale(vdp.modelViewMatrix, vdp.modelViewMatrix, [1, 1, 1]);
		//drawMap(vdp,
		// 	0, 0, // UV map
		// 	352, 0, // UV tileset
		// 	423, 28, // Map size
		// 	256, // Tileset size
		// 	8, 8, // Tile size
		// 	0, 0, SCREEN_WIDTH, SCREEN_HEIGHT, // Window
		//	0, 0, // Scroll
		//	5, 0, 1);
		//drawSprite(vdp,
		// 	10, 10, 10+24*2, 10+24*2,
		// 	0, 0, 24, 24,
		// 	0);
		//
		//drawSprite(vdp,
		// 	64, 80, 64+16, 80+16,
		// 	128, 0, 128+16, 0+16,
		// 	1);
		// drawSprite(vdp,
		// 	80, 80, 80+16, 80+16,
		// 	128, 0, 128+16, 0+16,
		// 	2);
		// drawSprite(vdp,
		// 	96, 80, 96+16, 80+16,
		// 	128, 0, 128+16, 0+16,
		// 	3);
		// drawSprite(vdp,
		// 	104, 88, 104+16, 88+16,
		// 	128, 0, 128+16, 0+16,
		// 	3);
		//
		//if (true) {
		// 	// mat4.scale(vdp.modelViewMatrix, vdp.modelViewMatrix, [1, 1, 1]);
		//
		// 	// 2x4 RGBA texels = 4x4 16-bit words
		// 	const mapData = new Uint16Array(readFromTexture32(gl, vdp.mapTexture, 0, 0, 2, 4).buffer);
		// 	for (let i = 0; i < 16; i++) mapData[i] = i;
		// 	mapData[1] = 1 | 1 << 12;
		// 	mapData[0] = 0 | 4 << 12;
		// 	writeToTexture32(gl, vdp.mapTexture, 0, 0, 2, 4, new Uint8Array(mapData.buffer));
		//
		// 	// Only using 8 components, assuming that the last is always 1 (which is OK for affine transformations)
		// 	const mat2 = mat3.create();
		// 	mat3.translate(mat2, mat2, [16, 16]);
		// 	mat3.rotate(mat2, mat2, Math.PI / 2);
		// 	mat3.translate(mat2, mat2, [-SCREEN_WIDTH / 2, -SCREEN_HEIGHT / 2]);
		// 	writeToTextureFloat(gl, vdp.otherTexture, 0, 0, 2, 1, mat2);
		//
		// 	// vdp.drawSprite(0, 0, 160, 160, 0, 0, 8, 8, 1);
		// 	// vdp.drawSprite(70, 50, 160+70, 160+50, 0, 0, 8, 8);
		// 	drawMap(vdp,
		// 		0, 0, // UV map
		// 		0, 0, // UV tileset
		// 		4, 4, // Map size
		// 		128, // Tileset size
		// 		8, 8, // Tile size
		//		0, 0, SCREEN_WIDTH, SCREEN_HEIGHT, // Window
		//		0, 0, // Scroll
		// 		0, 0, 0);
		// }
	});
}
