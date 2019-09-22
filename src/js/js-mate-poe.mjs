/**
 * @file Entry point.
 */

import { CSS } from './_css.mjs';
import { bindEvent, clearEvents, logInfo, LOGO, NAME, VERSION } from './_helpers.mjs';
import { Mate } from './_mate.mjs';



/** @type {?Mate} */
let _mate = null;

/** @type {boolean} */
let _audio = true;



/**
 * A Poe Sprite!
 *
 * @constructor
 */
const Poe = class {
	// -----------------------------------------------------------------
	// Setup
	// -----------------------------------------------------------------

	/**
	 * Start Sprites
	 *
	 * @return {void} Nothing.
	 * @public
	 */
	static start() {
		// Don't run this more than once.
		if (null !== _mate) {
			return;
		}

		// Set up a few global listeners.
		Poe.setup();

		// Start the mate!
		_mate = new Mate();
		_mate.start();

		logInfo('started.');
	}

	/**
	 * Set Up
	 *
	 * @return {void} Nothing.
	 * @private
	 */
	static setup() {
		if (null !== _mate) {
			return;
		}

		bindEvent(
			document.documentElement,
			'mousemove',
			(/** @type {MouseEvent} */ e) => Poe.onDrag(e),
			{ passive: true }
		);
		bindEvent(
			document.documentElement,
			'mouseup',
			Poe.onDragEnd,
			{ passive: true }
		);
		bindEvent(window, 'resize', Poe.onResize, { passive: true });
		bindEvent(window, 'poeDestroy', Poe.stop);

		Poe.setupStyle();
	}

	/**
	 * Add Styles to the Page
	 *
	 * @return {void} Nothing.
	 * @private
	 */
	static setupStyle() {
		// This only needs to happen once.
		if (document.getElementById('css-mate-poe')) {
			return;
		}

		/** @type {Element} */
		const parent = document.head || document.body;

		/** @type {Element} */
		let style = document.createElement('STYLE');
		style.type = 'text/css';
		style.id = 'css-mate-poe';

		style.appendChild(document.createTextNode(CSS));
		parent.appendChild(style);
	}

	/**
	 * Destroy
	 *
	 * @return {void} Nothing.
	 * @public
	 */
	static stop() {
		_mate.destroy();
		_mate = null;
		clearEvents(document.documentElement);
		clearEvents(window);

		logInfo('stopped.');
	}



	// -----------------------------------------------------------------
	// Getters
	// -----------------------------------------------------------------

	/**
	 * Play Audio?
	 *
	 * @return {boolean} True/false.
	 * @public
	 */
	static audio() {
		return _audio;
	}



	// -----------------------------------------------------------------
	// Setters
	// -----------------------------------------------------------------

	/**
	 * Set Main Animation
	 *
	 * @param {number} id Animation ID.
	 * @param {number=} x Start at X.
	 * @param {number=} y Start at Y.
	 * @return {boolean} True/false.
	 * @public
	 */
	static setAnimation(id, x, y) {
		if (null === _mate) {
			return false;
		}

		return _mate.setAnimation(id, x, y);
	}

	/**
	 * Set Audio
	 *
	 * @param {boolean} on Status.
	 * @return {void} Nothing.
	 * @public
	 */
	static setAudio(on) {
		_audio = !! on;
		logInfo(`audio is now ${_audio ? 'enabled' : 'disabled'}.`);
	}



	// -----------------------------------------------------------------
	// Console
	// -----------------------------------------------------------------

	/**
	 * Console: ASCII Art
	 *
	 * @return {void} Nothing.
	 * @public
	 */
	static printAscii() {
		/* eslint-disable-next-line */
		console.log(`%c${LOGO}`, 'color: #b2bec3; font-family: monospace; font-weight: bold;');
	}

	/**
	 * Console: Version
	 *
	 * @return {void} Nothing.
	 * @public
	 */
	static printVersion() {
		/* eslint-disable-next-line */
		console.log(`%c${NAME}: %c${VERSION}`, 'color: #ff1493; font-weight: bold;', 'color: #00abc0; font-weight: bold;');
	}



	// -----------------------------------------------------------------
	// Callbacks
	// -----------------------------------------------------------------

	/**
	 * On Resize
	 *
	 * @return {void} Nothing.
	 * @public
	 */
	static onResize() {
		if (null !== _mate) {
			requestAnimationFrame(() => _mate.onResize());
		}
	}

	/**
	 * On Drag
	 *
	 * @param {MouseEvent} e Event.
	 * @return {void} Nothing.
	 * @public
	 */
	static onDrag(e) {
		if (null !== _mate && _mate.isDragging()) {
			_mate.onDrag(e);
		}
	}

	/**
	 * On Drag End
	 *
	 * @return {void} Nothing.
	 * @public
	 */
	static onDragEnd() {
		if (null !== _mate && _mate.isDragging()) {
			_mate.endDrag();
		}
	}
};

// Exports to prevent mangling.
window['Poe'] = Poe;
window['Poe']['audio'] = Poe.audio;
window['Poe']['printAscii'] = Poe.printAscii;
window['Poe']['printVersion'] = Poe.printVersion;
window['Poe']['setAnimation'] = Poe.setAnimation;
window['Poe']['setAudio'] = Poe.setAudio;
window['Poe']['start'] = Poe.start;
window['Poe']['stop'] = Poe.stop;
