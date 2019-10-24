/**
 * @file JS Mate Poe
 */

import {
	base64toBlob,
	ImgSprite,
	LogMsg,
	LogKind,
	MateFlag,
	MateState,
	Position,
	SndBaaUrl,
	SndSneezeUrl,
	SndYawnUrl,
	Sound,
	SpriteInfo,
	Universe
} from '../core.mjs';

import { CssUrl } from './css.url.mjs';



// ---------------------------------------------------------------------
// Universe Overloads
// ---------------------------------------------------------------------

Universe.random = function(max) {
	return Math.floor(Math.random() * max);
};

Universe.now = function() {
	return performance.now();
};

Universe.log = function(msg, type) {
	switch (type) {
	case LogKind.Error:
		console.error(msg);
		break;

	case LogKind.Warning:
		console.warn(msg);
		break;

	case LogKind.Notice:
		/* eslint-disable-next-line */
		console.log(msg);
		break;

	case LogKind.Info:
		console.info(msg);
		break;
	}
};



// ---------------------------------------------------------------------
// Public Interface
// ---------------------------------------------------------------------

/**
 * Poe Flags
 *
 * @enum {number}
 */
const PoeFlag = {
	AudioWarned: 1,
	Dragging: 2,
	Initialized: 4,
	MakeNoise: 8,
};

/**
 * Poe Mate
 *
 * @typedef {{
	primary: boolean,
	events: ?Object<string, Function>,
	el: !HTMLDivElement,
	img: !Image,
	elClass: string,
	elTransform: string,
	imgClass: string,
	sound: !Sound
 * }}
 */
var PoeMateState;

/**
 * JS Mate Poe
 *
 * This is a web browser front-end for Poe.
 *
 * @suppress {duplicate}
 */
