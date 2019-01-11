import {startGame, VDPCopySource, color32} from "./lib-main";

let loopIt = 0;

function fadeNaiveBlack(colorsSource, colorsDest) {
	// Naive just multiplies colors by a factor. It doesn't work very well because colors will not change regularly
	// because of the limited resolution. For example, r=0, g=0, b=2 will change only two times at big intervals, where
	// r=15, g=15, b=15 will change every time. Because of that, the first color will appear noticably blocky.
	const factor = Math.max(0, 1 - 0.01 * loopIt);
	const mulColor = color32.makeFactor(factor, factor, factor);
	colorsSource.forEach((c, ind) => {
		colorsDest[ind] = color32.mul(c, mulColor);
	});
}

function fadeNaiveWhite(colorsSource, colorsDest) {
	const factor = Math.min(1, 0.01 * loopIt);
	const white = color32.make('#fff');
	colorsSource.forEach((c, ind) => {
		colorsDest[ind] = color32.blend(c, white, factor);
	});
}

function fadeToBlackGameBoyColor(colors) {
	if (loopIt % 3 === 0) {
		const component = (loopIt / 3) % 3;
		colors.forEach((c, ind) => {
			let {r, g, b, a} = color32.extract(c);
			if (component === 0) r = Math.max(0, r - 16);
			if (component === 1) g = Math.max(0, g - 16);
			if (component === 2) b = Math.max(0, b - 16);
			colors[ind] = color32.make(r, g, b, a);
		});
	}
}

function fadeToWhiteGameBoyColor(colors) {
	// A good transition has to make a visible change at a regular interval, else you get the effect shown in fadeNaiveBlack.
	// Color resolution is by 16 units (smaller units won't make a change to the screen). Because of that we operate only
	// every 3 iterations (else the fade would be too fast); loopIt incremented in main loop.
	if (loopIt % 3 === 0) {
		const component = (loopIt / 3) % 3;
		colors.forEach((c, ind) => {
			let {r, g, b, a} = color32.extract(c);
			if (component === 0) r = Math.min(255, r + 16);
			if (component === 1) g = Math.min(255, g + 16);
			if (component === 2) b = Math.min(255, b + 16);
			colors[ind] = color32.make(r, g, b, a);
		});
	}
}

function fadeToBlackSega(colors) {
	// As said above, to appear regular, a transition needs to make a visible change to the screen every time. However,
	// with the method above, some colors such as plain red will still only move every 3 iterations, because there's no
	// green or blue to subtract when it's their turn, and thus appear more blocky.
	// Sega went further with that approach by subtracting one of each sub-components (RGB) every frame until the color
	// is black, priorizing red, then green then blue (as blue is subtracted last, the screen tends to become blueish).
	// Taking the example of the red above, it would fade quickly to black, because one unit would be subtracted from it
	// every time, and there's only red to subtract, but during the time of its transition, it fades continuously, which
	// makes a much smoother effect.
	if (loopIt % 3 === 0) {
		colors.forEach((c, ind) => {
			let {r, g, b, a} = color32.extract(c);
			if (r > 0) r = Math.max(0, r - 16);
			else if (g > 0) g = Math.max(0, g - 16);
			else if (b > 0) b = Math.max(0, b - 16);
			colors[ind] = color32.make(r, g, b, a);
		});
	}
}

function fadeToWhiteSega(colors) {
	if (loopIt % 3 === 0) {
		colors.forEach((c, ind) => {
			let {r, g, b, a} = color32.extract(c);
			if (r < 255) r = Math.min(255, r + 16);
			else if (g < 255) g = Math.min(255, g + 16);
			else if (b < 255) b = Math.min(255, b + 16);
			colors[ind] = color32.make(r, g, b, a);
		});
	}
}

function resetPatrickBoyFade(vdp) {
	vdp.configFade('#000', 0);
}

function fadeToWhiteVDP(vdp) {
	// VDP supports fading methods. They provide a better precision than modifying palettes, but the resolution remains
	// 1/16th (where Sega's fade can do up to 47 steps in the case of white color).
	vdp.configFade('#fff', loopIt * 2);
}

function fadeToGrayVDP(vdp) {
	vdp.configFade('#888', loopIt * 2);
}

function fadeToBlackVDP(vdp) {
	vdp.configFade('#000', loopIt * 2);
}

