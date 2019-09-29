/**
 * @file Animation unit tests.
 */

/* global describe */
/* global it */
/* global require */
import { ANIMATIONS, MAX_ANIMATION_ID } from '../src/js/_animations.mjs';
import { isAnimation } from '../src/js/_helpers.mjs';
import { Playlist } from '../src/js/_types.mjs';
const assert = require('chai').assert;



// Keep track of reachable animations.
/** @type {Set<!Playlist>} */
let reachable = new Set([Playlist.Drag]);



describe('Animation Definitions', () => {
	// Run through the animations to validate pathways, etc.
	for (let i = 0; i < MAX_ANIMATION_ID; ++i) {
		it(
			`${ANIMATIONS[i].name} has a valid structure.`,
			() => assert.isTrue(isAnimation(ANIMATIONS[i]))
		);

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
