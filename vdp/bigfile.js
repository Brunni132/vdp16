/**
 * @typedef BigFile {object}
 * @property pals {Object.<string, BigFile.Palette>}
 * @property sprites {Object.<string, BigFile.Sprite>}
 * @property maps {Object.<string, BigFile.Map>}
 */

/**
 * @typedef BigFile.Palette
 * @property x {number} U position of palette (color units)
 * @property y {number} V position of palette (color units)
 * @property size {number} count (color units)
 */

/**
 * @typedef BigFile.Sprite
 * @property x {number} U position in the sprite texture (pixels)
 * @property y {number} V position in the sprite texture (pixels)
 * @property w {number} width of sprite (pixels)
 * @property h {number} height of sprite (pixels)
 * @property pal {string} palette name
 */

/**
 * @typedef BigFile.Map
 * @property x {number} U position in the map texture (cells)
 * @property y {number} V position in the map texture (cells)
 * @property w {number} width of sprite (pixels)
 * @property h {number} height of sprite (pixels)
 * @property pal {string} palette name
 */

