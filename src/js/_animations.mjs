/**
 * @file Animations
 */

/* global Generator */
import { easeOut, isAbsInt } from './_helpers.mjs';
import { Poe } from './_poe.mjs';
import { BLANK_FRAME, TILE_SIZE } from './_media.mjs';
import {
	Animation,
	AnimationFlag,
	Playlist,
	Scene,
	SceneCB,
	SceneFlag,
	Sound,
	Step,
	WeightedChoice
} from './_types.mjs';



// ---------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------

/**
 * All Animations
 *
 * @const {Array<Animation>}
 */
export const ANIMATIONS = [
	{
		id: Playlist.Walk,
		name: 'Walk',
		/** @type {Array<!Scene>} */
		scenes: [
			/** @type {!Scene} */ ({
				start: null,
				x: -84,
				y: 0,
				duration: 6300,
				repeat: [20, 0],
				frames: [
					2,
					3,
				],
				sound: null,
				flags: SceneFlag.AllowExit | SceneFlag.ForceGravity,
			}),
		],
		flags: AnimationFlag.DefaultChoice | AnimationFlag.DemoPlay | AnimationFlag.NoChildren,
		childId: null,
		/** @type {Array<WeightedChoice>} */
		edge: [
			[Playlist.Rotate, 5],
			[Playlist.Scoot, 2],
			[Playlist.ClimbUp, 1],
		],
		/** @type {Array<WeightedChoice>} */
		next: [
			[Playlist.Walk, 10],
			[Playlist.BeginRun, 4],
			[Playlist.Beg, 2],
			[Playlist.Eat, 2],
			[Playlist.Handstand, 2],
			[Playlist.Roll, 2],
			[Playlist.Scratch, 2],
			[Playlist.Bleat, 1],
			[Playlist.BoredSleep, 1],
			[Playlist.Sleep, 1],
			[Playlist.Sneeze, 1],
			[Playlist.Urinate, 1],
		],
	},
	{
		id: Playlist.Rotate,
		name: 'Rotate',
		/** @type {Array<!Scene>} */
		scenes: [
			/** @type {!Scene} */ ({
				start: null,
				x: 0,
				y: 0,
				duration: 450,
				repeat: null,
				frames: [
					3,
					9,
					10,
				],
				sound: null,
				flags: SceneFlag.AutoFlip | SceneFlag.ForceGravity,
			}),

			/** @type {!Scene} */ ({
				start: null,
				x: 0,
				y: 0,
				duration: 450,
				repeat: null,
				frames: [
					10,
					9,
					3,
				],
				sound: null,
				flags: SceneFlag.ForceGravity,
			}),
		],
		flags: AnimationFlag.DefaultChoice | AnimationFlag.DemoPlay | AnimationFlag.NoChildren,
		childId: null,
		edge: null,
		next: null,
	},
	{
		id: Playlist.Drag,
		name: 'Drag',
		/** @type {Array<!Scene>} */
		scenes: [
			/** @type {!Scene} */ ({
				start: null,
				x: 0,
				y: 0,
				duration: 2700,
				repeat: [2, 0],
				frames: [
					42,
					43,
					43,
					42,
					44,
					44,
				],
				sound: null,
				flags: 0,
			}),
		],
		flags: AnimationFlag.NoChildren,
		childId: null,
		edge: null,
		next: Playlist.Drag,
	},
	{
		id: Playlist.Fall,
		name: 'Fall',
		/** @type {Array<!Scene>} */
		scenes: [
			/** @type {!Scene} */ ({
				start: null,
				x: 0,
				y: 250,
				duration: 1050,
				repeat: [25, 0],
				frames: [
					133,
				],
				sound: null,
				flags: SceneFlag.EaseIn,
			}),
		],
		flags: AnimationFlag.EntranceChoice | AnimationFlag.FirstChoice | AnimationFlag.NoChildren | AnimationFlag.FallingAnimation,
		childId: null,
		edge: Playlist.Bounce,
		next: Playlist.GraspingFall,
	},
	{
		id: Playlist.GraspingFall,
		name: 'Grasping Fall',
		/** @type {Array<!Scene>} */
		scenes: [
			/** @type {!Scene} */ ({
				start: null,
				x: 0,
				y: 800,
				duration: 1320,
				repeat: [9, 0],
				frames: [
					46,
					46,
					46,
					47,
					47,
					47,
				],
				sound: null,
				flags: 0,
			}),
		],
		flags: AnimationFlag.NoChildren | AnimationFlag.FallingAnimation,
		childId: null,
		/** @type {Array<WeightedChoice>} */
		edge: [
			[Playlist.Splat, 3],
			[Playlist.Bounce, 1],
			[Playlist.PlayDead, 1],
		],
		next: Playlist.GraspingFall,
	},
	{
		id: Playlist.Run,
		name: 'Run',
		/** @type {Array<!Scene>} */
		scenes: [
			/** @type {!Scene} */ ({
				start: null,
				x: -180,
				y: 0,
				duration: 1800,
				repeat: [5, 0],
				frames: [
					5,
					4,
					4,
				],
				sound: null,
				flags: SceneFlag.AllowExit | SceneFlag.ForceGravity,
			}),
		],
		flags: AnimationFlag.DefaultChoice | AnimationFlag.DemoPlay | AnimationFlag.NoChildren,
		childId: null,
		edge: Playlist.Boing,
		/** @type {Array<WeightedChoice>} */
		next: [
			[Playlist.RunEnd, 4],
			[Playlist.Jump, 3],
			[Playlist.Run, 2],
		],
	},
	{
		id: Playlist.Boing,
		name: 'Boing!',
		/** @type {Array<!Scene>} */
		scenes: [
			/** @type {!Scene} */ ({
				start: null,
				x: 55,
				y: 0,
				duration: 1100,
				repeat: null,
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
				sound: null,
				flags: SceneFlag.ForceGravity | SceneFlag.EaseOut,
			}),
		],
		flags: AnimationFlag.NoChildren,
		childId: null,
		edge: null,
		/** @type {Array<WeightedChoice>} */
		next: [
			[Playlist.Rotate, 8],
			[Playlist.Walk, 4],
			[Playlist.BeginRun, 1],
		],
	},
	{
		id: Playlist.Bounce,
		name: 'Bounce',
		/** @type {Array<!Scene>} */
		scenes: [
			/** @type {!Scene} */ ({
				start: null,
				x: 0,
				y: 0,
				duration: 300,
				repeat: null,
				frames: [
					42,
					49,
					42,
				],
				sound: null,
				flags: SceneFlag.ForceGravity,
			}),
			/** @type {!Scene} */ ({
				start: null,
				x: 0,
				y: -6,
				duration: 200,
				repeat: null,
				frames: [
					131,
					42,
				],
				sound: null,
				flags: 0,
			}),
			/** @type {!Scene} */ ({
				start: null,
				x: 0,
				y: 0,
				duration: 100,
				repeat: null,
				frames: [
					132,
				],
				sound: null,
				flags: 0,
			}),
			/** @type {!Scene} */ ({
				start: null,
				x: 0,
				y: 6,
				duration: 200,
				repeat: null,
				frames: [
					42,
					49,
				],
				sound: null,
				flags: 0,
			}),
			/** @type {!Scene} */ ({
				start: null,
				x: 0,
				y: 0,
				duration: 1600,
				repeat: null,
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
				sound: null,
				flags: SceneFlag.ForceGravity,
			}),
		],
		flags: AnimationFlag.NoChildren,
		childId: null,
		edge: null,
		next: null,
	},
	{
		id: Playlist.Splat,
		name: 'Splat!',
		/** @type {Array<!Scene>} */
		scenes: [
			/** @type {!Scene} */ ({
				start: null,
				x: 0,
				y: 0,
				duration: 1000,
				repeat: null,
				frames: [
					48,
					48,
					48,
					48,
					47,
				],
				sound: null,
				flags: 0,
			}),
		],
		flags: AnimationFlag.NoChildren,
		childId: null,
		edge: null,
		next: null,
	},
	{
		id: Playlist.Urinate,
		name: 'Urinate',
		scenes: [
			/** @type {!SceneCB} */ (() => {
				/** @const {number} */
				const repeat = Math.floor(5 + Math.random() * 10);

				return /** @type {!Scene} */ ({
					start: null,
					x: 0,
					y: 0,
					duration: (7 + repeat * 2) * 150,
					repeat: [repeat, 5],
					frames: [
						3,
						12,
						13,
						103,
						104,
						105,
						106,
					],
					sound: null,
					flags: SceneFlag.ForceGravity,
				});
			}),
			/** @type {!Scene} */ ({
				start: null,
				x: 0,
				y: 0,
				duration: 1050,
				repeat: null,
				frames: [
					104,
					105,
					104,
					104,
					103,
					13,
					12,
				],
				sound: null,
				flags: SceneFlag.ForceGravity,
			}),
		],
		flags: AnimationFlag.DefaultChoice | AnimationFlag.DemoPlay | AnimationFlag.NoChildren | AnimationFlag.VariableDuration,
		childId: null,
		edge: null,
		next: null,
	},
	{
		id: Playlist.PlayDead,
		name: 'Play Dead',
		/** @type {Array<!Scene>} */
		scenes: [
			/** @type {!Scene} */ ({
				start: null,
				x: 0,
				y: 0,
				duration: 1600,
				repeat: [4, 11],
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
				sound: null,
				flags: SceneFlag.ForceGravity,
			}),
		],
		flags: AnimationFlag.DefaultChoice | AnimationFlag.DemoPlay | AnimationFlag.NoChildren,
		childId: null,
		edge: null,
		next: null,
	},
	{
		id: Playlist.Scream,
		name: 'Scream!',
		/** @type {Array<!Scene>} */
		scenes: [
			/** @type {!Scene} */ ({
				start: null,
				x: 0,
				y: 0,
				duration: 1300,
				repeat: [12, 0],
				frames: [
					50,
					51,
				],
				sound: null,
				flags: SceneFlag.ForceGravity,
			}),
		],
		flags: AnimationFlag.DefaultChoice | AnimationFlag.DemoPlay | AnimationFlag.NoChildren,
		childId: null,
		edge: null,
		next: Playlist.Run,
	},
	{
		id: Playlist.Sleep,
		name: 'Sleep',
		scenes: [
			/** @type {!SceneCB} */ (() => {
				/** @const {number} */
				const repeat = Math.floor(10 + Math.random() * 20);

				return /** @type {!Scene} */ ({
					start: null,
					x: 0,
					y: 0,
					duration: (11 + repeat * 2) * 300,
					repeat: [repeat, 9],
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
					sound: [Sound.Yawn, 1],
					flags: SceneFlag.ForceGravity,
				});
			}),
			/** @type {!Scene} */ ({
				start: null,
				x: 0,
				y: 0,
				duration: 3300,
				repeat: null,
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
				sound: [Sound.Yawn, 5],
				flags: SceneFlag.ForceGravity,
			}),
		],
		flags: AnimationFlag.DefaultChoice | AnimationFlag.DemoPlay | AnimationFlag.NoChildren | AnimationFlag.VariableDuration,
		childId: null,
		edge: null,
		next: null,
	},
	{
		id: Playlist.Doze,
		name: 'Doze',
		scenes: [
			/** @type {!SceneCB} */ (() => {
				/** @const {number} */
				const repeat = Math.floor(20 + Math.random() * 10);

				return /** @type {!Scene} */ ({
					start: null,
					x: 0,
					y: 0,
					duration: (8 + repeat * 2) * 200,
					repeat: [repeat, 6],
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
					sound: null,
					flags: SceneFlag.ForceGravity,
				});
			}),
			/** @type {!Scene} */ ({
				start: null,
				x: 0,
				y: 0,
				duration: 600,
				repeat: null,
				frames: [
					8,
					7,
					6,
				],
				sound: null,
				flags: SceneFlag.ForceGravity,
			}),
		],
		flags: AnimationFlag.DefaultChoice | AnimationFlag.DemoPlay | AnimationFlag.NoChildren | AnimationFlag.VariableDuration,
		childId: null,
		edge: null,
		next: null,
	},
	{
		id: Playlist.BoredSleep,
		name: 'Bored Sleep',
		scenes: [
			/** @type {!SceneCB} */ (() => {
				/** @const {number} */
				const repeat = Math.floor(30 + Math.random() * 10);

				return /** @type {!Scene} */ ({
					start: null,
					x: 0,
					y: 0,
					duration: (9 + repeat * 2) * 200,
					repeat: [repeat, 7],
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
					sound: null,
					flags: SceneFlag.ForceGravity,
				});
			}),
			/** @type {!Scene} */ ({
				start: null,
				x: 0,
				y: 0,
				duration: 1800,
				repeat: null,
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
				sound: null,
				flags: SceneFlag.ForceGravity,
			}),
		],
		flags: AnimationFlag.DefaultChoice | AnimationFlag.DemoPlay | AnimationFlag.NoChildren | AnimationFlag.VariableDuration,
		childId: null,
		edge: null,
		next: null,
	},
	{
		id: Playlist.BathDive,
		name: 'Bath Dive',
		scenes: [
			/** @type {!SceneCB} */ (() => {
				return /** @type {!Scene} */ ({
					start: [
						Poe.width,
						Poe.height - 600,
					],
					x: -588,
					y: 441,
					duration: 4350,
					repeat: [146, 0],
					frames: [
						134,
					],
					sound: null,
					flags: 0,
				});
			}),
			/** @type {!Scene} */ ({
				start: null,
				x: -192,
				y: 144,
				duration: 1440,
				repeat: null,
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
				sound: null,
				flags: 0,
			}),
		],
		flags: AnimationFlag.EntranceChoice | AnimationFlag.FirstChoice | AnimationFlag.DemoPlay | AnimationFlag.NoChildren,
		childId: Playlist.BathDiveChild,
		edge: Playlist.BathCoolDown,
		next: Playlist.BathCoolDown,
	},
	{
		id: Playlist.BathDiveChild,
		name: 'Bath Dive 👶',
		scenes: [
			/** @type {!SceneCB} */ (() => {
				return /** @type {!Scene} */ ({
					start: [
						Poe.width - 800 + TILE_SIZE + 10,
						Poe.height - TILE_SIZE,
					],
					x: 0,
					y: 0,
					duration: 5160,
					repeat: [171, 0],
					frames: [
						146,
					],
					sound: null,
					flags: SceneFlag.ForceGravity,
				});
			}),
			/** @type {!Scene} */ ({
				start: null,
				x: 0,
				y: 0,
				duration: 2700,
				repeat: [70, 19],
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
				],
				sound: null,
				flags: SceneFlag.ForceGravity,
			}),
		],
		flags: AnimationFlag.NoParents,
		childId: null,
		edge: null,
		next: null,
	},
	{
		id: Playlist.Jump,
		name: 'Jump',
		/** @type {Array<!Scene>} */
		scenes: [
			/** @type {!Scene} */ ({
				start: null,
				x: -50,
				y: -30,
				duration: 400,
				repeat: null,
				frames: [
					76,
					30,
					30,
					30,
					30,
				],
				sound: null,
				flags: 0,
			}),
			/** @type {!Scene} */ ({
				start: null,
				x: -30,
				y: 0,
				duration: 100,
				repeat: null,
				frames: [
					23,
					23,
				],
				sound: null,
				flags: 0,
			}),
			/** @type {!Scene} */ ({
				start: null,
				x: -50,
				y: 30,
				duration: 400,
				repeat: null,
				frames: [
					24,
					24,
					24,
					24,
					77,
				],
				sound: null,
				flags: 0,
			}),
		],
		flags: AnimationFlag.DefaultChoice | AnimationFlag.DemoPlay | AnimationFlag.NoChildren,
		childId: null,
		edge: Playlist.WallSlide,
		/** @type {Array<WeightedChoice>} */
		next: [
			[Playlist.Run, 1],
			[Playlist.Slide, 1],
		],
	},
	{
		id: Playlist.Eat,
		name: 'Eat',
		/** @type {Array<!Scene>} */
		scenes: [
			/** @type {!Scene} */ ({
				start: null,
				x: 0,
				y: 0,
				duration: 9000,
				repeat: [5, 5],
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
				sound: null,
				flags: SceneFlag.ForceGravity,
			}),
		],
		flags: AnimationFlag.DefaultChoice | AnimationFlag.DemoPlay | AnimationFlag.NoChildren,
		childId: Playlist.FlowerChild,
		edge: null,
		next: null,
	},
	{
		id: Playlist.FlowerChild,
		name: 'Flower 👶',
		/** @type {Array<!Scene>} */
		scenes: [
			/** @type {!Scene} */ ({
				start: null,
				x: 0,
				y: 0,
				duration: 9000,
				repeat: null,
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
					BLANK_FRAME,
					BLANK_FRAME,
					BLANK_FRAME,
				],
				sound: null,
				flags: SceneFlag.ForceGravity,
			}),
		],
		flags: AnimationFlag.NoParents,
		childId: null,
		edge: null,
		next: null,
	},
	{
		id: Playlist.BlackSheep,
		name: 'Black Sheep',
		scenes: [
			/** @type {!SceneCB} */ (() => {
				/** @const {number} */
				const repeat = Math.floor((Poe.width / 2) / 30 - 6);

				return /** @type {!Scene} */ ({
					start: [
						Poe.width + TILE_SIZE,
						Poe.height - TILE_SIZE,
					],
					x: -10 * (3 + repeat * 3),
					y: 0,
					duration: (3 + repeat * 3) * 100,
					repeat: [repeat, 0],
					frames: [
						5,
						4,
						4,
					],
					sound: null,
					flags: SceneFlag.ForceGravity,
				});
			}),
			/** @type {!SceneCB} */ (() => {
				/** @const {number} */
				const repeat = Math.floor(25 + (Math.floor(Poe.width / 2) % 30) / 7);

				return /** @type {!Scene} */ ({
					start: null,
					x: -3 * (2 + repeat * 2),
					y: 0,
					duration: (2 + repeat * 2) * 100,
					repeat: [repeat, 0],
					frames: [
						2,
						3,
					],
					sound: null,
					flags: SceneFlag.EaseOut | SceneFlag.ForceGravity,
				});
			}),
			/** @type {!Scene} */ ({
				start: null,
				x: 0,
				y: 0,
				duration: 7000,
				repeat: null,
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
				sound: null,
				flags: SceneFlag.ForceGravity,
			}),
		],
		flags: AnimationFlag.EntranceChoice | AnimationFlag.FirstChoice | AnimationFlag.DemoPlay | AnimationFlag.NoChildren | AnimationFlag.VariableDuration,
		childId: Playlist.BlackSheepChild,
		edge: null,
		next: null,
	},
	{
		id: Playlist.BlackSheepChild,
		name: 'Black Sheep 👶',
		scenes: [
			/** @type {!Scene} */ (() => {
				/** @const {number} */
				const repeat = Math.floor((Poe.width / 2) / 30 - 6);

				return /** @type {!Scene} */ ({
					start: [
						0 - TILE_SIZE,
						Poe.height - TILE_SIZE,
					],
					x: 10 * (3 + repeat * 3),
					y: 0,
					duration: (3 + repeat * 3) * 100,
					repeat: [repeat, 0],
					frames: [
						155,
						154,
						154,
					],
					sound: null,
					flags: SceneFlag.ForceGravity,
				});
			}),
			/** @type {!SceneCB} */ (() => {
				/** @const {number} */
				const repeat = Math.floor(24 + (Math.floor(Poe.width / 2) % 30) / 7);

				return /** @type {!Scene} */ ({
					start: null,
					x: 3 * (2 + repeat * 2),
					y: 0,
					duration: (2 + repeat * 2) * 100,
					repeat: [repeat, 0],
					frames: [
						156,
						157,
					],
					sound: null,
					flags: SceneFlag.EaseOut | SceneFlag.ForceGravity,
				});
			}),
			/** @type {!Scene} */ ({
				start: null,
				x: 0,
				y: 0,
				duration: 4500,
				repeat: [9, 0],
				frames: [
					157,
				],
				sound: null,
				flags: SceneFlag.ForceGravity,
			}),
		],
		flags: AnimationFlag.NoParents | AnimationFlag.VariableDuration,
		childId: null,
		edge: null,
		next: null,
	},
	{
		id: Playlist.BeginRun,
		name: 'Begin Run',
		/** @type {Array<!Scene>} */
		scenes: [
			/** @type {!Scene} */ ({
				start: null,
				x: -24,
				y: 0,
				duration: 600,
				repeat: [2, 0],
				frames: [
					2,
					3,
				],
				sound: null,
				flags: SceneFlag.ForceGravity,
			}),
		],
		flags: AnimationFlag.DefaultChoice | AnimationFlag.DemoPlay | AnimationFlag.NoChildren,
		childId: null,
		edge: Playlist.Boing,
		next: Playlist.Run,
	},
	{
		id: Playlist.RunEnd,
		name: 'Run (End)',
		scenes: [
			/** @type {!Scene} */ ({
				start: null,
				x: -24,
				y: 0,
				duration: 600,
				repeat: [2, 0],
				frames: [
					2,
					3,
				],
				sound: null,
				flags: SceneFlag.ForceGravity,
			}),
		],
		flags: AnimationFlag.NoChildren,
		childId: null,
		edge: Playlist.Boing,
		next: Playlist.Walk,
	},
	{
		id: Playlist.ClimbUp,
		name: 'Climb Up',
		scenes: [
			/** @type {!SceneCB} */ (() => {
				/** @const {number} */
				const repeat = Math.floor(Poe.height / 2);

				return /** @type {!Scene} */ ({
					start: null,
					x: 0,
					y: -2 * (4 + repeat * 2),
					duration: (4 + repeat * 2) * 150,
					repeat: [repeat, 2],
					frames: [
						31,
						30,
						15,
						16,
					],
					sound: null,
					flags: 0,
				});
			}),
		],
		flags: AnimationFlag.NoChildren | AnimationFlag.VariableDuration,
		childId: null,
		edge: Playlist.ReachCeiling,
		next: Playlist.ClimbUp,
	},
	{
		id: Playlist.ReachCeiling,
		name: 'Reach Ceiling',
		scenes: [
			/** @type {!Scene} */ (() => {
				return /** @type {!Scene} */ ({
					start: null,
					x: 3,
					y: 0,
					duration: 300,
					repeat: null,
					frames: [
						16,
						17,
						28,
					],
					sound: null,
					flags: SceneFlag.AutoFlip,
				});
			}),
		],
		flags: AnimationFlag.NoChildren,
		childId: null,
		edge: null,
		next: Playlist.WalkUpsideDown,
	},
	{
		id: Playlist.WalkUpsideDown,
		name: 'Walk Upside Down',
		scenes: [
			/** @type {!Scene} */ (() => {
				/** @const {number} */
				const repeat = Math.floor(Poe.width / 2);

				return /** @type {!Scene} */ ({
					start: null,
					x: -2 * (2 + repeat * 2),
					y: 0,
					duration: (2 + repeat * 2) * 150,
					repeat: [repeat, 0],
					frames: [
						98,
						97,
					],
					sound: null,
					flags: 0,
				});
			}),
		],
		flags: AnimationFlag.NoChildren,
		childId: null,
		edge: Playlist.ReachSide,
		next: Playlist.WalkUpsideDown,
	},
	{
		id: Playlist.ReachSide,
		name: 'Reach Side',
		/** @type {Array<!Scene>} */
		scenes: [
			/** @type {!Scene} */ ({
				start: null,
				x: 0,
				y: 0,
				duration: 400,
				repeat: null,
				frames: [
					97,
					97,
				],
				sound: null,
				flags: SceneFlag.AutoFlip,
			}),
		],
		flags: AnimationFlag.NoChildren,
		childId: null,
		edge: null,
		next: Playlist.ClimbDown,
	},
	{
		id: Playlist.ClimbDown,
		name: 'Climb Down',
		scenes: [
			/** @type {!SceneCB} */ (() => {
				/** @const {number} */
				const repeat = Math.floor(Poe.height / 2);

				return /** @type {!Scene} */ ({
					start: null,
					x: 0,
					y: 2 * (2 + repeat * 2),
					duration: (2 + repeat * 2) * 150,
					repeat: [repeat, 0],
					frames: [
						19,
						20,
					],
					sound: null,
					flags: 0,
				});
			}),
		],
		flags: AnimationFlag.NoChildren | AnimationFlag.VariableDuration,
		childId: null,
		edge: Playlist.ReachFloor,
		next: Playlist.ClimbDown,
	},
	{
		id: Playlist.ReachFloor,
		name: 'Reach Floor',
		/** @type {Array<!Scene>} */
		scenes: [
			/** @type {!Scene} */ ({
				start: null,
				x: 0,
				y: 0,
				duration: 900,
				repeat: null,
				frames: [
					24,
					6,
					6,
					6,
					6,
					6,
				],
				sound: null,
				flags: 0,
			}),
		],
		flags: AnimationFlag.NoChildren,
		childId: null,
		edge: null,
		next: Playlist.Walk,
	},
	{
		id: Playlist.Beg,
		name: 'Beg',
		/** @type {Array<!Scene>} */
		scenes: [
			/** @type {!Scene} */ ({
				start: null,
				x: 0,
				y: 0,
				duration: 2400,
				repeat: null,
				frames: [
					9,
					10,
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
					10,
					9,
				],
				sound: null,
				flags: SceneFlag.ForceGravity,
			}),
		],
		flags: AnimationFlag.DefaultChoice | AnimationFlag.DemoPlay | AnimationFlag.NoChildren,
		childId: null,
		edge: null,
		next: null,
	},
	{
		id: Playlist.Bleat,
		name: 'Bleat',
		/** @type {Array<!Scene>} */
		scenes: [
			/** @type {!Scene} */ ({
				start: null,
				x: 0,
				y: 0,
				duration: 1400,
				repeat: null,
				frames: [
					3,
					71,
					72,
					71,
					72,
					71,
					3,
				],
				sound: [Sound.Baa, 1],
				flags: SceneFlag.ForceGravity,
			}),
		],
		flags: AnimationFlag.DefaultChoice | AnimationFlag.DemoPlay | AnimationFlag.NoChildren,
		childId: null,
		edge: null,
		next: null,
	},
	{
		id: Playlist.Handstand,
		name: 'Handstand',
		/** @type {Array<!Scene>} */
		scenes: [
			/** @type {!Scene} */ ({
				start: null,
				x: -20,
				y: 0,
				duration: 2000,
				repeat: null,
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
				sound: null,
				flags: SceneFlag.ForceGravity,
			}),
		],
		flags: AnimationFlag.DefaultChoice | AnimationFlag.DemoPlay | AnimationFlag.NoChildren,
		childId: null,
		edge: null,
		next: null,
	},
	{
		id: Playlist.Slide,
		name: 'Slide',
		/** @type {Array<!Scene>} */
		scenes: [
			/** @type {!Scene} */ ({
				start: null,
				x: -22,
				y: 0,
				duration: 1100,
				repeat: null,
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
				sound: null,
				flags: SceneFlag.ForceGravity,
			}),
		],
		flags: AnimationFlag.DemoPlay | AnimationFlag.NoChildren,
		childId: null,
		edge: null,
		next: Playlist.Walk,
	},
	{
		id: Playlist.BathCoolDown,
		name: 'Bath Cool Down',
		/** @type {Array<!Scene>} */
		scenes: [
			/** @type {!Scene} */ ({
				start: null,
				x: 0,
				y: 0,
				duration: 2400,
				repeat: [2, 0],
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
				sound: null,
				flags: SceneFlag.ForceGravity,
			}),
			/** @type {!Scene} */ ({
				start: null,
				x: 0,
				y: 0,
				duration: 600,
				repeat: null,
				frames: [
					119,
					81,
					81,
					82,
					82,
					10,
				],
				sound: null,
				flags: SceneFlag.ForceGravity,
			}),
		],
		flags: AnimationFlag.NoChildren,
		childId: null,
		edge: null,
		next: null,
	},
	{
		id: Playlist.Roll,
		name: 'Roll',
		/** @type {Array<!Scene>} */
		scenes: [
			/** @type {!Scene} */ ({
				start: null,
				x: 0,
				y: 0,
				duration: 450,
				repeat: null,
				frames: [
					9,
					10,
					10,
				],
				sound: null,
				flags: SceneFlag.ForceGravity,
			}),
			/** @type {!Scene} */ ({
				start: null,
				x: -128,
				y: 0,
				duration: 800,
				repeat: [1, 0],
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
				sound: null,
				flags: SceneFlag.ForceGravity,
			}),
			/** @type {!Scene} */ ({
				start: null,
				x: 0,
				y: 0,
				duration: 450,
				repeat: null,
				frames: [
					10,
					10,
					9,
				],
				sound: null,
				flags: SceneFlag.ForceGravity,
			}),
		],
		flags: AnimationFlag.DefaultChoice | AnimationFlag.DemoPlay | AnimationFlag.NoChildren,
		childId: null,
		edge: null,
		next: Playlist.Walk,
	},
	{
		id: Playlist.Sneeze,
		name: 'Sneeze',
		/** @type {Array<!Scene>} */
		scenes: [
			/** @type {!Scene} */ ({
				start: null,
				x: 0,
				y: 0,
				duration: 1600,
				repeat: null,
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
				sound: [Sound.Sneeze, 0],
				flags: SceneFlag.ForceGravity,
			}),
		],
		flags: AnimationFlag.DefaultChoice | AnimationFlag.DemoPlay | AnimationFlag.NoChildren,
		childId: Playlist.SneezeShadow,
		edge: null,
		next: null,
	},
	{
		id: Playlist.Scratch,
		name: 'Scratch',
		/** @type {Array<!Scene>} */
		scenes: [
			/** @type {!Scene} */ ({
				start: null,
				x: 0,
				y: 0,
				duration: 1200,
				repeat: [3, 0],
				frames: [
					56,
					57,
				],
				sound: null,
				flags: SceneFlag.ForceGravity,
			}),
		],
		flags: AnimationFlag.DefaultChoice | AnimationFlag.DemoPlay | AnimationFlag.NoChildren,
		childId: null,
		edge: null,
		next: null,
	},
	{
		id: Playlist.Stargaze,
		name: 'Stargaze',
		scenes: [
			/** @type {!SceneCB} */ (() => {
				return /** @type {!Scene} */ ({
					start: [
						Poe.width,
						Poe.height - TILE_SIZE,
					],
					x: -44,
					y: 0,
					duration: 1100,
					repeat: [10, 0],
					frames: [
						2,
						3,
					],
					sound: null,
					flags: SceneFlag.ForceGravity,
				});
			}),
			/** @type {!Scene} */ ({
				start: null,
				x: 0,
				y: 0,
				duration: 1050,
				repeat: [15, 5],
				frames: [
					3,
					3,
					3,
					3,
					3,
					73,
				],
				sound: null,
				flags: SceneFlag.ForceGravity,
			}),
		],
		flags: AnimationFlag.EntranceChoice | AnimationFlag.FirstChoice | AnimationFlag.DemoPlay | AnimationFlag.NoChildren,
		childId: Playlist.StargazeChild,
		edge: null,
		next: Playlist.Scream,
	},
	{
		id: Playlist.StargazeChild,
		name: 'Stargaze 👶',
		scenes: [
			/** @type {!SceneCB} */ (() => {
				return /** @type {!Scene} */ ({
					start: [
						0 - TILE_SIZE,
						TILE_SIZE * 2,
					],
					x: 0,
					y: 0,
					duration: 1100,
					repeat: [20, 0],
					frames: [
						158,
					],
					sound: null,
					flags: SceneFlag.IgnoreEdges,
				});
			}),
			/** @type {!Scene} */ ({
				start: null,
				x: 820,
				y: -164,
				duration: 1025,
				repeat: [40, 0],
				frames: [
					158,
					159,
					160,
					161,
				],
				sound: null,
				flags: SceneFlag.IgnoreEdges,
			}),
		],
		flags: AnimationFlag.NoParents,
		childId: null,
		edge: null,
		next: null,
	},
	{
		id: Playlist.Abduction,
		name: 'Abduction',
		scenes: [
			/** @type {!Scene} */ ({
				start: null,
				x: 0,
				y: 0,
				duration: 3400,
				repeat: [11, 5],
				frames: [
					9,
					10,
					10,
					10,
					10,
					34,
				],
				sound: null,
				flags: SceneFlag.ForceGravity,
			}),
			/** @type {!SceneCB} */ (() => {
				/** @const {number} */
				const repeat = Math.floor(Poe.width / 4);

				return /** @type {!Scene} */ ({
					start: null,
					x: 0,
					y: 0,
					duration: (48 + repeat) * 25,
					repeat: [repeat, 47],
					frames: [
						34,
						34,
						34,
						34,
						34,
						34,
						BLANK_FRAME,
						34,
						BLANK_FRAME,
						86,
						86,
						BLANK_FRAME,
						86,
						BLANK_FRAME,
						86,
						BLANK_FRAME,
						BLANK_FRAME,
						34,
						BLANK_FRAME,
						86,
						86,
						BLANK_FRAME,
						86,
						BLANK_FRAME,
						86,
						BLANK_FRAME,
						86,
						BLANK_FRAME,
						BLANK_FRAME,
						34,
						BLANK_FRAME,
						86,
						86,
						BLANK_FRAME,
						86,
						BLANK_FRAME,
						86,
						BLANK_FRAME,
						BLANK_FRAME,
						34,
						BLANK_FRAME,
						86,
						86,
						BLANK_FRAME,
						86,
						BLANK_FRAME,
						86,
						BLANK_FRAME,
					],
					sound: null,
					flags: SceneFlag.ForceGravity | SceneFlag.IgnoreEdges,
				});
			}),
		],
		flags: AnimationFlag.DefaultChoice | AnimationFlag.DemoPlay | AnimationFlag.NoChildren,
		childId: Playlist.AbductionChild,
		edge: null,
		next: Playlist.ChasingAMartian,
	},
	{
		id: Playlist.AbductionChild,
		name: 'Abduction 👶',
		/** @type {Array<!Scene>} */
		scenes: [
			/** @type {!Scene} */ ({
				start: null,
				x: 0,
				y: 480,
				duration: 2000,
				repeat: [29, 0],
				frames: [
					158,
					159,
					160,
					161,
				],
				sound: null,
				flags: SceneFlag.IgnoreEdges | SceneFlag.EaseOut,
			}),
		],
		flags: AnimationFlag.NoParents | AnimationFlag.VariableDuration,
		childId: null,
		edge: null,
		next: Playlist.AbductionBeamingChild,
	},
	{
		id: Playlist.AbductionBeamingChild,
		name: 'Abduction Beaming 👶',
		scenes: [
			/** @type {!Scene} */ ({
				start: null,
				x: 0,
				y: 0,
				duration: 1200,
				repeat: [11, 0],
				frames: [
					162,
					163,
					164,
					165,
				],
				sound: null,
				flags: SceneFlag.IgnoreEdges,
			}),
			/** @type {!SceneCB} */ (() => {
				/** @const {number} */
				const repeat = Math.floor(Poe.width / 16);

				return /** @type {!Scene} */ ({
					start: null,
					x: 4 * (4 + repeat * 4),
					y: -1 * (4 + repeat * 4),
					duration: (4 + repeat * 4) * 25,
					repeat: [repeat, 0],
					frames: [
						158,
						159,
						160,
						161,
					],
					sound: null,
					flags: SceneFlag.EaseIn | SceneFlag.IgnoreEdges,
				});
			}),
		],
		flags: AnimationFlag.NoParents | AnimationFlag.VariableDuration,
		childId: Playlist.AbductionBeamChild,
		edge: null,
		next: null,
	},
	{
		id: Playlist.AbductionBeamChild,
		name: 'Abduction Beam 👶',
		/** @type {Array<!Scene>} */
		scenes: [
			/** @type {!Scene} */ ({
				start: null,
				x: 0,
				y: 0,
				duration: 800,
				repeat: [35, 7],
				frames: [
					BLANK_FRAME,
					BLANK_FRAME,
					BLANK_FRAME,
					BLANK_FRAME,
					172,
					172,
					BLANK_FRAME,
					172,
				],
				sound: null,
				flags: SceneFlag.IgnoreEdges,
			}),
		],
		flags: AnimationFlag.NoParents,
		childId: null,
		edge: null,
		next: null,
	},
	{
		id: Playlist.ChasingAMartian,
		name: 'Chasing a Martian!',
		scenes: [
			/** @type {!SceneCB} */ (() => {
				/** @const {number} */
				const repeat = Math.floor(Poe.width / 2 / 30);

				return /** @type {!Scene} */ ({
					start: [
						Poe.width + TILE_SIZE * 3,
						Poe.height - TILE_SIZE,
					],
					x: -10 * (3 + repeat * 3),
					y: 0,
					duration: (3 + repeat * 3) * 100,
					repeat: [repeat, 0],
					frames: [
						5,
						4,
						4,
					],
					sound: null,
					flags: SceneFlag.ForceGravity | SceneFlag.IgnoreEdges,
				});
			}),
		],
		flags: AnimationFlag.EntranceChoice | AnimationFlag.FirstChoice | AnimationFlag.DemoPlay | AnimationFlag.NoChildren | AnimationFlag.VariableDuration,
		childId: Playlist.ChasingAMartianChild,
		edge: null,
		next: Playlist.Bleat,
	},
	{
		id: Playlist.ChasingAMartianChild,
		name: 'Chasing a Martian! 👶',
		scenes: [
			/** @type {!SceneCB} */ (() => {
				/** @const {number} */
				const repeat = Math.floor(Poe.width / 48 + 4);

				return /** @type {!Scene} */ ({
					start: [
						Poe.width + TILE_SIZE,
						Poe.height - TILE_SIZE,
					],
					x: -12 * (4 + repeat * 4),
					y: 0,
					duration: (4 + repeat * 4) * 100,
					repeat: [repeat, 0],
					frames: [
						166,
						167,
						166,
						168,
					],
					sound: null,
					flags: SceneFlag.AllowExit | SceneFlag.ForceGravity | SceneFlag.IgnoreEdges,
				});
			}),
		],
		flags: AnimationFlag.NoParents | AnimationFlag.VariableDuration,
		childId: null,
		edge: null,
		next: null,
	},
	{
		id: Playlist.Spin,
		name: 'Spin',
		/** @type {Array<!Scene>} */
		scenes: [
			/** @type {!Scene} */ ({
				start: null,
				x: 0,
				y: 0,
				duration: 1400,
				repeat: null,
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
				sound: null,
				flags: SceneFlag.ForceGravity,
			}),
		],
		flags: AnimationFlag.DefaultChoice | AnimationFlag.DemoPlay | AnimationFlag.NoChildren,
		childId: null,
		edge: null,
		/** @type {Array<WeightedChoice>} */
		next: [
			[Playlist.PlayDead, 1],
			[Playlist.Sneeze, 1],
		],
	},
	{
		id: Playlist.WallSlide,
		name: 'Wall Slide',
		/** @type {Array<!Scene>} */
		scenes: [
			/** @type {!Scene} */ ({
				start: null,
				x: 0,
				y: 55,
				duration: 440,
				repeat: [10, 0],
				frames: [
					29,
				],
				sound: null,
				flags: 0,
			}),
		],
		flags: AnimationFlag.NoChildren | AnimationFlag.FallingAnimation,
		childId: null,
		edge: Playlist.Rotate,
		next: Playlist.WallSlide,
	},
	{
		id: Playlist.Scoot,
		name: 'Scoot',
		/** @type {Array<!Scene>} */
		scenes: [
			/** @type {!Scene} */ ({
				start: null,
				x: 0,
				y: 0,
				duration: 200,
				repeat: null,
				frames: [
					52,
				],
				sound: null,
				flags: SceneFlag.ForceGravity,
			}),
			/** @type {!Scene} */ ({
				start: null,
				x: 6,
				y: 0,
				duration: 200,
				repeat: null,
				frames: [
					53,
				],
				sound: null,
				flags: SceneFlag.ForceGravity,
			}),
			/** @type {!Scene} */ ({
				start: null,
				x: 0,
				y: 0,
				duration: 200,
				repeat: null,
				frames: [
					52,
				],
				sound: null,
				flags: SceneFlag.ForceGravity,
			}),
			/** @type {!Scene} */ ({
				start: null,
				x: 6,
				y: 0,
				duration: 200,
				repeat: null,
				frames: [
					53,
				],
				sound: null,
				flags: SceneFlag.ForceGravity,
			}),
		],
		flags: AnimationFlag.DefaultChoice | AnimationFlag.DemoPlay | AnimationFlag.NoChildren,
		childId: null,
		edge: null,
		next: [
			[Playlist.Scoot, 4],
			[Playlist.Rotate, 2],
			[Playlist.Walk, 1],
		],
	},
	{
		id: Playlist.SneezeShadow,
		name: 'Sneeze Shadow',
		/** @type {Array<!Scene>} */
		scenes: [
			/** @type {!Scene} */ ({
				start: null,
				x: 60,
				y: 0,
				duration: 600,
				repeat: [3, 2],
				frames: [
					BLANK_FRAME,
					BLANK_FRAME,
					109,
				],
				sound: null,
				flags: SceneFlag.AllowExit | SceneFlag.ForceGravity | SceneFlag.IgnoreEdges,
			}),
		],
		flags: AnimationFlag.NoParents | AnimationFlag.StackBehind,
		childId: null,
		edge: null,
		next: null,
	},
];

