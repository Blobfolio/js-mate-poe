/**
 * @file Miscellaneous helper functions.
 */

import { MAX_ANIMATION_ID } from './_animations.mjs';
import { TILES_X, TILES_Y } from './_media.mjs';
import { Direction, Playlist, Scene, SceneRepeat, WeightedChoice } from './_types.mjs';



// ---------------------------------------------------------------------
// Positioning
// ---------------------------------------------------------------------

/**
 * X Direction
 *
 * @param {number} movement Movement.
 * @return {Direction} Direction.
 */
export const xDirection = function(movement) {
	if (0 < movement) {
		return Direction.Right;
	}
	else if (0 > movement) {
		return Direction.Left;
	}

	return Direction.None;
};

/**
 * Y Direction
 *
 * @param {number} movement Movement.
 * @return {Direction} Direction.
 */
export const yDirection = function(movement) {
	if (0 < movement) {
		return Direction.Down;
	}
	else if (0 > movement) {
		return Direction.Up;
	}

	return Direction.None;
};



// ---------------------------------------------------------------------
// Formatting
// ---------------------------------------------------------------------

/**
 * Zero Pad
 *
 * Pad a number with leading zeroes if needed.
 *
 * @param {number} v Number.
 * @param {number} length Target length.
 * @return {string} Padded number.
 */
export const zeroPad = function(v, length) {
	length = parseInt(length, 10) || 0;

	/** @type {string} */
	let str = (parseInt(v, 10) || 0).toString();

	while (str.length < length) {
		str = '0' + str;
	}

	return str;
};

/**
 * Standardize Choices
 *
 * @param {null|!Playlist|!Array<WeightedChoice>} choices Choices.
 * @return {null|!Array<WeightedChoice>} Choices.
 */
export const standardizeChoices = function(choices) {
	if (null === choices) {
		return null;
	}
	else if ('number' === typeof choices) {
		return [[choices, 1]];
	}

	return choices;
};



// ---------------------------------------------------------------------
// Demo
// ---------------------------------------------------------------------

/* eslint-disable quote-props */

/**
 * Resolve Scene
 *
 * @param {!Scene} scene Scene.
 * @return {!Scene} Scene.
 */
export const demoResolveScene = function(scene) {
	/** @type {?SceneRepeat} */
	let repeat = null;
	if ('function' === typeof scene.repeat) {
		repeat = scene.repeat();
	}
	else if (null !== scene.repeat) {
		repeat = [...scene.repeat];
	}

	return /** @type {!Scene} */ ({
		'start': 'function' === typeof scene.start ? scene.start() : scene.start,
		'from': [...scene.from],
		'to': [...scene.to],
		'repeat': repeat,
		'frames': [...scene.frames],
		'sound': null === scene.sound ? null : [...scene.sound],
		'flags': scene.flags,
	});
};

/**
 * Resolve Scenes
 *
 * Scene values can have dynamic callbacks; this will execute callbacks to return static values.
 *
 * @param {!Array<!Scene>} scenes Scenes.
 * @return {!Array<!Scene>} Scenes.
 */
export const demoResolveScenes = function(scenes) {
	/** @type {!Array<!Scene>} */
	let out = [];

	for (let i = 0; i < scenes.length; ++i) {
		out.push(demoResolveScene(scenes[i]));
	}

	return out;
};

/* eslint-enable quote-props */



// ---------------------------------------------------------------------
// Enum Types
// ---------------------------------------------------------------------

/**
 * Direction
 *
 * @param {*} v Value.
 * @return {boolean} True/false.
 */
export const isDirection = function(v) {
	return 'number' === typeof v && 0 <= v && 4 >= v;
};

/**
 * Playlist
 *
 * @param {*} v Value.
 * @return {boolean} True/false.
 */
export const isPlaylist = function(v) {
	return 'number' === typeof v && 0 < v && MAX_ANIMATION_ID >= v;
};

/**
 * Sound
 *
 * @param {*} v Value.
 * @return {boolean} True/false.
 */
export const isSound = function(v) {
	return 'number' === typeof v && 0 < v && 3 >= v;
};



// ---------------------------------------------------------------------
// Other Types
// ---------------------------------------------------------------------

/**
 * Animation
 *
 * @param {*} v Value.
 * @return {boolean} True/false.
 */
