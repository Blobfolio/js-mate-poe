/**
 * @file JS Mate Poe: Custom Element
 */

import {
	ImgSprite,
	LogMsg,
	LogKind,
	MateFlag,
	MateState,
	Position,
	Sound,
	SpriteInfo,
	Universe
} from '../core.mjs';
import { universeForBrowser } from '../middleware/universe.browser.mjs';
import {
	SndBaaUrl,
	SndSneezeUrl,
	SndYawnUrl
} from '../middleware/assets.url.mjs';
import { PoeFlag } from './poe_flag.mjs';
import { PoeMateState } from './_poe_mate_state.mjs';
import { PoeCe } from './poe_ce.mjs';


// Set universe overloads.
universeForBrowser();



// ---------------------------------------------------------------------
// Public Interface
// ---------------------------------------------------------------------

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

	/** @private {!Object<symbol, !PoeMateState>} */
	_mates: {},

	/** @private {string} */
	_src: `data:image/png;base64,${ImgSprite}`,

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

	/**
	 * Get the Image Source
	 *
	 * @return {string} Source.
	 */
	get src() {
		return Poe._src;
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
			Poe.initEvents(),
			Poe.initImage(),
		]);

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
	 * We can produce a clearer sprite image for high-res displays using
	 * the canvas.
	 *
	 * @return {!Promise} Promise.
	 */
	async initImage() {
		if (1 !== window.devicePixelRatio && 0 === Poe._src.indexOf('data:')) {
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
			image.src = Poe._src;
			await imagePromise;

			// Draw it.
			ctx.drawImage(image, 0, 0, 2 * SpriteInfo.Width, 2 * SpriteInfo.Height);

			// Get the blob.
			Poe._src = URL.createObjectURL(await new Promise((resolve) => {
				canvas.toBlob(blob => resolve(blob));
			}));
		}

		return Promise.resolve();
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
					el: /** @type {!HTMLDivElement} */ (document.createElement('poe-ce')),
					sound: Sound.None,
				});

				// Set up element properties.
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

			// Element state.
			Poe._mates[state[i].id].el.state = this.paintProps(state[i]);

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
	 * Paint Props
	 *
	 * @param {!Object} state State.
	 * @return {!Object} Props.
	 */
	paintProps(state) {
		const props = {
			flags: 0,
			frame: state.frame,
			x: state.x,
			y: state.y,
		};

		if (Poe._mates[state.id].primary) {
			props.flags |= PoeFlag.MatePrimary;
		}
		if (! (MateFlag.Disabled & state.flags)) {
			props.flags |= PoeFlag.MateEnabled;
		}
		else if (MateFlag.Dragging & state.flags) {
			props.flags |= PoeFlag.Dragging;
		}
		else if (MateFlag.Background & state.flags) {
			props.flags |= PoeFlag.MateBackground;
		}
		if (MateFlag.FlippedX & state.flags) {
			props.flags |= PoeFlag.MateFlippedX;
		}
		if (MateFlag.FlippedY & state.flags) {
			props.flags |= PoeFlag.MateFlippedY;
		}

		return props;
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

// Register custom element.
customElements.define('poe-ce', PoeCe);
