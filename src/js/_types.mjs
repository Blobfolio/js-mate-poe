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
export const FLAGS = {
	allowExit: 1,
	autoFlip: 2,
	forceGravity: 4,
	ignoreEdges: 8,
	demoPlay: 16,
	noChildren: 32,
	noParents: 64,
};

/**
 * Animation IDs
 *
 * @enum {number}
 */
export const PLAYLIST = {
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
};

/**
 * Sounds
 *
 * @enum {number}
 */
export const SOUNDS = {
	Baa: 1,
	Sneeze: 2,
	Yawn: 3,
};



// ---------------------------------------------------------------------
// Callbacks
// ---------------------------------------------------------------------

/**
 * Position Callback
 *
 * @typedef {function():MateAnimationPosition} */
export var MateAnimationPositionCB;

/**
 * Repeat Callback
 *
 * @typedef {function():number} */
export var MateAnimationRepeatCB;

/**
 * State Callback
 *
 * @typedef {function():MateAnimationState} */
export var MateAnimationStateCB;



// ---------------------------------------------------------------------
// Animations
// ---------------------------------------------------------------------

/**
 * An animation audio.
 *
 * @typedef {{
	sound: SOUNDS,
	start: number
 * }}
 */
export var MateAnimationAudio;

/**
 * Fields required to initialize setAnimation().
 *
 * @typedef {{
	x: number,
	y: number
 * }}
 */
export var MateAnimationPosition;

/**
 * Weighted animation (set to occur more or less frequently).
 *
 * @typedef {{
	weight: number,
	id: number
 * }}
 */
export var MateAnimationPossibility;

/**
 * Dynamic animation scene.
 *
 * @typedef {{
	startFrom: (null|MateAnimationPositionCB|MateAnimationPosition),
	start: (number|MateAnimationStateCB|!MateAnimationState),
	end: (number|MateAnimationStateCB|!MateAnimationState),
	repeat: (MateAnimationRepeatCB|number),
	repeatFrom: number,
	frames: Array<number>,
	audio: ?MateAnimationAudio,
	flags: number
 * }}
 */
export var RawMateAnimationScene;

/**
 * Animation scene.
 *
 * @typedef {{
	startFrom: ?MateAnimationPosition,
	start: !MateAnimationState,
	end: !MateAnimationState,
	repeat: number,
	repeatFrom: number,
	frames: Array<number>,
	audio: ?MateAnimationAudio,
	flags: number
 * }}
 */
export var MateAnimationScene;

/**
 * Fields required to initialize setAnimation().
 *
 * @typedef {{
 	id: number,
	x: ?number,
	y: ?number
 * }}
 */
export var MateAnimationSetup;

/**
 * An animation state (usually a start or end point).
 *
 * @typedef {{
	x: number,
	y: number,
	speed: number
 * }}
 */
export var MateAnimationState;

/**
 * Where an animation should be at a given point.
 *
 * @typedef {{
 	step: number,
 	scene: number,
	time: number,
	interval: number,
	frame: number,
	x: number,
	y: number,
	audio: ?SOUNDS,
	flip: boolean,
	flags: number
 * }}
 */
export var MateAnimationStep;

/**
 * Dynamic animation sequence.
 *
 * @typedef {{
	id: number,
	name: string,
	scene: Array<RawMateAnimationScene>,
	useDefault: number,
	useEntrance: number,
	useFirst: number,
	flags: number,
	childId: number,
	edge: (null|number|Array<(number|!MateAnimationPossibility)>),
	next: (null|number|Array<(number|!MateAnimationPossibility)>)
 * }}
 */
export var RawMateAnimation;

/**
 * An animation sequence.
 *
 * @typedef {{
	id: number,
	name: string,
	scene: Array<MateAnimationScene>,
	useDefault: number,
	useEntrance: number,
	useFirst: number,
	flags: number,
	childId: number,
	edge: (null|number|Array<(number|!MateAnimationPossibility)>),
	next: (null|number|Array<(number|!MateAnimationPossibility)>)
 * }}
 */
export var MateAnimation;



// ---------------------------------------------------------------------
// Misc
// ---------------------------------------------------------------------

/**
 * MateEvent
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
