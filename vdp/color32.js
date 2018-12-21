/**
 * Extends a 16 bit RGBA color into a 32 bit RGBA color. Note that 0xRGBA will produce 0xAABBGGRR, reversing the byte
 * order as OpenGL expects it.
 * @param col {number}
 * @returns {number}
 */
function extendColor16(col) {
	return reverseColor32((col & 0xf) | (col & 0xf) << 4 |
		(col & 0xf0) << 4 | (col & 0xf0) << 8 |
		(col & 0xf00) << 8 | (col & 0xf00) << 12 |
		(col & 0xf000) << 12 | (col & 0xf000) << 16);
}

/**
 * Parses a color, always in 32-bit RGBA format.
 * @param col {number|string} either a 12-bit number (0xrgb0), a 32-bit number (0xaabbggrr)
 * or a string (#rgb, #rrggbb, #rrggbbaa).
 * @private
 * @returns {number} the color in 32-bit RGBA format.
 */
function parseColor(col) {
	if (typeof col === 'string') {
		if (col.charAt(0) !== '#') col = ''; // fail

		// Invert byte order
		switch (col.length) {
		case 4:
			col = parseInt(col.substring(1), 16);
			// col = (col & 0xf) << 8 | (col & 0xf0) | (col >>> 8 & 0xff);
			return extendColor16(col << 4 | 0xf);
		case 5:
			col = parseInt(col.substring(1), 16);
			// col = (col & 0xf) << 12 | (col >> 4 & 0xf) << 8 | (col >> 8 & 0xf) << 4 | (col >> 12 & 0xf);
			return extendColor16(col);
		case 7:
			col = parseInt(col.substring(1), 16);
			// Pass a RGBA with alpha=ff
			return reverseColor32(col << 8 | 0xff);
		case 9:
			col = parseInt(col.substring(1), 16);
			return reverseColor32(col);
		default:
			throw new Error(`Invalid color string ${col}`);
		}
	}

	if (col <= 0xffff) {
		// 16-bit to 32
		return extendColor16(col);
	}
	else if (col <= 0xffffff) {
		// 24-bit to 32
		return col | 0xff << 24;
	}
	return col;
}

/**
 * Reverses the byte order of a RGBA color.
 * @param col {number}
 * @returns {number}
 */
function reverseColor32(col) {
	return (col & 0xff) << 24 | (col >>> 8 & 0xff) << 16 | (col >>> 16 & 0xff) << 8 | (col >>> 24 & 0xff);
}

/**
 * @param col {number} 32-bit color (0xAABBGGRR)
 * @returns {number} 16-bit color (0xRGBA)
 */
function toColor16(col) {
	console.log(`TEMP ToColor16 ${col.toString(16)}`, ((col & 0xf0) << 8 | (col >>> 8 & 0xf0) << 4 | (col >>> 16 & 0xf0) | col >>> 28).toString(16), ((col & 0xf0) << 8).toString(16), ((col >>> 8 & 0xf0) << 4).toString(16), (col >>> 16 & 0xf0), col >>> 28);
	return (col & 0xf0) << 8 | (col >>> 8 & 0xf0) << 4 | (col >>> 16 & 0xf0) | col >>> 28;
}


function add(c, d) {
	let a = (c >>> 24) + (d >>> 24);
	let b = ((c >>> 16) & 0xff) + ((d >>> 16) & 0xff);
	let g = ((c >>> 8) & 0xff) + ((d >>> 8) & 0xff);
	let r = (c & 0xff) + (d & 0xff);
	if (a > 255) a = 255;
	if (b > 255) b = 255;
	if (g > 255) g = 255;
	if (r > 255) r = 255;
	return r | g << 8 | b << 16 | a << 24;
}

function sub(c, d) {
	let a = (c >>> 24) - (d >>> 24);
	let b = ((c >>> 16) & 0xff) - ((d >>> 16) & 0xff);
	let g = ((c >>> 8) & 0xff) - ((d >>> 8) & 0xff);
	let r = (c & 0xff) - (d & 0xff);
	if (a < 0) a = 0;
	if (b < 0) b = 0;
	if (g < 0) g = 0;
	if (r < 0) r = 0;
	return r | g << 8 | b << 16 | a << 24;
}

function mul(c, d) {
	let a = ((c >>> 24) * (d >>> 24)) / 255;
	let b = ((c >>> 16) & 0xff) * ((d >>> 16) & 0xff) / 255;
	let g = ((c >>> 8) & 0xff) * ((d >>> 8) & 0xff) / 255;
	let r = (c & 0xff) * (d & 0xff) / 255;
	return r | g << 8 | b << 16 | a << 24;
}

function blend(c, d, factor) {
	factor = Math.min(1, Math.max(0, factor));
	const invF = 1 - factor;

	const a = (c >>> 24) * invF + (d >>> 24) * factor;
	const b = ((c >>> 16) & 0xff) * invF + ((d >>> 16) & 0xff) * factor;
	const g = ((c >>> 8) & 0xff) * invF + ((d >>> 8) & 0xff) * factor;
	const r = (c & 0xff) * invF + (d & 0xff) * factor;
	return r | g << 8 | b << 16 | a << 24;
}

export const color32 = {
	parseColor,
	toColor16,
	add,
	sub,
	mul,
	blend
};
