import { createDataTextureFloat, loadTexture, writeToTextureFloat } from "./utils";
import {
	computeObjectPixels,
	drawPendingObj,
	enqueueObj,
	initObjShaders,
	makeObjBuffer,
} from "./sprites";
import { drawPendingMap, enqueueMap, initMapShaders, makeMapBuffer } from "./maps";
import {
	colorSwaps,
	envColor,
	OTHER_TEX_COLORSWAP_INDEX,
	OTHER_TEX_H,
	OTHER_TEX_W,
	PALETTE_TEX_H,
	PALETTE_TEX_W,
	SCREEN_HEIGHT,
	SCREEN_WIDTH,
	SEMITRANSPARENT_CANVAS,
	setMapTextureSize,
	setPaletteTextureSize,
	setSpriteTextureSize,
	USE_PRIORITIES
} from "./shaders";
import { drawOpaquePoly, initOpaquePolyShaders } from "./generalpolys";
import { Array2D, VdpMap, VdpPalette, VdpSprite } from "./memory";
import {
	makeShadowFromTexture16,
	makeShadowFromTexture32,
	makeShadowFromTexture8,
	ShadowTexture
} from "./shadowtexture";
import { color } from "./color";
import { mat3, mat4, vec2 } from 'gl-matrix';
import { Input } from './input';

export const DEBUG = true;
// Specs of the fantasy console, do not modify for now
const MAX_BGS = 32, MAX_OBJS = 512, MAX_VRAM_WRITES = 2048, MAX_FRAME_SLOWDOWN = 30, MAX_LINESCROLL_BUFFERS = 2;
let BG_PIXEL_LIMIT: number, OBJ_CELL_LIMIT: number, OBJ_LIMIT: number;
export const OBJ_CELL_SIZE = 16;
let POSTERIZATION_LEVELS;

type TransparencyConfigEffect = 'none' | 'color' | 'blend' | 'premult';
type TransparencyConfigOperation = 'add' | 'sub';

class TransparencyConfig {
	effect: TransparencyConfigEffect;
	operation: TransparencyConfigOperation;
	blendSrc: number;
	blendDst: number;

	constructor(effect: TransparencyConfigEffect, operation: TransparencyConfigOperation, blendSrc: number, blendDst: number) {
		this.effect = effect;
		this.operation = operation;
		this.blendSrc = blendSrc;
		this.blendDst = blendDst;
	}
}

const NO_TRANSPARENCY = new TransparencyConfig('none', 'add', 0, 0);
const STANDARD_TRANSPARENCY = new TransparencyConfig('blend', 'add', 0, 0);

export enum CopySource {
	current,
	rom,
	blank,
}

function makeMat3(array: Float32Array): mat3 {
	return mat3.fromValues(array[0], array[1], array[2], array[3], array[4], array[5], array[6], array[7], 1);
}

/**
 * Use this class to provide a transformation for each line of the BG when drawing. You can create many kind of effects
 * using this, look at the samples.
 */
export class LineTransformationArray {
	_assignedId = -1;
	buffer: Float32Array;
	length: number;

	constructor() {
		// 8 floats per item (hack for the last one since mat3 is actually 9 items)
		this.length = SCREEN_HEIGHT;
		this.buffer = new Float32Array(this.length * 8);
		this.resetAll();
  }

  getLine(lineNo: number): Float32Array {
		return this._getLine(lineNo);
  }

	resetAll() {
		this._assignedId = -1;
		for (let i = 0; i < this.length; i++) this.resetLine(i);
	}

	resetLine(lineNo: number) {
		const mat = mat3.create();
		mat3.identity(mat);
		this.setLine(lineNo, mat);
	}

	rotateLine(lineNo: number, radians: number) {
		const mat = makeMat3(this._getLine(lineNo));
		mat3.rotate(mat, mat, radians);
		this.setLine(lineNo, mat);
	}

	scaleLine(lineNo: number, scaleXY: number[]) {
		if (!Array.isArray(scaleXY) || scaleXY.length !== 2) throw new Error('Array should be [x, y]');
		const mat = makeMat3(this._getLine(lineNo));
		mat3.scale(mat, mat, scaleXY);
		this.setLine(lineNo, mat);
	}

	setAll(transformation: mat3|Float32Array) {
		for (let i = 0; i < this.length; i++) this.setLine(i, transformation);
	}

	setLine(lineNo: number, transformation: mat3|Float32Array) {
		if (lineNo < 0 || lineNo >= this.length) throw new Error(`setLine: index ${lineNo} out of range`);
		this._assignedId = -1;
		this.buffer.set((transformation as Float32Array).subarray(0, 8), lineNo * 8);
	}

