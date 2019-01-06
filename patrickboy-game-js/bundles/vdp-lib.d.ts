import { mat3, mat4 } from 'gl-matrix';

declare class VdpMap {
	x: number;
	y: number;
	w: number;
	h: number;
	designTileset: string;
	designPalette: string;
	constructor(x: number, y: number, w: number, h: number, designTileset: string, designPalette: string);
	offsetted(x: number, y: number, w: number, h: number): VdpMap;
}
declare class VdpPalette {
	y: number;
	w: number;
	h: number;
	constructor(y: number, w: number, h: number);
	offsetted(y: number, w: number, h: number): VdpPalette;
}
declare class VdpSprite {
	x: number;
	y: number;
	w: number;
	h: number;
	tw: number;
	th: number;
	tiles: number;
	hiColor: boolean;
	designPalette: string;
	constructor(x: number, y: number, w: number, h: number, tw: number, th: number, tiles: number, hiColor: boolean, designPalette: string);
	offsetted(x: number, y: number, w: number, h: number): VdpSprite;
	/**
	 * Modifies this instance of VdpSprite (not the original) to target a given tile in a tileset.
	 * @throws {Error} if this sprite is not a tileset.
	 * @param no tile number to target.
	 * @returns {VdpSprite} this
	 */
	tile(no: number): VdpSprite;
}
declare class Array2D {
	buffer: Uint8Array | Uint16Array | Uint32Array;
	width: number;
	height: number;
	constructor(buffer: Uint8Array | Uint16Array | Uint32Array, width: number, height: number);
	getElement(x: number, y: number): number;
	setElement(x: number, y: number, value: number): void;
}
export declare type TransparencyConfigOperation = 'add' | 'sub';
declare enum VDPCopySource {
	current = 0,
	rom = 1,
	blank = 2
}
/**
 * Use this class to provide a transformation for each line of the BG when drawing. You can create many kind of effects
 * using this, look at the samples.
 */
