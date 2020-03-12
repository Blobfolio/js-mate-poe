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
	flags: number,
	frame: number,
	x: number,
	y: number,
	sound: !Sound
 * }}
 */
export var PoeMateState;
