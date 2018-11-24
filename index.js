import {mat4} from "./gl-matrix";
import {createDataTexture8} from "./vdp/utils";
import {loadVdp} from "./vdp/vdp";

main();


function initBuffers(gl) {

	const positions = [
		0.0,  0.0,  0,
		318.0,  0.0, 0,
		0.0, 240.0,  0,
		318.0, 240.0, 0,
	];

	const colors = [
		1.0,  1.0,  1.0,  1.0,    // white
		1.0,  0.0,  0.0,  1.0,    // red
		0.0,  1.0,  0.0,  1.0,    // green
		0.0,  0.0,  1.0,  1.0,    // blue
	];

	const textureCoordinates = [
		// Front
		0.0,  0.0,
		1.0,  0.0,
		0.0,  1.0,
		1.0,  1.0,
	];

	// Now pass the list of positions into WebGL to build the
	// shape. We do this by creating a Float32Array from the
	// JavaScript array, then use it to fill the current buffer.
	const positionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

	const colorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

	const textureCoordBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW);

	return {
		position: positionBuffer,
		color: colorBuffer,
		textureCoord: textureCoordBuffer
	};
}

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

		vdp.startFrame();

		// gl.activeTexture(gl.TEXTURE1);
		// gl.bindTexture(gl.TEXTURE_2D, dataTex);

		vdp.drawSprite(0, 0, 160, 160, 0, 0, 1, 1);
		vdp.drawSprite(80, 0, 160+80, 160, 0, 0, 1, 1);
	});
}