/**
 * Max Animation ID
 *
 * @const {number}
 */
export const MAX_ANIMATION_ID = ANIMATIONS.length;

/**
 * Child animations.
 *
 * @const {Set<Playlist>}
 */
export const CHILD_ANIMATIONS = ANIMATIONS.reduce(
	/**
	 * Collect Animations
	 *
	 * @param {Set<Playlist>} out Collection.
	 * @param {Animation} v Animation.
	 * @return {Set<Playlist>} Collection.
	 */
	(out, v) => {
		if (AnimationFlag.NoParents & v.flags) {
			out.add(v.id);
		}

		return out;
	},
	new Set()
);

/**
 * Default Choices
 *
 * @const {Array<WeightedChoice>}
 */
export const DEFAULT_CHOICES = [
	[Playlist.Walk, 10],
	[Playlist.Beg, 2],
	[Playlist.BeginRun, 2],
	[Playlist.Eat, 2],
	[Playlist.Handstand, 2],
	[Playlist.Roll, 2],
	[Playlist.Scratch, 2],
	[Playlist.Spin, 2],
	[Playlist.Abduction, 1],
	[Playlist.Bleat, 1],
	[Playlist.BoredSleep, 1],
	[Playlist.Doze, 1],
	[Playlist.Jump, 1],
	[Playlist.PlayDead, 1],
	[Playlist.Rotate, 1],
	[Playlist.Run, 1],
	[Playlist.Scoot, 1],
	[Playlist.Scream, 1],
	[Playlist.Sleep, 1],
	[Playlist.Sneeze, 1],
	[Playlist.Urinate, 1],
];

