/**
 * @file Audio.
 */

import { BAA, SNEEZE, YAWN } from './_bin.mjs';
import { Poe } from './_poe.mjs';
import { LogType, Sound } from './_types.mjs';



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
