import {createDataTexture32, createDataTextureFloat, loadTexture, loadTexture4444, readFromTexture32} from "./utils";
import {mat4} from "../gl-matrix";
import {drawSprite, initSpriteShaders} from "./sprites";
import {drawMap, initMapShaders} from "./maps";
import {
	HICOLOR_MODE, MAP_TEX_H, MAP_TEX_W,
	OTHER_TEX_W,
	PALETTE_TEX_H,
	PALETTE_TEX_W, SCREEN_HEIGHT, SCREEN_WIDTH,
	SEMITRANSPARENT_CANVAS,
	setParams, SPRITE_TEX_H,
	SPRITE_TEX_W
} from "./shaders";
import {drawSupersimple, initSupersimpleShaders} from "./tests";

class VDP {
	/** @property {WebGLRenderingContext} gl */
	/** @property {BigFile} gameData */
	/**
	 * xyzp: x, y position, base z, base palette no
	 * mapInfo1: u, v map base, u, v tileset base
	 * mapInfo2: map width, map height, tileset width, tileset height
	 * mapInfo3: tile width, tile height, UV drawing (should be 0…1)
	 * @property {{program: *, attribLocations: {xyzp: GLint, mapInfo1: GLint, mapInfo2: GLint, mapInfo3: GLint, mapInfo4: GLint}, buffers: {xyzp, mapInfo1, mapInfo2, mapInfo3, mapInfo4}, uniformLocations: {projectionMatrix: WebGLUniformLocation, modelViewMatrix: WebGLUniformLocation, uSamplerMaps: WebGLUniformLocation, uSamplerSprites: WebGLUniformLocation, uSamplerPalettes: WebGLUniformLocation, uSamplerOthers: WebGLUniformLocation}}} mapProgram
	 */
	/** @property {number} mapTexture */
	/** @property {mat4} modelViewMatrix */
	/** @property {mat4} projectionMatrix */
	/**
	 * @property {{program: *, arrayBuffers: {xyzp: Float32Array, uv: Float32Array}, attribLocations: {xyzp: GLint, uv: GLint}, buffers: {xyzp, uv}, uniformLocations: {projectionMatrix: WebGLUniformLocation, modelViewMatrix: WebGLUniformLocation, uSamplerSprites: WebGLUniformLocation, uSamplerPalettes: WebGLUniformLocation}}} spriteProgram
	 */
	/** @property {{program: *, arrayBuffers: {xyz: Float32Array, uv: Float32Array}, attribLocations: {xyz: GLint, uv: GLint}, buffers: {xyz, uv}, uniformLocations: {projectionMatrix: WebGLUniformLocation, modelViewMatrix: WebGLUniformLocation, uSamplerPalettes: WebGLUniformLocation}}} supersimpleProgram */
	/** @type {WebGLTexture} mapTexture */
	/** @type {WebGLTexture} paletteTexture */
	/** @type {WebGLTexture} spriteTexture */
	/** @type {WebGLTexture} otherTexture */

	/**
	 * @param canvas {HTMLCanvasElement}
	 * @param done {function()}
	 */
	constructor(canvas, done) {
		this._initContext(canvas);
		initMapShaders(this);
		initSpriteShaders(this);
		initSupersimpleShaders(this);
		this._initMatrices();

		const gl = this.gl;
		const loadTextureType = HICOLOR_MODE ? loadTexture : loadTexture4444;
		// TODO Florian -- Use promises for loadTexture, make them all at the same time and wait for them all. Same for fetch
		window.fetch('build/game.json').then((res) => res.json()).then((json) => {
			this.gameData = json;

			loadTexture(gl, 'build/sprites.png', (tex, image) => {
				if (image.width !== SPRITE_TEX_W || image.height !== SPRITE_TEX_H)
					throw new Error('Mismatch in texture size');
				this.spriteTexture = tex;

				loadTextureType(gl, 'build/palettes.png', (tex, image) => {
					if (image.width !== 256 && HICOLOR_MODE || image.width !== 16 && !HICOLOR_MODE)
						throw new Error('Mismatch in hi-color mode and passed textures');
					if (image.width !== PALETTE_TEX_W || image.height !== PALETTE_TEX_H)
						throw new Error('Mismatch in texture size');
					this.paletteTexture = tex;

					loadTexture(gl, 'build/maps.png', (tex, image) => {
						if (image.width !== MAP_TEX_W || image.height !== MAP_TEX_H)
							throw new Error('Mismatch in texture size');
						this.mapTexture = tex;

						this.otherTexture = createDataTextureFloat(gl, OTHER_TEX_W, OTHER_TEX_W);
						done();
					});
				});
			});
		});
	}

