/**
 * @file JS Mate Poe: Vue Demo
 */

/* global Vue */
/* eslint-disable quote-props */
import {
	Animation,
	AnimationFlag,
	AnimationList,
	AsciiArt,
	ChoiceList,
	LogMsg,
	Playlist,
	SceneList,
	standardizeChoices,
	Universe
} from '../core.mjs';
import { universeForBrowser } from '../middleware/universe.browser.mjs';
import { PoeAnimation } from './poe_animation.mjs';
import { PoeFrame } from './poe_frame.mjs';
import { PoeIcon } from './poe_icon.mjs';
import { PoeTree } from './poe_tree.mjs';
/* eslint-disable-next-line */
import { VueApp } from './vue.mjs';



// Set universe overloads.
universeForBrowser();



// ---------------------------------------------------------------------
// Vue
// ---------------------------------------------------------------------

/** @type {boolean} */
let _mounted = false;

Vue.component('poe-animation', PoeAnimation);
Vue.component('poe-frame', PoeFrame);
Vue.component('poe-icon', PoeIcon);
Vue.component('poe-tree', PoeTree);

new Vue(/** @type {!VueApp} */ ({
	/** @type {string} */
	'el': '#app',

	/** @type {Object} */
	'data': {
		'name': LogMsg.Name,
		'version': LogMsg.Version,
		'animations': AnimationList.reduce(
			/**
			 * Collection
			 *
			 * @param {!Array<!Animation>} out Collection.
			 * @param {!Animation} v Animation.
			 * @return {!Array<!Animation>} Collection.
			 */
			(out, v) => {
				out.push(/** @type {!Animation} */ ({
					/** @type {!Playlist} */
					'id': v.id,
					/** @type {string} */
					'name': v.name,
					/** @type {!SceneList} */
					'scenes': v.scenes,
					/** @type {number} */
					'flags': v.flags,
					/** @type {number} */
					'childId': (null === v.childId) ? 0 : v.childId,
					/** @type {?ChoiceList} */
					'edge': standardizeChoices(v.edge),
					/** @type {?ChoiceList} */
					'next': standardizeChoices(v.next),
				}));

				return out;
			},
			[]
		)
			.sort((a, b) => {
				let a_key = `${(AnimationFlag.DirectPlay & a['flags']) ? '0_' : '1_'}${a['name']}`;
				let b_key = `${(AnimationFlag.DirectPlay & b['flags']) ? '0_' : '1_'}${b['name']}`;

				return (a_key < b_key) ? -1 : 1;
			}),

		'immersive': false,
	},

	/**
	 * Mounted
	 *
	 * @return {void} Nothing.
	 */
	'mounted': function() {
		if (! _mounted) {
			_mounted = true;

			// Set the canvas size.
			Universe.height = parseInt(window.innerHeight, 10) || 1024;
			Universe.width = parseInt(window.innerWidth, 10) || 768;

			// Print something fun to the console.
			/* eslint-disable-next-line */
			console.info(`%c${AsciiArt}`, 'color:#b2bec3;font-family:monospace;font-weight:bold;');

			/* eslint-disable-next-line */
			console.info(`%c${LogMsg.Name}: %c${LogMsg.Version}`, 'color:#ff1493;font-weight:bold;', 'color:#00abc0;font-weight:bold;');

			/* eslint-disable-next-line */
			console.info(`%c${LogMsg.URL}`, 'color:#e67e22;text-decoration:underline;');
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
					'frame': v['scenes'].frame,
				};

				return out;
			}, {});
		},
	},
}));
