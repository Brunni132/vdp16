const assert = require('assert');
const { Map, Tile, Tileset } = require('./maps');
const { Sprite } = require('./sprite');
const Texture = require('./texture');
const { MasterPack } = require("./masterpack");

// System-only
const DEBUG = true;

function checkConv() {
	assert(conv, 'config({ compact: true, quantizeColors: true, hiColorMode: false }); should come first in your program');
}

// User accessible
let conv = null;
let currentPalette = null;
let currentTileset = null;
const paletteNamed = {};
const spriteNamed = {};
const tilesetNamed = {};
const mapNamed = {};

function addColors(contents) {
	assert(!!currentPalette, 'addColors must be inside palette');
	if (typeof contents === 'string') contents = image(contents);
	if (Array.isArray(contents)) {
		currentPalette.addColors(contents.map(c => currentPalette.toDesintationFormat(c)));
	}
	else if (contents instanceof Texture) {
		const colors = [];
		contents.forEachPixel((pixel) => {
			pixel = currentPalette.toDesintationFormat(pixel);
			if (colors.indexOf(pixel) === -1) colors.push(pixel);
		});
		currentPalette.addColors(colors);
	}
	else {
		assert(false, `unsupported addColors arg ${contents}`);
	}
}

function blank(...params) {
	return { type: 'blank', params };
}

function config(params) {
	assert(!conv, 'config(…) can only be present once and at the top of the document');
	conv = new MasterPack(params);
}

function image(name) {
	return Texture.fromPng32(name);
}

function palette(name, cb) {
	checkConv();
	assert(!currentPalette, 'nested palettes not supported');
	currentPalette = conv.createPalette(name);
	paletteNamed[name] = currentPalette;
	cb();
	currentPalette = null;
}

function map(name, contents, opts) {
	let result;
	if (DEBUG) console.log(`Processing map ${name}`);
	assert(!!currentPalette, 'cannot define map outside of palette block');
	assert(!!currentTileset, 'cannot define map outside of tileset block');
	if (typeof contents === 'string') contents = image(contents);
	opts = opts || {};
	if (contents.type === 'blank') {
		const { params } = contents;
		assert(params.length === 2, 'Expects 2 params to blank(…) inside map');
		result = Map.blank(name, params[0], params[1], currentTileset);
	}
	else if (contents instanceof Texture) {
		result = Map.fromImage(name, contents, currentTileset, opts.tolerance || 0);
	}
	else {
		assert(false, `unsupported map arg ${contents}`);
	}

	conv.addMap(result);
	mapNamed[name] = result;
}

function sprite(name, contents) {
	let result;
	if (DEBUG) console.log(`Processing sprite ${name}`);
	assert(!!currentPalette, 'cannot define sprite outside of palette block');
	if (typeof contents === 'string') contents = image(contents);
	if (contents.type === 'blank') {
		assert(false, 'blank sprites not supported yet');
	}
	else if (contents instanceof Texture) {
		result = Sprite.fromImage(name, contents, currentPalette);
	}
	else {
		assert(false, `unsupported sprite arg ${contents}`);
	}

	conv.addSprite(result);
	spriteNamed[name] = result;
}

function tileset(name, contents, tileWidth, tileHeight, cb) {
	let result;
	if (DEBUG) console.log(`Processing tileset ${name}`);
	assert(!!currentPalette, 'cannot define tileset outside of palette block');
	if (typeof contents === 'string') contents = image(contents);
	if (contents.type === 'blank') {
		const { params } = contents;
		assert(params.length === 2, 'Expects 2 params to blank(…) inside tileset');
		result = Tileset.blank(name, tileWidth, tileHeight, params[0], params[1], [currentPalette]);
	}
	else if (contents instanceof Texture) {
		result = Tileset.fromImage(name, contents, tileWidth, tileHeight, [currentPalette]);
	}
	else {
		assert(false, `unsupported tileset arg ${contents}`);
	}

	conv.addTileset(result);
	tilesetNamed[name] = result;
	currentTileset = result;
	cb();
	currentTileset = null;
}


// Your program
const SCREEN_WIDTH = 256;
const SCREEN_HEIGHT = 256;

config({ compact: true, quantizeColors: true, hiColorMode: false });

palette('Default', () => {
	sprite('gradient', 'gfx/gradient.png');
});

palette('Mario', () => {
	sprite('mario', image('gfx/mario-luigi-2.png').rect(80, 32, 224, 16));
});

palette('level1', () => {
	addColors('gfx/mario-1-1-pal.png');
	tileset('level1-til', blank(32, 32), 8, 8, () => {
		map('level1', 'gfx/mario-1-1.png');
	});
});

palette('text', () => {
	tileset('text', 'gfx/font.png', 8, 8, () => {
		map('text', blank(SCREEN_WIDTH / 8, SCREEN_HEIGHT / 8));
	});
});

palette('road', () => {
	tileset('road', blank(64, 16), 16, 16, () => {
		map('road', 'gfx/road.png', { tolerance: 200 });
	});
});

conv.pack(false);

