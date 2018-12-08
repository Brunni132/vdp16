import {
	createDataTexture32,
	createDataTextureFloat,
	loadTexture,
	loadTexture4444,
	readFromTexture32,
	writeToTextureFloat
} from "./utils";
import {mat3, mat4} from "../gl-matrix";
import {drawSprite, initSpriteShaders} from "./sprites";
import {drawMap, initMapShaders} from "./maps";
import {
	HICOLOR_MODE, MAP_TEX_H, MAP_TEX_W,
	OTHER_TEX_W,
	PALETTE_TEX_H,
	PALETTE_TEX_W, SCREEN_HEIGHT, SCREEN_WIDTH,
	SEMITRANSPARENT_CANVAS,
	setParams, SPRITE_TEX_H,
	SPRITE_TEX_W
} from "./shaders";
import {drawSupersimple, initSupersimpleShaders} from "./tests";

class VdpMap {
	/**
	 * @property x {number} U position in the map texture (cells)
	 * @property y {number} V position in the map texture (cells)
	 * @property w {number} width of sprite (pixels)
	 * @property h {number} height of sprite (pixels)
	 * @property designTileset {string} name of the tileset (VdpSprite)
	 * @property designPalette {string} name of the first palette (takes precedence over the one defined in the tileset); tiles can use this and the next 15 palettes via the bits 12-15 in the tile number.
	 */
	constructor(x, y, w, h, designTileset, designPalette) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.designTileset = designTileset;
		this.designPalette = designPalette;
	}

	offsetted(x, y, w, h) {
		this.x += x;
		this.y += y;
		this.w = w;
		this.h = h;
		return this;
	}
}

class VdpPalette {
	/**
	 * @property y {number} V position of palette (color units)
	 * @property size {number} count (color units)
	 */
	constructor(y, size) {
		this.y = y;
		this.size = size;
	}

	offsetted(y, size) {
		this.y += y;
		this.size = size;
		return this;
	}
}

class VdpSprite {
	/**
	 * @property x {number} U position in the sprite texture (pixels)
	 * @property y {number} V position in the sprite texture (pixels)
	 * @property w {number} width of sprite or tileset as a whole (pixels)
	 * @property h {number} height of sprite or tileset as a whole (pixels)
	 * @property tw {number} tile width (pixels) if it's a tileset
	 * @property th {number} tile height (pixels) if it's a tileset
	 * @property designPalette {string} design palette name (can be overriden)
	 */
	constructor(x, y, w, h, tw, th, designPalette) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.tw = tw;
		this.th = th;
		this.designPalette = designPalette;
	}

	offsetted(x, y, w, h) {
		this.x += x;
		this.y += y;
		this.w = w;
		this.h = h;
		return this;
	}
}

class VDP {
	/** @property {WebGLRenderingContext} gl */
	/** @property {BigFile} gameData */
	/**
	 * xyzp: x, y position, base z, base palette no
	 * mapInfo1: u, v map base, u, v tileset base
	 * mapInfo2: map width, map height, tileset width, tileset height
	 * mapInfo3: tile width, tile height, UV drawing (should be 0…1)
	 * @property {{program: *, attribLocations: {xyzp: GLint, mapInfo1: GLint, mapInfo2: GLint, mapInfo3: GLint, mapInfo4: GLint}, buffers: {xyzp, mapInfo1, mapInfo2, mapInfo3, mapInfo4}, uniformLocations: {projectionMatrix: WebGLUniformLocation, modelViewMatrix: WebGLUniformLocation, uSamplerMaps: WebGLUniformLocation, uSamplerSprites: WebGLUniformLocation, uSamplerPalettes: WebGLUniformLocation, uSamplerOthers: WebGLUniformLocation}}} mapProgram
	 */
	/** @property {number} mapTexture */
	/** @property {mat4} modelViewMatrix */
	/** @property {mat4} projectionMatrix */
	/**
	 * @property {{program: *, arrayBuffers: {xyzp: Float32Array, uv: Float32Array}, attribLocations: {xyzp: GLint, uv: GLint}, buffers: {xyzp, uv}, uniformLocations: {projectionMatrix: WebGLUniformLocation, modelViewMatrix: WebGLUniformLocation, uSamplerSprites: WebGLUniformLocation, uSamplerPalettes: WebGLUniformLocation}}} spriteProgram
	 */
	/** @property {{program: *, arrayBuffers: {xyz: Float32Array, uv: Float32Array}, attribLocations: {xyz: GLint, uv: GLint}, buffers: {xyz, uv}, uniformLocations: {projectionMatrix: WebGLUniformLocation, modelViewMatrix: WebGLUniformLocation, uSamplerPalettes: WebGLUniformLocation}}} supersimpleProgram */
	/** @type {WebGLTexture} mapTexture */
	/** @type {WebGLTexture} paletteTexture */
	/** @type {WebGLTexture} spriteTexture */
	/** @type {WebGLTexture} otherTexture */

