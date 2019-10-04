/**
 * @file Type definitions.
 */



// ---------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------

/**
 * Animation Flags
 *
 * @enum {number}
 */
export const AnimationFlags = {
	// OK to manually play during demo.
	DemoPlay: 1,
	// Not for children.
	NoChildren: 2,
	// Not for parents.
	NoParents: 4,
	// Falling animation.
	FallingAnimation: 8,
	// Stack behind other frames.
	StackBehind: 16,
};

/**
 * Demo Flags
 *
 * @enum {number}
 */
export const DemoFlags = {
	// Default Choice.
	DefaultChoice: 1,
	// Entrance Choice.
	EntranceChoice: 2,
	// First Choice.
	FirstChoice: 4,
	// Variable Duration.
	VariableDuration: 8,
};

/**
 * Poe Flags
 *
 * @enum {number}
 */
export const PoeFlags = {
	// Warned about broken auto-play audio.
	AudioWarned: 1,
	// Debug.
	Debug: 2,
	// Play Audio.
	MakeNoise: 4,
};

/**
 * Scene Flags
 *
 * @enum {number}
 */
export const SceneFlags = {
	// Allow exit.
	AllowExit: 1,
	// Flip after.
	AutoFlip: 2,
	// Sprite should be at the bottom of the page.
	ForceGravity: 4,
	// Edges don't need to trigger edge sequences.
	IgnoreEdges: 8,
};

/**
 * Mate Flags
 *
 * @enum {number}
 */
export const MateFlags = {
	// Mate: Left side.
	BottomSide: 1,
	// Mate: Mate should appear behind other mates.
	IsBehind: 2,
	// Mate: Event bindings are set.
	IsBound: 4,
	// Mate: Dragging is happening.
	IsDragging: 8,
	// Mate: Sprite is flipped.
	IsFlipped: 16,
	// Mate: Is visible.
	IsVisible: 32,
	// Mate: Left side.
	LeftSide: 64,
	// Mate: Mate may exit during current scene (randomly decided).
	MayExit: 128,
	// Mate: Floor.
	OnFloor: 256,
	// Mate: Left side.
	RightSide: 512,
	// Mate: Left side.
	TopSide: 1024,
};

/**
 * Directions
 *
 * @enum {number}
 */
export const Direction = {
	None: 0,
	Up: 1,
	Down: 2,
	Left: 3,
	Right: 4,
};

/**
 * Log Type
 *
 * @enum {number}
 */
export const LogType = {
	Info: 0,
	Log: 1,
	Warning: 2,
	Error: 3,
};

/**
 * Animation IDs
 *
 * @enum {number}
 */
export const Playlist = {
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
	BlackSheep: 21,
	BlackSheepChild: 22,
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
};

/**
 * Sounds
 *
 * @enum {number}
 */
export const Sound = {
	Baa: 1,
	Sneeze: 2,
	Yawn: 3,
};



// ---------------------------------------------------------------------
// Callbacks
// ---------------------------------------------------------------------

/**
 * Scene Position Callback
 *
 * @typedef {function():!ScenePosition}
 */
export var ScenePositionCB;

/**
 * Scene Repeat Callback
 *
 * @typedef {function():!SceneRepeat}
 */
export var SceneRepeatCB;


// ---------------------------------------------------------------------
// Animations
// ---------------------------------------------------------------------

/**
 * Animation
 *
 * @typedef {{
	id: !Playlist,
	name: string,
	scenes: !Array<!Scene>,
	useDefault: number,
	useEntrance: number,
	useFirst: number,
	flags: number,
	childId: ?Playlist,
	edge: (null|!Playlist|!Array<WeightedChoice>),
	next: (null|!Playlist|!Array<WeightedChoice>)
 * }}
 */
export var Animation;

/**
 * Scene
 *
 * @typedef {{
	start: (null|!ScenePosition|!ScenePositionCB),
	from: !ScenePosition,
	to: !ScenePosition,
	repeat: (null|!SceneRepeat|!SceneRepeatCB),
	frames: !Array<number>,
	sound: ?SceneSound,
	flags: number
 * }}
 */
export var Scene;

/**
 * Scene Position
 *
 * @typedef {!Array<number, number, ?number>}
 */
export var ScenePosition;

/**
 * Frame Repeat
 *
 * @typedef {!Array<number, number>}
 */
export var SceneRepeat;

/**
 * Frame Sound
 *
 * @typedef {!Array<number, number>}
 */
export var SceneSound;

/**
 * Step
 *
 * @typedef {{
	step: number,
	scene: number,
	interval: number,
	frame: number,
	x: number,
	y: number,
	sound: ?Sound,
	flip: boolean,
	flags: number
 * }}
 */
export var Step;

/**
 * Weighted Animation Choice
 *
 * @typedef {!Array<Playlist, number>}
 */
export var WeightedChoice;




// ---------------------------------------------------------------------
// Misc
// ---------------------------------------------------------------------

/**
 * Event
 *
 * @typedef {{
	el: (Element|Window),
	hook: string,
	cb: Function
 * }}
 */
export var MateEvent;

/**
 * Vue Component
 *
 * @typedef {{
 	functional: (void|boolean),
 	data: (void|Function),
	props: (void|Object<string, VueProp>),
	methods: (void|Object<string, Function>),
	computed: (void|Object<string, Function>),
	render: (void|Function),
	template: (void|string)
 * }}
 */
export var VueComponent;

/**
 * Vue Property
 *
 * @typedef {{
	type: (Function|Array),
	required: boolean,
	default: (void|*)
 * }}
 */
export var VueProp;

/**
 * Vue App
 *
 * @typedef {{
	el: (Element|string),
	data: Object,
	mounted: Function,
	methods: Object,
	computed: Object
 * }}
 */
export var VueApp;