const Poe = {
	/** @private {number} */
	_flags: PoeFlag.MakeNoise,

	/** @private {string} */
	_image: '',

	/** @private {!Object<symbol, !PoeMateState>} */
	_mates: {},

	/**
	 * We need to store the mousemove event handler so we can detach it
	 * if Poe is stopped.
	 *
	 * @private {?Function}
	 */
	_mousemove: null,



	// -----------------------------------------------------------------
	// Getters
	// -----------------------------------------------------------------

	/**
	 * Get Audio Enabled
	 *
	 * @return {boolean} True/false.
	 */
	get audio() {
		return !! (PoeFlag.MakeNoise & Poe._flags);
	},

	/**
	 * Get Speed
	 *
	 * @return {number} Speed.
	 */
	get speed() {
		return Universe.speed;
	},



	// -----------------------------------------------------------------
	// Setters
	// -----------------------------------------------------------------

	/**
	 * Set Audio Enabled
	 *
	 * @param {boolean} v True/false.
	 * @return {void} Nothing.
	 */
	set audio(v) {
		// Turn it on.
		if (v) {
			Poe._flags |= PoeFlag.MakeNoise;
		}
		// Turn it off.
		else {
			Poe._flags &= ~PoeFlag.MakeNoise;
		}
	},

	/**
	 * Set Animation
	 *
	 * @param {number} v Animation ID.
	 * @return {void} Nothing.
	 */
	set animation(v) {
		Universe.animation = v;
	},

	/**
	 * Set Speed
	 *
	 * @param {number} v Speed.
	 * @return {void} Nothing.
	 */
	set speed(v) {
		Universe.speed = v;
	},



	// -----------------------------------------------------------------
	// State
	// -----------------------------------------------------------------

	/**
	 * Start!
	 *
	 * @return {!Promise} Promise.
	 */
	async start() {
		// Already initialized?
		if (PoeFlag.Initialized & Poe._flags) {
			return Promise.resolve();
		}

		// Set up the CSS.
		await Promise.all([
			Poe.initCss(),
			Poe.initImage(),
			Poe.initEvents(),
		]);

		// Set the width and height.
		Poe.initUniverseSize();

		Universe.start();
		requestAnimationFrame(Poe.tick);

		return Promise.resolve();
	},

	/**
	 * Stop!
	 *
	 * @return {void} Nothing.
	 */
	stop() {
		Poe._flags &= ~PoeFlag.Initialized;

		// Stop the universe.
		Universe.stop();

		// DOM cleanup.

		/** @const {?Element} */
		const style = document.getElementById('css-mate-poe');
		if (style) {
			URL.revokeObjectURL(style.href);
			style.parentNode.removeChild(style);
		}

		/** @const {!Array<symbol>} */
		const mateKeys = /** @type {!Array<symbol>} */ (Object.getOwnPropertySymbols(Poe._mates));

		// Loop and destroy mates.
		for (let i = 0; i < mateKeys.length; ++i) {
			/** @const {symbol} */
			const key = mateKeys[i];

			// Detach events first.
			if (null !== Poe._mates[key].events) {
				/** @const {!Array<string>} */
				const eventKeys = Object.keys(Poe._mates[key].events);
				for (let j = 0; j < eventKeys.length; ++j) {
					Poe._mates[key].el.removeEventListener(
						eventKeys[j],
						Poe._mates[key].events[eventKeys[j]]
					);

					delete Poe._mates[key].events[eventKeys[j]];
				}

				delete Poe._mates[key].events;
				Poe._mates[key].events = null;
			}

			// Remove the elements.
			Poe._mates[key].el.removeChild(Poe._mates[key].img);
			delete Poe._mates[key].img;
			Poe._mates[key].el.parentNode.removeChild(Poe._mates[key].el);
			delete Poe._mates[key].el;

			// Remove the entry!
			delete Poe._mates[key];
		}

		delete Poe._mates;
		Poe._mates = {};

		// Unbind global events.
		window.removeEventListener('resize', Poe.resize);
		document.documentElement.removeEventListener('mouseup',	Poe.dragEnd);
		if (null !== Poe._mousemove) {
			document.documentElement.removeEventListener('mousemove', Poe._mousemove);
			delete Poe._mousemove;
			Poe._mousemove = null;
		}

		// Free image.
		URL.revokeObjectURL(Poe._image);
		Poe._image = '';
	},

	/**
	 * Init CSS
	 *
	 * @return {!Promise} Promise.
	 */
	async initCss() {
		// If the styles are already in the document, we're done.
		if (document.getElementById('css-mate-poe')) {
			return Promise.resolve();
		}

		/** @const {!Element} */
		const style = document.createElement('LINK');
		style.id = 'css-mate-poe';
		style.rel = 'stylesheet';

		/** @const {!Promise} */
		const stylePromise = new Promise((resolve, reject) => {
			style.onload = resolve;
			style.onerror = reject;
		});

		// Set the URL.
		style.href = CssUrl;
		(document.head || document.body).appendChild(style);

		return stylePromise;
	},

	/**
	 * Init Events
	 *
	 * Bind some event handlers on first load.
	 *
	 * @return {!Promise} Promise.
	 */
	async initEvents() {
		// Listen for resizes.
		window.addEventListener('resize', Poe.resize, { passive: true });

		// A few drag handlers.
		Poe._mousemove = /** @type {(function(Event))} */ ((e) => Poe.drag(e));
		document.documentElement.addEventListener(
			'mousemove',
			Poe._mousemove,
			{ passive: true }
		);

		document.documentElement.addEventListener(
			'mouseup',
			Poe.dragEnd,
			{ passive: true }
		);

		return Promise.resolve();
	},

	/**
	 * Init Image
	 *
	 * This is a complicated operation because it might need to generate
	 * a 2x image for proper HD support (CSS resizing techniques make
	 * pixelated images like Poe very blurry).
	 *
	 * @return {!Promise} Promise.
	 */
	async initImage() {
		// We don't need anything fancy for standard resolution screens.
		if (1 === window.devicePixelRatio) {
			Poe._image = URL.createObjectURL(base64toBlob(ImgSprite, 'image/png'));
			return Promise.resolve();
		}

		/** @const {!HTMLCanvasElement} */
		const canvas = /** @type {!HTMLCanvasElement} */ (document.createElement('CANVAS'));
		canvas.width = 2 * SpriteInfo.Width;
		canvas.height = 2 * SpriteInfo.Height;

		/** @const {!CanvasRenderingContext2D} */
		const ctx = /** @type {!CanvasRenderingContext2D} */ (canvas.getContext('2d'));
		ctx.imageSmoothingEnabled = false;

		/** @const {!Image} */
		const image = new Image();

		/** @const {!Promise} */
		const imagePromise = new Promise((resolve, reject) => {
			image.onload = resolve;
			image.onerror = reject;
		});

		// Load the image.
		image.src = 'data:image/png;base64,' + ImgSprite;
		await imagePromise;

		// Draw it.
		ctx.drawImage(image, 0, 0, 2 * SpriteInfo.Width, 2 * SpriteInfo.Height);

		// Get the blob.
		Poe._image = URL.createObjectURL(await new Promise((resolve) => {
			canvas.toBlob(blob => resolve(blob));
		}));

		return Promise.resolve();
	},

	/**
	 * Init Universe Dimensions
	 *
	 * @return {void} Nothing.
	 */
	initUniverseSize() {
		// Height is easy.
		Universe.height = parseInt(window.innerHeight, 10) || 0;

		// We might want to tweak the width to account for the scrollbar
		// that Javascript can't natively discover.

		/** @type {number} */
		let width = parseInt(window.innerWidth, 10) || 0;

		if ('undefined' !== typeof document.documentElement) {
			/** @const {number} */
			const dWidth = parseInt(document.documentElement.offsetWidth, 10) || 0;

			// If the document is *slightly* narrower than the screen,
			// we'll assume it is a scrollbar and set the Universe to
			// that value.
			if (dWidth < width && dWidth + 25 >= width) {
				width = dWidth;
			}
		}

		Universe.width = width;
	},



	// -----------------------------------------------------------------
	// Playback
	// -----------------------------------------------------------------

	/**
	 * Tick
	 *
	 * @param {number} now Now.
	 * @return {void} Nothing.
	 */
	tick(now) {
		Universe.tick(now, false);
		Poe.paint();
		requestAnimationFrame(Poe.tick);
	},

	/**
	 * Paint
	 *
	 * @return {void} Nothing.
	 */
	paint() {
		/** @const {!Array<!MateState>} */
		const state = Universe.state();

		// Nothing?
		if (! state.length) {
			// Do we think we have mates?
			if (Object.getOwnPropertySymbols(Poe._mates).length) {
				Poe.stop();
			}

			return;
		}

		// Loop the state to get everything painted.
		for (let i = 0; i < state.length; ++i) {
			// A new mate?
			if ('undefined' === typeof Poe._mates[state[i].id]) {
				// Set up a default state.
				Poe._mates[state[i].id] = /** @type {!PoeMateState} */ ({
					primary: !! (MateFlag.Primary & state[i].flags),
					events: null,
					el: /** @type {!HTMLDivElement} */ (document.createElement('DIV')),
					img: new Image(),
					elClass: '',
					elTransform: '',
					imgClass: '',
					sound: Sound.None,
				});

				// Set up element properties.
				Poe._mates[state[i].id].el.className = 'poe is-disabled';
				Poe._mates[state[i].id].el.setAttribute('aria-hidden', 'true');

				Poe._mates[state[i].id].img.src = Poe._image;
				Poe._mates[state[i].id].img.alt = LogMsg.Name;
				Poe._mates[state[i].id].img.className = 'poe-img';

				// Hook it up.
				Poe._mates[state[i].id].el.appendChild(Poe._mates[state[i].id].img);
				document.body.appendChild(Poe._mates[state[i].id].el);

				// Primary have some events.
				if (Poe._mates[state[i].id].primary) {
					/* eslint-disable quote-props */
					Poe._mates[state[i].id].events = {};
					Poe._mates[state[i].id].events['contextmenu'] = (/** @type {!Event} */ e) => { e.preventDefault(); };
					Poe._mates[state[i].id].events['mousedown'] = (/** @type {!MouseEvent} */ e) => {
						if (
							(1 === e.buttons) &&
							(0 === e.button) &&
							! Universe.isDragging()
						) {
							Universe.dragStart();
						}
					};
					Poe._mates[state[i].id].events['dblclick'] = Poe.stop;
					/* eslint-enable quote-props */

					Poe._mates[state[i].id].el.addEventListener(
						'contextmenu',
						Poe._mates[state[i].id].events['contextmenu']
					);
					Poe._mates[state[i].id].el.addEventListener(
						'mousedown',
						Poe._mates[state[i].id].events['mousedown'],
						{ passive: true }
					);
					Poe._mates[state[i].id].el.addEventListener(
						'dblclick',
						Poe._mates[state[i].id].events['dblclick'],
						{ once: true }
					);
				}
			}

			// Element class.

			/** @type {string} */
			let value = 'poe';

			if (! Poe._mates[state[i].id].primary) {
				value += ' is-child';
			}

			if (MateFlag.Disabled & state[i].flags) {
				value += ' is-disabled';
			}
			else if (MateFlag.Dragging & state[i].flags) {
				value += ' is-dragging';
			}
			else if (MateFlag.Background & state[i].flags) {
				value += ' is-behind';
			}

			// Update it!
			if (value !== Poe._mates[state[i].id].elClass) {
				Poe._mates[state[i].id].elClass = value;
				Poe._mates[state[i].id].el.className = value;
			}

			// Now the element transform.

			// Move it?
			if (state[i].x || state[i].y) {
				value = `translate3d(${state[i].x}px, ${state[i].y}px, 0)`;
				if (MateFlag.FlippedX & state[i].flags) {
					value += ' rotateY(180deg)';
				}
			}
			else if (MateFlag.FlippedX & state[i].flags) {
				value = 'rotateY(180deg)';
			}
			else {
				value = '';
			}

			// Update it!
			if (value !== Poe._mates[state[i].id].elTransform) {
				Poe._mates[state[i].id].elTransform = value;
				Poe._mates[state[i].id].el.style.transform = value;
			}

			// And the image.
			value = `poe-img poe-f${state[i].frame}`;
			if (value !== Poe._mates[state[i].id].imgClass) {
				Poe._mates[state[i].id].imgClass = value;
				Poe._mates[state[i].id].img.className = value;
			}

			// Lastly, play a sound.
			if (
				Sound.None !== state[i].sound &&
				state[i].sound !== Poe._mates[state[i].id].sound &&
				(PoeFlag.MakeNoise & Poe._flags)
			) {
				Poe._mates[state[i].id].sound = state[i].sound;
				Poe.playSound(state[i].sound);
			}
			else if (Sound.None === state[i].sound) {
				Poe._mates[state[i].id].sound = Sound.None;
			}
		}
	},

	/**
	 * Play Sound
	 *
	 * @param {!Sound} v Sound.
	 * @return {void} Nothing.
	 */
	playSound(v) {
		/** @type {string} */
		let file = '';

		switch (v) {
		case Sound.Baa:
			file = SndBaaUrl;
			break;

		case Sound.Sneeze:
			file = SndSneezeUrl;
			break;

		case Sound.Yawn:
			file = SndYawnUrl;
			break;

		// Not a valid option!
		default:
			return;
		}

		/** @const {!Audio} */
		const audio = new Audio(file);
		audio.play().catch(() => {
			// Warn about audio playback issues, but only once.
			if (! (PoeFlag.AudioWarned & Poe._flags)) {
				Poe._flags |= PoeFlag.AudioWarned;

				Universe.log(
					LogMsg.WarnAudio,
					LogKind.Warning
				);
			}
		});
	},



	// -----------------------------------------------------------------
	// Events
	// -----------------------------------------------------------------

	/**
	 * Resize
	 *
	 * @return {void} Nothing.
	 */
	resize() {
		// Employ a bit of lazy throttling. RAF combined with the
		// passive listener state is sufficient to keep it under
		// control.
		requestAnimationFrame(() => {
			Poe.initUniverseSize();
			Universe.resize();
			Poe.paint();
		});
	},

	/**
	 * Drag
	 *
	 * @param {!MouseEvent} e Event.
	 * @return {void} Nothing.
	 */
	drag(e) {
		if (Universe.isDragging()) {
			Universe.drag(new Position(
				(parseFloat(e.clientX) || 0) - Universe.tileSize / 2,
				(parseFloat(e.clientY) || 0) - Universe.tileSize / 2
			));
		}
	},

	/**
	 * Drag End
	 *
	 * @return {void} Nothing.
	 */
	dragEnd() {
		if (Universe.isDragging()) {
			Universe.dragEnd();
		}
	},
};



// -----------------------------------------------------------------
// Exports
// -----------------------------------------------------------------

window['Poe'] = Poe;
window['Poe']['animation'] = Poe.animation;
window['Poe']['audio'] = Poe.audio;
window['Poe']['speed'] = Poe.speed;
window['Poe']['start'] = Poe.start;
window['Poe']['stop'] = Poe.stop;
