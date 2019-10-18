/**
 * @file Tests: Animations.
 */

/* global assert */
/* global describe */
/* global it */
import {
	ANIMATIONS,
	DEFAULT_CHOICES,
	ENTRANCE_CHOICES,
	FIRST_CHOICES,
	MAX_ANIMATION_ID
} from '../src/js/_animations.mjs';
import { isAnimation } from '../src/js/_helpers.mjs';
import { AnimationFlag, Playlist } from '../src/js/_types.mjs';



// Keep track of reachable animations.
/** @type {Set<!Playlist>} */
let reachable = new Set([Playlist.Drag]);



describe('Animation Definitions', () => {
	// Rebuild choices as sets for easier management.
	let defaults = DEFAULT_CHOICES.reduce((out, v) => {
		out.add(v[0]);
		return out;
	}, new Set());

	let entrances = ENTRANCE_CHOICES.reduce((out, v) => {
		out.add(v[0]);
		return out;
	}, new Set());

	let firsts = FIRST_CHOICES.reduce((out, v) => {
		out.add(v[0]);
		return out;
	}, new Set());

	// Run through the animations to validate pathways, etc.
	for (let i = 0; i < MAX_ANIMATION_ID; ++i) {
		it(
			`${ANIMATIONS[i].name} has a valid structure.`,
			() => assert.isTrue(isAnimation(ANIMATIONS[i]))
		);

		it(
			`ID for ${ANIMATIONS[i].name} is in correct position.`,
			() => assert.strictEqual(i + 1, ANIMATIONS[i].id)
		);

		// Default choice.
		if (AnimationFlag.DefaultChoice & ANIMATIONS[i].flags) {
			it(
				`Default choice is set for ${ANIMATIONS[i].name}.`,
				() => assert.isTrue(defaults.has(ANIMATIONS[i].id))
			);
			reachable.add(ANIMATIONS[i].id);
		}

		// Entrance choice
		if (AnimationFlag.EntranceChoice & ANIMATIONS[i].flags) {
			it(
				`Entrance choice is set for ${ANIMATIONS[i].name}.`,
				() => assert.isTrue(entrances.has(ANIMATIONS[i].id))
			);
			reachable.add(ANIMATIONS[i].id);
		}

		// First choice
		if (AnimationFlag.FirstChoice & ANIMATIONS[i].flags) {
			it(
				`First choice is set for ${ANIMATIONS[i].name}.`,
				() => assert.isTrue(firsts.has(ANIMATIONS[i].id))
			);
			reachable.add(ANIMATIONS[i].id);
		}

		// Children are implicitly reachable.
		if (null !== ANIMATIONS[i].childId) {
			reachable.add(ANIMATIONS[i].childId);
		}

		// Add edges and nexts.
		for (let j of ['edge', 'next']) {
			if ('number' === typeof ANIMATIONS[i][j]) {
				reachable.add(ANIMATIONS[i][j]);
			}
			else if (null !== ANIMATIONS[i][j]) {
				for (let k = 0; k < ANIMATIONS[i][j].length; ++k) {
					reachable.add(ANIMATIONS[i][j][k][0]);
				}
			}
		}
	}

	// Test our defaults, etc., again from the other direction.
	defaults.forEach(v => {
		it(
			'Reverse default set.',
			() => assert.isFalse(! (AnimationFlag.DefaultChoice & ANIMATIONS[v - 1].flags))
		);
	});

	entrances.forEach(v => {
		it(
			'Reverse entrance set.',
			() => assert.isFalse(! (AnimationFlag.EntranceChoice & ANIMATIONS[v - 1].flags))
		);
	});

	firsts.forEach(v => {
		it(
			'Reverse first set.',
			() => assert.isFalse(! (AnimationFlag.FirstChoice & ANIMATIONS[v - 1].flags))
		);
	});
});

describe('Animation Reachability', () => {
	// Run through the animations to validate pathways, etc.
	for (let i = 0; i < MAX_ANIMATION_ID; ++i) {
		it(
			`${ANIMATIONS[i].name} is reachable.`,
			() => assert.isTrue(reachable.has(ANIMATIONS[i].id))
		);
	}
});