	translateLine(lineNo: number, moveXY: number[]) {
		if (!Array.isArray(moveXY) || moveXY.length !== 2) throw new Error('Array should be [x, y]');
		const mat = makeMat3(this._getLine(lineNo));
		mat3.translate(mat, mat, moveXY);
		this.setLine(lineNo, mat);
	}

	transformVector(lineNo: number, vectorXY: number): {x: number, y: number} {
		if (!Array.isArray(vectorXY) || vectorXY.length !== 2) throw new Error('Array should be [x, y]');
		const result = vec2.create();
		const mat = makeMat3(this._getLine(lineNo));
		vec2.transformMat3(result, vectorXY, mat);
		return {x: result[0], y: result[1]};
	}

	transformVectorInverse(lineNo: number, vectorXY: number): {x: number, y: number} {
		if (!Array.isArray(vectorXY) || vectorXY.length !== 2) throw new Error('Array should be [x, y]');
		const result = vec2.create();
		const mat = makeMat3(this._getLine(lineNo));
		mat3.invert(mat, mat);
		vec2.transformMat3(result, vectorXY, mat);
		return {x: result[0], y: result[1]};
	}

	/** @internal */
	private _getLine(lineNo: number): mat3 {
		if (lineNo < 0 || lineNo >= this.length) throw new Error(`getLine: index ${lineNo} out of range`);
		return makeMat3(this.buffer.subarray(lineNo * 8, lineNo * 8 + 8));
	}
}

export class LineColorArray {
	// TODO Florian -- rename to _buffer to hide
	buffer: Float32Array;
	length: number;
	targetPaletteNumber: number;
	targetPaletteIndex: number;

	constructor(targetPaletteIndex: number, targetPaletteNumber: number) {
		this.targetPaletteNumber = targetPaletteNumber;
		this.targetPaletteIndex = targetPaletteIndex;
		this.length = SCREEN_HEIGHT;
		this.buffer = new Float32Array(this.length * 4);
	}

	setAll(_color: number) {
		for (let i = 0; i < this.length; i++) this.setLine(i, _color);
	}

	setLine(lineNo: number, _color: number) {
		if (lineNo < 0 || lineNo >= this.length) throw new Error(`setLine: index ${lineNo} out of range`);

		const col = color.extract(_color, POSTERIZATION_LEVELS);
		this.buffer[lineNo * 4] = col.r / 255.0;
		this.buffer[lineNo * 4 + 1] = col.g / 255.0;
		this.buffer[lineNo * 4 + 2] = col.b / 255.0;
	}
}

export class VDP {
	_gl: WebGLRenderingContext;
	_gameData: any;
	_mapProgram: any;
	_modelViewMatrix: mat3;
	_projectionMatrix: mat4;
	_spriteProgram: any;
	_opaquePolyProgram: any;
	_mapTexture: WebGLTexture;
	_paletteTexture: WebGLTexture;
	_spriteTexture: WebGLTexture;
	_otherTexture: WebGLTexture;
	// 2 = 64 colors (SMS), 3 = 512 colors (Mega Drive), 4 = 4096 (System 16), 5 = 32k (SNES), 8 = unmodified (PC)
	_paletteBpp;

	// Fade color (factor is the upper 8 bits).
	private _fadeColor = 0x00000000;
	private _bgTransparency = new TransparencyConfig('color', 'add', 0x888888, 0x888888);
	private _objTransparency = new TransparencyConfig('color', 'add', 0x888888, 0x888888);
	private _bgBuffer = makeMapBuffer('Opaque BG [BG]', MAX_BGS);
	private _tbgBuffer = makeMapBuffer('Transparent BG [TBG]', 1); // can support only one because of OBJ1 sorting required
	private _obj0Buffer = makeObjBuffer('Opaque sprites [OBJ0]', MAX_OBJS);
	private _obj1Buffer = makeObjBuffer('Transparent sprites [OBJ1]', MAX_OBJS);
	private _stats = {
		peakOBJ: 0,
		peakBG: 0,
		peakVramWrites: 0
	};
	private _frameStarted = true;
	// Original data (ROM) for sprites
	private _romSpriteTex: ShadowTexture;
	// Copy of the VRAM data for fast read access from the program
	private _shadowSpriteTex: ShadowTexture;
	private _romPaletteTex: ShadowTexture;
	private _shadowPaletteTex: ShadowTexture;
	private _romMapTex: ShadowTexture;
	private _shadowMapTex: ShadowTexture;
	private _nextLinescrollBuffer = 0;
	private _usedBgPixels = 0;
	private _usedObjCells = 0;
	private _usedVramWrites = 0;

	public vec2 = vec2;
	public mat3 = mat3;
	public input: Input;
	public LineColorArray = LineColorArray;
	public LineTransformationArray = LineTransformationArray;
	public CopySource = CopySource;
	public color = color;