	/**
	 * @param canvas {HTMLCanvasElement}
	 * @param done {function()}
	 */
	constructor(canvas, done) {
		this._initContext(canvas);
		initMapShaders(this);
		initSpriteShaders(this);
		initSupersimpleShaders(this);
		this._initMatrices();

		const gl = this.gl;
		const loadTextureType = HICOLOR_MODE ? loadTexture : loadTexture4444;
		// TODO Florian -- Use promises for loadTexture, make them all at the same time and wait for them all. Same for fetch
		window.fetch('build/game.json').then((res) => res.json()).then((json) => {
			this.gameData = json;

			loadTexture(gl, 'build/sprites.png', (tex, image) => {
				if (image.width !== SPRITE_TEX_W || image.height !== SPRITE_TEX_H)
					throw new Error('Mismatch in texture size');
				this.spriteTexture = tex;

				loadTextureType(gl, 'build/palettes.png', (tex, image) => {
					if (image.width !== 256 && HICOLOR_MODE || image.width !== 16 && !HICOLOR_MODE)
						throw new Error('Mismatch in hi-color mode and passed textures');
					if (image.width !== PALETTE_TEX_W || image.height !== PALETTE_TEX_H)
						throw new Error('Mismatch in texture size');
					this.paletteTexture = tex;

					loadTexture(gl, 'build/maps.png', (tex, image) => {
						if (image.width !== MAP_TEX_W || image.height !== MAP_TEX_H)
							throw new Error('Mismatch in texture size');
						this.mapTexture = tex;

						this.otherTexture = createDataTextureFloat(gl, OTHER_TEX_W, OTHER_TEX_W);
						// Store a default identity matrix for linescroll buffer 0
						// Only using 8 components, assuming that the last is always 1 (which is OK for affine transformations)
						const mat = mat3.create();
						writeToTextureFloat(gl, this.otherTexture, 0, 0, 2, 1, mat);
						done();
					});
				});
			});
		});
	}

	startFrame() {
		const gl = this.gl;

		// PERF: Has a moderate hit on performance (almost zero on the Surface Pro). It can even be faster if the image has pixel with zero alpha, the Surface Pro does some optimizations for fully transparent pixels. Else you have to discard them, and if you discard them you get even better performance.
		// If you discard a lot of pixels there's almost no change. If the sprite is fully opaque there's no change either.
		// In general it's probably better left on, the GPU already does all the optimizations.
		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

		// TODO Florian -- Set clear color to palette[0, 0]
		gl.clearColor(0.0, 0.0, 0.5, 0.0);
		gl.clearDepth(1.0);                 // Clear everything
		// PERF: This is a lot slower if there's a discard in the fragment shader (and we need one?) because the GPU can't test & write to the depth buffer until after the fragment shader has been executed. So there's no point in using it I guess.
		// gl.enable(gl.DEPTH_TEST);           // Enable depth testing
		// gl.depthFunc(gl.LESS);            // Near things obscure far things

		// Clear the canvas before we start drawing on it.
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	}

	/**
	 * @param name {string}
	 * @returns {VdpMap}
	 */
	map(name) {
		const map = this.gameData.maps[name];
		if (!map) throw new Error(`Map ${name} not found`);
		return new VdpMap(map.x, map.y, map.w, map.h, map.til, map.pal);
	}

	/**
	 * @param name {string}
	 * @returns {VdpPalette}
	 */
	palette(name) {
		const pal = this.gameData.pals[name];
		if (!pal) throw new Error(`Palette ${name} not found`);
		return new VdpPalette(pal.y, pal.size);
	}

	/**
	 * @param name {string}
	 * @returns {VdpSprite}
	 */
	sprite(name) {
		const spr = this.gameData.sprites[name];
		if (!spr) throw new Error(`Sprite ${name} not found`);
		return new VdpSprite(spr.x, spr.y, spr.w, spr.h, spr.tw, spr.th, spr.pal);
	}

