/**
 * @file The Demo!
 */

/* eslint-disable quote-props */
import { ANIMATIONS, CHILD_ANIMATIONS, DRAGGING_ANIMATION } from './_animations.mjs';
import { poeAnimation } from './_demo_poe_animation.mjs';
import { poeFrame } from './_demo_poe_frame.mjs';
import { poeIcon } from './_demo_poe_icon.mjs';
import { poeTree } from './_demo_poe_tree.mjs';
import { NAME, VERSION } from './_helpers.mjs';
import { MateAnimationPossibility, MateAnimationState, RawMateAnimation } from './_types.mjs';



// ---------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------

/** @type {boolean} */
let mounted = false;

/**
 * Standardize MateAnimationState
 *
 * @param {(number|MateAnimationState|Function)} v Value.
 * @return {MateAnimationState} Value.
 */
const standardizeMateAnimationState = function(v) {
	let out = ('function' === typeof v ? v() : v);
	if ('number' === typeof out) {
		out = {
			x: 0,
			y: 0,
			speed: out,
		};
	}

	return /** @type {!MateAnimationState} */ (out);
};

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


// ---------------------------------------------------------------------
// Vue!
// ---------------------------------------------------------------------

// Register components.
window['Vue']['component']('poe-animation', poeAnimation);
window['Vue']['component']('poe-frame', poeFrame);
window['Vue']['component']('poe-icon', poeIcon);
window['Vue']['component']('poe-tree', poeTree);

// Get Vue going!
new window['Vue']({
	/** @type {string} */
	'el': '#app',

	/** @type {Object} */
	'data': {
		'name': NAME,
		'version': VERSION,

		'animations': Object.values(/** @type {!Object<!RawMateAnimation>} */ (ANIMATIONS)).reduce((out, v) => {
			// Let's transform start and end properties for consistency.
			const start = standardizeMateAnimationState(v.start);
			const end = standardizeMateAnimationState(v.end);

			// Same for next and edge.
			const next = standardizeMateAnimationPossibility(v.next);
			const edge = standardizeMateAnimationPossibility(v.edge);

			/** @type {boolean} */
			const primary = (0 < v.defaultChoice) ||
				(
					0 < v.startupChoice &&
					5 !== v.id &&
					6 !== v.id
				);

			/** @type {boolean} */
			const playable = ! CHILD_ANIMATIONS.has(v.id) &&
				DRAGGING_ANIMATION !== v.id &&
				// Falling.
				5 !== v.id &&
				6 !== v.id &&
				// Border crawling.
				37 !== v.id &&
				38 !== v.id &&
				39 !== v.id &&
				40 !== v.id &&
				41 !== v.id &&
				42 !== v.id;

			out.push({
				/** @type {number} */
				'id': v.id,
				/** @type {string} */
				'name': v.name,
				/** @type {boolean} */
				'primary': primary,
				/** @type {boolean} */
				'playable': playable,
				/** @type {boolean} */
				'variableDuration': ('function' === typeof v.repeat),
				/** @type {?Object} */
				'startFrom': ('function' === typeof v.startFrom ? v.startFrom() : v.startFrom),
				/** @type {Object} */
				'start': start,
				/** @type {Object} */
				'end': end,
				/** @type {number} */
				'repeat': ('function' === typeof v.repeat ? v.repeat() : v.repeat),
				/** @type {number} */
				'repeatFrom': v.repeatFrom,
				/** @type {Array<number>} */
				'frames': v.frames,
				/** @type {?Object} */
				'audio': v.audio,
				/** @type {boolean} */
				'allowExit': v.allowExit,
				/** @type {boolean} */
				'autoFlip': v.autoFlip,
				/** @type {number} */
				'defaultChoice': v.defaultChoice,
				/** @type {boolean} */
				'forceGravity': v.forceGravity,
				/** @type {number} */
				'offscreenChoice': v.offscreenChoice,
				/** @type {boolean} */
				'ignoreEdges': v.ignoreEdges,
				/** @type {number} */
				'startupChoice': v.startupChoice,
				/** @type {number} */
				'childId': v.childId,
				/** @type {?Array<MateAnimationPossibility>} */
				'edge': edge,
				/** @type {?Array<MateAnimationPossibility>} */
				'next': next,
			});

			return out;
		}, []).sort((a, b) => {
			let a_key = `${a['primary'] ? '0_' : '1_'}${a['playable'] ? '0_' : '1_'}${a['name']}`;
			let b_key = `${b['primary'] ? '0_' : '1_'}${b['playable'] ? '0_' : '1_'}${b['name']}`;

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
					'frame': v['frames'][0],
				};

				return out;
			}, {});
		},
	},
});