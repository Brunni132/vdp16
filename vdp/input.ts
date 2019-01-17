
export enum InputKey {
	Up = 0,
	Down = 1,
	Left = 2,
	Right = 3,
	A = 4,
	B = 5,
	X = 6,
	Y = 7,
	Start = 8,
	Select = 9,
	NumKeys = 10
}

enum InputKeyState {
	Up = 0, // released for long
	Released = 1, // just released
	Down = 2, // >= 2 implies down
	Pressed = 3, // just pressed
}

const mapping = {
	'ArrowUp': InputKey.Up,
	'ArrowDown': InputKey.Down,
	'ArrowLeft': InputKey.Left,
	'ArrowRight': InputKey.Right,
	'w': InputKey.Up,
	's': InputKey.Down,
	'a': InputKey.Left,
	'd': InputKey.Right,
	'k': InputKey.A,
	'l': InputKey.B,
	'j': InputKey.X,
	'i': InputKey.Y,
	' ': InputKey.Select,
	'Enter': InputKey.Start,
};

export class Input {
	private readonly keyState: InputKeyState[];

	constructor() {
		const self = this;
		this.keyState = new Array( InputKey.NumKeys).fill(InputKeyState.Up);

		document.onkeydown = function(ev: KeyboardEvent) {
			const key = self.translateKeyEvent(ev);
			if (key) self.keyState[key] = InputKeyState.Pressed;
			else console.log(`TEMP Unrecognized key`, ev.key);
		};

		document.onkeyup = function(ev: KeyboardEvent) {
			const key = self.translateKeyEvent(ev);
			if (key) self.keyState[key] = InputKeyState.Up;
		};
	}

	public hasToggledDown(key: InputKey) {
		return this.keyState[key] === InputKeyState.Pressed;
	}

	public hasToggledUp(key: InputKey) {
		return this.keyState[key] === InputKeyState.Released;
	}

	public isDown(key: InputKey) {
		return this.keyState[key] >= InputKeyState.Down;
	}

	/**
	 * Marks all newly pressed keys as held if they're still held.
	 */
	public _process() {
		this.keyState.forEach((state, index) => {
			if (state === InputKeyState.Pressed) this.keyState[index] = InputKeyState.Down;
			if (state === InputKeyState.Released) this.keyState[index] = InputKeyState.Up;
		});
	}

	private translateKeyEvent(ev: KeyboardEvent) {
		const foundKey = Object.keys(mapping).find(k => k === ev.key);
		return foundKey ? mapping[foundKey] : null;
	}
}
