import { makeRangeArray } from './utils';
import { colorSwaps, OTHER_TEX_W, SCREEN_HEIGHT, SCREEN_WIDTH } from './shaders';
import { DEBUG, OBJ_CELL_SIZE, VDP } from './vdp';
import {
	colorLut,
	drawTransparentPixel,
	transparencyDstB,
	transparencyDstG,
	transparencyDstR,
	transparencyEnable,
	transparencyOperatorMinus, transparencySrcB, transparencySrcG,
	transparencySrcR
} from './softwareRenderer';

export interface ObjBufferEntry {
	xStart: number;
	yStart: number;
	xEnd: number;
	yEnd: number;
	uStart: number;
	vStart: number;
	uEnd: number;
	vEnd: number;
	palNo: number;
	z: number;
}

export class ObjBuffer {
	name: string;
	entries: ObjBufferEntry[];
	firstEntry: number;

	/**
	 * @param name {string} for debugging
	 * @param numVertices {number}
	 */
	constructor(name, numVertices) {
		this.name = name;
		this.entries = new Array(numVertices);
		this.firstEntry = numVertices;
	}

	addEntry(entry: ObjBufferEntry) {
		if (this.firstEntry === 0) {
			if (DEBUG) console.log(`${this.name} overuse (max ${this.usedSprites}), ignoring drawObject`);
			return;
		}
		this.entries[--this.firstEntry] = entry;
	}

	/**
	 * @returns {number} the z component of an object at the index-th position
	 * @param index {number} index in the array (not based on the firstEntry)
	 */
	getZOfObject(index: number): number {
		return this.entries[index].z;
	}

	reset() {
		this.firstEntry = this.entries.length;
	}

	sort(splitAtZ: number): number {
		const items = makeRangeArray(this.firstEntry, this.usedSprites);
		// if (frontToBack) {
			// First vertice, z component (3rd)
			// items.sort((a, b) => this.getZOfObject(b) - this.getZOfObject(a));
		items.sort((a, b) => this.getZOfObject(b) - this.getZOfObject(a));
		// } else {
		// 	items.sort((a, b) => this.getZOfObject(a) - this.getZOfObject(b));
		// }

		let hasSplitAt = items.length;
		for (let i = 0; i < items.length; i++) {
			// Return the first sprite number that is behind the Z asked
			if (this.getZOfObject(items[i]) <= splitAtZ) {
				hasSplitAt = i;
				break;
			}
		}

		const newEntries = new Array(this.entries.length);
		const firstSprite = this.firstEntry;

		for (let i = 0; i < items.length; i++) {
			newEntries[i + firstSprite] = this.entries[items[i]];
		}

		this.entries = newEntries;
		return hasSplitAt;
	}

	get usedSprites(): number {
		return this.entries.length - this.firstEntry;
	}
}

/**
 * Compute the number of cells that an object located at (x0, y0) filling the screen until (x1, y1) takes.
 * @param {number} x0
 * @param {number} y0
 * @param {number} x1
 * @param {number} y1
 * @param {boolean} computeCells
 * @returns {number} the number of cells (e.g. 1 for a 16x16 square, 2 for a 17x16, etc.)
 */
export function computeObjectPixels(x0: number, y0: number, x1: number, y1: number, computeCells = false): number {
	x0 = Math.max(0, Math.min(SCREEN_WIDTH, x0));
	x1 = Math.max(0, Math.min(SCREEN_WIDTH, x1));
	y0 = Math.max(0, Math.min(SCREEN_WIDTH, y0));
	y1 = Math.max(0, Math.min(SCREEN_WIDTH, y1));
	if (x0 > x1) [x1, x0] = [x0, x1];
	if (y0 > y1) [y1, y0] = [y0, y1];
	if (computeCells) return Math.ceil((x1 - x0) / OBJ_CELL_SIZE) * Math.ceil((y1 - y0) / OBJ_CELL_SIZE);
	return (x1 - x0) * (y1 - y0);
}

/**
 * @param vdp {VDP}
 * @param objBuffer {ObjBuffer}
 * @param first {number} the index of the first sprite to draw. Pass 0 if you want to draw the full buffer.
 * @param last {number} the index of the last sprite to draw (exclusive). Pass objBuffer.usedSprites to draw them all.
 */
export function drawPendingObj(vdp: VDP, objBuffer: ObjBuffer, first: number, last: number) {
	if (last <= first) return;

	const color8 = vdp._screenBuffer.color8;
	const color32 = vdp._screenBuffer.color32;
	const depth = vdp._screenBuffer.depth;
	const paletteTex = vdp._shadowPaletteTex.buffer;
	const paletteWidth = vdp._shadowPaletteTex.widthInPixels;
	const spriteTex = vdp._shadowSpriteTex.buffer;
	const spriteWidth = vdp._shadowSpriteTex.widthInPixels;

	for (let e = first; e < last; e++) {
		const entry = objBuffer.entries[objBuffer.firstEntry + e];
		const uScale = (entry.uEnd - entry.uStart) / (entry.xEnd - entry.xStart);
		const vScale = (entry.vEnd - entry.vStart) / (entry.yEnd - entry.yStart);
		const paletteBaseAddr = entry.palNo * paletteWidth;
		const z = entry.z;
		const customColorLut = colorLut[entry.palNo];
		let v = entry.vStart;

		for (let j = entry.yStart; j < entry.yEnd; j++, v += vScale) {
			if (j < 0 || j >= SCREEN_HEIGHT) continue;  // TODO Florian -- optimize
			let u = entry.uStart;
			const spriteBaseAddr = Math.floor(v) * spriteWidth;
			let outPixel = j * SCREEN_WIDTH + entry.xStart;
			for (let i = entry.xStart; i < entry.xEnd; i++, outPixel++, u += uScale) {
				if (i < 0 || i >= SCREEN_WIDTH || depth[outPixel] >= z) continue;
				// Extract 4 bits from sprite texture
				let spritePix = spriteTex[spriteBaseAddr + (u >>> 1)];
				if (u & 1) spritePix &= 0x0f;
				else       spritePix >>>= 4;
				if (spritePix !== 0) {
					let color = paletteTex[paletteBaseAddr + spritePix];
					if (customColorLut) color = customColorLut(j, spritePix, color);
					// << 2 == *4 (RGBA bytes)
					if (transparencyEnable) drawTransparentPixel(color8, outPixel << 2, color);
					else color32[outPixel] = color;
					depth[outPixel] = z;
				}
			}
		}
	}
}

export function enqueueObj(objBuffer: ObjBuffer, xStart: number, yStart: number, xEnd: number, yEnd: number, uStart: number, vStart: number, uEnd: number, vEnd: number, palNo: number, hiColor: boolean, z = 0, flipH = false, flipV = false) {

	// hiColor ignored for now
	if (flipH) [uStart, uEnd] = [uEnd, uStart];
	if (flipV) [vStart, vEnd] = [vEnd, vStart];

	objBuffer.addEntry({
		xStart: Math.floor(xStart),
		yStart: Math.floor(yStart),
		xEnd: Math.floor(xEnd),
		yEnd: Math.floor(yEnd),
		uStart: Math.floor(uStart),
		vStart: Math.floor(vStart),
		uEnd: Math.floor(uEnd),
		vEnd: Math.floor(vEnd),
		palNo: Math.floor(palNo),
		z: Math.floor(z)
	});
}

export function makeObjBuffer(name: string, numSprites: number): ObjBuffer {
	return new ObjBuffer(name, numSprites);
}