	/**
	 * @param map {string|VdpMap} map to draw (e.g. vdp.map('level1') or just 'level1')
	 * @param [opts] {Object}
	 * @param opts.palette {string|VdpPalette} specific base palette to use (for the normal tiles). Keep in mind that individual map tiles may use the next 15 palettes by setting the bits 12-15 of the tile number.
	 * @param opts.scrollX {number} horizontal scrolling
	 * @param opts.scrollY {number} vertical scrolling
	 * @param opts.winX {number} left coordinate on the screen to start drawing from (default to 0)
	 * @param opts.winY {number} top coordinate on the screen to start drawing from (default to 0)
	 * @param opts.winW {number} width after which to stop drawing (defaults to SCREEN_WIDTH)
	 * @param opts.winH {number} height after which to stop drawing (defaults to SCREEN_HEIGHT)
	 * @param opts.linescrollBuffer {number} number of the linescroll buffer to use
	 * @param opts.wrap {boolean} whether to wrap the map at the bounds (defaults to true)
	 * @param opts.tileset {string|VdpSprite} custom tileset to use.
	 */
	drawBG(map, opts = {}) {
		if (typeof map === 'string') map = this.map(map);
		// TODO Florian -- no need for such a param, since the user can modify map.designPalette himself…
		// Maybe the other options could be in the map too… (just beware that they are strings, not actual links to the palette/tileset… but we could typecheck too)
		const pal = this._getPalette(opts.hasOwnProperty('palette') ? opts.palette : map.designPalette);
		const til = this._getSprite(opts.hasOwnProperty('tileset') ? opts.tilest : map.designTileset);
		const scrollX = opts.hasOwnProperty('scrollX') ? opts.scrollX : 0;
		const scrollY = opts.hasOwnProperty('scrollY') ? opts.scrollY : 0;
		const winX = opts.hasOwnProperty('winX') ? opts.winX : 0;
		const winY = opts.hasOwnProperty('winY') ? opts.winY : 0;
		const winW = opts.hasOwnProperty('winW') ? opts.winW : SCREEN_WIDTH;
		const winH = opts.hasOwnProperty('winH') ? opts.winH : SCREEN_HEIGHT;
		const linescrollBuffer = opts.hasOwnProperty('linescrollBuffer') ? opts.linescrollBuffer : 0;
		const wrap = opts.hasOwnProperty('wrap') ? opts.wrap : true;

		drawMap(this, map.x, map.y, til.x, til.y, map.w, map.h, til.w, til.tw, til.th, winX, winY, winW, winH, scrollX, scrollY, pal.y, linescrollBuffer, wrap ? 1 : 0);
	}

	/**
	 * @param sprite {string|VdpSprite} sprite to draw (e.g. vdp.sprite('plumber') or just 'plumber')
	 * @param x {number} position (X coord)
	 * @param y {number} position (Y coord)
	 * @param [opts] {Object}
	 * @param opts.palette {VdpPalette} specific palette to use (otherwise just uses the design palette of the sprite)
	 * @param opts.width {number} width on the screen (stretches the sprite compared to sprite.w)
	 * @param opts.height {number} height on the screen (stretches the sprite compared to sprite.h)
	 */
	drawSprite(sprite, x, y, opts = {}) {
		if (typeof sprite === 'string') sprite = this.sprite(sprite);
		// TODO Florian -- no need for such a param, since the user can modify sprite.designPalette himself…
		const pal = this._getPalette(opts.hasOwnProperty('palette') ? opts.palette : sprite.designPalette);
		const w = opts.hasOwnProperty('width') ? opts.width : sprite.w;
		const h = opts.hasOwnProperty('height') ? opts.height : sprite.h;

		drawSprite(this, x, y, x + w, y + h, sprite.x, sprite.y, sprite.x + sprite.w, sprite.y + sprite.h, pal.y);
	}

	// --------------------- PRIVATE ---------------------
	/**
	 * @param name {string|VdpPalette}
	 * @private
	 * @return {VdpPalette}
	 */
	_getPalette(name) {
		if (typeof name === 'string') return this.palette(name);
		return name;
	}

	/**
	 * @param name {string|VdpSprite}
	 * @private
	 * @return {VdpSprite}
	 */
	_getSprite(name) {
		if (typeof name === 'string') return this.sprite(name);
		return name;
	}

	/**
	 * @param canvas {HTMLCanvasElement}
	 * @private
	 */
	_initContext(canvas) {
		this.gl = canvas.getContext("webgl", { premultipliedAlpha: true, alpha: SEMITRANSPARENT_CANVAS });

		// Only continue if WebGL is available and working
		if (this.gl === null) {
			alert("Unable to initialize WebGL. Your browser or machine may not support it.");
		}
	}

	/**
	 * @private
	 */
	_initMatrices() {
		this.projectionMatrix = mat4.create();
		// note: glmatrix.js always has the first argument as the destination to receive the result.
		mat4.ortho(this.projectionMatrix, 0.0, SCREEN_WIDTH, SCREEN_HEIGHT, 0.0, 0.1, 100);

		// Normally set in modelViewMatrix, but we want to allow an empty model view matrix
		mat4.translate(this.projectionMatrix, this.projectionMatrix, [-0.0, 0.0, -0.1]);

		this.modelViewMatrix = mat4.create();
		// mat4.translate(this.modelViewMatrix, this.modelViewMatrix, [-0.0, 0.0, -0.1]);
	}
}

/**
 * @param canvas {HTMLCanvasElement}
 * @returns {Promise}
 */
export function loadVdp(canvas) {
	setParams(canvas.width, canvas.height, true, false);
	return new Promise(function (resolve) {
		const vdp = new VDP(canvas, () => {
			vdp.startFrame();
			resolve(vdp);
		});
	});
}

/**
 * @param {VDP} vdp
 * @param {IterableIterator<number>} coroutine
 */
export function runProgram(vdp, coroutine) {
	let last = 0, called = 0;

	function step(timestamp) {
		timestamp = Math.floor(timestamp / 1000);
		if (timestamp !== last) {
			console.log(`Called ${called} times`);
			called = 0;
		}
		called++;
		last = timestamp;

		vdp.startFrame();
		coroutine.next();
		window.requestAnimationFrame(step);
	}

	window.requestAnimationFrame(step);
}
