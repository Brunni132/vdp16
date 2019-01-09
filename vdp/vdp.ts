import { createDataTextureFloat, loadTexture, writeToTextureFloat } from "./utils";
import { drawPendingObj, enqueueObj, initObjShaders, makeObjBuffer, ObjBuffer } from "./sprites";
import { drawPendingMap, enqueueMap, initMapShaders, makeMapBuffer } from "./maps";
import {
	colorSwaps,
	envColor, OTHER_TEX_COLORSWAP_INDEX, OTHER_TEX_H,
	OTHER_TEX_W, PALETTE_TEX_H, PALETTE_TEX_W,
	SCREEN_HEIGHT,
	SCREEN_WIDTH,
	SEMITRANSPARENT_CANVAS,
	setTextureSizes,
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
import { color32 } from "./color32";
import { mat3, mat4 } from 'gl-matrix';

export const DEBUG = true;
// Specs of the fantasy console, do not modify for now
const BG_LIMIT = 3;
const TBG_LIMIT = 1;
const OBJ0_CELL_LIMIT = 256;
const OBJ1_CELL_LIMIT = 64;
const OBJ0_LIMIT = 256;
const OBJ1_LIMIT = 32;

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

	apply(vdp: VDP) {
		const gl = vdp.gl;
		const {effect, blendSrc, blendDst, operation} = this;

		envColor[0] = envColor[1] = envColor[2] = envColor[3] = 1;
		gl.blendEquation(operation === 'sub' ? gl.FUNC_REVERSE_SUBTRACT : gl.FUNC_ADD);

		if (effect === 'blend') { // Used internally for the fade
			gl.enable(gl.BLEND);
			gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
		} else if (effect === 'premult') {
			gl.enable(gl.BLEND);
			gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
		} else if (effect === 'color') {
			const dst = color32.extract(blendDst, vdp.paletteBpp);
			const src = color32.extract(blendSrc, vdp.paletteBpp);
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
}

const NO_TRANSPARENCY = new TransparencyConfig('none', 'add', 0, 0);
const STANDARD_TRANSPARENCY = new TransparencyConfig('blend', 'add', 0, 0);

export enum VDPCopySource {
	current,
	rom,
	blank,
}

/**
 * Use this class to provide a transformation for each line of the BG when drawing. You can create many kind of effects
 * using this, look at the samples.
 */
export class LineTransformationArray {
	buffer: Float32Array;
	length: number;

	constructor() {
		// 8 floats per item (hack for the last one since mat3 is actually 9 items)
		this.length = SCREEN_HEIGHT;
		this.buffer = new Float32Array(this.length * 8);
  }

  getLine(lineNo): mat3 {
	  if (lineNo < 0 || lineNo >= this.length) throw new Error(`getLine: index ${lineNo} out of range`);
		return mat3.fromValues(this.buffer[lineNo * 8], this.buffer[lineNo * 8 + 1], this.buffer[lineNo * 8 + 2], this.buffer[lineNo * 8 + 3], this.buffer[lineNo * 8 + 4], this.buffer[lineNo * 8 + 5], this.buffer[lineNo * 8 + 6], this.buffer[lineNo * 8 + 7], 1);
  }

  setAll(transformation: mat3) {
	  const copy = mat3.create();
	  for (let i = 0; i < this.length; i++) {
			mat3.translate(copy, transformation, [0, i]);
			this.setLine(i, copy);
	  }
  }

	setLine(lineNo, transformation: mat3) {
		if (lineNo < 0 || lineNo >= this.length) throw new Error(`setLine: index ${lineNo} out of range`);
		this.buffer.set((transformation as Float32Array).subarray(0, 8), lineNo * 8);
	}
}

export class LineColorArray {
	buffer: Float32Array;
	length: number;
	targetPaletteNumber: number;
	targetPaletteIndex: number;

	constructor(targetPaletteNumber: number, targetPaletteIndex: number) {
		this.targetPaletteNumber = targetPaletteNumber;
		this.targetPaletteIndex = targetPaletteIndex;
		this.length = SCREEN_HEIGHT;
		this.buffer = new Float32Array(this.length * 4);
	}

	setAll(paletteNumber: number, paletteIndex: number) {
		for (let i = 0; i < length; i++) this.setLine(i, paletteNumber, paletteIndex);
	}

	setLine(lineNo: number, paletteNumber: number, paletteIndex: number) {
		if (lineNo < 0 || lineNo >= this.length) throw new Error(`setLine: index ${lineNo} out of range`);
		this.buffer[lineNo * 4] = Math.floor(paletteIndex % 256) / PALETTE_TEX_W;
		this.buffer[lineNo * 4 + 1] = Math.floor(paletteNumber % 256) / PALETTE_TEX_H;
	}
}

export class VDP {
	gl: WebGLRenderingContext;
	gameData: any;
	mapProgram: any;
	modelViewMatrix: mat3;
	projectionMatrix: mat4;
	spriteProgram: any;
	opaquePolyProgram: any;
	mapTexture: WebGLTexture;
	paletteTexture: WebGLTexture;
	spriteTexture: WebGLTexture;
	otherTexture: WebGLTexture;

	// Fade color (factor is the upper 8 bits).
	private fadeColor = 0x00000000;
	private bgTransparency = new TransparencyConfig('color', 'add', 0x888888, 0x888888);
	private objTransparency = new TransparencyConfig('color', 'add', 0x888888, 0x888888);
	private bgBuffer = makeMapBuffer('Opaque BG [BG]', BG_LIMIT);
	private tbgBuffer = makeMapBuffer('Transparent BG [TBG]', TBG_LIMIT);
	private obj0Buffer = makeObjBuffer('Opaque sprites [OBJ0]', OBJ0_LIMIT);
	private obj1Buffer = makeObjBuffer('Transparent sprites [OBJ1]', OBJ1_LIMIT);
	private stats = {
		peakOBJ0: 0,
		peakOBJ1: 0,
		peakBG: 0,
		OBJ0Limit: OBJ0_CELL_LIMIT
	};
	private frameStarted = true;
	// 2 = 64 colors (SMS), 3 = 512 colors (Mega Drive), 4 = 4096 (System 16), 5 = 32k (SNES), 8 = unmodified (PC)
	public paletteBpp;
	// Original data (ROM) for sprites
	private romSpriteTex: ShadowTexture;
	// Copy of the VRAM data for fast read access from the program
	private shadowSpriteTex: ShadowTexture;
	private romPaletteTex: ShadowTexture;
	private shadowPaletteTex: ShadowTexture;
	private romMapTex: ShadowTexture;
	private shadowMapTex: ShadowTexture;
	private nextLinescrollBuffer: number = 0;

	constructor(canvas: HTMLCanvasElement, done: () => void) {
		this._initContext(canvas);
		this._initMatrices();

		const gl = this.gl;
		// TODO Florian -- run all requests at the same time and wait for them all.
		window.fetch('build/game.json').then((res) => {
			if (!res.ok) throw new Error('You need to build your project first; run `npm run convert-gfx`.')
			return res.json();
		}).then((json) => {
			this.gameData = json;
			this.paletteBpp = json.info.paletteBpp;
			if ([2, 3, 4, 5, 8].indexOf(this.paletteBpp) === -1) throw new Error(`Unsupported paletteBpp ${this.paletteBpp}`);

			loadTexture(gl, 'build/sprites.png').then(sprites => {
				this.spriteTexture = sprites.texture;
				this.romSpriteTex = makeShadowFromTexture8(gl, sprites);
				this.shadowSpriteTex = this.romSpriteTex.clone();

				loadTexture(gl, 'build/palettes.png').then(palettes => {
					if (!(palettes.width === 256 && palettes.height === 64) && !(palettes.width === 16 && palettes.height === 256))
						throw new Error('Mismatch in texture size (max {16,256}x256');
					this.paletteTexture = palettes.texture;
					this.romPaletteTex = makeShadowFromTexture32(gl, palettes);
					this.shadowPaletteTex = this.romPaletteTex.clone();
					if (this.paletteBpp !== 8) this.shadowPaletteTex.setPosterization(this.paletteBpp);

					loadTexture(gl, 'build/maps.png').then(maps => {
						this.mapTexture = maps.texture;
						this.romMapTex = makeShadowFromTexture16(gl, maps);
						this.shadowMapTex = this.romMapTex.clone();

						setTextureSizes(palettes.width, palettes.height, maps.width, maps.height, sprites.width, sprites.height);

						this.otherTexture = createDataTextureFloat(gl, OTHER_TEX_W, OTHER_TEX_H);
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
	 * Note that the backdrop is exactly the first color of the first palette. You can therefore modify it by writing
	 * to that palette color too. It can become handy when you are doing fades by modifying all colors.
	 * @param color backdrop color
	 */
	configBDColor(color: number|string) {
		this.shadowPaletteTex.buffer[0] = color32.parse(color);
	}

	/**
	 * Configure transparent background effect.
	 * @param opts
	 * @param opts.op 'add' or 'sub'
	 * @param opts.blendSrc source tint (quantity of color to take from the blending object)
	 * @param opts.blendDst destination tint (quantity of color to take from the backbuffer when mixing)
	 */
	configBGTransparency(opts: {op: TransparencyConfigOperation, blendSrc: number|string, blendDst: number|string}) {
		if (opts.op !== 'add' && opts.op !== 'sub') {
			throw new Error(`Invalid operation ${opts.op}`);
		}
		this.bgTransparency.operation = opts.op;
		this.bgTransparency.blendSrc = color32.parse(opts.blendSrc);
		this.bgTransparency.blendDst = color32.parse(opts.blendDst);
	}

	/**
	 * Configures up to 4 colors that are replaced every line by another palette color.
	 * @param {LineColorArray[]} colorTable
	 */
	configColorSwap(colorTable: LineColorArray[]) {
		if (colorTable.length >= 4) throw new Error('Can only swap up to 4 colors at a time');
		colorTable.forEach((t, i) => {
			colorSwaps[i] = t.targetPaletteNumber << 8 | t.targetPaletteIndex;
			writeToTextureFloat(this.gl, this.otherTexture, 0, i + OTHER_TEX_COLORSWAP_INDEX, t.buffer.length / 4, 1, t.buffer);
		});
		for (let i = colorTable.length; i < 4; i++) colorSwaps[i] = -1; // Unreachable color
	}

	/**
	 * Configures the fade.
	 * @param color destination color (suggested black or white).
	 * @param factor between 0 and 255. 0 means disabled, 255 means fully covered. The fade is only visible in
	 * increments of 16 (i.e. 1-15 is equivalent to 0).
	 */
	configFade(color: number|string, factor: number) {
		factor = Math.min(255, Math.max(0, factor));
		this.fadeColor = (color32.parse(color) & 0xffffff) | (factor << 24);
	}

	/**
	 * Configure effect for transparent sprites.
	 * @param opts
	 * @param opts.op 'add' or 'sub'
	 * @param opts.blendSrc source tint (quantity of color to take from the blending object)
	 * @param opts.blendDst destination tint (quantity of color to take from the backbuffer when mixing)
	 */
	configOBJTransparency(opts: {op: TransparencyConfigOperation, blendSrc: number|string, blendDst: number|string}) {
		if (opts.op !== 'add' && opts.op !== 'sub') {
			throw new Error(`Invalid operation ${opts.op}`);
		}
		this.objTransparency.operation = opts.op;
		this.objTransparency.blendSrc = color32.parse(opts.blendSrc);
		this.objTransparency.blendDst = color32.parse(opts.blendDst);
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
	drawBG(map, opts: {palette?: string|VdpPalette, scrollX?: number, scrollY?: number, winX?: number, winY?: number, winW?: number, winH?: number, lineTransform?: LineTransformationArray, wrap?: boolean, tileset?: string|VdpSprite, transparent?: boolean, prio?: number} = {}) {
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
		const prio = opts.prio || (opts.transparent ? 1 : 0);
		const buffer = opts.transparent ? this.tbgBuffer : this.bgBuffer;

		if (this.bgBuffer.usedLayers + this.tbgBuffer.usedLayers >= BG_LIMIT) {
			if (DEBUG) console.log(`Too many BGs (${this.bgBuffer.usedLayers} opaque, ${this.tbgBuffer.usedLayers} transparent), ignoring drawBG`);
			return;
		}

		// To avoid drawing too big quads and them counting toward the BG pixel budget
		winX = Math.min(SCREEN_WIDTH, Math.max(0, winX));
		winY = Math.min(SCREEN_HEIGHT, Math.max(0, winY));
		winW = Math.min(SCREEN_WIDTH - winX, Math.max(0, winW));
		winH = Math.min(SCREEN_HEIGHT - winY, Math.max(0, winH));

		let linescrollBuffer = -1;
		if (opts.lineTransform) {
			linescrollBuffer = 256 + this.nextLinescrollBuffer;
			writeToTextureFloat(this.gl, this.otherTexture, 0, this.nextLinescrollBuffer++, opts.lineTransform.buffer.length / 4, 1, opts.lineTransform.buffer);
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
	drawObj(sprite, x, y, opts: {palette?: string|VdpPalette, width?: number, height?: number, prio?: number, transparent?: boolean} = {}) {
		if (typeof sprite === 'string') sprite = this.sprite(sprite);
		// TODO Florian -- no need for such a param, since the user can modify sprite.designPalette himself…
		const pal = this._getPalette(opts.hasOwnProperty('palette') ? opts.palette : sprite.designPalette);
		const w = opts.hasOwnProperty('width') ? opts.width : sprite.w;
		const h = opts.hasOwnProperty('height') ? opts.height : sprite.h;
		const prio = opts.prio || (opts.transparent ? 2 : 1);
		const buffer = opts.transparent ? this.obj1Buffer: this.obj0Buffer;

		enqueueObj(buffer, x, y, x + w, y + h, sprite.x, sprite.y, sprite.x + sprite.w, sprite.y + sprite.h, pal.y, sprite.hiColor, prio);
	}

	/**
	 * Get and reset the VDP stats.
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

	map(name: string): VdpMap {
		const map = this.gameData.maps[name];
		if (!map) throw new Error(`Map ${name} not found`);
		return new VdpMap(map.x, map.y, map.w, map.h, map.til, map.pal);
	}

	palette(name: string): VdpPalette {
		const pal = this.gameData.pals[name];
		if (!pal) throw new Error(`Palette ${name} not found`);
		return new VdpPalette(pal.y, pal.w, pal.h);
	}

	/**
	 * @param map name of the map (or map itself). You may also query an arbitrary portion of the map
	 * memory using new VdpMap(…) or offset an existing map, using vdp.map('myMap').offsetted(…).
	 * @param source set to vdp.SOURCE_BLANK if you don't care about the current content of
	 * the memory (you're going to write only and you need a buffer for that), vdp.SOURCE_CURRENT to read the current
	 * contents of the memory (as was written the last time with writeMap) or vdp.SOURCE_ROM to get the original data
	 * as downloaded from the cartridge.
	 * @return a Array2D containing the map data (buffer member is a Uint16Array), each element being the tile number
	 * in the tileset.
	 */
	readMap(map: string|VdpMap, source = VDPCopySource.current): Array2D {
		const m = this._getMap(map);
		const result = new Uint16Array(m.w * m.h);
		if (source === VDPCopySource.current) this.shadowMapTex.readToBuffer(m.x, m.y, m.w, m.h, result);
		if (source === VDPCopySource.rom) this.romMapTex.readToBuffer(m.x, m.y, m.w, m.h, result);
		return new Array2D(result, m.w, m.h);
	}

	/**
	 * @param palette name of the palette (or palette itself). You may also query an arbitrary portion
	 * of the palette memory using new VdpPalette(…) or offset an existing map, using vdp.map('myMap').offsetted(…).
	 * @param source look at readMap for more info.
	 * @return {Array2D} an array containing the color entries, encoded as 0xAABBGGRR
	 */
	readPalette(palette: string|VdpPalette, source = VDPCopySource.current): Array2D {
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
	readPaletteMemory(x: number, y: number, w: number, h: number, source = VDPCopySource.current): Array2D {
		const result = new Uint32Array(w * h);
		if (source === VDPCopySource.current) this.shadowPaletteTex.readToBuffer(x, y, w, h, result);
		if (source === VDPCopySource.rom) this.romPaletteTex.readToBuffer(x, y, w, h, result);
		return new Array2D(result, w, h);
	}

	/**
	 * @param sprite name of the sprite (or sprite itself). You may also query an arbitrary portion of the
	 * sprite memory using new VdpSprite(…) or offset an existing sprite, using vdp.sprite('mySprite').offsetted(…).
	 * @param source look at readMap for more info.
	 * @return a Array2D containing the tileset data. For hi-color sprites, each entry represents one pixel.
	 * For lo-color sprites, each entry corresponds to two packed pixels, of 4 bits each.
	 */
	readSprite(sprite: string|VdpSprite, source = VDPCopySource.current): Array2D {
		const s = this._getSprite(sprite);

		if (!s.hiColor && s.x % 2 !== 0) throw new Error('Lo-color sprites need to be aligned to 2 pixels');
		const x = s.hiColor ? s.x : (s.x / 2);
		const w = s.hiColor ? s.w : Math.ceil(s.w / 2);

		const result = new Uint8Array(w * s.h);
		if (source === VDPCopySource.current) this.shadowSpriteTex.readToBuffer(x, s.y, w, s.h, result);
		if (source === VDPCopySource.rom) this.romSpriteTex.readToBuffer(x, s.y, w, s.h, result);
		return new Array2D(result, w, s.h);
	}

	sprite(name: string): VdpSprite {
		const spr = this.gameData.sprites[name];
		if (!spr) throw new Error(`Sprite ${name} not found`);
		return new VdpSprite(spr.x, spr.y, spr.w, spr.h, spr.tw, spr.th, spr.tiles, spr.hicol, spr.pal);
	}

	/**
	 * @param map {string|VdpMap} name of the map (or map itself). You may also write to an arbitrary portion of the map
	 * memory using new VdpMap(…) or offset an existing map, using vdp.map('myMap').offsetted(…).
	 * @param data {Array2D} map data to write (use readMap to create a buffer like that)
	 */
	writeMap(map: string|VdpMap, data: Array2D) {
		const m = this._getMap(map);
		this.shadowMapTex.writeTo(m.x, m.y, m.w, m.h, data.buffer);
		this.shadowMapTex.syncToVramTexture(this.gl, this.mapTexture, m.x, m.y, m.w, m.h);
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
		this.shadowPaletteTex.writeTo(x, y, w, h, data.buffer);
		this.shadowPaletteTex.syncToVramTexture(this.gl, this.paletteTexture, x, y, w, h);
	}

	/**
	 * @param sprite name of the sprite (or sprite itself). You may also write to an arbitrary portion
	 * of the sprite memory using new VdpSprite(…) or offset an existing sprite, using vdp.sprite('mySprite').offsetted(…).
	 * @param data {Array2D} the new data. For hi-color sprites, each entry represents one pixel. For lo-color sprites,
	 * each entry corresponds to two packed pixels, of 4 bits each.
	 */
	writeSprite(sprite: string|VdpSprite, data: Array2D) {
		const s = this._getSprite(sprite);

		if (!s.hiColor && s.x % 2 !== 0) throw new Error('Lo-color sprites need to be aligned to 2 pixels');
		const x = s.hiColor ? s.x : (s.x / 2);
		const w = s.hiColor ? s.w : Math.ceil(s.w / 2);

		this.shadowSpriteTex.writeTo(x, s.y, w, s.h, data.buffer);
		this.shadowSpriteTex.syncToVramTexture(this.gl, this.spriteTexture, x, s.y, w, s.h);
	}

	// --------------------- PRIVATE ---------------------

	// Take one frame in account for the stats. Read with _readStats.
	private _computeStats(obj0Limit: number) {
		this.stats.peakBG = Math.max(this.stats.peakBG, this.bgBuffer.usedLayers + this.tbgBuffer.usedLayers);
		this.stats.peakOBJ0 = Math.max(this.stats.peakOBJ0, this._totalUsedOBJ0());
		this.stats.peakOBJ1 = Math.max(this.stats.peakOBJ1, this._totalUsedOBJ1());
		this.stats.OBJ0Limit = Math.min(this.stats.OBJ0Limit, obj0Limit);
	}

	/**
	 * Renders the machine in the current state. Only available for the extended version of the GPU.
	 */
	private _doRender() {
		const gl = this.gl;
		// Do before drawing stuff since it flushes the buffer
		if (DEBUG) this._computeStats(OBJ0_CELL_LIMIT);

		// Only the first time per frame (allow multiple render per frames)
		if (this.frameStarted) {
			const clearColor = color32.extract(this.shadowPaletteTex.buffer[0], this.paletteBpp);
			gl.clearColor(clearColor.r / 255, clearColor.g / 255, clearColor.b / 255, 0);

			if (USE_PRIORITIES) {
				gl.clearDepth(1.0);				 // Clear everything
				// PERF: This is a lot slower if there's a discard in the fragment shader (and we need one?) because the GPU can't test & write to the depth buffer until after the fragment shader has been executed. So there's no point in using it I guess.
				gl.enable(gl.DEPTH_TEST);		   // Enable depth testing
				gl.depthFunc(gl.LESS);			// Near things obscure far things
				gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

			} else {
				gl.clear(gl.COLOR_BUFFER_BIT);
			}

			this.frameStarted = false;
		}

		// OBJ0 and BG (both opaque, OBJ0 first to appear above
		NO_TRANSPARENCY.apply(this);
		mat3.identity(this.modelViewMatrix);
		drawPendingMap(this, this.bgBuffer);
		this._drawObjLayer(this.obj0Buffer, OBJ0_CELL_LIMIT);

		// TBG then OBJ1
		this.bgTransparency.apply(this);
		gl.depthMask(false);
		drawPendingMap(this, this.tbgBuffer);
		gl.depthMask(true);

		// Draw in reverse order
		this.obj1Buffer.sort();
		this.objTransparency.apply(this);
		this._drawObjLayer(this.obj1Buffer, OBJ1_CELL_LIMIT);

		this.nextLinescrollBuffer = 0;
	}

	/**
	 * @param objBuffer {ObjBuffer}
	 * @param objLimit {number} max number of cells drawable
	 * @private
	 */
	private _drawObjLayer(objBuffer: ObjBuffer, objLimit: number = 0) {
		// Use config only for that poly list
		mat3.identity(this.modelViewMatrix);
		drawPendingObj(this, objBuffer, objLimit);
		mat3.identity(this.modelViewMatrix);
	}

	public _endFrame() {
		this._doRender();

		// Draw fade
		if (this.fadeColor >>> 24 >= 0x10) {
			const gl = this.gl;
			const {r, g, b, a} = color32.extract(this.fadeColor, this.paletteBpp);

			STANDARD_TRANSPARENCY.apply(this);
			gl.disable(gl.DEPTH_TEST);
			drawOpaquePoly(this, 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT, r / 255, g / 255, b / 255, a / 255);
		}
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

	private _initContext(canvas: HTMLCanvasElement) {
		this.gl = canvas.getContext("webgl", { premultipliedAlpha: true, alpha: SEMITRANSPARENT_CANVAS });

		// Only continue if WebGL is available and working
		if (this.gl === null) {
			alert("Unable to initialize WebGL. Your browser or machine may not support it.");
		}
	}

	private _initMatrices() {
		this.projectionMatrix = mat4.create();
		// note: glmatrix.js always has the first argument as the destination to receive the result.
		mat4.ortho(this.projectionMatrix, 0.0, SCREEN_WIDTH, SCREEN_HEIGHT, 0.0, -10, 10);

		// Normally set in modelViewMatrix, but we want to allow an empty model view matrix
		//mat4.translate(this.projectionMatrix, this.projectionMatrix, [-0.0, 0.0, -0.1]);

		this.modelViewMatrix = mat3.create();
		// mat4.translate(this.modelViewMatrix, this.modelViewMatrix, [-0.0, 0.0, -0.1]);
	}

	public _startFrame() {
		this.frameStarted = true;
	}

	private _totalUsedOBJ0(): number {
		return this.obj0Buffer.computeUsedObjects();
	}

	private _totalUsedOBJ1(): number {
		return this.obj1Buffer.computeUsedObjects();
	}
}
