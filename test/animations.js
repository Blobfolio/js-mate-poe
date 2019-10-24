/**
 * @file Tests: Animations.
 */

/* global assert */
/* global describe */
/* global it */
import {
	AnimationFlag,
	AnimationList,
	ChoiceList,
	DefaultList,
	EntranceList,
	FirstList,
	Playlist,
	SceneList
} from '../src/js/core.mjs';



(function() {
	// Keep track of cross-references.
	let reachable = new Set([Playlist.Drag]);
	let defaults = new Set([...DefaultList]);
	let entrances = new Set([...EntranceList]);
	let firsts = new Set([...FirstList]);



	// Start by looping the main animation list.
	for (let i = 0; i < AnimationList.length; ++i) {
		describe(`Animation #${i}`, () => {
			// Take a look at the general structure. It should be fine,
			// but Closure Compiler sometimes ignores deep type checks.
			it('id is defined', () =>
				assert.isNumber(AnimationList[i].id) &&
				assert.strictEqual(AnimationList[i].id - 1, i)
			);
			it('name is defined', () =>
				assert.isString(AnimationList[i].name) &&
				assert.isAbove(AnimationList[i].name.length, 0)
			);
			it('scenes are defined', () =>
				assert.isObject(AnimationList[i].scenes) &&
				assert.isTrue(AnimationList[i].scenes instanceof SceneList)
			);
			it('flags are defined', () =>
				assert.isNumber(AnimationList[i].flags) &&
				assert.isAtLeast(AnimationList[i].flags, 0)
			);
			it('childId is defined', () =>
				assert.isTrue('undefined' !== AnimationList[i].childId) &&
				(
					assert.isNull(AnimationList[i].childId) ||
					assert.isNumber(AnimationList[i].childId)
				)
			);
			it('edge is defined', () =>
				assert.isTrue('undefined' !== AnimationList[i].edge) &&
				(
					assert.isNull(AnimationList[i].edge) ||
					assert.isNumber(AnimationList[i].edge) ||
					assert.isTrue(AnimationList[i].edge instanceof ChoiceList)
				)
			);
			it('next is defined', () =>
				assert.isTrue('undefined' !== AnimationList[i].next) &&
				(
					assert.isNull(AnimationList[i].next) ||
					assert.isNumber(AnimationList[i].next) ||
					assert.isTrue(AnimationList[i].next instanceof ChoiceList)
				)
			);

			// Check cross references with lists.
			it('default cross reference checks', () => {
				assert.strictEqual(
					!! (AnimationFlag.DefaultChoice & AnimationList[i].flags),
					defaults.has(AnimationList[i].id)
				);
			});

			it('entrance cross reference checks', () => {
				assert.strictEqual(
					!! (AnimationFlag.EntranceChoice & AnimationList[i].flags),
					entrances.has(AnimationList[i].id)
				);
			});

			it('first cross reference checks', () => {
				assert.strictEqual(
					!! (AnimationFlag.FirstChoice & AnimationList[i].flags),
					firsts.has(AnimationList[i].id)
				);
			});

			// Set reachability.
			if (AnimationFlag.DefaultChoice & AnimationList[i].flags) {
				reachable.add(AnimationList[i].id);
			}
			else if (AnimationFlag.EntranceChoice & AnimationList[i].flags) {
				reachable.add(AnimationList[i].id);
			}
			else if (AnimationFlag.FirstChoice & AnimationList[i].flags) {
				reachable.add(AnimationList[i].id);
			}
		});
	}

	// Re-check defaults, etc., to ensure their members are cross-flagged.
	describe('Default, etc., Flag Cross-References', () => {
		for (let i of defaults.entries()) {
			it('default flag set', () =>
				assert.isAbove((AnimationFlag.DefaultChoice & AnimationList[i[0] - 1].flags), 0)
			);
		}
		for (let i of entrances.entries()) {
			it('entrance flag set', () =>
				assert.isAbove((AnimationFlag.EntranceChoice & AnimationList[i[0] - 1].flags), 0)
			);
		}
		for (let i of firsts.entries()) {
			it('first flag set', () =>
				assert.isAbove((AnimationFlag.FirstChoice & AnimationList[i[0] - 1].flags), 0)
			);
		}
	});

	// Every animation should be reachable.
	describe('Default, etc., Flag Cross-References', () => {
		// Before we get started, let's add the links from all reachable
		// animations to the master list of reachability.
		for (let i of reachable.entries()) {
			if (null !== AnimationList[i[0] - 1].childId) {
				reachable.add(AnimationList[i[0] - 1].childId);
			}

			if ('number' === typeof AnimationList[i[0] - 1].edge) {
				reachable.add(AnimationList[i[0] - 1].edge);
			}
			else if (null !== AnimationList[i[0] - 1].edge) {
				let tmp = [...AnimationList[i[0] - 1].edge];
				for (let i = 0; i < tmp.length; ++i) {
					reachable.add(tmp[i]);
				}
			}

			if ('number' === typeof AnimationList[i[0] - 1].next) {
				reachable.add(AnimationList[i[0] - 1].next);
			}
			else if (null !== AnimationList[i[0] - 1].next) {
				let tmp = [...AnimationList[i[0] - 1].next];
				for (let i = 0; i < tmp.length; ++i) {
					reachable.add(tmp[i]);
				}
			}
		}

		// Loop again to make sure the animations exist.
		for (let i of reachable.entries()) {
			it(`animination #${i} is reachable`, () =>
				assert.isTrue('undefined' !== typeof AnimationList[i[0] - 1])
			);
		}
	});
})();
