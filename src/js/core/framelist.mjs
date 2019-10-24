/**
 * @file Frame List
 */

/* global Generator */
/* global Iterable */



/**
 * Frame List
 *
 * @implements {Iterable}
 */
export const FrameList = class {
	/**
	 * Constructor
	 *
	 * @param {!Array<number>} frames Frames.
	 * @param {number} repeat Repeat.
	 * @param {number} repeatFrom Repeat from.
	 */
	constructor(frames, repeat, repeatFrom) {
		/**
		 * Frames
		 *
		 * @private {!Array<number>}
		 */
		this._frames = frames;

		/**
		 * Repeat
		 *
		 * @private {number}
		 */
		this._repeat = parseInt(repeat, 10) || 0;
		if (0 > this._repeat) {
			this._repeat = 0;
		}

		/**
		 * Repeat From
		 *
		 * @private {number}
		 */
		this._repeatFrom = this._repeat ? parseInt(repeatFrom, 10) || 0 : 0;
		if (0 > this._repeatFrom) {
			this._repeatFrom = 0;
		}

		/**
		 * Size
		 *
		 * @private {number}
		 */
		this._size = this._frames.length + (this._frames.length - this._repeatFrom) * this._repeat;
	}



	// -----------------------------------------------------------------
	// Getters
	// -----------------------------------------------------------------

	/**
	 * Get Frame
	 *
	 * @param {number} index Index.
	 * @return {number} Frame.
	 */
	frame(index) {
		index = parseInt(index, 10) || 0;
		if (0 > index) {
			index = 0;
		}
		else if (this._size <= index) {
			index = this._size - 1;
		}

		if (this._frames.length > index) {
			return this._frames[index];
		}
		else if (! this._repeatFrom) {
			return this._frames[index % this._frames.length];
		}
		else {
			return this._frames[this._repeatFrom + (index - this._repeatFrom) % (this._frames.length - this._repeatFrom)];
		}
	}

	/**
	 * Get Frames
	 *
	 * @return {!Array<number>} Frames.
	 */
	get frames() {
		return this._frames;
	}

	/**
	 * Get Repeat
	 *
	 * @return {number} Repeat.
	 */
	get repeat() {
		return this._repeat;
	}

	/**
	 * Get Repeat From
	 *
	 * @return {number} Repeat From.
	 */
	get repeatFrom() {
		return this._repeatFrom;
	}

	/**
	 * Get Size
	 *
	 * @return {number} Size.
	 */
	get size() {
		return this._size;
	}

	/**
	 * Iterator
	 *
	 * @return {!Generator} Generator.
	 */
	/* eslint-disable-next-line jsdoc/require-returns-check */
	*[Symbol.iterator]() {
		for (let i = 0; i < this.size; ++i) {
			yield this.frame(i);
		}
	}
};
