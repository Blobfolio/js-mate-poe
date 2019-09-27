/**
 * @file Entry point.
 */

import { CSS } from './_css.mjs';
import {
	bindEvent,
	clearEvents,
	logInfo,
	LOGO,
	NAME,
	setScreenHeight,
	setScreenWidth,
	VERSION
} from './_helpers.mjs';
import { Mate } from './_mate.mjs';



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
		if (Mate.length) {
			return;
		}

		// Set up a few global listeners.
		Poe.setup();

		// Start the mate!
		Mate.init(false).start();

		logInfo('started.');
	}

	/**
	 * Set Up
	 *
	 * @return {void} Nothing.
	 * @private
	 */
	static setup() {
		if (Mate.length) {
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
		bindEvent(window, 'poeShutdown', Poe.stop);
		bindEvent(window, 'poeDetached', Poe.onDetach);

		Poe.setupStyle();

		// Go ahead and set the width and height as soon as the browser begins painting.
		setScreenHeight();
		setScreenWidth();
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

		/** @const {Element} */
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
		Mate.deleteAll();

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
		if (null === Mate.primary) {
			return false;
		}

		return Mate.primary.setAnimation(id, x, y);
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
	 * On Detach
	 *
	 * @param {Event} e Event.
	 * @return {void} Nothing.
	 */
	static onDetach(e) {
		/** @const {number} */
		const mateId = parseInt(e.detail.mateId, 10) || 0;
		Mate.delete(mateId);
	}

	/**
	 * On Drag
	 *
	 * @param {MouseEvent} e Event.
	 * @return {void} Nothing.
	 * @public
	 */
	static onDrag(e) {
		if (null !== Mate.primary && Mate.primary.isDragging()) {
			Mate.primary.onDrag(e);
		}
	}

	/**
	 * On Drag End
	 *
	 * @return {void} Nothing.
	 * @public
	 */
	static onDragEnd() {
		if (null !== Mate.primary && Mate.primary.isDragging()) {
			Mate.primary.endDrag();
		}
	}

	/**
	 * On Resize
	 *
	 * @return {void} Nothing.
	 * @public
	 */
	static onResize() {
		if (null !== Mate.primary) {
			requestAnimationFrame(() => {
				setScreenHeight();
				setScreenWidth();

				// Run mate operations if any.
				Mate.primary.onResize();
			});
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
