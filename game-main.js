import {InputKey, startGame} from "./lib-main";

const GRAVITY = 0.05;
const TILE_SIZE = 8;
let mapData;

class Mario {
	constructor() {
		this.left = 0;
		this.top = 160;
		this.width = 16;
		this.height = 15;
		this.velocityX = 0;
		this.velocityY = 0;

		this.accelerationX = 0.2;
		this.decelerationX = 0.95;
		this.maxVelocityX = 2;
	}

	// Draw the Mario sprite as an object for one frame
	draw(vdp) {
		const tile = vdp.sprite('mario').tile(6);
		const needsFlip = this.velocityX < 0;
		vdp.drawObject(tile, this.left, this.top, { flipH: needsFlip });
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
		}
		else if (input.isDown(InputKey.Right)) {
			this.velocityX += this.accelerationX;
			this.velocityX = Math.min(this.maxVelocityX, this.velocityX);
		}
		else {
			this.velocityX *= this.decelerationX;
		}

		// Jump: just give an inpulse
		if (input.hasToggledDown(InputKey.B)) {
			this.velocityY = -1;
		}

		// Integrate the velocity to the position
		this.left += this.velocityX;
		this.top += this.velocityY;

		// Have we hit something? Check the left and right corners
		this._hitTestBottom(this.left);
		this._hitTestBottom(this.right);
	}

	_hitTestBottom(x) {
		// If there's a block under us, it means that our bottom (lower part) is in the ground
		while (mapData.getElement(x / TILE_SIZE, this.bottom / TILE_SIZE) >= 202) {
			this.top = Math.floor(this.top) - 1;
			this.velocityY = 0;
		}
	}
}

/**
 * @param vdp {VDP}
 * @returns {IterableIterator<void>}
 */
function *main(vdp) {
	const mario = new Mario();
	mapData = vdp.readMap('level1');

	while (true) {
		mario.update(vdp.input);

		vdp.drawBackgroundMap('level1');
		mario.draw(vdp);

		yield;
	}
}

startGame("#glCanvas", vdp => main(vdp));
