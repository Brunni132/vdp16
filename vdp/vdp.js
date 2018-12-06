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

class VDP {
	constructor(canvas, done) {
		/** @type {WebGLRenderingContext} */
		this.gl = null;
		this.mapProgram = {
			program: null,
			buffers: {
				xyzp: null,
				mapInfo1: null,
				mapInfo2: null,
				mapInfo3: null
			},
			attribLocations: {
				// For blending: use dst := framebuffer * (1 - outAlpha) + outFrag * 1 ; outFrag.rgb = texture.rgb * blendingFactor ; outFrag.a = texture.a
				xyzp: null, // x, y position, base z, base palette no
				mapInfo1: null, // u, v map base, u, v tileset base
				mapInfo2: null, // map width, map height, tileset width, tileset height
				mapInfo3: null  // tile width, tile height, UV drawing (should be 0…1)
			},
			uniformLocations: {
				projectionMatrix: null,
				modelViewMatrix: null,
				uSamplerMaps: null,
				uSamplerPalettes: null,
				uSamplerSprites: null,
			}
		};
		/** @type {number} */
		this.mapTexture = null;
		/** @type {mat4} */
		this.modelViewMatrix = null;
		/** @type {mat4} */
		this.projectionMatrix = null;
		this.spriteProgram = {
			program: null,
			arrayBuffers: {
				xyzp: null,
				uv: null,
			},
			buffers: {
				xyzp: null,
				uv: null,
			},
			attribLocations: {
				xyzp: null,
				uv: null
			},
			uniformLocations: {
				projectionMatrix: null,
				modelViewMatrix: null,
				uSamplerPalettes: null,
				uSamplerSprites: null
			},
		};
		/** @type {number} */
		this.paletteTexture = null;
		/** @type {number} */
		this.spriteTexture = null;
		/** @type {number} */
		this.otherTexture = null;

		// Methods
		this.drawMap = drawMap.bind(null, this);
		this.drawSprite = drawSprite.bind(null, this);

		this._initContext(canvas);
		initMapShaders(this);
		initSpriteShaders(this);
		this._initMatrices();

		const gl = this.gl;
		const loadTextureType = HICOLOR_MODE ? loadTexture : loadTexture4444;
		loadTexture(gl, 'sprites.png', (tex, image) => {
			if (image.width !== SPRITE_TEX_W || image.height !== SPRITE_TEX_H)
				throw new Error('Mismatch in texture size');
			this.spriteTexture = tex;
			loadTextureType(gl, 'palettes.png', (tex, image) => {
				if (image.width !== 256 && HICOLOR_MODE || image.width !== 16 && !HICOLOR_MODE)
					throw new Error('Mismatch in hi-color mode and passed textures');
				if (image.width !== PALETTE_TEX_W || image.height !== PALETTE_TEX_H)
					throw new Error('Mismatch in texture size');
				this.paletteTexture = tex;
				loadTexture(gl, 'maps.png', (tex, image) => {
					if (image.width !== MAP_TEX_W || image.height !== MAP_TEX_H)
						throw new Error('Mismatch in texture size');
					this.mapTexture = tex;

					this.otherTexture = createDataTextureFloat(gl, OTHER_TEX_W, OTHER_TEX_W);
					done();
				});
			});
		});
	}

	startFrame() {
		const gl = this.gl;

		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

		// TODO Florian -- Set clear color to palette[0, 0]
		gl.clearColor(0.0, 0.0, 0.5, 0.0);
		gl.clearDepth(1.0);                 // Clear everything
		gl.enable(gl.DEPTH_TEST);           // Enable depth testing
		gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

		// Clear the canvas before we start drawing on it.
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	}

	_initContext(canvas) {
		this.gl = canvas.getContext("webgl", { premultipliedAlpha: true, alpha: SEMITRANSPARENT_CANVAS });

		// Only continue if WebGL is available and working
		if (this.gl === null) {
			alert("Unable to initialize WebGL. Your browser or machine may not support it.");
		}
	}

	_initMatrices() {
		// Create a perspective matrix, a special matrix that is
		// used to simulate the distortion of perspective in a camera.
		// Our field of view is 45 degrees, with a width/height
		// ratio that matches the display size of the canvas
		// and we only want to see objects between 0.1 units
		// and 100 units away from the camera.
		this.projectionMatrix = mat4.create();
		// note: glmatrix.js always has the first argument
		// as the destination to receive the result.
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
