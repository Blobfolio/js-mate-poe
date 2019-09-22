/**
 * @file Animation unit tests.
 */

/* global describe */
/* global it */
/* global require */
import { ANIMATIONS, FLAGS, PLAYLIST, MAX_ANIMATION } from '../src/js/_animations.mjs';
import { TILES_X, TILES_Y } from '../src/js/_image.mjs';
import { MateAnimationPossibility, RawMateAnimationScene, RawMateAnimation } from '../src/js/_types.mjs';
const assert = require('chai').assert;



/**
 * Child animations.
 *
 * We are purposefully looking for child IDs using a different method than the main Poe program so we can check sanity between the two.
 *
 * @const {Set<number>}
 */
const CHILD_ANIMATIONS = ANIMATIONS.reduce(
	/**
	 * Collect Animations
	 *
	 * @param {Set<number>} out Collection.
	 * @param {RawMateAnimation} v Animation.
	 * @return {Set<number>} Collection.
	 */
	(out, v) => {
		// Direct children are always children.
		if (0 < v.childId) {
			out.add(v.childId);
		}

		// Most children have the string "(Child)" in their name. This is less resource-intensive to look for than recursing through all the possible next/edge animations of direct children.
		if (-1 !== v.name.indexOf('(Child)')) {
			out.add(v.id);
		}

		return out;
	},
	new Set()
);

/**
 * Standardize Next/Edge Choices
 *
 * @param {(null|number|Array<(number|!MateAnimationPossibility)>)} choices Choices.
 * @return {?Array} Choices.
 */
const standardizeChoices = function(choices) {
	if ('number' === typeof choices) {
		return [choices];
	}

	/** @type {Array} */
	let out = [];

	if (null !== choices && Array.isArray(choices)) {
		/** @type {number} */
		const length = choices.length;

		for (let i = 0; i < length; ++i) {
			if ('number' === typeof choices[i]) {
				out.push(choices[i]);
			}
			else if ('number' === typeof choices[i].id) {
				out.push(choices[i].id);
			}
		}
	}

	return out.length ? out : null;
};

/**
 * Test Choices
 *
 * @param {string} label Label.
 * @param {?Array} choices Choices.
 * @return {void} Nothing.
 */
const testChoices = function(label, choices) {
	let clean = standardizeChoices(choices);

	if (null !== clean) {
		/** @type {number} */
		const unique = new Set(clean);

		/** @type {number} */
		const length = clean.length;

		// Make sure the set and array lengths match.
		it(
			`${label} is duplicate-free`,
			() => assert.strictEqual(unique.size, length)
		);

		// Test each path.
		for (let j = 0; j < length; ++j) {
			testId(label, clean[j]);

			// Note that we can get here.
			reachable.add(clean[j]);
		}
	}
	else {
		it(
			`${label} is not specified`,
			() => assert.isNull(choices)
		);
	}
};

/**
 * Test ID
 *
 * @param {string} label Label.
 * @param {number} v Value.
 * @return {void} Nothing.
 */
const testId = function(label, v) {
	// Verify the ID, although it should be there.
	it(
		`${label} ID #${v} is valid`,
		() => assert.isNumber(v) &&
			assert.isAbove(v, 0) &&
			assert.isAtMost(v, MAX_ANIMATION)
	);
};

/**
 * Test Start/End State
 *
 * @param {string} label Label.
 * @param {(number|Function|Object)} v Value.
 * @return {void} Nothing.
 */
const testState = function(label, v) {
	if ('function' !== typeof v) {
		if ('number' === typeof v) {
			it(
				`${label} is specified`,
				() => assert.isNumber(v) &&
					assert.isAtLeast(v, 1)
			);
		}
		else {
			it(
				`${label} is specified`,
				() => assert.isObject(v) &&
					assert.isNumber(v.x) &&
					assert.isNumber(v.y) &&
					assert.isNumber(v.speed) &&
					assert.isAtLeast(v.speed, 1)
			);
		}
	}
};



// Keep track of reachable animations.
/** @type {Set} */
let reachable = new Set([PLAYLIST.Drag]);

/** @type {number} */
const minFrame = 0;

/** @type {number} */
const maxFrame = TILES_X * TILES_Y - 1;



