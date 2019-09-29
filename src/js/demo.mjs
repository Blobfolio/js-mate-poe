/**
 * @file The Demo!
 */

/* global Vue */
/* eslint-disable quote-props */
import { NAME, VERSION } from './_about.mjs';
import { ANIMATIONS } from './_animations.mjs';
import { demoResolveScenes, standardizeChoices } from './_helpers.mjs';
import { poeAnimation } from './_demo_poe_animation.mjs';
import { poeFrame } from './_demo_poe_frame.mjs';
import { poeIcon } from './_demo_poe_icon.mjs';
import { poeTree } from './_demo_poe_tree.mjs';
import { poeSprite } from './_demo_poe_sprite.mjs';
import {
	Animation,
	Flags,
	Playlist,
	Scene,
	WeightedChoice,
	VueApp
} from './_types.mjs';



// ---------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------

/** @type {boolean} */
let mounted = false;



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
			 * @param {Animation} v Animation.
			 * @return {Array} Collection.
			 */
			(out, v) => {
				// Test variable duration before we set the info.

				/** @type {number} */
				let flags = v.flags;
				for (let i = 0; i < v.scenes.length; ++i) {
					if ('function' === typeof v.scenes[i].repeat) {
						flags |= Flags.VariableDuration;
						break;
					}
				}

				if (0 < v.useDefault) {
					flags |= Flags.DefaultChoice;
				}
				if (0 < v.useEntrance) {
					flags |= Flags.EntranceChoice;
				}
				if (0 < v.useFirst) {
					flags |= Flags.FirstChoice;
				}

				out.push({
					/** @type {!Playlist} */
					'id': v.id,
					/** @type {string} */
					'name': v.name,
					/** @type {!Array<!Scene>} */
					'scenes': demoResolveScenes(v.scenes),
					/** @type {number} */
					'flags': flags,
					/** @type {number} */
					'childId': (null === v.childId) ? 0 : v.childId,
					/** @type {?Array<WeightedChoice>} */
					'edge': standardizeChoices(v.edge),
					/** @type {?Array<WeightedChoice>} */
					'next': standardizeChoices(v.next),
				});

				return out;
			},
			[]
		)
			.sort((a, b) => {
				let a_key = `${(Flags.DemoPlay & a['flags']) ? '0_' : '1_'}${a['name']}`;
				let b_key = `${(Flags.DemoPlay & b['flags']) ? '0_' : '1_'}${b['name']}`;

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
			window['Poe']['animation'] = id;
		},

		/**
		 * Summary
		 *
		 * @param {number} id ID.
		 * @return {(Object|boolean)} Summary or false.
		 */
		'summary': function(id) {
			if ('undefined' !== typeof this['summaries'][id]) {
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
					'frame': v['scenes'][0]['frames'][0],
				};

				return out;
			}, {});
		},
	},
}));
