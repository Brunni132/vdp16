import {mat4, vec3} from "../gl-matrix";

const assert = require('assert');

/**
 * @param mat {mat3}
 * @returns {vec3}
 */
export function getScalingFactorOfMatrix(mat) {
	const scaling = vec3.create();
	const fullMat = mat4.fromValues(
		mat[0], mat[1], mat[2], 0,
		mat[3], mat[4], mat[5], 0,
		mat[6], mat[7], mat[8], 0,
		0, 0, 0, 1);
	mat4.getScaling(scaling, fullMat);
	return scaling;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Texture
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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

/**
 * @param gl {WebGLRenderingContext}
 * @param url {string}
 * @param done {function(WebGLTexture, HTMLImageElement)}
 * @returns {WebGLTexture}
 */
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
		if (done) done(texture, image);
	};
	image.src = url;

	return texture;
}

/**
 * @param gl {WebGLRenderingContext}
 * @param url {string}
 * @param done {function(WebGLTexture, HTMLImageElement)}
 * @returns {WebGLTexture}
 */
export function loadTexture4444(gl, url, done) {
	const texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);

	const level = 0;
	const internalFormat = gl.RGBA;
	const width = 1;
	const height = 1;
	const border = 0;
	const srcFormat = gl.RGBA;
	const srcType = gl.UNSIGNED_SHORT_4_4_4_4;
	const pixel = new Uint16Array([0xff00]);  // opaque blue
	gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
		width, height, border, srcFormat, srcType,
		pixel);

	const image = new Image();
	image.onload = function() {
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, srcFormat, srcType, image);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		if (done) done(texture, image);
	};
	image.src = url;

	return texture;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Color
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Extends a 16 bit RGBA color into a 32 bit RGBA color. Note that 0xRGBA will produce 0xAABBGGRR, reversing the byte
 * order as OpenGL expects it.
 * @param col {number}
 * @returns {number}
 */
function extendColor16(col) {
	return reverseColor32((col & 0xf) | (col & 0xf) << 4 |
		(col & 0xf0) << 4 | (col & 0xf0) << 8 |
		(col & 0xf00) << 8 | (col & 0xf00) << 12 |
		(col & 0xf000) << 12 | (col & 0xf000) << 16);
}

/**
 * Parses a color, always in 32-bit RGBA format.
 * @param col {number|string} either a 12-bit number (0xrgb0), a 32-bit number (0xaabbggrr)
 * or a string (#rgb, #rrggbb, #rrggbbaa).
 * @private
 * @returns {number} the color in 32-bit RGBA format.
 */
export function parseColor(col) {
	if (typeof col === 'string') {
		if (col.charAt(0) !== '#') col = ''; // fail

		// Invert byte order
		switch (col.length) {
		case 4:
			col = parseInt(col.substring(1), 16);
			// col = (col & 0xf) << 8 | (col & 0xf0) | (col >>> 8 & 0xff);
			return extendColor16(col << 4 | 0xf);
		case 5:
			col = parseInt(col.substring(1), 16);
			// col = (col & 0xf) << 12 | (col >> 4 & 0xf) << 8 | (col >> 8 & 0xf) << 4 | (col >> 12 & 0xf);
			return extendColor16(col);
		case 7:
			col = parseInt(col.substring(1), 16);
			// Pass a RGBA with alpha=ff
			return reverseColor32(col << 8 | 0xff);
		case 9:
			col = parseInt(col.substring(1), 16);
			return reverseColor32(col);
		default:
			throw new Error(`Invalid color string ${col}`);
		}
	}

	if (col <= 0xffff) {
		// 16-bit to 32
		return extendColor16(col);
	}
	else if (col <= 0xffffff) {
		// 24-bit to 32
		return col | 0xff << 24;
	}
	return col;
}

/**
 * Reverses the byte order of a RGBA color.
 * @param col {number}
 * @returns {number}
 */
