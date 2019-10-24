/**
 * @file Position
 */

import {
	Direction,
	PositionFlag,
	Universe
} from '../core.mjs';



/**
 * Position
 *
 * A position is a simple X/Y coordinate system that is aware of screen
 * boundaries, etc.
 */
export const Position = class {
	/**
	 * Constructor
	 *
	 * @param {number} x X position.
	 * @param {number} y Y position.
	 */
	constructor(x, y) {
		x = parseFloat(x) || 0;
		y = parseFloat(y) || 0;

		/**
		 * X Coordinate
		 *
		 * @public {number}
		 */
		this.x = x;

		/**
		 * Y Coordinate
		 *
		 * @public {number}
		 */
		this.y = y;

		/**
		 * X Direction
		 *
		 * @public {!Direction}
		 */
		this.xDir = Direction.None;

		/**
		 * Y Direction
		 *
		 * @public {!Direction}
		 */
		this.yDir = Direction.None;
	}



	// -----------------------------------------------------------------
	// Getters
	// -----------------------------------------------------------------

	/**
	 * Flags
	 *
	 * @return {!PositionFlag} Flags.
	 */
	get flags() {
		/** @const {number} */
		const tileSize = Universe.tileSize;

		/** @const {number} */
		const height = Universe.height;

		/** @const {number} */
		const width = Universe.width;

		/** @type {!PositionFlag} */
		let flags = PositionFlag.None;

		/** @type {boolean} */
		let visible = true;

		// Check the left.
		if (0.0 >= this.x) {
			flags |= PositionFlag.LeftEdge;

			if (0.0 > this.x) {
				visible = false;
			}
		}
		// Check the right.
		else if (width - tileSize <= this.x) {
			flags |= PositionFlag.RightEdge;

			if (width - tileSize < this.x) {
				visible = false;
			}
		}

		// Check the top.
		if (0.0 >= this.y) {
			flags |= PositionFlag.TopEdge;

			if (0.0 > this.y) {
				visible = false;
			}
		}
		// Check the bottom.
		else if (height - tileSize <= this.y) {
			flags |= PositionFlag.BottomEdge;

			if (height - tileSize === this.y) {
				flags |= PositionFlag.OnFloor;
			}
			else {
				visible = false;
			}
		}

		// Add the proper visibility flags.
		if (! flags || visible) {
			flags |= PositionFlag.Visible;
		}
		else if (
			0.0 - tileSize < this.x &&
			width > this.x &&
			0.0 - tileSize < this.y &&
			height > this.y
		) {
			flags |= PositionFlag.PartiallyVisible;
		}

		return /** @type {!PositionFlag} */ (flags);
	}

	/**
	 * Get X Direction of Movement
	 *
	 * @return {!Direction} Direction.
	 */
	get xDirection() {
		if (! this.x) {
			return Direction.None;
		}
		else if (0 < this.x) {
			return Direction.Right;
		}
		else {
			return Direction.Left;
		}
	}

	/**
	 * Get Y Direction of Movement
	 *
	 * @return {!Direction} Direction.
	 */
	get yDirection() {
		if (! this.y) {
			return Direction.None;
		}
		else if (0 < this.y) {
			return Direction.Down;
		}
		else {
			return Direction.Up;
		}
	}



	// -----------------------------------------------------------------
	// Mutation
	// -----------------------------------------------------------------

	/**
	 * Flip X
	 *
	 * @return {void} Nothing.
	 */
	flipX() {
		this.x = 0.0 - this.x;
	}

	/**
	 * Flip Y
	 *
	 * @return {void} Nothing.
	 */
	flipY() {
		this.y = 0.0 - this.y;
	}

	/**
	 * Move
	 *
	 * @param {!Position} pos Position.
	 * @param {boolean} absolute Absolute.
	 * @return {void} Nothing.
	 */
	move(pos, absolute) {
		// Relative movement.
		if (! absolute) {
			this.x += pos.x;
			this.xDir = pos.xDirection;
			this.y += pos.y;
			this.yDir = pos.yDirection;
		}
		else {
			this.x = pos.x;
			this.xDir = Direction.None;
			this.y = pos.y;
			this.yDir = Direction.None;
		}
	}



	// -----------------------------------------------------------------
	// State
	// -----------------------------------------------------------------

	/**
	 * Check Visibility
	 *
	 * @param {boolean} partial Partial OK.
	 * @return {boolean} True/false.
	 */
	isVisible(partial) {
		/** @const {!PositionFlag} */
		const flags = this.flags;

		if (
			(PositionFlag.Visible & flags) ||
			(partial && (PositionFlag.PartiallyVisible & flags))
		) {
			return true;
		}

		return false;
	}
};
