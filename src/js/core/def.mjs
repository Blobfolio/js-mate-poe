/**
 * @file Definitions
 */

import {
	ChoiceList,
	FrameList,
	Position,
	SceneList,
	Mate
} from '../core.mjs';



// ---------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------

/**
 * Max ID
 *
 * @const {number}
 */
export const MaxPlaylist = 55;



// ---------------------------------------------------------------------
// Flags
// ---------------------------------------------------------------------

/**
 * Animation Flags
 *
 * @enum {number}
 */
export const AnimationFlag = {
	AllowExit: 1,
	Background: 2,
	DefaultChoice: 4,
	DirectPlay: 8,
	Dragging: 16,
	EntranceChoice: 32,
	Falling: 64,
	FirstChoice: 128,
	Flip: 256,
	PrimaryMates: 512,
	ReverseX: 1024,
	ReverseY: 2048,
	SecondaryMates: 4096,
	VariableDuration: 8192,
};

/**
 * Mate Flags
 *
 * @enum {number}
 */
export const MateFlag = {
	None: 0,
	Background: 1,
	Disabled: 2,
	Dragging: 4,
	FlippedX: 8,
	FlippedY: 16,
	MayExit: 32,
	Primary: 64,
	ReverseX: 128,
	ReverseY: 256,
	Secondary: 512,
};

/**
 * Position Flags
 *
 * @enum {number}
 */
export const PositionFlag = {
	// Nothing.
	None: 0,
	// At or over top edge.
	TopEdge: 1,
	// At or over right edge.
	RightEdge: 2,
	// At or over bottom edge.
	BottomEdge: 4,
	// At or over left edge.
	LeftEdge: 8,
	// On the floor.
	OnFloor: 16,
	// Fully visible.
	Visible: 32,
	// Partially visible.
	PartiallyVisible: 64,
};

/**
 * Scene Flags
 *
 * @enum {number}
 */
export const SceneFlag = {
	None: 0,
	EaseIn: 1,
	EaseOut: 2,
	FlipX: 4,
	FlipXAfter: 8,
	FlipY: 16,
	FlipYAfter: 32,
	Gravity: 64,
	IgnoreEdges: 128,
};



// ---------------------------------------------------------------------
// Other Enums
// ---------------------------------------------------------------------

/**
 * Direction Flags
 *
 * @enum {number}
 */
export const Direction = {
	None: 0,
	Left: 1,
	Right: 2,
	Up: 3,
	Down: 4,
};

/**
 * Log Types
 *
 * @enum {number}
 */
export const LogKind = {
	Error: 1,
	Warning: 2,
	Notice: 3,
	Info: 4,
};

/**
 * Log Messages
 *
 * @enum {string}
 */
export const LogMsg = {
	ErrorAnimationType: 'Incorrect animation type for mate.',
	ErrorMissingPrimary: 'The primary animation cannot be "none"; using "walk" instead.',
	ErrorNoChoice: 'No next animation could be selected.',
	ErrorStartSecondary: 'Secondary animations have no start().',
	ErrorStopPrimary: 'Primary animations have no stop().',
	WarnAudio: 'Hint: try clicking Poe with your mouse.',
	Name: 'JS Mate Poe',
	URL: 'https://github.com/Blobfolio/js-mate-poe/',
	Version: '1.2.1',
};

/**
 * Playlist
 *
 * @enum {number}
 */
