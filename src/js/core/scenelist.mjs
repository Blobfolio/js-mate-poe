/**
 * @file Scene List
 *
 * @todo Unit Tests.
 */

/* global Generator */
import {
	easeOut,
	Position,
	Scene,
	SceneCb,
	SceneFlag,
	Sound,
	SpriteInfo,
	Step
} from '../core.mjs';



/**
 * Scenes
 */
export const SceneList = class {
	/**
	 * Constructor
	 *
	 * @param {!Array<(!Scene|!SceneCb)>} scenes Scenes.
	 */
	constructor(scenes) {
		/**
		 * Full Scene List
		 *
		 * @private {!Array<(!Scene|!SceneCb)>}
		 */
		this._scenes = scenes;
	}

	/**
	 * Frame
	 *
	 * The first paintable frame for the animation.
	 *
	 * @return {number} Frame.
	 */
	get frame() {
		/** @const {!Scene} */
		const scene = 'function' === typeof this._scenes[0] ? /** @type {!SceneCb} */ (this._scenes[0])() : /** @type {!Scene} */ (this._scenes[0]);

		for (let i of scene.frames) {
			if (SpriteInfo.EmptyTile > i) {
				return i;
			}
		}

		return /** @type {number} */ (SpriteInfo.EmptyTile);
	}

	/**
	 * Resolve
	 *
	 * Scenes might require dynamic inputs, causing them to vary from
	 * instance to instance. This runs those functions, if any, so that
	 * we can have a consistent list of Scene entries.
	 *
	 * @return {!Array<!Scene>} Scenes.
	 */
	resolve() {
		/** @type {!Array<!Scene>} */
		let out = new Array(this._scenes.length);

		// Loop through the list, pushing the static or dynamic scene.
		for (let i = 0; i < this._scenes.length; ++i) {
			if ('function' === typeof this._scenes[i]) {
				out[i] = /** @type {!SceneCb} */ (this._scenes[i])();
			}
			else {
				out[i] = /** @type {!Scene} */ (this._scenes[i]);
			}
		}

		return out;
	}

	/**
	 * Get Steps (Generator)
	 *
	 * @return {Generator} Generator.
	 */
	*steps() {
		/** @type {number} */
		let step = 0;

		/** @const {!Array<!Scene>} */
		const scenes = this.resolve();

		// Loop through each scene.
		for (let i = 0; i < scenes.length; ++i) {
			/** @const {number} */
			const stepsLength = scenes[i].frames.size;

			/** @type {?Array<number>} */
			let xMovement = null;
			let yMovement = null;

			// Pull eased movements if necessary.
			if (null !== scenes[i].move) {
				if (SceneFlag.EaseOut & scenes[i].flags) {
					xMovement = this.stepEasing(stepsLength, scenes[i].move.x, SceneFlag.EaseOut);
					yMovement = this.stepEasing(stepsLength, scenes[i].move.y, SceneFlag.EaseOut);
				}
				else if (SceneFlag.EaseIn & scenes[i].flags) {
					xMovement = this.stepEasing(stepsLength, scenes[i].move.x, SceneFlag.EaseIn);
					yMovement = this.stepEasing(stepsLength, scenes[i].move.y, SceneFlag.EaseIn);
				}
				else {
					xMovement = this.stepEasing(stepsLength, scenes[i].move.x, 0);
					yMovement = this.stepEasing(stepsLength, scenes[i].move.y, 0);
				}
			}

			/** @const {number} */
			const durationSlice = 1 / stepsLength * scenes[i].duration;

			// Now that we know how many steps this scene has, let's build them!
			for (let j = 0; j < stepsLength; ++j) {
				/** @type {!Sound} */
				let sound = Sound.None;
				if (null !== scenes[i].sound && scenes[i].sound[1] === j) {
					sound = /** @type {!Sound} */ (scenes[i].sound[0]);
				}

				/** @type {?Position} */
				let position = null;
				if (null !== xMovement || null !== yMovement) {
					position = new Position(
						null !== xMovement ? xMovement[j] : 0,
						null !== yMovement ? yMovement[j] : 0
					);
				}

				/** @const {!Step} */
				const out = /** @type {!Step} */ ({
					step: step,
					scene: i,
					start: 0 === j ? scenes[i].start : null,
					interval: durationSlice,
					frame: scenes[i].frames.frame(j),
					move: position,
					sound: sound,
					flip: !! ((SceneFlag.FlipAfter & scenes[i].flags) && stepsLength - 1 === j),
					flags: scenes[i].flags,
				});
				++step;

				// Keep going!
				if (i + 1 < scenes.length || j + 1 < stepsLength) {
					yield out;
				}
				else {
					return out;
				}
			}
		}
	}

	/**
	 * Step Easings
	 *
	 * Rather than straight easing, we need to cap lower bounds to a
	 * sane value (moving a sprite .000001px isn't helpful). This makes
	 * the code rather ugly, but thankfully we only have to run it once
	 * per scene.
	 *
	 * @param {number} steps Total number of steps.
	 * @param {number} total Total movement to make.
	 * @param {number|!SceneFlag} easing Easing.
	 * @return {Array<number>} Progress pool.
	 */
	stepEasing(steps, total, easing) {
		/** @type {Array} */
		let out = new Array(steps);

		// If there is no total, we can just return a bunch of zeroes.
		if (! total) {
			out.fill(0);
			return out;
		}

		// If there is no easing, we can save a lot of work.
		if (SceneFlag.EaseOut !== easing && SceneFlag.EaseIn !== easing) {
			out.fill(1 / steps * total);
			return out;
		}

		/**
		 * Sane Lower Bound
		 *
		 * If Poe is set to move at all, he'll go at least this far.
		 *
		 * @const {number}
		 */
		const cap = 0.5;

		/** @type {number} */
		let last = 0;

		/** @type {number} */
		let newTotal = 0;

		/** @const {boolean} */
		const positive = 0 <= total;

		/** @type {number} */
		let maxBig = 0;

		// Loop to calculate the raw easings.
		for (let i = 1; i <= steps; ++i) {
			let current = Math.floor(easeOut(i / steps) * total * 100) / 100 - last;
			if (positive) {
				if (cap > current) {
					current = cap;
				}
				else {
					maxBig = i;
				}
			}
			else if (0 - cap < current) {
				current = 0 - cap;
			}
			else {
				maxBig = i;
			}

			out[i - 1] = current;
			last += current;
			newTotal += current;
		}

		// If our capping changed the total, we need to loop again to
		// spread the difference between the larger steps.
		if (
			(positive && newTotal > total) ||
			(! positive && newTotal < total)
		) {
			/** @type {number} */
			let difference = newTotal - total;

			/** @type {number} */
			let pool = 0;
			for (let i = 0; i < maxBig; ++i) {
				pool += out[i];
			}

			// Loop again to spread the difference among the largest
			// steps.
			for (let i = 0; i < maxBig; ++i) {
				/** @const {number} */
				const chunk = (out[i] / pool) * difference;
				out[i] -= chunk;
				difference -= chunk;

				// If we're out of difference, we're done!
				if (! difference) {
					break;
				}
			}

			// Count up the totals again.
			newTotal = 0;
			for (let i = 0; i < out.length; ++i) {
				newTotal += out[i];
			}

			// If we're still off, it is probably a precision error. We
			// can just subtract the pennies from the first entry.
			if (
				(positive && newTotal > total) ||
				(! positive && newTotal < total)
			) {
				out[0] -= (newTotal - total);
			}
		}

		// If we're easing in, we need to flip the array.
		if (SceneFlag.EaseIn === easing) {
			out.reverse();
		}

		return out;
	}
};
