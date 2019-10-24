/**
 * @file Base64 to Blob
 */

/**
 * Base64 to Blob
 *
 * It's weird. Binary data stored as base64-encoded strings takes up
 * much less disk space than the same data stored in a TypedArray, but
 * during runtime, data-URIs actually require more memory.
 *
 * Because our file values are constants, we can enjoy the best of both
 * worlds by programmatically converting base64 to Blob once at startup.
 *
 * @param {string} data Data.
 * @param {string} type Content type.
 * @return {!Blob} Blob.
 */
export const base64toBlob = function(data, type) {
	/** @const {string} */
	const bytes = atob(data);

	/** @type {number} */
	let length = bytes.length;

	/** @type {Uint8Array} */
	let out = new Uint8Array(length);

	// Loop and convert.
	while (length--) {
		out[length] = bytes.charCodeAt(length);
	}

	return new Blob([out], { type: type });
};
