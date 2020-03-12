/**
 * @file JS Mate Poe: Custom Element
 */

import {
	ImgSprite,
	SpriteInfo
} from '../core.mjs';
import { PoeCss } from './poe_css.mjs';
import { PoeFlag } from './poe_flag.mjs';



export class PoeCe extends HTMLElement {
	/**
	 * Constructor
	 */
	constructor() {
		super();

		this.attachShadow({
			mode: 'open',
		});

		/**
		 * Flags.
		 *
		 * @private {number}
		 */
		this._flags = 0;

		/**
		 * Frame.
		 *
		 * @private {number}
		 */
		this._frame = 0;

		/**
		 * X.
		 *
		 * @private {number}
		 */
		this._x = 0.0;

		/**
		 * Y.
		 *
		 * @private {number}
		 */
		this._y = 0.0;
	}

	/**
	 * Deconstruct
	 *
	 * @return {void} Nothing.
	 */
	deconstruct() {

	}

	/**
	 * Mounted Callback
	 *
	 * @return {void} Nothing.
	 */
	connectedCallback() {
		this.render();
	}

	/**
	 * Updated Callback
	 *
	 * @return {void} Nothing.
	 */
	attributeChangedCallback() {
		this.render();
	}

	/**
	 * Unmounted Callback
	 *
	 * @return {void} Nothing.
	 */
	disconnectedCallback() {
		this.deconstruct();
	}

	/**
	 * Get Classes
	 *
	 * @return {string} Classes.
	 */
	getWrapperClasses() {
		const classes = [];
		if (this._flags & PoeFlag.MateBackground) {
			classes.push('is-behind');
		}
		if (! (this._flags & PoeFlag.MatePrimary)) {
			classes.push('is-child');
		}
		if (! (this._flags & PoeFlag.MateEnabled)) {
			classes.push('is-disabled');
		}
		if (this._flags & PoeFlag.Dragging) {
			classes.push('is-dragging');
		}
		return classes.join(' ');
	}

	/**
	 * Get Styles
	 *
	 * @return {string} Styles.
	 */
	getWrapperStyles() {
		let transform = '';
		if (this._x || this._y) {
			transform = `translate3d(${this._x}px, ${this._y}px, 0)`;
			if (this._flags & PoeFlag.MateFlippedX) {
				transform += ' rotateY(180deg)';
			}
			if (this._flags & PoeFlag.MateFlippedY) {
				transform += ' rotateX(180deg)';
			}
		}
		else {
			if (this._flags & PoeFlag.MateFlippedX) {
				transform = 'rotateY(180deg)';
			}
			if (this._flags & PoeFlag.MateFlippedY) {
				transform = transform ? transform + ' ' : 'rotateX(180deg)';
			}
		}

		return transform;
	}

	/**
	 * Render
	 *
	 * @return {void} Nothing.
	 */
	render() {
		if (! this.isConnected) {
			this.deconstruct();
			return;
		}

		this.renderStyle();
		this.renderBody();
	}

	/**
	 * Render Style
	 *
	 * @return {void} Nothing.
	 */
	renderStyle() {
		// If it is already here, we're done.
		if (this.shadowRoot.getElementById('p-css')) {
			return;
		}

		const style = document.createElement('style');
		style.id = 'p-css';
		style.appendChild(document.createTextNode(PoeCss));
		this.shadowRoot.appendChild(style);
	}

	/**
	 * Render Body
	 *
	 * @return {void} Nothing.
	 */
	renderBody() {
		let wrapper;
		let img;

		// Make the body.
		if (! this.shadowRoot.getElementById('p')) {
			wrapper = document.createElement('div');
			wrapper.id = 'p';

			img = document.createElement('img');
			img.id = 'i';
			img.src = `data:image/png;base64,${ImgSprite}`;

			wrapper.appendChild(img);
			this.shadowRoot.appendChild(wrapper);

			// Upgrade the image source for dense displays.
			if (1 !== window.devicePixelRatio) {
				this.set2xSource();
			}
		}
		else {
			wrapper = this.shadowRoot.getElementById('p');
			img = this.shadowRoot.getElementById('i');
		}

		// Flags control all the classes.
		let classes = this.getWrapperClasses();
		if (classes !== (wrapper.className || '')) {
			if (classes) {
				wrapper.className = classes;
			}
			else if (wrapper.hasAttribute('class')) {
				wrapper.removeAttribute('class');
			}
		}

		// Move the image around.
		let transform = this.getWrapperStyles();
		if ((wrapper.style.transform || '') !== transform) {
			wrapper.style.transform = transform;
		}

		// Set the image class.
		classes = `f${this._frame}`;
		if (img.className !== classes) {
			img.className = classes;
		}
	}

	/**
	 * Set 2X Image Source
	 *
	 * @return {!Promise} Nothing.
	 */
	async set2xSource() {
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
		image.src = `data:image/png;base64,${ImgSprite}`;
		await imagePromise;

		// Draw it.
		ctx.drawImage(image, 0, 0, 2 * SpriteInfo.Width, 2 * SpriteInfo.Height);

		// Get the blob.
		this.shadowRoot.getElementById('i').src = URL.createObjectURL(await new Promise((resolve) => {
			canvas.toBlob(blob => resolve(blob));
		}));
	}

	/**
	 * Set State
	 *
	 * @param {!Object} state State.
	 * @return {boolean} True.
	 */
	set state(state) {
		let changed = false;

		if (this.setFlags(state.flags)) {
			changed = true;
		}
		if (this.setFrame(state.frame)) {
			changed = true;
		}
		if (this.setX(state.x)) {
			changed = true;
		}
		if (this.setY(state.y)) {
			changed = true;
		}

		if (changed) {
			this.render();
		}

		return true;
	}

	/**
	 * Set Flags
	 *
	 * @param {number} flags Flags.
	 * @return {boolean} True if changed.
	 */
	setFlags(flags) {
		flags = parseInt(flags, 10) || 0;
		if (flags !== this._flags) {
			this._flags = flags;
			return true;
		}

		return false;
	}

	/**
	 * Set Frame
	 *
	 * @param {number} frame Frame.
	 * @return {boolean} True if changed.
	 */
	setFrame(frame) {
		frame = parseInt(frame, 10) || 0;
		if (frame !== this._frame) {
			this._frame = frame;
			return true;
		}

		return false;
	}

	/**
	 * Set X
	 *
	 * @param {number} x X.
	 * @return {boolean} True if changed.
	 */
	setX(x) {
		x = parseFloat(x) || 0.0;
		if (x !== this._x) {
			this._x = x;
			return true;
		}

		return false;
	}

	/**
	 * Set Y
	 *
	 * @param {number} y Y.
	 * @return {boolean} True if changed.
	 */
	setY(y) {
		y = parseFloat(y) || 0.0;
		if (y !== this._y) {
			this._y = y;
			return true;
		}

		return false;
	}
}
