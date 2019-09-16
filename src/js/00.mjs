/**
 * @file Entry point.
 */

import { CSS } from './css.mjs';
import { bindEvent, clearEvents, logInfo, LOGO, NAME, VERSION } from './helpers.mjs';
import { Mate } from './mate.mjs';
import { TILE_SIZE } from './image.mjs';



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
	 */
	static setup() {
		if (null !== _mate) {
			return;
		}

		bindEvent(
			document.documentElement,
			'mousemove',
			(e) => Poe.onDrag(e),
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
	 */
	static setupStyle() {
		// This only needs to happen once.
		if (document.getElementById('css-mate-poe')) {
			return;
		}

		const parent = document.head || document.body;

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
	 */
	static printAscii() {
		/* eslint-disable-next-line */
		console.log(`%c${LOGO}`, 'color: #b2bec3; font-family: monospace; font-weight: bold;');
	}

	/**
	 * Console: Version
	 *
	 * @return {void} Nothing.
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
	 */
	static onResize() {
		if (null !== _mate) {
			window.requestAnimationFrame(() => _mate.onResize());
		}
	}

	/**
	 * On Drag
	 *
	 * @param {Event} e Event.
	 * @return {void} Nothing.
	 */
	static onDrag(e) {
		if (null !== _mate && _mate.isDragging()) {
			const x = parseFloat(e.clientX) || 0;
			const y = parseFloat(e.clientY) || 0;

			_mate.setPosition(
				x - TILE_SIZE / 2,
				y - TILE_SIZE / 2,
				true
			);
		}
	}

	/**
	 * On Drag End
	 *
	 * @return {void} Nothing.
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
