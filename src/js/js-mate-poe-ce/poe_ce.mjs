/**
 * @file JS Mate Poe: Custom Element
 */

import { ImgSprite } from '../core.mjs';
import { PoeCss } from './poe_css.mjs';
import { PoeFlag } from './poe_flag.mjs';



export class PoeCe extends HTMLElement {
	/**
	 * Watched Attributes.
	 *
	 * @return {!Array} Attributes.
	 */
	static get observedAttributes() {
		return ['flags', 'frame', 'x', 'y'];
	}

	/**
	 * Constructor
	 */
	constructor() {
		super();

		this.attachShadow({
			mode: 'open',
		});
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
			img.id = 'p-img';
			img.src = `data:image/png;base64,${ImgSprite}`;

			wrapper.appendChild(img);
			this.shadowRoot.appendChild(wrapper);
		}
		else {
			wrapper = this.shadowRoot.getElementById('p');
			img = this.shadowRoot.getElementById('p-img');
		}

		// Calculate style shit here.
		const flagsN = parseInt(this.getAttribute('flags') || 0, 10) || 0;
		const frameN = parseInt(this.getAttribute('frame') || 0, 10) || 0;
		const xN = parseFloat(this.getAttribute('x') || 0.0) || 0.0;
		const yN = parseFloat(this.getAttribute('y') || 0.0) || 0.0;

		// Flags control all the classes.
		let classes = [];
		if (flagsN & PoeFlag.MateBackground) {
			classes.push('is-behind');
		}
		if (! (flagsN & PoeFlag.MatePrimary)) {
			classes.push('is-child');
		}
		if (! (flagsN & PoeFlag.MateEnabled)) {
			classes.push('is-disabled');
		}
		if (flagsN & PoeFlag.Dragging) {
			classes.push('is-dragging');
		}
		classes = classes.join(' ');
		if (classes !== wrapper.className) {
			wrapper.className = classes;
		}

		// Move the image around.
		let transform = '';
		if (xN || yN) {
			transform = `translate3d(${xN}px, ${yN}px, 0)`;
			if (flagsN & PoeFlag.MateFlippedX) {
				transform += ' rotateY(180deg)';
			}
			if (flagsN & PoeFlag.MateFlippedY) {
				transform += ' rotateX(180deg)';
			}
		}
		else {
			if (flagsN & PoeFlag.MateFlippedX) {
				transform = 'rotateY(180deg)';
			}
			if (flagsN & PoeFlag.MateFlippedY) {
				transform += ' rotateX(180deg)';
				transform = transform.trim();
			}
		}

		if (wrapper.style.transform !== transform) {
			wrapper.style.transform = transform;
		}

		// Set the image class.
		classes = `f${frameN}`;
		if (img.className !== classes) {
			img.className = classes;
		}
	}
}
