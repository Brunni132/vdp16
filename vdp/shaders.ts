export let SCREEN_WIDTH, SCREEN_HEIGHT;
export let MAP_TEX_W = 1024, MAP_TEX_H = 1024;
export let SPRITE_TEX_W = 1024, SPRITE_TEX_H = 1024;
export let PALETTE_TEX_W, PALETTE_TEX_H = 256;
export let SEMITRANSPARENT_CANVAS = false;

export const OTHER_TEX_W = 2048, OTHER_TEX_H = 16;
// The last 4 entries are reserved for color swap tables
export const OTHER_TEX_COLORSWAP_INDEX = 12;

// Used for limited machine
export const USE_PRIORITIES = true;
// True on limited machine, false otherwise
export const DISCARD_ALPHA = true;

export const PALETTE_HICOLOR_FLAG = 1 << 15;

export const envColor: number[] = [1, 1, 1, 1];
export const colorSwaps: number[] = [-1, -1, -1, -1];

export function setParams(screenWidth: number, screenHeight: number, compositedFramebuffer: boolean = false) {
	SCREEN_WIDTH = screenWidth;
	SCREEN_HEIGHT = screenHeight;
	SEMITRANSPARENT_CANVAS = compositedFramebuffer;
}

export function setPaletteTextureSize(width: number, height: number) {
	PALETTE_TEX_W = width;
	PALETTE_TEX_H = height;
}

export function setSpriteTextureSize(width: number, height: number) {
	SPRITE_TEX_W = width;
	SPRITE_TEX_H = height;
}

export function setMapTextureSize(width: number, height: number) {
	MAP_TEX_W = width;
	MAP_TEX_H = height;
}

export function declareReadTexel(): string {
	const paletteMultiplier8 = `float(${(255.0 / 256.0) * (256 / PALETTE_TEX_W)})`;
	const paletteMultiplier4 = `float(${16.0 / PALETTE_TEX_W / 16.0})`;
	const byteMultiplier = '255.0';
	// Returns a value between 0 and 1, ready to map a color in palette (0..255)
	return `
float readTexel8(float x, float y) {
	int texelId = int(x / 4.0);
	vec4 read = texture2D(uSamplerSprites, vec2(float(texelId) / ${SPRITE_TEX_W}.0, y / ${SPRITE_TEX_H}.0));
	int texelC = int(x) - texelId * 4;
	if (texelC == 0) return read.r * ${paletteMultiplier8};
	if (texelC == 1) return read.g * ${paletteMultiplier8};
	if (texelC == 2) return read.b * ${paletteMultiplier8};
	return read.a * ${paletteMultiplier8};
}

float extractTexelHi(float colorComp) {
	int intValue = int(colorComp * ${byteMultiplier});
	return float(intValue / 16) * ${paletteMultiplier4};
}

float extractTexelLo(float colorComp) {
	int intValue = int(colorComp * ${byteMultiplier});
	return float(intValue - (intValue / 16) * 16) * ${paletteMultiplier4};
	//return float(mod(float(intValue), 16.0)) * ${paletteMultiplier4};
}

float readTexel4(float x, float y) {
	int texelId = int(x / 8.0);
	vec4 read = texture2D(uSamplerSprites, vec2(float(texelId) / ${SPRITE_TEX_W}.0, y / ${SPRITE_TEX_H}.0));
	int texelC = int(x) - texelId * 8;
	
	if (texelC == 0) return extractTexelHi(read.r);
	if (texelC == 1) return extractTexelLo(read.r);
	if (texelC == 2) return extractTexelHi(read.g);
	if (texelC == 3) return extractTexelLo(read.g);
	if (texelC == 4) return extractTexelHi(read.b);
	if (texelC == 5) return extractTexelLo(read.b);
	if (texelC == 6) return extractTexelHi(read.a);
	return extractTexelLo(read.a);
	//return 9.0 * ${paletteMultiplier4};
}`;
}

export function declareReadPalette(allowDiscard = true): string {
	// Can be reused, works and is checked to be 100% equivalent to having a RGBA4444 texture. But beware that makeOutputColor takes in account the envColor but doesn't posterize it, so you may want to move that
	// return `vec4 readPalette(float x, float y) {
	// 			vec4 data = texture2D(uSamplerPalettes, vec2(x, y));
	// 			// Checked: same render as pre-posterization
	// 			return floor(data * 16.0) / 15.0;
	// 		}`;

	// Can be used to make more intense colors
	//return `vec4 readPalette(float x, float y) {
	//			vec3 color = texture2D(uSamplerPalettes, vec2(x, y)).rgb;
	//			//vec3 gray = vec3(dot(vec3(0.2126,0.7152,0.0722), color));
	//			vec3 gray = vec3(dot(vec3(0.3,0.5,0.2), color));
	//			return vec4(mix(color, gray, -0.5), 1);
	//		}`;

	// Simplest shader, fast, doesn't support color swap
	// return `vec4 readPalette(float x, float y) {
	// 			return texture2D(uSamplerPalettes, vec2(x, y));
	// 		}`;

	return `vec4 readColorSwapBuffer(int bufferNo, float horizOffset) {
	vec4 read = texture2D(uSamplerOthers, vec2((${SCREEN_HEIGHT}.0 - horizOffset) / ${OTHER_TEX_W}.0, float(bufferNo) / ${OTHER_TEX_H}.0));
	return vec4(read.xyz, 1.0);
}

vec4 readPalette(highp float x, highp float y) {
	highp float index = x * ${PALETTE_TEX_W}.0 + (y * ${PALETTE_TEX_H}.0) * 256.0;
	${allowDiscard ? `if (x < ${1.0 / (PALETTE_TEX_W)}) discard;` : ''}
	if (index == uColorSwaps[0]) return readColorSwapBuffer(${OTHER_TEX_COLORSWAP_INDEX}, gl_FragCoord.y);
	if (index == uColorSwaps[1]) return readColorSwapBuffer(${OTHER_TEX_COLORSWAP_INDEX+1}, gl_FragCoord.y);
	if (index == uColorSwaps[2]) return readColorSwapBuffer(${OTHER_TEX_COLORSWAP_INDEX+2}, gl_FragCoord.y);
	if (index == uColorSwaps[3]) return readColorSwapBuffer(${OTHER_TEX_COLORSWAP_INDEX+3}, gl_FragCoord.y);
	return texture2D(uSamplerPalettes, vec2(x, y));
}`;
}

export function makeOutputColor(colorExpr: string): string {
	if (DISCARD_ALPHA) {
		return `vec4((${colorExpr}).rgb * uEnvColor.rgb, 1)`;
	}
	return `${colorExpr} * uEnvColor`;
}
