// import { initShaderProgram, makeBuffer } from "./utils";
// import { VDP } from './vdp';
// import { colorSwaps, declareReadPalette } from './shaders';
//
// // For debugging only
// export function initOpaquePolyShaders(vdp: VDP) {
// 	const gl = vdp._gl;
// 	// Vertex shader program
// 	const vsSource = `
// 			attribute vec2 aXy;
// 			attribute vec4 aColor;
//
// 			uniform mat3 uModelViewMatrix;
// 			uniform mat4 uProjectionMatrix;
//
// 			varying lowp vec4 vColor;
//
// 			void main(void) {
// 				vec4 pos = uProjectionMatrix * vec4(floor(uModelViewMatrix * vec3(aXy, 0)), 1);
// 				pos.z = 0.0;
// 				gl_Position = pos;
// 				vColor = aColor;
// 			}
// 		`;
// 	// Hack: drawing a poly with alpha=0 will fill the backdrop
// 	const fsSource = `precision highp float;
//     varying vec4 vColor;
// 		uniform vec4 uColorSwaps;
// 		uniform sampler2D uSamplerOthers, uSamplerPalettes;
//
//     ${declareReadPalette(false)}
//
//     void main(void) {
//       if (vColor.a > 0.0) {
// 	      gl_FragColor = vColor;
// 	    } else {
// 		    vec4 color = readPalette(0.0, 0.0);
// 				gl_FragColor = vec4(color.rgb, 1.0);
// 			}
//     }
//   `;
//
// 	const TOTAL_VERTICES = 1 * 4;
// 	const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
//
// 	vdp._opaquePolyProgram = {
// 		program: shaderProgram,
// 		arrayBuffers: {
// 			xy: new Float32Array(TOTAL_VERTICES * 2),
// 			// TODO Florian -- Use u8 if possible
// 			color: new Float32Array(TOTAL_VERTICES * 4)
// 		},
// 		attribLocations: {
// 			xy: gl.getAttribLocation(shaderProgram, 'aXy'),
// 			color: gl.getAttribLocation(shaderProgram, 'aColor'),
// 		},
// 		glBuffers: {
// 			xy: makeBuffer(gl),
// 			color: makeBuffer(gl)
// 		},
// 		uniformLocations: {
// 			colorSwaps: gl.getUniformLocation(shaderProgram, 'uColorSwaps'),
// 			projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
// 			modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
// 			uSamplerOthers: gl.getUniformLocation(shaderProgram, 'uSamplerOthers'),
// 			uSamplerPalettes: gl.getUniformLocation(shaderProgram, 'uSamplerPalettes'),
// 		},
// 	};
// }
//
// // Color is float (r, g, b, a) between 0 and 1
// export function drawOpaquePoly(vdp: VDP, xStart: number, yStart: number, xEnd: number, yEnd: number, colorR: number, colorG: number, colorB: number, colorA: number) {
// 	const gl = vdp._gl;
// 	const prog = vdp._opaquePolyProgram;
// 	const positions = [
// 		xStart, yStart,
// 		xEnd, yStart,
// 		xStart, yEnd,
// 		xEnd, yEnd,
// 	];
// 	// TODO Florian -- use indexed vertices
// 	const colors = [
// 		colorR, colorG, colorB, colorA,
// 		colorR, colorG, colorB, colorA,
// 		colorR, colorG, colorB, colorA,
// 		colorR, colorG, colorB, colorA,
// 	];
//
// 	gl.bindBuffer(gl.ARRAY_BUFFER, prog.glBuffers.xy);
// 	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STREAM_DRAW);
// 	gl.bindBuffer(gl.ARRAY_BUFFER, prog.glBuffers.color);
// 	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STREAM_DRAW);
//
// 	gl.useProgram(prog.program);
// 	{
// 		const numComponents = 2;  // pull out 4 values per iteration
// 		const type = gl.FLOAT;    // the data in the buffer is 32bit floats
// 		const normalize = false;  // don't normalize
// 		const stride = 0;         // how many bytes to get from one set of values to the next
// 															// 0 = use type and numComponents above
// 		const offset = 0;         // how many bytes inside the buffer to start from
// 		gl.bindBuffer(gl.ARRAY_BUFFER, prog.glBuffers.xy);
// 		gl.vertexAttribPointer(prog.attribLocations.xy, numComponents, type, normalize, stride, offset);
// 		gl.enableVertexAttribArray(prog.attribLocations.xy);
// 	}
// 	{
// 		const num = 4, type = gl.FLOAT, normalize = false, stride = 0, offset = 0;
// 		gl.bindBuffer(gl.ARRAY_BUFFER, prog.glBuffers.color);
// 		gl.vertexAttribPointer(prog.attribLocations.color, num, type, normalize, stride, offset);
// 		gl.enableVertexAttribArray(prog.attribLocations.color);
// 	}
//
// 	// Tell WebGL we want to affect texture unit 0
// 	gl.activeTexture(gl.TEXTURE0);
// 	gl.bindTexture(gl.TEXTURE_2D, vdp._paletteTexture);
// 	gl.activeTexture(gl.TEXTURE1);
// 	gl.bindTexture(gl.TEXTURE_2D, vdp._otherTexture);
//
// 	// Tell the shader we bound the texture to texture unit 0
// 	gl.uniform1i(prog.uniformLocations.uSamplerPalettes, 0);
// 	gl.uniform1i(prog.uniformLocations.uSamplerOthers, 1);
//
// 	// Set the shader uniforms
// 	gl.uniform4f(prog.uniformLocations.colorSwaps, colorSwaps[0], colorSwaps[1], colorSwaps[2], colorSwaps[3]);
// 	gl.uniformMatrix4fv(prog.uniformLocations.projectionMatrix, false, vdp._projectionMatrix);
// 	gl.uniformMatrix3fv(prog.uniformLocations.modelViewMatrix,false, vdp._modelViewMatrix);
//
// 	{
// 		const offset = 0;
// 		const vertexCount = 4;
// 		gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
// 	}
// }
