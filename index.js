import {loadVdp} from "./vdp/vdp";

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

		const dataTexData = new Uint8Array(8);
		for (let i = 0; i < 8; i++) {
			dataTexData[i] = i % 8;
		}
		gl.bindTexture(gl.TEXTURE_2D, vdp.spriteTexture);
		gl.texSubImage2D(gl.TEXTURE_2D, 0,
			0, 0,
			2, 1,
			gl.RGBA, gl.UNSIGNED_BYTE,
			dataTexData);

		vdp.startFrame();

		// gl.activeTexture(gl.TEXTURE1);
		// gl.bindTexture(gl.TEXTURE_2D, dataTex);

		vdp.drawSprite(0, 0, 160, 160, 0, 0, 8, 8, 1);
		vdp.drawSprite(70, 50, 160+70, 160+50, 0, 0, 8, 8);
	});
}
