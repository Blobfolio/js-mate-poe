/**
 * @file Choices
 */

/* global Generator */
/* global Iterable */
import {
	Choice,
	LogKind,
	LogMsg,
	Playlist,
	Universe
} from '../core.mjs';



/**
 * Choices
 *
 * A weighted list of choices from which a random value can be selected.
 *
 * @implements {Iterable}
 */
export const ChoiceList = class {
	/**
	 * Constructor
	 *
	 * @param {!Array<!Choice>} choices Choices.
	 */
	constructor(choices) {
		/**
		 * Full Choices List
		 *
		 * @private {!Array<!Choice>}
		 */
		this._pool = choices;

		/**
		 * Total Weight
		 *
		 * @private {number}
		 */
		this._total = 1;

		// Let's go ahead and figure out the total.
		for (let i = 0; i < this._pool.length; ++i) {
			this._total += this._pool[i][1];
		}
	}

	/**
	 * Choose
	 *
	 * @return {!Playlist} Choice.
	 */
	choose() {
		/** @const {number} */
		const threshold = Universe.random(this._total);

		/** @type {number} */
		let total = 0;
		for (let i = 0; i < this._pool.length; ++i) {
			total += this._pool[i][1];
			if (total >= threshold) {
				return this._pool[i][0];
			}
		}

		// This shouldn't happen.
		Universe.log(LogMsg.ErrorNoChoice, LogKind.Warning);
		return Playlist.None;
	}

	/**
	 * Get Raw
	 *
	 * @return {!Array<!Choice>} Choices.
	 */
	get raw() {
		return this._pool;
	}

	/**
	 * Iterator
	 *
	 * @return {!Generator} Generator.
	 */
	/* eslint-disable-next-line jsdoc/require-returns-check */
	*[Symbol.iterator]() {
		for (let i = 0; i < this._pool.length; ++i) {
			yield this._pool[i][0];
		}
	}
};
