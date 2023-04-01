// A flag to indicate whether or not we've explained how browser autoplay
// works.
let audioWarned = false;

// The Blob-derived audio URLs: baa, sneeze, and yawn, respectively.
let audioUrls = null;

/**
 * Initialize Audio.
 *
 * This must be called once as soon as the Wasm has been initialized, and
 * before Poe is activated.
 *
 * @param {Object} wasm Wasm exports.
 * @return {void} Nothing.
 */
export const poeInitAudio = function(wasm) {
	if (null === audioUrls) {
		audioUrls = [
			URL.createObjectURL(new Blob(
				[new Uint8ClampedArray(wasm.memory.buffer, wasm.baa_ptr(), baaLen)],
				{ type: 'audio/flac' },
			)),
			URL.createObjectURL(new Blob(
				[new Uint8ClampedArray(wasm.memory.buffer, wasm.sneeze_ptr(), sneezeLen)],
				{ type: 'audio/flac' },
			)),
			URL.createObjectURL(new Blob(
				[new Uint8ClampedArray(wasm.memory.buffer, wasm.yawn_ptr(), yawnLen)],
				{ type: 'audio/flac' },
			)),
		];
	}
};

/**
 * Play Sound.
 *
 * @param {number} idx ID.
 * @return {void} Nothing.
 */
const poePlaySound = function(idx) {
	idx = parseInt(idx);
	if (! isNaN(idx) && (null !== audioUrls) && undefined !== audioUrls[idx]) {
		const audio = new Audio(audioUrls[idx]);
		audio.play().catch((e) => {
			if (! audioWarned) {
				audioWarned = true;
				console.info('Hint: try clicking (anywhere on) the page.');
			}
		});
	}
};
