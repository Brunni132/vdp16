import { colorSwaps, OTHER_TEX_W, PALETTE_TEX_H, SCREEN_HEIGHT, SCREEN_WIDTH } from './shaders';
import { mat3 } from 'gl-matrix';
import { TransparencyConfig } from './vdp';
import { color } from './color';

export class ScreenBuffer {
	color: ArrayBuffer;
	color8: Uint8ClampedArray;
	color32: Uint32Array;
	depth: Int8Array;

	constructor(byteLength: number) {
		this.color = new ArrayBuffer(byteLength);
		this.color8 = new Uint8ClampedArray(this.color);
		this.color32 = new Uint32Array(this.color);
		this.depth = new Int8Array(byteLength);
	}
}

let colorBuffer32: Uint32Array;
let colorBuffer8: Uint8ClampedArray;
let depthBuffer: Int8Array;
// palette number -> function (line, index, defColor) => color for color index on that line. May also be null (just use the default color).
export let colorLut;
export let transparencyEnable = false;
export let transparencyOperatorMinus = false;
export let transparencySrcR = 0xff, transparencySrcG = 0xff, transparencySrcB = 0xff;
export let transparencyDstR = 0xff, transparencyDstG = 0xff, transparencyDstB = 0xff;

export function clearScreen(backgroundColor: number, backgroundDepth: number) {
	let outPixel = 0;
	for (let j = 0; j < SCREEN_HEIGHT; j++) {
		for (let i = 0; i < SCREEN_WIDTH; i++) {
			colorBuffer32[outPixel] = backgroundColor;
			depthBuffer[outPixel++] = backgroundDepth;
		}
	}
}

export function createColorDataTexture(width, height): Uint32Array {
	return new Uint32Array(width * height);
}

export function createMat3DataTexture(width, height): Float32Array {
	return new Float32Array(width * height);
}

export function drawTransparentPixel(color8: Uint8ClampedArray, outPixel: number, color: number) {
	if (transparencyOperatorMinus) {
		color8[outPixel] = (color8[outPixel] * transparencyDstR - (color & 0xff) * transparencySrcR) / 255;
		color8[outPixel+1] = (color8[outPixel+1] * transparencyDstG - (color >>> 8 & 0xff) * transparencySrcG) / 255;
		color8[outPixel+2] = (color8[outPixel+2] * transparencyDstB - (color >>> 16 & 0xff) * transparencySrcB) / 255;
	} else {
		color8[outPixel] = (color8[outPixel] * transparencyDstR + (color & 0xff) * transparencySrcR) / 255;
		color8[outPixel+1] = (color8[outPixel+1] * transparencyDstG + (color >>> 8 & 0xff) * transparencySrcG) / 255;
		color8[outPixel+2] = (color8[outPixel+2] * transparencyDstB + (color >>> 16 & 0xff) * transparencySrcB) / 255;
	}
}

export function setRenderingBuffer(screenBuffer: ScreenBuffer) {
	colorBuffer8 = screenBuffer.color8;
	colorBuffer32 = screenBuffer.color32;
	depthBuffer = screenBuffer.depth;
}

export function setTransparency(transparencyConfig: TransparencyConfig) {
	const {effect, blendSrc, blendDst, operation} = transparencyConfig;

	if (effect === 'color') {
		transparencyDstR = blendDst & 0xff;
		transparencyDstG = blendDst >>> 8 & 0xff;
		transparencyDstB = blendDst >>> 16 & 0xff;
		transparencySrcR = blendSrc & 0xff;
		transparencySrcG = blendSrc >>> 8 & 0xff;
		transparencySrcB = blendSrc >>> 16 & 0xff;
		transparencyOperatorMinus = operation === 'sub';
		transparencyEnable = true;
	} else {
		transparencyEnable = false;
	}
}

export function updateColorSwapLut(colorSwapTexture) {
	if (colorSwaps.length !== 4) throw new Error('This code is made only for 4 color swap units');
	colorLut = new Array(PALETTE_TEX_H);
	for (let palNo = 0; palNo < PALETTE_TEX_H; palNo++) {
		if (colorSwaps[0] >>> 8 === palNo || colorSwaps[1] >>> 8 === palNo || colorSwaps[2] >>> 8 === palNo || colorSwaps[3] >>> 8 === palNo) {
			colorLut[palNo] = (line, colorIdx, defColor) => {
				const globalIdx = palNo << 8 | colorIdx;
				if (colorSwaps[0] === globalIdx) return colorSwapTexture[line];
				if (colorSwaps[1] === globalIdx) return colorSwapTexture[line + OTHER_TEX_W];
				if (colorSwaps[2] === globalIdx) return colorSwapTexture[line + OTHER_TEX_W * 2];
				if (colorSwaps[3] === globalIdx) return colorSwapTexture[line + OTHER_TEX_W * 3];
				return defColor;
			}
		}
	}
}

export function writeColorDataTexture(texture: Uint32Array, textureWidth: number, lineNo: number, entries: Uint32Array) {
	texture.set(entries, textureWidth * lineNo);
}

export function writeMat3DataTexture(texture: Float32Array, textureWidth: number, lineNo: number, entries: Float32Array) {
	texture.set(entries, textureWidth * lineNo);
}
