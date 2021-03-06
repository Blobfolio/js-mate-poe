/**
 * @file Component: Poe Icon
 */

/* eslint-disable quote-props */
import { VueComponent, VueProp } from './vue.mjs';



/**
 * Component: Poe Icon
 *
 * @const {VueComponent}
 */
export const PoeIcon = {
	/** @type {boolean} */
	'functional': true,

	/** @type {!Object} */
	'props': {
		/** @type {!VueProp} */
		'icon': {
			'type': String,
			'required': true,
		},
	},

	/**
	 * Render
	 *
	 * @param {!Function} h Callback.
	 * @param {!Object} context Context.
	 * @return {!Element} Element.
	 */
	'render': function(h, context) {
		// We need to add some classes.
		if ('string' === typeof context['data']['staticClass']) {
			context['data']['staticClass'] += ' icon';
		}
		else {
			context['data']['staticClass'] = 'icon';
		}

		context['data']['domProps'] = {
			innerHTML: `<svg class="icon-${context['props']['icon']}"><use xlink:href="#i-${context['props']['icon']}"></use></svg>`,
		};

		return h(
			'DIV',
			context['data']
		);
	},
};