/**
 * Entrance Choices
 *
 * @const {Array<WeightedChoice>}
 */
export const ENTRANCE_CHOICES = [
	[Playlist.BathDive, 1],
	[Playlist.BlackSheep, 1],
	[Playlist.ChasingAMartian, 1],
	[Playlist.Fall, 1],
	[Playlist.Stargaze, 1],
];

/**
 * First Choices
 *
 * @const {Array<WeightedChoice>}
 */
export const FIRST_CHOICES = [
	[Playlist.Fall, 10],
	[Playlist.BathDive, 1],
	[Playlist.BlackSheep, 1],
	[Playlist.ChasingAMartian, 1],
	[Playlist.Stargaze, 1],
];



// ---------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------

/**
 * Animation
 *
 * @param {Playlist} id Animation ID.
 * @return {?Animation} Animation.
 */
export const animation = function(id) {
	id = /** @type {!Playlist} */ (parseInt(id, 10) || 0);
	if (! verifyAnimationId(id)) {
		return null;
	}

	/** @const {Animation} */
	const v = ANIMATIONS[id - 1];

	return /** @type {!Animation} */ ({
		id: v.id,
		name: v.name,
		scenes: /** @type {Array<!Scene>} */ (resolveScenes(v.scenes)),
		flags: v.flags,
		childId: v.childId,
		edge: v.edge,
		next: v.next,
	});
};

