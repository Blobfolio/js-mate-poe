/**
 * @file Wasm Imports & Glue
 */

// Buffer lengths.
%LENGTHS%

// ASCII Art.
const imgAscii = `%ASCII%`;

// Playlist.
const playlist = `%PLAYLIST%`;

// Library version.
const version = '%VERSION%';

// A flag to indicate whether or not we've explained how browser autoplay
// works.
let audioWarned = false;

// The Blob-derived audio URLs: baa, sneeze, and yawn, respectively.
let audioUrls = null;

// The Blob-derived image sprite URL.
let imgUrl = null;

/**
 * Import: Print Library Details (Director).
 *
 * @return {void} Nothing.
 */
const poeDetails = function() {
	console.info(`%c${imgAscii}`, 'color:#b2bec3;font-family:monospace;font-weight:bold;');
	console.info(`%cJS Mate Poe: %c${version}`, 'color:#ff1493;font-weight:bold;', 'color:#00abc0;font-weight:bold;');
	console.info(`%c${playlist}`, 'color:#b2bec3;font-family:monospace;');
};

/**
 * Initialize Media.
 *
 * This creates and/or sets "URLs" that can be used to access the embedded
 * media (the image sprite and audio files).
 *
 * Note: This must be called by the MJS entrypoint AFTER init(), and BEFORE
 * Poe.activate.
 *
 * @param {Object} wasm Wasm exports.
 * @return {void} Nothing.
 */
export const poeInitMedia = function(wasm) {
	if (null === audioUrls) {
		audioUrls = [%AUDIO_URLS%];
	}

	if (null === imgUrl) {
		imgUrl = URL.createObjectURL(
			new Blob(
				[new Uint8ClampedArray(wasm.memory.buffer, wasm.img_ptr(), imgLen)],
				{ type: 'image/png' },
			)
		);
	}
};

/**
 * Import: Create Mate Image.
 *
 * This generates and returns a mate image element, complete with source.
 *
 * @return {Element} Element.
 */
const poeMakeImage = function() {
	const el = new Image(imgWidth, imgHeight);
	el.id = 'i';
	if (null !== imgUrl) { el.src = imgUrl; }
	return el;
};

/**
 * Import: Play Sound.
 *
 * @param {number} idx ID.
 * @return {void} Nothing.
 */
const poePlaySound = function(idx) {
	idx = parseInt(idx, 10);
	if (
		! isNaN(idx) &&
		(null !== audioUrls) &&
		(undefined !== audioUrls[idx]) &&
		'visible' === document.visibilityState
	) {
		const audio = new Audio();
		audio.addEventListener('canplaythrough', () => {
			audio.play().catch((e) => {
				if (! audioWarned) {
					audioWarned = true;
					console.info('Hint: try clicking (anywhere on) the page.');
				}
			});
		}, { once: true, passive: true });
		audio.src = audioUrls[idx];
	}
};

/**
 * Import: Update Wrapper Classes.
 *
 * This toggles the various (toggleable) wrapper classes to match specific
 * states.
 *
 * The JS definition is ugly, but saves us having to pass/decode nine separate
 * strings over the wasm/JS boundary every time a class changes.
 *
 * @param {!Element} el Element.
 * @param {boolean} rx FlipX.
 * @param {number} frame Frame Class.
 * @param {number} scene Animation Class.
 * @return {void} Nothing.
 */
const poeToggleWrapperClasses = function(el, rx, frame, scene) {
	// Pull the list so we have it.
	const list = el.classList;

	// Sanitize frame, scene class IDs.
	frame = parseInt(frame, 10);
	scene = parseInt(scene, 10);

	// Orientation class.
	list.toggle('rx', !! rx);

	// Disabled?
	list.toggle('off', 0 === scene);

	// Child-only classes.
	if (list.contains('child')) {
		// Special frame.
		list.toggle('m126', 126 === frame);

		// Animations.
		list.toggle('a2',  2 === scene); // SneezeShadow.
		list.toggle('a4',  4 === scene); // BigFishChild.
		list.toggle('a5',  5 === scene); // SplatGhost.
		list.toggle('a7',  7 === scene); // MagicFlower1 & 2.
		list.toggle('a9',  9 === scene); // ShadowShodown1.
		list.toggle('aa', 10 === scene); // ShadowShodown2.
		list.toggle('af', 15 === scene); // BlackSheepCatchExitChild.
	}
	// Primary-only classes.
	else {
		// Special frames.
		list.toggle('h', (36 === frame) || (37 === frame) || (38 === frame));
		list.toggle('m020', 20 === frame);
		list.toggle('m030', 30 === frame);

		// Animations.
		list.toggle('a1',  1 === scene); // Drag.
		list.toggle('a3',  3 === scene); // Abduction.
		list.toggle('a6',  6 === scene); // EatingMagicFlower.
		list.toggle('a8',  8 === scene); // DigestMagicFlower1.
		list.toggle('ab', 11 === scene); // DangleRecover.
		list.toggle('ac', 12 === scene); // Yoyo.
		list.toggle('ad', 13 === scene); // BeamIn.
		list.toggle('ae', 14 === scene); // Glitch.
	}
};

/**
 * Import: Update CSS Property.
 *
 * This simply writes an updated numeric (pixel) CSS property to an element's
 * style attribute.
 *
 * Until wasm gains proper DOM API support, it is significantly more efficient
 * to handle this particular task in JS.
 *
 * @param {!Element} el Element.
 * @param {string} key Key.
 * @param {number} val Value.
 * @return {void} Nothing.
 */
const poeWriteCssProperty = function(el, key, value) {
	el.style.setProperty(`--${key}`, `${value}px`);
};
