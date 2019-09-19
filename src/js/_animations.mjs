/**
 * @file Animations
 */

import { screenHeight, screenWidth } from './_helpers.mjs';
import { TILE_SIZE } from './_image.mjs';
import { MateAnimationPossibility, MateAnimation, RawMateAnimation } from './_types.mjs';



// ---------------------------------------------------------------------
// Animations
// ---------------------------------------------------------------------

/**
 * All Animations
 *
 * @const {Object<!RawMateAnimation>}
 */
export const ANIMATIONS = {
	/** @type {RawMateAnimation} */
	1: {
		id: 1,
		name: 'Walk',
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
		allowExit: true,
		autoFlip: false,
		defaultChoice: 1,
		forceGravity: true,
		ignoreEdges: false,
		offscreenChoice: 0,
		startupChoice: 0,
		childId: 0,
		edge: [
			{
				weight: 5,
				id: 2,
			},
			37,
		],
		next: [
			// Walk.
			{
				weight: 10,
				id: 1,
			},
			// Urinate.
			11,
			// Sleep.
			15,
			// Bored sleep.
			19,
			// Eat.
			{
				weight: 2,
				id: 26,
			},
			// Begin run.
			{
				weight: 4,
				id: 35,
			},
			// Beg.
			{
				weight: 2,
				id: 43,
			},
			// Bleat.
			44,
			// Handstand.
			{
				weight: 2,
				id: 45,
			},
			// Roll start.
			49,
			// Sneeze.
			52,
			// Belly Scratch.
			{
				weight: 2,
				id: 53,
			},
		],
	},
	/** @type {RawMateAnimation} */
	2: {
		id: 2,
		name: 'Rotate',
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
		allowExit: false,
		autoFlip: true,
		defaultChoice: 1,
		forceGravity: true,
		ignoreEdges: false,
		offscreenChoice: 0,
		startupChoice: 0,
		childId: 0,
		edge: null,
		next: 3,
	},
	/** @type {RawMateAnimation} */
	3: {
		id: 3,
		name: 'Rotate (End)',
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
		allowExit: false,
		autoFlip: false,
		defaultChoice: 0,
		forceGravity: true,
		ignoreEdges: false,
		offscreenChoice: 0,
		startupChoice: 0,
		childId: 0,
		edge: null,
		next: [
			{
				weight: 10,
				id: 1,
			},
			26,
		],
	},
	/** @type {RawMateAnimation} */
	4: {
		id: 4,
		name: 'Drag',
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
		allowExit: false,
		autoFlip: false,
		defaultChoice: 0,
		forceGravity: false,
		ignoreEdges: false,
		offscreenChoice: 0,
		startupChoice: 0,
		childId: 0,
		edge: null,
		next: 4,
	},
	/** @type {RawMateAnimation} */
	5: {
		id: 5,
		name: 'Fall',
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
		allowExit: false,
		autoFlip: false,
		defaultChoice: 0,
		forceGravity: false,
		ignoreEdges: false,
		offscreenChoice: 1,
		startupChoice: 10,
		childId: 0,
		edge: 9,
		next: 6,
	},
	/** @type {RawMateAnimation} */
	6: {
		id: 6,
		name: 'Grasping Fall',
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
		allowExit: false,
		autoFlip: false,
		defaultChoice: 0,
		forceGravity: false,
		ignoreEdges: false,
		offscreenChoice: 1,
		startupChoice: 0,
		childId: 0,
		edge: [
			{
				weight: 3,
				id: 10,
			},
			9,
			13,
		],
		next: 6,
	},
	/** @type {RawMateAnimation} */
	7: {
		id: 7,
		name: 'Run',
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
		allowExit: true,
		autoFlip: false,
		defaultChoice: 1,
		forceGravity: true,
		ignoreEdges: false,
		offscreenChoice: 0,
		startupChoice: 0,
		childId: 0,
		edge: 8,
		next: [
			{
				weight: 2,
				id: 7,
			},
			{
				weight: 4,
				id: 36,
			},
			{
				weight: 3,
				id: 25,
			},
		],
	},
	/** @type {RawMateAnimation} */
	8: {
		id: 8,
		name: 'Boing!',
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
		allowExit: false,
		autoFlip: false,
		defaultChoice: 0,
		forceGravity: true,
		ignoreEdges: false,
		offscreenChoice: 0,
		startupChoice: 0,
		childId: 0,
		edge: null,
		next: [
			{
				weight: 8,
				id: 2,
			},
			7,
			{
				weight: 4,
				id: 1,
			},
		],
	},
	/** @type {RawMateAnimation} */
	9: {
		id: 9,
		name: 'Bounce',
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
		allowExit: false,
		autoFlip: false,
		defaultChoice: 0,
		forceGravity: true,
		ignoreEdges: false,
		offscreenChoice: 0,
		startupChoice: 0,
		childId: 0,
		edge: null,
		next: 65,
	},
	/** @type {RawMateAnimation} */
	10: {
		id: 10,
		name: 'Hard Fall',
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
		allowExit: false,
		autoFlip: false,
		defaultChoice: 0,
		forceGravity: false,
		ignoreEdges: false,
		offscreenChoice: 0,
		startupChoice: 0,
		childId: 0,
		edge: null,
		next: 1,
	},
	/** @type {RawMateAnimation} */
	11: {
		id: 11,
		name: 'Urinate',
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
		allowExit: false,
		autoFlip: false,
		defaultChoice: 1,
		forceGravity: true,
		ignoreEdges: false,
		offscreenChoice: 0,
		startupChoice: 0,
		childId: 0,
		edge: null,
		next: 12,
	},
	/** @type {RawMateAnimation} */
	12: {
		id: 12,
		name: 'Urinate (End)',
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
		allowExit: false,
		autoFlip: false,
		defaultChoice: 0,
		forceGravity: true,
		ignoreEdges: false,
		offscreenChoice: 0,
		startupChoice: 0,
		childId: 0,
		edge: null,
		next: 1,
	},
	/** @type {RawMateAnimation} */
	13: {
		id: 13,
		name: 'Play Dead',
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
		allowExit: false,
		autoFlip: false,
		defaultChoice: 1,
		forceGravity: true,
		ignoreEdges: false,
		offscreenChoice: 0,
		startupChoice: 0,
		childId: 0,
		edge: null,
		next: 1,
	},
	/** @type {RawMateAnimation} */
	14: {
		id: 14,
		name: 'Scream!',
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
		allowExit: false,
		autoFlip: false,
		defaultChoice: 1,
		forceGravity: true,
		ignoreEdges: false,
		offscreenChoice: 0,
		startupChoice: 0,
		childId: 0,
		edge: null,
		next: 7,
	},
	/** @type {RawMateAnimation} */
	15: {
		id: 15,
		name: 'Sleep',
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
		allowExit: false,
		autoFlip: false,
		defaultChoice: 1,
		forceGravity: true,
		ignoreEdges: false,
		offscreenChoice: 0,
		startupChoice: 0,
		childId: 0,
		edge: null,
		next: 16,
	},
	/** @type {RawMateAnimation} */
	16: {
		id: 16,
		name: 'Sleep (Wake)',
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
		allowExit: false,
		autoFlip: false,
		defaultChoice: 0,
		forceGravity: true,
		ignoreEdges: false,
		offscreenChoice: 0,
		startupChoice: 0,
		childId: 0,
		edge: null,
		next: 1,
	},
	/** @type {RawMateAnimation} */
	17: {
		id: 17,
		name: 'Doze',
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
		allowExit: false,
		autoFlip: false,
		defaultChoice: 1,
		forceGravity: true,
		ignoreEdges: false,
		offscreenChoice: 0,
		startupChoice: 0,
		childId: 0,
		edge: null,
		next: 18,
	},
	/** @type {RawMateAnimation} */
	18: {
		id: 18,
		name: 'Doze (Wake)',
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
		allowExit: false,
		autoFlip: false,
		defaultChoice: 0,
		forceGravity: true,
		ignoreEdges: false,
		offscreenChoice: 0,
		startupChoice: 0,
		childId: 0,
		edge: null,
		next: 7,
	},
	/** @type {RawMateAnimation} */
	19: {
		id: 19,
		name: 'Bored Sleep',
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
		allowExit: false,
		autoFlip: false,
		defaultChoice: 1,
		forceGravity: true,
		ignoreEdges: false,
		offscreenChoice: 0,
		startupChoice: 0,
		childId: 0,
		edge: null,
		next: 20,
	},
	/** @type {RawMateAnimation} */
	20: {
		id: 20,
		name: 'Bored Sleep (Wake)',
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
		allowExit: false,
		autoFlip: false,
		defaultChoice: 0,
		forceGravity: true,
		ignoreEdges: false,
		offscreenChoice: 0,
		startupChoice: 0,
		childId: 0,
		edge: null,
		next: 1,
	},
	/** @type {RawMateAnimation} */
	21: {
		id: 21,
		name: 'Bath Dive',
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
		allowExit: false,
		autoFlip: false,
		defaultChoice: 0,
		forceGravity: false,
		ignoreEdges: false,
		offscreenChoice: 1,
		startupChoice: 1,
		childId: 23,
		edge: null,
		next: 22,
	},
	/** @type {RawMateAnimation} */
	22: {
		id: 22,
		name: 'Bath Dive (Burning Up)',
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
		allowExit: false,
		autoFlip: false,
		defaultChoice: 0,
		forceGravity: false,
		ignoreEdges: false,
		offscreenChoice: 0,
		startupChoice: 0,
		childId: 0,
		edge: 47,
		next: 47,
	},
	/** @type {RawMateAnimation} */
	23: {
		id: 23,
		name: 'Bath Dive Tub (Child)',
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
		allowExit: false,
		autoFlip: false,
		defaultChoice: 0,
		forceGravity: false,
		ignoreEdges: false,
		offscreenChoice: 0,
		startupChoice: 0,
		childId: 0,
		edge: null,
		next: 24,
	},
	/** @type {RawMateAnimation} */
	24: {
		id: 24,
		name: 'Bath Splash (Child)',
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
		allowExit: false,
		autoFlip: false,
		defaultChoice: 0,
		forceGravity: false,
		ignoreEdges: false,
		offscreenChoice: 0,
		startupChoice: 0,
		childId: 0,
		edge: null,
		next: null,
	},
	/** @type {RawMateAnimation} */
	25: {
		id: 25,
		name: 'Jump',
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
		allowExit: false,
		autoFlip: false,
		defaultChoice: 1,
		forceGravity: false,
		ignoreEdges: false,
		offscreenChoice: 0,
		startupChoice: 0,
		childId: 0,
		edge: [
			{
				weight: 4,
				id: 7,
			},
			36,
		],
		next: 7,
	},
	/** @type {RawMateAnimation} */
	26: {
		id: 26,
		name: 'Eat',
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
		allowExit: false,
		autoFlip: false,
		defaultChoice: 1,
		forceGravity: true,
		ignoreEdges: false,
		offscreenChoice: 0,
		startupChoice: 0,
		childId: 27,
		edge: null,
		next: 1,
	},
	/** @type {RawMateAnimation} */
	27: {
		id: 27,
		name: 'Flower (Child)',
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
		allowExit: false,
		autoFlip: false,
		defaultChoice: 0,
		forceGravity: false,
		ignoreEdges: false,
		offscreenChoice: 0,
		startupChoice: 0,
		childId: 0,
		edge: null,
		next: null,
	},
	/** @type {RawMateAnimation} */
	28: {
		id: 28,
		name: 'Black Sheep Frolic',
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
		allowExit: false,
		autoFlip: false,
		defaultChoice: 0,
		forceGravity: true,
		ignoreEdges: false,
		offscreenChoice: 1,
		startupChoice: 1,
		childId: 31,
		edge: null,
		next: 29,
	},
	/** @type {RawMateAnimation} */
	29: {
		id: 29,
		name: 'Black Sheep Approach',
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
		allowExit: false,
		autoFlip: false,
		defaultChoice: 0,
		forceGravity: true,
		ignoreEdges: false,
		offscreenChoice: 0,
		startupChoice: 0,
		childId: 0,
		edge: null,
		next: 30,
	},
	/** @type {RawMateAnimation} */
	30: {
		id: 30,
		name: 'Black Sheep Romance',
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
		allowExit: false,
		autoFlip: false,
		defaultChoice: 0,
		forceGravity: true,
		ignoreEdges: false,
		offscreenChoice: 0,
		startupChoice: 0,
		childId: 0,
		edge: null,
		next: 1,
	},
	/** @type {RawMateAnimation} */
	31: {
		id: 31,
		name: 'Black Sheep Frolic (Child)',
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
		allowExit: false,
		autoFlip: false,
		defaultChoice: 0,
		forceGravity: false,
		ignoreEdges: false,
		offscreenChoice: 0,
		startupChoice: 0,
		childId: 0,
		edge: null,
		next: 32,
	},
	/** @type {RawMateAnimation} */
	32: {
		id: 32,
		name: 'Black Sheep Approach (Child)',
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
		allowExit: false,
		autoFlip: false,
		defaultChoice: 0,
		forceGravity: false,
		ignoreEdges: false,
		offscreenChoice: 0,
		startupChoice: 0,
		childId: 0,
		edge: null,
		next: 33,
	},
	/** @type {RawMateAnimation} */
	33: {
		id: 33,
		name: 'Black Sheep Romance (Child)',
		startFrom: null,
		start: 500,
		end: 500,
		repeat: 9,
		repeatFrom: 0,
		frames: [
			157,
		],
		audio: null,
		allowExit: false,
		autoFlip: false,
		defaultChoice: 0,
		forceGravity: false,
		ignoreEdges: false,
		offscreenChoice: 0,
		startupChoice: 0,
		childId: 0,
		edge: null,
		next: 34,
	},
	/** @type {RawMateAnimation} */
	34: {
		id: 34,
		name: 'Black Sheep Final (Child)',
		startFrom: null,
		start: 20,
		end: 20,
		repeat: 20,
		repeatFrom: 0,
		frames: [
			157,
		],
		audio: null,
		allowExit: false,
		autoFlip: false,
		defaultChoice: 0,
		forceGravity: false,
		ignoreEdges: false,
		offscreenChoice: 0,
		startupChoice: 0,
		childId: 0,
		edge: null,
		next: null,
	},
	/** @type {RawMateAnimation} */
	35: {
		id: 35,
		name: 'Begin Run',
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
		allowExit: false,
		autoFlip: false,
		defaultChoice: 1,
		forceGravity: true,
		ignoreEdges: false,
		offscreenChoice: 0,
		startupChoice: 0,
		childId: 0,
		edge: 8,
		next: 7,
	},
	/** @type {RawMateAnimation} */
	36: {
		id: 36,
		name: 'Run (End)',
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
		allowExit: false,
		autoFlip: false,
		defaultChoice: 0,
		forceGravity: true,
		ignoreEdges: false,
		offscreenChoice: 0,
		startupChoice: 0,
		childId: 0,
		edge: 8,
		next: 1,
	},
	/** @type {RawMateAnimation} */
	37: {
		id: 37,
		name: 'Climb Wall',
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
		allowExit: false,
		autoFlip: false,
		defaultChoice: 0,
		forceGravity: false,
		ignoreEdges: false,
		offscreenChoice: 0,
		startupChoice: 0,
		childId: 0,
		edge: 38,
		next: 37,
	},
	/** @type {RawMateAnimation} */
	38: {
		id: 38,
		name: 'Move Upside Down',
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
		allowExit: false,
		autoFlip: true,
		defaultChoice: 0,
		forceGravity: false,
		ignoreEdges: false,
		offscreenChoice: 0,
		startupChoice: 0,
		childId: 0,
		edge: null,
		next: 39,
	},
	/** @type {RawMateAnimation} */
	39: {
		id: 39,
		name: 'Walk Upside Down',
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
		allowExit: false,
		autoFlip: false,
		defaultChoice: 0,
		forceGravity: false,
		ignoreEdges: false,
		offscreenChoice: 0,
		startupChoice: 0,
		childId: 0,
		edge: 40,
		next: 39,
	},
	/** @type {RawMateAnimation} */
	40: {
		id: 40,
		name: 'Upside Down Pause',
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
		allowExit: false,
		autoFlip: true,
		defaultChoice: 0,
		forceGravity: false,
		ignoreEdges: false,
		offscreenChoice: 0,
		startupChoice: 0,
		childId: 0,
		edge: null,
		next: 41,
	},
	/** @type {RawMateAnimation} */
	41: {
		id: 41,
		name: 'Climb Down',
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
		allowExit: false,
		autoFlip: false,
		defaultChoice: 0,
		forceGravity: false,
		ignoreEdges: false,
		offscreenChoice: 0,
		startupChoice: 0,
		childId: 0,
		edge: 42,
		next: 41,
	},
	/** @type {RawMateAnimation} */
	42: {
		id: 42,
		name: 'Climb Over',
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
		allowExit: false,
		autoFlip: false,
		defaultChoice: 0,
		forceGravity: false,
		ignoreEdges: false,
		offscreenChoice: 0,
		startupChoice: 0,
		childId: 0,
		edge: null,
		next: 1,
	},
	/** @type {RawMateAnimation} */
	43: {
		id: 43,
		name: 'Beg',
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
		allowExit: false,
		autoFlip: false,
		defaultChoice: 1,
		forceGravity: true,
		ignoreEdges: false,
		offscreenChoice: 0,
		startupChoice: 0,
		childId: 0,
		edge: null,
		next: 1,
	},
	/** @type {RawMateAnimation} */
	44: {
		id: 44,
		name: 'Bleat',
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
		allowExit: false,
		autoFlip: false,
		defaultChoice: 1,
		forceGravity: true,
		ignoreEdges: false,
		offscreenChoice: 0,
		startupChoice: 0,
		childId: 0,
		edge: null,
		next: 1,
	},
	/** @type {RawMateAnimation} */
	45: {
		id: 45,
		name: 'Handstand',
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
		allowExit: false,
		autoFlip: false,
		defaultChoice: 1,
		forceGravity: true,
		ignoreEdges: false,
		offscreenChoice: 0,
		startupChoice: 0,
		childId: 0,
		edge: null,
		next: 1,
	},
	/** @type {RawMateAnimation} */
	46: {
		id: 46,
		name: 'Jump and Slide',
		startFrom: null,
		start: 50,
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
		allowExit: false,
		autoFlip: false,
		defaultChoice: 0,
		forceGravity: false,
		ignoreEdges: false,
		offscreenChoice: 0,
		startupChoice: 0,
		childId: 0,
		edge: null,
		next: 1,
	},
	/** @type {RawMateAnimation} */
	47: {
		id: 47,
		name: 'Bath Cool Down',
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
		allowExit: false,
		autoFlip: false,
		defaultChoice: 0,
		forceGravity: true,
		ignoreEdges: false,
		offscreenChoice: 0,
		startupChoice: 0,
		childId: 0,
		edge: null,
		next: 48,
	},
	/** @type {RawMateAnimation} */
	48: {
		id: 48,
		name: 'Leave Bath',
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
		allowExit: false,
		autoFlip: false,
		defaultChoice: 0,
		forceGravity: true,
		ignoreEdges: false,
		offscreenChoice: 0,
		startupChoice: 0,
		childId: 0,
		edge: null,
		next: 3,
	},
	/** @type {RawMateAnimation} */
	49: {
		id: 49,
		name: 'Roll (Start)',
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
		allowExit: false,
		autoFlip: false,
		defaultChoice: 1,
		forceGravity: true,
		ignoreEdges: false,
		offscreenChoice: 0,
		startupChoice: 0,
		childId: 0,
		edge: null,
		next: 50,
	},
	/** @type {RawMateAnimation} */
	50: {
		id: 50,
		name: 'Roll',
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
		repeat: 0,
		repeatFrom: 0,
		frames: [
			118,
			117,
			116,
			115,
			114,
			113,
			112,
			113,
			114,
			115,
			116,
			117,
			118,
		],
		audio: null,
		allowExit: false,
		autoFlip: false,
		defaultChoice: 0,
		forceGravity: true,
		ignoreEdges: false,
		offscreenChoice: 0,
		startupChoice: 0,
		childId: 0,
		edge: null,
		next: 51,
	},
	/** @type {RawMateAnimation} */
	51: {
		id: 51,
		name: 'Roll (End)',
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
		allowExit: false,
		autoFlip: false,
		defaultChoice: 0,
		forceGravity: true,
		ignoreEdges: false,
		offscreenChoice: 0,
		startupChoice: 0,
		childId: 0,
		edge: null,
		next: 1,
	},
	/** @type {RawMateAnimation} */
	52: {
		id: 52,
		name: 'Sneeze',
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
		allowExit: false,
		autoFlip: false,
		defaultChoice: 1,
		forceGravity: true,
		ignoreEdges: false,
		offscreenChoice: 0,
		startupChoice: 0,
		childId: 0,
		edge: null,
		next: 1,
	},
	/** @type {RawMateAnimation} */
	53: {
		id: 53,
		name: 'Scratch',
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
		allowExit: false,
		autoFlip: false,
		defaultChoice: 1,
		forceGravity: true,
		ignoreEdges: false,
		offscreenChoice: 0,
		startupChoice: 0,
		childId: 0,
		edge: null,
		next: null,
	},
	/** @type {RawMateAnimation} */
	54: {
		id: 54,
		name: 'Stargaze',
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
		allowExit: false,
		autoFlip: false,
		defaultChoice: 0,
		forceGravity: true,
		ignoreEdges: false,
		offscreenChoice: 1,
		startupChoice: 1,
		childId: 0,
		edge: null,
		next: 55,
	},
	/** @type {RawMateAnimation} */
	55: {
		id: 55,
		name: 'Stargaze Look',
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
		allowExit: false,
		autoFlip: false,
		defaultChoice: 0,
		forceGravity: true,
		ignoreEdges: false,
		offscreenChoice: 0,
		startupChoice: 0,
		childId: 56,
		edge: null,
		next: 14,
	},
	/** @type {RawMateAnimation} */
	56: {
		id: 56,
		name: 'Stargaze Look (Child)',
		startFrom: () => ({
			x: 0 - TILE_SIZE,
			y: TILE_SIZE * 2,
		}),
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
		allowExit: false,
		autoFlip: false,
		defaultChoice: 0,
		forceGravity: false,
		ignoreEdges: true,
		offscreenChoice: 0,
		startupChoice: 0,
		childId: 0,
		edge: null,
		next: null,
	},
	/** @type {RawMateAnimation} */
	57: {
		id: 57,
		name: 'Abduction',
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
		allowExit: false,
		autoFlip: false,
		defaultChoice: 1,
		forceGravity: true,
		ignoreEdges: false,
		offscreenChoice: 0,
		startupChoice: 0,
		childId: 58,
		edge: null,
		next: 59,
	},
	/** @type {RawMateAnimation} */
	58: {
		id: 58,
		name: 'Abduction (Child)',
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
		allowExit: false,
		autoFlip: false,
		defaultChoice: 0,
		forceGravity: false,
		ignoreEdges: true,
		offscreenChoice: 0,
		startupChoice: 0,
		childId: 0,
		edge: null,
		next: 60,
	},
	/** @type {RawMateAnimation} */
	59: {
		id: 59,
		name: 'Abduction (Vanishing)',
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
		allowExit: false,
		autoFlip: false,
		defaultChoice: 0,
		forceGravity: true,
		ignoreEdges: true,
		offscreenChoice: 0,
		startupChoice: 0,
		childId: 0,
		edge: null,
		next: 63,
	},
	/** @type {RawMateAnimation} */
	60: {
		id: 60,
		name: 'Abduction Beaming (Child)',
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
		allowExit: false,
		autoFlip: false,
		defaultChoice: 0,
		forceGravity: false,
		ignoreEdges: true,
		offscreenChoice: 0,
		startupChoice: 0,
		childId: 61,
		edge: null,
		next: 62,
	},
	/** @type {RawMateAnimation} */
	61: {
		id: 61,
		name: 'Abduction Beam (Child)',
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
		allowExit: false,
		autoFlip: false,
		defaultChoice: 0,
		forceGravity: false,
		ignoreEdges: true,
		offscreenChoice: 0,
		startupChoice: 0,
		childId: 0,
		edge: null,
		next: null,
	},
	/** @type {RawMateAnimation} */
	62: {
		id: 62,
		name: 'Abduction Getaway (Child)',
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
		allowExit: false,
		autoFlip: false,
		defaultChoice: 0,
		forceGravity: false,
		ignoreEdges: true,
		offscreenChoice: 0,
		startupChoice: 0,
		childId: 0,
		edge: null,
		next: null,
	},
	/** @type {RawMateAnimation} */
	63: {
		id: 63,
		name: 'Chasing a Martian!',
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
		allowExit: false,
		autoFlip: false,
		defaultChoice: 0,
		forceGravity: true,
		ignoreEdges: false,
		offscreenChoice: 1,
		startupChoice: 1,
		childId: 64,
		edge: null,
		next: 44,
	},
	/** @type {RawMateAnimation} */
	64: {
		id: 64,
		name: 'Chasing a Martian! (Child)',
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
		repeat: () => screenWidth() / 36 + 4,
		repeatFrom: 0,
		frames: [
			166,
			167,
			168,
		],
		audio: null,
		allowExit: true,
		autoFlip: false,
		defaultChoice: 0,
		forceGravity: true,
		ignoreEdges: true,
		offscreenChoice: 0,
		startupChoice: 0,
		childId: 0,
		edge: null,
		next: null,
	},
	/** @type {RawMateAnimation} */
	65: {
		id: 65,
		name: 'Bounce (Up)',
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
		allowExit: false,
		autoFlip: false,
		defaultChoice: 0,
		forceGravity: false,
		ignoreEdges: false,
		offscreenChoice: 0,
		startupChoice: 0,
		childId: 0,
		edge: null,
		next: 66,
	},
	/** @type {RawMateAnimation} */
	66: {
		id: 66,
		name: 'Bounce (End)',
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
		allowExit: false,
		autoFlip: false,
		defaultChoice: 0,
		forceGravity: true,
		ignoreEdges: false,
		offscreenChoice: 0,
		startupChoice: 0,
		childId: 0,
		edge: null,
		next: 1,
	},
	/** @type {RawMateAnimation} */
	67: {
		id: 67,
		name: 'Spin',
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
		allowExit: false,
		autoFlip: false,
		defaultChoice: 1,
		forceGravity: true,
		ignoreEdges: false,
		offscreenChoice: 0,
		startupChoice: 0,
		childId: 0,
		edge: null,
		next: [
			13,
			52,
		],
	},
};