export const isAnimation = function(v) {
	return 'object' === typeof v &&
		null !== v &&
		'id' in v && isPlaylist(v.id) &&
		'string' === typeof v.name &&
		'scenes' in v && isSceneList(v.scenes) &&
		'number' === typeof v.useDefault && 0 <= v.useDefault &&
		'number' === typeof v.useFirst && 0 <= v.useFirst &&
		'number' === typeof v.useEntrance && 0 <= v.useEntrance &&
		'number' === typeof v.flags && 0 <= v.flags &&
		'childId' in v &&
		(null === v.childId || isPlaylist(v.childId)) &&
		'edge' in v && isChoiceList(v.edge) &&
		'next' in v && isChoiceList(v.next);
};

/**
 * Choice List
 *
 * @param {*} v Value.
 * @return {boolean} True/false.
 */
export const isChoiceList = function(v) {
	if (null === v || isPlaylist(v)) {
		return true;
	}

	if (Array.isArray(v) && v.length) {
		for (let i = 0; i < v.length; ++i) {
			if (
				! Array.isArray(v[i]) ||
				2 !== v[i].length ||
				! isPlaylist(v[i][0]) ||
				'number' !== typeof v[i][1] ||
				0 >= v[i][1]
			) {
				return false;
			}
		}

		return true;
	}

	return false;
};

/**
 * Frame List
 *
 * @param {*} v Value.
 * @return {boolean} True/false.
 */
export const isFrameList = function(v) {
	if (! Array.isArray(v) || ! v.length) {
		return false;
	}

	/** @const {number} */
	const MAX_FRAMES = TILES_X * TILES_Y;

	for (let i = 0; i < v.length; ++i) {
		if ('number' !== typeof v[i] || 0 > v[i] || MAX_FRAMES <= v[i]) {
			return false;
		}
	}

	return true;
};

/**
 * Scene
 *
 * @param {*} v Value.
 * @return {boolean} True/false.
 */
export const isScene = function(v) {
	return 'object' === typeof v &&
		null !== v &&
		'start' in v && isScenePosition(v.start, true) &&
		'from' in v && isScenePosition(v.from) &&
		'to' in v && isScenePosition(v.to) &&
		'repeat' in v && isSceneRepeat(v.repeat, true) &&
		'frames' in v && isFrameList(v.frames) &&
		'sound' in v && isSceneSound(v.sound) &&
		'number' === typeof v.flags && 0 <= v.flags;
};

/**
 * Scene List
 *
 * @param {*} v Value.
 * @return {boolean} True/false.
 */
export const isSceneList = function(v) {
	if (! Array.isArray(v) || ! v.length) {
		return false;
	}

	for (let i = 0; i < v.length; ++i) {
		if (! isScene(v[i])) {
			return false;
		}
	}

	return true;
};

/**
 * Scene Position
 *
 * @param {*} v Value.
 * @param {boolean=} cb Can be a callback.
 * @return {boolean} True/false.
 */
export const isScenePosition = function(v, cb) {
	if (null === v) {
		return true;
	}

	cb = !! cb;
	if (cb && 'function' === typeof v) {
		return true;
	}

	return Array.isArray(v) &&
		2 <= v.length &&
		3 >= v.length &&
		'number' === typeof v[0] &&
		'number' === typeof v[1] &&
		('undefined' === typeof v[2] || 'number' === typeof v[2]);
};

/**
 * Scene Repeat
 *
 * @param {*} v Value.
 * @param {boolean=} cb Can be a callback.
 * @return {boolean} True/false.
 */
export const isSceneRepeat = function(v, cb) {
	if (null === v) {
		return true;
	}

	cb = !! cb;
	if (cb && 'function' === typeof v) {
		return true;
	}

	return Array.isArray(v) &&
		2 === v.length &&
		'number' === typeof v[0] &&
		0 < v[0] &&
		'number' === typeof v[1] &&
		0 <= v[1];
};

/**
 * Scene Sound
 *
 * @param {*} v Value.
 * @return {boolean} True/false.
 */
export const isSceneSound = function(v) {
	if (null === v) {
		return true;
	}

	return Array.isArray(v) &&
		2 === v.length &&
		isSound(v[0]) &&
		'number' === typeof v[1] &&
		0 <= v[1];
};
