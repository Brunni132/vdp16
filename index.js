import {mat4} from "./gl-matrix";

main();

//
// Initialize a shader program, so WebGL knows how to draw our data
//
function initShaderProgram(gl, vsSource, fsSource) {
	const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
	const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

	// Create the shader program

	const shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.linkProgram(shaderProgram);

	// If creating the shader program failed, alert

	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
		return null;
	}

	return shaderProgram;
}

//
// creates a shader of the given type, uploads the source and
// compiles it.
//
function loadShader(gl, type, source) {
	const shader = gl.createShader(type);

	// Send the source to the shader object

	gl.shaderSource(shader, source);

	// Compile the shader program

	gl.compileShader(shader);

	// See if it compiled successfully

	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
		gl.deleteShader(shader);
		return null;
	}

	return shader;
}

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
	gl.bufferData(gl.ARRAY_BUFFER,
		new Float32Array(positions),
		gl.STATIC_DRAW);

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
// Initialize a texture and load an image.
// When the image finished loading copy it into the texture.
//
function loadTexture(gl, url, done) {
	const texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);

	// Because images have to be download over the internet
	// they might take a moment until they are ready.
	// Until then put a single pixel in the texture so we can
	// use it immediately. When the image has finished downloading
	// we'll update the texture with the contents of the image.
	const level = 0;
	const internalFormat = gl.RGBA;
	const width = 1;
	const height = 1;
	const border = 0;
	const srcFormat = gl.RGBA;
	const srcType = gl.UNSIGNED_BYTE;
	const pixel = new Uint8Array([0, 0, 255, 255]);  // opaque blue
	gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
		width, height, border, srcFormat, srcType,
		pixel);

	const image = new Image();
	image.onload = function() {
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
			srcFormat, srcType, image);

		// WebGL1 has different requirements for power of 2 images
		// vs non power of 2 images so check if the image is a
		// power of 2 in both dimensions.
		// if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
		// 	// Yes, it's a power of 2. Generate mips.
		// 	gl.generateMipmap(gl.TEXTURE_2D);
		// } else {
			// No, it's not a power of 2. Turn of mips and set
			// wrapping to clamp to edge
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		// }
		if (done) done(texture);
	};
	image.src = url;

	return texture;
}

function createDataTexture8(gl, width, height) {
	const texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);
	// const ext = gl.getExtension('WEBGL_depth_texture');
	// alert(gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT, width, height, 0, gl.DEPTH_COMPONENT, gl.UNSIGNED_INT, null));
	if (width % 4 !== 0) alert(`createDataTexture8: ${width} MUST be mod 4`);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width / 4, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	return texture;
}