/**
 * Choose Animation
 *
 * @param {(null|Playlist|Array<WeightedChoice>)} choices Choices.
 * @return {?Playlist} Animation ID.
 */
export const chooseAnimation = function(choices) {
	if (null === choices) {
		return null;
	}
	else if ('number' === typeof choices) {
		return choices;
	}

	/** @type {Array<Playlist>} */
	let out = [];

	// Loop and build.
	for (let i = 0; i < choices.length; ++i) {
		for (let j = 0; j < choices[i][1]; ++j) {
			out.push(choices[i][0]);
		}
	}

	// What we got?
	if (! out.length) {
		return null;
	}
	else if (1 === out.length) {
		return out[0];
	}

	return out[Math.floor(Math.random() * out.length)];
};

/**
 * Resolve Scene
 *
 * @param {!Scene|!SceneCB} scene Scene.
 * @return {!Scene} Scene.
 */
export const resolveScene = function(scene) {
	if ('function' === typeof scene) {
		return /** @type {!Scene} */ (scene());
	}

	return scene;
};

/**
 * Resolve Scenes
 *
 * Scene values can have dynamic callbacks; this will execute callbacks to return static values.
 *
 * @param {Array<Scene>} scenes Scenes.
 * @return {Array<Scene>} Scenes.
 */
