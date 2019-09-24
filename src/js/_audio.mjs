/**
 * @file Audio.
 */



import { BAA, SNEEZE, YAWN } from './_bin.mjs';
import { SOUNDS } from './_types.mjs';



/**
 * Get Audio
 *
 * @param {SOUNDS} sound Audio.
 * @return {void} Nothing.
 */
export const makeNoise = function(sound) {
	/* @type {?string} */
	let file = null;

	switch (sound) {
	case SOUNDS.Baa:
		file = BAA;
		break;
	case SOUNDS.Sneeze:
		file = SNEEZE;
		break;
	case SOUNDS.Yawn:
		file = YAWN;
		break;
	default:
		return;
	}

	/** @type {Audio} */
	const audio = new Audio(file);
	audio.play();
};
