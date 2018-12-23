import {createDataTextureFloat, getScalingFactorOfMatrix, loadTexture, loadTexture4444} from "./utils";
import {mat3, mat4} from "../gl-matrix";
import {drawPendingObj, enqueueObj, initObjShaders, makeObjBuffer, ObjBuffer} from "./sprites";
import {drawPendingMap, enqueueMap, initMapShaders, makeMapBuffer} from "./maps";
import {
	envColor,
	OTHER_TEX_W,
	PALETTE_TEX_H,
	SCREEN_HEIGHT,
	SCREEN_WIDTH,
	SEMITRANSPARENT_CANVAS,
	setTextureSizes,
	USE_PRIORITIES
} from "./shaders";
import {drawOpaquePoly, initOpaquePolyShaders} from "./generalpolys";
import {VdpMap, VdpPalette, VdpSprite} from "./memory";
import {
	makeShadowFromTexture16, makeShadowFromTexture32,
	makeShadowFromTexture4444,
	makeShadowFromTexture8,
	ShadowTexture
} from "./shadowtexture";
import {color32} from "./color32";
import {color16} from "./color16";

const BG_LIMIT = 4;
const TBG_LIMIT = 1;
const OBJ1_CELL_LIMIT = 64;
const OBJ0_CELL_LIMIT = 480;

class TransparencyConfig {
	/**
	 * @param effect {string} 'none', 'color', 'blend' or 'premult'.
	 * @param operation {string}
	 * @param blendSrc {number|string}
	 * @param blendDst {number|string}
	 */
	constructor(effect, operation, blendSrc, blendDst) {
		/** @type {string} */
		this.effect = effect;
		/** @type {string} */
		this.operation = operation;
		/** @type {number} */
		this.blendSrc = blendSrc;
		/** @type {number} */
		this.blendDst = blendDst;
	}

	/**
	 * @param vdp {VDP}
	 */
	apply(vdp) {
		const gl = vdp.gl;
		const {effect, blendSrc, blendDst, operation} = this;

		envColor[0] = envColor[1] = envColor[2] = envColor[3] = 1;
		gl.blendEquation(operation === 'sub' ? gl.FUNC_REVERSE_SUBTRACT : gl.FUNC_ADD);

		if (effect === 'blend') {
			gl.enable(gl.BLEND);
			gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
		} else if (effect === 'add') {
			gl.enable(gl.BLEND);
			gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
		} else if (effect === 'color') {
			// Background blend factor
			gl.blendColor(
				(blendDst & 0xf0) / 240,
				(blendDst >>> 8 & 0xf0) / 240,
				(blendDst >>> 16 & 0xf0) / 240,
				(blendDst >>> 24 & 0xf0) / 240);
			// Source blend factor defined in shader
			envColor[0] = (blendSrc & 0xf0) / 240;
			envColor[1] = (blendSrc >>> 8 & 0xf0) / 240;
			envColor[2] = (blendSrc >>> 16 & 0xf0) / 240;
			envColor[3] = (blendSrc >>> 24 & 0xf0) / 240;
			gl.blendFunc(gl.SRC_ALPHA, gl.CONSTANT_COLOR);
			gl.enable(gl.BLEND);
		} else {
			gl.disable(gl.BLEND);
		}
	}
}

class LayerTransform {
	constructor() {
		/** @type {mat3} */
		this.mat = mat3.create();
	}

	/**
	 * @param outMat3 {mat3} output inverted matrix for use with transformation.
	 */
	getInvertedMatrixIn(outMat3) {
		mat3.invert(outMat3, this.mat);
	}

	/**
	 * Sets the non-inverted matrix.
	 * @param mat {mat3} new affine transform
	 */
	setMatrix(mat) {
		mat3.copy(this.mat, mat);
	}
}

const NO_TRANSPARENCY = new TransparencyConfig('none', 'add', 0, 0);
const STANDARD_TRANSPARENCY = new TransparencyConfig('blend', 'add', 0, 0);