function fadeByDesaturating(colorsSource, colorsDest) {
	const factor = Math.max(0, 1 - 0.01 * loopIt);
	colorsSource.forEach((c, ind) => {
		const {h, s, l} = color32.toHsl(c);
		colorsDest[ind] = color32.makeFromHsl({h, s: s * factor, l});
	});
}

const TextLayer = {
	setup: function(vdp) {
		this.vdp = vdp;
		this.tileset = vdp.sprite('text');
		this.mapWidth = vdp.map('text').w;
		this.map = vdp.readMap('text', VDPCopySource.blank);
	},
	getCharTile: function(c) {
		if (c >= '0'.charCodeAt(0) && c <= '9'.charCodeAt(0)) return 1 + c - '0'.charCodeAt(0);
		if (c >= 'a'.charCodeAt(0) && c <= 'z'.charCodeAt(0)) return 17 + c - 'a'.charCodeAt(0);
		if (c >= 'A'.charCodeAt(0) && c <= 'Z'.charCodeAt(0)) return 17 + c - 'A'.charCodeAt(0);
		if (c === ':'.charCodeAt(0)) return 11;
		if (c === '-'.charCodeAt(0)) return 14;
		if (c === ' '.charCodeAt(0)) return 0;
		if (c === '©'.charCodeAt(0)) return 16;
		if (c === '®'.charCodeAt(0)) return 46;
		// ? for all other chars
		return 15;
	},
	drawText: function (x, y, text) {
		for (let i = 0; i < text.length; i++) {
			this.map.setElement(x + i, y, this.getCharTile(text.charCodeAt(i)));
		}
	},
	drawLayer: function(opacity) {
		this.vdp.writeMap('text', this.map);
		this.vdp.configBGTransparency({ op: 'add', blendDst: '#fff', blendSrc: color32.make(opacity, opacity, opacity) });
		this.vdp.drawBG('text', { transparent: true });
	}
};

/**
 * @param vdp {VDP}
 */
function *main(vdp) {
	let fadeType = 0;
	const palette1Original = vdp.readPalette('level1', VDPCopySource.rom);
	const FADE_LIST = [
		{ text: 'Naive black', fn: (colors, vdp) => fadeNaiveBlack(palette1Original.buffer, colors) },
		{ text: 'Naive white', fn: (colors, vdp) => fadeNaiveWhite(palette1Original.buffer, colors) },
		{ text: 'Game Boy Color black', fn: (colors, vdp) => fadeToBlackGameBoyColor(colors) },
		{ text: 'Game Boy Color white', fn: (colors, vdp) => fadeToWhiteGameBoyColor(colors) },
		{ text: 'Sega black', fn: (colors, vdp) => fadeToBlackSega(colors) },
		{ text: 'Sega white', fn: (colors, vdp) => fadeToWhiteSega(colors) },
		{ text: 'Desaturate', fn: (colors, vdp) => fadeByDesaturating(palette1Original.buffer, colors) },
		{ text: 'VDP white', fn: (colors, vdp) => fadeToWhiteVDP(vdp) },
		{ text: 'VDP gray', fn: (colors, vdp) => fadeToGrayVDP(vdp) },
		{ text: 'VDP black', fn: (colors, vdp) => fadeToBlackVDP(vdp) },
	];

	while (true) {
		let loop = 0;

		// Restore colors
		vdp.writePalette('level1', palette1Original);
		resetPatrickBoyFade(vdp);

		TextLayer.setup(vdp);
		TextLayer.drawText(11, 14, 'FADE DEMO');
		TextLayer.drawText(16 - Math.ceil(FADE_LIST[fadeType].text.length / 2), 16, FADE_LIST[fadeType].text);
		loopIt = 0;

		while (loop < 300) {
			if (loop >= 100) {
				const colors = vdp.readPalette('level1');
				FADE_LIST[fadeType].fn(colors.buffer, vdp);
				vdp.writePalette('level1', colors);
				loopIt++;
			}

			vdp.drawBG('level1');
			// Fade out the layer (255 from loop=0 to 80, then 255..0 until 100)
			TextLayer.drawLayer(Math.floor(Math.max(0, Math.min(255, 1275 - loop * 12.75))));
			loop += 1;
			yield 0;
		}

		fadeType = (fadeType + 1) % FADE_LIST.length;
	}
}

startGame("#glCanvas", vdp => main(vdp));
