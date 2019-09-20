/**
 * @file Animation unit tests.
 */

/* global describe */
/* global it */
/* global require */
import { ANIMATIONS, DRAGGING_ANIMATION, MAX_ANIMATION } from '../src/js/_animations.mjs';
import { audioFile } from '../src/js/_audio.mjs';
import { TILES_X, TILES_Y } from '../src/js/_image.mjs';
import { MateAnimationPossibility } from '../src/js/_types.mjs';
const assert = require('chai').assert;



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
let reachable = new Set([DRAGGING_ANIMATION]);

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
				0 < ANIMATIONS[i].defaultChoice ||
				0 < ANIMATIONS[i].offscreenChoice ||
				0 < ANIMATIONS[i].startupChoice
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

			// Check the frames.
			/** @type {number} */
			const framesLength = ANIMATIONS[i].frames.length;

			for (let j = 0; j < framesLength; ++j) {
				it(
					`Frame #${ANIMATIONS[i].frames[j]} is valid`,
					() => assert.isNumber(ANIMATIONS[i].frames[j]) &&
						assert.isAtLeast(ANIMATIONS[i].frames[j], minFrame) &&
						assert.isAtMost(ANIMATIONS[i].frames[j], maxFrame)
				);
			}

			// Check the audio.
			if (null !== ANIMATIONS[i].audio) {
				it(
					'Audio is specified',
					() => assert.isString(ANIMATIONS[i].audio.file)
				);

				it(
					`Audio ${ANIMATIONS[i].audio.file} is valid`,
					() => assert.isString(audioFile(ANIMATIONS[i].audio.file)) &&
						assert.isOk(audioFile(ANIMATIONS[i].audio.file))
				);
			}
			else {
				it(
					'Audio is not specified',
					() => assert.isNull(ANIMATIONS[i].audio)
				);
			}

			// Dynamic callbacks almost always rely on window size, which Node doesn't understand. From here on, we'll only test non-callback values.
			if (
				null !== ANIMATIONS[i].startFrom &&
				'function' !== typeof ANIMATIONS[i].startFrom
			) {
				it(
					'StartFrom is specified',
					() => assert.isObject(ANIMATIONS[i].startFrom) &&
						assert.isNumber(ANIMATIONS[i].startFrom.x) &&
						assert.isNumber(ANIMATIONS[i].startFrom.y)
				);
			}

			testState('Start', ANIMATIONS[i].start);
			testState('End', ANIMATIONS[i].end);

			// Repeat and repeatFrom can be looked at together.
			if ('function' !== typeof ANIMATIONS[i].repeat) {
				it(
					'Repeat is specified',
					() => assert.isNumber(ANIMATIONS[i].repeat) &&
						assert.isAtLeast(ANIMATIONS[i].repeat, 0)
				);

				if (ANIMATIONS[i].repeat) {
					it(
						'RepeatFrom is specified',
						() => assert.isNumber(ANIMATIONS[i].repeatFrom) &&
							assert.isAtLeast(ANIMATIONS[i].repeatFrom, 0)
					);
				}
				else {
					it(
						'Repeat is specified',
						() => assert.strictEqual(0, ANIMATIONS[i].repeatFrom)
					);
				}
			}
			// If we can't test repeat, we can at least assert repeatFrom is not negative.
			else {
				it(
					'RepeatFrom is specified',
					() => assert.isNumber(ANIMATIONS[i].repeatFrom) &&
						assert.isAtLeast(ANIMATIONS[i].repeatFrom, 0)
				);
			}

			it(
				'AllowExit is specified',
				() => assert.isBoolean(ANIMATIONS[i].allowExit)
			);

			it(
				'AutoFlip is specified',
				() => assert.isBoolean(ANIMATIONS[i].autoFlip)
			);

			it(
				'DefautChoice is specified',
				() => assert.isNumber(ANIMATIONS[i].defaultChoice) &&
					assert.isAtLeast(ANIMATIONS[i].defaultChoice, 0)
			);

			it(
				'ForceGravity is specified',
				() => assert.isBoolean(ANIMATIONS[i].forceGravity)
			);

			it(
				'OffscreenChoice is specified',
				() => assert.isNumber(ANIMATIONS[i].offscreenChoice) &&
					assert.isAtLeast(ANIMATIONS[i].offscreenChoice, 0)
			);

			it(
				'IgnoreEdges is specified',
				() => assert.isBoolean(ANIMATIONS[i].ignoreEdges)
			);

			it(
				'StartupChoice is specified',
				() => assert.isNumber(ANIMATIONS[i].startupChoice) &&
					assert.isAtLeast(ANIMATIONS[i].startupChoice, 0)
			);
		});
	}
});

// Make sure we don't have any orphaned animations.
describe('Animation Reachability', () => {
	for (let i = 0; i < MAX_ANIMATION; ++i) {
		it(
			`Animation #${i + 1} is reachable.`,
			() => assert.isTrue(reachable.has(i + 1))
		);
	}
});
