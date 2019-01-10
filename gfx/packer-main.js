const { addColors, blank, config, image,	map,	multiPalette,	palette,	sprite,	tileset,	tiledMap, paletteNamed } = require('../tools/gfxConverter/dsl');

const SCREEN_WIDTH = 256, SCREEN_HEIGHT = 256;

config({ compact: true, debug: true, hiColorMode: false }, () => {
	palette('Default', () => {
		sprite('gradient', 'gfx/gradient.png');
	});

	palette('Mario', () => {
		tileset('mario', image('gfx/mario-luigi-2.png').rect(80, 32, 224, 16), 16, 16);
	});

	palette('level1', () => {
		addColors('gfx/mario-1-1-pal.png');
		tiledMap('level1', 'gfx/mario-1-1', { tileWidth: 8, tileHeight: 8, tilesetWidth: 32, tilesetHeight: 32 });
	});

	multiPalette('tmx', image('gfx/testTmx-pal.png'), () => {
		tiledMap('tmx', 'gfx/testTmx', { tileWidth: 8, tileHeight: 8, tilesetWidth: 64, tilesetHeight: 32 });
	});

	palette('text', () => {
		tileset('text', 'gfx/font.png', 8, 8, () => {
			map('text', blank(SCREEN_WIDTH / 8, SCREEN_HEIGHT / 8));
		});
	});

	palette('road', () => {
		tiledMap('road', 'gfx/road', { tolerance: 200, tileWidth: 16, tileHeight: 16, tilesetWidth: 64, tilesetHeight: 16 });
	});

	palette('level2', () => {
		tiledMap('level2', 'gfx/level2', { tileWidth: 16, tileHeight: 16, tilesetWidth: 32, tilesetHeight: 32 });
	});

	palette('sonic1-bg', () => {
		tiledMap('sonic1-bg', 'gfx/sonic1-bg', { tileWidth: 8, tileHeight: 8, tilesetWidth: 64, tilesetHeight: 32 }, map => {
			// Make the bottom use another palette, which we'll make rotate
			for (let i = 112/8; i < map.height; i++)
				for (let x = 0; x < map.width; x++)
					map.setTile(x, i, map.getTile(x, i) | 1 << 12);
		});
	});

	// Copy of the previous palette
	palette('sonic1-bg-rotating', () => {
		addColors(paletteNamed['sonic1-bg'].colorRows[0].slice(1));
	});

	palette('mask-bg', () => {
		// TODO Florian -- why doesn't it work with 8x1?
		tileset('mask-bg', blank(1, 1), 8, 8, () => {
			map('mask-bg', 'gfx/mask-bg.png', m => {
				console.log(`TEMP `, JSON.stringify(m.tileset));
			});
		});
	});
});
