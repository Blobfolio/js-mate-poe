/**
 * @file Miscellaneous helper functions.
 */

import { MateAnimationPossibility, MateEvent } from './_types.mjs';



// ---------------------------------------------------------------------
// Information
// ---------------------------------------------------------------------

/**
 * Program Name
 *
 * @const {string}
 */
export const NAME = 'JS Mate Poe';

/**
 * Program Version
 *
 * @const {string}
 */
export const VERSION = '1.0.1';

/**
 * Logo
 *
 * @const {string}
 */
export const LOGO = `
                              .*//*
                     *@%&%.*&       @   ,
                    @                ,     *
                   @.                       @
                   (%                       *&(,
                    *&. ..                      .@
                  && ..,.,@@@*                  @
                @* ..,,,/@,*,,,, /@.              %/
               @ .,,,,,(% ,,,,******,&,          ,@/
             /@. .,,,,#@.,**,.*@/*****(#            .@
     ,@@@@@@@.  .,,.,.,*@(//(/////%(***/#            .@
   @%  .........,.,,,,.../&//%%(///*@/*/@.            @
 .@...........%%  .../# ...%(#&..@(/%%/*/&            @
 @ ...,..,..., (@@@@@/....,&@%.@..@(/@/**@          (#
/( ......,,.....,,.,..........*@@(##*@/*#%           @.
@*..,.,...,...,,,,,,,,...   ..  .@%*@/*/&             @
#@,,.,....,,..,,,,,,,,,.@@&,*(,,,,(@**@*.            .@
 @(,..,,...,..,,,,..,,@% @&//(///*/&@.               @
  @&..,,,,,....,,,,,.@   .. ./((*.                @#
   *@#...,.,.,,,./@@&@ ....        .   .   .      ,&
      *@#. ,.,.&&   .... .   . . .  .. .          .@
          ,@@@@#    ... .   .   .                 &/
              @@            ....      . ..     *@@
               *@%       . .  .           %(
                   .,* ,@( ..   &%@,  ./@%
`;



// ---------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------

/**
 * Screen Height
 *
 * @return {number} Height.
 */
export const screenHeight = function() {
	return parseInt(window.innerHeight, 10) || 0;
};

/**
 * Screen Width
 *
 * @return {number} Width.
 */
export const screenWidth = function() {
	return parseInt(window.innerWidth, 10) || 0;
};



// ---------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------

/**
 * Is Element?
 *
 * @param {*} v Value.
 * @param {?string=} tag Tag.
 * @return {boolean} True/false.
 */
export const isElement = function(v, tag) {
	return ('object' === typeof v) &&
		null !== v &&
		'string' === typeof v.nodeName &&
		(
			! tag ||
			('string' !== typeof tag) ||
			tag.toUpperCase() === v.nodeName
		);
};



// ---------------------------------------------------------------------
// Events
// ---------------------------------------------------------------------

/** @type {Array<MateEvent>} */
let _events = [];

/**
 * Add Event
 *
 * @param {Element|Window} el Element.
 * @param {string} hook Hook.
 * @param {Function} cb Callback.
 * @param {?Object=} options Bind options.
 * @return {void} Nothing.
 */
export const bindEvent = function(el, hook, cb, options) {
	if (el !== window && ! isElement(el)) {
		return;
	}

	// Store it.
	_events.push({
		el: el,
		hook: hook,
		cb: cb,
	});

	// Add with options.
	if (undefined !== options && null !== options && 'object' === typeof options) {
		el.addEventListener(hook, cb, options);
	}
	else {
		el.addEventListener(hook, cb);
	}
};

/**
 * Remove Events
 *
 * @param {Element|Window} el Element.
 * @return {void} Nothing.
 */
export const clearEvents = function(el) {
	if (el !== window && ! isElement(el)) {
		return;
	}

	_events = _events.filter((v) => {
		if (v.el === el) {
			el.removeEventListener(v.hook, v.cb);
			return false;
		}

		return true;
	});
};

/**
 * Event: Prevent Default
 *
 * @param {Event} e Event.
 * @return {void} Nothing.
 */
export const cbPreventDefault = function(e) {
	e.preventDefault();
};

/**
 * Event: Info
 *
 * @param {string} msg Message.
 * @return {void} Nothing.
 */
export const logInfo = function(msg) {
	console.info(`${NAME} ${msg}`);
};



// ---------------------------------------------------------------------
// Misc
// ---------------------------------------------------------------------

/**
 * Ranked Choice
 *
 * @param {(number|Array<MateAnimationPossibility>)} v Choices.
 * @return {number} Entry.
 */
export const rankedChoice = function(v) {
	if ('number' === typeof v) {
		return v;
	}
	else if (! Array.isArray(v)) {
		return 0;
	}

	/** @type {number} */
	let length = v.length;
	if (! length) {
		return 0;
	}

	// If there's just one thing, that's what we return.
	if (1 === length) {
		if ('number' === typeof v[0]) {
			return v[0];
		}
		else if ('number' === typeof v[0].id) {
			return v[0].id;
		}

		return 0;
	}

	// Build a weighted array.
	/** @type {Array<number>} */
	let out = [];
	for (let i = 0; i < length; ++i) {
		if ('number' === typeof v[i]) {
			out.push(v[i]);
		}
		else if (
			'number' === typeof v[i].weight &&
			'number' === typeof v[i].id &&
			0 < v[i].weight &&
			0 < v[i].id
		) {
			for (let j = 0; j < v[i].weight; ++j) {
				out.push(v[i].id);
			}
		}
	}

	length = out.length;
	if (! length) {
		return 0;
	}
	else if (1 === length) {
		return out[0];
	}

	return out[Math.floor(Math.random() * length)];
};