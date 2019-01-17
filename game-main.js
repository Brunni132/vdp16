import {InputKey, startGame} from "./lib-main";

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
		this.jumpImpulse = -4.5;
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

		// Pressing the key affects the lateral (X) velocity
		if (input.isDown(InputKey.Left)) {
			this.velocityX -= this.accelerationX;
			// Do not go beyond -maxVelocityX (always greater than that, hence the max)
			this.velocityX = Math.max(-this.maxVelocityX, this.velocityX);
			if (this.velocityX < -this.accelerationX) this.direction = 'left';
		}
		else if (input.isDown(InputKey.Right)) {
			this.velocityX += this.accelerationX;
			this.velocityX = Math.min(this.maxVelocityX, this.velocityX);
			if (this.velocityX > this.accelerationX) this.direction = 'right';
		}
		else {
			this.velocityX *= this.decelerationX;
		}

		// Jump: just give an inpulse
		if (input.hasToggledDown(InputKey.B)) {
			this.velocityY = this.jumpImpulse;
		}
		else if (input.isDown(InputKey.B)) {
			this.velocityY -= GRAVITY * 0.6;
		}

		// Integrate the velocity to the position
		let moveH = this.velocityX, moveV = this.velocityY;
		while (Math.abs(moveH) >= 0.01 || Math.abs(moveV) >= 0.01) {
			// Move a max of one unit horizontally and vertically each time
			const unitH = Math.min(1, Math.abs(moveH)) * Math.sign(moveH);
			const unitV = Math.min(1, Math.abs(moveV)) * Math.sign(moveV);
			this.left += unitH;
			this.top += unitV;
			moveH -= unitH;
			moveV -= unitV;

			this._checkCollisions();
		}

		// Do not allow going off the camera
		this.left = Math.max(this.left, camera.x);
	}

	_checkCollisions() {
		this._hitTestLeft(this.top + 1);
		this._hitTestLeft(this.bottom - 1);
		this._hitTestRight(this.top + 1);
		this._hitTestRight(this.bottom - 1);
		this._hitTestTop(this.left + 1);
		this._hitTestTop(this.right - 1);
		this._hitTestBottom(this.left + 1);
		this._hitTestBottom(this.right - 1);
	}

	_collidesAt(x, y) {
		return this._isSolidBlock(this._mapBlockAtPosition(x, y));
	}

	_isSolidBlock(block) {
		return [39, 15, 102, 50, 51, 65, 66, 32, 18, 95, 96, 54, 55, 67, 68].indexOf(block) >= 0;
	}

	_mapBlockAtPosition(x, y) {
		return mapData.getElement(x / TILE_SIZE, y / TILE_SIZE);
	}

	_hitTestTop(x) {
		if (this._collidesAt(x, this.top)) {
			this.top = Math.floor(this.top) + 1;
			this.velocityY = 0;
		}
	}

	_hitTestLeft(y) {
		if (this._collidesAt(this.left, y)) {
			this.left = Math.floor(this.left) + 1;
			this.velocityX = 0;
		}
	}

	_hitTestRight(y) {
		if (this._collidesAt(this.right, y)) {
			this.left = Math.floor(this.left) - 1;
			this.velocityX = 0;
		}
	}

	_hitTestBottom(x) {
		// If there's a block under us, it means that our bottom (lower part) is in the ground
		if (this._collidesAt(x, this.bottom)) {
			this.top = Math.floor(this.top) - 1;
			this.velocityY = 0;
		}
	}
}

const GRAVITY = 0.4;
const TILE_SIZE = 16;
let camera = new Camera();
let mapData;

/** @param vdp {VDP} */
function *main(vdp) {
	const mario = new Mario();
	mapData = vdp.readMap('level1');

	while (true) {
		mario.update(vdp.input);
		camera.update(mario);

		vdp.drawBackgroundMap('level1', { scrollX: camera.x });
		mario.draw(vdp);

		yield;
	}
}

startGame("#glCanvas", vdp => main(vdp));
