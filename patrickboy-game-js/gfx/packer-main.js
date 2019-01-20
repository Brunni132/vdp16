const { addColors, blank, config, image,	map,	multiPalette,	palette,	sprite,	tileset,	tiledMap, paletteNamed } = require('../tools/gfxConverter/dsl');



config({ compact: true, debug: true }, () => {
	palette('Mario', () => {
		tileset('mario', 'gfx/mario.png', 16, 16);
	});

	palette('level1', () => {
		tiledMap('level1', 'gfx/mario-1-1', { tileWidth: 16, tileHeight: 16, tilesetWidth: 16, tilesetHeight: 16 });
	});

	palette('road', () => {
		tiledMap('road', 'gfx/road', { tolerance: 200, tileWidth: 16, tileHeight: 16, tilesetWidth: 32, tilesetHeight: 32 });
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
});
