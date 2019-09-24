/**
 * @file Image.
 */


/**
 * Number of tiles horizontally.
 *
 * @const {number}
 */
export const TILES_X = 16;

/**
 * Number of tiles vertically.
 *
 * @const {number}
 */
export const TILES_Y = 11;

/**
 * Tile size (width and height are equal).
 *
 * @const {number}
 */
export const TILE_SIZE = 40;

/**
 * Image width.
 *
 * @const {number}
 */
export const WIDTH = 640;

/**
 * Image height.
 *
 * @const {number}
 */
export const HEIGHT = 440;

/**
 * Frame Offset
 *
 * @param {number} frame Frame.
 * @return {Array<number, number>} Position.
 */
export const frameOffset = function(frame) {
	return [
		(0 - TILE_SIZE) * (frame % TILES_X),
		(0 - TILE_SIZE) * Math.floor(frame / TILES_X),
	];
};
