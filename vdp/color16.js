

export function add(c, d) {
	let r = (c >>> 12) + (d >>> 12);
	let g = ((c >>> 8) & 0xf) + ((d >>> 8) & 0xf);
	let b = ((c >>> 4) & 0xf) + ((d >>> 4) & 0xf);
	let a = (c & 0xf) + (d & 0xf);
	if (a > 0xf) a = 0xf;
	if (b > 0xf) b = 0xf;
	if (g > 0xf) g = 0xf;
	if (r > 0xf) r = 0xf;
	return a | b << 4 | g << 8 | r << 12;
}

export function sub(c, d) {
	let r = (c >>> 12) - (d >>> 12);
	let g = ((c >>> 8) & 0xf) - ((d >>> 8) & 0xf);
	let b = ((c >>> 4) & 0xf) - ((d >>> 4) & 0xf);
	let a = (c & 0xf) - (d & 0xf);
	if (a < 0) a = 0;
	if (b < 0) b = 0;
	if (g < 0) g = 0;
	if (r < 0) r = 0;
	return a | b << 4 | g << 8 | r << 12;
}

export function mul(c, d) {
	let r = ((c >>> 12) * (d >>> 12)) / 255;
	let g = ((c >>> 8) & 0xf) * ((d >>> 8) & 0xf) / 255;
	let b = ((c >>> 4) & 0xf) * ((d >>> 4) & 0xf) / 255;
	let a = (c & 0xf) * (d & 0xf) / 255;
	return a | b << 4 | g << 8 | r << 12;
}

export function blend(c, d, factor) {
	factor = Math.min(1, Math.max(0, factor));
	const invF = 1 - factor;

	const r = (c >>> 12) * invF + (d >>> 12) * factor;
	const g = ((c >>> 8) & 0xf) * invF + ((d >>> 8) & 0xf) * factor;
	const b = ((c >>> 4) & 0xf) * invF + ((d >>> 4) & 0xf) * factor;
	const a = (c & 0xf) * invF + (d & 0xf) * factor;
	return a | b << 4 | g << 8 | r << 12;
}