export const Playlist = {
	None: 0,
	Walk: 1,
	Rotate: 2,
	Drag: 3,
	Fall: 4,
	GraspingFall: 5,
	Run: 6,
	Boing: 7,
	Bounce: 8,
	Splat: 9,
	Urinate: 10,
	PlayDead: 11,
	Scream: 12,
	Sleep: 13,
	Doze: 14,
	BoredSleep: 15,
	BathDive: 16,
	BathDiveChild: 17,
	Jump: 18,
	Eat: 19,
	FlowerChild: 20,
	BlackSheepRomance: 21,
	BlackSheepRomanceChild: 22,
	BeginRun: 23,
	RunEnd: 24,
	ClimbUp: 25,
	ReachCeiling: 26,
	WalkUpsideDown: 27,
	ReachSide: 28,
	ClimbDown: 29,
	ReachFloor: 30,
	Beg: 31,
	Bleat: 32,
	Handstand: 33,
	Slide: 34,
	BathCoolDown: 35,
	Roll: 36,
	Sneeze: 37,
	Scratch: 38,
	Stargaze: 39,
	StargazeChild: 40,
	Abduction: 41,
	AbductionChild: 42,
	AbductionBeamingChild: 43,
	AbductionBeamChild: 44,
	ChasingAMartian: 45,
	ChasingAMartianChild: 46,
	Spin: 47,
	WallSlide: 48,
	Scoot: 49,
	SneezeShadow: 50,
	BlackSheepChase: 51,
	BlackSheepChaseChild: 52,
	SlideDown: 53,
	DeepThoughts: 54,
	DangleFall: 55,
};

/**
 * A Sound
 *
 * @enum {number}
 */
export const Sound = {
	None: 0,
	Baa: 1,
	Sneeze: 2,
	Yawn: 3,
};

/**
 * Sprite Info
 *
 * @enum {number}
 */
export const SpriteInfo = {
	Width: 640,
	Height: 440,
	TileWidth: 40,
	TileHeight: 40,
	TileSize: 40,
	Tiles: 176,
	XTiles: 16,
	YTiles: 11,
	EmptyTile: 173,
};



// ---------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------

/**
 * An Animation
 *
 * @typedef {{
 	id: !Playlist,
 	name: string,
 	scenes: !SceneList,
 	flags: !AnimationFlag,
 	childId: ?Playlist,
 	edge: (null|!Playlist|!ChoiceList),
 	next: (null|!Playlist|!ChoiceList)
 * }}
 */
export var Animation;

/**
 * A Choice
 *
 * @typedef {!Array<!Playlist, number>}
 */
export var Choice;

/**
 * Mate Next
 *
 * @typedef {{
	time: number,
	animation: ?Playlist,
	position: ?Position,
	flags: number
 * }}
 */
export var MateNext;

/**
 * Mate State
 *
 * @typedef {{
	id: symbol,
	next: number,
	frame: number,
	sound: !Sound,
	x: number,
	y: number,
	flags: !MateFlag
 * }}
 */
export var MateState;

/**
 * A Scene
 *
 * @typedef {{
 	start: ?Position,
 	move: ?Position,
 	duration: number,
 	repeat: ?Array<number, number>,
 	frames: !FrameList,
 	sound: ?Array<!Sound, number>,
 	flags: !SceneFlag
 * }}
 */
export var Scene;

/**
 * A Callback That Resolves a Scene
 *
 * @typedef {!function() : !Scene }
 */
export var SceneCb;

/**
 * Step
 *
 * @typedef {{
	step: number,
	scene: number,
	start: ?Position,
	interval: number,
	frame: number,
	move: ?Position,
	sound: !Sound,
	flags: !SceneFlag
 * }}
 */
export var Step;

/**
 * The Universe
 *
 * This is the canvas upon which the mates are drawn. It contains a few
 * environment-specific methods that will need to be overridden to hook
 * it up correctly for Browsers, Node, whatever.
 *
 * @suppress {duplicate}
 */