/**
 * A Single Animation
 *
 * @param {number} id Animation ID.
 * @return {?MateAnimation} Animation.
 */
export const animation = function(id) {
	if (('number' !== typeof id) || (undefined === ANIMATIONS[id])) {
		return null;
	}

	/** @type {RawMateAnimation} */
	const value = ANIMATIONS[id];

	// Let's transform start and end properties here.
	let start = ('function' === typeof value.start ? value.start() : value.start);
	if ('number' === typeof start) {
		start = {
			x: 0,
			y: 0,
			speed: start,
		};
	}

	let end = ('function' === typeof value.end ? value.end() : value.end);
	if ('number' === typeof end) {
		end = {
			x: 0,
			y: 0,
			speed: end,
		};
	}

	return /** @type {MateAnimation} */ ({
		id: value.id,
		name: value.name,
		startFrom: ('function' === typeof value.startFrom ? value.startFrom() : value.startFrom),
		start: start,
		end: end,
		repeat: ('function' === typeof value.repeat ? value.repeat() : value.repeat),
		repeatFrom: value.repeatFrom,
		frames: value.frames,
		audio: value.audio,
		allowExit: value.allowExit,
		autoFlip: value.autoFlip,
		defaultChoice: value.defaultChoice,
		forceGravity: value.forceGravity,
		offscreenChoice: value.offscreenChoice,
		ignoreEdges: value.ignoreEdges,
		startupChoice: value.startupChoice,
		childId: value.childId,
		edge: value.edge,
		next: value.next,
	});
};

