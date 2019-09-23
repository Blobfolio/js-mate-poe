/**
 * @file The Demo!
 */

/* global Vue */
/* eslint-disable quote-props */
import { ANIMATIONS, standardizeMateAnimationState } from './_animations.mjs';
import { poeAnimation } from './_demo_poe_animation.mjs';
import { poeFrame } from './_demo_poe_frame.mjs';
import { poeIcon } from './_demo_poe_icon.mjs';
import { poeTree } from './_demo_poe_tree.mjs';
import { poeSprite } from './_demo_poe_sprite.mjs';
import { NAME, VERSION } from './_helpers.mjs';
import {
	FLAGS,
	MateAnimationPossibility,
	MateAnimationScene,
	RawMateAnimation,
	RawMateAnimationScene,
	VueApp
} from './_types.mjs';



// ---------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------

/** @type {boolean} */
let mounted = false;

/**
 * Standardize MateAnimationPossibility
 *
 * @param {(null|number|Array<(number|!MateAnimationPossibility)>)} v Value.
 * @return {?Array<MateAnimationPossibility>} Value.
 */
const standardizeMateAnimationPossibility = function(v) {
	if (null === v) {
		return null;
	}

	let out = [];

	if ('number' === typeof v) {
		out.push({
			weight: 1,
			id: v,
		});
	}
	else if (Array.isArray(v)) {
		const length = v.length;
		for (let i = 0; i < length; ++i) {
			if ('number' === typeof v[i]) {
				out.push({
					weight: 1,
					id: v[i],
				});
			}
			else if (
				'number' === typeof v[i].weight &&
				'number' === typeof v[i].id &&
				0 < v[i].weight &&
				0 < v[i].id
			) {
				out.push({
					weight: v[i].weight,
					id: v[i].id,
				});
			}
		}
	}

	if (! out.length) {
		return null;
	}

	return out;
};

/**
 * Standardize MateAnimationScene
 *
 * @param {Array<RawMateAnimationScene>} scenes Scenes.
 * @return {Array<MateAnimationScene>} Scenes.
 */
export const standardizeMateAnimationScene = function(scenes) {
	/** @type {Array<MateAnimationScene>} */
	let out = [];

	/** @type {number} */
	const length = scenes.length;

	for (let i = 0; i < length; ++i) {
		const v = /** @type {!RawMateAnimationScene} */ (scenes[i]);

		out.push(/** @type {!MateAnimationScene} */ ({
			'startFrom': ('function' === typeof v.startFrom ? v.startFrom() : v.startFrom),
			'start': standardizeMateAnimationState(v.start),
			'end': standardizeMateAnimationState(v.end),
			'repeat': ('function' === typeof v.repeat ? v.repeat() : v.repeat),
			'repeatFrom': v.repeatFrom,
			'frames': v.frames,
			'audio': v.audio,
			'flags': v.flags,
		}));
	}

	return out;
};


// ---------------------------------------------------------------------
// Vue!
// ---------------------------------------------------------------------

// Register components.
Vue.component('poe-animation', poeAnimation);
Vue.component('poe-frame', poeFrame);
Vue.component('poe-icon', poeIcon);
Vue.component('poe-sprite', poeSprite);
Vue.component('poe-tree', poeTree);

// Get Vue going!
new Vue(/** @type {!VueApp} */ ({
	/** @type {string} */
	'el': '#app',

	/** @type {Object} */
	'data': {
		'name': NAME,
		'version': VERSION,

		'animations': ANIMATIONS.reduce(
			/**
			 * Collection
			 *
			 * @param {Array} out Collection.
			 * @param {RawMateAnimation} v Animation.
			 * @return {Array} Collection.
			 */
			(out, v) => {
				// Test variable duration before we set the info.

				/** @type {number} */
				const sceneLength = v.scene.length;

				/** @type {boolean} */
				let variableDuration = false;
				for (let i = 0; i < sceneLength; ++i) {
					if ('function' === typeof v.scene[i].repeat) {
						variableDuration = true;
						break;
					}
				}

				out.push({
					/** @type {number} */
					'id': v.id,
					/** @type {string} */
					'name': v.name,
					/** @type {boolean} */
					'variableDuration': variableDuration,
					/** @type {Array<MateAnimationScene>} */
					'scene': standardizeMateAnimationScene(v.scene),
					/** @type {number} */
					'useDefault': v.useDefault,
					/** @type {number} */
					'useEntrance': v.useEntrance,
					/** @type {number} */
					'useFirst': v.useFirst,
					/** @type {number} */
					'flags': v.flags,
					/** @type {number} */
					'childId': v.childId,
					/** @type {?Array<MateAnimationPossibility>} */
					'edge': standardizeMateAnimationPossibility(v.edge),
					/** @type {?Array<MateAnimationPossibility>} */
					'next': standardizeMateAnimationPossibility(v.next),
				});

				return out;
			},
			[]
		)
			.sort((a, b) => {
				let a_key = `${(FLAGS.demoPlay & a['flags']) ? '0_' : '1_'}${a['name']}`;
				let b_key = `${(FLAGS.demoPlay & b['flags']) ? '0_' : '1_'}${b['name']}`;

				return (a_key < b_key) ? -1 : 1;
			}),

		'immersive': false,

		'tab': 'animations',
		'tabs': [
			{
				'id': 'animations',
				'name': 'Animations',
			},
			{
				'id': 'sprite',
				'name': 'Sprite',
			},
		],
	},

	/**
	 * Mounted
	 *
	 * @return {void} Nothing.
	 */
	'mounted': function() {
		if (! mounted) {
			mounted = false;
		}
	},

	/** @type {Object} */
	'methods': {
		/**
		 * Change Immersion
		 *
		 * @param {boolean} status Status.
		 * @return {void} Nothing.
		 */
		'immersiveToggle': function(status) {
			this['immersive'] = !! status;
			document.body.classList.toggle('is-immersive', this['immersive']);

			if (this['immersive']) {
				this['tab'] = 'immersive';
			}
			else {
				this['tab'] = 'animations';
			}
		},

		/**
		 * Play Animation
		 *
		 * @param {number} id ID.
		 * @return {void} Nothing.
		 */
		'playAnimation': function(id) {
			window['Poe']['setAnimation'](id);
		},

		/**
		 * Summary
		 *
		 * @param {number} id ID.
		 * @return {(Object|boolean)} Summary or false.
		 */
		'summary': function(id) {
			if (undefined !== this['summaries'][id]) {
				return this['summaries'][id];
			}

			return false;
		},

		/**
		 * Change Tab
		 *
		 * @param {string} tab Tab.
		 * @return {void} Nothing.
		 */
		'tabToggle': function(tab) {
			this['tab'] = tab;
		},
	},

	/** @type {Object} */
	'computed': {
		/**
		 * Summaries
		 *
		 * @return {Object} Summaries.
		 */
		'summaries': function() {
			return this['animations'].reduce((out, v) => {
				out[v['id']] = {
					'id': v['id'],
					'name': v['name'],
					'frame': v['scene'][0]['frames'][0],
				};

				return out;
			}, {});
		},
	},
}));
