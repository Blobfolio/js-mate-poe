/**
 * @file Easing
 */

/**
 * Ease In/Out (Cubic)
 *
 * @param {number} v Value.
 * @return {number} Value.
 */
export const ease = function(v) {
	return 0.5 > v ? 2 * v * v : -1 + (4 - 2 * v) * v;
};

/**
 * Ease In (Cubic)
 *
 * @param {number} v Value.
 * @return {number} Value.
 */
export const easeIn = function(v) {
	return v * v;
};

/**
 * Ease Out (Cubic)
 *
 * @param {number} v Value.
 * @return {number} Value.
 */
export const easeOut = function(v) {
	return v * (2 - v);
};
