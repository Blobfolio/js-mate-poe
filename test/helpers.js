/**
 * @file Tests: Helpers.
 */

/* global assert */
/* global describe */
/* global it */
import { ANIMATIONS, MAX_ANIMATION_ID } from '../src/js/_animations.mjs';
import {
	isAbsInt,
	isDirection,
	isPlaylist,
	isSound,
	isUInt,
	standardizeChoices,
	xDirection,
	yDirection,
	zeroPad
} from '../src/js/_helpers.mjs';
import { Direction, Playlist, Sound, WeightedChoice } from '../src/js/_types.mjs';



describe('isAbsInt', () => {
	/** @const {Array<*, boolean>} */
	const data = [
		[0, false],
		[1, true],
		[1.1, false],
		[-1, false],
		[100, true],
	];

	for (let i = 0; i < data.length; ++i) {
		it(
			`${data[i][0]} ${data[i][1] ? 'is' : 'is not'} a positive integer`,
			() => assert.strictEqual(data[i][1], isAbsInt(data[i][0]))
		);
	}
});

describe('isDirection', () => {
	/** @const {Array<*, boolean>} */
	const data = [
		[Playlist.Abduction, false],
		['Up', false],
		[-1, false],
		[0, true],
		[1, true],
		[2, true],
		[3, true],
		[4, true],
		[5, false],
		[Direction.Up, true],
		[Direction.Down, true],
		[Direction.Left, true],
		[Direction.Right, true],
		[Direction.None, true],
	];

	for (let i = 0; i < data.length; ++i) {
		it(
			`${data[i][0]} ${data[i][1] ? 'is' : 'is not'} a Direction`,
			() => assert.strictEqual(data[i][1], isDirection(data[i][0]))
		);
	}
});

describe('isPlaylist', () => {
	// Test known animations.
	for (let i = 0; i < ANIMATIONS.length; ++i) {
		it(
			`${ANIMATIONS[i].id} is a Playlist`,
			() => assert.isTrue(isPlaylist(ANIMATIONS[i].id))
		);
	}

	it(
		'-1 is not a Playlist',
		() => assert.isFalse(isPlaylist(-1))
	);

	it(
		'0 is not a Playlist',
		() => assert.isFalse(isPlaylist(0))
	);

	it(
		`${MAX_ANIMATION_ID + 1} is not a Playlist`,
		() => assert.isFalse(isPlaylist(MAX_ANIMATION_ID + 1))
	);
});

describe('isSound', () => {
	/** @const {Array<*, boolean>} */
	const data = [
		[Playlist.Abduction, false],
		['BAA', false],
		['Baa', false],
		[-1, false],
		[0, false],
		[1, true],
		[2, true],
		[3, true],
		[4, false],
		[Sound.Baa, true],
		[Sound.Sneeze, true],
		[Sound.Yawn, true],
	];

	for (let i = 0; i < data.length; ++i) {
		it(
			`${data[i][0]} ${data[i][1] ? 'is' : 'is not'} a Sound`,
			() => assert.strictEqual(data[i][1], isSound(data[i][0]))
		);
	}
});

describe('isUInt', () => {
	/** @const {Array<*, boolean>} */
	const data = [
		[0, true],
		[1, true],
		[1.1, false],
		[-1, false],
		[100, true],
	];

	for (let i = 0; i < data.length; ++i) {
		it(
			`${data[i][0]} ${data[i][1] ? 'is' : 'is not'} a positive integer`,
			() => assert.strictEqual(data[i][1], isUInt(data[i][0]))
		);
	}
});

describe('standardizeChoices', () => {
	/** @const {Array<Array<(null|!Playlist|!Array<WeightedChoice>), (null|!Array<WeightedChoice>)>>} */
	const data = [
		[Playlist.Walk, [[Playlist.Walk, 1]]],
		[null, null],
		[
			[[Playlist.Walk, 1], [Playlist.Run, 10]],
			[[Playlist.Walk, 1], [Playlist.Run, 10]],
		],
	];

	for (let i = 0; i < data.length; ++i) {
		it(
			`Standardized choices ${data[i][0]}`,
			() => assert.deepEqual(data[i][1], standardizeChoices(data[i][0]))
		);
	}
});

describe('xDirection', () => {
	/** @const {Array<Array<number, Direction, string>>} */
	const data = [
		[5, Direction.Right, 'right'],
		[0, Direction.None, 'nowhere'],
		[-5, Direction.Left, 'left'],
	];

	for (let i = 0; i < data.length; ++i) {
		it(
			`${data[i][0]}px is moving ${data[i][2]}`,
			() => assert.strictEqual(data[i][1], xDirection(data[i][0]))
		);
	}
});

describe('yDirection', () => {
	/** @const {Array<Array<number, Direction, string>>} */
	const data = [
		[5, Direction.Down, 'down'],
		[0, Direction.None, 'nowhere'],
		[-5, Direction.Up, 'up'],
	];

	for (let i = 0; i < data.length; ++i) {
		it(
			`${data[i][0]}px is moving ${data[i][2]}`,
			() => assert.strictEqual(data[i][1], yDirection(data[i][0]))
		);
	}
});

describe('zeroPad', () => {
	/** @const {Array<Array<number, number, string>>} */
	const data = [
		[1, 2, '01'],
		[22, 2, '22'],
		[3, 3, '003'],
	];

	for (let i = 0; i < data.length; ++i) {
		it(
			`${data[i][0]} padded to ${data[i][1]} chars should be ${data[i][2]}`,
			() => assert.strictEqual(data[i][2], zeroPad(data[i][0], data[i][1]))
		);
	}
});
