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
	MaxPlaylist,
	Playlist,
	SceneList
} from '../src/js/core.mjs';



(function() {
	// Keep track of cross-references.
	let reachable = new Set([Playlist.Drag]);
	let defaults = new Set([...DefaultList]);
	let entrances = new Set([...EntranceList]);
	let firsts = new Set([...FirstList]);

	// The MaxPlaylist constant should match the number of animations.
	it('Playlist length', () => assert.strictEqual(AnimationList.length, MaxPlaylist));

	// Some animations have hard-coded behaviors; they must exist!
	it('Playlist.None exists', () => assert.strictEqual(Playlist.None, 0));
	it('Playlist.AbductionBeamChild exists', () => {
		assert.isNumber(Playlist.AbductionBeamChild);
		assert.isDefined(AnimationList[Playlist.AbductionBeamChild - 1]);
	});
	it('Playlist.AbductionChild exists', () => {
		assert.isNumber(Playlist.AbductionChild);
		assert.isDefined(AnimationList[Playlist.AbductionChild - 1]);
	});
	it('Playlist.ClimbDown exists', () => {
		assert.isNumber(Playlist.ClimbDown);
		assert.isDefined(AnimationList[Playlist.ClimbDown - 1]);
	});
	it('Playlist.ClimbUp exists', () => {
		assert.isNumber(Playlist.ClimbUp);
		assert.isDefined(AnimationList[Playlist.ClimbUp - 1]);
	});
	it('Playlist.Drag exists', () => {
		assert.isNumber(Playlist.Drag);
		assert.isDefined(AnimationList[Playlist.Drag - 1]);
	});
	it('Playlist.Fall exists', () => {
		assert.isNumber(Playlist.Fall);
		assert.isDefined(AnimationList[Playlist.Fall - 1]);
	});
	it('Playlist.FlowerChild exists', () => {
		assert.isNumber(Playlist.FlowerChild);
		assert.isDefined(AnimationList[Playlist.FlowerChild - 1]);
	});
	it('Playlist.SneezeShadow exists', () => {
		assert.isNumber(Playlist.SneezeShadow);
		assert.isDefined(AnimationList[Playlist.SneezeShadow - 1]);
	});
	it('Playlist.Walk exists', () => {
		assert.isNumber(Playlist.Walk);
		assert.isDefined(AnimationList[Playlist.Walk - 1]);
	});

	// Start by looping the main animation list.
	for (let i = 0; i < AnimationList.length; ++i) {
		describe(`Animation #${i}`, () => {
			// Take a look at the general structure. It should be fine,
			// but Closure Compiler sometimes ignores deep type checks.
			it('ID is defined', () =>
				assert.strictEqual(AnimationList[i].id - 1, i)
			);

			it('Name is defined', () => {
				assert.isString(AnimationList[i].name);
				assert.isAbove(AnimationList[i].name.length, 0);
			});

			it('Scenes are defined', () => assert.isTrue(AnimationList[i].scenes instanceof SceneList));

			it('Flags are defined', () => {
				assert.isNumber(AnimationList[i].flags);
				assert.isAtLeast(AnimationList[i].flags, 0);
			});

			it('ChildId is defined', () => {
				assert.isDefined(AnimationList[i].childId);
				assert(
					null === AnimationList[i].childId ||
					'number' === typeof AnimationList[i].childId
				);
			});

			it('Edge is defined', () => {
				assert.isDefined(AnimationList[i].edge);
				assert(
					null === AnimationList[i].edge ||
					'number' === typeof AnimationList[i].edge ||
					AnimationList[i].edge instanceof ChoiceList
				);
			});

			it('Next is defined', () => {
				assert.isDefined(AnimationList[i].next);
				assert(
					null === AnimationList[i].next ||
					'number' === typeof AnimationList[i].next ||
					AnimationList[i].next instanceof ChoiceList
				);
			});

			// Check cross references with lists.
			it('Default cross reference checks', () => assert.strictEqual(
				!! (AnimationFlag.DefaultChoice & AnimationList[i].flags),
				defaults.has(AnimationList[i].id)
			));

			it('Entrance cross reference checks', () => assert.strictEqual(
				!! (AnimationFlag.EntranceChoice & AnimationList[i].flags),
				entrances.has(AnimationList[i].id)
			));

			it('First cross reference checks', () => assert.strictEqual(
				!! (AnimationFlag.FirstChoice & AnimationList[i].flags),
				firsts.has(AnimationList[i].id)
			));

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
			it('Default flag set', () =>
				assert.isAbove((AnimationFlag.DefaultChoice & AnimationList[i[0] - 1].flags), 0)
			);
		}
		for (let i of entrances.entries()) {
			it('Entrance flag set', () =>
				assert.isAbove((AnimationFlag.EntranceChoice & AnimationList[i[0] - 1].flags), 0)
			);
		}
		for (let i of firsts.entries()) {
			it('First flag set', () =>
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
			it(`Animination #${i} is reachable`, () =>
				assert.isTrue('undefined' !== typeof AnimationList[i[0] - 1])
			);
		}
	});
})();