export class VDP {
	/** @property {WebGLRenderingContext} gl */
	/** @property {BigFile} gameData */
	/**
	 * xyzp: x, y position, base z, base palette no
	 * mapInfo1: u, v map base, u, v tileset base
	 * mapInfo2: map width, map height, tileset width, tileset height
	 * mapInfo3: tile width, tile height, UV drawing (should be 0…1)
	 * @property {{program: *, attribLocations: {xyzp: GLint, mapInfo1: GLint, mapInfo2: GLint, mapInfo3: GLint, mapInfo4: GLint}, glBuffers: {xyzp, mapInfo1, mapInfo2, mapInfo3, mapInfo4}, uniformLocations: {projectionMatrix: WebGLUniformLocation, modelViewMatrix: WebGLUniformLocation, uSamplerMaps: WebGLUniformLocation, uSamplerSprites: WebGLUniformLocation, uSamplerPalettes: WebGLUniformLocation, uSamplerOthers: WebGLUniformLocation}}} mapProgram
	 */
	/** @property {mat3} modelViewMatrix */
	/** @property {mat4} projectionMatrix */
	/**
	 * @property {{program: *, attribLocations: {xyzp: GLint, uv: GLint}, glBuffers: {xyzp, uv}, uniformLocations: {envColor: WebGLUniformLocation, projectionMatrix: WebGLUniformLocation, modelViewMatrix: WebGLUniformLocation, uSamplerSprites: WebGLUniformLocation, uSamplerPalettes: WebGLUniformLocation}}} spriteProgram
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
		/** @type {number} fade color (factor is the upper 8 bits). */
		this._fadeColor = 0x00000000;
		/** @type {TransparencyConfig} */
		this._bgTransparency = new TransparencyConfig('color', 'add', 0x888888, 0x888888);
		/** @type {TransparencyConfig} */
		this._objTransparency = new TransparencyConfig('color', 'add', 0x888888, 0x888888);
		/** @type {boolean} */
		this._obj1AsMask = false;
		/** @type {MapBuffer} */
		this._bgBuffer = makeMapBuffer('Opaque BG [BG]', BG_LIMIT);
		/** @type {MapBuffer} */
		this._tbgBuffer = makeMapBuffer('Transparent BG [TBG]', TBG_LIMIT);
		/** @type {ObjBuffer} */
		this._obj0Buffer = makeObjBuffer('Opaque sprites [OBJ0]', 480);
		/** @type {ObjBuffer} */
		this._obj1Buffer = makeObjBuffer('Transparent sprites [OBJ1]', 32);
		/** @type {LayerTransform} transformation matrix for OBJ0 (opaque) */
		this._obj0LayerTransform = new LayerTransform();
		/** @type {LayerTransform} transformation matrix for OBJ1 (transparent) */
		this._obj1LayerTransform = new LayerTransform();
		/** @type {{peakOBJ0: number, peakOBJ1: number, peakBG: number, OBJ0Limit: number}} */
		this.stats = {
			peakOBJ0: 0,
			peakOBJ1: 0,
			peakBG: 0,
			OBJ0Limit: OBJ0_CELL_LIMIT
		};
		/** @type {ShadowTexture} original data (ROM) for maps */
		this.romMapTex = null;
		/** @type {ShadowTexture} original data (ROM) for palettes */
		this.romPaletteTex = null;
		/** @type {ShadowTexture} original data (ROM) for sprites */
		this.romSpriteTex = null;
		/** @type {ShadowTexture} copy of the VRAM data for fast read access from the program */
		this.shadowMapTex = null;
		/** @type {ShadowTexture} copy of the VRAM data for fast read access from the program */
		this.shadowPaletteTex = null;
		/** @type {ShadowTexture} copy of the VRAM data for fast read access from the program */
		this.shadowSpriteTex = null;

		this.SOURCE_CURRENT = 0;
		this.SOURCE_ROM = 1;
		this.SOURCE_BLANK = 2;

		this._initContext(canvas);
		this._initMatrices();

