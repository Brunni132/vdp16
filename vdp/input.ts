
export enum InputKey {
	Up = 0,
	Down = 1,
	Left = 2,
	Right = 3,
	A = 4,
	B = 5,
	L = 6,
	R = 7,
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
	'j': InputKey.A,
	'k': InputKey.B,
	'h': InputKey.L,
	'l': InputKey.R,
	'c': InputKey.A,
	'v': InputKey.B,
	'x': InputKey.L,
	'b': InputKey.R,
	' ': InputKey.Select,
	'Enter': InputKey.Start,
};

export class Input {
	private readonly keyState: InputKeyState[];

	constructor() {
		const self = this;
		this.keyState = new Array( InputKey.NumKeys).fill(InputKeyState.Up);

		document.onkeydown = function(ev: KeyboardEvent) {
			const keyIndex = self._translateKeyEvent(ev);
			if (keyIndex >= 0 && !self.isDown(keyIndex)) self.keyState[keyIndex] = InputKeyState.Pressed;
		};

		document.onkeyup = function(ev: KeyboardEvent) {
			const keyIndex = self._translateKeyEvent(ev);
			if (keyIndex >= 0) self.keyState[keyIndex] = InputKeyState.Released;
		};
	}

	/**
	 * @param key {number} key to check for
	 * @returns {boolean} whether the key just toggled from released to pressed this frame.
	 */
	public hasToggledDown(key: InputKey): boolean {
		return this.keyState[key] === InputKeyState.Pressed;
	}

	/**
	 * @param key {number} key to check for
	 * @returns {boolean} whether the key just toggled from pressed to released this frame.
	 */
	public hasToggledUp(key: InputKey): boolean {
		return this.keyState[key] === InputKeyState.Released;
	}

	/**
	 * @param key {number} key to check for
	 * @returns {boolean} whether the key is currently down. True from the moment the user presses the key until he
	 * releases it.
	 */
	public isDown(key: InputKey): boolean {
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

	/**
	 * Returns -1 if the key doesn't map to an existing key, or the index of the key (InputKey).
	 */
	private _translateKeyEvent(ev: KeyboardEvent): InputKey {
		return (ev.key in mapping) ? mapping[ev.key] : -1;
	}
}
