const assert = require('assert');
const { Map, Tile, Tileset } = require('./maps');
const { Sprite } = require('./sprite');
const Texture = require('./texture');
const { MasterPack } = require("./masterpack");

const SCREEN_WIDTH = 256;
const SCREEN_HEIGHT = 256;

const conv = new MasterPack(true, SCREEN_WIDTH, SCREEN_HEIGHT);

const palettes = [
	conv.createPalette('Default'),
	conv.createPalette('Mario'),
	conv.createPalette('Level1'),
	conv.createPalette('text'),
	conv.createPalette('road')
];

conv.addSprite(Sprite.fromImage('gradient',
	Texture.fromPng32('gfx/gradient.png'), palettes[0]));

conv.addSprite(Sprite.fromImage('mario', Texture.fromPng32('gfx/mario-luigi-2.png').subtexture(80, 32, 224, 16), palettes[1]));

const tileset = Tileset.blank('level1-til', 8, 8, 32, 32, [palettes[2]]);
// TODO Florian -- Map conversion should first create an "optimized" tileset in 32-bit, then make a real tileset out of it, then map the tiles to the map with extended palette info
const map = Map.fromImage('level1', Texture.fromPng32('gfx/mario-1-1.png'), tileset);
conv.addTileset(tileset);
conv.addMap(map);

// TODO Florian -- Doesn't work because the tileset always adds a transparent tile… this should be an option of the map?
// TODO Florian -- Refactor to remove Sprite and use Tileset only
const textTileset = Tileset.fromImage('text', Texture.fromPng32('gfx/font.png'), 8, 8, [palettes[3]]);
conv.addTileset(textTileset);
conv.addMap(Map.blank('text', SCREEN_WIDTH / 8, SCREEN_HEIGHT / 8, textTileset));

// TODO Florian -- Way to auto-generate a tileset
const roadTileset = Tileset.blank('road', 8, 8, 128, 8, [palettes[4]]);
const roadMap = Map.fromImage('road', Texture.fromPng32('gfx/road.png'), roadTileset, 45);
conv.addTileset(roadTileset);
conv.addMap(roadMap);

conv.pack(true);
