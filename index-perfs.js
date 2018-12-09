/**
 * @param vdp {VDP}
 * @returns {IterableIterator<number>}
 */
import {loadVdp, runProgram} from "./vdp/vdp";

function *main(vdp) {
	let scroll = 0;

	// const mapData = vdp.readMap('level1');
	// mapData.forEach((d, i) => {
	// 	mapData[i] = Math.max(0, mapData[i] - 4);
	// });
	// vdp.writeMap('level1', mapData);

	const palData = vdp.readPalette('Mario');
	palData.forEach((d, i) => {
		palData[i] = palData[i] * 2;
	});
	vdp.writePalette('Mario', palData);

	while (true) {
		// const mat = mat3.create();
		// mat3.scale(mat, mat, [1, 1]);
		// mat3.translate(mat, mat, [scroll, 0, 0]);
		// writeToTextureFloat(vdp.gl, vdp.otherTexture, 0, 0, 2, 1, mat);

		vdp.drawBG('level1', { scrollX: scroll });

		// Take the (0, 0, 16, 16) part of the big mario sprite
		const marioSprite = vdp.sprite('mario').offsetted(0, 0, 16, 16);
		// And draw it 32x32 (2x zoom)
		vdp.drawObj(marioSprite, Math.floor(scroll), 200, {width: 32, height: 32});

		scroll += 0.05;
		yield 0;
	}
}

loadVdp(document.querySelector("#glCanvas")).then(vdp => runProgram(vdp, main(vdp)));
