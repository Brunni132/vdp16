const { addColors, blank, config, image,	map,	multiPalette,	palette,	sprite,	tileset,	tiledMap } = require('../tools/gfxConverter/dsl');

const SCREEN_WIDTH = 256, SCREEN_HEIGHT = 256;

config({ compact: true, debug: true, hiColorMode: false }, () => {
  palette('level1', () => {
    tiledMap('level1', 'gfx/mario-1-1', { tileWidth: 8, tileHeight: 8, tilesetWidth: 32, tilesetHeight: 32 });
  });
});
