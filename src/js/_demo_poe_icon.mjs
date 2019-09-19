/**
 * @file Component: Poe Icon
 */

/* eslint-disable quote-props */



/**
 * Component: Poe Icon
 *
 * @const
 */
export const poeIcon = {
	/** @type {boolean} */
	'functional': true,

	/** @type {Object} */
	'props': {
		'icon': {
			'type': String,
			'required': true,
		},
	},

	/**
	 * Render
	 *
	 * @param {Function} h Callback.
	 * @param {Object} context Context.
	 * @return {Element} Element.
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
