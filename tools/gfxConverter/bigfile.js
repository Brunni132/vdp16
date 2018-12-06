/**
 * @typedef {Object} BigFile~Palette
 * @property x {number} U position of palette (color units)
 * @property y {number} V position of palette (color units)
 * @property size {number} count (color units)
 */

/**
 * @typedef {Object} BigFile~Sprite
 * @property x {number} U position in the sprite texture (pixels)
 * @property y {number} V position in the sprite texture (pixels)
 * @property w {number} width of sprite or tileset as a whole (pixels)
 * @property h {number} height of sprite or tileset as a whole (pixels)
 * @property tw {number} tile width (pixels) if it's a tileset
 * @property th {number} tile height (pixels) if it's a tileset
 * @property pal {string} palette name
 */

/**
 * @typedef {Object} BigFile~Map
 * @property x {number} U position in the map texture (cells)
 * @property y {number} V position in the map texture (cells)
 * @property w {number} width of sprite (pixels)
 * @property h {number} height of sprite (pixels)
 * @property til {string} name of the tileset (BigFile~Sprite)
 * @property pal {string} name of the first palette (ignores that in the tileset)
 */

/**
 * @typedef {Object} BigFile
 * @property pals {Object.<string, BigFilePalette>}
 * @property sprites {Object.<string, BigFileSprite>}
 * @property maps {Object.<string, BigFileMap>}
 */
