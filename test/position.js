/**
 * @file Tests: Position.
 */

/* global assert */
/* global describe */
/* global it */
import {
	Direction,
	Position
} from '../src/js/core.mjs';



(function() {
	let pos = new Position(0, 0);
	let pos2 = new Position(2, 4);

	describe('Position', () => {
		it('initialization', () =>
			assert.strictEqual(pos.x, 0) &&
			assert.strictEqual(pos.y, 0) &&
			assert.strictEqual(pos.xDir, Direction.None) &&
			assert.strictEqual(pos.yDir, Direction.None) &&
			assert.strictEqual(pos2.x, 2) &&
			assert.strictEqual(pos2.y, 4) &&
			assert.strictEqual(pos2.xDir, Direction.None) &&
			assert.strictEqual(pos2.yDir, Direction.None)
		);

		it('move and flip', () => {
			// Try a basic move, but do it a couple times.
			pos.move(pos2, false);
			pos.move(pos2, false);

			assert.strictEqual(pos.x, 4) &&
			assert.strictEqual(pos.y, 8) &&
			assert.strictEqual(pos.xDir, Direction.Right) &&
			assert.strictEqual(pos.yDir, Direction.Down);

			// Flip an X coordinate.
			pos2.flipX();

			assert.strictEqual(pos2.x, -2) &&
			assert.strictEqual(pos2.y, 4);

			// Move again.
			pos.move(pos2, false);

			assert.strictEqual(pos.x, 2) &&
			assert.strictEqual(pos.y, 8) &&
			assert.strictEqual(pos.xDir, Direction.Left) &&
			assert.strictEqual(pos.yDir, Direction.Down);

			// Flip X back, Y on.
			pos2.flipX();
			pos2.flipY();

			assert.strictEqual(pos2.x, 2) &&
			assert.strictEqual(pos2.y, -4);

			// Test the move again.
			pos.move(pos2, false);

			assert.strictEqual(pos.x, 4) &&
			assert.strictEqual(pos.y, 4) &&
			assert.strictEqual(pos.xDir, Direction.Right) &&
			assert.strictEqual(pos.yDir, Direction.Up);

			// Try an absolute move.
			pos2.move(new Position(100, -500), true);

			assert.strictEqual(pos2.x, 100) &&
			assert.strictEqual(pos2.y, -500) &&
			assert.strictEqual(pos2.xDir, Direction.None) &&
			assert.strictEqual(pos2.yDir, Direction.None);
		});
	});
})();
