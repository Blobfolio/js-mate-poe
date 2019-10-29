/**
 * @file Tests: Mate.
 */

/* global assert */
/* global describe */
/* global it */
import {
	MateFlag,
	Playlist,
	Position,
	Sound,
	Universe
} from '../src/js/core.mjs';
import { universeForBrowser } from '../src/js/middleware/universe.browser.mjs';



(function() {
	universeForBrowser();

	// For testing purposes, let's hard-code the sizes.
	Universe._resize = function() {
		Universe._width = 1024;
		Universe._height = 768;
	};
	Universe._resize();

	// Let it run!
	describe('Universe Start', () => {
		it('Universe starts', () => {
			// Set a ground-level position so we can change to our test
			// animation.
			Universe.start();
			Universe._mates[0]._position.move(new Position(Universe.maxX, Universe.maxY), true);
			Universe.animation = Playlist.Walk;

			// Pull the state.
			let state = Universe.state();
			assert.isArray(state);
			assert.isObject(state[0]);
			assert.strictEqual(state[0].id, Universe._mates[0].id);
			assert.strictEqual(state[0].frame, 0);
			assert.strictEqual(state[0].sound, Sound.None);
			assert.strictEqual(state[0].x, Universe.maxX);
			assert.strictEqual(state[0].y, Universe.maxY);
			assert(
				(MateFlag.Primary === state[0].flags) ||
				((MateFlag.MayExit | MateFlag.Primary) === state[0].flags)
			);
		});

		it('Ticks', () => {
			Universe.tick(performance.now(), false);
			let state = Universe.state();
			assert.isArray(state);
			assert.isObject(state[0]);
			assert.strictEqual(state[0].id, Universe._mates[0].id);
			assert.strictEqual(state[0].frame, 2);
			assert.strictEqual(state[0].sound, Sound.None);
			assert.strictEqual(state[0].x, Universe.maxX - 2);
			assert.strictEqual(state[0].y, Universe.maxY);
			assert(
				(MateFlag.Primary === state[0].flags) ||
				((MateFlag.MayExit | MateFlag.Primary) === state[0].flags)
			);

			// Ticks for this animation (at this position) should not
			// affect the flags in any way.
			const flags = state[0].flags;

			// If we immediately tick again, nothing should change.
			Universe.tick(performance.now(), false);
			state = Universe.state();
			assert.isArray(state);
			assert.isObject(state[0]);
			assert.strictEqual(state[0].id, Universe._mates[0].id);
			assert.strictEqual(state[0].frame, 2);
			assert.strictEqual(state[0].sound, Sound.None);
			assert.strictEqual(state[0].x, Universe.maxX - 2);
			assert.strictEqual(state[0].y, Universe.maxY);
			assert.strictEqual(state[0].flags, flags);

			// But if we do it again with "force" it should.
			Universe.tick(performance.now(), true);
			state = Universe.state();
			assert.isArray(state);
			assert.isObject(state[0]);
			assert.strictEqual(state[0].id, Universe._mates[0].id);
			assert.strictEqual(state[0].frame, 3);
			assert.strictEqual(state[0].sound, Sound.None);
			assert.strictEqual(state[0].x, Universe.maxX - 4);
			assert.strictEqual(state[0].y, Universe.maxY);
			assert.strictEqual(state[0].flags, flags);
		});

		it('Universe stops', () => {
			Universe.stop();
			let state = Universe.state();
			assert.isArray(state);
			assert.isEmpty(state);
		});

		it('With child sprites', () => {
			// Set a ground-level position so we can change to our test
			// animation.
			Universe.start();
			Universe._mates[0]._position.move(new Position(Universe.maxX, Universe.maxY), true);
			Universe.animation = Playlist.Eat;

			// Tick tock.
			Universe.tick(performance.now(), true);
			let state = Universe.state();
			assert.isArray(state);
			assert.strictEqual(state.length, 2);

			// We don't have to check absolutely everything. Let's look
			// at flags and frames; that tells enough of a story.
			assert.strictEqual(state[0].id, Universe._mates[0].id);
			assert.strictEqual(state[0].frame, 6);
			assert.strictEqual(state[0].flags, MateFlag.Primary);

			assert.strictEqual(state[1].id, Universe._mates[1].id);
			assert.strictEqual(state[1].frame, 153);
			assert.strictEqual(state[1].flags, MateFlag.Secondary);

			// And we're done.
			Universe.stop();
		});
	});
})();