	constructor(canvas: HTMLCanvasElement, imageDirectory: string, done: () => void) {
		this._initContext(canvas);
		this._initMatrices();

		const gl = this._gl;


		// TODO Florian -- run all requests at the same time and wait for them all.
		window.fetch('build/game.json').then((res) => {
			if (!res.ok) throw new Error('You need to build your project first; run `npm run convert-gfx`.')
			return res.json();
		}).then((json) => {
			this._gameData = json;
			POSTERIZATION_LEVELS = this._paletteBpp = json.info.paletteBpp;
			if ([2, 3, 4, 5, 8].indexOf(this._paletteBpp) === -1) throw new Error(`Unsupported paletteBpp ${this._paletteBpp}`);

				Promise.all([
					loadTexture(gl, 'build/sprites.png').then(sprites => {
						this._spriteTexture = sprites.texture;
						this._romSpriteTex = makeShadowFromTexture8(gl, sprites);
						this._shadowSpriteTex = this._romSpriteTex.clone();
						setSpriteTextureSize(sprites.width, sprites.height);
					}),
					loadTexture(gl, 'build/palettes.png').then(palettes => {
						if (!(palettes.width === 256 && palettes.height === 64) && !(palettes.width === 16 && palettes.height === 256))
							throw new Error('Mismatch in texture size (max {16,256}x256');
						this._paletteTexture = palettes.texture;
						this._romPaletteTex = makeShadowFromTexture32(gl, palettes);
						this._shadowPaletteTex = this._romPaletteTex.clone();
						if (this._paletteBpp !== 8) this._shadowPaletteTex.setPosterization(this._paletteBpp);
						setPaletteTextureSize(palettes.width, palettes.height);
					}),
					loadTexture(gl, 'build/maps.png').then(maps => {
						this._mapTexture = maps.texture;
						this._romMapTex = makeShadowFromTexture16(gl, maps);
						this._shadowMapTex = this._romMapTex.clone();
						setMapTextureSize(maps.width, maps.height);
					})
				]).then(() => {
					this._otherTexture = createDataTextureFloat(gl, OTHER_TEX_W, OTHER_TEX_H);
					// Startup color
					this.configBackdropColor('#008');
					this.configDisplay({ extraSprites: false });

					initMapShaders(this);
					initObjShaders(this);
					initOpaquePolyShaders(this);
					done();
				});
			});
	}

	/**
	 * Configures the backdrop (background color that is always present).
	 * Note that the backdrop is exactly the first color of the first palette. You can therefore modify it by writing
	 * to that palette color too. It can become handy when you are doing fades by modifying all colors.
	 * @param c backdrop color
	 */
	configBackdropColor(c: number|string) {
		const pal = this.readPaletteMemory(0, 0, 1, 1, CopySource.blank);
		pal.array[0] = color.make(c);
		this.writePaletteMemory(0, 0, 1, 1, pal);
	}

	/**
	 * Configure transparent background effect.
	 * @param opts
	 * @param opts.op 'add' or 'sub'
	 * @param opts.blendSrc source tint (quantity of color to take from the blending object)
	 * @param opts.blendDst destination tint (quantity of color to take from the backbuffer when mixing)
	 */
	configBackgroundTransparency(opts: {op: TransparencyConfigOperation, blendSrc: number|string, blendDst: number|string}) {
		if (opts.op !== 'add' && opts.op !== 'sub') {
			throw new Error(`Invalid operation ${opts.op}`);
		}
		this._bgTransparency.operation = opts.op;
		this._bgTransparency.blendSrc = color.posterize(color.make(opts.blendSrc), this._paletteBpp);
		this._bgTransparency.blendDst = color.posterize(color.make(opts.blendDst), this._paletteBpp);
	}

	/**
	 * Configures up to 4 colors that are replaced every line by another palette color.
	 * @param {LineColorArray[]} colorTable
	 */
	configColorSwap(colorTable: LineColorArray[]) {
		if (colorTable.length > 4) throw new Error('Can only swap up to 4 colors at a time');
		colorTable.forEach((t, i) => {
			colorSwaps[i] = t.targetPaletteNumber << 8 | t.targetPaletteIndex;
			writeToTextureFloat(this._gl, this._otherTexture, 0, i + OTHER_TEX_COLORSWAP_INDEX, t.buffer.length / 4, 1, t.buffer);
		});
		for (let i = colorTable.length; i < 4; i++) colorSwaps[i] = -1; // Unreachable color
	}

