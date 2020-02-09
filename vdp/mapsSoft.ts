
// const BG_BUFFER_STRIDE = 6;
//

import { DEBUG, VDP } from './vdp';
import { colorSwaps, OTHER_TEX_W, SCREEN_HEIGHT, SCREEN_WIDTH } from './shaders';
import { mat3 } from 'gl-matrix';
import { colorLut, drawTransparentPixel, transparencyEnable } from './softwareRenderer';

export interface MapBufferEntry {
	uMap: number;
	vMap: number;
	uTileset: number;
	vTileset: number;
	mapWidth: number;
	mapHeight: number;
	tilesetWidth: number;
	tileWidth: number;
	tileHeight: number;
	winX: number;
	winY: number;
	winW: number;
	winH: number;
	scrollX: number;
	scrollY: number;
	palNo: number;
	hiColor: boolean;
	linescrollBuffer: number;
	wrap: boolean;
	z: number;
}

/**
 * Need to be drawn from entries[firstEntry] to entries[entries.length - 1]
 */
export class MapBuffer {
	name: string;
	entries: MapBufferEntry[];
	firstEntry: number;

	constructor(name: string, numVertices: number) {
		this.name = name;
		this.entries = new Array(numVertices);
		this.firstEntry = numVertices;
	}

	addEntry(entry: MapBufferEntry) {
		if (this.firstEntry === 0) {
			if (DEBUG) console.log(`${this.name} overuse (max ${this.usedLayers}), ignoring drawBackgroundTilemap`);
			return;
		}
		this.entries[--this.firstEntry] = entry;
	}

	/**
	 * @returns {number} the z component of the BG at the index-th position
	 * @param index {number} index in the existing BGs (based on firstEntry)
	 */
	getZOfBG(index: number): number {
		return this.entries[this.firstEntry + index].z;
	}

	reset() {
		this.firstEntry = this.entries.length;
	}

	get usedLayers(): number {
		return this.entries.length - this.firstEntry;
	}
}

export function transformMat3(x: number, y: number, m: Float32Array) {
	return {
		x: m[0] * x + m[3] * y + m[6],
		y: m[1] * x + m[4] * y + m[7]
	};
}

