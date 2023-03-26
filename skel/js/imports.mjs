/**
 * @file Imports and Glue
 *
 * This file contains various Javascript bridges for the JS Mate Poe wasm
 * binary.
 */

/**
 * Update CSS Property.
 *
 * This simply writes an updated numeric (pixel) CSS property to an element's
 * style attribute.
 *
 * Until wasm gains proper DOM API support, it is significantly more efficient
 * to handle this particular task in JS.
 *
 * @param {!Element} el Element.
 * @param {string} key Key.
 * @param {number} val Value.
 * @return {void} Nothing.
 */
const poeWriteCssProperty = function(el, key, value) {
	el.style.setProperty(`--${key}`, `${value}px`);
};

/**
 * Update Wrapper Classes.
 *
 * This toggles the various (toggleable) wrapper classes to match specific
 * states.
 *
 * The JS definition is ugly, but saves us having to pass/decode eight separate
 * strings over the wasm/JS boundary every time a class changes.
 *
 * @param {!Element} el Element.
 * @param {boolean} h Half Frame.
 * @param {boolean} rx FlipX.
 * @param {boolean} ry FlipY.
 * @param {boolean} off Hide.
 * @param {boolean} a1 Animation #1.
 * @param {boolean} a2 Animation #2.
 * @param {boolean} a3 Animation #3.
 * @param {boolean} a4 Animation #4.
 * @return {void} Nothing.
 */
const poeToggleWrapperClasses = function(
	el,
	h,
	rx,
	ry,
	off,
	a1,
	a2,
	a3,
	a4
) {
	let list = el.classList;
	list.toggle('h', !! h);
	list.toggle('rx', !! rx);
	list.toggle('ry', !! ry);
	list.toggle('off', !! off);
	list.toggle('a1', !! a1);
	list.toggle('a2', !! a2);
	list.toggle('a3', !! a3);
	list.toggle('a4', !! a4);
};
