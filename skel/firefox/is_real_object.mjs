/**
 * @file Firefox Extension: Is Object Helper.
 */

/**
 * Is Actual Object?
 *
 * @param {mixed} v Varaible.
 * @return {boolean} True/false.
 */
export const isRealObject = function(v) {
	return (null !== v) && ('object' === typeof v);
};
