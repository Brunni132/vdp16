import {
	createDataTexture32,
	createDataTextureFloat,
	loadTexture,
	loadTexture4444,
	readFromTexture32, readFromTextureToExisting, readFromTextureToExisting16, writeToTexture16, writeToTexture32,
	writeToTextureFloat
} from "./utils";
import {mat3, mat4} from "../gl-matrix";
import {drawPendingObj, drawObj, initSpriteShaders} from "./sprites";
import {drawMap, initMapShaders} from "./maps";
import {
	MAP_TEX_H, MAP_TEX_W,
	OTHER_TEX_W, PALETTE_HICOLOR_FLAG,
	PALETTE_TEX_H,
	PALETTE_TEX_W, SCREEN_HEIGHT, SCREEN_WIDTH,
	SEMITRANSPARENT_CANVAS,
	setParams, setTextureSizes, SPRITE_TEX_H,
	SPRITE_TEX_W, TRUECOLOR_MODE, USE_PRIORITIES
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
	 * @property hiColor {boolean} whether it's a 8-bit-per-pixel tile (or 4-bit)
	 * @property designPalette {string} design palette name (can be overriden)
	 */
	constructor(x, y, w, h, tw, th, hiColor, designPalette) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.tw = tw;
		this.th = th;
		this.hiColor = hiColor;
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

// class VdpMapBuffer {
// 	/**
// 	 * @property vramX {number}
// 	 * @property vramY {number}
// 	 * @property vramW {number}
// 	 * @property vramH {number}
// 	 * @property data {Uint16Array}
// 	 */
// 	constructor(vramX, vramY, vramW, vramH, data) {
// 		this.vramX = vramX;
// 		this.vramY = vramY;
// 		this.vramW = vramW;
// 		this.vramH = vramH;
// 		this.data = data;
// 	}
//
// 	/**
// 	 * @param vdp
// 	 */
// 	commit(vdp) {
//
// 	}
// }

class VDP {
	/** @property {WebGLRenderingContext} gl */
	/** @property {BigFile} gameData */
	/**
	 * xyzp: x, y position, base z, base palette no
	 * mapInfo1: u, v map base, u, v tileset base
	 * mapInfo2: map width, map height, tileset width, tileset height
	 * mapInfo3: tile width, tile height, UV drawing (should be 0…1)
	 * @property {{program: *, attribLocations: {xyzp: GLint, mapInfo1: GLint, mapInfo2: GLint, mapInfo3: GLint, mapInfo4: GLint}, glBuffers: {xyzp, mapInfo1, mapInfo2, mapInfo3, mapInfo4}, uniformLocations: {projectionMatrix: WebGLUniformLocation, modelViewMatrix: WebGLUniformLocation, uSamplerMaps: WebGLUniformLocation, uSamplerSprites: WebGLUniformLocation, uSamplerPalettes: WebGLUniformLocation, uSamplerOthers: WebGLUniformLocation}}} mapProgram
	 */
	/** @property {mat4} modelViewMatrix */
	/** @property {mat4} projectionMatrix */
	/**
	 * @property {{program: *, arrayBuffers: {xyzp: Float32Array, uv: Float32Array}, attribLocations: {xyzp: GLint, uv: GLint}, glBuffers: {xyzp, uv}, pendingVertices, uniformLocations: {projectionMatrix: WebGLUniformLocation, modelViewMatrix: WebGLUniformLocation, uSamplerSprites: WebGLUniformLocation, uSamplerPalettes: WebGLUniformLocation}}} spriteProgram
	 */
	/** @property {{program: *, arrayBuffers: {xyz: Float32Array, uv: Float32Array}, attribLocations: {xyz: GLint, uv: GLint}, glBuffers: {xyz, uv}, uniformLocations: {projectionMatrix: WebGLUniformLocation, modelViewMatrix: WebGLUniformLocation, uSamplerPalettes: WebGLUniformLocation}}} supersimpleProgram */
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
		this._initMatrices();

		const gl = this.gl;
		const loadTextureType = TRUECOLOR_MODE ? loadTexture : loadTexture4444;
		// TODO Florian -- Use promises for loadTexture, make them all at the same time and wait for them all. Same for fetch
		window.fetch('build/game.json').then((res) => res.json()).then((json) => {
			this.gameData = json;

			loadTexture(gl, 'build/sprites.png', (tex, spriteImage) => {
				if (spriteImage.width !== SPRITE_TEX_W || spriteImage.height !== SPRITE_TEX_H)
					throw new Error('Mismatch in texture size');
				this.spriteTexture = tex;

				loadTextureType(gl, 'build/palettes.png', (tex, palImage) => {
					if (palImage.width !== 256 && palImage.width !== 16 || palImage.height !== PALETTE_TEX_H)
						throw new Error('Mismatch in texture size');
					this.paletteTexture = tex;

					loadTexture(gl, 'build/maps.png', (tex, mapImage) => {
						if (mapImage.width !== MAP_TEX_W || mapImage.height !== MAP_TEX_H)
							throw new Error('Mismatch in texture size');
						this.mapTexture = tex;

						setTextureSizes(palImage.width, palImage.height, mapImage.width, mapImage.height, spriteImage.width, spriteImage.height);

						this.otherTexture = createDataTextureFloat(gl, OTHER_TEX_W, OTHER_TEX_W);
						// Store a default identity matrix for linescroll buffer 0
						// Only using 8 components, assuming that the last is always 1 (which is OK for affine transformations)
						const mat = mat3.create();
						writeToTextureFloat(gl, this.otherTexture, 0, 0, 2, 1, mat);

						initMapShaders(this);
						initSpriteShaders(this);
						initSupersimpleShaders(this);
						done();
					});
				});
			});
		});
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
		const linescrollBuffer = opts.hasOwnProperty('linescrollBuffer') ? opts.linescrollBuffer : -1;
		const wrap = opts.hasOwnProperty('wrap') ? opts.wrap : true;
		const prio = opts.prio || 0;

		drawMap(this, map.x, map.y, til.x, til.y, map.w, map.h, til.w, til.tw, til.th, winX, winY, winW, winH, scrollX, scrollY, pal.y, til.hiColor, linescrollBuffer, wrap ? 1 : 0, prio);
	}

	/**
	 * @param sprite {string|VdpSprite} sprite to draw (e.g. vdp.sprite('plumber') or just 'plumber')
	 * @param x {number} position (X coord)
	 * @param y {number} position (Y coord)
	 * @param [opts] {Object}
	 * @param opts.palette {VdpPalette} specific palette to use (otherwise just uses the design palette of the sprite)
	 * @param opts.width {number} width on the screen (stretches the sprite compared to sprite.w)
	 * @param opts.height {number} height on the screen (stretches the sprite compared to sprite.h)
	 * @param opts.prio {number} priority of the sprite
	 */
	drawObj(sprite, x, y, opts = {}) {
		if (typeof sprite === 'string') sprite = this.sprite(sprite);
		// TODO Florian -- no need for such a param, since the user can modify sprite.designPalette himself…
		const pal = this._getPalette(opts.hasOwnProperty('palette') ? opts.palette : sprite.designPalette);
		const w = opts.hasOwnProperty('width') ? opts.width : sprite.w;
		const h = opts.hasOwnProperty('height') ? opts.height : sprite.h;
		const prio = opts.prio || 0;

		drawObj(this, x, y, x + w, y + h, sprite.x, sprite.y, sprite.x + sprite.w, sprite.y + sprite.h, pal.y, sprite.hiColor, prio);
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
	 * @param map {string|VdpMap} name of the map (or map itself). You may also query an arbitrary portion of the map
	 * memory using new VdpMap(…) or offset an existing map, using vdp.map('myMap').offsetted(…).
	 * @param blank [boolean=false] set to true if you don't care about the current content of the memory (you're going
	 * to write only and you need a buffer for that)
	 * @return {Uint16Array}
	 */
	readMap(map, blank = false) {
		const m = this._getMap(map);
		if (m.x % 2 !== 0) throw new Error('Requires 2-tile aligned horizontal indices for maps tiles');

		const mapEls = Math.ceil(m.w / 2);
		const result = new Uint16Array(mapEls * 2 * m.h);
		if (!blank) {
			readFromTextureToExisting(this.gl, this.mapTexture, m.x / 2, m.y, mapEls, m.h, new Uint8Array(result.buffer));
		}
		return result;
	}

	/**
	 * @param palette {string|VdpPalette} name of the palette (or palette itself). You may also query an arbitrary portion
	 * of the palette memory using new VdpPalette(…) or offset an existing map, using vdp.map('myMap').offsetted(…).
	 * @param blank [boolean=false] set to true if you don't care about the current content of the memory (you're going
	 * to write only and you need a buffer for that)
	 * @return {Uint32Array}
	 */
	readPalette(palette, blank = false) {
		const pal = this._getPalette(palette);
		return this.readPaletteMemory(0, pal.y, pal.size, 1, blank);
	}

	/**
	 * @param x {number}
	 * @param y {number}
	 * @param w {number}
	 * @param h {number}
	 * @param blank {boolean}
	 * @returns {Uint32Array}
	 */
	readPaletteMemory(x, y, w, h, blank = false) {
		if (!TRUECOLOR_MODE) throw new Error('Not supported yet in lo-color mode');
		const result = new Uint32Array(w * h);
		if (!blank) {
			readFromTextureToExisting(this.gl, this.paletteTexture, x, y, w, h, new Uint8Array(result.buffer));
		}
		return result;
	}

	/**
	 * @param sprite {string|VdpSprite} name of the sprite (or sprite itself). You may also query an arbitrary portion of the
	 * sprite memory using new VdpSprite(…) or offset an existing sprite, using vdp.sprite('mySprite').offsetted(…).
	 * @param blank [boolean=false] set to true if you don't care about the current content of the memory (you're going
	 * to write only and you need a buffer for that)
	 * @return {Uint8Array} the tileset data. For hi-color sprites, each entry represents one pixel. For lo-color sprites,
	 * each entry corresponds to two packed pixels, of 4 bits each.
	 */
	readSprite(sprite, blank = false) {
		const s = this._getSprite(sprite);
		if (s.hiColor) {
			if (s.x % 4 !== 0) throw new Error('Hi-color sprites need to be aligned to 4 pixels');

			const els = Math.ceil(s.w / 4);
			const result = new Uint8Array(els * 4);
			readFromTextureToExisting(this.gl, this.spriteTexture, s.x / 4, s.y, els, s.h, result);
			return result;

		} else {
			if (s.x % 8 !== 0) throw new Error('Lo-color sprites need to be aligned to 8 pixels');

			const els = Math.ceil(s.w / 8);
			const result = new Uint8Array(els * 4);
			readFromTextureToExisting(this.gl, this.spriteTexture, s.x / 8, s.y, els, s.h, result);
			return result;
		}
	}

	/**
	 * @param name {string}
	 * @returns {VdpSprite}
	 */
	sprite(name) {
		const spr = this.gameData.sprites[name];
		if (!spr) throw new Error(`Sprite ${name} not found`);
		return new VdpSprite(spr.x, spr.y, spr.w, spr.h, spr.tw, spr.th, spr.hicol, spr.pal);
	}

	/**
	 * @param map {string|VdpMap} name of the map (or map itself). You may also write to an arbitrary portion of the map
	 * memory using new VdpMap(…) or offset an existing map, using vdp.map('myMap').offsetted(…).
	 * @param data {Uint16Array} map data to write
	 */
	writeMap(map, data) {
		const m = this._getMap(map);
		if (m.x % 2 !== 0) throw new Error('Requires 2-tile aligned horizontal indices for maps tiles');

		const mapEls = Math.ceil(m.w / 2);
		writeToTexture32(this.gl, this.mapTexture, m.x / 2, m.y, mapEls, m.h, new Uint8Array(data.buffer));
	}

	/**
	 * @param palette {string|VdpPalette}
	 * @param data {Uint8ClampedArray}
	 */
	writePalette(palette, data) {
		const pal = this._getPalette(palette);
		this.writePaletteMemory(0, pal.y, pal.size, 1, data);
	}

	/**
	 * @param sprite {string|VdpSprite} name of the sprite (or sprite itself). You may also write to an arbitrary portion
	 * of the sprite memory using new VdpSprite(…) or offset an existing sprite, using vdp.sprite('mySprite').offsetted(…).
	 * @param {Uint8Array} data the new data. For hi-color sprites, each entry represents one pixel. For lo-color sprites,
	 * each entry corresponds to two packed pixels, of 4 bits each.
	 */
	writeSprite(sprite, data) {
		const s = this._getSprite(sprite);
		if (s.hiColor) {
			if (s.x % 4 !== 0) throw new Error('Hi-color sprites need to be aligned to 4 pixels');

			const els = Math.ceil(s.w / 4);
			writeToTexture32(this.gl, this.spriteTexture, s.x / 4, s.y, els, s.h, data);

		} else {
			if (s.x % 8 !== 0) throw new Error('Lo-color sprites need to be aligned to 8 pixels');

			const els = Math.ceil(s.w / 8);
			writeToTexture32(this.gl, this.spriteTexture, s.x / 8, s.y, els, s.h, data);
		}
	}

	/**
	 *
	 * @param x {number}
	 * @param y {number}
	 * @param w {number}
	 * @param h {number}
	 * @param data {Uint32Array}
	 */
	writePaletteMemory(x, y, w, h, data) {
		if (!TRUECOLOR_MODE) throw new Error('Not supported yet in lo-color mode');
		writeToTexture32(this.gl, this.paletteTexture, x, y, w, h, new Uint8Array(data.buffer));
	}

	// --------------------- PRIVATE ---------------------
	/**
	 * @param name {string|VdpMap}
	 * @private
	 * @return {VdpMap}
	 */
	_getMap(name) {
		if (typeof name === 'string') return this.map(name);
		return name;
	}

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
		mat4.ortho(this.projectionMatrix, 0.0, SCREEN_WIDTH, SCREEN_HEIGHT, 0.0, -10, 10);

		// Normally set in modelViewMatrix, but we want to allow an empty model view matrix
		//mat4.translate(this.projectionMatrix, this.projectionMatrix, [-0.0, 0.0, -0.1]);

		this.modelViewMatrix = mat4.create();
		// mat4.translate(this.modelViewMatrix, this.modelViewMatrix, [-0.0, 0.0, -0.1]);
	}

	_startFrame() {
		const gl = this.gl;

		// PERF: Has a moderate hit on performance (almost zero on the Surface Pro). It can even be faster if the image has pixel with zero alpha, the Surface Pro does some optimizations for fully transparent pixels. Else you have to discard them, and if you discard them you get even better performance.
		// If you discard a lot of pixels there's almost no change. If the sprite is fully opaque there's no change either.
		// In general it's probably better left on, the GPU already does all the optimizations.
		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

		// TODO Florian -- Set clear color to palette[0, 0]
		gl.clearColor(0.0, 0.0, 0.5, 0.0);

		if (USE_PRIORITIES) {
			gl.clearDepth(1.0);                 // Clear everything
			// PERF: This is a lot slower if there's a discard in the fragment shader (and we need one?) because the GPU can't test & write to the depth buffer until after the fragment shader has been executed. So there's no point in using it I guess.
			gl.enable(gl.DEPTH_TEST);           // Enable depth testing
			gl.depthFunc(gl.LEQUAL);            // Near things obscure far things
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		} else {
			gl.clear(gl.COLOR_BUFFER_BIT);
		}
	}

	_endFrame() {
		drawPendingObj(this);
	}
}

/**
 * @param canvas {HTMLCanvasElement}
 * @returns {Promise}
 */
export function loadVdp(canvas) {
	setParams(canvas.width, canvas.height, false);
	return new Promise(function (resolve) {
		const vdp = new VDP(canvas, () => {
			vdp._startFrame();
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

		vdp._startFrame();
		coroutine.next();
		vdp._endFrame();
		window.requestAnimationFrame(step);
	}

	window.requestAnimationFrame(step);
}
