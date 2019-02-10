export class VdpMap {
	x: number; // U position in the map texture (cells)
	y: number; // V position in the map texture (cells)
	w: number; // width of sprite (pixels)
	h: number; // height of sprite (pixels)
	designTileset: string; // name of the tileset (VdpSprite)
	designPalette: string; // name of the first palette (takes precedence over the one defined in the tileset); tiles can use this and the next 15 palettes via the bits 12-15 in the tile number.

	constructor(x: number, y: number, w: number, h: number, designTileset: string, designPalette: string) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.designTileset = designTileset;
		this.designPalette = designPalette;
	}

	offset(x: number, y: number, w: number, h: number): VdpMap {
		this.x += x;
		this.y += y;
		this.w = w;
		this.h = h;
		return this;
	}
}

export class VdpPalette {
	y: number; // V position of palette (color units)
	w: number; // count (color units)
	h: number; // number of rows (consecutive palettes)

	constructor(y: number, w: number, h: number) {
		this.y = y;
		this.w = w;
		this.h = h;
	}

	offset(y: number, w: number, h: number): VdpPalette {
		this.y += y;
		this.w = w;
		this.h = h;
		return this;
	}
}

export class VdpSprite {
	x: number; // U position in the sprite texture (pixels)
	y: number; // V position in the sprite texture (pixels)
	w: number; // width of sprite or tileset as a whole (pixels)
	h: number; // height of sprite or tileset as a whole (pixels)
	tw: number; // tile width (pixels) if it's a tileset
	th: number; // tile height (pixels) if it's a tileset
	tiles: number; // number of (used) tiles in the tileset
	hiColor: boolean; // whether it's a 8-bit-per-pixel tile (or 4-bit)
	designPalette: string; // design palette name (can be overriden)

	constructor(x: number, y: number, w: number, h: number, tw: number, th: number, tiles: number, hiColor: boolean, designPalette: string) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.tw = tw;
		this.th = th;
		this.tiles = tiles;
		this.hiColor = hiColor;
		this.designPalette = designPalette;
	}

	offset(x: number, y: number, w: number, h: number): VdpSprite {
		this.x += x;
		this.y += y;
		this.w = w;
		this.h = h;
		return this;
	}

	/**
	 * Modifies this instance of VdpSprite (not the original) to target a given tile in a tileset.
	 * @throws {Error} if this sprite is not a tileset.
	 * @param no tile number to target.
	 * @returns {VdpSprite} this
	 */
	tile(no: number): VdpSprite {
		no = Math.floor(no);
		const columnsPerRow = Math.floor(this.w / this.tw);
		if (this.w / this.tw !== columnsPerRow) {
			throw new Error(`Not a tileset (w=${this.w}, h=${this.h}, tw=${this.tw})`)
		}

		const col = no % columnsPerRow;
		const row = Math.floor(no / columnsPerRow);
		return this.offset(col * this.tw, row * this.th, this.tw, this.th);
	}
}

/**
 * Used to represent data read from (or written to) memory.
 *
 * In the VDP16, memory is always addressed in 2D. It has the advantage of being easier to represent for users and be
 * much more flexible. However, underlying memory is still exposed as a one-dimensional array in the end, containing
 * [height] lines of [width] integers, each of which represents a pixel, a map element or a palette color. Therefore,
 * accessing to the buffer element (x, y) is done as such: <result>.array[x + y * width]. Since it's heavily used all
 * around, we created this class to wrap up the data array and the width of each column.
 *
 * For reference, sprites use 8 bit data (Uint8Array), each element being one or two pixels depending on the hi-color
 * mode. Map elements use 16 bit data (Uint16Array), each element being a map element. Palettes use 32 bit data
 * (Uint32Array), each element representing a color in RGBA format (write 0xaabbggrr with r=8 red bits, g=green, b=blue
 * and a=alpha, ignored unless you use the alpha-based blending modes).
 */
export class Array2D {
	/** @property array View as an array, where you can for example do array.forEach((value, index) => { ... }). */
	public array: Uint8Array|Uint16Array|Uint32Array;
	width: number;
	height: number;

	constructor(buffer: Uint8Array|Uint16Array|Uint32Array, width: number, height: number) {
		this.array = buffer;
		this.width = width;
		this.height = height;
	}

	getElement(x: number, y: number): number {
		return this.array[this.width * Math.floor(y) + Math.floor(x)];
	}

	setElement(x: number, y: number, value: number) {
		this.array[this.width * Math.floor(y) + Math.floor(x)] = value;
	}
}

/**
 * Fills the memory with a given value.
 */
// export function memset(buffer: Uint8Array|Uint16Array|Uint32Array|Uint8ClampedArray|Float32Array, value: number, numEntries: number) {
// 	buffer.fill(value, 0, numEntries);
// }
//
// export function memcpy(dst: Uint8Array|Uint16Array|Uint32Array|Uint8ClampedArray|Float32Array, src: Uint8Array|Uint16Array|Uint32Array|Uint8ClampedArray|Float32Array) {
// 	dst.set(src);
// }
