/**
 * @file JS Mate Poe: Custom Element
 */

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
	 * Render
	 *
	 * @return {void} Nothing.
	 */
	render() {
		if (this.isConnected) {
			this.renderStyle();
			this.renderBody();
		}
	}

	/**
	 * Render Style
	 *
	 * @return {void} Nothing.
	 */
	renderStyle() {
		// If it is already here, we're done.
		if (! this.shadowRoot.getElementById('p-css')) {
			const style = document.createElement('style');
			style.id = 'p-css';
			style.appendChild(document.createTextNode(PoeCss));
			this.shadowRoot.appendChild(style);
		}
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
			img.src = window['Poe'].src;

			wrapper.appendChild(img);
			this.shadowRoot.appendChild(wrapper);
		}
		else {
			wrapper = this.shadowRoot.getElementById('p');
			img = this.shadowRoot.getElementById('i');
		}

		// Flags control all the classes.
		let classes = '';
		if (this._flags & PoeFlag.MateBackground) {
			classes += ' is-behind';
		}
		if (! (this._flags & PoeFlag.MatePrimary)) {
			classes += ' is-child';
		}
		if (! (this._flags & PoeFlag.MateEnabled)) {
			classes += ' is-disabled';
		}
		if (this._flags & PoeFlag.Dragging) {
			classes += ' is-dragging';
		}
		classes = classes.trim();
		if (classes !== (wrapper.className || '')) {
			if (classes) {
				wrapper.className = classes;
			}
			else if (wrapper.hasAttribute('class')) {
				wrapper.removeAttribute('class');
			}
		}

		// Move the image around.
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
		if ((wrapper.style.transform || '') !== transform) {
			wrapper.style.transform = transform;
		}

		// Set the image class.
		classes = `f${this._frame}`;
		if ((img.className || '') !== classes) {
			img.className = classes;
		}
	}

	/**
	 * Set State
	 *
	 * @param {!Object} state State.
	 * @return {boolean} True.
	 */
	set state(state) {
		let changed = false;

		state.flags = parseInt(state.flags, 10) || 0;
		if (state.flags !== this._flags) {
			this._flags = state.flags;
			changed = true;
		}

		state.frame = parseInt(state.frame, 10) || 0;
		if (state.frame !== this._frame) {
			this._frame = state.frame;
			changed = true;
		}

		state.x = parseFloat(state.x) || 0.0;
		if (state.x !== this._x) {
			this._x = state.x;
			changed = true;
		}

		state.y = parseFloat(state.y) || 0.0;
		if (state.y !== this._y) {
			this._y = state.y;
			changed = true;
		}

		if (changed) {
			this.render();
		}

		return true;
	}
}
