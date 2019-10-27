/**
 * @file Tests: Choice List.
 */

/* global assert */
/* global describe */
/* global it */
import {
	AnimationList,
	ChoiceList,
	Playlist,
	Universe
} from '../src/js/core.mjs';



(function() {
	let list = new ChoiceList([
		[Playlist.Walk, 5],
		[Playlist.Doze, 1],
		[Playlist.Eat, 1],
		[Playlist.Rotate, 1],
		[Playlist.Run, 1],
		[Playlist.Spin, 1],
	]);

	// Random needs to be defined.
	Universe.random = function(max) {
		return Math.floor(Math.random() * max);
	};

	describe('ChoiceList', () => {
		let test = new Set();
		for (let i = 0; 20 > i; ++i) {
			test.add(list.choose());
		}

		// After 20 runs we should have at least two random selections.
		it('Random choices', () => assert.isAbove(test.size, 1));

		// And all of the entries should be animations.
		for (let i of test) {
			it('Valid choice', () => {
				assert.isNumber(i);
				assert.isObject(AnimationList[i - 1]);
			});
		}
	});
})();
