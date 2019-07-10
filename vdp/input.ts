
export enum Key {
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

enum KeyState {
	Up = 0, // released for long
	Released = 1, // just released
	Down = 2, // >= 2 implies down
	Pressed = 3, // just pressed
}

const mapping = {
	'arrowup': Key.Up,
	'arrowdown': Key.Down,
	'arrowleft': Key.Left,
	'arrowright': Key.Right,
	'w': Key.Up,
	's': Key.Down,
	'a': Key.Left,
	'd': Key.Right,
	'j': Key.A,
	'k': Key.B,
	'h': Key.L,
	'l': Key.R,
	'c': Key.A,
	'v': Key.B,
	'x': Key.L,
	'b': Key.R,
	' ': Key.Select,
	'enter': Key.Start,
};

export class Input {
	/** @internal */
	private readonly keyState: KeyState[];
	public Key = Key;

	constructor() {
		const self = this;
		this.keyState = new Array( Key.NumKeys).fill(KeyState.Up);

		document.onkeydown = function(ev: KeyboardEvent) {
			const keyIndex = self._translateKeyEvent(ev);
			if (keyIndex >= 0 && !self.isDown(keyIndex)) self.keyState[keyIndex] = KeyState.Pressed;
		};

		document.onkeyup = function(ev: KeyboardEvent) {
			const keyIndex = self._translateKeyEvent(ev);
			if (keyIndex >= 0) self.keyState[keyIndex] = KeyState.Released;
		};
	}

	/**
	 * @param key {number} key to check for
	 * @returns {boolean} whether the key just toggled from released to pressed this frame.
	 */
	public hasToggledDown(key: Key): boolean {
		return this.keyState[key] === KeyState.Pressed;
	}

	/**
	 * @param key {number} key to check for
	 * @returns {boolean} whether the key just toggled from pressed to released this frame.
	 */
	public hasToggledUp(key: Key): boolean {
		return this.keyState[key] === KeyState.Released;
	}

	/**
	 * @param key {number} key to check for
	 * @returns {boolean} whether the key is currently down. True from the moment the user presses the key until he
	 * releases it.
	 */
	public isDown(key: Key): boolean {
		return this.keyState[key] >= KeyState.Down;
	}

	/**
	 * Marks all newly pressed keys as held if they're still held.
	 */
	public _process() {
		this.keyState.forEach((state, index) => {
			if (state === KeyState.Pressed) this.keyState[index] = KeyState.Down;
			if (state === KeyState.Released) this.keyState[index] = KeyState.Up;
		});
	}

	/**
	 * Returns -1 if the key doesn't map to an existing key, or the index of the key (Key).
	 */
	private _translateKeyEvent(ev: KeyboardEvent): Key {
		const k = ev.key.toLowerCase();
		return (k in mapping) ? mapping[k] : -1;
	}
}
