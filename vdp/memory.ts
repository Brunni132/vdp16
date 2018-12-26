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

	offsetted(x: number, y: number, w: number, h: number): VdpMap {
		this.x += x;
		this.y += y;
		this.w = w;
		this.h = h;
		return this;
	}
}

export class VdpPalette {
    y: number; // V position of palette (color units)
    size: number; // count (color units)

	constructor(y: number, size: number) {
		this.y = y;
		this.size = size;
	}

	offsetted(y: number, size: number): VdpPalette {
		this.y += y;
		this.size = size;
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
    hiColor: boolean; // whether it's a 8-bit-per-pixel tile (or 4-bit)
    designPalette: string; // design palette name (can be overriden)

	constructor(x: number, y: number, w: number, h: number, tw: number, th: number, hiColor: boolean, designPalette: string) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.tw = tw;
		this.th = th;
		this.hiColor = hiColor;
		this.designPalette = designPalette;
	}

	offsetted(x: number, y: number, w: number, h: number): VdpSprite {
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
		const columnsPerRow = Math.floor(this.w / this.tw);
		if (this.w / this.tw !== columnsPerRow) {
			throw new Error(`Not a tileset (w=${this.w}, h=${this.h}, tw=${this.tw})`)
		}

		const col = no % columnsPerRow;
		const row = no / columnsPerRow;
		return this.offsetted(col * this.tw, row * this.th, this.tw, this.th);
	}
}

/**
 * Fills the memory with a given value.
 */
export function memset(buffer: Uint8Array|Uint16Array|Uint32Array|Uint8ClampedArray|Float32Array, value: number, numEntries: number) {
	buffer.fill(value, 0, numEntries);
}

export function memcpy(dst: Uint8Array|Uint16Array|Uint32Array|Uint8ClampedArray|Float32Array, src: Uint8Array|Uint16Array|Uint32Array|Uint8ClampedArray|Float32Array) {
	dst.set(src);
}
