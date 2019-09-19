/**
 * @file Component: Poe Animation
 */

/* eslint-disable quote-props */
import { VueComponent, VueProp } from './_types.mjs';



/**
 * Component: Poe Animation
 *
 * @const {VueComponent}
 */
export const poeTree = {
	/** @type {Object} */
	'props': {
		/** @type {VueProp} */
		'trunk': {
			'type': String,
			'required': true,
		},

		/** @type {VueProp} */
		'values': {
			'type': Array,
			'required': true,
		},
	},

	/** @type {Object} */
	'computed': {
		/**
		 * Branches
		 *
		 * @return {Array<Object>} Branches.
		 */
		'branches': function() {
			let out = [];
			const length = this['values'].length;

			for (let i = 0; i < length; ++i) {
				if (
					'number' !== typeof this['values'][i]['id'] ||
					'number' !== typeof this['values'][i]['weight']
				) {
					continue;
				}

				/** @type {(Object|boolean)} */
				const tmp = this['$root']['summary'](this['values'][i]['id']);
				if (false === tmp) {
					continue;
				}

				out.push({
					'id': tmp['id'],
					'name': tmp['name'],
					'frame': tmp['frame'],
					'weight': Math.floor(this['values'][i]['weight'] / this['totalWeight'] * 1000) / 10,
				});
			}

			// Sort by probability.
			out.sort((a, b) => {
				if (a.weight < b.weight) {
					return 1;
				}
				else if (a.weight > b.weight) {
					return -1;
				}
				else {
					if (a.name < b.name) {
						return -1;
					}
					else if (a.name > b.name) {
						return 1;
					}
					return 0;
				}
			});

			return out;
		},

		/**
		 * Total Weight
		 *
		 * @return {number} Weight.
		 */
		'totalWeight': function() {
			return this['values'].reduce((out, v) => {
				if ('number' === typeof v['weight']) {
					out += v['weight'];
				}

				return out;
			}, 0);
		},
	},

	/** @type {string} */
	'template': `
		<div
			class="animation-tree"
		>
			<div class="animation-trunk">{{ trunk }}</div>
			<div class="animation-branches">
				<a
					v-for="item in branches"
					class="animation-branch"
					:href="'#animation-' + item.id"
				>
					<poe-frame
						class="animation-branch-frame"
						:frame="item.frame"
					></poe-frame>

					<div class="animation-branch-meta">
						<div class="animation-branch-name">{{ item.name }}</div>
						<div class="animation-branch-weight">Probability: {{ item.weight }}%</div>
					</div>
				</a>
			</div>
		</div>
	`,
};
