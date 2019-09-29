/**
 * @file Animations
 */

import { Poe } from './_poe.mjs';
import { TILE_SIZE } from './_media.mjs';
import {
	Animation,
	Flags,
	Playlist,
	Scene,
	SceneRepeat,
	Sound,
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
		/** @type {Array<Scene>} */
		scenes: [
			{
				start: null,
				from: [-2, 0, 200],
				to: [-2, 0, 200],
				repeat: [20, 0],
				frames: [
					2,
					3,
				],
				sound: null,
				flags: Flags.AllowExit | Flags.ForceGravity,
			},
		],
		useDefault: 1,
		useEntrance: 0,
		useFirst: 0,
		flags: Flags.DemoPlay | Flags.NoChildren,
		childId: null,
		/** @type {Array<WeightedChoice>} */
		edge: [
			[Playlist.Rotate, 5],
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
		/** @type {Array<Scene>} */
		scenes: [
			{
				start: null,
				from: [0, 0, 200],
				to: [0, 0, 200],
				repeat: null,
				frames: [
					3,
					9,
					10,
				],
				sound: null,
				flags: Flags.AutoFlip | Flags.ForceGravity,
			},
			{
				start: null,
				from: [0, 0, 200],
				to: [0, 0, 200],
				repeat: null,
				frames: [
					10,
					9,
					3,
				],
				sound: null,
				flags: Flags.ForceGravity,
			},
		],
		useDefault: 1,
		useEntrance: 0,
		useFirst: 0,
		flags: Flags.DemoPlay | Flags.NoChildren,
		childId: null,
		edge: null,
		/** @type {Array<WeightedChoice>} */
		next: [
			[Playlist.Walk, 10],
			[Playlist.Eat, 1],
		],
	},
	{
		id: Playlist.Drag,
		name: 'Drag',
		/** @type {Array<Scene>} */
		scenes: [
			{
				start: null,
				from: [0, 0, 100],
				to: [0, 0, 100],
				repeat: null,
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
			},
		],
		useDefault: 0,
		useEntrance: 0,
		useFirst: 0,
		flags: Flags.NoChildren,
		childId: null,
		edge: null,
		next: Playlist.Drag,
	},
	{
		id: Playlist.Fall,
		name: 'Fall',
		/** @type {Array<Scene>} */
		scenes: [
			{
				start: null,
				from: [0, 1, 100],
				to: [0, 10, 40],
				repeat: [20, 0],
				frames: [
					133,
				],
				sound: null,
				flags: 0,
			},
		],
		useDefault: 0,
		useEntrance: 1,
		useFirst: 10,
		flags: Flags.NoChildren,
		childId: null,
		edge: Playlist.Bounce,
		next: Playlist.GraspingFall,
	},
	{
		id: Playlist.GraspingFall,
		name: 'Grasping Fall',
		/** @type {Array<Scene>} */
		scenes: [
			{
				start: null,
				from: [0, 10, 40],
				to: [0, 10, 40],
				repeat: [10, 0],
				frames: [
					46,
					46,
					46,
				],
				sound: null,
				flags: 0,
			},
		],
		useDefault: 0,
		useEntrance: 1,
		useFirst: 0,
		flags: Flags.NoChildren,
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
		/** @type {Array<Scene>} */
		scenes: [
			{
				start: null,
				from: [-10, 0, 100],
				to: [-10, 0, 100],
				repeat: [5, 0],
				frames: [
					5,
					4,
					4,
				],
				sound: null,
				flags: Flags.AllowExit | Flags.ForceGravity,
			},
		],
		useDefault: 1,
		useEntrance: 0,
		useFirst: 0,
		flags: Flags.DemoPlay | Flags.NoChildren,
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
		/** @type {Array<Scene>} */
		scenes: [
			{
				start: null,
				from: [1, 0, 100],
				to: [10, 0, 100],
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
				flags: Flags.ForceGravity,
			},
		],
		useDefault: 0,
		useEntrance: 0,
		useFirst: 0,
		flags: Flags.NoChildren,
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
		/** @type {Array<Scene>} */
		scenes: [
			{
				start: null,
				from: [0, 0, 100],
				to: [0, 0, 100],
				repeat: null,
				frames: [
					42,
					49,
					42,
				],
				sound: null,
				flags: Flags.ForceGravity,
			},
			{
				start: null,
				from: [0, -2, 100],
				to: [0, 3, 100],
				repeat: null,
				frames: [
					131,
					42,
					132,
					42,
					49,
				],
				sound: null,
				flags: 0,
			},
			{
				start: null,
				from: [0, 0, 100],
				to: [0, 0, 100],
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
				flags: Flags.ForceGravity,
			},
		],
		useDefault: 0,
		useEntrance: 0,
		useFirst: 0,
		flags: Flags.NoChildren,
		childId: null,
		edge: null,
		next: Playlist.Walk,
	},
	{
		id: Playlist.Splat,
		name: 'Splat!',
		/** @type {Array<Scene>} */
		scenes: [
			{
				start: null,
				from: [0, 0, 200],
				to: [0, 0, 500],
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
			},
		],
		useDefault: 0,
		useEntrance: 0,
		useFirst: 0,
		flags: Flags.NoChildren,
		childId: null,
		edge: null,
		next: Playlist.Walk,
	},
	{
		id: Playlist.Urinate,
		name: 'Urinate',
		/** @type {Array<Scene>} */
		scenes: [
			{
				start: null,
				from: [0, 0, 200],
				to: [0, 0, 200],
				repeat: () => [Math.floor(5 + Math.random() * 10), 5],
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
				flags: Flags.ForceGravity,
			},
			{
				start: null,
				from: [0, 0, 200],
				to: [0, 0, 200],
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
				flags: Flags.ForceGravity,
			},
		],
		useDefault: 1,
		useEntrance: 0,
		useFirst: 0,
		flags: Flags.DemoPlay | Flags.NoChildren,
		childId: null,
		edge: null,
		next: Playlist.Walk,
	},
	{
		id: Playlist.PlayDead,
		name: 'Play Dead',
		/** @type {Array<Scene>} */
		scenes: [
			{
				start: null,
				from: [0, 0, 100],
				to: [0, 0, 100],
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
				flags: Flags.ForceGravity,
			},
		],
		useDefault: 1,
		useEntrance: 0,
		useFirst: 0,
		flags: Flags.DemoPlay | Flags.NoChildren,
		childId: null,
		edge: null,
		next: Playlist.Walk,
	},
	{
		id: Playlist.Scream,
		name: 'Scream!',
		/** @type {Array<Scene>} */
		scenes: [
			{
				start: null,
				from: [0, 0, 30],
				to: [0, 0, 100],
				repeat: [12, 0],
				frames: [
					50,
					51,
				],
				sound: null,
				flags: Flags.ForceGravity,
			},
		],
		useDefault: 1,
		useEntrance: 0,
		useFirst: 0,
		flags: Flags.DemoPlay | Flags.NoChildren,
		childId: null,
		edge: null,
		next: Playlist.Run,
	},
	{
		id: Playlist.Sleep,
		name: 'Sleep',
		/** @type {Array<Scene>} */
		scenes: [
			{
				start: null,
				from: [0, 0, 1000],
				to: [0, 0, 200],
				repeat: () => [Math.floor(10 + Math.random() * 20), 9],
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
				flags: Flags.ForceGravity,
			},
			{
				start: null,
				from: [0, 0, 200],
				to: [0, 0, 200],
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
				flags: Flags.ForceGravity,
			},
		],
		useDefault: 1,
		useEntrance: 0,
		useFirst: 0,
		flags: Flags.DemoPlay | Flags.NoChildren,
		childId: null,
		edge: null,
		next: Playlist.Walk,
	},
	{
		id: Playlist.Doze,
		name: 'Doze',
		/** @type {Array<Scene>} */
		scenes: [
			{
				start: null,
				from: [0, 0, 200],
				to: [0, 0, 200],
				repeat: () => [Math.floor(20 + Math.random() * 10), 6],
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
				flags: Flags.ForceGravity,
			},
			{
				start: null,
				from: [0, 0, 200],
				to: [0, 0, 200],
				repeat: null,
				frames: [
					8,
					7,
					6,
				],
				sound: null,
				flags: Flags.ForceGravity,
			},
		],
		useDefault: 1,
		useEntrance: 0,
		useFirst: 0,
		flags: Flags.DemoPlay | Flags.NoChildren,
		childId: null,
		edge: null,
		next: Playlist.Walk,
	},
	{
		id: Playlist.BoredSleep,
		name: 'Bored Sleep',
		/** @type {Array<Scene>} */
		scenes: [
			{
				start: null,
				from: [0, 0, 200],
				to: [0, 0, 200],
				repeat: () => [Math.floor(30 + Math.random() * 10), 7],
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
				flags: Flags.ForceGravity,
			},
			{
				start: null,
				from: [0, 0, 200],
				to: [0, 0, 200],
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
				flags: Flags.ForceGravity,
			},
		],
		useDefault: 1,
		useEntrance: 0,
		useFirst: 0,
		flags: Flags.DemoPlay | Flags.NoChildren,
		childId: null,
		edge: null,
		next: Playlist.Walk,
	},
	{
		id: Playlist.BathDive,
		name: 'Bath Dive',
		/** @type {Array<Scene>} */
		scenes: [
			{
				start: () => [
					Poe.width,
					Poe.height - 600,
				],
				from: [-4, 3, 30],
				to: [-4, 3, 30],
				repeat: [146, 0],
				frames: [
					134,
				],
				sound: null,
				flags: 0,
			},
			{
				start: null,
				from: [-4, 3, 30],
				to: [-4, 3, 30],
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
			},
		],
		useDefault: 0,
		useEntrance: 1,
		useFirst: 1,
		flags: Flags.DemoPlay | Flags.NoChildren,
		childId: Playlist.BathDiveChild,
		edge: Playlist.BathCoolDown,
		next: Playlist.BathCoolDown,
	},
	{
		id: Playlist.BathDiveChild,
		name: 'Bath Dive 👶',
		/** @type {Array<Scene>} */
		scenes: [
			{
				start: () => [
					Poe.width - 800 + TILE_SIZE + 10,
					Poe.height - TILE_SIZE,
				],
				from: [0, 0, 30],
				to: [0, 0, 30],
				repeat: [171, 0],
				frames: [
					146,
				],
				sound: null,
				flags: 0,
			},
			{
				start: null,
				from: [0, 0, 30],
				to: [0, 0, 30],
				repeat: [5, 20],
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
				sound: null,
				flags: 0,
			},
		],
		useDefault: 0,
		useEntrance: 0,
		useFirst: 0,
		flags: Flags.NoParents,
		childId: null,
		edge: null,
		next: null,
	},
	{
		id: Playlist.Jump,
		name: 'Jump',
		/** @type {Array<Scene>} */
		scenes: [
			{
				start: null,
				from: [-10, -8, 100],
				to: [-10, 10, 100],
				repeat: null,
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
				sound: null,
				flags: 0,
			},
		],
		useDefault: 1,
		useEntrance: 0,
		useFirst: 0,
		flags: Flags.DemoPlay | Flags.NoChildren,
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
		/** @type {Array<Scene>} */
		scenes: [
			{
				start: null,
				from: [0, 0, 300],
				to: [0, 0, 300],
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
				flags: Flags.ForceGravity,
			},
		],
		useDefault: 1,
		useEntrance: 0,
		useFirst: 0,
		flags: Flags.DemoPlay | Flags.NoChildren,
		childId: Playlist.FlowerChild,
		edge: null,
		next: Playlist.Walk,
	},
	{
		id: Playlist.FlowerChild,
		name: 'Flower 👶',
		/** @type {Array<Scene>} */
		scenes: [
			{
				start: null,
				from: [0, 0, 300],
				to: [0, 0, 300],
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
					174,
					174,
					174,
				],
				sound: null,
				flags: 0,
			},
		],
		useDefault: 0,
		useEntrance: 0,
		useFirst: 0,
		flags: Flags.NoParents,
		childId: null,
		edge: null,
		next: null,
	},
	{
		id: Playlist.BlackSheep,
		name: 'Black Sheep ',
		/** @type {Array<Scene>} */
		scenes: [
			{
				start: () => [
					Poe.width + TILE_SIZE,
					Poe.height - TILE_SIZE,
				],
				from: [-10, 0, 100],
				to: [-10, 0, 100],
				repeat: () => [Math.floor((Poe.width / 2) / 30 - 6), 0],
				frames: [
					5,
					4,
					4,
				],
				sound: null,
				flags: Flags.ForceGravity,
			},
			{
				start: null,
				from: [-6, 0, 100],
				to: [0, 0, 100],
				repeat: () => [
					Math.floor(25 + (Math.floor(Poe.width / 2) % 30) / 7),
					0,
				],
				frames: [
					2,
					3,
				],
				sound: null,
				flags: Flags.ForceGravity,
			},
			{
				start: null,
				from: [0, 0, 500],
				to: [0, 0, 500],
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
				flags: Flags.ForceGravity,
			},
		],
		useDefault: 0,
		useEntrance: 1,
		useFirst: 1,
		flags: Flags.DemoPlay | Flags.NoChildren,
		childId: Playlist.BlackSheepChild,
		edge: null,
		next: Playlist.Walk,
	},
	{
		id: Playlist.BlackSheepChild,
		name: 'Black Sheep 👶',
		/** @type {Array<Scene>} */
		scenes: [
			{
				start: () => [
					0 - TILE_SIZE,
					Poe.height - TILE_SIZE,
				],
				from: [10, 0, 100],
				to: [10, 0, 100],
				repeat: () => [Math.floor((Poe.width / 2) / 30 - 6), 0],
				frames: [
					155,
					154,
					154,
				],
				sound: null,
				flags: Flags.ForceGravity,
			},
			{
				start: null,
				from: [6, 0, 100],
				to: [0, 0, 100],
				repeat: () => [
					Math.floor(24 + (Math.floor(Poe.width / 2) % 30) / 7),
					0,
				],
				frames: [
					156,
					157,
				],
				sound: null,
				flags: Flags.ForceGravity,
			},
			{
				start: null,
				from: [0, 0, 500],
				to: [0, 0, 500],
				repeat: [9, 0],
				frames: [
					157,
				],
				sound: null,
				flags: Flags.ForceGravity,
			},
			{
				start: null,
				from: [0, 0, 20],
				to: [0, 0, 20],
				repeat: [20, 0],
				frames: [
					157,
				],
				sound: null,
				flags: Flags.ForceGravity,
			},
		],
		useDefault: 0,
		useEntrance: 0,
		useFirst: 0,
		flags: Flags.NoParents,
		childId: null,
		edge: null,
		next: null,
	},
	{
		id: Playlist.BeginRun,
		name: 'Begin Run',
		/** @type {Array<Scene>} */
		scenes: [
			{
				start: null,
				from: [-2, 0, 200],
				to: [-10, 0, 100],
				repeat: null,
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
				sound: null,
				flags: Flags.ForceGravity,
			},
		],
		useDefault: 1,
		useEntrance: 0,
		useFirst: 0,
		flags: Flags.DemoPlay | Flags.NoChildren,
		childId: null,
		edge: Playlist.Boing,
		next: Playlist.Run,
	},
	{
		id: Playlist.RunEnd,
		name: 'Run (End)',
		/** @type {Array<Scene>} */
		scenes: [
			{
				start: null,
				from: [-10, 0, 100],
				to: [-2, 0, 200],
				repeat: null,
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
				sound: null,
				flags: Flags.ForceGravity,
			},
		],
		useDefault: 0,
		useEntrance: 0,
		useFirst: 0,
		flags: Flags.NoChildren,
		childId: null,
		edge: Playlist.Boing,
		next: Playlist.Walk,
	},
	{
		id: Playlist.ClimbUp,
		name: 'Climb Up',
		/** @type {Array<Scene>} */
		scenes: [
			{
				start: null,
				from: [0, -2, 150],
				to: [0, -2, 150],
				repeat: () => [Math.floor(Poe.height / 2), 2],
				frames: [
					31,
					30,
					15,
					16,
				],
				sound: null,
				flags: 0,
			},
		],
		useDefault: 0,
		useEntrance: 0,
		useFirst: 0,
		flags: Flags.NoChildren,
		childId: null,
		edge: Playlist.ReachCeiling,
		next: Playlist.ClimbUp,
	},
	{
		id: Playlist.ReachCeiling,
		name: 'Reach Ceiling',
		/** @type {Array<Scene>} */
		scenes: [
			{
				start: null,
				from: [0, 0, 200],
				to: [2, 0, 200],
				repeat: null,
				frames: [
					16,
					17,
					28,
				],
				sound: null,
				flags: Flags.AutoFlip,
			},
		],
		useDefault: 0,
		useEntrance: 0,
		useFirst: 0,
		flags: Flags.NoChildren,
		childId: null,
		edge: null,
		next: Playlist.WalkUpsideDown,
	},
	{
		id: Playlist.WalkUpsideDown,
		name: 'Walk Upside Down',
		/** @type {Array<Scene>} */
		scenes: [
			{
				start: null,
				from: [-2, 0, 150],
				to: [-2, 0, 150],
				repeat: () => [Math.floor(Poe.width / 2), 0],
				frames: [
					98,
					97,
				],
				sound: null,
				flags: 0,
			},
		],
		useDefault: 0,
		useEntrance: 0,
		useFirst: 0,
		flags: Flags.NoChildren,
		childId: null,
		edge: Playlist.ReachSide,
		next: Playlist.WalkUpsideDown,
	},
	{
		id: Playlist.ReachSide,
		name: 'Reach Side',
		/** @type {Array<Scene>} */
		scenes: [
			{
				start: null,
				from: [0, 0, 800],
				to: [0, 0, 800],
				repeat: null,
				frames: [
					97,
					97,
				],
				sound: null,
				flags: Flags.AutoFlip,
			},
		],
		useDefault: 0,
		useEntrance: 0,
		useFirst: 0,
		flags: Flags.NoChildren,
		childId: null,
		edge: null,
		next: Playlist.ClimbDown,
	},
	{
		id: Playlist.ClimbDown,
		name: 'Climb Down',
		/** @type {Array<Scene>} */
		scenes: [
			{
				start: null,
				from: [0, 2, 150],
				to: [0, 2, 150],
				repeat: () => [Math.floor(Poe.height / 2), 0],
				frames: [
					19,
					20,
				],
				sound: null,
				flags: 0,
			},
		],
		useDefault: 0,
		useEntrance: 0,
		useFirst: 0,
		flags: Flags.NoChildren,
		childId: null,
		edge: Playlist.ReachFloor,
		next: Playlist.ClimbDown,
	},
	{
		id: Playlist.ReachFloor,
		name: 'Reach Floor',
		/** @type {Array<Scene>} */
		scenes: [
			{
				start: null,
				from: [0, 0, 200],
				to: [0, 0, 200],
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
			},
		],
		useDefault: 0,
		useEntrance: 0,
		useFirst: 0,
		flags: Flags.NoChildren,
		childId: null,
		edge: null,
		next: Playlist.Walk,
	},
	{
		id: Playlist.Beg,
		name: 'Beg',
		/** @type {Array<Scene>} */
		scenes: [
			{
				start: null,
				from: [0, 0, 200],
				to: [0, 0, 200],
				repeat: null,
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
				sound: null,
				flags: Flags.ForceGravity,
			},
		],
		useDefault: 1,
		useEntrance: 0,
		useFirst: 0,
		flags: Flags.DemoPlay | Flags.NoChildren,
		childId: null,
		edge: null,
		next: Playlist.Walk,
	},
	{
		id: Playlist.Bleat,
		name: 'Bleat',
		/** @type {Array<Scene>} */
		scenes: [
			{
				start: null,
				from: [0, 0, 200],
				to: [0, 0, 200],
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
				flags: Flags.ForceGravity,
			},
		],
		useDefault: 1,
		useEntrance: 0,
		useFirst: 0,
		flags: Flags.DemoPlay | Flags.NoChildren,
		childId: null,
		edge: null,
		next: Playlist.Walk,
	},
	{
		id: Playlist.Handstand,
		name: 'Handstand',
		/** @type {Array<Scene>} */
		scenes: [
			{
				start: null,
				from: [-2, 0, 200],
				to: [-2, 0, 200],
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
				flags: Flags.ForceGravity,
			},
		],
		useDefault: 1,
		useEntrance: 0,
		useFirst: 0,
		flags: Flags.DemoPlay | Flags.NoChildren,
		childId: null,
		edge: null,
		next: Playlist.Walk,
	},
	{
		id: Playlist.Slide,
		name: 'Slide',
		/** @type {Array<Scene>} */
		scenes: [
			{
				start: null,
				from: [-4, 0, 50],
				to: [0, 0, 200],
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
				flags: Flags.ForceGravity,
			},
		],
		useDefault: 0,
		useEntrance: 0,
		useFirst: 0,
		flags: Flags.DemoPlay | Flags.NoChildren,
		childId: null,
		edge: null,
		next: Playlist.Walk,
	},
	{
		id: Playlist.BathCoolDown,
		name: 'Bath Cool Down',
		/** @type {Array<Scene>} */
		scenes: [
			{
				start: null,
				from: [0, 0, 100],
				to: [0, 0, 100],
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
				flags: Flags.ForceGravity,
			},
			{
				start: null,
				from: [0, 0, 100],
				to: [0, 0, 100],
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
				flags: Flags.ForceGravity,
			},
		],
		useDefault: 0,
		useEntrance: 0,
		useFirst: 0,
		flags: Flags.NoChildren,
		childId: null,
		edge: null,
		next: null,
	},
	{
		id: Playlist.Roll,
		name: 'Roll',
		/** @type {Array<Scene>} */
		scenes: [
			{
				start: null,
				from: [0, 0, 200],
				to: [0, 0, 200],
				repeat: null,
				frames: [
					9,
					10,
					10,
				],
				sound: null,
				flags: Flags.ForceGravity,
			},
			{
				start: null,
				from: [-8, 0, 100],
				to: [-8, 0, 100],
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
				flags: Flags.ForceGravity,
			},
			{
				start: null,
				from: [0, 0, 200],
				to: [0, 0, 200],
				repeat: null,
				frames: [
					10,
					10,
					9,
				],
				sound: null,
				flags: Flags.ForceGravity,
			},
		],
		useDefault: 1,
		useEntrance: 0,
		useFirst: 0,
		flags: Flags.DemoPlay | Flags.NoChildren,
		childId: null,
		edge: null,
		next: Playlist.Walk,
	},
	{
		id: Playlist.Sneeze,
		name: 'Sneeze',
		/** @type {Array<Scene>} */
		scenes: [
			{
				start: null,
				from: [0, 0, 200],
				to: [0, 0, 200],
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
				flags: Flags.ForceGravity,
			},
		],
		useDefault: 1,
		useEntrance: 0,
		useFirst: 0,
		flags: Flags.DemoPlay | Flags.NoChildren,
		childId: null,
		edge: null,
		next: Playlist.Walk,
	},
	{
		id: Playlist.Scratch,
		name: 'Scratch',
		/** @type {Array<Scene>} */
		scenes: [
			{
				start: null,
				from: [0, 0, 200],
				to: [0, 0, 200],
				repeat: [3, 0],
				frames: [
					56,
					57,
				],
				sound: null,
				flags: Flags.ForceGravity,
			},
		],
		useDefault: 1,
		useEntrance: 0,
		useFirst: 0,
		flags: Flags.DemoPlay | Flags.NoChildren,
		childId: null,
		edge: null,
		next: null,
	},
	{
		id: Playlist.Stargaze,
		name: 'Stargaze',
		/** @type {Array<Scene>} */
		scenes: [
			{
				start: () => [
					Poe.width,
					Poe.height - TILE_SIZE,
				],
				from: [-2, 0, 100],
				to: [-2, 0, 100],
				repeat: [10, 0],
				frames: [
					2,
					3,
				],
				sound: null,
				flags: Flags.ForceGravity,
			},
			{
				start: null,
				from: [0, 0, 50],
				to: [0, 0, 50],
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
				flags: Flags.ForceGravity,
			},
		],
		useDefault: 0,
		useEntrance: 1,
		useFirst: 1,
		flags: Flags.DemoPlay | Flags.NoChildren,
		childId: Playlist.StargazeChild,
		edge: null,
		next: Playlist.Scream,
	},
	{
		id: Playlist.StargazeChild,
		name: 'Stargaze 👶',
		/** @type {Array<Scene>} */
		scenes: [
			{
				start: () => [
					0 - TILE_SIZE,
					TILE_SIZE * 2,
				],
				from: [0, 0, 100],
				to: [0, 0, 100],
				repeat: [20, 0],
				frames: [
					158,
				],
				sound: null,
				flags: Flags.IgnoreEdges,
			},
			{
				start: null,
				from: [5, -1, 25],
				to: [5, -1, 25],
				repeat: [40, 0],
				frames: [
					158,
					159,
					160,
					161,
				],
				sound: null,
				flags: Flags.IgnoreEdges,
			},
		],
		useDefault: 0,
		useEntrance: 0,
		useFirst: 0,
		flags: Flags.NoParents,
		childId: null,
		edge: null,
		next: null,
	},
	{
		id: Playlist.Abduction,
		name: 'Abduction',
		/** @type {Array<Scene>} */
		scenes: [
			{
				start: null,
				from: [0, 0, 200],
				to: [0, 0, 200],
				repeat: [10, 5],
				frames: [
					9,
					10,
					10,
					10,
					10,
					34,
				],
				sound: null,
				flags: Flags.ForceGravity,
			},
			{
				start: null,
				from: [0, 0, 25],
				to: [0, 0, 25],
				repeat: () => [Math.floor(Poe.width / 4), 47],
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
				sound: null,
				flags: Flags.ForceGravity | Flags.IgnoreEdges,
			},
		],
		useDefault: 1,
		useEntrance: 0,
		useFirst: 0,
		flags: Flags.DemoPlay | Flags.NoChildren,
		childId: Playlist.AbductionChild,
		edge: null,
		next: Playlist.ChasingAMartian,
	},
	{
		id: Playlist.AbductionChild,
		name: 'Abduction 👶',
		/** @type {Array<Scene>} */
		scenes: [
			{
				start: null,
				from: [0, 4, 25],
				to: [0, 4, 25],
				repeat: [29, 0],
				frames: [
					158,
					159,
					160,
					161,
				],
				sound: null,
				flags: Flags.IgnoreEdges,
			},
		],
		useDefault: 0,
		useEntrance: 0,
		useFirst: 0,
		flags: Flags.NoParents,
		childId: null,
		edge: null,
		next: Playlist.AbductionBeamingChild,
	},
	{
		id: Playlist.AbductionBeamingChild,
		name: 'Abduction Beaming 👶',
		/** @type {Array<Scene>} */
		scenes: [
			{
				start: null,
				from: [0, 0, 25],
				to: [0, 0, 25],
				repeat: [11, 0],
				frames: [
					162,
					163,
					164,
					165,
				],
				sound: null,
				flags: Flags.IgnoreEdges,
			},
			{
				start: null,
				from: [4, -1, 25],
				to: [4, -1, 25],
				repeat: () => [Math.floor(Poe.width / 16), 0],
				frames: [
					158,
					159,
					160,
					161,
				],
				sound: null,
				flags: Flags.IgnoreEdges,
			},
		],
		useDefault: 0,
		useEntrance: 0,
		useFirst: 0,
		flags: Flags.NoParents,
		childId: Playlist.AbductionBeamChild,
		edge: null,
		next: null,
	},
	{
		id: Playlist.AbductionBeamChild,
		name: 'Abduction Beam 👶',
		/** @type {Array<Scene>} */
		scenes: [
			{
				start: null,
				from: [0, 0, 25],
				to: [0, 0, 25],
				repeat: [35, 7],
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
				sound: null,
				flags: Flags.IgnoreEdges,
			},
		],
		useDefault: 0,
		useEntrance: 0,
		useFirst: 0,
		flags: Flags.NoParents,
		childId: null,
		edge: null,
		next: null,
	},
	{
		id: Playlist.ChasingAMartian,
		name: 'Chasing a Martian!',
		/** @type {Array<Scene>} */
		scenes: [
			{
				start: () => [
					Poe.width + TILE_SIZE * 3,
					Poe.height - TILE_SIZE,
				],
				from: [-10, 0, 100],
				to: [-10, 0, 100],
				repeat: () => [Math.floor(Poe.width / 2 / 30), 0],
				frames: [
					5,
					4,
					4,
				],
				sound: null,
				flags: Flags.ForceGravity | Flags.IgnoreEdges,
			},
		],
		useDefault: 0,
		useEntrance: 1,
		useFirst: 1,
		flags: Flags.DemoPlay | Flags.NoChildren,
		childId: Playlist.ChasingAMartianChild,
		edge: null,
		next: Playlist.Bleat,
	},
	{
		id: Playlist.ChasingAMartianChild,
		name: 'Chasing a Martian! 👶',
		/** @type {Array<Scene>} */
		scenes: [
			{
				start: () => [
					Poe.width + TILE_SIZE,
					Poe.height - TILE_SIZE,
				],
				from: [-12, 0, 100],
				to: [-12, 0, 100],
				repeat: () => [Math.floor(Poe.width / 48 + 4), 0],
				frames: [
					166,
					167,
					166,
					168,
				],
				sound: null,
				flags: Flags.AllowExit | Flags.ForceGravity | Flags.IgnoreEdges,
			},
		],
		useDefault: 0,
		useEntrance: 0,
		useFirst: 0,
		flags: Flags.NoParents,
		childId: null,
		edge: null,
		next: null,
	},
	{
		id: Playlist.Spin,
		name: 'Spin',
		/** @type {Array<Scene>} */
		scenes: [
			{
				start: null,
				from: [0, 0, 100],
				to: [0, 0, 100],
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
				flags: Flags.ForceGravity,
			},
		],
		useDefault: 1,
		useEntrance: 0,
		useFirst: 0,
		flags: Flags.DemoPlay | Flags.NoChildren,
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
		/** @type {Array<Scene>} */
		scenes: [
			{
				start: null,
				from: [0, 5, 40],
				to: [0, 5, 40],
				repeat: [10, 0],
				frames: [
					29,
				],
				sound: null,
				flags: 0,
			},
		],
		useDefault: 0,
		useEntrance: 0,
		useFirst: 0,
		flags: Flags.NoChildren,
		childId: null,
		edge: Playlist.Rotate,
		next: Playlist.WallSlide,
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
		if (Flags.NoParents & v.flags) {
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
export const DEFAULT_CHOICES = ANIMATIONS.reduce(
	/**
	 * Collect Animations
	 *
	 * @param {Array<WeightedChoice>} out Collection.
	 * @param {Animation} v Animation.
	 * @return {Array<WeightedChoice>} Collection.
	 */
	(out, v) => {
		if (0 < v.useDefault) {
			out.push([v.id, v.useDefault]);
		}

		return out;
	},
	[]
);

/**
 * Entrance Choices
 *
 * @const {Array<WeightedChoice>}
 */
export const ENTRANCE_CHOICES = ANIMATIONS.reduce(
	/**
	 * Collect Animations
	 *
	 * @param {Array<WeightedChoice>} out Collection.
	 * @param {Animation} v Animation.
	 * @return {Array<WeightedChoice>} Collection.
	 */
	(out, v) => {
		if (0 < v.useEntrance) {
			out.push([v.id, v.useEntrance]);
		}

		return out;
	},
	[]
);

/**
 * First Choices
 *
 * @const {Array<WeightedChoice>}
 */
export const FIRST_CHOICES = ANIMATIONS.reduce(
	/**
	 * Collect Animations
	 *
	 * @param {Array<WeightedChoice>} out Collection.
	 * @param {Animation} v Animation.
	 * @return {Array<WeightedChoice>} Collection.
	 */
	(out, v) => {
		if (0 < v.useFirst) {
			out.push([v.id, v.useFirst]);
		}

		return out;
	},
	[]
);



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
		scenes: resolveScenes(v.scenes),
		useDefault: v.useDefault,
		useEntrance: v.useEntrance,
		useFirst: v.useFirst,
		flags: v.flags,
		childId: v.childId,
		edge: (null === v.edge) || ('number' === typeof v.edge) ? v.edge : JSON.parse(JSON.stringify(v.edge)),
		next: (null === v.next) || ('number' === typeof v.next) ? v.next : JSON.parse(JSON.stringify(v.next)),
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
		choices = /** @type {!Playlist} */ (parseInt(choices, 10) || 0);
		return verifyAnimationId(choices) ? choices : null;
	}

	/** @type {Array<Playlist>} */
	let out = [];

	// Loop and build.
	for (let i = 0; i < choices.length; ++i) {
		if (
			'number' === typeof choices[i][0] &&
			'number' === typeof choices[i][1] &&
			0 < choices[i][1] &&
			verifyAnimationId(choices[i][0])
		) {
			for (let j = 0; j < choices[i][1]; ++j) {
				out.push(choices[i][0]);
			}
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
 * @param {Scene} scene Scene.
 * @return {Scene} Scene.
 */
export const resolveScene = function(scene) {
	/** @type {?SceneRepeat} */
	let repeat = null;
	if ('function' === typeof scene.repeat) {
		repeat = scene.repeat();
	}
	else if (null !== scene.repeat) {
		repeat = [...scene.repeat];
	}

	return /** @type {!Scene} */ ({
		start: 'function' === typeof scene.start ? scene.start() : scene.start,
		from: [...scene.from],
		to: [...scene.to],
		repeat: repeat,
		frames: [...scene.frames],
		sound: null === scene.sound ? null : [...scene.sound],
		flags: scene.flags,
	});
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
	/** @type {Array<Scene>} */
	let out = [];

	for (let i = 0; i < scenes.length; ++i) {
		out.push(resolveScene(scenes[i]));
	}

	return out;
};

/**
 * Verify Animation ID
 *
 * @param {Playlist} id Animation ID.
 * @return {boolean} True/false.
 */
export const verifyAnimationId = function(id) {
	id = /** @type {!Playlist} */ (parseInt(id, 10) || -1);
	return 0 < id && MAX_ANIMATION_ID >= id;
};
