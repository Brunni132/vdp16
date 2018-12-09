

export function add(c, d) {
	let a = (c >>> 12) + (d >>> 12);
	let b = ((c >>> 8) & 0xf) + ((d >>> 8) & 0xf);
	let g = ((c >>> 4) & 0xf) + ((d >>> 4) & 0xf);
	let r = (c & 0xf) + (d & 0xf);
	if (a > 255) a = 255;
	if (b > 255) b = 255;
	if (g > 255) g = 255;
	if (r > 255) r = 255;
	return r | g << 4 | b << 8 | a << 12;
}

export function sub(c, d) {
	let a = (c >>> 12) - (d >>> 12);
	let b = ((c >>> 8) & 0xf) - ((d >>> 8) & 0xf);
	let g = ((c >>> 4) & 0xf) - ((d >>> 4) & 0xf);
	let r = (c & 0xf) - (d & 0xf);
	if (a < 0) a = 0;
	if (b < 0) b = 0;
	if (g < 0) g = 0;
	if (r < 0) r = 0;
	return r | g << 4 | b << 8 | a << 12;
}

export function mul(c, d) {
	let a = ((c >>> 12) * (d >>> 12)) / 255;
	let b = ((c >>> 8) & 0xf) * ((d >>> 8) & 0xf) / 255;
	let g = ((c >>> 4) & 0xf) * ((d >>> 4) & 0xf) / 255;
	let r = (c & 0xf) * (d & 0xf) / 255;
	return r | g << 4 | b << 8 | a << 12;
}

export function blend(c, d, factor) {
	factor = Math.min(1, Math.max(0, factor));
	const invF = 1 - factor;

	const a = (c >>> 12) * invF + (d >>> 12) * factor;
	const b = ((c >>> 8) & 0xf) * invF + ((d >>> 8) & 0xf) * factor;
	const g = ((c >>> 4) & 0xf) * invF + ((d >>> 4) & 0xf) * factor;
	const r = (c & 0xf) * invF + (d & 0xf) * factor;
	return r | g << 4 | b << 8 | a << 12;
}

