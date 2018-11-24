import {loadTexture} from "./utils";
import {mat4} from "../gl-matrix";
import {initSpriteShaders} from "./shaders";
import {drawSprite} from "./sprites";

const MAX_SPRITES = 128;

class VDP {
	constructor(canvas, done) {
		// Members
		this.gl = null;
		this.modelViewMatrix = null;
		this.projectionMatrix = null;
		this.spriteProgram = {
			program: null,
			attribLocations: {
				vertexPosition: null,
				textureCoord: null
			},
			uniformLocations: {
				projectionMatrix: null,
				modelViewMatrix: null,
				uSamplerPalettes: null,
				uSamplerSprites: null
			},
			xyzBuffer: null,
			uvBuffer: null,
			bufferUsage: 0,
		};
		this.spriteTexture = null;
		this.paletteTexture = null;

		// Methods
		this.drawSprite = drawSprite.bind(null, this);

		this._initContext(canvas);
		initSpriteShaders(this);
		this._initBuffers();
		this._initMatrices();

		loadTexture(this.gl, 'sprites.png', (tex) => {
			this.spriteTexture = tex;
			loadTexture(this.gl, 'palette.png', (tex) => {
				this.paletteTexture = tex;
				done();
			});
		});
	}

	startFrame() {
		const gl = this.gl;

		// Set clear color to black, fully opaque
		gl.clearColor(0.0, 0.0, 0.5, 1.0);
		gl.clearDepth(1.0);                 // Clear everything
		gl.enable(gl.DEPTH_TEST);           // Enable depth testing
		gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

		// Clear the canvas before we start drawing on it.
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		this.spriteProgram.bufferUsage = 0;
	}

	_initBuffers() {
		const gl = this.gl;
		const TOTAL_VERTICES = MAX_SPRITES * 4;

		this.spriteProgram.xyzBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.spriteProgram.xyzBuffer);
		// TODO Florian -- STREAM_DRAW
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(TOTAL_VERTICES * 3), gl.STATIC_DRAW);

		this.spriteProgram.uvBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.spriteProgram.xyzBuffer);
		// TODO Florian -- STREAM_DRAW
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(TOTAL_VERTICES * 2), gl.STATIC_DRAW);
	}

	_initContext(canvas) {
		this.gl = canvas.getContext("webgl");

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
		mat4.ortho(this.projectionMatrix, 0.0, 320.0, 240.0, 0.0, 0.1, 100);

		this.modelViewMatrix = mat4.create();
		mat4.translate(this.modelViewMatrix, this.modelViewMatrix, [-0.0, 0.0, -0.1]);
	}
}

export function loadVdp(canvas, done) {
	const vdp = new VDP(canvas, () => {
		done(vdp);
	});
}
