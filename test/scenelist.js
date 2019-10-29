/**
 * @file Tests: Scene List.
 */

/* global assert */
/* global describe */
/* global it */
import {
	FrameList,
	Position,
	SceneFlag,
	SceneList,
	Sound,
	Universe
} from '../src/js/core.mjs';



(function() {
	// Set up the universe.
	Universe.random = function(max) {
		return Math.floor(Math.random() * max);
	};
	Universe.width = 1024;
	Universe.height = 768;

	describe('Basic Scene', () => {
		// Give us a scene.
		let scene = new SceneList([
			{
				start: null,
				move: new Position(-84, 0),
				duration: 6300,
				frames: new FrameList(
					[
						2,
						3,
					],
					1,
					0
				),
				sound: null,
				flags: SceneFlag.Gravity,
			},
			() => ({
				start: null,
				move: new Position(-84, 0),
				duration: 6300,
				frames: new FrameList(
					[
						2,
						3,
					],
					1,
					1
				),
				sound: null,
				flags: SceneFlag.Gravity,
			}),
			{
				start: null,
				move: new Position(-10, 0),
				duration: 200,
				frames: new FrameList(
					[
						2,
						3,
					],
					0,
					0
				),
				sound: [Sound.Baa, 1],
				flags: SceneFlag.FlipXAfter | SceneFlag.Gravity,
			},
		]);

		it('frame', () =>
			assert.strictEqual(scene.frame, 2)
		);

		let steps = scene.steps();
		let step1 = steps.next();
		let length = 1;
		let last = null;
		/* eslint-disable-next-line */
		while (true) {
			++length;
			last = steps.next();
			if (last.done) {
				break;
			}
		}

		it('Step #1: Done', () => assert.isFalse(step1.done));
		it('Step #1: Value', () => assert.isObject(step1.value));
		it('Step #1: Step', () => assert.strictEqual(step1.value.step, 0));
		it('Step #1: Scene', () => assert.strictEqual(step1.value.scene, 0));
		it('Step #1: Start', () => assert.isNull(step1.value.start));
		it('Step #1: Interval', () => assert.strictEqual(step1.value.interval, 1575));
		it('Step #1: Frame', () => assert.strictEqual(step1.value.frame, 2));
		it('Step #1: X', () => assert.strictEqual(step1.value.move.x, -21));
		it('Step #1: Y', () => assert.strictEqual(step1.value.move.y, 0));
		it('Step #1: Sound', () => assert.strictEqual(step1.value.sound, Sound.None));
		it('Step #1: Flip', () => assert.strictEqual(SceneFlag.FlipX & step1.value.flags, 0));
		it('Step #1: Flags', () => assert.strictEqual(step1.value.flags, SceneFlag.Gravity));

		it('Step #9: Done', () => assert.isTrue(last.done));
		it('Step #9: Value', () => assert.isObject(last.value));
		it('Step #9: Step', () => assert.strictEqual(last.value.step, 8));
		it('Step #9: Scene', () => assert.strictEqual(last.value.scene, 2));
		it('Step #9: Start', () => assert.isNull(last.value.start));
		it('Step #9: Interval', () => assert.strictEqual(last.value.interval, 100));
		it('Step #9: Frame', () => assert.strictEqual(last.value.frame, 3));
		it('Step #9: X', () => assert.strictEqual(last.value.move.x, -5));
		it('Step #9: Y', () => assert.strictEqual(last.value.move.y, 0));
		it('Step #9: Sound', () => assert.strictEqual(last.value.sound, Sound.Baa));
		it('Step #9: Flip', () => assert.strictEqual(SceneFlag.FlipX & last.value.flags, SceneFlag.FlipX));
		it('Step #9: Flags', () => assert.strictEqual(last.value.flags, SceneFlag.FlipX | SceneFlag.FlipXAfter | SceneFlag.Gravity));

		it('Step length', () => assert.strictEqual(length, 9));
	});
})();
