
export let SCREEN_WIDTH, SCREEN_HEIGHT;
export const OTHER_TEX_W = 2048, OTHER_TEX_H = 16;
export const MAP_TEX_W = 1024, MAP_TEX_H = 1024;
export const SPRITE_TEX_W = 1024, SPRITE_TEX_H = 1024;
export let PALETTE_TEX_W, PALETTE_TEX_H = 256;
export let HICOLOR_MODE = false;
export let SEMITRANSPARENT_CANVAS = false;

export function setParams(screenWidth, screenHeight, hiColor = false, compositedFramebuffer = false) {
	SCREEN_WIDTH = screenWidth;
	SCREEN_HEIGHT = screenHeight;
	PALETTE_TEX_W = hiColor ? 256 : 16;
	HICOLOR_MODE = hiColor;
	SEMITRANSPARENT_CANVAS = compositedFramebuffer;
}

export function declareReadTexel() {
	// Returns a value between 0 and 1, ready to map a color in palette (0..255)
	if (HICOLOR_MODE) {
		const paletteMultiplier = `float(${(255.0 / 256.0) * (256 / PALETTE_TEX_W)})`;
		return `
				float readTexel(float x, float y) {
					int texelId = int(x / 4.0);
					vec4 read = texture2D(uSamplerSprites, vec2(float(texelId) / ${SPRITE_TEX_W}.0, y / ${SPRITE_TEX_H}.0));
					int texelC = int(x) - texelId * 4;
					if (texelC == 0) return read.r * ${paletteMultiplier};
					if (texelC == 1) return read.g * ${paletteMultiplier};
					if (texelC == 2) return read.b * ${paletteMultiplier};
					return read.a * ${paletteMultiplier};
				}`;
	}
	else {
		const paletteMultiplier = `float(${16.0 / PALETTE_TEX_W / 16.0})`;
		const byteMultiplier = '255.0';
		return `
				float extractTexelHi(float colorComp) {
					int intValue = int(colorComp * ${byteMultiplier});
					return float(intValue / 16) * ${paletteMultiplier};
				}

				float extractTexelLo(float colorComp) {
					int intValue = int(colorComp * ${byteMultiplier});
					return float(intValue - (intValue / 16) * 16) * ${paletteMultiplier};
					//return float(mod(float(intValue), 16.0)) * ${paletteMultiplier};
				}
		
				float readTexel(float x, float y) {
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
					//return 9.0 * ${paletteMultiplier};
				}`;
	}
}

export function declareReadPalette() {
	return `vec4 readPalette(float x, float y) {
				return texture2D(uSamplerPalettes, vec2(x, y));
			}`;
}