	/**
	 * Configures the display options. Can only be called at the beginning of the program or after a frame has been
	 * rendered, not in the middle.
	 * @param [opts] {Object}
	 * @param [opts.extraSprites] {boolean} whether to enable the extra sprite mode. This will limit to only one BG layer
	 * (which can be transparent), but allow 512 sprites instead of 256, and twice the pixel count (covering up to two
	 * times the screen).
	 */
	configDisplay(opts: { extraSprites?: boolean } = {}) {
		if (this._usedObjCells > 0 || this._usedBgPixels > 0) {
			throw new Error('configDisplay must come at the beginning of your program/frame');
		}
		BG_PIXEL_LIMIT = (opts.extraSprites ? 1 : 2) * this.screenWidth * this.screenHeight;
		OBJ_LIMIT = opts.extraSprites ? 512 : 256;
		OBJ_CELL_LIMIT = (opts.extraSprites ? 2 : 1) * Math.ceil(this.screenWidth * this.screenHeight / (OBJ_CELL_SIZE * OBJ_CELL_SIZE));
	}

	/**
	 * Configures the fade.
	 * @params opts {Object}
	 * @param [opts.color] destination color (suggested black or white).
	 * @param opts.factor between 0 and 255. 0 means disabled, 255 means fully covered. The fade is only visible in
	 * increments of 16 (i.e. 1-15 is equivalent to 0).
	 */
	configFade(opts: { color?: number|string, factor: number }) {
		const c = opts.color || 0;
		opts.factor = Math.min(255, Math.max(0, opts.factor));
		this._fadeColor = (color.make(c) & 0xffffff) | (opts.factor << 24);
	}

	/**
	 * Configure effect for transparent sprites.
	 * @param opts
	 * @param opts.op 'add' or 'sub'
	 * @param opts.blendSrc source tint (quantity of color to take from the blending object)
	 * @param opts.blendDst destination tint (quantity of color to take from the backbuffer when mixing)
	 */
	configObjectTransparency(opts: {op: TransparencyConfigOperation, blendSrc: number|string, blendDst: number|string}) {
		if (opts.op !== 'add' && opts.op !== 'sub') {
			throw new Error(`Invalid operation ${opts.op}`);
		}
		this._objTransparency.operation = opts.op;
		this._objTransparency.blendSrc = color.posterize(color.make(opts.blendSrc), this._paletteBpp);
		this._objTransparency.blendDst = color.posterize(color.make(opts.blendDst), this._paletteBpp);
	}

	/**
	 * @param map map to draw (e.g. vdp.map('level1') or just 'level1')
	 * @param [opts]
	 * @param opts.palette specific base palette to use (for the normal tiles). Keep in mind that individual map tiles may use the next 15 palettes by setting the bits 12-15 of the tile number.
	 * @param opts.scrollX horizontal scrolling
	 * @param opts.scrollY vertical scrolling
	 * @param opts.winX left coordinate on the screen to start drawing from (default to 0)
	 * @param opts.winY top coordinate on the screen to start drawing from (default to 0)
	 * @param opts.winW width after which to stop drawing (defaults to SCREEN_WIDTH)
	 * @param opts.winH height after which to stop drawing (defaults to SCREEN_HEIGHT)
	 * @param opts.lineTransform {LineTransformationArray} per-line transformation array
	 * @param opts.wrap whether to wrap the map at the bounds (defaults to true)
	 * @param opts.tileset custom tileset to use.
	 * @param opts.transparent
	 * @param opts.prio z-order
	 */
	drawBackgroundTilemap(map: VdpMap|string, opts: {palette?: string|VdpPalette, scrollX?: number, scrollY?: number, winX?: number, winY?: number, winW?: number, winH?: number, lineTransform?: LineTransformationArray, wrap?: boolean, tileset?: string|VdpSprite, transparent?: boolean, prio?: number} = {}) {
		if (typeof map === 'string') map = this.map(map);
		// TODO Florian -- no need for such a param, since the user can modify map.designPalette himself…
		// Maybe the other options could be in the map too… (just beware that they are strings, not actual links to the palette/tileset… but we could typecheck too)
		const pal = this._getPalette(opts.hasOwnProperty('palette') ? opts.palette : map.designPalette);
		const til = this._getSprite(opts.hasOwnProperty('tileset') ? opts.tileset : map.designTileset);
		const scrollX = opts.hasOwnProperty('scrollX') ? opts.scrollX : 0;
		const scrollY = opts.hasOwnProperty('scrollY') ? opts.scrollY : 0;
		let winX = opts.hasOwnProperty('winX') ? opts.winX : 0;
		let winY = opts.hasOwnProperty('winY') ? opts.winY : 0;
		let winW = opts.hasOwnProperty('winW') ? opts.winW : (SCREEN_WIDTH - winX);
		let winH = opts.hasOwnProperty('winH') ? opts.winH : (SCREEN_HEIGHT - winY);
		const wrap = opts.hasOwnProperty('wrap') ? opts.wrap : true;
		const transparent = !!opts.transparent;
		const prio = Math.floor(opts.prio || (transparent ? 1 : 0));
		const buffer = transparent ? this._tbgBuffer : this._bgBuffer;

		if (prio < 0 || prio > 15) throw new Error('Unsupported BG priority (0-15)');

		const pixels = computeObjectPixels(winX, winY, winX + winW, winY + winH);
		if (pixels + this._usedBgPixels > BG_PIXEL_LIMIT) {
			if (DEBUG) console.log('Using too many BG pixels');
			this._usedBgPixels = BG_PIXEL_LIMIT;
			return;
		}
		this._usedBgPixels += pixels;

		let linescrollBuffer = -1;
		if (opts.lineTransform) {
			linescrollBuffer = opts.lineTransform._assignedId;
			// Not assigned yet => create entry and assign it so it can be reused across multiple planes
			if (linescrollBuffer < 0) {
				if (this._nextLinescrollBuffer >= MAX_LINESCROLL_BUFFERS) {
					if (DEBUG) console.log(`Only ${MAX_LINESCROLL_BUFFERS} LineTransformationArray are allowed`);
					return;
				}
				opts.lineTransform._assignedId = linescrollBuffer = 256 + this._nextLinescrollBuffer;
				writeToTextureFloat(this._gl, this._otherTexture, 0, this._nextLinescrollBuffer++, opts.lineTransform.buffer.length / 4, 1, opts.lineTransform.buffer);
			}
		}

		enqueueMap(buffer, map.x, map.y, til.x, til.y, map.w, map.h, til.w, til.tw, til.th, winX, winY, winW, winH, scrollX, scrollY, pal.y, til.hiColor, linescrollBuffer, wrap ? 1 : 0, prio);
	}

