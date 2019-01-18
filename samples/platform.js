import {InputKey, startGame, color} from "./lib-main";

const GRAVITY = 0.4;
const TILE_SIZE = 16;
const SHINING_BLOCK_COLORS = [color.make('#f93'), color.make('#f93'), color.make('#c50'), color.make('#810'), color.make('#810'), color.make('#c50')];

class Camera {
	constructor() {
		this.x = 0;
	}

	update(mario) {
		if (mario.left - this.x >= 108) {
			// The camera better had no floating part, as this could introduce "shaking" when computing the sprite positions
			this.x = Math.floor(mario.left - 108);
		}
	}
}

class Mario {
	constructor() {
		this.left = 0;
		this.top = 160;
		this.width = 16;
		this.height = 15;
		this.velocityX = 0;
		this.velocityY = 0;
		this.direction = 'right';

		this.accelerationX = 0.2;
		this.decelerationX = 0.95;
		this.maxVelocityX = 2;
		this.maxVelocityWhenRunningX = 3;
		this.jumpImpulse = -4;
	}

	// Draw the Mario sprite as an object for one frame
	draw(vdp) {
		const tile = vdp.sprite('mario').tile(6);
		const needsFlip = this.direction === 'left';
		vdp.drawObject(tile, this.left - camera.x, this.top, { flipH: needsFlip });
	}

	get right() {
		return this.left + this.width;
	}

	get bottom() {
		return this.top + this.height;
	}

	// Integrate the physics for one frame and handle controls
	update(input) {
		// Gravity is constantly affecting the vertical velocity (acceleration)
		this.velocityY += GRAVITY;

		// Pressing A accelerates the character
		const maxVelocity = input.isDown(InputKey.A) ? this.maxVelocityWhenRunningX : this.maxVelocityX;

		// Pressing the key affects the lateral (X) velocity
		if (input.isDown(InputKey.Right)) {
			this.velocityX += this.accelerationX;
			// Do not go beyond maxVelocity (always smaller than that, hence the Math.min)
			this.velocityX = Math.min(maxVelocity, this.velocityX);
			if (this.velocityX > this.accelerationX) this.direction = 'right';
		}
		else if (input.isDown(InputKey.Left)) {
			this.velocityX -= this.accelerationX;
			this.velocityX = Math.max(-maxVelocity, this.velocityX);
			if (this.velocityX < -this.accelerationX) this.direction = 'left';
		}
		else {
			this.velocityX *= this.decelerationX;
		}

		// Jump: just give an inpulse (can only be done if we're resting on the ground)
		if (input.hasToggledDown(InputKey.B) && this._isGrounded()) {
			this.velocityY = this.jumpImpulse - Math.abs(this.velocityX / 6);
		}
		else if (input.isDown(InputKey.B) && this.velocityY < 0) {
			// Can extend the jump by leaving the button pressed
			this.velocityY -= GRAVITY * 0.6;
		}

		// Integrate the velocity to the position
		let moveH = this.velocityX, moveV = this.velocityY;
		while (Math.abs(moveH) >= 0.001 || Math.abs(moveV) >= 0.001) {
			// Move a max of one unit horizontally and vertically each time.
			// Original games didn't do that because it's inefficient, but it will save you a lot of headache.
			const unitH = Math.min(1, Math.abs(moveH)) * Math.sign(moveH);
			const unitV = Math.min(1, Math.abs(moveV)) * Math.sign(moveV);
			moveH -= unitH;
			moveV -= unitV;
			this.top += unitV;
			this._checkCollisionsVertical();
			this.left += unitH;
			this._checkCollisionsLateral();
		}

		// Do not allow going off the camera
		this.left = Math.max(this.left, camera.x);
	}

	_checkCollisionsLateral() {
		// Left (check at bottom and top)
		if (this._collidesAt(this.left, this.top + 1) || this._collidesAt(this.left, this.bottom - 1)) {
			this.left += 1;
			this.velocityX = 0;
		}

		if (this._collidesAt(this.right, this.top + 1) || this._collidesAt(this.right, this.bottom - 1)) {
			this.left -= 1;
			this.velocityX = 0;
		}
	}

	_checkCollisionsVertical() {
		if (this._collidesAt(this.left + 1, this.top) || this._collidesAt(this.right - 1, this.top)) {
			this.top += 1;
			this.velocityY = 0;
		}

		if (this._collidesAt(this.left + 1, this.bottom) || this._collidesAt(this.right - 1, this.bottom)) {
			this.top -= 1;
			this.velocityY = 0;
		}
	}

	_collidesAt(x, y) {
		return this._isSolidBlock(this._mapBlockAtPosition(x, y));
	}

	_isGrounded() {
		// We're on the ground if there's something one pixel below us
		return this._collidesAt(this.left + 1, this.bottom + 1) || this._collidesAt(this.right - 1, this.bottom + 1);
	}

	_isSolidBlock(block) {
		return [39, 11, 12, 18, 19, 24, 25, 16, 13].indexOf(block) >= 0;
	}

	_mapBlockAtPosition(x, y) {
		return mapData.getElement(x / TILE_SIZE, y / TILE_SIZE);
	}
}

function animateLevel1(vdp) {
	const pal = vdp.readPalette('level1');
	// Rotate the shining block color from the choices above, every 12 frames
	const colorIndex = Math.floor(frameNo / 12) % SHINING_BLOCK_COLORS.length;
	pal.array[7] = SHINING_BLOCK_COLORS[colorIndex];
	vdp.writePalette('level1', pal);
}

let camera = new Camera();
let mapData;
let frameNo = 0;

/** @param vdp {VDP} */
function *main(vdp) {
	const mario = new Mario();
	mapData = vdp.readMap('level1');
	vdp.configBackdropColor('#000');

	while (true) {
		mario.update(vdp.input);
		camera.update(mario);

		vdp.drawBackgroundMap('level1', { scrollX: camera.x, wrap: false });
		mario.draw(vdp);

		animateLevel1(vdp);
		frameNo += 1;
		yield;
	}
}

startGame("#glCanvas", vdp => main(vdp));
