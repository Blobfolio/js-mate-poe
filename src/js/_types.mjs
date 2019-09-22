/**
 * @file Type definitions.
 */



/**
 * An animation audio.
 *
 * @typedef {{
	file: string,
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
 * Raw Animation scene.
 *
 * @typedef {{
	startFrom: (null|Function|MateAnimationPosition),
	start: (number|Function|!MateAnimationState),
	end: (number|Function|!MateAnimationState),
	repeat: (Function|number),
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
	audio: ?string,
	flip: boolean,
	flags: number
 * }}
 */
export var MateAnimationStep;

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

/**
 * A raw animation sequence.
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
