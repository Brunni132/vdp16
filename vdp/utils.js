import {mat4, vec3} from 'gl-matrix-ts';

const assert = require('assert');

/**
 * @param mat {mat3type}
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
export class LoadedTexture {
	constructor(texture, image) {
		/** @type {WebGLTexture} */
		this.texture = texture;
		/** @type {number} */
		this.width = image.width;
		/** @type {number} */
		this.height = image.height;
	}
}

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
	const full = new Float32Array(width * height * 4);
	full.fill(0);
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.FLOAT, full);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	return texture;
}

/** creates a shader of the given type, uploads the source and compiles it. */
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

/** Initialize a shader program, so WebGL knows how to draw our data. */
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
 * @returns {Promise<LoadedTexture>} giving a LoadedTexture
 */
export function loadTexture(gl, url) {
	const texture = gl.createTexture();
	const image = new Image();

	gl.bindTexture(gl.TEXTURE_2D, texture);
	return new Promise((resolve) => {
		image.onload = function() {
			gl.bindTexture(gl.TEXTURE_2D, texture);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
			return resolve(new LoadedTexture(texture, image));
		};
		image.src = url;
	});
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
