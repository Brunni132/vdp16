import {initShaderProgram, makeBuffer} from "./utils";

// For debugging only
export function initSupersimpleShaders(vdp) {
	const gl = vdp.gl;
	// Vertex shader program
	const vsSource = `
			// The 3 first are the vertex position, the 4th is the palette ID
			attribute vec3 aXyz;
			// The 2 first are the texture position
			attribute vec2 aUv;
	
			uniform mat4 uModelViewMatrix;
			uniform mat4 uProjectionMatrix;
	
			varying highp vec2 vTextureCoord;
			uniform sampler2D uSamplerPalettes;
		
			void main(void) {
				gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aXyz.x, aXyz.y, aXyz.z, 1);
				vTextureCoord = aUv;
			}
		`;
	// PERF: this shader is not noticeably faster than the sprite shader. The map shader is ~twice as slow.
	const fsSource = `
			precision highp float;
			
			varying highp vec2 vTextureCoord;
			uniform sampler2D uSamplerPalettes;
	
			void main(void) {
				vec4 color = texture2D(uSamplerPalettes, vTextureCoord);
				if (color.a < 0.1) discard;
				gl_FragColor = color;
			}
		`;

	const TOTAL_VERTICES = 1 * 4;
	const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

	vdp.supersimpleProgram = {
		program: shaderProgram,
		arrayBuffers: {
			xyz: new Float32Array(TOTAL_VERTICES * 3),
			uv: new Float32Array(TOTAL_VERTICES * 2)
		},
		attribLocations: {
			xyz: gl.getAttribLocation(shaderProgram, 'aXyz'),
			uv: gl.getAttribLocation(shaderProgram, 'aUv'),
		},
		glBuffers: {
			xyz: makeBuffer(gl, TOTAL_VERTICES * 3),
			uv: makeBuffer(gl, TOTAL_VERTICES * 2)
		},
		uniformLocations: {
			projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
			modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
			uSamplerPalettes: gl.getUniformLocation(shaderProgram, 'uSamplerPalettes'),
		},
	};
}

// For debugging only
export function drawSupersimple(vdp, xStart, yStart, xEnd, yEnd, uStart, vStart, uEnd, vEnd) {
	const gl = vdp.gl;
	const prog = vdp.supersimpleProgram;
	const positions = [
		xStart, yStart, 0,
		xEnd, yStart, 0,
		xStart, yEnd, 0,
		xEnd, yEnd, 0,
	];

	const textureCoordinates = [
		uStart, vStart,
		uEnd, vStart,
		uStart, vEnd,
		uEnd, vEnd,
	];

	gl.bindBuffer(gl.ARRAY_BUFFER, prog.glBuffers.xyz);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STREAM_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, prog.glBuffers.uv);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STREAM_DRAW);

	gl.useProgram(prog.program);
	{
		const numComponents = 3;  // pull out 4 values per iteration
		const type = gl.FLOAT;    // the data in the buffer is 32bit floats
		const normalize = false;  // don't normalize
		const stride = 0;         // how many bytes to get from one set of values to the next
															// 0 = use type and numComponents above
		const offset = 0;         // how many bytes inside the buffer to start from
		gl.bindBuffer(gl.ARRAY_BUFFER, prog.glBuffers.xyz);
		gl.vertexAttribPointer(prog.attribLocations.xyz, numComponents, type, normalize, stride, offset);
		gl.enableVertexAttribArray(prog.attribLocations.xyz);
	}
	{
		const num = 2, type = gl.FLOAT, normalize = false, stride = 0, offset = 0;
		gl.bindBuffer(gl.ARRAY_BUFFER, prog.glBuffers.uv);
		gl.vertexAttribPointer(prog.attribLocations.uv, num, type, normalize, stride, offset);
		gl.enableVertexAttribArray(prog.attribLocations.uv);
	}

	// Tell WebGL we want to affect texture unit 0
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, vdp.paletteTexture);

	// Tell the shader we bound the texture to texture unit 0
	gl.uniform1i(prog.uniformLocations.uSamplerPalettes, 0);

	// Set the shader uniforms
	gl.uniformMatrix4fv(prog.uniformLocations.projectionMatrix, false, vdp.projectionMatrix);
	gl.uniformMatrix4fv(prog.uniformLocations.modelViewMatrix,false, vdp.modelViewMatrix);

	{
		const offset = 0;
		const vertexCount = 4;
		gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
	}
}

