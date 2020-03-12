/**
 * @file JS Mate Poe: Mate State
 */

import { Sound } from '../core.mjs';

/**
 * Poe Mate
 *
 * @typedef {{
	primary: boolean,
	events: ?Object<string, Function>,
	el: !HTMLDivElement,
	sound: !Sound
 * }}
 */
export var PoeMateState;
