/**
 * @file Animation unit tests.
 */

/* global describe */
/* global it */
/* global require */
import { ANIMATIONS, DRAGGING_ANIMATION } from '../src/js/_animations.mjs';
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
			it(
				`${label} ID #${clean[j]} is valid`,
				() => assert.isTrue(keys.has(clean[j]))
			);

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

// All animation keys.
/** @type {Set} */
const keys = Object.keys(ANIMATIONS).reduce((out, v) => {
	out.add(parseInt(v, 10) || 0);
	return out;
}, new Set());

/** @type {number} */
const keysLength = keys.size;

// All animations.
/** @type {Array} */
const values = Object.values(ANIMATIONS);

/** @type {number} */
const valuesLength = values.length;

/** @type {number} */
const minFrame = 0;

/** @type {number} */
const maxFrame = TILES_X * TILES_Y - 1;



// Test it in a loop!
describe('Animation Pathways', () => {
	it(
		'Animation key count matches value count',
		() => assert.strictEqual(keysLength, valuesLength)
	);

	// Run through the animations to validate pathways, etc.
	for (let i = 0; i < valuesLength; ++i) {
		describe(values[i].name, () => {
			// There should be a name.
			it(
				'Name is specified',
				() => assert.isString(values[i].name)
			);

			// Verify the ID, although it should be there.
			it(
				`ID #${values[i].id} is valid`,
				() => assert.isTrue(keys.has(values[i].id))
			);

			// If this is a default, startup, or offscreen animation, it is directly reachable.
			if (
				0 < values[i].defaultChoice ||
				0 < values[i].offscreenChoice ||
				0 < values[i].startupChoice
			) {
				reachable.add(values[i].id);
			}

			// Verify the child ID.
			if (0 < values[i].childId) {
				it(
					`Child ID #${values[i].childId} is valid`,
					() => assert.isTrue(keys.has(values[i].childId))
				);

				// Children are implicitly reachable.
				reachable.add(values[i].childId);
			}

			testChoices('Next', values[i].next);
			testChoices('Edge', values[i].edge);

			// Check the frames.
			/** @type {number} */
			const framesLength = values[i].frames.length;

			for (let j = 0; j < framesLength; ++j) {
				it(
					`Frame #${values[i].frames[j]} is valid`,
					() => assert.isAtLeast(values[i].frames[j], minFrame) &&
						assert.isAtMost(values[i].frames[j], maxFrame)
				);
			}

			// Check the audio.
			if (null !== values[i].audio) {
				it(
					'Audio is specified',
					() => assert.isString(values[i].audio.file)
				);

				it(
					`Audio ${values[i].audio.file} is valid`,
					() => assert.isString(audioFile(values[i].audio.file)) &&
						assert.isOk(audioFile(values[i].audio.file))
				);
			}
			else {
				it(
					'Audio is not specified',
					() => assert.isNull(values[i].audio)
				);
			}

			// Dynamic callbacks almost always rely on window size, which Node doesn't understand. From here on, we'll only test non-callback values.
			if (
				null !== values[i].startFrom &&
				'function' !== typeof values[i].startFrom
			) {
				it(
					'StartFrom is specified',
					() => assert.isObject(values[i].startFrom) &&
						assert.isNumber(values[i].startFrom.x) &&
						assert.isNumber(values[i].startFrom.y)
				);
			}

			testState('Start', values[i].start);
			testState('End', values[i].end);

			// Repeat and repeatFrom can be looked at together.
			if ('function' !== typeof values[i].repeat) {
				it(
					'Repeat is specified',
					() => assert.isNumber(values[i].repeat) &&
						assert.isAtLeast(values[i].repeat, 0)
				);

				if (values[i].repeat) {
					it(
						'RepeatFrom is specified',
						() => assert.isNumber(values[i].repeatFrom) &&
							assert.isAtLeast(values[i].repeatFrom, 0)
					);
				}
				else {
					it(
						'Repeat is specified',
						() => assert.strictEqual(0, values[i].repeatFrom)
					);
				}
			}
			// If we can't test repeat, we can at least assert repeatFrom is not negative.
			else {
				it(
					'RepeatFrom is specified',
					() => assert.isNumber(values[i].repeatFrom) &&
						assert.isAtLeast(values[i].repeatFrom, 0)
				);
			}

			it(
				'AllowExit is specified',
				() => assert.isBoolean(values[i].allowExit)
			);

			it(
				'AutoFlip is specified',
				() => assert.isBoolean(values[i].autoFlip)
			);

			it(
				'DefautChoice is specified',
				() => assert.isNumber(values[i].defaultChoice) &&
					assert.isAtLeast(values[i].defaultChoice, 0)
			);

			it(
				'ForceGravity is specified',
				() => assert.isBoolean(values[i].forceGravity)
			);

			it(
				'OffscreenChoice is specified',
				() => assert.isNumber(values[i].offscreenChoice) &&
					assert.isAtLeast(values[i].offscreenChoice, 0)
			);

			it(
				'IgnoreEdges is specified',
				() => assert.isBoolean(values[i].ignoreEdges)
			);

			it(
				'StartupChoice is specified',
				() => assert.isNumber(values[i].startupChoice) &&
					assert.isAtLeast(values[i].startupChoice, 0)
			);
		});
	}
});

// Make sure we don't have any orphaned animations.
describe('Animation Reachability', () => {
	for (let i = 0; i < valuesLength; ++i) {
		it(
			`Animation #${values[i].id} is reachable.`,
			() => assert.isTrue(reachable.has(values[i].id))
		);
	}
});
