/**
 * @file Poe
 */

import { LOGO, NAME, REPO, VERSION } from './_about.mjs';
import { CSS } from './_css.mjs';
import { zeroPad } from './_helpers.mjs';
import { ChildMate, Mate } from './_mate.mjs';
import { Flags, LogType, Playlist } from './_types.mjs';



/**
 * Public Poe Bridge
 *
 * @typedef {{
	_flags: number,
	_primary: ?Mate,
	_children: Array<ChildMate>,
	_length: number,
	_width: number,
	_height: number
 * }}
 * @suppress {duplicate}
 */
export const Poe = {
	/** @private {number} */
	_flags: Flags.MakeNoise,
	/** @private {?Mate} */
	_primary: null,
	/** @private {Array<ChildMate>} */
	_children: [],
	/** @private {number} */
	_length: 0,
	/** @private {number} */
	_width: 0,
	/** @private {number} */
	_height: 0,



	// -----------------------------------------------------------------
	// Construction
	// -----------------------------------------------------------------

	/**
	 * Start!
	 *
	 * @return {void} Nothing.
	 * @public
	 */
	start() {
		// There can be only one!
		if (null !== Poe._primary) {
			return;
		}

		// Run a few generic initialization tasks.
		Poe.setup();

		// Start the primary mate!
		Poe.initMate();
		Poe._primary.start();

		// Console log.
		Poe.log('Sheep happens!', LogType.Log);
	},

	/**
	 * Setup
	 *
	 * @return {void} Nothing.
	 * @private
	 */
	setup() {
		// We don't need to do this more than once.
		if (null !== Poe._primary) {
			return;
		}

		// Bind events.

		// Dragging.
		document.documentElement.addEventListener(
			'mousemove',
			/** @type {(function(Event))} */ (Poe.onDrag),
			{ passive: true }
		);

		// Stop dragging.
		document.documentElement.addEventListener(
			'mouseup',
			Poe.onDragEnd,
			{ passive: true }
		);

		// Shutdown Poe.
		window.addEventListener(
			'poestop',
			Poe.stop,
			{ passive: true }
		);

		// Screen resize.
		window.addEventListener(
			'resize',
			Poe.onResize,
			{ passive: true }
		);

		// Set up styles.
		if (! document.getElementById('css-mate-poe')) {
			/** @type {Element} */
			let style = document.createElement('STYLE');
			style.id = 'css-mate-poe';
			style.type = 'text/css';

			style.appendChild(document.createTextNode(CSS));
			(document.head || document.body).appendChild(style);
		}

		// Print help.
		if (Poe.debug) {
			Poe.help();
		}
	},

	/**
	 * Initialize a Mate
	 *
	 * @return {!Mate|!ChildMate} Mate.
	 */
	initMate() {
		// We're making the first instance.
		if (null === Poe._primary) {
			Poe._length = 1;
			Poe._primary = new Mate(1);
			return Poe._primary;
		}
		// Do we have any available children?
		else if (Poe._children.length) {
			for (let i = 0; i < Poe._children.length; ++i) {
				// We can steal it!
				if (Poe._children[i].isDisabled()) {
					return /** @type {!ChildMate} */ (Poe._children[i]);
				}
			}
		}

		// Primary + existing + 1.
		Poe._length = 2 + Poe._children.length;
		Poe._children.push(new ChildMate(Poe._length));
		return /** @type {!ChildMate} */ (Poe._children[Poe._children.length - 1]);
	},



	// -----------------------------------------------------------------
	// Getters and Setters
	// -----------------------------------------------------------------

	/**
	 * Get Animation
	 *
	 * @return {?Playlist} Nothing.
	 */
	get animation() {
		if (null !== Poe._primary) {
			return Poe._primary.animationId;
		}

		return null;
	},

	/**
	 * Set Animation
	 *
	 * @param {!Playlist} animationId Animation ID.
	 * @return {void} Nothing.
	 */
	set animation(animationId) {
		if (null !== Poe._primary) {
			Poe.stopChildren();
			Poe._primary.setAnimation(animationId);
		}
	},

	/**
	 * Audio
	 *
	 * @return {boolean} True/false.
	 * @public
	 */
	get audio() {
		return !! (Flags.MakeNoise & Poe._flags);
	},

	/**
	 * Audio
	 *
	 * Enable or disable audio.
	 *
	 * @param {boolean} v Value.
	 * @return {void} Nothing.
	 * @public
	 */
	set audio(v) {
		// No flip.
		if (! v) {
			Poe._flags &= ~Flags.MakeNoise;
		}
		// Yes flip.
		else {
			Poe._flags |= Flags.MakeNoise;
		}
	},

	/**
	 * Debug
	 *
	 * @return {boolean} True/false.
	 * @public
	 */
	get debug() {
		return !! (Flags.Debug & Poe._flags);
	},

	/**
	 * Debug
	 *
	 * Enable or disable debug output.
	 *
	 * @param {boolean} v Value.
	 * @return {void} Nothing.
	 * @public
	 */
	set debug(v) {
		// No flip.
		if (! v) {
			Poe._flags &= ~Flags.Debug;
		}
		// Yes flip.
		else {
			Poe._flags |= Flags.Debug;
		}
	},

	/**
	 * Screen Height
	 *
	 * @return {number} Height.
	 */
	get height() {
		if (0 >= Poe._height) {
			Poe._height = Poe.calculateHeight();
		}

		return Poe._height;
	},

	/**
	 * Screen Height
	 *
	 * @param {number} v Height.
	 * @return {void} Nothing.
	 */
	set height(v) {
		v = parseInt(v, 10) || 0;
		if (0 > v) {
			v = 0;
		}

		Poe._height = v;
	},

	/**
	 * Program Name
	 *
	 * @return {string} Name.
	 */
	get name() {
		return NAME;
	},

	/**
	 * Program Version
	 *
	 * @return {string} Version.
	 */
	get version() {
		return VERSION;
	},

	/**
	 * Screen Width
	 *
	 * @return {number} Width.
	 */
	get width() {
		if (0 >= Poe._width) {
			Poe._width = Poe.calculateWidth();
		}

		return Poe._width;
	},

	/**
	 * Screen Width
	 *
	 * @param {number} v Width.
	 * @return {void} Nothing.
	 */
	set width(v) {
		v = parseInt(v, 10) || 0;
		if (0 > v) {
			v = 0;
		}

		Poe._width = v;
	},



	// -----------------------------------------------------------------
	// Methods
	// -----------------------------------------------------------------

	/**
	 * Get Mate
	 *
	 * @param {number} mateId Mate ID.
	 * @return {null|!Mate|!ChildMate} Mate.
	 */
	getMate(mateId) {
		mateId = parseInt(mateId, 10) || 0;
		if (1 === mateId) {
			return Poe._primary;
		}
		else if (
			1 < mateId &&
			'undefined' !== typeof Poe._children[mateId - 2]
		) {
			return Poe._children[mateId - 2];
		}

		return null;
	},



	// -----------------------------------------------------------------
	// Destruction
	// -----------------------------------------------------------------

	/**
	 * Stop
	 *
	 * @return {void} Nothing.
	 */
	stop() {
		// Tear down the mates.
		if (null !== Poe._primary) {
			Poe._primary.destructor();
			delete Poe._primary;
			Poe._primary = null;
		}

		// Tear down the children.
		if (Poe._children.length) {
			for (let i = Poe._children.length - 1; 0 <= i; --i) {
				Poe._children[i].destructor();
			}
			delete Poe._children;
			Poe._children = [];
		}

		// Reset the ID.
		Poe._length = 0;

		// Unbind events.
		document.documentElement.removeEventListener('mousemove', /** @type {(function(Event))} */ (Poe.onDrag));
		document.documentElement.removeEventListener('mouseup', Poe.onDragEnd);
		window.removeEventListener('poestop', Poe.stop);
		window.removeEventListener('resize', Poe.onResize);

		// Kill the width and height since we're no longer listening.
		Poe._height = 0;
		Poe._width = 0;

		// Console log.
		Poe.log('The party is over.', LogType.Log);
	},

	/**
	 * Stop Children
	 *
	 * @return {void} Nothing.
	 */
	stopChildren() {
		// Nothing to do.
		if (! Poe._children.length) {
			return;
		}

		for (let i = 0; i < Poe._children.length; ++i) {
			Poe._children[i].stop();
		}
	},



	// -----------------------------------------------------------------
	// Help and Helpers
	// -----------------------------------------------------------------

	/**
	 * Calculate Screen Height
	 *
	 * This only works if Window is a thing.
	 *
	 * @return {number} Height.
	 */
	calculateHeight() {
		if ('undefined' === typeof window) {
			return 0;
		}

		return parseInt(window.innerHeight, 10) || 0;
	},

	/**
	 * Calculate Screen Width
	 *
	 * This only works if Window is a thing.
	 *
	 * @return {number} Width.
	 */
	calculateWidth() {
		if ('undefined' === typeof window) {
			return 0;
		}

		/** @const {number} */
		const wWidth = parseInt(window.innerWidth, 10) || 0;

		// We should try to determine the scrollbar width where possible.
		if (
			('undefined' !== typeof document) &&
			('undefined' !== typeof document.documentElement)
		) {
			/** @const {number} */
			const dWidth = parseInt(document.documentElement.offsetWidth, 10) || 0;

			// If the discrepancy is small, that's probably the scrollbar.
			if (dWidth < wWidth && dWidth + 25 >= wWidth) {
				return dWidth;
			}
		}

		return wWidth;
	},

	/**
	 * Help
	 *
	 * @return {void} Nothing.
	 */
	help() {
		/* eslint-disable-next-line */
		console.info(`%c${LOGO}`, 'color:#b2bec3;font-family:monospace;font-weight:bold;');

		/* eslint-disable-next-line */
		console.info(`%c${Poe.name}: %c${Poe.version}`, 'color:#ff1493;font-weight:bold;', 'color:#00abc0;font-weight:bold;');

		/* eslint-disable-next-line */
		console.info(`%c${REPO}`, 'color:#e67e22;text-decoration:underline;');
	},

	/**
	 * Log
	 *
	 * @param {string} msg Message.
	 * @param {LogType=} type Type.
	 * @return {void} Nothing.
	 */
	log(msg, type) {
		if (! type) {
			type = LogType.Info;
		}

		/** @const {Date} */
		const now = new Date();

		/** @const {string} */
		const time = `${zeroPad(now.getHours(), 2)}:${zeroPad(now.getMinutes(), 2)}:${zeroPad(now.getSeconds(), 2)}`;

		/** @const {!Array} */
		const out = [
			`%c${time} %c${Poe.name} %c${msg}`,
			'color:#b2bec3;',
			'color:#ff1493;font-weight:bold;',
			'',
		];

		switch (type) {
		case LogType.Info:
			console.info(...out);
			break;
		case LogType.Log:
			/* eslint-disable-next-line */
			console.log(...out);
			break;
		case LogType.Warning:
			console.warn(...out);
			break;
		case LogType.Error:
			console.error(...out);
			break;
		}
	},



	// -----------------------------------------------------------------
	// Callback Handlers
	// -----------------------------------------------------------------

	/**
	 * Drag
	 *
	 * @param {!MouseEvent} e Event.
	 * @return {void} Nothing.
	 */
	onDrag(e) {
		if (null !== Poe._primary && Poe._primary.dragging) {
			Poe._primary.onDrag(e);
		}
	},

	/**
	 * Drag End
	 *
	 * @return {void} Nothing.
	 */
	onDragEnd() {
		if (null !== Poe._primary && Poe._primary.dragging) {
			Poe._primary.onEndDrag();
		}
	},

	/**
	 * Resize
	 *
	 * @return {void} Nothing.
	 */
	onResize() {
		requestAnimationFrame(() => {
			Poe._height = Poe.calculateHeight();
			Poe._width = Poe.calculateWidth();

			// Nudge the mate if needed.
			if (null !== Poe._primary) {
				Poe._primary.onResize();
			}
		});
	},
};
