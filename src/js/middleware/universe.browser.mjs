/**
 * @file Universe Window Overloads
 */

import {
	LogKind,
	Universe
} from '../core.mjs';



/**
 * Init Universe For Browser
 *
 * @return {void} Nothing.
 */
export const universeForBrowser = function() {
	/**
	 * Log
	 *
	 * Write a debug message, whatever that means.
	 *
	 * @param {string} msg Message.
	 * @param {!LogKind} type Type.
	 * @return {void} Nothing.
	 */
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

	/**
	 * Get Current Time
	 *
	 * This time is used for animation triggering, so while it doesn't
	 * need to be based on UTC or whatever, it must tick ever upward
	 * relative to itself.
	 *
	 * @return {number} Time.
	 */
	Universe.now = function() {
		return performance.now();
	};

	/**
	 * Get Random
	 *
	 * This should return a random value between 0 and the upper
	 * boundary, the latter being exclusive (will never exactly hit).
	 *
	 * @param {number} max Maximum bound.
	 * @return {number} Random.
	 */
	Universe.random = function(max) {
		return Math.floor(Math.random() * max);
	};

	/**
	 * Self Resize
	 *
	 * This is triggered by `Universe.start()` and `Universe.resize()`.
	 * Typically it should calculate and set the Universe's width and
	 * height according to the environment.
	 *
	 * @return {void} Nothing.
	 */
	Universe._resize = function() {
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
	};
};
