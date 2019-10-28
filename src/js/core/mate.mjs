/**
 * @file Mates
 */

/* global Generator */
import {
	AnimationFlag,
	AnimationList,
	DefaultList,
	Direction,
	EntranceList,
	FirstList,
	LogKind,
	LogMsg,
	MateFlag,
	MateNext,
	MateState,
	Playlist,
	Position,
	PositionFlag,
	SceneFlag,
	Sound,
	Step,
	Universe
} from '../core.mjs';



/**
 * Screen Mate!
 */
export const Mate = class {
	/**
	 * Constructor
	 *
	 * @param {boolean} primary Primary.
	 */
	constructor(primary) {
		/**
		 * Mate ID
		 *
		 * @private {symbol}
		 */
		this._id = Symbol();

		/**
		 * Current Animation
		 *
		 * @private {!Playlist}
		 */
		this._animation = Playlist.None;

		/**
		 * Flags
		 *
		 * @private {!MateFlag}
		 */
		this._flags = MateFlag.Disabled;

		/**
		 * Current Frame
		 *
		 * @private {number}
		 */
		this._frame = 0;

		/**
		 * Things to Do On Next Tick
		 *
		 * @private {!MateNext}
		 */
		this._next = {
			time: 0,
			animation: null,
			position: null,
			flags: 0,
		};

		/**
		 * Position
		 *
		 * @private {!Position}
		 */
		this._position = new Position(-100, -100);

		/**
		 * Primary
		 *
		 * @private {boolean}
		 */
		this._primary = !! primary;
		if (this._primary) {
			this._flags |= MateFlag.Primary;
		}
		else {
			this._flags |= MateFlag.Secondary;
		}

		/**
		 * Current Sound
		 *
		 * @private {!Sound}
		 */
		this._sound = Sound.None;

		/**
		 * Steps
		 *
		 * @private {?Generator}
		 */
		this._steps = null;

		/**
		 * Step Flags
		 *
		 * @private {?SceneFlag}
		 */
		this._stepFlags = null;
	}



	// -----------------------------------------------------------------
	// Getters
	// -----------------------------------------------------------------

	/**
	 * Get Animation
	 *
	 * @return {!Playlist} Animation.
	 */
	get animation() {
		return this._animation;
	}

	/**
	 * Get Flags
	 *
	 * @return {!MateFlag} Flags.
	 */
	get flags() {
		return this._flags;
	}

	/**
	 * Get Frame
	 *
	 * @return {number} Frame.
	 */
	get frame() {
		return this._frame;
	}

	/**
	 * Get ID
	 *
	 * @return {symbol} ID.
	 */
	get id() {
		return this._id;
	}

	/**
	 * Get Next Time
	 *
	 * @return {number} Next.
	 */
	get next() {
		return this._next.time;
	}

	/**
	 * Get Next Position
	 *
	 * @return {!Position} Position.
	 */
	get nextPosition() {
		if (null !== this._next.position) {
			return this._next.position;
		}

		return this._position;
	}

	/**
	 * Get Position
	 *
	 * @return {!Position} Position.
	 */
	get position() {
		return this._position;
	}

	/**
	 * Get Sound
	 *
	 * @return {!Sound} Sound.
	 */
	get sound() {
		return this._sound;
	}



	// -----------------------------------------------------------------
	// Setters
	// -----------------------------------------------------------------

	/**
	 * Flip
	 *
	 * @param {boolean=} v Value.
	 * @return {void} Nothing.
	 */
	flipX(v) {
		if ('boolean' !== typeof v) {
			v = ! (MateFlag.FlippedX & this._flags);
		}

		// Turn it on.
		if (v) {
			this._flags |= MateFlag.FlippedX;
		}
		else {
			this._flags &= ~MateFlag.FlippedX;
		}

		// Remove it from the next flags.
		this.clearNextFlag(MateFlag.FlippedX);
	}

	/**
	 * Set Next Time
	 *
	 * @param {number} v Value.
	 * @return {void} Nothing.
	 */
	set next(v) {
		if (! (MateFlag.Disabled & this._flags)) {
			v = parseFloat(v) || 0;
			if (0 > v) {
				v = 0;
			}

			this._next.time = v;
		}
	}



	// -----------------------------------------------------------------
	// State
	// -----------------------------------------------------------------

	/**
	 * Is Background?
	 *
	 * @return {boolean} True/false.
	 */
	isBackground() {
		return !! (MateFlag.Background & this._flags);
	}

	/**
	 * Is Disabled?
	 *
	 * @return {boolean} True/false.
	 */
	isDisabled() {
		return !! (MateFlag.Disabled & this._flags);
	}

	/**
	 * Is Dragging?
	 *
	 * @return {boolean} True/false.
	 */
	isDragging() {
		return !! (MateFlag.Dragging & this._flags);
	}

	/**
	 * Is Enabled?
	 *
	 * @return {boolean} True/false.
	 */
	isEnabled() {
		return ! (MateFlag.Disabled & this._flags);
	}

	/**
	 * Is Primary?
	 *
	 * @return {boolean} True/false.
	 */
	isPrimary() {
		return this._primary;
	}

	/**
	 * Is Secondary?
	 *
	 * @return {boolean} True/false.
	 */
	isSecondary() {
		return ! this._primary;
	}

	/**
	 * State
	 *
	 * @return {!MateState} State.
	 */
	state() {
		return /** @type {!MateState} */ ({
			id: this._id,
			next: this._next.time,
			frame: this._frame,
			sound: this._sound,
			x: this._position.x,
			y: this._position.y,
			flags: this._flags,
		});
	}



	// -----------------------------------------------------------------
	// Playback
	// -----------------------------------------------------------------

	/**
	 * Start
	 *
	 * @return {void} Nothing.
	 */
	start() {
		// This is only for primary mates.
		if (! this._primary) {
			Universe.log(LogMsg.ErrorStartSecondary, LogKind.Error);
			return;
		}

		// Unset a few flags to prevent recursion issues.
		this._flags &= ~(MateFlag.FlippedX | MateFlag.Dragging | MateFlag.MayExit);
		this.clearNext();

		/** @const {!Playlist} */
		const id = FirstList.choose();

		// If we're falling, pick a random starting place.
		if (Playlist.Fall === id) {
			this.setAnimation(
				id,
				new Position(
					Universe.random(Universe.maxX),
					0 - Universe.tileSize
				)
			);
		}
		else {
			this.setAnimation(id, null);
		}
	}

	/**
	 * Stop Everything
	 *
	 * @return {void} Nothing.
	 */
	stop() {
		this.resetAnimation();

		// This is only for secondary mates.
		if (this._primary) {
			Universe.log(LogMsg.ErrorStopPrimary, LogKind.Error);
			this.start();
			return;
		}

		this._flags = MateFlag.Disabled;
		this._flags |= MateFlag.Secondary;
	}

	/**
	 * Tick
	 *
	 * @param {number} now Now.
	 * @param {boolean} force Force.
	 * @return {void} Nothing.
	 */
	tick(now, force) {
		// Run a pre-check for any Do Next tasks.
		if (! this.preTick(now, force)) {
			return;
		}

		/** @const {!Object} */
		const next = this._steps.next();

		/** @const {!Step} */
		const step = next.value;

		/** @const {number} */
		const interval = step.interval / Universe.speed;

		// Adjust the flags.
		this._stepFlags = step.flags;

		// Adjust the next tick.
		this._next.time = now + interval;

		// Set the easy stuff.
		this._frame = step.frame;
		this._sound = step.sound;

		// First steps have a few extra checks.
		if (0 === step.step) {
			// Move to scene position?
			if (null !== step.start) {
				this._position.move(step.start, true);

				// Turn flip off or weird things might happen.
				this.flipX(false);
			}
		}

		// Move it?
		if (null !== step.move) {
			// Flip the movement?
			if (MateFlag.FlippedX & this._flags) {
				step.move.flipX();
			}

			this._position.move(step.move, false);
		}

		// Mind the edges!
		if (
			! (MateFlag.Dragging & this._flags) &&
			! (SceneFlag.IgnoreEdges & step.flags)
		) {
			/** @const {!PositionFlag} */
			const edges = this._position.flags;

			// Check gravity first.
			if (
				(SceneFlag.Gravity & step.flags) &&
				! (PositionFlag.OnFloor & edges)
			) {
				// Primary mates fall.
				if (this._primary) {
					this._next.time = 0;
					this.setAnimation(Playlist.Fall, null);
				}
				else {
					this.stop();
				}

				// Abort.
				return;
			}

			// Take a closer look at collisions, if there are any.
			if (edges) {
				/** @type {boolean} */
				let edge = false;

				// Check the horizontal if we aren't possibly exiting.
				if (! (MateFlag.MayExit & this._flags)) {
					if (PositionFlag.LeftEdge & edges) {
						if (Direction.Left === this._position.xDir) {
							this._position.x = 0.0;
							this._position.xDir = Direction.None;
							edge = true;
						}
					}
					else if (PositionFlag.RightEdge & edges) {
						if (Direction.Right === this._position.xDir) {
							this._position.x = Universe.maxX;
							this._position.xDir = Direction.None;
							edge = true;
						}
					}
				}

				// We can always look at the top and the bottom.
				if (PositionFlag.TopEdge & edges) {
					if (Direction.Up === this._position.yDir) {
						this._position.y = 0.0;
						this._position.yDir = Direction.None;
						edge = true;
					}
				}
				else if (
					(PositionFlag.BottomEdge & edges) &&
					! (SceneFlag.Gravity & step.flags)
				) {
					if (Direction.Down === this._position.yDir) {
						this._position.y = Universe.maxY;
						this._position.yDir = Direction.None;
						edge = true;
					}
				}

				// We hit an edge?
				if (edge) {
					this._next.time = 0;
					this.setAnimation(this.nextAnimation(true), null);
					return;
				}
			}
		}

		// Are we out of things to do?
		if (next.done) {
			// If we're flipping, schedule it for next time.
			if (step.flip) {
				this.setNextFlag(MateFlag.FlippedX);
			}

			// Choose another animation.
			this._next.animation = this.nextAnimation(false);
		}
		// Otherwise we might need to flip.
		else if (step.flip) {
			this.flipX();
		}
	}

	/**
	 * Pre-Tick
	 *
	 * Decide if ticking should occur, and handle any Do Next tasks
	 * specified on the previous tick.
	 *
	 * @param {number} now Now.
	 * @param {boolean} force Force.
	 * @return {boolean} True/false.
	 */
	preTick(now, force) {
		// Nothing to do.
		if (
			null === this._steps ||
			(! force && this._next.time > now)
		) {
			return false;
		}

		// Change the animation?
		if (null !== this._next.animation) {
			// Set the animation.
			this.setAnimation(this._next.animation, this._next.position);
		}
		// Move to absolute position.
		else if (null !== this._next.position) {
			this._position.move(this._next.position, true);
			this._next.position = null;
		}

		// If FlippedX is in the next flags, let's flip (relative to
		// the current state).
		if (MateFlag.FlippedX & this._next.flags) {
			this.flipX();
		}

		// We don't need to do anything else with flags.
		this._next.flags = 0;

		// Ticks are fine so long as we have an animation!
		return Playlist.None !== this._animation;
	}



	// -----------------------------------------------------------------
	// Animation
	// -----------------------------------------------------------------

	/**
	 * Set Animation
	 *
	 * @param {!Playlist} id Animation ID.
	 * @param {?Position} pos Start from here.
	 * @return {void} Nothing.
	 */
	setAnimation(id, pos) {
		// Prevent recursion.
		this._next.animation = null;
		this._next.position = null;

		// Take action if no ID was passed.
		if (
			Playlist.None === id ||
			'undefined' === typeof AnimationList[id - 1]
		) {
			if (! this._primary) {
				this.stop();
				return;
			}

			// Note that we're here.
			Universe.log(LogMsg.ErrorMissingPrimary, LogKind.Error);

			// Set a sane default for primary mates. This shouldn't
			// trigger often, if ever, but just in case...
			id = Playlist.Walk;
		}

		// Make sure the animation works for the Mate.
		if (
			(this._primary && ! (AnimationFlag.PrimaryMates & AnimationList[id - 1].flags)) ||
			(! this._primary && ! (AnimationFlag.SecondaryMates & AnimationList[id - 1].flags))
		) {
			Universe.log(LogMsg.ErrorAnimationType, LogKind.Error);
			this.stop();
			return;
		}

		// We definitely aren't disabled any more!
		this._flags &= ~MateFlag.Disabled;

		// If we're suddenly falling, cancel all children.
		if (
			id !== this._animation &&
			(AnimationFlag.Falling & AnimationList[id - 1].flags)
		) {
			Universe.stopSecondaryMates();

			// We might also need to fix our X... no point falling if
			// the mate is off the screen.
			if (0.0 > this._position.x) {
				this._position.x = 0.0;
				this._position.xDir = Direction.None;
			}
			else if (Universe.maxX < this._position.x) {
				this._position.x = Universe.maxX;
				this._position.xDir = Direction.None;
			}
		}

		// Disable the exit possibility if we're changing animations and
		// the property doesn't hold.
		if (
			(Playlist.None === this._animation) ||
			(id !== this._animation) ||
			! (AnimationFlag.AllowExit & AnimationList[id - 1].flags)
		) {
			// Turn off.
			this._flags &= ~MateFlag.MayExit;
		}

		// Now enable exiting with a 1/10 chance for supported animations.
		if (
			(AnimationFlag.AllowExit & AnimationList[id - 1].flags) &&
			! (MateFlag.MayExit & this._flags) &&
			5 === Universe.random(10)
		) {
			this._flags |= MateFlag.MayExit;
		}

		// Stack it under?
		if (AnimationFlag.Background & AnimationList[id - 1].flags) {
			this._flags |= MateFlag.Background;
		}
		else {
			this._flags &= ~MateFlag.Background;
		}

		// We might need to set a next time.
		if (0 >= this._next.time) {
			this._next.time = 1;
		}

		// Pull the scene details.
		this._animation = id;
		this._steps = AnimationList[id - 1].scenes.steps();
		this._stepFlags = null;

		// Move it into place.
		if (null !== pos) {
			this._position.move(pos, true);
		}

		// Spawn a child.
		if (null !== AnimationList[id - 1].childId) {
			this.spawnMate();
		}
	}

	/**
	 * Reset Animation
	 *
	 * @return {void} Nothing.
	 */
	resetAnimation() {
		// Reset animation.
		if (Playlist.None !== this._animation) {
			this._animation = Playlist.None;
			this._flags |= MateFlag.Disabled;
		}

		if (null !== this._steps) {
			delete this._steps;
			this._steps = null;
			this._stepFlags = null;
		}

		// Reset the next bits.
		this.clearNext();
	}

	/**
	 * Next Animation
	 *
	 * @param {boolean} edge Choose an edge.
	 * @return {!Playlist} Animation ID.
	 */
	nextAnimation(edge) {
		// Disabled animations have no next.
		if (
			(Playlist.None === this._animation) ||
			(MateFlag.Disabled & this._flags)
		) {
			return Playlist.None;
		}

		// Pull an edge animation.
		if (edge) {
			if (null === AnimationList[this._animation - 1].edge) {
				if (! this._primary) {
					return Playlist.None;
				}
			}
			else if ('number' === typeof AnimationList[this._animation - 1].edge) {
				return /** @type {!Playlist} */ (AnimationList[this._animation - 1].edge);
			}
			else {
				return AnimationList[this._animation - 1].edge.choose();
			}
		}

		// If we aren't visible at all, we need an entrance animation,
		// assuming we're primary.
		if (! this._position.isVisible(false)) {
			return this._primary ? EntranceList.choose() : Playlist.None;
		}
		// Keep the same animation if we're almost off-screen.
		else if (
			(MateFlag.MayExit & this._flags) &&
			Playlist.None !== this._animation &&
			(0 > this._position.x || Universe.maxX < this._position.x)
		) {
			return this._animation;
		}

		// Figure out the next.
		if (null === AnimationList[this._animation - 1].next) {
			return this._primary ? DefaultList.choose() : Playlist.None;
		}
		else if ('number' === typeof AnimationList[this._animation - 1].next) {
			return /** @type {!Playlist} */ (AnimationList[this._animation - 1].next);
		}
		else {
			return AnimationList[this._animation - 1].next.choose();
		}
	}

	/**
	 * Spawn Child
	 *
	 * @return {void} Nothing.
	 */
	spawnMate() {
		// Nothing to spawn.
		if (
			null === this._animation ||
			null === AnimationList[this._animation - 1].childId
		) {
			return;
		}

		/** @const {!Position} */
		const refPos = this.nextPosition;

		/** @type {number} */
		let x = 0;

		/** @type {number} */
		let y = 0;

		switch (AnimationList[this._animation - 1].childId) {
		case Playlist.FlowerChild:
			if (MateFlag.FlippedX & this._flags) {
				x = refPos.x + Math.floor(Universe.tileSize * 0.9);
			}
			else {
				x = refPos.x - Math.floor(Universe.tileSize * 0.9);
			}

			y = refPos.y;
			break;

		case Playlist.AbductionChild:
			x = refPos.x;
			y = Universe.maxY - Universe.tileSize - 480;
			break;

		case Playlist.AbductionBeamChild:
			x = refPos.x;
			y = Universe.maxY;
			break;

		case Playlist.SneezeShadow:
			// This effect doesn't work flipped.
			if (MateFlag.FlippedX & this._flags) {
				return;
			}

			x = refPos.x;
			y = refPos.y;
			break;
		}

		/** @const {!Mate} */
		const mate = Universe.initMate();

		// We might want to flip it.
		if (
			(MateFlag.FlippedX & this._flags) ||
			(MateFlag.FlippedX & this._next.flags)
		) {
			mate.flipX(true);
		}

		mate.next = this._next.time;

		// Set the animation.
		mate.setAnimation(
			/** @type {!Playlist} */ (AnimationList[this._animation - 1].childId),
			(x || y) ? new Position(x, y) : null
		);

		// And tick if it needs to.
		mate.tick(Universe.now(), false);
	}

	/**
	 * Clear Next
	 *
	 * @return {void} Nothing.
	 */
	clearNext() {
		this._next.time = 0;
		this._next.animation = null;
		this._next.position = null;
		this._next.flags = 0;
	}

	/**
	 * Clear Next Flag
	 *
	 * @param {!MateFlag} flag Flag.
	 * @return {void} Nothing.
	 */
	clearNextFlag(flag) {
		this._next.flags &= ~flag;
	}

	/**
	 * Set Next Flag
	 *
	 * @param {!MateFlag} flag Flag.
	 * @return {void} Nothing.
	 */
	setNextFlag(flag) {
		this._next.flags |= flag;
	}



	// -----------------------------------------------------------------
	// Dragging
	// -----------------------------------------------------------------

	/**
	 * Drag Start
	 *
	 * @return {void} Nothing.
	 */
	dragStart() {
		if (this._primary && ! (MateFlag.Dragging & this._flags)) {
			this._flags |= MateFlag.Dragging;
			this._next.time = 0;
			this.setAnimation(Playlist.Drag, null);
		}
	}

	/**
	 * Drag
	 *
	 * @param {!Position} pos Position.
	 * @return {void} Nothing.
	 */
	drag(pos) {
		if (MateFlag.Dragging & this._flags) {
			this._position.move(pos, true);
		}
	}

	/**
	 * Drag End
	 *
	 * @return {void} Nothing.
	 */
	dragEnd() {
		if (MateFlag.Dragging & this._flags) {
			this._flags &= ~MateFlag.Dragging;
			this._next.time = 0;
			this.setAnimation(Playlist.Fall, null);
		}
	}

	/**
	 * Resize
	 *
	 * We might need to nudge our positions or change animations if the
	 * Universe has resized itself.
	 *
	 * @return {void} Nothing.
	 */
	resize() {
		// No animation, no nudging.
		if (Playlist.None === this._animation) {
			return;
		}

		/** @const {!PositionFlag} */
		const edges = this._position.flags;

		// If we're off-screen, we need to restart.
		if (! this._position.isVisible(true)) {
			// Remove the child.
			if (! this._primary) {
				this.stop();
			}
			// Reset the parent.
			else {
				this.start();
			}

			return;
		}

		// Check gravity if we can.
		if (
			! (PositionFlag.OnFloor & edges) &&
			null !== this._stepFlags &&
			(SceneFlag.Gravity & this._stepFlags)
		) {
			this._position.y = Universe.maxY;
			this._position.yDir = Direction.None;
		}

		// If we're climbing down the side of the window, we need to be
		// glued to the edges.
		if (
			(Playlist.ClimbDown === this._animation) ||
			(Playlist.ClimbUp === this._animation)
		) {
			/** @type {number} */
			let position = 0;
			if (
				(Playlist.ClimbDown === this._animation && ! (MateFlag.FlippedX & this._flags)) ||
				(Playlist.ClimbUp === this._animation && (MateFlag.FlippedX & this._flags))
			) {
				position = Universe.maxX;
			}

			if (position !== this._position.x) {
				this._position.x = position;
				this._position.xDir = Direction.None;
			}
		}
	}
};
