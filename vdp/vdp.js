import {
	createDataTexture32,
	createDataTextureFloat, getColor,
	loadTexture,
	loadTexture4444,
	readFromTexture32, readFromTextureToExisting, readFromTextureToExisting16, writeToTexture16, writeToTexture32,
	writeToTextureFloat
} from "./utils";
import {mat3, mat4} from "../gl-matrix";
import {drawPendingObj, drawObj, initSpriteShaders} from "./sprites";
import {drawMap, initMapShaders} from "./maps";
import {
	envColor,
	MAP_TEX_H, MAP_TEX_W,
	OTHER_TEX_W, PALETTE_HICOLOR_FLAG,
	PALETTE_TEX_H,
	PALETTE_TEX_W, SCREEN_HEIGHT, SCREEN_WIDTH,
	SEMITRANSPARENT_CANVAS,
	setParams, setTextureSizes, SPRITE_TEX_H,
	SPRITE_TEX_W, TRUECOLOR_MODE, USE_PRIORITIES
} from "./shaders";
import {drawOpaquePoly, initOpaquePolyShaders} from "./tests";

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

class TransparencyConfig {
	/**
	 * @param effect {string} 'none', 'color', 'blend' or 'premult'.
	 * @param operation {string}
	 * @param blendSrc {number|string}
	 * @param blendDst {number|string}
	 */
	constructor(effect, operation, blendSrc, blendDst) {
		this.effect = effect;
		this.operation = operation;
		this.blendSrc = blendSrc;
		this.blendDst = blendDst;
	}

