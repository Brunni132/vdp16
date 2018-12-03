const assert = require('assert');

// export function createDataTexture8(gl, width, height) {
// 	const texture = gl.createTexture();
// 	gl.bindTexture(gl.TEXTURE_2D, texture);
// 	// const ext = gl.getExtension('WEBGL_depth_texture');
// 	// alert(gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT, width, height, 0, gl.DEPTH_COMPONENT, gl.UNSIGNED_INT, null));
// 	if (width % 4 !== 0) alert(`createDataTexture8: ${width} MUST be mod 4`);
// 	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width / 4, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
// 	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
// 	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
// 	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
// 	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
// 	return texture;
// }

// If you're going to store 8 bits components for instance, divide the width by 4
export function createDataTexture32(gl, width, height) {
	const texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	return texture;
}

let OES_texture_float_ext = null;

export function createDataTextureFloat(gl, width, height) {
	if (!OES_texture_float_ext) OES_texture_float_ext = gl.getExtension('OES_texture_float');

	const texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.FLOAT, null);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	return texture;
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

//
// Initialize a shader program, so WebGL knows how to draw our data
//
export function initShaderProgram(gl, vsSource, fsSource) {
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
// Initialize a texture and load an image.
// When the image finished loading copy it into the texture.
//
export function loadTexture(gl, url, done) {
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

export function makeBuffer(gl, verticesCount) {
	const result = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, result);
	// TODO Florian -- STREAM_DRAW
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticesCount), gl.STATIC_DRAW);
	return result;
}

export function memcpy(dst, dstOffset, src, srcOffset, length) {
	const dstU8 = new Uint8Array(dst, dstOffset, length);
	const srcU8 = new Uint8Array(src, srcOffset, length);
	dstU8.set(srcU8);
}

let readPixelsFramebuffer = null;

function bindToFramebuffer(gl, texture) {
	if (!readPixelsFramebuffer) {
		readPixelsFramebuffer = gl.createFramebuffer();
	}
	if (texture) {
		gl.bindFramebuffer(gl.FRAMEBUFFER, readPixelsFramebuffer);
		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
	} else {
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	}
}

/**
 * @param gl
 * @param texture
 * @param x {number} in texels (4 bytes per texel)
 * @param y {number}
 * @param w {number} in texels
 * @param h {number}
 * @returns {Uint8Array}
 */
export function readFromTextureU8(gl, texture, x, y, w, h) {
	const result = new Uint8Array(w * h * 4);
	bindToFramebuffer(gl, texture);
	gl.readPixels(x, y, w, h, gl.RGBA, gl.UNSIGNED_BYTE, result);
	bindToFramebuffer(gl, null);
	return result;
}

/**
 * @param gl
 * @param texture
 * @param x {number} in texels (4 bytes per texel)
 * @param y {number}
 * @param w {number} in texels
 * @param h {number}
 * @returns {Uint16Array}
 */
export function readFromTextureU16(gl, texture, x, y, w, h) {
	return new Uint16Array(readFromTextureU8(gl, texture, x, y, w, h).buffer);
}

/**
 * @param gl
 * @param texture
 * @param x {number} in texels (4 bytes per texel)
 * @param y {number}
 * @param w {number} in texels
 * @param h {number}
 * @returns {Uint32Array}
 */
export function readFromTextureU32(gl, texture, x, y, w, h) {
	return new Uint32Array(readFromTextureU8(gl, texture, x, y, w, h).buffer);
}

/**
 * @param gl
 * @param texture
 * @param x {number} in texels (4 bytes per texel)
 * @param y {number}
 * @param w {number} in texels
 * @param h {number}
 * @returns {Float32Array}
 */
export function readFromTextureFloat(gl, texture, x, y, w, h) {
	const result = new Float32Array(w * h * 4);
	bindToFramebuffer(gl, texture);
	gl.readPixels(x, y, w, h, gl.RGBA, gl.FLOAT, result);
	bindToFramebuffer(gl, null);
	return result;
}

/**
 *
 * @param gl
 * @param texture
 * @param x {number} in texels (4 bytes per texel)
 * @param y {number}
 * @param w {number} in texels
 * @param h {number}
 * @param array {Uint8Array}
 */
export function writeToTextureU8(gl, texture, x, y, w, h, array) {
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texSubImage2D(gl.TEXTURE_2D, 0,
		x, y, w, h,
		gl.RGBA, gl.UNSIGNED_BYTE, array);
}

/**
 *
 * @param gl
 * @param texture
 * @param x {number} in texels (4 bytes per texel)
 * @param y {number}
 * @param w {number} in texels
 * @param h {number}
 * @param array {Uint16Array}
 */
export function writeToTextureU16(gl, texture, x, y, w, h, array) {
	writeToTextureU8(gl, texture, x, y, w, h, new Uint8Array(array.buffer));
}

/**
 *
 * @param gl
 * @param texture
 * @param x {number} in texels (4 bytes per texel)
 * @param y {number}
 * @param w {number} in texels
 * @param h {number}
 * @param array {Uint32Array}
 */
export function writeToTextureU32(gl, texture, x, y, w, h, array) {
	writeToTextureU8(gl, texture, x, y, w, h, new Uint8Array(array.buffer));
}

/**
 *
 * @param gl
 * @param texture
 * @param x {number} in texels (4 words per texel)
 * @param y {number}
 * @param w {number} in texels
 * @param h {number}
 * @param array {Float32Array}
 */
export function writeToTextureFloat(gl, texture, x, y, w, h, array) {
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texSubImage2D(gl.TEXTURE_2D, 0,
		x, y, w, h,
		gl.RGBA, gl.FLOAT, array);
}
