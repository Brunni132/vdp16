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
 * @property w {number} width of sprite (pixels)
 * @property h {number} height of sprite (pixels)
 * @property pal {string} palette name
 */

/**
 * @typedef {Object} BigFile~Map
 * @property x {number} U position in the map texture (cells)
 * @property y {number} V position in the map texture (cells)
 * @property w {number} width of sprite (pixels)
 * @property h {number} height of sprite (pixels)
 * @property pal {string} first palette name
 */

/**
 * @typedef {Object} BigFile
 * @property pals {Object.<string, BigFilePalette>}
 * @property sprites {Object.<string, BigFileSprite>}
 * @property maps {Object.<string, BigFileMap>}
 */