export declare class LineTransformationArray {
	buffer: Float32Array;
	numLines: number;
	constructor();
	getLine(lineNo: any): mat3;
	setLine(lineNo: any, transformation: mat3): void;
}
declare class VDP {
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
	private fadeColor;
	private bgTransparency;
	private objTransparency;
	private bgBuffer;
	private tbgBuffer;
	private obj0Buffer;
	private obj1Buffer;
	private stats;
	private frameStarted;
	paletteBpp: any;
	private romSpriteTex;
	private shadowSpriteTex;
	private romPaletteTex;
	private shadowPaletteTex;
	private romMapTex;
	private shadowMapTex;
	private nextLinescrollBuffer;
	constructor(canvas: HTMLCanvasElement, done: () => void);
	/**
	 * Configures the backdrop (background color that is always present).
	 * Note that the backdrop is exactly the first color of the first palette. You can therefore modify it by writing
	 * to that palette color too. It can become handy when you are doing fades by modifying all colors.
	 * @param color backdrop color
	 */
	configBDColor(color: number | string): void;
	/**
	 * Configure transparent background effect.
	 * @param opts
	 * @param opts.op 'add' or 'sub'
	 * @param opts.blendSrc source tint (quantity of color to take from the blending object)
	 * @param opts.blendDst destination tint (quantity of color to take from the backbuffer when mixing)
	 */
	configBGTransparency(opts: {
		op: TransparencyConfigOperation;
		blendSrc: number | string;
		blendDst: number | string;
	}): void;
	/**
	 * Configures the fade.
	 * @param color destination color (suggested black or white).
	 * @param factor between 0 and 255. 0 means disabled, 255 means fully covered. The fade is only visible in
	 * increments of 16 (i.e. 1-15 is equivalent to 0).
	 */
	configFade(color: number | string, factor: number): void;
	/**
	 * Configure effect for transparent sprites.
	 * @param opts
	 * @param opts.op 'add' or 'sub'
	 * @param opts.blendSrc source tint (quantity of color to take from the blending object)
	 * @param opts.blendDst destination tint (quantity of color to take from the backbuffer when mixing)
	 */
	configOBJTransparency(opts: {
		op: TransparencyConfigOperation;
		blendSrc: number | string;
		blendDst: number | string;
	}): void;
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
	drawBG(map: any, opts?: {
		palette?: string | VdpPalette;
		scrollX?: number;
		scrollY?: number;
		winX?: number;
		winY?: number;
		winW?: number;
		winH?: number;
		lineTransform?: LineTransformationArray;
		wrap?: boolean;
		tileset?: string | VdpSprite;
		transparent?: boolean;
		prio?: number;
	}): void;
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
	drawObj(sprite: any, x: any, y: any, opts?: {
		palette?: string | VdpPalette;
		width?: number;
		height?: number;
		prio?: number;
		transparent?: boolean;
	}): void;
	/**
	 * Get and reset the VDP stats.
	 */
	getStats(): {
		peakOBJ0: number;
		peakOBJ1: number;
		peakBG: number;
		OBJ0Limit: number;
	};
	map(name: string): VdpMap;
	palette(name: string): VdpPalette;
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
	readMap(map: string | VdpMap, source?: VDPCopySource): Array2D;
	/**
	 * @param palette name of the palette (or palette itself). You may also query an arbitrary portion
	 * of the palette memory using new VdpPalette(…) or offset an existing map, using vdp.map('myMap').offsetted(…).
	 * @param source look at readMap for more info.
	 * @return {Array2D} an array containing the color entries, encoded as 0xAABBGGRR
	 */
	readPalette(palette: string | VdpPalette, source?: VDPCopySource): Array2D;
	/**
	 * @param x
	 * @param y
	 * @param w
	 * @param h
	 * @param source look at readMap for more info.
	 * @return a Array2D that contains color entries, encoded as 0xAABBGGRR
	 */
	readPaletteMemory(x: number, y: number, w: number, h: number, source?: VDPCopySource): Array2D;
	/**
	 * @param sprite name of the sprite (or sprite itself). You may also query an arbitrary portion of the
	 * sprite memory using new VdpSprite(…) or offset an existing sprite, using vdp.sprite('mySprite').offsetted(…).
	 * @param source look at readMap for more info.
	 * @return a Array2D containing the tileset data. For hi-color sprites, each entry represents one pixel.
	 * For lo-color sprites, each entry corresponds to two packed pixels, of 4 bits each.
	 */
	readSprite(sprite: string | VdpSprite, source?: VDPCopySource): Array2D;
	sprite(name: string): VdpSprite;
	/**
	 * @param map {string|VdpMap} name of the map (or map itself). You may also write to an arbitrary portion of the map
	 * memory using new VdpMap(…) or offset an existing map, using vdp.map('myMap').offsetted(…).
	 * @param data {Array2D} map data to write (use readMap to create a buffer like that)
	 */
	writeMap(map: string | VdpMap, data: Array2D): void;
	/**
	 * @param palette
	 * @param data {Array2D} color entries, encoded as 0xAABBGGRR
	 */
	writePalette(palette: string | VdpPalette, data: Array2D): void;
	/**
	 *
	 * @param x
	 * @param y
	 * @param w
	 * @param h
	 * @param data {Array2D} color entries, encoded as 0xAABBGGRR
	 */
	writePaletteMemory(x: number, y: number, w: number, h: number, data: Array2D): void;
	/**
	 * @param sprite name of the sprite (or sprite itself). You may also write to an arbitrary portion
	 * of the sprite memory using new VdpSprite(…) or offset an existing sprite, using vdp.sprite('mySprite').offsetted(…).
	 * @param data {Array2D} the new data. For hi-color sprites, each entry represents one pixel. For lo-color sprites,
	 * each entry corresponds to two packed pixels, of 4 bits each.
	 */
	writeSprite(sprite: string | VdpSprite, data: Array2D): void;
	private _computeStats;
	/**
	 * Renders the machine in the current state. Only available for the extended version of the GPU.
	 */
	private _doRender;
	/**
	 * @param objBuffer {ObjBuffer}
	 * @param objLimit {number} max number of cells drawable
	 * @private
	 */
	private _drawObjLayer;
	_endFrame(): void;
	private _getMap;
	private _getPalette;
	private _getSprite;
	private _initContext;
	private _initMatrices;
	_startFrame(): void;
	private _totalUsedOBJ0;
	private _totalUsedOBJ1;
}
export declare function startGame(canvas: HTMLCanvasElement, loadedCb: (vdp: VDP) => IterableIterator<number>): void;