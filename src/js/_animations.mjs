/**
 * @file Animations
 */

import { screenHeight, screenWidth } from './_helpers.mjs';
import { TILE_SIZE } from './_image.mjs';
import { MateAnimationPosition, MateAnimationPossibility, MateAnimationPositionCB, MateAnimationStateCB, MateAnimationScene, RawMateAnimationScene, MateAnimationState, MateAnimation, RawMateAnimation } from './_types.mjs';



// ---------------------------------------------------------------------
// Animations
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
 * All Animations
 *
 * @const {Array<!RawMateAnimation>}
 */
export const ANIMATIONS = [
	{
		id: PLAYLIST.Walk,
		name: 'Walk',
		/** @type {Array<RawMateAnimationScene>} */
		scene: [
			{
				startFrom: null,
				start: {
					x: -2,
					y: 0,
					speed: 200,
				},
				end: {
					x: -2,
					y: 0,
					speed: 200,
				},
				repeat: 20,
				repeatFrom: 0,
				frames: [
					2,
					3,
				],
				audio: null,
				flags: FLAGS.allowExit | FLAGS.forceGravity,
			},
		],
		useDefault: 1,
		useEntrance: 0,
		useFirst: 0,
		flags: FLAGS.demoPlay | FLAGS.noChildren,
		childId: 0,
		edge: [
			{
				weight: 5,
				id: PLAYLIST.Rotate,
			},
			PLAYLIST.ClimbUp,
		],
		next: [
			{
				weight: 10,
				id: PLAYLIST.Walk,
			},
			PLAYLIST.Urinate,
			PLAYLIST.Sleep,
			PLAYLIST.BoredSleep,
			{
				weight: 2,
				id: PLAYLIST.Eat,
			},
			{
				weight: 4,
				id: PLAYLIST.BeginRun,
			},
			{
				weight: 2,
				id: PLAYLIST.Beg,
			},
			PLAYLIST.Bleat,
			{
				weight: 2,
				id: PLAYLIST.Handstand,
			},
			PLAYLIST.Roll,
			PLAYLIST.Sneeze,
			{
				weight: 2,
				id: PLAYLIST.Scratch,
			},
		],
	},
	{
		id: PLAYLIST.Rotate,
		name: 'Rotate',
		/** @type {Array<RawMateAnimationScene>} */
		scene: [
			{
				startFrom: null,
				start: 200,
				end: 200,
				repeat: 0,
				repeatFrom: 0,
				frames: [
					3,
					9,
					10,
				],
				audio: null,
				flags: FLAGS.autoFlip | FLAGS.forceGravity,
			},
			{
				startFrom: null,
				start: 200,
				end: 200,
				repeat: 0,
				repeatFrom: 0,
				frames: [
					10,
					9,
					3,
				],
				audio: null,
				flags: FLAGS.forceGravity,
			},
		],
		useDefault: 1,
		useEntrance: 0,
		useFirst: 0,
		flags: FLAGS.demoPlay | FLAGS.noChildren,
		childId: 0,
		edge: null,
		next: [
			{
				weight: 10,
				id: PLAYLIST.Walk,
			},
			PLAYLIST.Eat,
		],
	},
	{
		id: PLAYLIST.Drag,
		name: 'Drag',
		/** @type {Array<RawMateAnimationScene>} */
		scene: [
			{
				startFrom: null,
				start: 100,
				end: 100,
				repeat: 0,
				repeatFrom: 0,
				frames: [
					42,
					43,
					43,
					42,
					44,
					44,
				],
				audio: null,
				flags: 0,
			},
		],
		useDefault: 0,
		useEntrance: 0,
		useFirst: 0,
		flags: FLAGS.noChildren,
		childId: 0,
		edge: null,
		next: PLAYLIST.Drag,
	},
	{
		id: PLAYLIST.Fall,
		name: 'Fall',
		/** @type {Array<RawMateAnimationScene>} */
		scene: [
			{
				startFrom: null,
				start: {
					x: 0,
					y: 1,
					speed: 100,
				},
				end: {
					x: 0,
					y: 10,
					speed: 40,
				},
				repeat: 20,
				repeatFrom: 0,
				frames: [
					133,
				],
				audio: null,
				flags: 0,
			},
		],
		useDefault: 0,
		useEntrance: 1,
		useFirst: 10,
		flags: FLAGS.noChildren,
		childId: 0,
		edge: PLAYLIST.Bounce,
		next: PLAYLIST.GraspingFall,
	},
	{
		id: PLAYLIST.GraspingFall,
		name: 'Grasping Fall',
		/** @type {Array<RawMateAnimationScene>} */
		scene: [
			{
				startFrom: null,
				start: {
					x: 0,
					y: 10,
					speed: 40,
				},
				end: {
					x: 0,
					y: 10,
					speed: 40,
				},
				repeat: 10,
				repeatFrom: 0,
				frames: [
					46,
					46,
					46,
				],
				audio: null,
				flags: 0,
			},
		],
		useDefault: 0,
		useEntrance: 1,
		useFirst: 0,
		flags: FLAGS.noChildren,
		childId: 0,
		edge: [
			{
				weight: 3,
				id: PLAYLIST.Splat,
			},
			PLAYLIST.Bounce,
			PLAYLIST.PlayDead,
		],
		next: PLAYLIST.GraspingFall,
	},
	{
		id: PLAYLIST.Run,
		name: 'Run',
		/** @type {Array<RawMateAnimationScene>} */
		scene: [
			{
				startFrom: null,
				start: {
					x: -10,
					y: 0,
					speed: 100,
				},
				end: {
					x: -10,
					y: 0,
					speed: 100,
				},
				repeat: 5,
				repeatFrom: 0,
				frames: [
					5,
					4,
					4,
				],
				audio: null,
				flags: FLAGS.allowExit | FLAGS.forceGravity,
			},
		],
		useDefault: 1,
		useEntrance: 0,
		useFirst: 0,
		flags: FLAGS.demoPlay | FLAGS.noChildren,
		childId: 0,
		edge: PLAYLIST.Boing,
		next: [
			{
				weight: 2,
				id: PLAYLIST.Run,
			},
			{
				weight: 4,
				id: PLAYLIST.RunEnd,
			},
			{
				weight: 3,
				id: PLAYLIST.Jump,
			},
		],
	},
	{
		id: PLAYLIST.Boing,
		name: 'Boing!',
		/** @type {Array<RawMateAnimationScene>} */
		scene: [
			{
				startFrom: null,
				start: {
					x: 1,
					y: 0,
					speed: 100,
				},
				end: {
					x: 10,
					y: 0,
					speed: 100,
				},
				repeat: 0,
				repeatFrom: 0,
				frames: [
					62,
					62,
					63,
					64,
					65,
					66,
					67,
					68,
					69,
					70,
					6,
				],
				audio: null,
				flags: FLAGS.forceGravity,
			},
		],
		useDefault: 0,
		useEntrance: 0,
		useFirst: 0,
		flags: FLAGS.noChildren,
		childId: 0,
		edge: null,
		next: [
			{
				weight: 8,
				id: PLAYLIST.Rotate,
			},
			PLAYLIST.BeginRun,
			{
				weight: 4,
				id: PLAYLIST.Walk,
			},
		],
	},
	{
		id: PLAYLIST.Bounce,
		name: 'Bounce',
		/** @type {Array<RawMateAnimationScene>} */
		scene: [
			{
				startFrom: null,
				start: 100,
				end: 100,
				repeat: 0,
				repeatFrom: 0,
				frames: [
					42,
					49,
					42,
				],
				audio: null,
				flags: FLAGS.forceGravity,
			},
			{
				startFrom: null,
				start: {
					x: 0,
					y: -2,
					speed: 100,
				},
				end: {
					x: 0,
					y: 3,
					speed: 100,
				},
				repeat: 0,
				repeatFrom: 0,
				frames: [
					131,
					42,
					132,
					42,
					49,
				],
				audio: null,
				flags: 0,
			},
			{
				startFrom: null,
				start: 100,
				end: 100,
				repeat: 0,
				repeatFrom: 0,
				frames: [
					13,
					12,
					3,
					9,
					10,
					10,
					10,
					10,
					10,
					10,
					10,
					10,
					10,
					10,
					9,
					3,
				],
				audio: null,
				flags: FLAGS.forceGravity,
			},
		],
		useDefault: 0,
		useEntrance: 0,
		useFirst: 0,
		flags: FLAGS.noChildren,
		childId: 0,
		edge: null,
		next: PLAYLIST.Walk,
	},
	{
		id: PLAYLIST.Splat,
		name: 'Splat!',
		/** @type {Array<RawMateAnimationScene>} */
		scene: [
			{
				startFrom: null,
				start: 200,
				end: 500,
				repeat: 0,
				repeatFrom: 0,
				frames: [
					48,
					48,
					48,
					48,
					47,
				],
				audio: null,
				flags: 0,
			},
		],
		useDefault: 0,
		useEntrance: 0,
		useFirst: 0,
		flags: FLAGS.noChildren,
		childId: 0,
		edge: null,
		next: PLAYLIST.Walk,
	},
	{
		id: PLAYLIST.Urinate,
		name: 'Urinate',
		/** @type {Array<RawMateAnimationScene>} */
		scene: [
			{
				startFrom: null,
				start: 200,
				end: 200,
				repeat: () => Math.floor(5 + Math.random() * 10),
				repeatFrom: 5,
				frames: [
					3,
					12,
					13,
					103,
					104,
					105,
					106,
				],
				audio: null,
				flags: FLAGS.forceGravity,
			},
			{
				startFrom: null,
				start: 200,
				end: 200,
				repeat: 0,
				repeatFrom: 0,
				frames: [
					104,
					105,
					104,
					104,
					103,
					13,
					12,
				],
				audio: null,
				flags: FLAGS.forceGravity,
			},
		],
		useDefault: 1,
		useEntrance: 0,
		useFirst: 0,
		flags: FLAGS.demoPlay | FLAGS.noChildren,
		childId: 0,
		edge: null,
		next: PLAYLIST.Walk,
	},
	{
		id: PLAYLIST.PlayDead,
		name: 'Play Dead',
		/** @type {Array<RawMateAnimationScene>} */
		scene: [
			{
				startFrom: null,
				start: 100,
				end: 100,
				repeat: 4,
				repeatFrom: 11,
				frames: [
					3,
					96,
					96,
					96,
					96,
					96,
					96,
					96,
					96,
					96,
					96,
					95,
				],
				audio: null,
				flags: FLAGS.forceGravity,
			},
		],
		useDefault: 1,
		useEntrance: 0,
		useFirst: 0,
		flags: FLAGS.demoPlay | FLAGS.noChildren,
		childId: 0,
		edge: null,
		next: PLAYLIST.Walk,
	},
	{
		id: PLAYLIST.Scream,
		name: 'Scream!',
		/** @type {Array<RawMateAnimationScene>} */
		scene: [
			{
				startFrom: null,
				start: 30,
				end: 100,
				repeat: 12,
				repeatFrom: 0,
				frames: [
					50,
					51,
				],
				audio: null,
				flags: FLAGS.forceGravity,
			},
		],
		useDefault: 1,
		useEntrance: 0,
		useFirst: 0,
		flags: FLAGS.demoPlay | FLAGS.noChildren,
		childId: 0,
		edge: null,
		next: PLAYLIST.Run,
	},
	{
		id: PLAYLIST.Sleep,
		name: 'Sleep',
		/** @type {Array<RawMateAnimationScene>} */
		scene: [
			{
				startFrom: null,
				start: 1000,
				end: 200,
				repeat: () => Math.floor(10 + Math.random() * 20),
				repeatFrom: 9,
				frames: [
					3,
					107,
					108,
					107,
					108,
					107,
					31,
					32,
					33,
					0,
					1,
				],
				audio: {
					file: 'YAWN',
					start: 1,
				},
				flags: FLAGS.forceGravity,
			},
			{
				startFrom: null,
				start: 200,
				end: 200,
				repeat: 0,
				repeatFrom: 0,
				frames: [
					0,
					80,
					79,
					78,
					77,
					37,
					38,
					39,
					38,
					37,
					6,
				],
				audio: {
					file: 'YAWN',
					start: 5,
				},
				flags: FLAGS.forceGravity,
			},
		],
		useDefault: 1,
		useEntrance: 0,
		useFirst: 0,
		flags: FLAGS.demoPlay | FLAGS.noChildren,
		childId: 0,
		edge: null,
		next: PLAYLIST.Walk,
	},
	{
		id: PLAYLIST.Doze,
		name: 'Doze',
		/** @type {Array<RawMateAnimationScene>} */
		scene: [
			{
				startFrom: null,
				start: 200,
				end: 200,
				repeat: () => Math.floor(20 + Math.random() * 10),
				repeatFrom: 6,
				frames: [
					3,
					6,
					7,
					8,
					8,
					7,
					8,
					8,
				],
				audio: null,
				flags: FLAGS.forceGravity,
			},
			{
				startFrom: null,
				start: 200,
				end: 200,
				repeat: 0,
				repeatFrom: 0,
				frames: [
					8,
					7,
					6,
				],
				audio: null,
				flags: FLAGS.forceGravity,
			},
		],
		useDefault: 1,
		useEntrance: 0,
		useFirst: 0,
		flags: FLAGS.demoPlay | FLAGS.noChildren,
		childId: 0,
		edge: null,
		next: PLAYLIST.Walk,
	},
	{
		id: PLAYLIST.BoredSleep,
		name: 'Bored Sleep',
		/** @type {Array<RawMateAnimationScene>} */
		scene: [
			{
				startFrom: null,
				start: 200,
				end: 200,
				repeat: () => Math.floor(30 + Math.random() * 10),
				repeatFrom: 7,
				frames: [
					3,
					9,
					10,
					34,
					35,
					34,
					35,
					36,
					36,
				],
				audio: null,
				flags: FLAGS.forceGravity,
			},
			{
				startFrom: null,
				start: 200,
				end: 200,
				repeat: 0,
				repeatFrom: 0,
				frames: [
					35,
					36,
					36,
					35,
					34,
					34,
					34,
					10,
					9,
				],
				audio: null,
				flags: FLAGS.forceGravity,
			},
		],
		useDefault: 1,
		useEntrance: 0,
		useFirst: 0,
		flags: FLAGS.demoPlay | FLAGS.noChildren,
		childId: 0,
		edge: null,
		next: PLAYLIST.Walk,
	},
	{
		id: PLAYLIST.BathDive,
		name: 'Bath Dive',
		/** @type {Array<RawMateAnimationScene>} */
		scene: [
			{
				startFrom: () => ({
					x: screenWidth(),
					y: screenHeight() - 600,
				}),
				start: {
					x: -4,
					y: 3,
					speed: 30,
				},
				end: {
					x: -4,
					y: 3,
					speed: 30,
				},
				repeat: 146,
				repeatFrom: 0,
				frames: [
					134,
				],
				audio: null,
				flags: 0,
			},
			{
				startFrom: null,
				start: {
					x: -4,
					y: 3,
					speed: 30,
				},
				end: {
					x: -4,
					y: 3,
					speed: 30,
				},
				repeat: 0,
				repeatFrom: 0,
				frames: [
					135,
					135,
					135,
					135,
					136,
					136,
					136,
					136,
					137,
					137,
					137,
					137,
					138,
					138,
					138,
					138,
					139,
					139,
					139,
					139,
					140,
					140,
					140,
					140,
					141,
					141,
					141,
					141,
					142,
					142,
					142,
					142,
					143,
					143,
					143,
					143,
					144,
					144,
					144,
					144,
					145,
					144,
					145,
					144,
					145,
					144,
					145,
					144,
				],
				audio: null,
				flags: 0,
			},
		],
		useDefault: 0,
		useEntrance: 1,
		useFirst: 1,
		flags: FLAGS.demoPlay | FLAGS.noChildren,
		childId: PLAYLIST.BathDiveChild,
		edge: PLAYLIST.BathCoolDown,
		next: PLAYLIST.BathCoolDown,
	},
	{
		id: PLAYLIST.BathDiveChild,
		name: 'Bath Dive (Child)',
		/** @type {Array<RawMateAnimationScene>} */
		scene: [
			{
				startFrom: () => ({
					x: screenWidth() - 800 + TILE_SIZE + 10,
					y: screenHeight() - TILE_SIZE,
				}),
				start: 30,
				end: 30,
				repeat: 171,
				repeatFrom: 0,
				frames: [
					146,
				],
				audio: null,
				flags: 0,
			},
			{
				startFrom: null,
				start: 30,
				end: 30,
				repeat: 5,
				repeatFrom: 20,
				frames: [
					146,
					146,
					146,
					146,
					146,
					146,
					146,
					146,
					146,
					146,
					146,
					146,
					147,
					147,
					148,
					148,
					148,
					147,
					147,
					146,
					146,
					146,
					146,
					146,
					146,
					146,
					146,
					146,
					146,
					146,
					146,
					146,
				],
				audio: null,
				flags: 0,
			},
		],
		useDefault: 0,
		useEntrance: 0,
		useFirst: 0,
		flags: FLAGS.noParents,
		childId: 0,
		edge: null,
		next: null,
	},
	{
		id: PLAYLIST.Jump,
		name: 'Jump',
		/** @type {Array<RawMateAnimationScene>} */
		scene: [
			{
				startFrom: null,
				start: {
					x: -10,
					y: -8,
					speed: 100,
				},
				end: {
					x: -10,
					y: 10,
					speed: 100,
				},
				repeat: 0,
				repeatFrom: 0,
				frames: [
					76,
					30,
					30,
					30,
					30,
					23,
					23,
					23,
					23,
					23,
					24,
					24,
					24,
					24,
					77,
				],
				audio: null,
				flags: 0,
			},
		],
		useDefault: 1,
		useEntrance: 0,
		useFirst: 0,
		flags: FLAGS.demoPlay | FLAGS.noChildren,
		childId: 0,
		edge: [
			PLAYLIST.Boing,
		],
		next: [
			PLAYLIST.Run,
			PLAYLIST.Slide,
		],
	},
	{
		id: PLAYLIST.Eat,
		name: 'Eat',
		/** @type {Array<RawMateAnimationScene>} */
		scene: [
			{
				startFrom: null,
				start: 300,
				end: 300,
				repeat: 5,
				repeatFrom: 5,
				frames: [
					6,
					6,
					6,
					6,
					58,
					59,
					59,
					60,
					61,
					60,
					61,
					6,
				],
				audio: null,
				flags: FLAGS.forceGravity,
			},
		],
		useDefault: 1,
		useEntrance: 0,
		useFirst: 0,
		flags: FLAGS.demoPlay | FLAGS.noChildren,
		childId: PLAYLIST.FlowerChild,
		edge: null,
		next: PLAYLIST.Walk,
	},
	{
		id: PLAYLIST.FlowerChild,
		name: 'Flower (Child)',
		/** @type {Array<RawMateAnimationScene>} */
		scene: [
			{
				startFrom: null,
				start: 300,
				end: 300,
				repeat: 0,
				repeatFrom: 0,
				frames: [
					153,
					153,
					153,
					153,
					153,
					153,
					153,
					153,
					153,
					149,
					149,
					149,
					149,
					149,
					149,
					149,
					149,
					149,
					150,
					150,
					150,
					150,
					150,
					150,
					150,
					151,
					151,
					151,
					151,
					151,
					151,
					151,
					152,
					152,
					152,
					152,
					152,
					152,
					152,
					152,
					152,
					152,
					152,
					152,
					174,
					174,
					174,
				],
				audio: null,
				flags: 0,
			},
		],
		useDefault: 0,
		useEntrance: 0,
		useFirst: 0,
		flags: FLAGS.noParents,
		childId: 0,
		edge: null,
		next: null,
	},
	{
		id: PLAYLIST.BlackSheep,
		name: 'Black Sheep ',
		/** @type {Array<RawMateAnimationScene>} */
		scene: [
			{
				startFrom: () => ({
					x: screenWidth() + TILE_SIZE,
					y: screenHeight() - TILE_SIZE,
				}),
				start: {
					x: -10,
					y: 0,
					speed: 100,
				},
				end: {
					x: -10,
					y: 0,
					speed: 100,
				},
				repeat: () => Math.floor((screenWidth() / 2) / 30 - 6),
				repeatFrom: 0,
				frames: [
					5,
					4,
					4,
				],
				audio: null,
				flags: FLAGS.forceGravity,
			},
			{
				startFrom: null,
				start: {
					x: -6,
					y: 0,
					speed: 100,
				},
				end: 100,
				repeat: () => Math.floor(25 + (Math.floor(screenWidth() / 2) % 30) / 7),
				repeatFrom: 0,
				frames: [
					2,
					3,
				],
				audio: null,
				flags: FLAGS.forceGravity,
			},
			{
				startFrom: null,
				start: 500,
				end: 500,
				repeat: 0,
				repeatFrom: 0,
				frames: [
					8,
					3,
					3,
					3,
					127,
					128,
					129,
					130,
					130,
					130,
					130,
					129,
					128,
					127,
					3,
					3,
					3,
				],
				audio: null,
				flags: FLAGS.forceGravity,
			},
		],
		useDefault: 0,
		useEntrance: 1,
		useFirst: 1,
		flags: FLAGS.demoPlay | FLAGS.noChildren,
		childId: PLAYLIST.BlackSheepChild,
		edge: null,
		next: PLAYLIST.Walk,
	},
	{
		id: PLAYLIST.BlackSheepChild,
		name: 'Black Sheep (Child)',
		/** @type {Array<RawMateAnimationScene>} */
		scene: [
			{
				startFrom: () => ({
					x: 0 - TILE_SIZE,
					y: screenHeight() - TILE_SIZE,
				}),
				start: {
					x: 10,
					y: 0,
					speed: 100,
				},
				end: {
					x: 10,
					y: 0,
					speed: 100,
				},
				repeat: () => Math.floor((screenWidth() / 2) / 30 - 6),
				repeatFrom: 0,
				frames: [
					155,
					154,
					154,
				],
				audio: null,
				flags: FLAGS.forceGravity,
			},
			{
				startFrom: null,
				start: {
					x: 6,
					y: 0,
					speed: 100,
				},
				end: 100,
				repeat: () => Math.floor(24 + (Math.floor(screenWidth() / 2) % 30) / 7),
				repeatFrom: 0,
				frames: [
					156,
					157,
				],
				audio: null,
				flags: FLAGS.forceGravity,
			},
			{
				startFrom: null,
				start: 500,
				end: 500,
				repeat: 9,
				repeatFrom: 0,
				frames: [
					157,
				],
				audio: null,
				flags: FLAGS.forceGravity,
			},
			{
				startFrom: null,
				start: 20,
				end: 20,
				repeat: 20,
				repeatFrom: 0,
				frames: [
					157,
				],
				audio: null,
				flags: FLAGS.forceGravity,
			},
		],
		useDefault: 0,
		useEntrance: 0,
		useFirst: 0,
		flags: FLAGS.noParents,
		childId: 0,
		edge: null,
		next: null,
	},
	{
		id: PLAYLIST.BeginRun,
		name: 'Begin Run',
		/** @type {Array<RawMateAnimationScene>} */
		scene: [
			{
				startFrom: null,
				start: {
					x: -2,
					y: 0,
					speed: 200,
				},
				end: {
					x: -10,
					y: 0,
					speed: 100,
				},
				repeat: 0,
				repeatFrom: 0,
				frames: [
					2,
					3,
					2,
					5,
					4,
					5,
					4,
					5,
				],
				audio: null,
				flags: FLAGS.forceGravity,
			},
		],
		useDefault: 1,
		useEntrance: 0,
		useFirst: 0,
		flags: FLAGS.demoPlay | FLAGS.noChildren,
		childId: 0,
		edge: PLAYLIST.Boing,
		next: PLAYLIST.Run,
	},
	{
		id: PLAYLIST.RunEnd,
		name: 'Run (End)',
		/** @type {Array<RawMateAnimationScene>} */
		scene: [
			{
				startFrom: null,
				start: {
					x: -10,
					y: 0,
					speed: 100,
				},
				end: {
					x: -2,
					y: 0,
					speed: 200,
				},
				repeat: 0,
				repeatFrom: 0,
				frames: [
					5,
					4,
					5,
					4,
					5,
					3,
					2,
					3,
					2,
					3,
				],
				audio: null,
				flags: FLAGS.forceGravity,
			},
		],
		useDefault: 0,
		useEntrance: 0,
		useFirst: 0,
		flags: FLAGS.noChildren,
		childId: 0,
		edge: PLAYLIST.Boing,
		next: PLAYLIST.Walk,
	},
	{
		id: PLAYLIST.ClimbUp,
		name: 'Climb Up',
		/** @type {Array<RawMateAnimationScene>} */
		scene: [
			{
				startFrom: null,
				start: {
					x: 0,
					y: -2,
					speed: 150,
				},
				end: {
					x: 0,
					y: -2,
					speed: 150,
				},
				repeat: () => screenHeight() / 2,
				repeatFrom: 2,
				frames: [
					31,
					30,
					15,
					16,
				],
				audio: null,
				flags: 0,
			},
		],
		useDefault: 0,
		useEntrance: 0,
		useFirst: 0,
		flags: FLAGS.noChildren,
		childId: 0,
		edge: PLAYLIST.ReachCeiling,
		next: PLAYLIST.ClimbUp,
	},
	{
		id: PLAYLIST.ReachCeiling,
		name: 'Reach Ceiling',
		/** @type {Array<RawMateAnimationScene>} */
		scene: [
			{
				startFrom: null,
				start: 200,
				end: {
					x: 2,
					y: 0,
					speed: 200,
				},
				repeat: 0,
				repeatFrom: 0,
				frames: [
					16,
					17,
					28,
				],
				audio: null,
				flags: FLAGS.autoFlip,
			},
		],
		useDefault: 0,
		useEntrance: 0,
		useFirst: 0,
		flags: FLAGS.noChildren,
		childId: 0,
		edge: null,
		next: PLAYLIST.WalkUpsideDown,
	},
	{
		id: PLAYLIST.WalkUpsideDown,
		name: 'Walk Upside Down',
		/** @type {Array<RawMateAnimationScene>} */
		scene: [
			{
				startFrom: null,
				start: {
					x: -2,
					y: 0,
					speed: 150,
				},
				end: {
					x: -2,
					y: 0,
					speed: 150,
				},
				repeat: () => screenWidth() / 2,
				repeatFrom: 0,
				frames: [
					98,
					97,
				],
				audio: null,
				flags: 0,
			},
		],
		useDefault: 0,
		useEntrance: 0,
		useFirst: 0,
		flags: FLAGS.noChildren,
		childId: 0,
		edge: PLAYLIST.ReachSide,
		next: PLAYLIST.WalkUpsideDown,
	},
	{
		id: PLAYLIST.ReachSide,
		name: 'Reach Side',
		/** @type {Array<RawMateAnimationScene>} */
		scene: [
			{
				startFrom: null,
				start: 800,
				end: 800,
				repeat: 0,
				repeatFrom: 0,
				frames: [
					97,
					97,
				],
				audio: null,
				flags: FLAGS.autoFlip,
			},
		],
		useDefault: 0,
		useEntrance: 0,
		useFirst: 0,
		flags: FLAGS.noChildren,
		childId: 0,
		edge: null,
		next: PLAYLIST.ClimbDown,
	},
	{
		id: PLAYLIST.ClimbDown,
		name: 'Climb Down',
		/** @type {Array<RawMateAnimationScene>} */
		scene: [
			{
				startFrom: null,
				start: {
					x: 0,
					y: 2,
					speed: 150,
				},
				end: {
					x: 0,
					y: 2,
					speed: 150,
				},
				repeat: () => screenHeight() / 2,
				repeatFrom: 0,
				frames: [
					19,
					20,
				],
				audio: null,
				flags: 0,
			},
		],
		useDefault: 0,
		useEntrance: 0,
		useFirst: 0,
		flags: FLAGS.noChildren,
		childId: 0,
		edge: PLAYLIST.ReachFloor,
		next: PLAYLIST.ClimbDown,
	},
	{
		id: PLAYLIST.ReachFloor,
		name: 'Reach Floor',
		/** @type {Array<RawMateAnimationScene>} */
		scene: [
			{
				startFrom: null,
				start: 200,
				end: 200,
				repeat: 0,
				repeatFrom: 0,
				frames: [
					24,
					6,
					6,
					6,
					6,
					6,
				],
				audio: null,
				flags: 0,
			},
		],
		useDefault: 0,
		useEntrance: 0,
		useFirst: 0,
		flags: FLAGS.noChildren,
		childId: 0,
		edge: null,
		next: PLAYLIST.Walk,
	},
	{
		id: PLAYLIST.Beg,
		name: 'Beg',
		/** @type {Array<RawMateAnimationScene>} */
		scene: [
			{
				startFrom: null,
				start: 200,
				end: 200,
				repeat: 0,
				repeatFrom: 0,
				frames: [
					52,
					53,
					54,
					55,
					54,
					55,
					54,
					55,
					34,
					34,
					34,
					34,
					34,
					34,
					31,
				],
				audio: null,
				flags: FLAGS.forceGravity,
			},
		],
		useDefault: 1,
		useEntrance: 0,
		useFirst: 0,
		flags: FLAGS.demoPlay | FLAGS.noChildren,
		childId: 0,
		edge: null,
		next: PLAYLIST.Walk,
	},
	{
		id: PLAYLIST.Bleat,
		name: 'Bleat',
		/** @type {Array<RawMateAnimationScene>} */
		scene: [
			{
				startFrom: null,
				start: 200,
				end: 200,
				repeat: 0,
				repeatFrom: 0,
				frames: [
					3,
					71,
					72,
					71,
					72,
					71,
					3,
				],
				audio: {
					file: 'BAA',
					start: 1,
				},
				flags: FLAGS.forceGravity,
			},
		],
		useDefault: 1,
		useEntrance: 0,
		useFirst: 0,
		flags: FLAGS.demoPlay | FLAGS.noChildren,
		childId: 0,
		edge: null,
		next: PLAYLIST.Walk,
	},
	{
		id: PLAYLIST.Handstand,
		name: 'Handstand',
		/** @type {Array<RawMateAnimationScene>} */
		scene: [
			{
				startFrom: null,
				start: {
					x: -2,
					y: 0,
					speed: 200,
				},
				end: {
					x: -2,
					y: 0,
					speed: 200,
				},
				repeat: 0,
				repeatFrom: 0,
				frames: [
					86,
					87,
					88,
					89,
					90,
					88,
					89,
					90,
					87,
					86,
				],
				audio: null,
				flags: FLAGS.forceGravity,
			},
		],
		useDefault: 1,
		useEntrance: 0,
		useFirst: 0,
		flags: FLAGS.demoPlay | FLAGS.noChildren,
		childId: 0,
		edge: null,
		next: PLAYLIST.Walk,
	},
	{
		id: PLAYLIST.Slide,
		name: 'Slide',
		/** @type {Array<RawMateAnimationScene>} */
		scene: [
			{
				startFrom: null,
				start: {
					x: -4,
					y: 0,
					speed: 50,
				},
				end: 200,
				repeat: 0,
				repeatFrom: 0,
				frames: [
					24,
					23,
					23,
					23,
					23,
					23,
					31,
					3,
					3,
					3,
					3,
				],
				audio: null,
				flags: FLAGS.forceGravity,
			},
		],
		useDefault: 0,
		useEntrance: 0,
		useFirst: 0,
		flags: FLAGS.demoPlay | FLAGS.noChildren,
		childId: 0,
		edge: null,
		next: PLAYLIST.Walk,
	},
	{
		id: PLAYLIST.BathCoolDown,
		name: 'Bath Cool Down',
		/** @type {Array<RawMateAnimationScene>} */
		scene: [
			{
				startFrom: null,
				start: 100,
				end: 100,
				repeat: 2,
				repeatFrom: 0,
				frames: [
					169,
					169,
					169,
					170,
					171,
					170,
					169,
					169,
				],
				audio: null,
				flags: FLAGS.forceGravity,
			},
			{
				startFrom: null,
				start: 100,
				end: 100,
				repeat: 0,
				repeatFrom: 0,
				frames: [
					119,
					81,
					81,
					82,
					82,
					10,
				],
				audio: null,
				flags: FLAGS.forceGravity,
			},
		],
		useDefault: 0,
		useEntrance: 0,
		useFirst: 0,
		flags: FLAGS.noChildren,
		childId: 0,
		edge: null,
		next: null,
	},
	{
		id: PLAYLIST.Roll,
		name: 'Roll',
		/** @type {Array<RawMateAnimationScene>} */
		scene: [
			{
				startFrom: null,
				start: 200,
				end: 200,
				repeat: 0,
				repeatFrom: 0,
				frames: [
					9,
					10,
					10,
				],
				audio: null,
				flags: FLAGS.forceGravity,
			},
			{
				startFrom: null,
				start: {
					x: -8,
					y: 0,
					speed: 100,
				},
				end: {
					x: -8,
					y: 0,
					speed: 100,
				},
				repeat: 1,
				repeatFrom: 0,
				frames: [
					10,
					118,
					117,
					116,
					115,
					114,
					113,
					112,
				],
				audio: null,
				flags: FLAGS.forceGravity,
			},
			{
				startFrom: null,
				start: 200,
				end: 200,
				repeat: 0,
				repeatFrom: 0,
				frames: [
					10,
					10,
					9,
				],
				audio: null,
				flags: FLAGS.forceGravity,
			},
		],
		useDefault: 1,
		useEntrance: 0,
		useFirst: 0,
		flags: FLAGS.demoPlay | FLAGS.noChildren,
		childId: 0,
		edge: null,
		next: PLAYLIST.Walk,
	},
	{
		id: PLAYLIST.Sneeze,
		name: 'Sneeze',
		/** @type {Array<RawMateAnimationScene>} */
		scene: [
			{
				startFrom: null,
				start: 200,
				end: 200,
				repeat: 0,
				repeatFrom: 0,
				frames: [
					108,
					109,
					110,
					111,
					110,
					111,
					110,
					3,
				],
				audio: {
					file: 'SNEEZE',
					start: 0,
				},
				flags: FLAGS.forceGravity,
			},
		],
		useDefault: 1,
		useEntrance: 0,
		useFirst: 0,
		flags: FLAGS.demoPlay | FLAGS.noChildren,
		childId: 0,
		edge: null,
		next: PLAYLIST.Walk,
	},
	{
		id: PLAYLIST.Scratch,
		name: 'Scratch',
		/** @type {Array<RawMateAnimationScene>} */
		scene: [
			{
				startFrom: null,
				start: 200,
				end: 200,
				repeat: 3,
				repeatFrom: 0,
				frames: [
					56,
					57,
				],
				audio: null,
				flags: FLAGS.forceGravity,
			},
		],
		useDefault: 1,
		useEntrance: 0,
		useFirst: 0,
		flags: FLAGS.demoPlay | FLAGS.noChildren,
		childId: 0,
		edge: null,
		next: null,
	},
	{
		id: PLAYLIST.Stargaze,
		name: 'Stargaze',
		/** @type {Array<RawMateAnimationScene>} */
		scene: [
			{
				startFrom: () => ({
					x: screenWidth(),
					y: screenHeight() - TILE_SIZE,
				}),
				start: {
					x: -2,
					y: 0,
					speed: 100,
				},
				end: {
					x: -2,
					y: 0,
					speed: 100,
				},
				repeat: 10,
				repeatFrom: 0,
				frames: [
					2,
					3,
				],
				audio: null,
				flags: FLAGS.forceGravity,
			},
			{
				startFrom: null,
				start: 50,
				end: 50,
				repeat: 15,
				repeatFrom: 5,
				frames: [
					3,
					3,
					3,
					3,
					3,
					73,
				],
				audio: null,
				flags: FLAGS.forceGravity,
			},
		],
		useDefault: 0,
		useEntrance: 1,
		useFirst: 1,
		flags: FLAGS.demoPlay | FLAGS.noChildren,
		childId: PLAYLIST.StargazeChild,
		edge: null,
		next: PLAYLIST.Scream,
	},
	{
		id: PLAYLIST.StargazeChild,
		name: 'Stargaze (Child)',
		/** @type {Array<RawMateAnimationScene>} */
		scene: [
			{
				startFrom: () => ({
					x: 0 - TILE_SIZE,
					y: TILE_SIZE * 2,
				}),
				start: 100,
				end: 100,
				repeat: 20,
				repeatFrom: 0,
				frames: [
					158,
				],
				audio: null,
				flags: FLAGS.ignoreEdges,
			},
			{
				startFrom: null,
				start: {
					x: 5,
					y: -1,
					speed: 25,
				},
				end: {
					x: 5,
					y: -1,
					speed: 25,
				},
				repeat: 40,
				repeatFrom: 0,
				frames: [
					158,
					159,
					160,
					161,
				],
				audio: null,
				flags: FLAGS.ignoreEdges,
			},
		],
		useDefault: 0,
		useEntrance: 0,
		useFirst: 0,
		flags: FLAGS.noParents,
		childId: 0,
		edge: null,
		next: null,
	},
	{
		id: PLAYLIST.Abduction,
		name: 'Abduction',
		/** @type {Array<RawMateAnimationScene>} */
		scene: [
			{
				startFrom: null,
				start: 200,
				end: 200,
				repeat: 10,
				repeatFrom: 5,
				frames: [
					9,
					10,
					10,
					10,
					10,
					34,
				],
				audio: null,
				flags: FLAGS.forceGravity,
			},
			{
				startFrom: null,
				start: 25,
				end: 25,
				repeat: () => screenWidth() / 4,
				repeatFrom: 47,
				frames: [
					34,
					34,
					34,
					34,
					34,
					34,
					175,
					34,
					175,
					86,
					86,
					175,
					86,
					175,
					86,
					175,
					175,
					34,
					175,
					86,
					86,
					175,
					86,
					175,
					86,
					175,
					86,
					175,
					175,
					34,
					175,
					86,
					86,
					175,
					86,
					175,
					86,
					175,
					175,
					34,
					175,
					86,
					86,
					175,
					86,
					175,
					86,
					175,
				],
				audio: null,
				flags: FLAGS.forceGravity | FLAGS.ignoreEdges,
			},
		],
		useDefault: 1,
		useEntrance: 0,
		useFirst: 0,
		flags: FLAGS.demoPlay | FLAGS.noChildren,
		childId: PLAYLIST.AbductionChild,
		edge: null,
		next: PLAYLIST.ChasingAMartian,
	},
	{
		id: PLAYLIST.AbductionChild,
		name: 'Abduction (Child)',
		/** @type {Array<RawMateAnimationScene>} */
		scene: [
			{
				startFrom: null,
				start: {
					x: 0,
					y: 4,
					speed: 25,
				},
				end: {
					x: 0,
					y: 4,
					speed: 25,
				},
				repeat: 29,
				repeatFrom: 0,
				frames: [
					158,
					159,
					160,
					161,
				],
				audio: null,
				flags: FLAGS.ignoreEdges,
			},
		],
		useDefault: 0,
		useEntrance: 0,
		useFirst: 0,
		flags: FLAGS.noParents,
		childId: 0,
		edge: null,
		next: PLAYLIST.AbductionBeamingChild,
	},
	{
		id: PLAYLIST.AbductionBeamingChild,
		name: 'Abduction Beaming (Child)',
		/** @type {Array<RawMateAnimationScene>} */
		scene: [
			{
				startFrom: null,
				start: 25,
				end: 25,
				repeat: 11,
				repeatFrom: 0,
				frames: [
					162,
					163,
					164,
					165,
				],
				audio: null,
				flags: FLAGS.ignoreEdges,
			},
			{
				startFrom: null,
				start: {
					x: 4,
					y: -1,
					speed: 25,
				},
				end: {
					x: 4,
					y: -1,
					speed: 25,
				},
				repeat: () => screenWidth() / 16,
				repeatFrom: 0,
				frames: [
					158,
					159,
					160,
					161,
				],
				audio: null,
				flags: FLAGS.ignoreEdges,
			},
		],
		useDefault: 0,
		useEntrance: 0,
		useFirst: 0,
		flags: FLAGS.noParents,
		childId: PLAYLIST.AbductionBeamChild,
		edge: null,
		next: null,
	},
	{
		id: PLAYLIST.AbductionBeamChild,
		name: 'Abduction Beam (Child)',
		/** @type {Array<RawMateAnimationScene>} */
		scene: [
			{
				startFrom: null,
				start: 25,
				end: 25,
				repeat: 35,
				repeatFrom: 7,
				frames: [
					175,
					175,
					175,
					175,
					172,
					172,
					175,
					172,
				],
				audio: null,
				flags: FLAGS.ignoreEdges,
			},
		],
		useDefault: 0,
		useEntrance: 0,
		useFirst: 0,
		flags: FLAGS.noParents,
		childId: 0,
		edge: null,
		next: null,
	},
	{
		id: PLAYLIST.ChasingAMartian,
		name: 'Chasing a Martian!',
		/** @type {Array<RawMateAnimationScene>} */
		scene: [
			{
				startFrom: () => ({
					x: screenWidth() + TILE_SIZE * 3,
					y: screenHeight() - TILE_SIZE,
				}),
				start: {
					x: -10,
					y: 0,
					speed: 100,
				},
				end: {
					x: -10,
					y: 0,
					speed: 100,
				},
				repeat: () => screenWidth() / 2 / 30,
				repeatFrom: 0,
				frames: [
					5,
					4,
					4,
				],
				audio: null,
				flags: FLAGS.forceGravity,
			},
		],
		useDefault: 0,
		useEntrance: 1,
		useFirst: 1,
		flags: FLAGS.demoPlay | FLAGS.noChildren,
		childId: PLAYLIST.ChasingAMartianChild,
		edge: null,
		next: PLAYLIST.Bleat,
	},
	{
		id: PLAYLIST.ChasingAMartianChild,
		name: 'Chasing a Martian! (Child)',
		/** @type {Array<RawMateAnimationScene>} */
		scene: [
			{
				startFrom: () => ({
					x: screenWidth() + TILE_SIZE,
					y: screenHeight() - TILE_SIZE,
				}),
				start: {
					x: -12,
					y: 0,
					speed: 100,
				},
				end: {
					x: -12,
					y: 0,
					speed: 100,
				},
				repeat: () => screenWidth() / 48 + 4,
				repeatFrom: 0,
				frames: [
					166,
					167,
					166,
					168,
				],
				audio: null,
				flags: FLAGS.allowExit | FLAGS.forceGravity | FLAGS.ignoreEdges,
			},
		],
		useDefault: 0,
		useEntrance: 0,
		useFirst: 0,
		flags: FLAGS.noParents,
		childId: 0,
		edge: null,
		next: null,
	},
	{
		id: PLAYLIST.Spin,
		name: 'Spin',
		/** @type {Array<RawMateAnimationScene>} */
		scene: [
			{
				startFrom: null,
				start: 100,
				end: 100,
				repeat: 0,
				repeatFrom: 0,
				frames: [
					3,
					9,
					10,
					11,
					14,
					13,
					12,
					7,
					9,
					101,
					11,
					14,
					13,
					12,
				],
				audio: null,
				flags: FLAGS.forceGravity,
			},
		],
		useDefault: 1,
		useEntrance: 0,
		useFirst: 0,
		flags: FLAGS.demoPlay | FLAGS.noChildren,
		childId: 0,
		edge: null,
		next: [
			PLAYLIST.PlayDead,
			PLAYLIST.Sneeze,
		],
	},
];

