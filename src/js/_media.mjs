/**
 * @file Multimedia.
 */

import { BAA, SNEEZE, YAWN } from './_bin.mjs';
import { Poe } from './_poe.mjs';
import { LogType, Sound } from './_types.mjs';



// ---------------------------------------------------------------------
// Audio
// ---------------------------------------------------------------------

/** @type {boolean} */
let _audio_warned = false;

/**
 * Get Audio
 *
 * @param {Sound} sound Audio.
 * @return {void} Nothing.
 */
export const makeNoise = function(sound) {
	/* @type {?string} */
	let file = null;

	switch (sound) {
	case Sound.Baa:
		file = BAA;
		break;
	case Sound.Sneeze:
		file = SNEEZE;
		break;
	case Sound.Yawn:
		file = YAWN;
		break;
	default:
		return;
	}

	/** @const {Audio} */
	const audio = new Audio(file);
	audio.play().catch(() => {
		if (! _audio_warned) {
			_audio_warned = true;
			Poe.log(
				'Hint: try clicking Poe with your mouse.',
				LogType.Warning
			);
		}
	});
};



// ---------------------------------------------------------------------
// Image
// ---------------------------------------------------------------------

/**
 * Number of tiles horizontally.
 *
 * @const {number}
 */
export const TILES_X = 16;

/**
 * Number of tiles vertically.
 *
 * @const {number}
 */
export const TILES_Y = 11;

/**
 * Tile size (width and height are equal).
 *
 * @const {number}
 */
export const TILE_SIZE = 40;

/**
 * Image width.
 *
 * @const {number}
 */
export const WIDTH = 640;

/**
 * Image height.
 *
 * @const {number}
 */
export const HEIGHT = 440;

/**
 * Frame Offset
 *
 * @param {number} frame Frame.
 * @return {Array<number, number>} Position.
 */
export const frameOffset = function(frame) {
	return [
		(0 - TILE_SIZE) * (frame % TILES_X),
		(0 - TILE_SIZE) * Math.floor(frame / TILES_X),
	];
};