		const gl = this.gl;
		// TODO Florian -- Use promises for loadTexture, make them all at the same time and wait for them all. Same for fetch
		window.fetch('build/game.json').then((res) => res.json()).then((json) => {
			this.gameData = json;

			loadTexture(gl, 'build/sprites.png', (tex, spriteImage) => {
				this.spriteTexture = tex;

				this.romSpriteTex = makeShadowFromTexture8(gl, tex, spriteImage);
				this.shadowSpriteTex = this.romSpriteTex.clone();

				loadTexture(gl, 'build/palettes.png', (tex, palImage) => {
					if (palImage.width !== 256 && palImage.width !== 16 || palImage.height !== PALETTE_TEX_H)
						throw new Error('Mismatch in texture size');
					this.paletteTexture = tex;
					this.romPaletteTex = makeShadowFromTexture32(gl, tex, palImage);
					this.shadowPaletteTex = this.romPaletteTex.clone();

					loadTexture(gl, 'build/maps.png', (tex, mapImage) => {
						this.mapTexture = tex;
						this.romMapTex = makeShadowFromTexture16(gl, tex, spriteImage);
						this.shadowMapTex = this.romMapTex.clone();

						setTextureSizes(palImage.width, palImage.height, mapImage.width, mapImage.height, spriteImage.width, spriteImage.height);

						this.otherTexture = createDataTextureFloat(gl, OTHER_TEX_W, OTHER_TEX_W);
						// Startup color
						this.configBDColor('#008');

						initMapShaders(this);
						initObjShaders(this);
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
		this.shadowPaletteTex.buffer[0] = color16.parse(color);
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
		this._bgTransparency.blendSrc = color32.parse(opts.blendSrc);
		this._bgTransparency.blendDst = color32.parse(opts.blendDst);
	}

	/**
	 * Configures the fade.
	 * @param color {number|string} destination color (suggested black or white).
	 * @param factor {number} between 0 and 255. 0 means disabled, 255 means fully covered. The fade is only visible in
	 * increments of 16 (i.e. 1-15 is equivalent to 0).
	 */
	configFade(color, factor) {
		factor = Math.min(255, Math.max(0, factor));
		this._fadeColor = (color32.parse(color) & 0xffffff) | (factor << 24);
	}

	/**
	 * @param [opts] {Object}
	 * @param [opts.obj0Transform] {mat3} affine transformation matrix for standard objects
	 * @param [opts.obj1Transform] {mat3} affine transformation matrix for transparent objects
	 */
	configOBJTransform(opts) {
		if (opts.obj0Transform) this._obj0LayerTransform.setMatrix(opts.obj0Transform);
		if (opts.obj1Transform) this._obj1LayerTransform.setMatrix(opts.obj1Transform);
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
		this._objTransparency.blendSrc = color32.parse(opts.blendSrc);
		this._objTransparency.blendDst = color32.parse(opts.blendDst);
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
	 * @param opts.transparent {boolean}
	 */
	drawBG(map, opts = {}) {
		if (typeof map === 'string') map = this.map(map);
		// TODO Florian -- no need for such a param, since the user can modify map.designPalette himself…
		// Maybe the other options could be in the map too… (just beware that they are strings, not actual links to the palette/tileset… but we could typecheck too)
		const pal = this._getPalette(opts.hasOwnProperty('palette') ? opts.palette : map.designPalette);
		const til = this._getSprite(opts.hasOwnProperty('tileset') ? opts.tilest : map.designTileset);
		const scrollX = opts.hasOwnProperty('scrollX') ? opts.scrollX : 0;
		const scrollY = opts.hasOwnProperty('scrollY') ? opts.scrollY : 0;
		let winX = opts.hasOwnProperty('winX') ? opts.winX : 0;
		let winY = opts.hasOwnProperty('winY') ? opts.winY : 0;
		let winW = opts.hasOwnProperty('winW') ? opts.winW : (SCREEN_WIDTH - winX);
		let winH = opts.hasOwnProperty('winH') ? opts.winH : (SCREEN_HEIGHT - winY);
		const linescrollBuffer = opts.hasOwnProperty('linescrollBuffer') ? opts.linescrollBuffer : -1;
		const wrap = opts.hasOwnProperty('wrap') ? opts.wrap : true;
		const prio = opts.prio || 0;
		const buffer = opts.transparent ? this._tbgBuffer : this._bgBuffer;

		if (this._bgBuffer.usedLayers + this._tbgBuffer.usedLayers >= BG_LIMIT) {
			console.log(`Too many BGs (${this._bgBuffer.usedLayers} opaque, ${this._tbgBuffer.usedLayers} transparent), ignoring drawBG`);
			return;
		}

		// To avoid drawing too big quads and them counting toward the BG pixel budget
		winX = Math.min(SCREEN_WIDTH, Math.max(0, winX));
		winY = Math.min(SCREEN_HEIGHT, Math.max(0, winY));
		winW = Math.min(SCREEN_WIDTH - winX, Math.max(0, winW));
		winH = Math.min(SCREEN_HEIGHT - winY, Math.max(0, winH));

		enqueueMap(buffer, map.x, map.y, til.x, til.y, map.w, map.h, til.w, til.tw, til.th, winX, winY, winW, winH, scrollX, scrollY, pal.y, til.hiColor, linescrollBuffer, wrap ? 1 : 0, prio);
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
	 * @param opts.transparent {boolean}
	 */
	drawObj(sprite, x, y, opts = {}) {
		if (typeof sprite === 'string') sprite = this.sprite(sprite);
		// TODO Florian -- no need for such a param, since the user can modify sprite.designPalette himself…
		const pal = this._getPalette(opts.hasOwnProperty('palette') ? opts.palette : sprite.designPalette);
		const w = opts.hasOwnProperty('width') ? opts.width : sprite.w;
		const h = opts.hasOwnProperty('height') ? opts.height : sprite.h;
		const prio = opts.prio || 0;
		const buffer = opts.transparent ? this._obj1Buffer: this._obj0Buffer;

		enqueueObj(buffer, x, y, x + w, y + h, sprite.x, sprite.y, sprite.x + sprite.w, sprite.y + sprite.h, pal.y, sprite.hiColor, prio);
	}

	/**
	 * Get and reset the VDP stats.
	 * @returns {{peakOBJ0: number, peakOBJ1: number, peakBG: number, OBJ0Limit: number}}
	 */
	getStats() {
		const result = this.stats;
		this.stats = {
			peakOBJ0: 0,
			peakOBJ1: 0,
			peakBG: 0,
			OBJ0Limit: OBJ0_CELL_LIMIT
		};
		return result;
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
	 * @param source [number=vdp.SOURCE_CURRENT] set to vdp.SOURCE_BLANK if you don't care about the current content of
	 * the memory (you're going to write only and you need a buffer for that), vdp.SOURCE_CURRENT to read the current
	 * contents of the memory (as was written the last time with writeMap) or vdp.SOURCE_ROM to get the original data
	 * as downloaded from the cartridge.
	 * @return {Uint16Array}
	 */
	readMap(map, source = this.SOURCE_CURRENT) {
		const m = this._getMap(map);
		const result = new Uint16Array(m.w * m.h);
		if (source === this.SOURCE_CURRENT) this.shadowMapTex.readToBuffer(m.x, m.y, m.w, m.h, result);
		if (source === this.SOURCE_ROM) this.romMapTex.readToBuffer(m.x, m.y, m.w, m.h, result);
		return result;
	}

	/**
	 * @param palette {string|VdpPalette} name of the palette (or palette itself). You may also query an arbitrary portion
	 * of the palette memory using new VdpPalette(…) or offset an existing map, using vdp.map('myMap').offsetted(…).
	 * @param source [number=vdp.SOURCE_CURRENT] look at readMap for more info.
	 * @return {Uint32Array} contains color entries, encoded as 0xRGBA
	 */
	readPalette(palette, source = this.SOURCE_CURRENT) {
		const pal = this._getPalette(palette);
		return this.readPaletteMemory(0, pal.y, pal.size, 1, source);
	}

	/**
	 * @param x {number}
	 * @param y {number}
	 * @param w {number}
	 * @param h {number}
	 * @param source [number=vdp.SOURCE_CURRENT] look at readMap for more info.
	 * @returns {Uint32Array} contains color entries, encoded as 0xRGBA
	 */
	readPaletteMemory(x, y, w, h, source = this.SOURCE_CURRENT) {
		const result = new Uint32Array(w * h);
		if (source === this.SOURCE_CURRENT) this.shadowPaletteTex.readToBuffer(x, y, w, h, result);
		if (source === this.SOURCE_ROM) this.romPaletteTex.readToBuffer(x, y, w, h, result);
		return result;
	}

	/**
	 * @param sprite {string|VdpSprite} name of the sprite (or sprite itself). You may also query an arbitrary portion of the
	 * sprite memory using new VdpSprite(…) or offset an existing sprite, using vdp.sprite('mySprite').offsetted(…).
	 * @param source [number=vdp.SOURCE_CURRENT] look at readMap for more info.
	 * @return {Uint8Array} the tileset data. For hi-color sprites, each entry represents one pixel. For lo-color sprites,
	 * each entry corresponds to two packed pixels, of 4 bits each.
	 */
	readSprite(sprite, source = this.SOURCE_CURRENT) {
		const s = this._getSprite(sprite);

		if (!s.hiColor && s.x % 2 !== 0) throw new Error('Lo-color sprites need to be aligned to 2 pixels');
		const x = s.hiColor ? s.x : (s.x / 2);
		const w = s.hiColor ? s.w : Math.ceil(s.w / 2);

		const result = new Uint8Array(w * s.h);
		if (source === this.SOURCE_CURRENT) this.shadowSpriteTex.readToBuffer(x, s.y, w, s.h, result);
		if (source === this.SOURCE_ROM) this.romSpriteTex.readToBuffer(x, s.y, w, s.h, result);
		return result;
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
		this.shadowMapTex.writeTo(m.x, m.y, m.w, m.h, data);
		this.shadowMapTex.syncToVramTexture(this.gl, this.mapTexture, m.x, m.y, m.w, m.h);
	}

	/**
	 * @param palette {string|VdpPalette}
	 * @param data {Uint16Array} color entries, encoded as 0xRGBA
	 */
	writePalette(palette, data) {
		const pal = this._getPalette(palette);
		this.writePaletteMemory(0, pal.y, pal.size, 1, data);
	}

	/**
	 *
	 * @param x {number}
	 * @param y {number}
	 * @param w {number}
	 * @param h {number}
	 * @param data {Uint16Array} color entries, encoded as 0xRGBA
	 */
	writePaletteMemory(x, y, w, h, data) {
		this.shadowPaletteTex.writeTo(x, y, w, h, data);
		this.shadowPaletteTex.syncToVramTexture(this.gl, this.paletteTexture, x, y, w, h);
	}

	/**
	 * @param sprite {string|VdpSprite} name of the sprite (or sprite itself). You may also write to an arbitrary portion
	 * of the sprite memory using new VdpSprite(…) or offset an existing sprite, using vdp.sprite('mySprite').offsetted(…).
	 * @param {Uint8Array} data the new data. For hi-color sprites, each entry represents one pixel. For lo-color sprites,
	 * each entry corresponds to two packed pixels, of 4 bits each.
	 */
	writeSprite(sprite, data) {
		const s = this._getSprite(sprite);

		if (!s.hiColor && s.x % 2 !== 0) throw new Error('Lo-color sprites need to be aligned to 2 pixels');
		const x = s.hiColor ? s.x : (s.x / 2);
		const w = s.hiColor ? s.w : Math.ceil(s.w / 2);

		this.shadowSpriteTex.writeTo(x, s.y, w, s.h, data);
		this.shadowSpriteTex.syncToVramTexture(this.gl, this.paletteTexture, x, s.y, w, s.h);
	}

	// --------------------- PRIVATE ---------------------
	/**
	 * @returns {number}
	 * @private
	 */
	_computeOBJ0Limit() {
		// Count the number of BGs covering the full screen
		const pixels = this._bgBuffer.getTotalPixels() + this._tbgBuffer.getTotalPixels();
		const layers = Math.ceil(pixels / (SCREEN_WIDTH * SCREEN_HEIGHT));
		let limit = OBJ0_CELL_LIMIT;
		if (layers >= 3) limit -= 128;
		if (layers >= 4) limit -= 128;
		return limit;
	}

	/**
	 * Take one frame in account for the stats. Read with _readStats.
	 * @param obj0Limit {number}
	 * @private
	 */
	_computeStats(obj0Limit) {
		this.stats.peakBG = Math.max(this.stats.peakBG, this._bgBuffer.usedLayers + this._tbgBuffer.usedLayers);
		this.stats.peakOBJ0 = Math.max(this.stats.peakOBJ0, this._totalUsedOBJ0());
		this.stats.peakOBJ1 = Math.max(this.stats.peakOBJ1, this._totalUsedOBJ1());
		this.stats.OBJ0Limit = Math.min(this.stats.OBJ0Limit, obj0Limit);
	}

	/**
	 * @param objBuffer {ObjBuffer}
	 * @param transparencyConfig {TransparencyConfig}
	 * @param layerTransform {LayerTransform}
	 * @param objLimit {number} max number of cells drawable
	 * @private
	 */
	_drawObjLayer(objBuffer, transparencyConfig, layerTransform, objLimit = 0) {
		// Use config only for that poly list
		layerTransform.getInvertedMatrixIn(this.modelViewMatrix);
		transparencyConfig.apply(this);
		drawPendingObj(this, objBuffer, objLimit);
		mat3.identity(this.modelViewMatrix);
	}

	/**
	 * @protected
	 */
	_endFrame() {
		const gl = this.gl;
		// Do before drawing stuff since it flushes the buffer
		const obj0Limit = this._computeOBJ0Limit();
		const bdColor = this.shadowPaletteTex.buffer[0];

		this._computeStats(obj0Limit);

		gl.clearColor(
			(bdColor >>> 12 & 0xf) / 15,
			(bdColor >>> 8 & 0xf) / 15,
			(bdColor >>> 4 & 0xf) / 15, 0);

		if (USE_PRIORITIES) {
			gl.clearDepth(1.0);                 // Clear everything
			// PERF: This is a lot slower if there's a discard in the fragment shader (and we need one?) because the GPU can't test & write to the depth buffer until after the fragment shader has been executed. So there's no point in using it I guess.
			gl.enable(gl.DEPTH_TEST);           // Enable depth testing
			gl.depthFunc(gl.LESS);            // Near things obscure far things
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		} else {
			gl.clear(gl.COLOR_BUFFER_BIT);
		}

		NO_TRANSPARENCY.apply(this);
		mat3.identity(this.modelViewMatrix);
		drawPendingMap(this, this._bgBuffer);

		if (this._obj1AsMask) {
			// Draw BG, transparent OBJ in reverse order, then normal OBJ
			this._obj1Buffer.sort();
			this._drawObjLayer(this._obj1Buffer, this._objTransparency, this._obj1LayerTransform, OBJ1_CELL_LIMIT);
		}

		this._drawObjLayer(this._obj0Buffer, NO_TRANSPARENCY, this._obj0LayerTransform, obj0Limit);

		this._bgTransparency.apply(this);
		gl.depthMask(false);
		drawPendingMap(this, this._tbgBuffer);
		gl.depthMask(true);

		if (!this._obj1AsMask) {
			// Draw in reverse order
			this._obj1Buffer.sort();
			this._drawObjLayer(this._obj1Buffer, this._objTransparency, this._obj1LayerTransform, OBJ1_CELL_LIMIT);
		}

		// Draw fade
		if (this._fadeColor >>> 24 >= 0x10) {
			STANDARD_TRANSPARENCY.apply(this);
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

		this.modelViewMatrix = mat3.create();
		// mat4.translate(this.modelViewMatrix, this.modelViewMatrix, [-0.0, 0.0, -0.1]);
	}

	/**
	 * @protected
	 */
	_startFrame() {
	}

	/**
	 * @returns {number}
	 * @private
	 */
	_totalUsedOBJ0() {
		const tempMat = mat3.create();
		this._obj0LayerTransform.getInvertedMatrixIn(tempMat);
		return this._obj0Buffer.computeUsedObjects(getScalingFactorOfMatrix(tempMat));
	}

	/**
	 * @returns {number}
	 * @private
	 */
	_totalUsedOBJ1() {
		const tempMat = mat3.create();
		this._obj1LayerTransform.getInvertedMatrixIn(tempMat);
		return this._obj1Buffer.computeUsedObjects(getScalingFactorOfMatrix(tempMat));
	}
}
