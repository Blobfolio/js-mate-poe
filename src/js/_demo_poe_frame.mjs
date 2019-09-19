/**
 * @file Component: Poe Frame
 */

/* eslint-disable quote-props */
import { TILES_X, TILES_Y } from './_image.mjs';



/**
 * Component: Poe Frame
 *
 * @const
 */
export const poeFrame = {
	/** @type {boolean} */
	'functional': true,

	/** @type {Object} */
	'props': {
		'frame': {
			'type': Number,
			'required': false,
			'default': 0,
		},

		'repeat': {
			'type': Boolean,
			'required': false,
			'default': false,
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
		// The frame must be in range.
		if (
			0 > context['props']['frame'] ||
			TILES_X * TILES_Y < context['props']['frame']
		) {
			context['props']['frame'] = 0;
		}

		// We need to add some classes.
		if ('string' === typeof context['data']['staticClass']) {
			context['data']['staticClass'] += ` frame f${context['props']['frame']}`;
		}
		else {
			context['data']['staticClass'] = `frame f${context['props']['frame']}`;
		}

		// Add a title for hover clarity.
		context['data']['attrs']['title'] = `Frame: #${context['props']['frame']}`;
		if (context['props']['repeat']) {
			context['data']['staticClass'] += ' is-repeated';
		}

		return h(
			'DIV',
			context['data']
		);
	},
};
