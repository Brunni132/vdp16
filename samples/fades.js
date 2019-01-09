import {color32} from "./vdp/color32";
import {VDPCopySource} from "./vdp/vdp";
import {startGame} from "./lib-main";

let fadeFactor = 0;
let loopIt = 0;

function fadeToWhiteGameBoyColor(colors) {
	colors.forEach((c, ind) => {
		let { r, g, b, a } = color32.extract(c);
		if (loopIt === 0) r = Math.min(255, r + 16);
		if (loopIt === 1) g = Math.min(255, g + 16);
		if (loopIt === 2) b = Math.min(255, b + 16);
		colors[ind] = color32.make(r, g, b, a);
	});
	loopIt++;
}

function fadeToBlackGameBoyColor(colors) {
	colors.forEach((c, ind) => {
		let { r, g, b, a } = color32.extract(c);
		if (loopIt === 0) r = Math.max(0, r - 16);
		if (loopIt === 1) g = Math.max(0, g - 16);
		if (loopIt === 2) b = Math.max(0, b - 16);
		colors[ind] = color32.make(r, g, b, a);
	});
	loopIt++;
}

function fadeToBlackSega(colors) {
	colors.forEach((c, ind) => {
		let { r, g, b, a } = color32.extract(c);
		if (r > 0) r = Math.max(0, r - 16);
		else if (g > 0) g = Math.max(0, g - 16);
		else if (b > 0) b = Math.max(0, b - 16);
		colors[ind] = color32.make(r, g, b, a);
	});
}

function fadeToWhiteSega(colors) {
	colors.forEach((c, ind) => {
		let { r, g, b, a } = color32.extract(c);
		if (r < 255) r = Math.min(255, r + 16);
		else if (g < 255) g = Math.min(255, g + 16);
		else if (b < 255) b = Math.min(255, b + 16);
		colors[ind] = color32.make(r, g, b, a);
	});
}

function resetPatrickBoyFade(vdp) {
	fadeFactor = 0;
	vdp.configFade('#000', 0);
}

function fadeToWhiteVDP(vdp) {
	vdp.configFade('#fff', fadeFactor);
	fadeFactor += 6;
}

function fadeToGrayVDP(vdp) {
	vdp.configFade('#888', fadeFactor);
	fadeFactor += 6;
}

function fadeToBlackVDP(vdp) {
	vdp.configFade('#000', fadeFactor);
	fadeFactor += 6;
}

const TextLayer = {
	setup: function(vdp) {
		this.vdp = vdp;
		this.tileset = vdp.sprite('text');
		this.mapWidth = vdp.map('text').w;
		this.map = vdp.readMap('text', VDPCopySource.blank);
	},
	clear: function() {
		this.map.buffer.fill(0);
		this.vdp.writeMap('text', this.map);
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
	const FADE_SPEED = 3;
	let fadeType = 0;
	const FADE_LIST = [
		{ text: 'Game Boy Color white', fn: (colors, vdp) => fadeToWhiteGameBoyColor(colors) },
		{ text: 'Common black', fn: (colors, vdp) => fadeToBlackGameBoyColor(colors) },
		{ text: 'Sega black', fn: (colors, vdp) => fadeToBlackSega(colors) },
		{ text: 'Sonic white', fn: (colors, vdp) => fadeToWhiteSega(colors) },
		{ text: 'VDP white', fn: (colors, vdp) => fadeToWhiteVDP(vdp) },
		{ text: 'VDP gray', fn: (colors, vdp) => fadeToGrayVDP(vdp) },
		{ text: 'VDP black', fn: (colors, vdp) => fadeToBlackVDP(vdp) },
	];

	while (true) {
		let loop = 0;

		// Copy the original palette back
		vdp.writePalette('level1', vdp.readPalette('level1', VDPCopySource.rom));
		resetPatrickBoyFade(vdp);

		TextLayer.setup(vdp);
		TextLayer.drawText(11, 14, 'FADE DEMO');
		TextLayer.drawText(16 - Math.ceil(FADE_LIST[fadeType].text.length / 2), 16, FADE_LIST[fadeType].text);

		while (loop < 300) {
			if (loop >= 100 && loop % FADE_SPEED === 0) {
				const colors = vdp.readPalette('level1');
				FADE_LIST[fadeType].fn(colors.buffer, vdp);
				vdp.writePalette('level1', colors);
				loopIt = (loopIt + 1) % 3;
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
