import {initShaderProgram, makeBuffer} from "./utils";

// For debugging only
export function initOpaquePolyShaders(vdp) {
	const gl = vdp.gl;
	// Vertex shader program
	const vsSource = `
			attribute vec2 aXy;
			attribute vec4 aColor;
	
			uniform mat3 uModelViewMatrix;
			uniform mat4 uProjectionMatrix;
	
			varying lowp vec4 vColor;
		
			void main(void) {
				gl_Position = uProjectionMatrix * vec4(floor(uModelViewMatrix * vec3(aXy, 0)), 1);
				vColor = aColor;
			}
		`;
	const fsSource = `
    varying lowp vec4 vColor;

    void main(void) {
      gl_FragColor = vColor;
    }
  `;

	const TOTAL_VERTICES = 1 * 4;
	const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

	vdp.opaquePolyProgram = {
		program: shaderProgram,
		arrayBuffers: {
			xy: new Float32Array(TOTAL_VERTICES * 2),
			// TODO Florian -- Use u8 if possible
			color: new Float32Array(TOTAL_VERTICES * 4)
		},
		attribLocations: {
			xy: gl.getAttribLocation(shaderProgram, 'aXy'),
			color: gl.getAttribLocation(shaderProgram, 'aColor'),
		},
		glBuffers: {
			xy: makeBuffer(gl),
			color: makeBuffer(gl)
		},
		uniformLocations: {
			projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
			modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix')
		},
	};
}

// Color is float (r, g, b, a) between 0 and 1
/**
 * @param vdp {VDP}
 * @param xStart
 * @param yStart
 * @param xEnd
 * @param yEnd
 * @param colorR
 * @param colorG
 * @param colorB
 * @param colorA
 */
export function drawOpaquePoly(vdp, xStart, yStart, xEnd, yEnd, colorR, colorG, colorB, colorA) {
	const gl = vdp.gl;
	const prog = vdp.opaquePolyProgram;
	const positions = [
		xStart, yStart,
		xEnd, yStart,
		xStart, yEnd,
		xEnd, yEnd,
	];
	// TODO Florian -- use indexed vertices
	const colors = [
		colorR, colorG, colorB, colorA,
		colorR, colorG, colorB, colorA,
		colorR, colorG, colorB, colorA,
		colorR, colorG, colorB, colorA,
	];

	gl.bindBuffer(gl.ARRAY_BUFFER, prog.glBuffers.xy);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STREAM_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, prog.glBuffers.color);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STREAM_DRAW);

	gl.useProgram(prog.program);
	{
		const numComponents = 2;  // pull out 4 values per iteration
		const type = gl.FLOAT;    // the data in the buffer is 32bit floats
		const normalize = false;  // don't normalize
		const stride = 0;         // how many bytes to get from one set of values to the next
															// 0 = use type and numComponents above
		const offset = 0;         // how many bytes inside the buffer to start from
		gl.bindBuffer(gl.ARRAY_BUFFER, prog.glBuffers.xy);
		gl.vertexAttribPointer(prog.attribLocations.xy, numComponents, type, normalize, stride, offset);
		gl.enableVertexAttribArray(prog.attribLocations.xy);
	}
	{
		const num = 4, type = gl.FLOAT, normalize = false, stride = 0, offset = 0;
		gl.bindBuffer(gl.ARRAY_BUFFER, prog.glBuffers.color);
		gl.vertexAttribPointer(prog.attribLocations.color, num, type, normalize, stride, offset);
		gl.enableVertexAttribArray(prog.attribLocations.color);
	}

	// Set the shader uniforms
	gl.uniformMatrix4fv(prog.uniformLocations.projectionMatrix, false, vdp.projectionMatrix);
	gl.uniformMatrix3fv(prog.uniformLocations.modelViewMatrix,false, vdp.modelViewMatrix);

	{
		const offset = 0;
		const vertexCount = 4;
		gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
	}
}