//
// start here
//
function main() {
  const canvas = document.querySelector("#glCanvas");
  // Initialize the GL context
  const gl = canvas.getContext("webgl");
  const screenWidth = 320, screenHeight = 240;
  // Vertex shader program
	const vsSource = `
		// The 3 first are the vertex position, the 4th is the line buffer ID
    attribute vec4 aVertexPosition;
    // The 2 first are the texture position
    attribute vec2 aTextureCoord;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying highp vec2 vTextureCoord;
    uniform sampler2D uSampler0, uSampler1;

    int readU8(sampler2D sampler, int x) {
    	int texelXY = int(x / 4);
    	float texelX = mod(float(texelXY), 1024.0) / 1023.0;
    	float texelY = float(texelXY / 1024) / 1024.0;
    	vec4 read = texture2D(sampler, vec2(texelX, texelY));
    	int texelC = x - texelXY * 4;
    	if (texelC == 0) return int(read.r * 255.0);
    	if (texelC == 1) return int(read.g * 255.0);
    	if (texelC == 2) return int(read.b * 255.0);
    	return int(read.a * 255.0);
    }

    int readU16(sampler2D sampler, int x) {
    	int texelXY = int(x / 2);
    	float texelX = mod(float(texelXY), 1024.0) / 1023.0;
    	float texelY = float(texelXY / 1024) / 1024.0;
    	vec4 read = texture2D(sampler, vec2(texelX, texelY));
    	int texelC = x - texelXY * 2;
    	if (texelC == 0) return int(read.r * 255.0) + 256 * int(read.g * 255.0);
    	return int(read.b * 255.0) + 256 * int(read.a * 255.0);
    }

    void main(void) {
    	// highp int xPos = int(texture2D(uSampler1, vec2(0, 0))[3] * 255.0);
    	int xPos = readU16(uSampler1, 3);
    	// float xPos = texture2D(uSampler1, vec2(1.0 / 1023.0, 0))[2] * 255.0;
      gl_Position = uProjectionMatrix * uModelViewMatrix * (aVertexPosition + vec4(xPos, 0, 0, 0));
      vTextureCoord = aTextureCoord;
    }
  `;
	const fsSource = `
    varying highp vec2 vTextureCoord;

    uniform sampler2D uSampler0, uSampler1;

    void main(void) {
    	mediump float x = gl_FragCoord.x, y = float(${screenHeight}) - gl_FragCoord.y;
      gl_FragColor = texture2D(uSampler0, vTextureCoord) * vec4(x / float(${screenWidth}), y / float(${screenHeight}), 0, 1);
    }
  `;

  // Only continue if WebGL is available and working
  if (gl === null) {
    alert("Unable to initialize WebGL. Your browser or machine may not support it.");
    return;
  }

	const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
	const programInfo = {
		program: shaderProgram,
		attribLocations: {
			vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
			textureCoord: gl.getAttribLocation(shaderProgram, 'aTextureCoord'),
		},
		uniformLocations: {
			projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
			modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
			uSampler0: gl.getUniformLocation(shaderProgram, 'uSampler0'),
			uSampler1: gl.getUniformLocation(shaderProgram, 'uSampler1'),
		},
	};

	const texture = loadTexture(gl, 'cube.png', () => {
		const buffers = initBuffers(gl);

		// Set clear color to black, fully opaque
		gl.clearColor(0.0, 0.0, 0.5, 1.0);
		gl.clearDepth(1.0);                 // Clear everything
		gl.enable(gl.DEPTH_TEST);           // Enable depth testing
		gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

		// Clear the canvas before we start drawing on it.
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		// Create a perspective matrix, a special matrix that is
		// used to simulate the distortion of perspective in a camera.
		// Our field of view is 45 degrees, with a width/height
		// ratio that matches the display size of the canvas
		// and we only want to see objects between 0.1 units
		// and 100 units away from the camera.

		const projectionMatrix = mat4.create();
		// note: glmatrix.js always has the first argument
		// as the destination to receive the result.
		mat4.ortho(projectionMatrix, 0.0, 320.0, 240.0, 0.0, 0.1, 100);

		const modelViewMatrix = mat4.create();
		mat4.translate(modelViewMatrix,
			modelViewMatrix,
			[-0.0, 0.0, -0.1]);

		// Tell WebGL how to pull out the positions from the position
		// buffer into the vertexPosition attribute.
		{
			const numComponents = 3;  // pull out 2 values per iteration
			const type = gl.FLOAT;    // the data in the buffer is 32bit floats
			const normalize = false;  // don't normalize
			const stride = 0;         // how many bytes to get from one set of values to the next
																// 0 = use type and numComponents above
			const offset = 0;         // how many bytes inside the buffer to start from
			gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
			gl.vertexAttribPointer(
				programInfo.attribLocations.vertexPosition,
				numComponents,
				type,
				normalize,
				stride,
				offset);
			gl.enableVertexAttribArray(
				programInfo.attribLocations.vertexPosition);
		}

		// Tell WebGL to use our program when drawing
		gl.useProgram(programInfo.program);

		// Create a general-purpose texture
		// TODO Florian -- Test with depth texture (easier to access?)
		const dataTex = createDataTexture8(gl, 4096, 1024);
		const dataTexData = new Uint8Array(8);
		dataTexData[0] = 0;
		dataTexData[1] = 1;
		dataTexData[2] = 10;
		dataTexData[3] = 255;
		dataTexData[4] = 0;
		dataTexData[5] = 0;
		dataTexData[6] = 3;
		dataTexData[7] = 1;
		gl.texSubImage2D(gl.TEXTURE_2D, 0,
			0, 0, // offs
			2, 1, // size
			gl.RGBA, gl.UNSIGNED_BYTE,
			dataTexData
		);

		// tell webgl how to pull out the texture coordinates from buffer
		{
			const num = 2; // every coordinate composed of 2 values
			const type = gl.FLOAT; // the data in the buffer is 32 bit float
			const normalize = false; // don't normalize
			const stride = 0; // how many bytes to get from one set to the next
			const offset = 0; // how many bytes inside the buffer to start from
			gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoord);
			gl.vertexAttribPointer(programInfo.attribLocations.textureCoord, num, type, normalize, stride, offset);
			gl.enableVertexAttribArray(programInfo.attribLocations.textureCoord);

			// Tell WebGL we want to affect texture unit 0
			gl.activeTexture(gl.TEXTURE0);
			// Bind the texture to texture unit 0
			gl.bindTexture(gl.TEXTURE_2D, texture);

			gl.activeTexture(gl.TEXTURE1);
			gl.bindTexture(gl.TEXTURE_2D, dataTex);

			// Tell the shader we bound the texture to texture unit 0
			gl.uniform1i(programInfo.uniformLocations.uSampler0, 0);
			gl.uniform1i(programInfo.uniformLocations.uSampler1, 1);
		}

		// Set the shader uniforms
		gl.uniformMatrix4fv(
			programInfo.uniformLocations.projectionMatrix,
			false,
			projectionMatrix);
		gl.uniformMatrix4fv(
			programInfo.uniformLocations.modelViewMatrix,
			false,
			modelViewMatrix);

		{
			const offset = 0;
			const vertexCount = 4;
			gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
		}
	});
}