	/**
	 * @param vdp {VDP}
	 */
	apply(vdp) {
		console.log(`TEMP TODO`);
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
	 * @property {{program: *, attribLocations: {xyzp: GLint, mapInfo1: GLint, mapInfo2: GLint, mapInfo3: GLint, mapInfo4: GLint}, glBuffers: {xyzp, mapInfo1, mapInfo2, mapInfo3, mapInfo4}, uniformLocations: {projectionMatrix: WebGLUniformLocation, modelViewMatrix: WebGLUniformLocation, uSamplerMaps: WebGLUniformLocation, uSamplerSprites: WebGLUniformLocation, uSamplerPalettes: WebGLUniformLocation, uSamplerOthers: WebGLUniformLocation}}} mapProgram
	 */
	/** @property {mat4} modelViewMatrix */
	/** @property {mat4} projectionMatrix */
	/**
	 * @property {{program: *, arrayBuffers: {xyzp: Float32Array, uv: Float32Array}, attribLocations: {xyzp: GLint, uv: GLint}, glBuffers: {xyzp, uv}, pendingVertices, uniformLocations: {envColor: WebGLUniformLocation, projectionMatrix: WebGLUniformLocation, modelViewMatrix: WebGLUniformLocation, uSamplerSprites: WebGLUniformLocation, uSamplerPalettes: WebGLUniformLocation}}} spriteProgram
	 */
	/** @property {{program: *, arrayBuffers: {xy: Float32Array, color: Float32Array}, attribLocations: {xy: GLint, color: GLint}, glBuffers: {xy, color}, uniformLocations: {projectionMatrix: WebGLUniformLocation, modelViewMatrix: WebGLUniformLocation}}} opaquePolyProgram */
	/** @type {WebGLTexture} mapTexture */
	/** @type {WebGLTexture} paletteTexture */
	/** @type {WebGLTexture} spriteTexture */
	/** @type {WebGLTexture} otherTexture */

	/**
	 * @param canvas {HTMLCanvasElement}
	 * @param done {function()}
	 */
	constructor(canvas, done) {
		/** @type {number} backdrop color. */
		this._backdropColor = 0x00800000;
		/** @type {number} fade color (factor is the upper 8 bits). */
		this._fadeColor = 0x00000000;
		/** @type {TransparencyConfig} */
		this._bgTransparency = new TransparencyConfig('color', 'add', 0x88ffffff, 0x88ffffff);
		/** @type {TransparencyConfig} */
		this._objTransparency = new TransparencyConfig('color', 'add', 0x88ffffff, 0x88ffffff);
		/** @type {boolean} */
		this._obj1AsMask = false;
		this._noTransparency = new TransparencyConfig('none', 'add', 0, 0);
		this._standardTransparency = new TransparencyConfig('blend', 'add', 0, 0);

		this._initContext(canvas);
		this._initMatrices();

		const gl = this.gl;
		const loadTextureType = TRUECOLOR_MODE ? loadTexture : loadTexture4444;
		// TODO Florian -- Use promises for loadTexture, make them all at the same time and wait for them all. Same for fetch
		window.fetch('build/game.json').then((res) => res.json()).then((json) => {
			this.gameData = json;

			loadTexture(gl, 'build/sprites.png', (tex, spriteImage) => {
				this.spriteTexture = tex;

				loadTextureType(gl, 'build/palettes.png', (tex, palImage) => {
					if (palImage.width !== 256 && palImage.width !== 16 || palImage.height !== PALETTE_TEX_H)
						throw new Error('Mismatch in texture size');
					this.paletteTexture = tex;

					loadTexture(gl, 'build/maps.png', (tex, mapImage) => {
						this.mapTexture = tex;

						setTextureSizes(palImage.width, palImage.height, mapImage.width, mapImage.height, spriteImage.width, spriteImage.height);

						this.otherTexture = createDataTextureFloat(gl, OTHER_TEX_W, OTHER_TEX_W);
						// Store a default identity matrix for linescroll buffer 0
						// Only using 8 components, assuming that the last is always 1 (which is OK for affine transformations)
						const mat = mat3.create();
						writeToTextureFloat(gl, this.otherTexture, 0, 0, 2, 1, mat);

						initMapShaders(this);
						initSpriteShaders(this);
						initOpaquePolyShaders(this);
						done();
					});
				});
			});
		});
	}

	/**
	 * Configures the backdrop (background color that is always present).
	 * @param color {number|string} backdrop color
	 */
	configBDColor(color) {
		this._backdropColor = getColor(color);
	}

	/**
	 * Configure transparent background effect.
	 * @param opts {Object}
	 * @param opts.op {string} 'add' or 'sub'
	 * @param opts.blendSrc {number|string} source tint (quantity of color to take from the blending object)
	 * @param opts.blendDst {number|string} destination tint (quantity of color to take from the backbuffer when mixing)
	 */
	configBGTransparency(opts) {
		if (opts.op !== 'add' && opts.op !== 'sub') {
			throw new Error(`Invalid operation ${opts.op}`);
		}
		this._bgTransparency.operation = opts.op;
		this._bgTransparency.blendSrc = getColor(opts.blendSrc);
		this._bgTransparency.blendDst = getColor(opts.blendDst);
	}

	/**
	 * Configures the fade.
	 * @param color {number|string} destination color (suggested black or white).
	 * @param factor {number} between 0 and 255. 0 means disabled, 255 means fully covered. The fade is only visible in
	 * increments of 16 (i.e. 1-15 is equivalent to 0).
	 */
	configFade(color, factor) {
		factor = Math.min(255, Math.max(0, factor));
		this._fadeColor = (getColor(color) & 0xffffff) | (factor << 24);
	}

	/**
	 * Configure effect for transparent sprites.
	 * @param opts {Object}
	 * @param opts.op {string} 'add' or 'sub'
	 * @param opts.blendSrc {number|string} source tint (quantity of color to take from the blending object)
	 * @param opts.blendDst {number|string} destination tint (quantity of color to take from the backbuffer when mixing)
	 * @param opts.mask {boolean} whether to use mask
	 */
	configOBJTransparency(opts) {
		if (opts.op !== 'add' && opts.op !== 'sub') {
			throw new Error(`Invalid operation ${opts.op}`);
		}
		this._objTransparency.operation = opts.op;
		this._objTransparency.blendSrc = getColor(opts.blendSrc);
		this._objTransparency.blendDst = getColor(opts.blendDst);
		this._obj1AsMask = !!opts.mask;
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
	_endFrame() {
		const gl = this.gl;
		drawPendingObj(this);

		// Draw fade
		if (this._fadeColor >>> 24 >= 0x10) {
			this._setBlendMethod('blend');
			gl.disable(gl.DEPTH_TEST);
			drawOpaquePoly(this, 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT,
				(this._fadeColor & 0xf0) / 240,
				(this._fadeColor >>> 8 & 0xf0) / 240,
				(this._fadeColor >>> 16 & 0xf0) / 240,
				(this._fadeColor >>> 24 & 0xf0) / 240);
		}
	}

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

	/**
	 *
	 * @param effect {string}
	 * @param [dstColor] {number} 12-bit color
	 * @param [srcColor] {number} 12-bit color
	 */
	_setBlendMethod(effect, dstColor = null, srcColor = null) {
		const gl = this.gl;

		envColor[0] = envColor[1] = envColor[2] = envColor[3] = 1;
		if (effect === 'blend') {
			gl.enable(gl.BLEND);
			gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
		} else if (effect === 'add') {
			gl.enable(gl.BLEND);
			gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
		} else if (effect === 'color') {
			// Background blend factor
			gl.blendColor(
				(dstColor & 0xf0) / 240,
				(dstColor >>> 8 & 0xf0) / 240,
				(dstColor >>> 16 & 0xf0) / 240,
				(dstColor >>> 24 & 0xf0) / 240);
			// Source blend factor defined in shader
			envColor[0] = (srcColor & 0xf0) / 240;
			envColor[1] = (srcColor >>> 8 & 0xf0) / 240;
			envColor[2] = (srcColor >>> 16 & 0xf0) / 240;
			envColor[3] = (srcColor >>> 24 & 0xf0) / 240;
			gl.blendFunc(gl.SRC_ALPHA, gl.CONSTANT_COLOR);
			gl.enable(gl.BLEND);
		} else {
			gl.disable(gl.BLEND);
		}
	}

	_startFrame() {
		const gl = this.gl;

		// PERF: Has a moderate hit on performance (almost zero on the Surface Pro). It can even be faster if the image has pixel with zero alpha, the Surface Pro does some optimizations for fully transparent pixels. Else you have to discard them, and if you discard them you get even better performance.
		// If you discard a lot of pixels there's almost no change. If the sprite is fully opaque there's no change either.
		// In general it's probably better left on, the GPU already does all the optimizations.
		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

		gl.clearColor(
			(this._backdropColor & 0xf0) / 240,
			(this._backdropColor >>> 8 & 0xf0) / 240,
			(this._backdropColor >>> 16 & 0xf0) / 240, 0);

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
}

/**
 * @param canvas {HTMLCanvasElement}
 * @param [params] {Object}
 * @param [params.resolution] {number} default is 0. 0=256x256, 1=320x224
 * @returns {Promise}
 */
export function loadVdp(canvas, params) {
	params = params || {};
	switch (params.resolution) {
	case 1:
		canvas.width = 320;
		canvas.height = 224;
		break;
	default:
		canvas.width = 256;
		canvas.height = 256;
		break;
	}
	canvas.style.width = `${canvas.width * 2}px`;
	canvas.style.height = `${canvas.height * 2}px`;
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
	let last = 0;
	const times = [];

	function step(timestamp) {
		timestamp = Math.floor(timestamp / 1000);
		if (timestamp !== last && times.length > 0) {
			console.log(`Called ${times.length} times. Avg=${times.reduce((a, b) => a + b) / times.length}ms`);
			times.length = 0;
		}
		last = timestamp;

		const before = window.performance.now();
		vdp._startFrame();
		coroutine.next();
		vdp._endFrame();
		times.push(window.performance.now() - before);

		window.requestAnimationFrame(step);
	}

	window.requestAnimationFrame(step);
}