/**
 * Max Animation ID
 *
 * @const {number}
 */
export const MAX_ANIMATION = ANIMATIONS.length;

/**
 * Animtaions that can be used as a first sequence.
 *
 * @const {Array<(number|MateAnimationPossibility)>}
 */
export const DEFAULT_CHOICES = ANIMATIONS.reduce(
	/**
	 * Collect Animations
	 *
	 * @param {Array<(number|MateAnimationPossibility)>} out Collection.
	 * @param {RawMateAnimation} v Animation.
	 * @return {Array<(number|MateAnimationPossibility)>} Collection.
	 */
	(out, v) => {
		if (1 === v.useDefault) {
			out.push(v.id);
		}
		else if (v.useDefault) {
			/** @type {MateAnimationPossibility} */
			const weight = {
				weight: v.useDefault,
				id: v.id,
			};

			out.push(weight);
		}

		return out;
	},
	[]
);

/**
 * Animations that begin from offscreen.
 *
 * @const {Array<(number|MateAnimationPossibility)>}
 */
export const ENTRANCE_CHOICES = ANIMATIONS.reduce(
	/**
	 * Collect Animations
	 *
	 * @param {Array<(number|MateAnimationPossibility)>} out Collection.
	 * @param {RawMateAnimation} v Animation.
	 * @return {Array<(number|MateAnimationPossibility)>} Collection.
	 */
	(out, v) => {
		if (1 === v.useEntrance) {
			out.push(v.id);
		}
		else if (v.useEntrance) {
			/** @type {MateAnimationPossibility} */
			const weight = {
				weight: v.useEntrance,
				id: v.id,
			};

			out.push(weight);
		}

		return out;
	},
	[]
);

