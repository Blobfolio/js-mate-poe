// This flag is used to keep track of whether or not we have let the user know
// they might need to click the page before Firefox will let audio playback
// happen. (We don't want to bother them twice.)
let audioWarned = false;

// Relative Audio File Locations.
const audioUrls = [
	'sound/baa.flac',
	'sound/sneeze.flac',
	'sound/yawn.flac',
];

/**
 * Initialize Sounds.
 *
 * This is a workaround for intermittent playback failures that usually trigger
 * the first time a given asset is requested.
 *
 * @return {void} Nothing.
 */
export const poeInitAudio = function() {
	for (const sound of audioUrls) { browser.runtime.getURL(sound); }
};

/**
 * Play Sound.
 *
 * @param {number} idx ID.
 * @return {void} Nothing.
 */
const poePlaySound = function(idx) {
	idx = parseInt(idx);
	if (
		! isNaN(idx) &&
		0 <= idx &&
		idx < audioUrls.length &&
		'string' === typeof audioUrls[idx]
	) {
		const audio = new Audio(browser.runtime.getURL(audioUrls[idx]));
		audio.addEventListener('canplaythrough', () => {
			audio.play().catch((e) => {
				if (! audioWarned) {
					audioWarned = true;
					console.info('Hint: try clicking (anywhere on) the page.');
				}
			});
		}, { once: true, passive: true });
	}
};