	/**
	 * @param sprite {string|VdpSprite} sprite to draw (e.g. vdp.sprite('plumber') or just 'plumber')
	 * @param x position (X coord)
	 * @param y position (Y coord)
	 * @param [opts]
	 * @param opts.palette specific palette to use (otherwise just uses the design palette of the sprite)
	 * @param opts.width width on the screen (stretches the sprite compared to sprite.w)
	 * @param opts.height height on the screen (stretches the sprite compared to sprite.h)
	 * @param opts.prio priority of the sprite. By default sprites have a priority of 1 (whereas BGs use 0). Note
	 * that a sprite having the same priority as a BG will appear BEHIND the BG. This allows you to hide objects behind
	 * background planes.
	 * @param opts.transparent whether this is a OBJ1 type sprite (with color effects)
	 */
	drawObject(sprite, x, y, opts: {palette?: string|VdpPalette, width?: number, height?: number, prio?: number, transparent?: boolean, flipH?: boolean, flipV?: boolean} = {}) {
		if (typeof sprite === 'string') sprite = this.sprite(sprite);
		// TODO Florian -- no need for such a param, since the user can modify sprite.designPalette himself…
		const pal = this._getPalette(opts.hasOwnProperty('palette') ? opts.palette : sprite.designPalette);
		const w = opts.hasOwnProperty('width') ? opts.width : sprite.w;
		const h = opts.hasOwnProperty('height') ? opts.height : sprite.h;
		const prio = Math.floor(opts.prio || (opts.transparent ? 2 : 1));
		const buffer = opts.transparent ? this._obj1Buffer: this._obj0Buffer;
		const u = Math.floor(sprite.x);
		const v = Math.floor(sprite.y);

		if (prio < 0 || prio > 15) throw new Error('Unsupported object priority (0-15)');

		if (this._obj0Buffer.usedSprites + this._obj1Buffer.usedSprites >= OBJ_LIMIT) {
			if (DEBUG) console.log(`Using too many objects (max ${OBJ_LIMIT}`);
			return;
		}

		const pixels = computeObjectPixels(x, y, x + w, y + h, true);
		if (pixels + this._usedObjCells > OBJ_CELL_LIMIT) {
			if (DEBUG) console.log('Using too many OBJ pixels');
			if (this._usedObjCells >= OBJ_CELL_LIMIT) return;

			// Split the object horizontally to fit all remaining pixels
			const visibleHeight = computeObjectPixels(0, y, OBJ_CELL_SIZE, y + h, true);
			const remaining = OBJ_CELL_LIMIT - this._usedObjCells;
			const newW = Math.floor(remaining / visibleHeight) * OBJ_CELL_SIZE;
			enqueueObj(buffer, x, y, x + newW, y + h,
				u, v, u + sprite.w * newW / w, v + Math.floor(sprite.h), pal.y, sprite.hiColor, prio, opts.flipH, opts.flipV);
			this._usedObjCells = OBJ_CELL_LIMIT;
			return;
		}
		this._usedObjCells += pixels;

		enqueueObj(buffer, x, y, x + w, y + h,
			u, v, u + Math.floor(sprite.w), v + Math.floor(sprite.h), pal.y, sprite.hiColor, prio, opts.flipH, opts.flipV);
	}

