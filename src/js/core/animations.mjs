/**
 * @file Animation List
 */

import {
	Animation,
	AnimationFlag,
	ChoiceList,
	FrameList,
	Playlist,
	Position,
	Scene,
	SceneCb,
	SceneFlag,
	SceneList,
	Sound,
	SpriteInfo,
	Universe
} from '../core.mjs';



/**
 * Animations
 *
 * @const {!Array<!Animation>}
 */
export const AnimationList = [
	/** @type {!Animation} */ ({
		id: Playlist.Walk,
		name: 'Walk',
		/** @type {!SceneList} */
		scenes: new SceneList([
			/** @type {!Scene} */ ({
				start: null,
				/** @type {!Position} */
				move: new Position(-84, 0),
				duration: 6300,
				/** @type {!FrameList} */
				frames: new FrameList(
					[
						2,
						3,
					],
					20,
					0
				),
				sound: null,
				flags: SceneFlag.Gravity,
			}),
		]),
		flags: AnimationFlag.AllowExit | AnimationFlag.DefaultChoice | AnimationFlag.DirectPlay | AnimationFlag.PrimaryMates,
		childId: null,
		/** @type {!ChoiceList} */
		edge: new ChoiceList([
			[Playlist.Rotate, 5],
			[Playlist.Scoot, 2],
			[Playlist.ClimbUp, 1],
		]),
		/** @type {!ChoiceList} */
		next: new ChoiceList([
			[Playlist.Walk, 10],
			[Playlist.BeginRun, 5],
			[Playlist.Beg, 1],
			[Playlist.Eat, 1],
			[Playlist.Handstand, 1],
			[Playlist.Roll, 1],
		]),
	}),
	/** @type {!Animation} */ ({
		id: Playlist.Rotate,
		name: 'Rotate',
		/** @type {!SceneList} */
		scenes: new SceneList([
			/** @type {!Scene} */ ({
				start: null,
				move: null,
				duration: 450,
				/** @type {!FrameList} */
				frames: new FrameList(
					[
						3,
						9,
						10,
					],
					0,
					0
				),
				sound: null,
				flags: SceneFlag.FlipAfter | SceneFlag.Gravity,
			}),

			/** @type {!Scene} */ ({
				start: null,
				move: null,
				duration: 450,
				/** @type {!FrameList} */
				frames: new FrameList(
					[
						10,
						9,
						3,
					],
					0,
					0
				),
				sound: null,
				flags: SceneFlag.Gravity,
			}),
		]),
		flags: AnimationFlag.DefaultChoice | AnimationFlag.DirectPlay | AnimationFlag.PrimaryMates,
		childId: null,
		edge: null,
		next: Playlist.Walk,
	}),
	/** @type {!Animation} */ ({
		id: Playlist.Drag,
		name: 'Drag',
		/** @type {!SceneList} */
		scenes: new SceneList([
			/** @type {!Scene} */ ({
				start: null,
				move: null,
				duration: 2700,
				/** @type {!FrameList} */
				frames: new FrameList(
					[
						42,
						43,
						43,
						42,
						44,
						44,
					],
					2,
					0
				),
				sound: null,
				flags: 0,
			}),
		]),
		flags: AnimationFlag.Dragging | AnimationFlag.PrimaryMates,
		childId: null,
		edge: null,
		next: Playlist.Drag,
	}),
	/** @type {!Animation} */ ({
		id: Playlist.Fall,
		name: 'Fall',
		/** @type {!SceneList} */
		scenes: new SceneList([
			/** @type {!Scene} */ ({
				start: null,
				/** @type {!Position} */
				move: new Position(0, 250),
				duration: 1050,
				/** @type {!FrameList} */
				frames: new FrameList(
					[
						133,
					],
					25,
					0
				),
				sound: null,
				flags: SceneFlag.EaseIn,
			}),
		]),
		flags: AnimationFlag.FirstChoice | AnimationFlag.PrimaryMates | AnimationFlag.Falling,
		childId: null,
		edge: Playlist.Bounce,
		next: Playlist.GraspingFall,
	}),
	/** @type {!Animation} */ ({
		id: Playlist.GraspingFall,
		name: 'Grasping Fall',
		/** @type {!SceneList} */
		scenes: new SceneList([
			/** @type {!Scene} */ ({
				start: null,
				/** @type {!Position} */
				move: new Position(0, 800),
				duration: 1320,
				/** @type {!FrameList} */
				frames: new FrameList(
					[
						46,
						46,
						46,
						47,
						47,
						47,
					],
					9,
					0
				),
				sound: null,
				flags: 0,
			}),
		]),
		flags: AnimationFlag.PrimaryMates | AnimationFlag.Falling,
		childId: null,
		/** @type {!ChoiceList} */
		edge: new ChoiceList([
			[Playlist.Splat, 3],
			[Playlist.Bounce, 1],
			[Playlist.PlayDead, 1],
		]),
		next: Playlist.GraspingFall,
	}),
	/** @type {!Animation} */ ({
		id: Playlist.Run,
		name: 'Run',
		/** @type {!SceneList} */
		scenes: new SceneList([
			/** @type {!Scene} */ ({
				start: null,
				/** @type {!Position} */
				move: new Position(-180, 0),
				duration: 1800,
				/** @type {!FrameList} */
				frames: new FrameList(
					[
						5,
						4,
						4,
					],
					5,
					0
				),
				sound: null,
				flags: SceneFlag.Gravity,
			}),
		]),
		flags: AnimationFlag.AllowExit | AnimationFlag.DirectPlay | AnimationFlag.PrimaryMates,
		childId: null,
		edge: Playlist.Boing,
		/** @type {!ChoiceList} */
		next: new ChoiceList([
			[Playlist.RunEnd, 4],
			[Playlist.Jump, 3],
			[Playlist.Run, 2],
		]),
	}),
	/** @type {!Animation} */ ({
		id: Playlist.Boing,
		name: 'Boing!',
		/** @type {!SceneList} */
		scenes: new SceneList([
			/** @type {!Scene} */ ({
				start: null,
				/** @type {!Position} */
				move: new Position(55, 0),
				duration: 1100,
				/** @type {!FrameList} */
				frames: new FrameList(
					[
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
					0,
					0
				),
				sound: null,
				flags: SceneFlag.Gravity | SceneFlag.EaseOut,
			}),
		]),
		flags: AnimationFlag.PrimaryMates,
		childId: null,
		edge: null,
		/** @type {!ChoiceList} */
		next: new ChoiceList([
			[Playlist.Rotate, 8],
			[Playlist.Walk, 4],
			[Playlist.BeginRun, 1],
		]),
	}),
	/** @type {!Animation} */ ({
		id: Playlist.Bounce,
		name: 'Bounce',
		/** @type {!SceneList} */
		scenes: new SceneList([
			/** @type {!Scene} */ ({
				start: null,
				move: null,
				duration: 300,
				/** @type {!FrameList} */
				frames: new FrameList(
					[
						42,
						49,
						42,
					],
					0,
					0
				),
				sound: null,
				flags: SceneFlag.Gravity,
			}),
			/** @type {!Scene} */ ({
				start: null,
				/** @type {!Position} */
				move: new Position(0, -6),
				duration: 200,
				/** @type {!FrameList} */
				frames: new FrameList(
					[
						131,
						42,
					],
					0,
					0
				),
				sound: null,
				flags: 0,
			}),
			/** @type {!Scene} */ ({
				start: null,
				move: null,
				duration: 100,
				/** @type {!FrameList} */
				frames: new FrameList(
					[
						132,
					],
					0,
					0
				),
				sound: null,
				flags: 0,
			}),
			/** @type {!Scene} */ ({
				start: null,
				/** @type {!Position} */
				move: new Position(0, 6),
				duration: 200,
				/** @type {!FrameList} */
				frames: new FrameList(
					[
						42,
						49,
					],
					0,
					0
				),
				sound: null,
				flags: 0,
			}),
			/** @type {!Scene} */ ({
				start: null,
				move: null,
				duration: 1600,
				/** @type {!FrameList} */
				frames: new FrameList(
					[
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
					0,
					0
				),
				sound: null,
				flags: SceneFlag.Gravity,
			}),
		]),
		flags: AnimationFlag.PrimaryMates,
		childId: null,
		edge: null,
		next: Playlist.Walk,
	}),
	/** @type {!Animation} */ ({
		id: Playlist.Splat,
		name: 'Splat!',
		/** @type {!SceneList} */
		scenes: new SceneList([
			/** @type {!Scene} */ ({
				start: null,
				move: null,
				duration: 1000,
				/** @type {!FrameList} */
				frames: new FrameList(
					[
						48,
						48,
						48,
						48,
						47,
					],
					0,
					0
				),
				sound: null,
				flags: 0,
			}),
		]),
		flags: AnimationFlag.PrimaryMates,
		childId: null,
		edge: null,
		next: Playlist.Walk,
	}),
	/** @type {!Animation} */ ({
		id: Playlist.Urinate,
		name: 'Urinate',
		scenes: new SceneList([
			/** @type {!SceneCb} */ (() => {
				/** @const {number} */
				const repeat = 5 + Universe.random(10);

				return /** @type {!Scene} */ ({
					start: null,
					move: null,
					duration: (7 + repeat * 2) * 150,
					/** @type {!FrameList} */
					frames: new FrameList(
						[
							3,
							12,
							13,
							103,
							104,
							105,
							106,
						],
						repeat,
						5
					),
					sound: null,
					flags: SceneFlag.Gravity,
				});
			}),
			/** @type {!Scene} */ ({
				start: null,
				move: null,
				duration: 1050,
				/** @type {!FrameList} */
				frames: new FrameList(
					[
						104,
						105,
						104,
						104,
						103,
						13,
						12,
					],
					0,
					0
				),
				sound: null,
				flags: SceneFlag.Gravity,
			}),
		]),
		flags: AnimationFlag.DefaultChoice | AnimationFlag.DirectPlay | AnimationFlag.PrimaryMates | AnimationFlag.VariableDuration,
		childId: null,
		edge: null,
		next: Playlist.Walk,
	}),
	/** @type {!Animation} */ ({
		id: Playlist.PlayDead,
		name: 'Play Dead',
		/** @type {!SceneList} */
		scenes: new SceneList([
			/** @type {!Scene} */ ({
				start: null,
				move: null,
				duration: 1600,
				/** @type {!FrameList} */
				frames: new FrameList(
					[
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
					4,
					11
				),
				sound: null,
				flags: SceneFlag.Gravity,
			}),
		]),
		flags: AnimationFlag.DefaultChoice | AnimationFlag.DirectPlay | AnimationFlag.PrimaryMates,
		childId: null,
		edge: null,
		next: Playlist.Walk,
	}),
	/** @type {!Animation} */ ({
		id: Playlist.Scream,
		name: 'Scream!',
		/** @type {!SceneList} */
		scenes: new SceneList([
			/** @type {!Scene} */ ({
				start: null,
				move: null,
				duration: 1300,
				/** @type {!FrameList} */
				frames: new FrameList(
					[
						50,
						51,
					],
					12,
					0
				),
				sound: null,
				flags: SceneFlag.Gravity,
			}),
		]),
		flags: AnimationFlag.DefaultChoice | AnimationFlag.DirectPlay | AnimationFlag.PrimaryMates,
		childId: null,
		edge: null,
		next: Playlist.Run,
	}),
	/** @type {!Animation} */ ({
		id: Playlist.Sleep,
		name: 'Sleep',
		scenes: new SceneList([
			/** @type {!SceneCb} */ (() => {
				/** @const {number} */
				const repeat = 10 + Universe.random(20);

				return /** @type {!Scene} */ ({
					start: null,
					move: null,
					duration: (11 + repeat * 2) * 300,
					/** @type {!FrameList} */
					frames: new FrameList(
						[
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
						repeat,
						9
					),
					/** @type {!Array<!Sound, number>} */
					sound: [Sound.Yawn, 1],
					flags: SceneFlag.Gravity,
				});
			}),
			/** @type {!Scene} */ ({
				start: null,
				move: null,
				duration: 3300,
				/** @type {!FrameList} */
				frames: new FrameList(
					[
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
					0,
					0
				),
				/** @type {!Array<!Sound, number>} */
				sound: [Sound.Yawn, 5],
				flags: SceneFlag.Gravity,
			}),
		]),
		flags: AnimationFlag.DefaultChoice | AnimationFlag.DirectPlay | AnimationFlag.PrimaryMates | AnimationFlag.VariableDuration,
		childId: null,
		edge: null,
		next: Playlist.Walk,
	}),
	/** @type {!Animation} */ ({
		id: Playlist.Doze,
		name: 'Doze',
		scenes: new SceneList([
			/** @type {!SceneCb} */ (() => {
				/** @const {number} */
				const repeat = 20 + Universe.random(10);

				return /** @type {!Scene} */ ({
					start: null,
					move: null,
					duration: (8 + repeat * 2) * 200,
					/** @type {!FrameList} */
					frames: new FrameList(
						[
							3,
							6,
							7,
							8,
							8,
							7,
							8,
							8,
						],
						repeat,
						6
					),
					sound: null,
					flags: SceneFlag.Gravity,
				});
			}),
			/** @type {!Scene} */ ({
				start: null,
				move: null,
				duration: 600,
				/** @type {!FrameList} */
				frames: new FrameList(
					[
						8,
						7,
						6,
					],
					0,
					0
				),
				sound: null,
				flags: SceneFlag.Gravity,
			}),
		]),
		flags: AnimationFlag.DefaultChoice | AnimationFlag.DirectPlay | AnimationFlag.PrimaryMates | AnimationFlag.VariableDuration,
		childId: null,
		edge: null,
		next: null,
	}),
	/** @type {!Animation} */ ({
		id: Playlist.BoredSleep,
		name: 'Bored Sleep',
		scenes: new SceneList([
			/** @type {!SceneCb} */ (() => {
				/** @const {number} */
				const repeat = 30 + Universe.random(10);

				return /** @type {!Scene} */ ({
					start: null,
					move: null,
					duration: (9 + repeat * 2) * 200,
					/** @type {!FrameList} */
					frames: new FrameList(
						[
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
						repeat,
						7
					),
					sound: null,
					flags: SceneFlag.Gravity,
				});
			}),
			/** @type {!Scene} */ ({
				start: null,
				move: null,
				duration: 1800,
				/** @type {!FrameList} */
				frames: new FrameList(
					[
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
					0,
					0
				),
				sound: null,
				flags: SceneFlag.Gravity,
			}),
		]),
		flags: AnimationFlag.DefaultChoice | AnimationFlag.DirectPlay | AnimationFlag.PrimaryMates | AnimationFlag.VariableDuration,
		childId: null,
		edge: null,
		next: Playlist.Walk,
	}),
	/** @type {!Animation} */ ({
		id: Playlist.BathDive,
		name: 'Bath Dive',
		scenes: new SceneList([
			/** @type {!SceneCb} */ (() => {
				return /** @type {!Scene} */ ({
					/** @type {!Position} */
					start: new Position(
						Universe.width,
						Universe.height - 600
					),
					/** @type {!Position} */
					move: new Position(-588, 441),
					duration: 4350,
					/** @type {!FrameList} */
					frames: new FrameList(
						[
							134,
						],
						146,
						0
					),
					sound: null,
					flags: 0,
				});
			}),
			/** @type {!Scene} */ ({
				start: null,
				/** @type {!Position} */
				move: new Position(-192, 144),
				duration: 1440,
				/** @type {!FrameList} */
				frames: new FrameList(
					[
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
					0,
					0
				),
				sound: null,
				flags: 0,
			}),
		]),
		flags: AnimationFlag.EntranceChoice | AnimationFlag.FirstChoice | AnimationFlag.DirectPlay | AnimationFlag.PrimaryMates,
		childId: Playlist.BathDiveChild,
		edge: Playlist.BathCoolDown,
		next: Playlist.BathCoolDown,
	}),
	/** @type {!Animation} */ ({
		id: Playlist.BathDiveChild,
		name: 'Bath Dive 👶',
		scenes: new SceneList([
			/** @type {!SceneCb} */ (() => {
				return /** @type {!Scene} */ ({
					/** @type {!Position} */
					start: new Position(
						Universe.width - 800 + Universe.tileSize + 10,
						Universe.maxY
					),
					move: null,
					duration: 5160,
					/** @type {!FrameList} */
					frames: new FrameList(
						[
							146,
						],
						171,
						0
					),
					sound: null,
					flags: SceneFlag.Gravity,
				});
			}),
			/** @type {!Scene} */ ({
				start: null,
				move: null,
				duration: 2700,
				/** @type {!FrameList} */
				frames: new FrameList(
					[
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
					70,
					19
				),
				sound: null,
				flags: SceneFlag.Gravity,
			}),
		]),
		flags: AnimationFlag.SecondaryMates,
		childId: null,
		edge: null,
		next: null,
	}),
	/** @type {!Animation} */ ({
		id: Playlist.Jump,
		name: 'Jump',
		/** @type {!SceneList} */
		scenes: new SceneList([
			/** @type {!Scene} */ ({
				start: null,
				/** @type {!Position} */
				move: new Position(-50, -30),
				duration: 400,
				/** @type {!FrameList} */
				frames: new FrameList(
					[
						76,
						30,
						30,
						30,
						30,
					],
					0,
					0
				),
				sound: null,
				flags: 0,
			}),
			/** @type {!Scene} */ ({
				start: null,
				/** @type {!Position} */
				move: new Position(-30, 0),
				duration: 100,
				/** @type {!FrameList} */
				frames: new FrameList(
					[
						23,
						23,
					],
					0,
					0
				),
				sound: null,
				flags: 0,
			}),
			/** @type {!Scene} */ ({
				start: null,
				/** @type {!Position} */
				move: new Position(-50, 30),
				duration: 400,
				/** @type {!FrameList} */
				frames: new FrameList(
					[
						24,
						24,
						24,
						24,
						77,
					],
					0,
					0
				),
				sound: null,
				flags: 0,
			}),
		]),
		flags: AnimationFlag.DefaultChoice | AnimationFlag.DirectPlay | AnimationFlag.PrimaryMates,
		childId: null,
		edge: Playlist.WallSlide,
		/** @type {!ChoiceList} */
		next: new ChoiceList([
			[Playlist.Run, 1],
			[Playlist.Slide, 1],
		]),
	}),
	/** @type {!Animation} */ ({
		id: Playlist.Eat,
		name: 'Eat',
		/** @type {!SceneList} */
		scenes: new SceneList([
			/** @type {!Scene} */ ({
				start: null,
				move: null,
				duration: 9000,
				/** @type {!FrameList} */
				frames: new FrameList(
					[
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
					5,
					5
				),
				sound: null,
				flags: SceneFlag.Gravity,
			}),
		]),
		flags: AnimationFlag.DefaultChoice | AnimationFlag.DirectPlay | AnimationFlag.PrimaryMates,
		childId: Playlist.FlowerChild,
		edge: null,
		next: Playlist.Walk,
	}),
	/** @type {!Animation} */ ({
		id: Playlist.FlowerChild,
		name: 'Flower 👶',
		/** @type {!SceneList} */
		scenes: new SceneList([
			/** @type {!Scene} */ ({
				start: null,
				move: null,
				duration: 9000,
				/** @type {!FrameList} */
				frames: new FrameList(
					[
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
						SpriteInfo.EmptyTile,
						SpriteInfo.EmptyTile,
						SpriteInfo.EmptyTile,
					],
					0,
					0
				),
				sound: null,
				flags: SceneFlag.Gravity,
			}),
		]),
		flags: AnimationFlag.SecondaryMates,
		childId: null,
		edge: null,
		next: null,
	}),
	/** @type {!Animation} */ ({
		id: Playlist.BlackSheepRomance,
		name: 'Black Sheep Romance',
		scenes: new SceneList([
			/** @type {!SceneCb} */ (() => {
				/** @const {number} */
				const repeat = Math.floor((Universe.width / 2) / 30 - 6);

				return /** @type {!Scene} */ ({
					/** @type {!Position} */
					start: new Position(
						Universe.width + Universe.tileSize,
						Universe.maxY
					),
					/** @type {!Position} */
					move: new Position(-10 * (3 + repeat * 3), 0),
					duration: (3 + repeat * 3) * 100,
					/** @type {!FrameList} */
					frames: new FrameList(
						[
							5,
							4,
							4,
						],
						repeat,
						0
					),
					sound: null,
					flags: SceneFlag.Gravity,
				});
			}),
			/** @type {!SceneCb} */ (() => {
				/** @const {number} */
				const repeat = Math.floor(25 + (Math.floor(Universe.width / 2) % 30) / 7);

				return /** @type {!Scene} */ ({
					start: null,
					/** @type {!Position} */
					move: new Position(-3 * (2 + repeat * 2), 0),
					duration: (2 + repeat * 2) * 100,
					/** @type {!FrameList} */
					frames: new FrameList(
						[
							2,
							3,
						],
						repeat,
						0
					),
					sound: null,
					flags: SceneFlag.EaseOut | SceneFlag.Gravity,
				});
			}),
			/** @type {!Scene} */ ({
				start: null,
				move: null,
				duration: 7000,
				/** @type {!FrameList} */
				frames: new FrameList(
					[
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
					0,
					0
				),
				sound: null,
				flags: SceneFlag.Gravity,
			}),
		]),
		flags: AnimationFlag.EntranceChoice | AnimationFlag.FirstChoice | AnimationFlag.DirectPlay | AnimationFlag.PrimaryMates | AnimationFlag.VariableDuration,
		childId: Playlist.BlackSheepRomanceChild,
		edge: null,
		next: null,
	}),
	/** @type {!Animation} */ ({
		id: Playlist.BlackSheepRomanceChild,
		name: 'Black Sheep Romance 👶',
		scenes: new SceneList([
			/** @type {!Scene} */ (() => {
				/** @const {number} */
				const repeat = Math.floor((Universe.width / 2) / 30 - 6);

				return /** @type {!Scene} */ ({
					/** @type {!Position} */
					start: new Position(
						0 - Universe.tileSize,
						Universe.maxY
					),
					/** @type {!Position} */
					move: new Position(10 * (3 + repeat * 3), 0),
					duration: (3 + repeat * 3) * 100,
					/** @type {!FrameList} */
					frames: new FrameList(
						[
							155,
							154,
							154,
						],
						repeat,
						0
					),
					sound: null,
					flags: SceneFlag.Gravity,
				});
			}),
			/** @type {!SceneCb} */ (() => {
				/** @const {number} */
				const repeat = Math.floor(24 + (Math.floor(Universe.width / 2) % 30) / 7);

				return /** @type {!Scene} */ ({
					start: null,
					/** @type {!Position} */
					move: new Position(3 * (2 + repeat * 2), 0),
					duration: (2 + repeat * 2) * 100,
					/** @type {!FrameList} */
					frames: new FrameList(
						[
							156,
							157,
						],
						repeat,
						0
					),
					sound: null,
					flags: SceneFlag.EaseOut | SceneFlag.Gravity,
				});
			}),
			/** @type {!Scene} */ ({
				start: null,
				move: null,
				duration: 4500,
				/** @type {!FrameList} */
				frames: new FrameList(
					[
						157,
					],
					9,
					0
				),
				sound: null,
				flags: SceneFlag.Gravity,
			}),
		]),
		flags: AnimationFlag.SecondaryMates | AnimationFlag.VariableDuration,
		childId: null,
		edge: null,
		next: null,
	}),
	/** @type {!Animation} */ ({
		id: Playlist.BeginRun,
		name: 'Begin Run',
		/** @type {!SceneList} */
		scenes: new SceneList([
			/** @type {!Scene} */ ({
				start: null,
				/** @type {!Position} */
				move: new Position(-24, 0),
				duration: 600,
				/** @type {!FrameList} */
				frames: new FrameList(
					[
						2,
						3,
					],
					2,
					0
				),
				sound: null,
				flags: SceneFlag.Gravity,
			}),
		]),
		flags: AnimationFlag.DefaultChoice | AnimationFlag.DirectPlay | AnimationFlag.PrimaryMates,
		childId: null,
		edge: Playlist.Boing,
		next: Playlist.Run,
	}),
	/** @type {!Animation} */ ({
		id: Playlist.RunEnd,
		name: 'Run (End)',
		scenes: new SceneList([
			/** @type {!Scene} */ ({
				start: null,
				/** @type {!Position} */
				move: new Position(-24, 0),
				duration: 600,
				/** @type {!FrameList} */
				frames: new FrameList(
					[
						2,
						3,
					],
					2,
					0
				),
				sound: null,
				flags: SceneFlag.Gravity,
			}),
		]),
		flags: AnimationFlag.PrimaryMates,
		childId: null,
		edge: Playlist.Boing,
		next: Playlist.Walk,
	}),
	/** @type {!Animation} */ ({
		id: Playlist.ClimbUp,
		name: 'Climb Up',
		scenes: new SceneList([
			/** @type {!SceneCb} */ (() => {
				/** @const {number} */
				const repeat = Math.floor(Universe.height / 2);

				return /** @type {!Scene} */ ({
					start: null,
					/** @type {!Position} */
					move: new Position(0, -2 * (4 + repeat * 2)),
					duration: (4 + repeat * 2) * 150,
					/** @type {!FrameList} */
					frames: new FrameList(
						[
							31,
							30,
							15,
							16,
						],
						repeat,
						2
					),
					sound: null,
					flags: 0,
				});
			}),
		]),
		flags: AnimationFlag.PrimaryMates | AnimationFlag.VariableDuration,
		childId: null,
		edge: Playlist.ReachCeiling,
		next: Playlist.ClimbUp,
	}),
	/** @type {!Animation} */ ({
		id: Playlist.ReachCeiling,
		name: 'Reach Ceiling',
		scenes: new SceneList([
			/** @type {!Scene} */ (() => {
				return /** @type {!Scene} */ ({
					start: null,
					/** @type {!Position} */
					move: new Position(3, 0),
					duration: 300,
					/** @type {!FrameList} */
					frames: new FrameList(
						[
							16,
							17,
							28,
						],
						0,
						0
					),
					sound: null,
					flags: SceneFlag.FlipAfter,
				});
			}),
		]),
		flags: AnimationFlag.PrimaryMates,
		childId: null,
		edge: null,
		next: Playlist.WalkUpsideDown,
	}),
	/** @type {!Animation} */ ({
		id: Playlist.WalkUpsideDown,
		name: 'Walk Upside Down',
		scenes: new SceneList([
			/** @type {!Scene} */ (() => {
				/** @const {number} */
				const repeat = Math.floor(Universe.width / 2);

				return /** @type {!Scene} */ ({
					start: null,
					/** @type {!Position} */
					move: new Position(-2 * (2 + repeat * 2), 0),
					duration: (2 + repeat * 2) * 150,
					/** @type {!FrameList} */
					frames: new FrameList(
						[
							98,
							97,
						],
						repeat,
						0
					),
					sound: null,
					flags: 0,
				});
			}),
		]),
		flags: AnimationFlag.PrimaryMates,
		childId: null,
		edge: Playlist.ReachSide,
		next: Playlist.WalkUpsideDown,
	}),
	/** @type {!Animation} */ ({
		id: Playlist.ReachSide,
		name: 'Reach Side',
		/** @type {!SceneList} */
		scenes: new SceneList([
			/** @type {!Scene} */ ({
				start: null,
				move: null,
				duration: 400,
				/** @type {!FrameList} */
				frames: new FrameList(
					[
						97,
						97,
					],
					0,
					0
				),
				sound: null,
				flags: SceneFlag.FlipAfter,
			}),
		]),
		flags: AnimationFlag.PrimaryMates,
		childId: null,
		edge: null,
		next: Playlist.ClimbDown,
	}),
	/** @type {!Animation} */ ({
		id: Playlist.ClimbDown,
		name: 'Climb Down',
		scenes: new SceneList([
			/** @type {!SceneCb} */ (() => {
				/** @const {number} */
				const repeat = Math.floor(Universe.height / 2);

				return /** @type {!Scene} */ ({
					start: null,
					/** @type {!Position} */
					move: new Position(0, 2 * (2 + repeat * 2)),
					duration: (2 + repeat * 2) * 150,
					/** @type {!FrameList} */
					frames: new FrameList(
						[
							19,
							20,
						],
						repeat,
						0
					),
					sound: null,
					flags: 0,
				});
			}),
		]),
		flags: AnimationFlag.PrimaryMates | AnimationFlag.VariableDuration,
		childId: null,
		edge: Playlist.ReachFloor,
		next: Playlist.ClimbDown,
	}),
	/** @type {!Animation} */ ({
		id: Playlist.ReachFloor,
		name: 'Reach Floor',
		/** @type {!SceneList} */
		scenes: new SceneList([
			/** @type {!Scene} */ ({
				start: null,
				move: null,
				duration: 900,
				/** @type {!FrameList} */
				frames: new FrameList(
					[
						24,
						6,
						6,
						6,
						6,
						6,
					],
					0,
					0
				),
				sound: null,
				flags: 0,
			}),
		]),
		flags: AnimationFlag.PrimaryMates,
		childId: null,
		edge: null,
		next: Playlist.Walk,
	}),
	/** @type {!Animation} */ ({
		id: Playlist.Beg,
		name: 'Beg',
		/** @type {!SceneList} */
		scenes: new SceneList([
			/** @type {!Scene} */ ({
				start: null,
				move: null,
				duration: 2400,
				/** @type {!FrameList} */
				frames: new FrameList(
					[
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
					0,
					0
				),
				sound: null,
				flags: SceneFlag.Gravity,
			}),
		]),
		flags: AnimationFlag.DefaultChoice | AnimationFlag.DirectPlay | AnimationFlag.PrimaryMates,
		childId: null,
		edge: null,
		next: null,
	}),
	/** @type {!Animation} */ ({
		id: Playlist.Bleat,
		name: 'Bleat',
		/** @type {!SceneList} */
		scenes: new SceneList([
			/** @type {!Scene} */ ({
				start: null,
				move: null,
				duration: 1400,
				/** @type {!FrameList} */
				frames: new FrameList(
					[
						3,
						71,
						72,
						71,
						72,
						71,
						3,
					],
					0,
					0
				),
				/** @type {!Array<!Sound, number>} */
				sound: [Sound.Baa, 1],
				flags: SceneFlag.Gravity,
			}),
		]),
		flags: AnimationFlag.DefaultChoice | AnimationFlag.DirectPlay | AnimationFlag.PrimaryMates,
		childId: null,
		edge: null,
		next: Playlist.Walk,
	}),
	/** @type {!Animation} */ ({
		id: Playlist.Handstand,
		name: 'Handstand',
		/** @type {!SceneList} */
		scenes: new SceneList([
			/** @type {!Scene} */ ({
				start: null,
				/** @type {!Position} */
				move: new Position(-20, 0),
				duration: 2000,
				/** @type {!FrameList} */
				frames: new FrameList(
					[
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
					0,
					0
				),
				sound: null,
				flags: SceneFlag.Gravity,
			}),
		]),
		flags: AnimationFlag.DefaultChoice | AnimationFlag.DirectPlay | AnimationFlag.PrimaryMates,
		childId: null,
		edge: null,
		next: null,
	}),
	/** @type {!Animation} */ ({
		id: Playlist.Slide,
		name: 'Slide',
		/** @type {!SceneList} */
		scenes: new SceneList([
			/** @type {!Scene} */ ({
				start: null,
				/** @type {!Position} */
				move: new Position(-22, 0),
				duration: 1100,
				/** @type {!FrameList} */
				frames: new FrameList(
					[
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
					0,
					0
				),
				sound: null,
				flags: SceneFlag.Gravity,
			}),
		]),
		flags: AnimationFlag.DirectPlay | AnimationFlag.PrimaryMates,
		childId: null,
		edge: null,
		next: Playlist.Walk,
	}),
	/** @type {!Animation} */ ({
		id: Playlist.BathCoolDown,
		name: 'Bath Cool Down',
		/** @type {!SceneList} */
		scenes: new SceneList([
			/** @type {!Scene} */ ({
				start: null,
				move: null,
				duration: 2400,
				/** @type {!FrameList} */
				frames: new FrameList(
					[
						169,
						169,
						169,
						170,
						171,
						170,
						169,
						169,
					],
					2,
					0
				),
				sound: null,
				flags: SceneFlag.Gravity,
			}),
			/** @type {!Scene} */ ({
				start: null,
				move: null,
				duration: 600,
				/** @type {!FrameList} */
				frames: new FrameList(
					[
						119,
						81,
						81,
						82,
						82,
						10,
					],
					0,
					0
				),
				sound: null,
				flags: SceneFlag.Gravity,
			}),
		]),
		flags: AnimationFlag.PrimaryMates,
		childId: null,
		edge: null,
		next: null,
	}),
	/** @type {!Animation} */ ({
		id: Playlist.Roll,
		name: 'Roll',
		/** @type {!SceneList} */
		scenes: new SceneList([
			/** @type {!Scene} */ ({
				start: null,
				move: null,
				duration: 450,
				/** @type {!FrameList} */
				frames: new FrameList(
					[
						9,
						10,
						10,
					],
					0,
					0
				),
				sound: null,
				flags: SceneFlag.Gravity,
			}),
			/** @type {!Scene} */ ({
				start: null,
				/** @type {!Position} */
				move: new Position(-128, 0),
				duration: 800,
				/** @type {!FrameList} */
				frames: new FrameList(
					[
						10,
						118,
						117,
						116,
						115,
						114,
						113,
						112,
					],
					1,
					0
				),
				sound: null,
				flags: SceneFlag.Gravity,
			}),
			/** @type {!Scene} */ ({
				start: null,
				move: null,
				duration: 450,
				/** @type {!FrameList} */
				frames: new FrameList(
					[
						10,
						10,
						9,
					],
					0,
					0
				),
				sound: null,
				flags: SceneFlag.Gravity,
			}),
		]),
		flags: AnimationFlag.DefaultChoice | AnimationFlag.DirectPlay | AnimationFlag.PrimaryMates,
		childId: null,
		edge: null,
		next: null,
	}),
	/** @type {!Animation} */ ({
		id: Playlist.Sneeze,
		name: 'Sneeze',
		/** @type {!SceneList} */
		scenes: new SceneList([
			/** @type {!Scene} */ ({
				start: null,
				move: null,
				duration: 1600,
				/** @type {!FrameList} */
				frames: new FrameList(
					[
						108,
						109,
						110,
						111,
						110,
						111,
						110,
						3,
					],
					0,
					0
				),
				/** @type {!Array<!Sound, number>} */
				sound: [Sound.Sneeze, 0],
				flags: SceneFlag.Gravity,
			}),
		]),
		flags: AnimationFlag.DefaultChoice | AnimationFlag.DirectPlay | AnimationFlag.PrimaryMates,
		childId: Playlist.SneezeShadow,
		edge: null,
		next: Playlist.Walk,
	}),
	/** @type {!Animation} */ ({
		id: Playlist.Scratch,
		name: 'Scratch',
		/** @type {!SceneList} */
		scenes: new SceneList([
			/** @type {!Scene} */ ({
				start: null,
				move: null,
				duration: 1200,
				/** @type {!FrameList} */
				frames: new FrameList(
					[
						56,
						57,
					],
					3,
					0
				),
				sound: null,
				flags: SceneFlag.Gravity,
			}),
		]),
		flags: AnimationFlag.DefaultChoice | AnimationFlag.DirectPlay | AnimationFlag.PrimaryMates,
		childId: null,
		edge: null,
		next: null,
	}),
	/** @type {!Animation} */ ({
		id: Playlist.Stargaze,
		name: 'Stargaze',
		scenes: new SceneList([
			/** @type {!SceneCb} */ (() => {
				return /** @type {!Scene} */ ({
					/** @type {!Position} */
					start: new Position(
						Universe.width,
						Universe.maxY
					),
					/** @type {!Position} */
					move: new Position(-44, 0),
					duration: 1100,
					/** @type {!FrameList} */
					frames: new FrameList(
						[
							2,
							3,
						],
						10,
						0
					),
					sound: null,
					flags: SceneFlag.Gravity,
				});
			}),
			/** @type {!Scene} */ ({
				start: null,
				move: null,
				duration: 1050,
				/** @type {!FrameList} */
				frames: new FrameList(
					[
						3,
						3,
						3,
						3,
						3,
						73,
					],
					15,
					5
				),
				sound: null,
				flags: SceneFlag.Gravity,
			}),
		]),
		flags: AnimationFlag.EntranceChoice | AnimationFlag.FirstChoice | AnimationFlag.DirectPlay | AnimationFlag.PrimaryMates,
		childId: Playlist.StargazeChild,
		edge: null,
		next: Playlist.Scream,
	}),
	/** @type {!Animation} */ ({
		id: Playlist.StargazeChild,
		name: 'Stargaze 👶',
		scenes: new SceneList([
			/** @type {!SceneCb} */ (() => {
				return /** @type {!Scene} */ ({
					/** @type {!Position} */
					start: new Position(
						0 - Universe.tileSize,
						Universe.tileSize * 2
					),
					move: null,
					duration: 1100,
					/** @type {!FrameList} */
					frames: new FrameList(
						[
							158,
						],
						20,
						0
					),
					sound: null,
					flags: SceneFlag.IgnoreEdges,
				});
			}),
			/** @type {!Scene} */ ({
				start: null,
				/** @type {!Position} */
				move: new Position(820, -164),
				duration: 1025,
				/** @type {!FrameList} */
				frames: new FrameList(
					[
						158,
						159,
						160,
						161,
					],
					40,
					0
				),
				sound: null,
				flags: SceneFlag.IgnoreEdges,
			}),
		]),
		flags: AnimationFlag.SecondaryMates,
		childId: null,
		edge: null,
		next: null,
	}),
	/** @type {!Animation} */ ({
		id: Playlist.Abduction,
		name: 'Abduction',
		scenes: new SceneList([
			/** @type {!Scene} */ ({
				start: null,
				move: null,
				duration: 3400,
				/** @type {!FrameList} */
				frames: new FrameList(
					[
						9,
						10,
						10,
						10,
						10,
						34,
					],
					11,
					5
				),
				sound: null,
				flags: SceneFlag.Gravity,
			}),
			/** @type {!SceneCb} */ (() => {
				/** @const {number} */
				const repeat = Math.floor(Universe.width / 4);

				return /** @type {!Scene} */ ({
					start: null,
					move: null,
					duration: (48 + repeat) * 25,
					/** @type {!FrameList} */
					frames: new FrameList(
						[
							34,
							34,
							34,
							34,
							34,
							34,
							SpriteInfo.EmptyTile,
							34,
							SpriteInfo.EmptyTile,
							86,
							86,
							SpriteInfo.EmptyTile,
							86,
							SpriteInfo.EmptyTile,
							86,
							SpriteInfo.EmptyTile,
							SpriteInfo.EmptyTile,
							34,
							SpriteInfo.EmptyTile,
							86,
							86,
							SpriteInfo.EmptyTile,
							86,
							SpriteInfo.EmptyTile,
							86,
							SpriteInfo.EmptyTile,
							86,
							SpriteInfo.EmptyTile,
							SpriteInfo.EmptyTile,
							34,
							SpriteInfo.EmptyTile,
							86,
							86,
							SpriteInfo.EmptyTile,
							86,
							SpriteInfo.EmptyTile,
							86,
							SpriteInfo.EmptyTile,
							SpriteInfo.EmptyTile,
							34,
							SpriteInfo.EmptyTile,
							86,
							86,
							SpriteInfo.EmptyTile,
							86,
							SpriteInfo.EmptyTile,
							86,
							SpriteInfo.EmptyTile,
						],
						repeat,
						47
					),
					sound: null,
					flags: SceneFlag.Gravity | SceneFlag.IgnoreEdges,
				});
			}),
		]),
		flags: AnimationFlag.DefaultChoice | AnimationFlag.DirectPlay | AnimationFlag.PrimaryMates,
		childId: Playlist.AbductionChild,
		edge: null,
		next: Playlist.ChasingAMartian,
	}),
	/** @type {!Animation} */ ({
		id: Playlist.AbductionChild,
		name: 'Abduction 👶',
		/** @type {!SceneList} */
		scenes: new SceneList([
			/** @type {!Scene} */ ({
				start: null,
				/** @type {!Position} */
				move: new Position(0, 480),
				duration: 2100,
				/** @type {!FrameList} */
				frames: new FrameList(
					[
						158,
						159,
						160,
						161,
					],
					29,
					0
				),
				sound: null,
				flags: SceneFlag.IgnoreEdges | SceneFlag.EaseOut,
			}),
		]),
		flags: AnimationFlag.SecondaryMates | AnimationFlag.VariableDuration,
		childId: null,
		edge: null,
		next: Playlist.AbductionBeamingChild,
	}),
	/** @type {!Animation} */ ({
		id: Playlist.AbductionBeamingChild,
		name: 'Abduction Beaming 👶',
		scenes: new SceneList([
			/** @type {!Scene} */ ({
				start: null,
				move: null,
				duration: 1200,
				/** @type {!FrameList} */
				frames: new FrameList(
					[
						162,
						163,
						164,
						165,
					],
					11,
					0
				),
				sound: null,
				flags: SceneFlag.IgnoreEdges,
			}),
			/** @type {!SceneCb} */ (() => {
				/** @const {number} */
				const repeat = Math.floor(Universe.width / 16);

				return /** @type {!Scene} */ ({
					start: null,
					/** @type {!Position} */
					move: new Position(
						4 * (4 + repeat * 4),
						-1 * (4 + repeat * 4)
					),
					duration: (4 + repeat * 4) * 25,
					/** @type {!FrameList} */
					frames: new FrameList(
						[
							158,
							159,
							160,
							161,
						],
						repeat,
						0
					),
					sound: null,
					flags: SceneFlag.EaseIn | SceneFlag.IgnoreEdges,
				});
			}),
		]),
		flags: AnimationFlag.SecondaryMates | AnimationFlag.VariableDuration,
		childId: Playlist.AbductionBeamChild,
		edge: null,
		next: null,
	}),
	/** @type {!Animation} */ ({
		id: Playlist.AbductionBeamChild,
		name: 'Abduction Beam 👶',
		/** @type {!SceneList} */
		scenes: new SceneList([
			/** @type {!Scene} */ ({
				start: null,
				move: null,
				duration: 800,
				/** @type {!FrameList} */
				frames: new FrameList(
					[
						SpriteInfo.EmptyTile,
						SpriteInfo.EmptyTile,
						SpriteInfo.EmptyTile,
						SpriteInfo.EmptyTile,
						172,
						172,
						SpriteInfo.EmptyTile,
						172,
					],
					35,
					7
				),
				sound: null,
				flags: SceneFlag.IgnoreEdges,
			}),
		]),
		flags: AnimationFlag.SecondaryMates,
		childId: null,
		edge: null,
		next: null,
	}),
	/** @type {!Animation} */ ({
		id: Playlist.ChasingAMartian,
		name: 'Chasing a Martian!',
		scenes: new SceneList([
			/** @type {!SceneCb} */ (() => {
				/** @const {number} */
				const repeat = Math.floor(Universe.width / 2 / 30);

				return /** @type {!Scene} */ ({
					/** @type {!Position} */
					start: new Position(
						Universe.width + Universe.tileSize * 3,
						Universe.maxY
					),
					/** @type {!Position} */
					move: new Position(-10 * (3 + repeat * 3), 0),
					duration: (3 + repeat * 3) * 100,
					/** @type {!FrameList} */
					frames: new FrameList(
						[
							5,
							4,
							4,
						],
						repeat,
						0
					),
					sound: null,
					flags: SceneFlag.Gravity | SceneFlag.IgnoreEdges,
				});
			}),
		]),
		flags: AnimationFlag.EntranceChoice | AnimationFlag.FirstChoice | AnimationFlag.DirectPlay | AnimationFlag.PrimaryMates | AnimationFlag.VariableDuration,
		childId: Playlist.ChasingAMartianChild,
		edge: null,
		next: Playlist.Bleat,
	}),
	/** @type {!Animation} */ ({
		id: Playlist.ChasingAMartianChild,
		name: 'Chasing a Martian! 👶',
		scenes: new SceneList([
			/** @type {!SceneCb} */ (() => {
				/** @const {number} */
				const repeat = Math.floor(Universe.width / 48 + 4);

				return /** @type {!Scene} */ ({
					/** @type {!Position} */
					start: new Position(
						Universe.width + Universe.tileSize,
						Universe.maxY
					),
					/** @type {!Position} */
					move: new Position(-12 * (4 + repeat * 4), 0),
					duration: (4 + repeat * 4) * 100,
					/** @type {!FrameList} */
					frames: new FrameList(
						[
							166,
							167,
							166,
							168,
						],
						repeat,
						0
					),
					sound: null,
					flags: SceneFlag.Gravity | SceneFlag.IgnoreEdges,
				});
			}),
		]),
		flags: AnimationFlag.AllowExit | AnimationFlag.SecondaryMates | AnimationFlag.VariableDuration,
		childId: null,
		edge: null,
		next: null,
	}),
	/** @type {!Animation} */ ({
		id: Playlist.Spin,
		name: 'Spin',
		/** @type {!SceneList} */
		scenes: new SceneList([
			/** @type {!Scene} */ ({
				start: null,
				move: null,
				duration: 1400,
				/** @type {!FrameList} */
				frames: new FrameList(
					[
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
					0,
					0
				),
				sound: null,
				flags: SceneFlag.Gravity,
			}),
		]),
		flags: AnimationFlag.DefaultChoice | AnimationFlag.DirectPlay | AnimationFlag.PrimaryMates,
		childId: null,
		edge: null,
		/** @type {!ChoiceList} */
		next: new ChoiceList([
			[Playlist.PlayDead, 1],
			[Playlist.Sneeze, 1],
		]),
	}),
	/** @type {!Animation} */ ({
		id: Playlist.WallSlide,
		name: 'Wall Slide',
		/** @type {!SceneList} */
		scenes: new SceneList([
			/** @type {!Scene} */ ({
				start: null,
				/** @type {!Position} */
				move: new Position(0, 55),
				duration: 440,
				/** @type {!FrameList} */
				frames: new FrameList(
					[
						29,
					],
					10,
					0
				),
				sound: null,
				flags: 0,
			}),
		]),
		flags: AnimationFlag.PrimaryMates | AnimationFlag.Falling,
		childId: null,
		edge: Playlist.Rotate,
		next: Playlist.WallSlide,
	}),
	/** @type {!Animation} */ ({
		id: Playlist.Scoot,
		name: 'Scoot',
		/** @type {!SceneList} */
		scenes: new SceneList([
			/** @type {!Scene} */ ({
				start: null,
				move: null,
				duration: 200,
				/** @type {!FrameList} */
				frames: new FrameList(
					[
						52,
					],
					0,
					0
				),
				sound: null,
				flags: SceneFlag.Gravity,
			}),
			/** @type {!Scene} */ ({
				start: null,
				/** @type {!Position} */
				move: new Position(6, 0),
				duration: 200,
				/** @type {!FrameList} */
				frames: new FrameList(
					[
						53,
					],
					0,
					0
				),
				sound: null,
				flags: SceneFlag.Gravity,
			}),
			/** @type {!Scene} */ ({
				start: null,
				move: null,
				duration: 200,
				/** @type {!FrameList} */
				frames: new FrameList(
					[
						52,
					],
					0,
					0
				),
				sound: null,
				flags: SceneFlag.Gravity,
			}),
			/** @type {!Scene} */ ({
				start: null,
				/** @type {!Position} */
				move: new Position(6, 0),
				duration: 200,
				/** @type {!FrameList} */
				frames: new FrameList(
					[
						53,
					],
					0,
					0
				),
				sound: null,
				flags: SceneFlag.Gravity,
			}),
		]),
		flags: AnimationFlag.DefaultChoice | AnimationFlag.DirectPlay | AnimationFlag.PrimaryMates,
		childId: null,
		edge: null,
		/** @type {!ChoiceList} */
		next: new ChoiceList([
			[Playlist.Scoot, 4],
			[Playlist.Rotate, 2],
			[Playlist.Walk, 1],
		]),
	}),
	/** @type {!Animation} */ ({
		id: Playlist.SneezeShadow,
		name: 'Sneeze Shadow',
		/** @type {!SceneList} */
		scenes: new SceneList([
			/** @type {!Scene} */ ({
				start: null,
				/** @type {!Position} */
				move: new Position(60, 0),
				duration: 600,
				/** @type {!FrameList} */
				frames: new FrameList(
					[
						SpriteInfo.EmptyTile,
						SpriteInfo.EmptyTile,
						109,
					],
					3,
					2
				),
				sound: null,
				flags: SceneFlag.Gravity | SceneFlag.IgnoreEdges,
			}),
		]),
		flags: AnimationFlag.AllowExit | AnimationFlag.Background | AnimationFlag.SecondaryMates,
		childId: null,
		edge: null,
		next: null,
	}),
	/** @type {!Animation} */ ({
		id: Playlist.BlackSheepChase,
		name: 'Black Sheep Chase',
		scenes: new SceneList([
			/** @type {!SceneCb} */ (() => {
				/** @const {number} */
				const repeat = Math.floor(Universe.width / 30 + Universe.tileSize * 5 / 30);

				return /** @type {!Scene} */ ({
					/** @type {!Position} */
					start: new Position(
						Universe.width + Universe.tileSize * 3,
						Universe.maxY
					),
					/** @type {!Position} */
					move: new Position(-10 * (3 + repeat * 3), 0),
					duration: (3 + repeat * 3) * 100,
					/** @type {!FrameList} */
					frames: new FrameList(
						[
							5,
							4,
							4,
						],
						repeat,
						0
					),
					sound: null,
					flags: SceneFlag.FlipAfter | SceneFlag.Gravity | SceneFlag.IgnoreEdges,
				});
			}),
			/** @type {!SceneCb} */ (() => {
				/** @const {number} */
				const repeat = Math.floor(Universe.tileSize * 2 / 30);

				return /** @type {!Scene} */ ({
					/** @type {!Position} */
					start: new Position(
						Universe.width + Universe.tileSize * 3,
						Universe.maxY
					),
					/** @type {!Position} */
					move: new Position(-10 * (3 + repeat * 3), 0),
					duration: (3 + repeat * 3) * 100,
					/** @type {!FrameList} */
					frames: new FrameList(
						[
							5,
							4,
							4,
						],
						repeat,
						0
					),
					sound: null,
					flags: SceneFlag.Gravity | SceneFlag.IgnoreEdges,
				});
			}),
		]),
		flags: AnimationFlag.EntranceChoice | AnimationFlag.FirstChoice | AnimationFlag.DirectPlay | AnimationFlag.PrimaryMates | AnimationFlag.VariableDuration,
		childId: Playlist.BlackSheepChaseChild,
		edge: null,
		next: Playlist.Run,
	}),
	/** @type {!Animation} */ ({
		id: Playlist.BlackSheepChaseChild,
		name: 'Black Sheep Chase 👶',
		scenes: new SceneList([
			/** @type {!SceneCb} */ (() => {
				/** @const {number} */
				const repeat = Math.floor(Universe.width / 30 + Universe.tileSize * 3 / 30);

				return /** @type {!Scene} */ ({
					/** @type {!Position} */
					start: new Position(
						Universe.width + Universe.tileSize,
						Universe.maxY
					),
					/** @type {!Position} */
					move: new Position(10 * (3 + repeat * 3), 0),
					duration: (3 + repeat * 3) * 100,
					/** @type {!FrameList} */
					frames: new FrameList(
						[
							155,
							154,
							154,
						],
						repeat,
						0
					),
					sound: null,
					flags: SceneFlag.Gravity | SceneFlag.IgnoreEdges,
				});
			}),
		]),
		flags: AnimationFlag.AllowExit | AnimationFlag.ReverseX | AnimationFlag.SecondaryMates | AnimationFlag.VariableDuration,
		childId: null,
		edge: null,
		next: null,
	}),
];

/**
 * Default Animations
 *
 * @const {!ChoiceList}
 */
export const DefaultList = new ChoiceList([
	[Playlist.Walk, 20],
	[Playlist.BeginRun, 4],
	[Playlist.Beg, 2],
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
	[Playlist.Scoot, 1],
	[Playlist.Scream, 1],
	[Playlist.Sleep, 1],
	[Playlist.Sneeze, 1],
	[Playlist.Urinate, 1],
]);

/**
 * Entrance Animations
 *
 * @const {!ChoiceList}
 */
export const EntranceList = new ChoiceList([
	[Playlist.BathDive, 1],
	[Playlist.BlackSheepChase, 1],
	[Playlist.BlackSheepRomance, 1],
	[Playlist.ChasingAMartian, 1],
	[Playlist.Stargaze, 1],
]);

/**
 * First Animations
 *
 * @const {!ChoiceList}
 */
export const FirstList = new ChoiceList([
	[Playlist.Fall, 10],
	[Playlist.BathDive, 1],
	[Playlist.BlackSheepChase, 1],
	[Playlist.BlackSheepRomance, 1],
	[Playlist.ChasingAMartian, 1],
	[Playlist.Stargaze, 1],
]);