/**
 * Animations to kick things off with.
 *
 * @const {Array<(number|MateAnimationPossibility)>}
 */
export const FIRST_CHOICES = ANIMATIONS.reduce(
	/**
	 * Collect Animations
	 *
	 * @param {Array<(number|MateAnimationPossibility)>} out Collection.
	 * @param {RawMateAnimation} v Animation.
	 * @return {Array<(number|MateAnimationPossibility)>} Collection.
	 */
	(out, v) => {
		if (1 === v.useFirst) {
			out.push(v.id);
		}
		else if (v.useFirst) {
			/** @type {MateAnimationPossibility} */
			const weight = {
				weight: v.useFirst,
				id: v.id,
			};

			out.push(weight);
		}

		return out;
	},
	[]
);

/**
 * Child animations.
 *
 * @const {Set<number>}
 */
export const CHILD_ANIMATIONS = ANIMATIONS.reduce(
	/**
	 * Collect Animations
	 *
	 * @param {Set<number>} out Collection.
	 * @param {RawMateAnimation} v Animation.
	 * @return {Set<number>} Collection.
	 */
	(out, v) => {
		if (FLAGS.noParents & v.flags) {
			out.add(v.id);
		}

		return out;
	},
	new Set()
);



// ---------------------------------------------------------------------
// Misc Helpers
// ---------------------------------------------------------------------

