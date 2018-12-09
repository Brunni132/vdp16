

export function add(c, d) {
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

export function sub(c, d) {
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

export function mul(c, d) {
	let a = ((c >>> 24) * (d >>> 24)) / 255;
	let b = ((c >>> 16) & 0xff) * ((d >>> 16) & 0xff) / 255;
	let g = ((c >>> 8) & 0xff) * ((d >>> 8) & 0xff) / 255;
	let r = (c & 0xff) * (d & 0xff) / 255;
	return r | g << 8 | b << 16 | a << 24;
}

export function blend(c, d, factor) {
	factor = Math.min(1, Math.max(0, factor));
	const invF = 1 - factor;

	const a = (c >>> 24) * invF + (d >>> 24) * factor;
	const b = ((c >>> 16) & 0xff) * invF + ((d >>> 16) & 0xff) * factor;
	const g = ((c >>> 8) & 0xff) * invF + ((d >>> 8) & 0xff) * factor;
	const r = (c & 0xff) * invF + (d & 0xff) * factor;
	return r | g << 8 | b << 16 | a << 24;
}

