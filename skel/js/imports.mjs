/**
 * @file Wasm Imports & Glue
 *
 * Some of these methods won't be necessary depending on the crate features
 * enabled, but they should be recognized as dead code and pruned during
 * transpilation, so won't add any overhead to the final library.
 */

/**
 * Import: Console Debug (Director).
 *
 * This is just a thin wrapper around console.debug, accepting a single string
 * as input.
 *
 * @param {string} msg Message.
 * @return {void} Nothing.
 */
const poeConsoleDebug = function(msg) { console.debug(msg); };

/**
 * Import: Console Warn (Director).
 *
 * This is just a thin wrapper around console.debug, accepting a single string
 * as input.
 *
 * @param {string} msg Message.
 * @return {void} Nothing.
 */
const poeConsoleWarn = function(msg) { console.warn(msg); };

/**
 * Import: Print Library Details (Director).
 *
 * @return {void} Nothing.
 */
const poeDetails = function() {
	const playlist = `%PLAYLIST%`;
	console.info(`%cJS Mate Poe: %c%VERSION%`, 'color:#ff1493;font-weight:bold;', 'color:#00abc0;font-weight:bold;');
	console.info(`%c${playlist}`, 'color:#b2bec3;font-family:monospace;');
};

/**
 * Import: Get URL (Firefox).
 *
 * The audio assets — but _not_ the image for whatever reason — have to be
 * bundled with the extension rather than the wasm to exempt them from per-site
 * CSP restrictions.
 *
 * This wrapper gives the wasm a way to generate URLs for them so it can do
 * what it needs to do.
 *
 * @param {string} path Relative Path.
 * @return {string} URL.
 */
const poeGetUrl = function(path) { return browser.runtime.getURL(path); };

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
	if (
		(43 === frame) || (81 === frame) || (82 === frame) ||
		(101 === frame) || (102 === frame) || (103 === frame)
	) {
		rx = ! rx;
	}
	list.toggle('rx', !! rx);

	// Disabled?
	list.toggle('off', 0 === scene);

	// Child-only classes.
	if (list.contains('child')) {
		// Special frame.
		list.toggle('m120', 120 === frame);

		// Animations.
		list.toggle('a2',  2 === scene); // SneezeShadow.
		list.toggle('a4',  4 === scene); // BigFishChild.
		list.toggle('a5',  5 === scene); // SplatGhost.
		list.toggle('a7',  7 === scene); // MagicFlower1 & 2.
		list.toggle('a9',  9 === scene); // ShadowShodown1.
		list.toggle('aa', 10 === scene); // ShadowShodown2.
		list.toggle('af', 15 === scene); // BlackSheepCatchExitChild.
		list.toggle('ag', 16 === scene); // BathDiveChild.
	}
	// Primary-only classes.
	else {
		// Special frames.
		list.toggle('h', (38 === frame) || (39 === frame) || (40 === frame));
		list.toggle('m024', 24 === frame);
		list.toggle('m083', 83 === frame);

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