	map(name: string): VdpMap {
		const map = this._gameData.maps[name];
		if (!map) throw new Error(`Map ${name} not found`);
		return new VdpMap(map.x, map.y, map.w, map.h, map.til, map.pal);
	}

	palette(name: string): VdpPalette {
		const pal = this._gameData.pals[name];
		if (!pal) throw new Error(`Palette ${name} not found`);
		return new VdpPalette(pal.y, pal.w, pal.h);
	}

	/**
	 * @param map name of the map (or map itself). You may also query an arbitrary portion of the map
	 * memory using new VdpMap(…) or offset an existing map, using vdp.map('myMap').offset(…).
	 * @param source set to vdp.SOURCE_BLANK if you don't care about the current content of
	 * the memory (you're going to write only and you need a buffer for that), vdp.SOURCE_CURRENT to read the current
	 * contents of the memory (as was written the last time with writeMap) or vdp.SOURCE_ROM to get the original data
	 * as downloaded from the cartridge.
	 * @return a Array2D containing the map data (buffer member is a Uint16Array), each element being the tile number
	 * in the tileset.
	 */
	readMap(map: string|VdpMap, source = CopySource.current): Array2D {
		const m = this._getMap(map);
		const result = new Uint16Array(m.w * m.h);
		if (source === CopySource.current) this._shadowMapTex.readToBuffer(m.x, m.y, m.w, m.h, result);
		if (source === CopySource.rom) this._romMapTex.readToBuffer(m.x, m.y, m.w, m.h, result);
		return new Array2D(result, m.w, m.h);
	}

	/**
	 * @param palette name of the palette (or palette itself). You may also query an arbitrary portion
	 * of the palette memory using new VdpPalette(…) or offset an existing map, using vdp.map('myMap').offset(…).
	 * @param source look at readMap for more info.
	 * @return {Array2D} an array containing the color entries, encoded as 0xAABBGGRR
	 */
	readPalette(palette: string|VdpPalette, source = CopySource.current): Array2D {
		const pal = this._getPalette(palette);
		return this.readPaletteMemory(0, pal.y, pal.w, pal.h, source);
	}

	/**
	 * @param x
	 * @param y
	 * @param w
	 * @param h
	 * @param source look at readMap for more info.
	 * @return a Array2D that contains color entries, encoded as 0xAABBGGRR
	 */
	readPaletteMemory(x: number, y: number, w: number, h: number, source = CopySource.current): Array2D {
		const result = new Uint32Array(w * h);
		if (source === CopySource.current) this._shadowPaletteTex.readToBuffer(x, y, w, h, result);
		if (source === CopySource.rom) this._romPaletteTex.readToBuffer(x, y, w, h, result);
		return new Array2D(result, w, h);
	}

	/**
	 * @param sprite name of the sprite (or sprite itself). You may also query an arbitrary portion of the
	 * sprite memory using new VdpSprite(…) or offset an existing sprite, using vdp.sprite('mySprite').offset(…).
	 * @param source look at readMap for more info.
	 * @return a Array2D containing the tileset data. For hi-color sprites, each entry represents one pixel.
	 * For lo-color sprites, each entry corresponds to two packed pixels, of 4 bits each.
	 */
	readSprite(sprite: string|VdpSprite, source = CopySource.current): Array2D {
		const s = this._getSprite(sprite);

		if (!s.hiColor && s.x % 2 !== 0) throw new Error('Lo-color sprites need to be aligned to 2 pixels');
		const x = s.hiColor ? s.x : (s.x / 2);
		const w = s.hiColor ? s.w : Math.ceil(s.w / 2);

		const result = new Uint8Array(w * s.h);
		if (source === CopySource.current) this._shadowSpriteTex.readToBuffer(x, s.y, w, s.h, result);
		if (source === CopySource.rom) this._romSpriteTex.readToBuffer(x, s.y, w, s.h, result);
		return new Array2D(result, w, s.h);
	}

	get screenHeight(): number {
		return SCREEN_HEIGHT;
	}

	get screenWidth(): number {
		return SCREEN_WIDTH;
	}

	sprite(name: string): VdpSprite {
		const spr = this._gameData.sprites[name];
		if (!spr) throw new Error(`Sprite ${name} not found`);
		return new VdpSprite(spr.x, spr.y, spr.w, spr.h, spr.tw, spr.th, spr.tiles, spr.hicol, spr.pal);
	}

	/**
	 * @param map {string|VdpMap} name of the map (or map itself). You may also write to an arbitrary portion of the map
	 * memory using new VdpMap(…) or offset an existing map, using vdp.map('myMap').offset(…).
	 * @param data {Array2D} map data to write (use readMap to create a buffer like that)
	 */
	writeMap(map: string|VdpMap, data: Array2D) {
		const m = this._getMap(map);
		this._shadowMapTex.writeTo(m.x, m.y, m.w, m.h, data.array);
		this._shadowMapTex.syncToVramTexture(this._gl, this._mapTexture, m.x, m.y, m.w, m.h);
		this._usedVramWrites += m.w * m.h;
	}