export function drawPendingMap(vdp: VDP, mapBuffer: MapBuffer) {

	const color8 = vdp._screenBuffer.color8;
	const color32 = vdp._screenBuffer.color32;
	const depth = vdp._screenBuffer.depth;
	const paletteTex = vdp._shadowPaletteTex.buffer;
	const paletteWidth = vdp._shadowPaletteTex.widthInPixels;
	const spriteTex = vdp._shadowSpriteTex.buffer;
	const spriteWidth = vdp._shadowSpriteTex.widthInPixels; // number of 8 bit entries per line (4x RGBA tex width), but we can put two times this amount as each pixel takes 4 bits
	const mapTex = vdp._shadowMapTex.buffer;
	const mapTexWidth = vdp._shadowMapTex.widthInPixels;
	const linescrollTexture = vdp._lineTransformations;
	const paletteLookup = new Array(8);

	for (let m = mapBuffer.firstEntry; m < mapBuffer.entries.length; m++) {
		const entry = mapBuffer.entries[m];
		const { z, wrap, tileWidth, tileHeight, mapWidth, mapHeight, uTileset, vTileset, tilesetWidth, scrollX, scrollY, linescrollBuffer } = entry;
		const basePalNo = entry.palNo;
		const spriteBaseAddr = vTileset * spriteWidth + (uTileset >>> 1);
		const mapBaseAddr = entry.vMap * mapTexWidth + entry.uMap;

		for (let i = 0; i < 8; i++) {
			if (colorSwaps[0] >>> 8 === entry.palNo + i) paletteLookup[i] = colorSwaps[0];
			else if (colorSwaps[1] >>> 8 === entry.palNo + i) paletteLookup[i] = colorSwaps[1];
			else if (colorSwaps[2] >>> 8 === entry.palNo + i) paletteLookup[i] = colorSwaps[2];
			else if (colorSwaps[3] >>> 8 === entry.palNo + i) paletteLookup[i] = colorSwaps[3];
		}

		for (let j = entry.winY; j < entry.winY + entry.winH; j++) {
			if (j < 0 || j >= SCREEN_HEIGHT) continue;  // TODO Florian -- optimize
			const outBase = j * SCREEN_WIDTH;
			let transformBaseX = entry.winX + scrollX, transformBaseY = scrollY + j, transformOffsetX = 1, transformOffsetY = 0;

			if (linescrollBuffer >= 0) {
				// TODO Florian -- factor this OTHER_TEX_W as part of linescrollTexture
				const subarray = linescrollTexture.subarray(linescrollBuffer * OTHER_TEX_W + 8 * j, linescrollBuffer * OTHER_TEX_W + 8 * j + 8);
				const base = transformMat3(transformBaseX, scrollY + j, subarray);
				const next = transformMat3(transformBaseX + 1, scrollY + j, subarray);
				transformBaseX = base.x;
				transformBaseY = base.y;
				transformOffsetX = next.x - base.x;
				transformOffsetY = next.y - base.y;
			}

			for (let i = entry.winX; i < entry.winX + entry.winW; i++, transformBaseX += transformOffsetX, transformBaseY += transformOffsetY) {
				if (i < 0 || i >= SCREEN_WIDTH || depth[outBase + i] >= z) continue;

				let texCoordX = transformBaseX | 0, texCoordY = transformBaseY | 0;
				if (!wrap) {
					if (texCoordX < 0) texCoordX = 0;
					else if (texCoordX >= mapWidth * tileWidth) texCoordX = mapWidth * tileWidth - 1;
					if (texCoordY < 0) texCoordY = 0;
					else if (texCoordY >= mapHeight * tileHeight) texCoordY = mapHeight * tileHeight - 1;
				} else {
					texCoordX %= mapWidth * tileWidth;
					texCoordY %= mapHeight * tileHeight;
					if (texCoordX < 0) texCoordX += mapWidth * tileWidth;
					if (texCoordY < 0) texCoordY += mapHeight * tileHeight;
				}

				// The | 0 is to force an integer division
				let mapX = (texCoordX / tileWidth) | 0, mapY = (texCoordY / tileHeight) | 0;
				let mapTileNo = mapTex[mapBaseAddr + mapY * mapTexWidth + mapX];
				if (mapTileNo >= 65535) continue;

				// Bits 13-15: palette No
				let palNo = (mapTileNo >>> 13 & 0x7);
				mapTileNo &= 0x1fff;

				const rowNo = mapTileNo / tilesetWidth | 0;
				const colNo = mapTileNo % tilesetWidth;
				const spriteX = texCoordX % tileWidth + colNo * tileWidth;
				const spriteY = texCoordY % tileHeight + rowNo * tileHeight;

				// Extract 4 bits from sprite texture
				let spritePix = spriteTex[spriteBaseAddr + spriteY * spriteWidth + (spriteX >>> 1)];
				if (spriteX & 1) spritePix &= 0x0f;
				else             spritePix >>>= 4;
				if (spritePix !== 0) {
					palNo += basePalNo;
					let color = paletteTex[palNo * paletteWidth + spritePix];
					if (colorLut[palNo]) color = colorLut[palNo](j, spritePix, color);
					if (transparencyEnable) drawTransparentPixel(color8, (outBase + i) << 2, color);
					else color32[outBase + i] = color;
					depth[outBase + i] = z;
				}
			}
		}
	}
}

export function enqueueMap(mapBuffer: MapBuffer, uMap: number, vMap: number, uTileset: number, vTileset: number, mapWidth: number, mapHeight: number, tilesetWidth: number, tileWidth: number, tileHeight: number, winX: number, winY: number, winW: number, winH: number, scrollX: number, scrollY: number, palNo: number, hiColor: boolean, linescrollBuffer: number = -1, wrap: boolean = true, z: number = 0) {
	mapBuffer.addEntry({
		uMap,
		vMap,
		uTileset,
		vTileset,
		mapWidth,
		mapHeight,
		tilesetWidth: tilesetWidth / tileWidth | 0,
		tileWidth,
		tileHeight,
		winX,
		winY,
		winW,
		winH,
		scrollX,
		scrollY,
		palNo,
		hiColor,
		linescrollBuffer,
		wrap,
		z,
	});
}

/**
 * @param name {string} for debugging
 * @param numMaps {number} number of maps that may be contained (batched) inside the map buffer.
 * @returns {MapBuffer}
 */
export function makeMapBuffer(name: string, numMaps: number): MapBuffer {
	return new MapBuffer(name, numMaps);
}
