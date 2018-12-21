
export let SCREEN_WIDTH, SCREEN_HEIGHT;
export let MAP_TEX_W = 1024, MAP_TEX_H = 1024;
export let SPRITE_TEX_W = 1024, SPRITE_TEX_H = 1024;
export let PALETTE_TEX_W, PALETTE_TEX_H = 256;
export let SEMITRANSPARENT_CANVAS = false;

export const OTHER_TEX_W = 2048, OTHER_TEX_H = 16;

// Used for limited machine
export const USE_PRIORITIES = true;
// 4 on limited machine
export const MAX_BGS = 1;
// True on limited machine, false otherwise
export const DISCARD_ALPHA = true;

export const MAX_SPRITES = 1 << 16;

export const PALETTE_HICOLOR_FLAG = 1 << 15;

// TODO Florian -- refactor, per sprite/map
export const envColor = [1, 1, 1, 1];

export function setParams(screenWidth, screenHeight, compositedFramebuffer = false) {
	SCREEN_WIDTH = screenWidth;
	SCREEN_HEIGHT = screenHeight;
	SEMITRANSPARENT_CANVAS = compositedFramebuffer;
}

export function setTextureSizes(paletteTexW, paletteTexH, mapTexW, mapTexH, spriteTexW, spriteTexH) {
	PALETTE_TEX_H = paletteTexH;
	PALETTE_TEX_W = paletteTexW;
	SPRITE_TEX_W = spriteTexW;
	SPRITE_TEX_H = spriteTexH;
	MAP_TEX_W = mapTexW;
	MAP_TEX_H = mapTexH;
}

export function declareReadTexel() {
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

export function declareReadPalette() {
	// Can be reused, works and is checked to be 100% equivalent to having a RGBA4444 texture. But beware that makeOutputColor takes in account the envColor but doesn't posterize it, so you may want to move that
	// return `vec4 readPalette(float x, float y) {
	// 			vec4 data = texture2D(uSamplerPalettes, vec2(x, y));
	// 			// Checked: same render as pre-posterization
	// 			return floor(data * 16.0) / 15.0;
	// 		}`;
	return `vec4 readPalette(float x, float y) {
				return texture2D(uSamplerPalettes, vec2(x, y));
			}`;
}

export function makeOutputColor(colorExpr) {
	if (DISCARD_ALPHA) {
		return `vec4((${colorExpr}).rgb * uEnvColor.rgb, 1)`;
	}
	return `${colorExpr} * uEnvColor`;
}