	/**
	 * @param palette
	 * @param data {Array2D} color entries, encoded as 0xAABBGGRR
	 */
	writePalette(palette: string|VdpPalette, data: Array2D) {
		const pal = this._getPalette(palette);
		this.writePaletteMemory(0, pal.y, pal.w, pal.h, data);
	}

	/**
	 *
	 * @param x
	 * @param y
	 * @param w
	 * @param h
	 * @param data {Array2D} color entries, encoded as 0xAABBGGRR
	 */
	writePaletteMemory(x: number, y: number, w: number, h: number, data: Array2D) {
		this._shadowPaletteTex.writeTo(x, y, w, h, data.array);
		this._shadowPaletteTex.syncToVramTexture(this._gl, this._paletteTexture, x, y, w, h);
		this._usedVramWrites += w * h;
	}

	/**
	 * @param sprite name of the sprite (or sprite itself). You may also write to an arbitrary portion
	 * of the sprite memory using new VdpSprite(…) or offset an existing sprite, using vdp.sprite('mySprite').offset(…).
	 * @param data {Array2D} the new data. For hi-color sprites, each entry represents one pixel. For lo-color sprites,
	 * each entry corresponds to two packed pixels, of 4 bits each.
	 */
	writeSprite(sprite: string|VdpSprite, data: Array2D) {
		const s = this._getSprite(sprite);

		if (!s.hiColor && s.x % 2 !== 0) throw new Error('Lo-color sprites need to be aligned to 2 pixels');
		const x = s.hiColor ? s.x : (s.x / 2);
		const w = s.hiColor ? s.w : Math.ceil(s.w / 2);

		this._shadowSpriteTex.writeTo(x, s.y, w, s.h, data.array);
		this._shadowSpriteTex.syncToVramTexture(this._gl, this._spriteTexture, x, s.y, w, s.h);
		// this._shadowSpriteTex = makeShadowFromTexture8(this._gl, {
		// 	texture: this._spriteTexture,
		// 	width: this._shadowSpriteTex.width,
		// 	height: this._shadowSpriteTex.height
		// });
		this._usedVramWrites += w * s.h;
	}

	// --------------------- PRIVATE ---------------------
	private _applyTransparencyConfig(transparencyConfig) {
		const gl = this._gl;
		const {effect, blendSrc, blendDst, operation} = transparencyConfig;

		envColor[0] = envColor[1] = envColor[2] = envColor[3] = 1;
		gl.blendEquation(operation === 'sub' ? gl.FUNC_REVERSE_SUBTRACT : gl.FUNC_ADD);

		if (effect === 'blend') { // Used internally for the fade
			gl.enable(gl.BLEND);
			gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
		} else if (effect === 'premult') {
			gl.enable(gl.BLEND);
			gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
		} else if (effect === 'color') {
			const dst = color.extract(blendDst, this._paletteBpp);
			const src = color.extract(blendSrc, this._paletteBpp);
			// Background blend factor
			gl.blendColor(dst.r / 255, dst.g / 255, dst.b / 255, dst.a / 255);
			// Source blend factor defined in shader
			envColor[0] = src.r / 255;
			envColor[1] = src.g / 255;
			envColor[2] = src.b / 255;
			envColor[3] = src.a / 255;
			gl.blendFunc(gl.SRC_ALPHA, gl.CONSTANT_COLOR);
			gl.enable(gl.BLEND);
		} else {
			gl.disable(gl.BLEND);
		}
	}

	// Take one frame in account for the stats. Read with _readStats.
	private _computeStats() {
		this._stats.peakBG = Math.max(this._stats.peakBG, this._usedBgPixels / (this.screenWidth * this.screenHeight));
		this._stats.peakOBJ = Math.max(this._stats.peakOBJ, this._usedObjCells);
	}