	startFrame() {
		const gl = this.gl;

		// PERF: Has a moderate hit on performance (almost zero on the Surface Pro). It can even be faster if the image has pixel with zero alpha, the Surface Pro does some optimizations for fully transparent pixels. Else you have to discard them, and if you discard them you get even better performance.
		// If you discard a lot of pixels there's almost no change. If the sprite is fully opaque there's no change either.
		// In general it's probably better left on, the GPU already does all the optimizations.
		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

		// TODO Florian -- Set clear color to palette[0, 0]
		gl.clearColor(0.0, 0.0, 0.5, 0.0);
		gl.clearDepth(1.0);                 // Clear everything
		// PERF: This is a lot slower if there's a discard in the fragment shader (and we need one?) because the GPU can't test & write to the depth buffer until after the fragment shader has been executed. So there's no point in using it I guess.
		// gl.enable(gl.DEPTH_TEST);           // Enable depth testing
		// gl.depthFunc(gl.LESS);            // Near things obscure far things

		// Clear the canvas before we start drawing on it.
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	}

	/**
	 * @param name
	 * @returns {BigFile~Map}
	 */
	map(name) {
		const map = this.gameData.maps[name];
		if (!map) throw new Error(`Map ${name} not found`);
		return map;
	}

	/**
	 * @param name
	 * @returns {BigFile~Palette}
	 */
	palette(name) {
		const pal = this.gameData.pals[name];
		if (!pal) throw new Error(`Palette ${name} not found`);
		return pal;
	}

	/**
	 * @param name
	 * @returns {BigFile~Sprite}
	 */
	sprite(name) {
		const spr = this.gameData.sprites[name];
		if (!spr) throw new Error(`Sprite ${name} not found`);
		return spr;
	}

	/**
	 * @param sprite {string|BigFile~Sprite}
	 * @param x {number}
	 * @param y {number}
	 * @param [palette] {BigFile~Palette}
	 */
	drawSprite(sprite, x, y, palette) {
		if (typeof sprite === 'string') sprite = this.sprite(sprite);
		const pal = palette || this.palette(sprite.pal);
		drawSprite(this, x, y, sprite.w, sprite.h, sprite.x, sprite.y, sprite.x + sprite.w, sprite.y + sprite.h, pal.y);
	}

	/**
	 * @param map {string|BigFile~Map}
	 * @param [palette] {BigFile~Palette}
	 * @param [linescrollBuffer] {number}
	 * @param [wrap=1] {number}
	 */
	drawMap(map, palette, linescrollBuffer = 0, wrap = 1) {
		if (typeof map === 'string') map = this.map(map);
		const pal = palette || this.palette(map.pal);
		const til = this.sprite(map.til);
		drawMap(this, map.x, map.y, til.x, til.y, map.w, map.h, til.w, til.tw, til.th, pal.y, linescrollBuffer, wrap);
	}

	// drawMap(uMap, vMap, uTileset, vTileset, mapWidth, mapHeight, tilesetWidth, tilesetHeight, tileWidth, tileHeight, palNo, linescrollBuffer, wrap = 1) {
	// 	drawMap(this, uMap, vMap, uTileset, vTileset, mapWidth, mapHeight, tilesetWidth, tilesetHeight, tileWidth, tileHeight, palNo, linescrollBuffer, wrap);
	// }
	//
	// drawSprite(xStart, yStart, xEnd, yEnd, uStart, vStart, uEnd, vEnd, palNo) {
	// 	drawSprite(this, xStart, yStart, xEnd, yEnd, uStart, vStart, uEnd, vEnd, palNo);
	// }
	//
	// drawSupersimple(vdp, xStart, yStart, xEnd, yEnd, uStart, vStart, uEnd, vEnd) {
	// 	drawSupersimple(this, xStart, yStart, xEnd, yEnd, uStart, vStart, uEnd, vEnd);
	// }

	// --------------------- PRIVATE ---------------------
	_initContext(canvas) {
		this.gl = canvas.getContext("webgl", { premultipliedAlpha: true, alpha: SEMITRANSPARENT_CANVAS });

		// Only continue if WebGL is available and working
		if (this.gl === null) {
			alert("Unable to initialize WebGL. Your browser or machine may not support it.");
		}
	}

	_initMatrices() {
		this.projectionMatrix = mat4.create();
		// note: glmatrix.js always has the first argument as the destination to receive the result.
		mat4.ortho(this.projectionMatrix, 0.0, SCREEN_WIDTH, SCREEN_HEIGHT, 0.0, 0.1, 100);

		// Normally set in modelViewMatrix, but we want to allow an empty model view matrix
		mat4.translate(this.projectionMatrix, this.projectionMatrix, [-0.0, 0.0, -0.1]);

		this.modelViewMatrix = mat4.create();
		// mat4.translate(this.modelViewMatrix, this.modelViewMatrix, [-0.0, 0.0, -0.1]);
	}
}

/**
 * @param canvas {HTMLCanvasElement}
 * @param done {function(VDP)}
 */
export function loadVdp(canvas, done) {
	setParams(canvas.width, canvas.height, true, false);
	const vdp = new VDP(canvas, () => {
		done(vdp);
	});
}