export const Universe = {
	/**
	 * Tile Size
	 *
	 * @private {number}
	 */
	_tileSize: SpriteInfo.TileSize,

	/**
	 * Screen Width
	 *
	 * @private {number}
	 */
	_width: 0,

	/**
	 * Screen Height
	 *
	 * @private {number}
	 */
	_height: 0,

	/**
	 * Playback Speed
	 *
	 * @private {number}
	 */
	_speed: 1,

	/**
	 * Registered Mates
	 *
	 * @private {Array}
	 */
	_mates: [],



	// -----------------------------------------------------------------
	// Getters
	// -----------------------------------------------------------------

	/**
	 * Get Animation
	 *
	 * @return {number} Playlist.
	 */
	get animation() {
		if (Universe._mates.length) {
			return /** @type {number} */ (Universe._mates[0].animation);
		}

		return /** @type {number} */ (Playlist.None);
	},

	/**
	 * Get Height
	 *
	 * @return {number} Height.
	 */
	get height() {
		return Universe._height;
	},

	/**
	 * Max X
	 *
	 * @return {number} X.
	 */
	get maxX() {
		return Universe._width - Universe._tileSize;
	},

	/**
	 * Max Y
	 *
	 * @return {number} Y.
	 */
	get maxY() {
		return Universe._height - Universe._tileSize;
	},

	/**
	 * Get Speed
	 *
	 * @return {number} Speed.
	 */
	get speed() {
		return Universe._speed;
	},

	/**
	 * Get Tile Size
	 *
	 * @return {number} Tile Size.
	 */
	get tileSize() {
		return Universe._tileSize;
	},

	/**
	 * Get Width
	 *
	 * @return {number} Width.
	 */
	get width() {
		return Universe._width;
	},



	// -----------------------------------------------------------------
	// Setters
	// -----------------------------------------------------------------

	/**
	 * Set Animation
	 *
	 * @param {number} v Animation ID.
	 * @return {void} Nothing.
	 */
	set animation(v) {
		v = parseInt(v, 10) || 0;
		if (
			0 < v &&
			MaxPlaylist >= v &&
			Universe._mates.length
		) {
			Universe.stopSecondaryMates();
			Universe._mates[0].resetAnimation();
			Universe._mates[0].setAnimation(/** @type {!Playlist} */ (v), null);
		}
	},

	/**
	 * Set Height
	 *
	 * @param {number} v Value.
	 * @return {void} Nothing.
	 */
	set height(v) {
		v = parseInt(v, 10) || 0;
		if (0 > v) {
			v = 0;
		}

		Universe._height = v;
	},

	/**
	 * Set Speed
	 *
	 * @param {number} v Value.
	 * @return {void} Nothing.
	 */
	set speed(v) {
		v = parseFloat(v) || 0.0;
		if (0.1 > v) {
			v = 0.1;
		}
		else if (10.0 < v) {
			v = 10.0;
		}

		Universe._speed = v;
	},

	/**
	 * Set Tile Size
	 *
	 * @param {number} v Tile Size.
	 * @return {void} Nothing.
	 */
	set tileSize(v) {
		v = parseInt(v, 10) || 0;
		if (1 > v) {
			v = 1;
		}

		Universe._tileSize = v;
	},

	/**
	 * Set Width
	 *
	 * @param {number} v Value.
	 * @return {void} Nothing.
	 */
	set width(v) {
		v = parseInt(v, 10) || 0;
		if (0 > v) {
			v = 0;
		}

		Universe._width = v;
	},



	// -----------------------------------------------------------------
	// Methods
	// -----------------------------------------------------------------



	// -----------------------------------------------------------------
	// Playback
	// -----------------------------------------------------------------

	/**
	 * Initialize Mate
	 *
	 * Start a new mate or return an inactive one so it can be brought
	 * back to life.
	 *
	 * @return {!Mate} Mate.
	 */
	initMate() {
		// We have none!
		if (! Universe._mates.length) {
			Universe._mates.push(new Mate(true));
			return Universe._mates[0];
		}

		// We might have a disabled child to return.
		for (let i = 1; i < Universe._mates.length; ++i) {
			if (Universe._mates[i].isDisabled()) {
				return Universe._mates[i];
			}
		}

		// We have to spawn a new one.
		Universe._mates.push(new Mate(false));
		return Universe._mates[Universe._mates.length - 1];
	},

	/**
	 * Start
	 *
	 * @return {void} Nothing.
	 */
	start() {
		if (! Universe._mates.length) {
			// Make sure width and height have been set.
			Universe._resize();

			// Create and start a mate.
			Universe.initMate().start();
		}
	},

	/**
	 * Stop Everything
	 *
	 * @return {void} Nothing.
	 */
	stop() {
		delete Universe._mates;
		Universe._mates = [];
	},

	/**
	 * Stop Secondary Mates
	 *
	 * @return {void} Nothing.
	 */
	stopSecondaryMates() {
		// We might have a disabled child to return.
		for (let i = 1; i < Universe._mates.length; ++i) {
			if (Universe._mates[i].isEnabled()) {
				Universe._mates[i].stop();
			}
		}
	},

	/**
	 * Tick
	 *
	 * @param {number} now Now.
	 * @param {boolean} force Force.
	 * @return {void} Nothing.
	 */
	tick(now, force) {
		// Nothing to tick.
		if (! Universe._mates.length) {
			return;
		}

		for (let i = 0; i < Universe._mates.length; ++i) {
			Universe._mates[i].tick(now, force);
		}
	},



	// -----------------------------------------------------------------
	// State
	// -----------------------------------------------------------------

	/**
	 * Get State
	 *
	 * @return {!Array<!MateState>} State.
	 */
	state() {
		/** @type {!Array<!MateState>} */
		let out = new Array(Universe._mates.length);

		// Add in the mate states.
		for (let i = 0; i < Universe._mates.length; ++i) {
			out[i] = Universe._mates[i].state();
		}

		return out;
	},



	// -----------------------------------------------------------------
	// Dragging
	// -----------------------------------------------------------------

	/**
	 * Is Dragging
	 *
	 * @return {boolean} True/false.
	 */
	isDragging() {
		return 'undefined' !== typeof Universe._mates[0] && Universe._mates[0].isDragging();
	},

	/**
	 * Drag Start
	 *
	 * @return {void} Nothing.
	 */
	dragStart() {
		if (
			Universe._mates.length &&
			! Universe._mates[0].isDragging()
		) {
			// Kill the kids.
			Universe.stopSecondaryMates();

			// Start dragging the primary.
			Universe._mates[0].dragStart();
		}
	},

	/**
	 * Drag
	 *
	 * @param {!Position} pos Position.
	 * @return {void} Nothing.
	 */
	drag(pos) {
		if (Universe._mates.length) {
			Universe._mates[0].drag(pos);
		}
	},

	/**
	 * Drag End
	 *
	 * @return {void} Nothing.
	 */
	dragEnd() {
		if (Universe._mates.length) {
			Universe._mates[0].dragEnd();
		}
	},

	/**
	 * Resize
	 *
	 * @return {void} Nothing.
	 */
	resize() {
		Universe._resize();

		for (let i = 0; i < Universe._mates.length; ++i) {
			if (Universe._mates[i].isEnabled()) {
				Universe._mates[i].resize();
			}
		}
	},



	// -----------------------------------------------------------------
	// Overloads
	// -----------------------------------------------------------------

	/**
	 * Log
	 *
	 * Write a debug message, whatever that means.
	 *
	 * @param {string} msg Message.
	 * @param {!LogKind} type Type.
	 * @return {void} Nothing.
	 */
	/* eslint-disable-next-line no-unused-vars */
	log(msg, type) {
		return;
	},

	/**
	 * Get Current Time
	 *
	 * This time is used for animation triggering, so while it doesn't
	 * need to be based on UTC or whatever, it must tick ever upward
	 * relative to itself.
	 *
	 * @return {number} Time.
	 */
	now() {
		return 0;
	},

	/**
	 * Get Random
	 *
	 * This should return a random value between 0 and the upper
	 * boundary, the latter being exclusive (will never exactly hit).
	 *
	 * @param {number} max Maximum bound.
	 * @return {number} Random.
	 */
	/* eslint-disable-next-line no-unused-vars */
	random(max) {
		return 0;
	},

	/**
	 * Self Resize
	 *
	 * This is triggered by `Universe.start()` and `Universe.resize()`.
	 * Typically it should calculate and set the Universe's width and
	 * height according to the environment.
	 *
	 * @return {void} Nothing.
	 */
	_resize() {
	},
};