	/**
	 * Renders the machine in the current state. Only available for the extended version of the GPU.
	 */
	private _doRender() {
		const gl = this._gl;
		// Do before drawing stuff since it flushes the buffer
		if (DEBUG) this._computeStats();

		// Only the first time per frame (allow multiple render per frames)
		if (this._frameStarted) {
			// const clearColor = color.extract(this._shadowPaletteTex.buffer[0], this._paletteBpp);
			// gl.clearColor(clearColor.r / 255, clearColor.g / 255, clearColor.b / 255, 0);

			gl.clearColor(0, 0, 0, 0);
			if (USE_PRIORITIES) {
				gl.clearDepth(1.0);
				gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
			}
			else {
				gl.clear(gl.COLOR_BUFFER_BIT);
			}

			// Clear with BD color
			gl.disable(gl.DEPTH_TEST);
			drawOpaquePoly(this, 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT, 0, 0, 0, 0);
			this._frameStarted = false;

			if (USE_PRIORITIES) {
				// PERF: This is a lot slower if there's a discard in the fragment shader (and we need one?) because the GPU can't test & write to the depth buffer until after the fragment shader has been executed. So there's no point in using it I guess.
				gl.depthFunc(gl.LESS);			// Near things obscure far things
				gl.enable(gl.DEPTH_TEST);
			}
		}

		// OBJ0 and BG (both opaque, OBJ0 first to appear above
		this._applyTransparencyConfig(NO_TRANSPARENCY);
		drawPendingMap(this, this._bgBuffer);
		drawPendingObj(this, this._obj0Buffer, 0, this._obj0Buffer.usedSprites);

		// We need to split the render in 2: once for the objects behind the TBG and once for those in front
		const splitAt = this._obj1Buffer.sort(this._tbgBuffer.getZOfBG(0));

		// Objects in front of the BG
		this._applyTransparencyConfig(this._objTransparency);
		drawPendingObj(this, this._obj1Buffer, 0, splitAt);

		// OBJ1 then TBG, so OBJ1 can be used as mask
		this._applyTransparencyConfig(this._bgTransparency);
		drawPendingMap(this, this._tbgBuffer);

		// Objects behind the BG
		this._applyTransparencyConfig(this._objTransparency);
		drawPendingObj(this, this._obj1Buffer, splitAt, this._obj1Buffer.usedSprites);

		this._obj0Buffer.reset();
		this._obj1Buffer.reset();
		this._nextLinescrollBuffer = this._usedObjCells = this._usedBgPixels = 0;
	}

	/**
	 * @returns {number} the frame "cost" (i.e. how many frames it takes to "render" based on the stats). 1 means normal,
	 * 2 means that it will run 30 FPS, 3 = 20 FPS, etc.
	 * @private
	 */
	public _endFrame(): number {
		this._doRender();

		// Draw fade
		const {r, g, b, a} = color.extract(this._fadeColor, this._paletteBpp);
		if (a > 0) {
			const gl = this._gl;

			this._applyTransparencyConfig(STANDARD_TRANSPARENCY);
			gl.disable(gl.DEPTH_TEST);
			drawOpaquePoly(this, 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT, r / 255, g / 255, b / 255, a / 255);
		}

		const cost = Math.min(MAX_FRAME_SLOWDOWN, Math.ceil(this._usedVramWrites / MAX_VRAM_WRITES));
		if (DEBUG && cost > 1) console.log(`Overuse of VRAM writes for this frame (${this._usedVramWrites}/${MAX_VRAM_WRITES}), slowing down ${cost}x`);
		this._stats.peakVramWrites = Math.max(this._stats.peakVramWrites, this._usedVramWrites);
		this._usedVramWrites = 0;
		return cost;
	}

	private _getMap(name: string|VdpMap): VdpMap {
		if (typeof name === 'string') return this.map(name);
		return name;
	}

	private _getPalette(name: string|VdpPalette): VdpPalette {
		if (typeof name === 'string') return this.palette(name);
		return name;
	}

	private _getSprite(name: string|VdpSprite): VdpSprite {
		if (typeof name === 'string') return this.sprite(name);
		return name;
	}

	/**
	 * Get and reset the VDP stats.
	 */
	public _getStats() {
		const result = this._stats;
		this._stats = {
			peakOBJ: 0,
			peakBG: 0,
			peakVramWrites: 0
		};
		return result;
	}

	private _initContext(canvas: HTMLCanvasElement) {
		this._gl = canvas.getContext("webgl", { premultipliedAlpha: true, alpha: SEMITRANSPARENT_CANVAS, antialias: false });

		// Only continue if WebGL is available and working
		if (this._gl === null) {
			alert("Unable to initialize WebGL. Your browser or machine may not support it.");
		}
	}

	private _initMatrices() {
		this._projectionMatrix = mat4.create();
		// note: glmatrix.js always has the first argument as the destination to receive the result.
		mat4.ortho(this._projectionMatrix, 0.0, SCREEN_WIDTH, SCREEN_HEIGHT, 0.0, -16, 16);

		// Normally set in modelViewMatrix, but we want to allow an empty model view matrix
		//mat4.translate(this.projectionMatrix, this.projectionMatrix, [-0.0, 0.0, -0.1]);

		this._modelViewMatrix = mat3.create();
		// mat4.translate(this.modelViewMatrix, this.modelViewMatrix, [-0.0, 0.0, -0.1]);
	}

	public _startFrame() {
		this._frameStarted = true;
	}
}