export const resolveScenes = function(scenes) {
	/** @type {Array<!Scene>} */
	let out = [];

	for (let i = 0; i < scenes.length; ++i) {
		out.push(resolveScene(scenes[i]));
	}

	return out;
};

/**
 * Scene Step Generator
 *
 * @param {Array<!Scene>} scenes Scenes.
 * @return {Generator} Generator.
 */
export const generateSceneSteps = function* (scenes) {
	/** @type {number} */
	let step = 0;

	// Loop through the scenes.
	for (let i = 0; i < scenes.length; ++i) {
		/** @const {number} */
		const framesLength = scenes[i].frames.length;

		/** @const {number} */
		const repeat = null !== scenes[i].repeat ? scenes[i].repeat[0] : 0;

		/** @const {number} */
		const repeatFrom = repeat ? scenes[i].repeat[1] : 0;

		/** @const {number} */
		const stepsLength = framesLength + (framesLength - repeatFrom) * repeat;

		/** @type {?Array<number>} */
		let xMovement = null;
		let yMovement = null;

		if (SceneFlag.EaseOut & scenes[i].flags) {
			xMovement = sceneStepProgress(stepsLength, scenes[i].x, SceneFlag.EaseOut);
			yMovement = sceneStepProgress(stepsLength, scenes[i].y, SceneFlag.EaseOut);
		}
		else if (SceneFlag.EaseIn & scenes[i].flags) {
			xMovement = sceneStepProgress(stepsLength, scenes[i].x, SceneFlag.EaseIn);
			yMovement = sceneStepProgress(stepsLength, scenes[i].y, SceneFlag.EaseIn);
		}
		else {
			xMovement = sceneStepProgress(stepsLength, scenes[i].x, 0);
			yMovement = sceneStepProgress(stepsLength, scenes[i].y, 0);
		}

		/** @const {number} */
		const durationSlice = 1 / stepsLength * scenes[i].duration;

		// Now that we know how many steps this scene has, let's build them!
		for (let j = 0; j < stepsLength; ++j) {
			// What frame should we show?
			/** @type {number} */
			let frame = 0;
			if (j < framesLength) {
				frame = scenes[i].frames[j];
			}
			else if (! repeatFrom) {
				frame = scenes[i].frames[j % framesLength];
			}
			else {
				frame = scenes[i].frames[repeatFrom + (j - repeatFrom) % (framesLength - repeatFrom)];
			}

			/** @type {?Sound} */
			let sound = null;
			if (null !== scenes[i].sound && scenes[i].sound[1] === j) {
				sound = /** @type {!Sound} */ (scenes[i].sound[0]);
			}

			/** @const {!Step} */
			const out = /** @type {!Step} */ ({
				step: step,
				scene: i,
				interval: durationSlice,
				frame: frame,
				x: null !== xMovement ? xMovement[j] : 0,
				y: null !== yMovement ? yMovement[j] : 0,
				sound: sound,
				flip: !! ((SceneFlag.AutoFlip & scenes[i].flags) && stepsLength - 1 === j),
				flags: scenes[i].flags,
			});
			++step;

			// Keep going!
			if (i + 1 < scenes.length || j + 1 < stepsLength) {
				yield out;
			}
			else {
				return out;
			}
		}
	}
};