// Test it in a loop!
describe('Animation Pathways', () => {
	// Run through the animations to validate pathways, etc.
	for (let i = 0; i < MAX_ANIMATION; ++i) {
		// The tests are organized by name, so let's check that first.
		if ('string' !== typeof ANIMATIONS[i].name) {
			assert.fail('Missing animation name');
			continue;
		}

		// Look at everything!
		describe(ANIMATIONS[i].name, () => {
			testId('Main', ANIMATIONS[i].id);
			it(
				'ID is in correct position.',
				() => assert.strictEqual(i + 1, ANIMATIONS[i].id)
			);

			// If this is a default, startup, or offscreen animation, it is directly reachable.
			if (
				0 < ANIMATIONS[i].useDefault ||
				0 < ANIMATIONS[i].useEntrance ||
				0 < ANIMATIONS[i].useFirst
			) {
				reachable.add(ANIMATIONS[i].id);
			}

			// Verify the child ID.
			if (0 < ANIMATIONS[i].childId) {
				testId('Child', ANIMATIONS[i].childId);

				// Children are implicitly reachable.
				reachable.add(ANIMATIONS[i].childId);
			}

			testChoices('Next', ANIMATIONS[i].next);
			testChoices('Edge', ANIMATIONS[i].edge);

			it(
				'Scene is defined',
				() => assert.isArray(ANIMATIONS[i].scene) &&
					assert.isAbove(ANIMATIONS[i].scene.length, 0)
			);

			for (let j = 0; j < ANIMATIONS[i].scene.length; ++j) {
				/** @type {RawMateAnimationScene} */
				const scene = ANIMATIONS[i].scene[j];

				// Dynamic callbacks almost always rely on window size, which Node doesn't understand. From here on, we'll only test non-callback values.
				if (
					null !== scene.startFrom &&
					'function' !== typeof scene.startFrom
				) {
					it(
						'StartFrom is specified',
						() => assert.isObject(scene.startFrom) &&
							assert.isNumber(scene.startFrom.x) &&
							assert.isNumber(scene.startFrom.y)
					);
				}

				// Check the frames.
				/** @type {number} */
				const framesLength = scene.frames.length;

				for (let k = 0; k < framesLength; ++k) {
					it(
						`Frame #${scene.frames[k]} is valid`,
						() => assert.isNumber(scene.frames[k]) &&
							assert.isAtLeast(scene.frames[k], minFrame) &&
							assert.isAtMost(scene.frames[k], maxFrame)
					);
				}

				// Check the audio.
				if (null !== scene.audio) {
					it(
						'Audio is specified',
						() => assert.isString(scene.audio.file)
					);

					it(
						`Audio ${scene.audio.file} is valid`,
						() => assert.include(['BAA', 'SNEEZE', 'YAWN'], scene.audio.file)
					);
				}
				else {
					it(
						'Audio is not specified',
						() => assert.isNull(scene.audio)
					);
				}

				testState('Start', scene.start);
				testState('End', scene.end);

				// Repeat and repeatFrom can be looked at together.
				if ('function' !== typeof scene.repeat) {
					it(
						'Repeat is specified',
						() => assert.isNumber(scene.repeat) &&
							assert.isAtLeast(scene.repeat, 0)
					);

					if (scene.repeat) {
						it(
							'RepeatFrom is specified',
							() => assert.isNumber(scene.repeatFrom) &&
								assert.isAtLeast(scene.repeatFrom, 0)
						);
					}
					else {
						it(
							'Repeat is specified',
							() => assert.strictEqual(0, scene.repeatFrom)
						);
					}
				}
				// If we can't test repeat, we can at least assert repeatFrom is not negative.
				else {
					it(
						'RepeatFrom is specified',
						() => assert.isNumber(scene.repeatFrom) &&
							assert.isAtLeast(scene.repeatFrom, 0)
					);
				}

				it(
					'Flags are specified',
					() => assert.isNumber(scene.flags)
				);
			}

			it(
				'Flags are specified',
				() => assert.isNumber(ANIMATIONS[i].flags)
			);

			it(
				'DefautChoice is specified',
				() => assert.isNumber(ANIMATIONS[i].useDefault) &&
					assert.isAtLeast(ANIMATIONS[i].useDefault, 0)
			);

			it(
				'OffscreenChoice is specified',
				() => assert.isNumber(ANIMATIONS[i].useEntrance) &&
					assert.isAtLeast(ANIMATIONS[i].useEntrance, 0)
			);

			it(
				'StartupChoice is specified',
				() => assert.isNumber(ANIMATIONS[i].useFirst) &&
					assert.isAtLeast(ANIMATIONS[i].useFirst, 0)
			);
		});
	}
});

// Make sure we don't have any orphaned animations.
describe('Animation Reachability', () => {
	for (let i = 0; i < MAX_ANIMATION; ++i) {
		it(
			`Animation #${i + 1} is reachable`,
			() => assert.isTrue(reachable.has(i + 1))
		);

		const isChild = CHILD_ANIMATIONS.has(i + 1);
		it(
			`Animation #${i + 1} has consistent privileges`,
			() => assert.strictEqual(
				! (FLAGS.noChildren & ANIMATIONS[i].flags),
				isChild
			) &&
				assert.strictEqual(
					!! (FLAGS.noParents & ANIMATIONS[i].flags),
					! isChild
				)
		);
	}
});