/**
 * A Single Animation
 *
 * @param {number} id Animation ID.
 * @return {?MateAnimation} Animation.
 */
export const animation = function(id) {
	if (! verifyAnimationId(id)) {
		return null;
	}

	/** @type {RawMateAnimation} */
	const value = ANIMATIONS[id - 1];

	return /** @type {MateAnimation} */ ({
		id: value.id,
		name: value.name,
		scene: standardizeMateAnimationScene(value.scene),
		useDefault: value.useDefault,
		useEntrance: value.useEntrance,
		useFirst: value.useFirst,
		flags: value.flags,
		childId: value.childId,
		edge: value.edge,
		next: value.next,
	});
};

/**
 * Standardize MateAnimationPosition
 *
 * @param {(null|MateAnimationPositionCB|MateAnimationPosition)} position Position.
 * @return {?MateAnimationPosition} Position.
 */
export const standardizeMateAnimationPosition = function(position) {
	// Most animations lack this attribute, in which case null it is.
	if (null === position) {
		return null;
	}

	// Resolve the callback.
	if ('function' === typeof position) {
		position = /** @type {MateAnimationPositionCB} */ (position());
	}

	if (
		('object' !== typeof position) ||
		(null === position) ||
		('number' !== typeof position.x) ||
		('number' !== typeof position.y)
	) {
		return null;
	}

	return /** @type {MateAnimationPosition} */ (position);
};

