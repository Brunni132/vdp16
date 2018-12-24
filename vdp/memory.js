export class VdpMap {
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

export class VdpPalette {
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

export class VdpSprite {
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

	/**
	 *
	 * @param x {number}
	 * @param y {number}
	 * @param w {number}
	 * @param h {number}
	 * @returns {VdpSprite} this
	 */
	offsetted(x, y, w, h) {
		this.x += x;
		this.y += y;
		this.w = w;
		this.h = h;
		return this;
	}

	/**
	 * Modifies this instance of VdpSprite (not the original) to target a given tile in a tileset.
	 * @throws {Error} if this sprite is not a tileset.
	 * @param no {number} tile number to target.
	 * @returns {VdpSprite} this
	 */
	tile(no) {
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
 * @param buffer {Uint8Array|Uint16Array|Uint32Array|Uint8ClampedArray|Float32Array}
 * @param value {number}
 * @param numEntries {number}
 */
export function memset(buffer, value, numEntries) {
	buffer.fill(value, 0, numEntries);
}

/**
 *
 * @param dst {Uint8Array|Uint16Array|Uint32Array|Uint8ClampedArray|Float32Array}
 * @param src {Uint8Array|Uint16Array|Uint32Array|Uint8ClampedArray|Float32Array}
 */
export function memcpy(dst, src) {
	dst.set(src);
}


// export class VdpMapBuffer {
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
