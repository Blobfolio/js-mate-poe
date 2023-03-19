/**
 * @file Base64 to Uint8Array
 */

/**
 * Base64 to Uint8Array
 *
 * It's weird. Binary data stored as base64-encoded strings takes up
 * much less disk space than the same data stored in a TypedArray, but
 * during runtime, data-URIs actually require more memory.
 *
 * Because our file values are constants, we can enjoy the best of both
 * worlds by programmatically converting base64 to an array once at startup.
 *
 * @param {string} data Data.
 * @return {!Uint8Array} Uint8Array.
 */
export const base64toUint8Array = function(data) {
	// Decode to a string.
	const bytes = atob(data);

	// And convert that to a proper array.
	return Uint8Array.from(bytes, c => c.charCodeAt(0));
};