/**
 * Dragging Animation
 *
 * @const {number}
 */
export const DRAGGING_ANIMATION = 4;

/**
 * Falling Animation
 *
 * @const {number}
 */
export const FALLING_ANIMATION = 5;

/**
 * Animtaions that can be used as a first sequence.
 *
 * @const {Array<(number|MateAnimationPossibility)>}
 */
export const DEFAULT_CHOICES = Object.values(/** @type {!RawMateAnimation} */ (ANIMATIONS)).reduce((out, v) => {
	if (1 === v.defaultChoice) {
		out.push(v.id);
	}
	else if (v.defaultChoice) {
		/** @type {MateAnimationPossibility} */
		const weight = {
			weight: v.defaultChoice,
			id: v.id,
		};

		out.push(weight);
	}

	return out;
}, []);

/**
 * Animations that begin from offscreen.
 *
 * @const {Array<(number|MateAnimationPossibility)>}
 */
export const OFFSCREEN_CHOICES = Object.values(/** @type {!RawMateAnimation} */ (ANIMATIONS)).reduce((out, v) => {
	if (1 === v.offscreenChoice) {
		out.push(v.id);
	}
	else if (v.offscreenChoice) {
		/** @type {MateAnimationPossibility} */
		const weight = {
			weight: v.offscreenChoice,
			id: v.id,
		};

		out.push(weight);
	}

	return out;
}, []);

/**
 * Animations to kick things off with.
 *
 * @const {Array<(number|MateAnimationPossibility)>}
 */
export const STARTUP_CHOICES = Object.values(/** @type {!RawMateAnimation} */ (ANIMATIONS)).reduce((out, v) => {
	if (1 === v.startupChoice) {
		out.push(v.id);
	}
	else if (v.startupChoice) {
		/** @type {MateAnimationPossibility} */
		const weight = {
			weight: v.startupChoice,
			id: v.id,
		};

		out.push(weight);
	}

	return out;
}, []);

/**
 * Child animations.
 *
 * @const Set<number>
 */
export const CHILD_ANIMATIONS = Object.values(/** @type {!RawMateAnimation} */ (ANIMATIONS)).reduce((out, v) => {
	if (0 < v.childId) {
		out.add(v.childId);
	}

	if (-1 !== v.name.indexOf('(Child)')) {
		out.add(v.id);
	}

	return out;
}, new Set());

/**
 * Verify Animation ID
 *
 * @param {number} id Animation ID.
 * @return {boolean} True/false.
 */
export const verifyAnimationId = function(id) {
	id = parseInt(id, 10) || -1;
	return 0 < id && undefined !== ANIMATIONS[id];
};
