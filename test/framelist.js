/**
 * @file Tests: Frame List.
 */

/* global assert */
/* global describe */
/* global it */
import { FrameList } from '../src/js/core.mjs';



(function() {
	describe('Framelist', () => {
		// An example based on the Walk animation.
		it('Walk', () => {
			let test = new FrameList(
				[2, 3],
				10,
				0
			);

			assert.strictEqual(test.size, 22);

			let total = 0;
			let last = 0;
			for (let i of test) {
				total += i;

				// It should just alternate between frames.
				if (2 === last) {
					assert.strictEqual(i, 3);
				}
				else {
					assert.strictEqual(i, 2);
				}
				last = i;
			}

			// At the end of it we should have the right total.
			assert.strictEqual(total, 55);
		});

		// Test without repeat.
		it('No Repeats', () => {
			let test = new FrameList(
				[2, 3],
				0,
				0
			);

			assert.strictEqual(test.size, 2);

			let arr = [...test];
			assert.strictEqual(arr[0], 2);
			assert.strictEqual(arr[1], 3);
			assert.strictEqual(arr.length, 2);
		});

		// Test repeat from.
		it('No Repeats', () => {
			let test = new FrameList(
				[2, 3],
				2,
				1
			);

			assert.strictEqual(test.size, 4);

			let arr = [...test];
			assert.strictEqual(arr[0], 2);
			assert.strictEqual(arr[1], 3);
			assert.strictEqual(arr[2], 3);
			assert.strictEqual(arr[3], 3);
			assert.strictEqual(arr.length, 4);
		});
	});
})();