function reverseColor32(col) {
	return (col & 0xff) << 24 | (col >>> 8 & 0xff) << 16 | (col >>> 16 & 0xff) << 8 | (col >>> 24 & 0xff);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Buffer - memory
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export function makeBuffer(gl) {
	return gl.createBuffer();
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
 * @param first {number}
 * @param n {number}
 * @returns {Array} an array with [first, first+1, …, first+n-1]
 */
export function makeRangeArray(first, n) {
	return Array.from({length: n}, (v, k) => first + k);
	//return Array.apply(null, {length: n}).map(Number.call, Number)
}

/**
 * @param n {number}
 * @returns {Array} an array with [n-1, n-2, …, 1, 0]
 */
export function makeReverseRangeArray(n) {
	return Array.from({length: n}, (v, k) => n - 1 - k);
}

/**
 * @param gl
 * @param texture
 * @param x {number} in texels (1 16-bit word per texel)
 * @param y {number}
 * @param w {number} in texels
 * @param h {number}
 * @returns {Uint16Array}
 */
export function readFromTexture16(gl, texture, x, y, w, h) {
	const result = new Uint16Array(w * h);
	bindToFramebuffer(gl, texture);
	gl.readPixels(x, y, w, h, gl.RGBA, gl.UNSIGNED_SHORT_4_4_4_4, result);
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
 * @returns {Uint8Array}
 */
export function readFromTexture32(gl, texture, x, y, w, h) {
	const result = new Uint8Array(w * h * 4);
	bindToFramebuffer(gl, texture);
	gl.readPixels(x, y, w, h, gl.RGBA, gl.UNSIGNED_BYTE, result);
	bindToFramebuffer(gl, null);
	return result;
}

/**
 * @param gl
 * @param texture
 * @param x {number} in texels (2 bytes per texel)
 * @param y {number}
 * @param w {number} in texels
 * @param h {number}
 * @param result {Uint16Array}
 */
export function readFromTextureToExisting16(gl, texture, x, y, w, h, result) {
	bindToFramebuffer(gl, texture);
	gl.readPixels(x, y, w, h, gl.RGBA, gl.UNSIGNED_SHORT_4_4_4_4, result);
	bindToFramebuffer(gl, null);
}

/**
 * @param gl
 * @param texture
 * @param x {number} in texels (4 bytes per texel)
 * @param y {number}
 * @param w {number} in texels
 * @param h {number}
 * @param result {Uint8Array}
 */
export function readFromTextureToExisting(gl, texture, x, y, w, h, result) {
	bindToFramebuffer(gl, texture);
	gl.readPixels(x, y, w, h, gl.RGBA, gl.UNSIGNED_BYTE, result);
	bindToFramebuffer(gl, null);
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
 * Do not use this for float arrays!
 * @param gl
 * @param texture
 * @param x {number} in texels (1 16-bit word per texel)
 * @param y {number}
 * @param w {number} in texels
 * @param h {number}
 * @param array {Uint16Array}
 */
export function writeToTexture16(gl, texture, x, y, w, h, array) {
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texSubImage2D(gl.TEXTURE_2D, 0,
		x, y, w, h,
		gl.RGBA, gl.UNSIGNED_SHORT_4_4_4_4, array);
}

/**
 * Do not use this for float arrays!
 * @param gl
 * @param texture
 * @param x {number} in texels (4 bytes per texel)
 * @param y {number}
 * @param w {number} in texels
 * @param h {number}
 * @param array {Uint8Array}
 */
export function writeToTexture32(gl, texture, x, y, w, h, array) {
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texSubImage2D(gl.TEXTURE_2D, 0,
		x, y, w, h,
		gl.RGBA, gl.UNSIGNED_BYTE, array);
}

/**
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

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Other
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export function TEMP_MakeDualTriangle(array, stride) {
	// TODO Florian -- Replace with indexed vertices when possible
	return [].concat.apply([], [
		array.slice(0, stride),
		array.slice(stride, 2 * stride),
		array.slice(3 * stride, 4 * stride),

		array.slice(0, 1 * stride),
		array.slice(3 * stride, 4 * stride),
		array.slice(2 * stride, 3 * stride)
	]);
}