/**
 * Standardize MateAnimationScene
 *
 * @param {Array<RawMateAnimationScene>} scenes Scenes.
 * @return {Array<MateAnimationScene>} Scenes.
 */
export const standardizeMateAnimationScene = function(scenes) {
	/** @type {Array<MateAnimationScene>} */
	let out = [];

	/** @type {number} */
	const length = scenes.length;

	for (let i = 0; i < length; ++i) {
		const v = /** @type {!RawMateAnimationScene} */ (scenes[i]);

		out.push(/** @type {!MateAnimationScene} */ ({
			startFrom: ('function' === typeof v.startFrom ? v.startFrom() : v.startFrom),
			start: standardizeMateAnimationState(v.start),
			end: standardizeMateAnimationState(v.end),
			repeat: ('function' === typeof v.repeat ? v.repeat() : v.repeat),
			repeatFrom: v.repeatFrom,
			frames: v.frames,
			audio: v.audio,
			flags: v.flags,
		}));
	}

	return out;
};

/**
 * Standardize MateAnimationState
 *
 * @param {(number|MateAnimationStateCB|!MateAnimationState)} state State.
 * @return {MateAnimationState} State.
 */
export const standardizeMateAnimationState = function(state) {
	// Resolve the callback.
	if ('function' === typeof state) {
		state = /** @type {MateAnimationState} */ (state());
	}

	// A number by itself indicates the speed (without x/y movement).
	if ('number' === typeof state) {
		state = /** @type {MateAnimationState} */ ({
			x: 0,
			y: 0,
			speed: state,
		});
	}
	// Otherwise make sure it has the right bits.
	else if (
		('object' !== typeof state) ||
		(null === state) ||
		('number' !== typeof state.x) ||
		('number' !== typeof state.y) ||
		('number' !== typeof state.speed)
	) {
		// We have to return something, so here's a good default.
		state = /** @type {MateAnimationState} */ ({
			x: 0,
			y: 0,
			speed: 100,
		});
	}

	return /** @type {MateAnimationState} */ (state);
};

/**
 * Verify Animation ID
 *
 * @param {number} id Animation ID.
 * @return {boolean} True/false.
 */
export const verifyAnimationId = function(id) {
	id = parseInt(id, 10) || -1;
	return 0 < id && MAX_ANIMATION >= id;
};
