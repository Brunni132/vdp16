const { addColors, blank, config, image,	map,	multiPalette,	palette,	sprite,	tileset,	tiledMap } = require('../tools/gfxConverter/dsl');

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
		tileset('level1-til', blank(32, 32), 8, 8, () => {
			map('level1', 'gfx/mario-1-1.png');
		});
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
});