/**
 * Get Scene Speed
 *
 * @param {!Scene} scene Scene.
 * @return {number} Speed.
 */
export const sceneSpeed = function(scene) {
	return Math.round(scene.duration / sceneStepsLength(scene));
};

/**
 * Scene Step Progression
 *
 * Easing is nice and all, but moving a sprite .00000001 pixels doesn't
 * quite look right. This method caps lower movements at half a pixel
 * and tweaks the larger values as needed to hopefully arrive at the
 * same total.
 *
 * @param {number} steps Steps.
 * @param {number} total Total.
 * @param {number|!SceneFlag} easing Easing.
 * @return {Array<number>} Progress pool.
 */
export const sceneStepProgress = function(steps, total, easing) {
	/** @type {Array} */
	let out = new Array(steps);

	// If there is no total, we can just return a bunch of zeroes.
	if (! total) {
		out.fill(0);
		return out;
	}

	// If there is no easing, we can save a lot of headache.
	if (SceneFlag.EaseOut !== easing && SceneFlag.EaseIn !== easing) {
		out.fill(1 / steps * total);
		return out;
	}

	/** @const {number} */
	const cap = 0.5;

	/** @type {number} */
	let last = 0;

	/** @type {number} */
	let newTotal = 0;

	/** @const {boolean} */
	const positive = 0 <= total;

	/** @type {number} */
	let maxBig = 0;

	// Loop to calculate the raw easings.
	for (let i = 1; i <= steps; ++i) {
		let current = Math.floor(easeOut(i / steps) * total * 100) / 100 - last;
		if (positive) {
			if (cap > current) {
				current = cap;
			}
			else {
				maxBig = i;
			}
		}
		else if (0 - cap < current) {
			current = 0 - cap;
		}
		else {
			maxBig = 1;
		}

		out[i - 1] = current;
		last += current;
		newTotal += current;
	}

	// If our capping changed the total, we need to loop again to spread the difference between the larger steps.
	if (
		(positive && newTotal > total) ||
		(! positive && newTotal < total)
	) {
		/** @type {number} */
		let difference = newTotal - total;

		/** @type {number} */
		let pool = 0;
		for (let i = 0; i < maxBig; ++i) {
			pool += out[i];
		}

		// Loop again to spread the difference among the largest steps.
		for (let i = 0; i < maxBig; ++i) {
			/** @const {number} */
			const chunk = (out[i] / pool) * difference;
			out[i] -= chunk;
			difference -= chunk;

			// If we're out of difference, we're done!
			if (! difference) {
				break;
			}
		}

		// Count up the totals again.
		newTotal = 0;
		for (let i = 0; i < out.length; ++i) {
			newTotal += out[i];
		}

		// If we're still off, it is probably a precision error. We can just subtract the pennies from the first entry.
		if (
			(positive && newTotal > total) ||
			(! positive && newTotal < total)
		) {
			out[0] -= (newTotal - total);
		}
	}

	// If we're easing in, we need to flip the array.
	if (SceneFlag.EaseIn === easing) {
		out.reverse();
	}

	return out;
};

/**
 * Count Steps in Scene
 *
 * @param {!Scene} scene Scene.
 * @return {number} Steps.
 */
export const sceneStepsLength = function(scene) {
	/** @const {number} */
	const framesLength = scene.frames.length;

	/** @const {number} */
	const repeat = null !== scene.repeat ? scene.repeat[0] : 0;

	/** @const {number} */
	const repeatFrom = repeat ? scene.repeat[1] : 0;

	return framesLength + (framesLength - repeatFrom) * repeat;
};

/**
 * Verify Animation ID
 *
 * @param {!Playlist|number} id Animation ID.
 * @return {boolean} True/false.
 */
export const verifyAnimationId = function(id) {
	return isAbsInt(id) && MAX_ANIMATION_ID >= /** @type {number} */ (id);
};
