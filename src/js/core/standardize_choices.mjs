/**
 * @file Standardize Choices
 */

import {
	ChoiceList,
	Playlist
} from '../core.mjs';



/**
 * Standardize Choices
 *
 * Choices might be null (none), a number (one), or a ChoiceList. This
 * jams the numeric version inside a proper ChoiceList, reducing the
 * possible types to two.
 *
 * @param {null|!Playlist|!ChoiceList} choices Choices.
 * @return {?ChoiceList} Choices or null.
 */
export const standardizeChoices = function(choices) {
	if ('number' === typeof choices) {
		return new ChoiceList([[choices, 1]]);
	}
	else if (choices instanceof ChoiceList) {
		return choices;
	}

	return null;
};
