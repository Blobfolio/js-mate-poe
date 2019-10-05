/**
 * @file Mates!
 */

/* global Generator */
import { NAME } from './_about.mjs';
import {
	animation,
	chooseAnimation,
	DEFAULT_CHOICES,
	ENTRANCE_CHOICES,
	FIRST_CHOICES,
	generateSceneSteps
} from './_animations.mjs';
import { IMAGE } from './_bin.mjs';
import { xDirection, yDirection } from './_helpers.mjs';
import { makeNoise, TILE_SIZE } from './_media.mjs';
import { Poe } from './_poe.mjs';
import {
	Animation,
	AnimationFlag,
	Direction,
	LogType,
	MateFlag,
	Playlist,
	SceneFlag,
	Step,
	WeightedChoice
} from './_types.mjs';



/**
 * Child Mate
 */
export const ChildMate = class {
	// -----------------------------------------------------------------
	// Construction
	// -----------------------------------------------------------------

	/**
	 * Constructor
	 *
	 * @param {number} mateId Mate ID.
	 */
	constructor(mateId) {
		mateId = parseInt(mateId, 10) || 0;

		/** @private {number} */
		this._mateId = mateId;

		/** @private {?HTMLDivElement} */
		this._el = null;

		/** @private {number} */
		this._flags = 0;

		/** @private {number} */
		this._x = -100;

		/** @private {number} */
		this._y = -100;

		/** @private {number} */
		this._frame = 0;

		/** @private {?Animation} */
		this._animation = null;

		/** @private {number} */
		this._nextTick = 0;

		/** @private {?number} */
		this._raf = null;

		/** @private {?Generator} */
		this._steps = null;

		/** @private {?Object} */
		this._step = null;

		/** @private {string} */
		this._elClass = '';

		/** @private {string} */
		this._elStyleTransform = '';

		/** @private {string} */
		this._imgClass = '';

		// Finish setup.
		this.setupDom();
	}

	/**
	 * Setup DOM Nodes
	 *
	 * @return {void} Nothing.
	 */
	setupDom() {
		// Only do this once.
		if (null !== this._el) {
			return;
		}

		this._el = /** @type {!HTMLDivElement} */ (document.createElement('DIV'));
		this._el.className = `${this.baseClass} is-disabled`;
		this._el.setAttribute('aria-hidden', 'true');
		this._el.setAttribute('data-mate-id', this._mateId);

		/** @type {HTMLImageElement} */
		let img = /** @type {HTMLImageElement} */ (document.createElement('IMG'));
		img.src = IMAGE;
		img.alt = NAME;
		img.className = 'poe-img';
		this._el.appendChild(img);

		// Add the element to the body.
		document.body.appendChild(this._el);

		// Watch its movements.
		Poe.observe(this._el);
	}

	/**
	 * Spawn Child
	 *
	 * @return {void} Nothing.
	 */
	spawnChild() {
		// No children.
		if (null === this._animation || null === this._animation.childId) {
			return;
		}

		/** @type {!Array<number>} */
		let setup;

		switch (this._animation.childId) {
		case Playlist.BathDiveChild:
		case Playlist.BlackSheepChild:
		case Playlist.StargazeChild:
		case Playlist.ChasingAMartianChild:
			setup = [this._animation.childId];
			break;
		case Playlist.FlowerChild:
			setup = [
				Playlist.FlowerChild,
				(MateFlag.IsFlipped & this._flags) ?
					this._x + TILE_SIZE * 0.9 :
					this._x - TILE_SIZE * 0.9,
				this._y,
			];

			break;
		case Playlist.AbductionChild:
			setup = [
				Playlist.AbductionChild,
				this._x,
				Poe.height - TILE_SIZE * 2 - 4 * 120,
			];

			break;
		case Playlist.AbductionBeamChild:
			setup = [
				Playlist.AbductionBeamChild,
				this._x,
				Poe.height - TILE_SIZE,
			];

			break;
		case Playlist.SneezeShadow:
			// This effect doesn't work quite right when flipped.
			if (this.flipped) {
				return;
			}

			setup = [
				Playlist.SneezeShadow,
				this._x,
				this._y,
			];

			break;
		default:
			return;
		}

		/** @type {!ChildMate} */
		let mate = Poe.initMate();
		mate.flipped = this.flipped;
		mate._nextTick = this._nextTick;
		mate.setAnimation(...setup);
	}



	// -----------------------------------------------------------------
	// Getters and Setters
	// -----------------------------------------------------------------

	/**
	 * Animation ID
	 *
	 * @return {?Playlist} Animation or null.
	 * @public
	 */
	get animationId() {
		if (null === this._animation) {
			return null;
		}

		return this._animation.id;
	}

	/**
	 * Animation ID
	 *
	 * @param {?Playlist} animationId Animation ID.
	 * @return {void} Nothing.
	 * @public
	 */
	set animationId(animationId) {
		if (null === animationId) {
			this.stop();
		}
		else {
			this.setAnimation(animationId);
		}
	}

	/**
	 * Element Base Class(es)
	 *
	 * @return {string} Class.
	 * @public
	 */
	get baseClass() {
		return 'poe is-child';
	}

	/**
	 * Dragging
	 *
	 * @return {boolean} True/false.
	 * @public
	 */
	get dragging() {
		return !! (MateFlag.IsDragging & this._flags);
	}

	/**
	 * Flip
	 *
	 * @return {boolean} True/false.
	 * @public
	 */
	get flipped() {
		return !! (MateFlag.IsFlipped & this._flags);
	}

	/**
	 * Flip
	 *
	 * @param {boolean} v True/false.
	 * @return {void} Nothing.
	 * @public
	 */
	set flipped(v) {
		// No flip.
		if (! v) {
			this._flags &= ~MateFlag.IsFlipped;
		}
		// Yes flip.
		else {
			this._flags |= MateFlag.IsFlipped;
		}
	}

	/**
	 * Mate ID
	 *
	 * @return {number} Mate ID.
	 * @public
	 */
	get mateId() {
		return this._mateId;
	}



	// -----------------------------------------------------------------
	// Methods
	// -----------------------------------------------------------------

	/**
	 * Reset Animation
	 *
	 * @return {void} Nothing.
	 */
	resetAnimation() {
		if (null !== this._animation) {
			delete this._animation;
			this._animation = null;
		}

		if (null !== this._steps) {
			delete this._steps;
			this._steps = null;

			delete this._step;
			this._step = null;
		}
	}

	/**
	 * Set Animation
	 *
	 * @param {!Playlist} animationId Animation ID.
	 * @param {number=} x Start from X.
	 * @param {number=} y Start from Y.
	 * @return {void} Nothing.
	 */
	setAnimation(animationId, x, y) {
		// Stop any in-progress ticks.
		this.cancelTick();

		animationId = /** @type {!Playlist} */ (parseInt(animationId, 10) || 0);

		// Disable the exit possibility if we're changing animations and the property doesn't hold.
		if (
			(null === this._animation) ||
			(animationId !== this._animation.id) ||
			! (SceneFlag.AllowExit & this._animation.scenes[0].flags)
		) {
			// Turn off.
			this._flags &= ~MateFlag.MayExit;
		}

		// Make sure it is valid.
		this._animation = animation(animationId);
		if (! this.checkAnimation()) {
			Poe.log(
				`Invalid animation ID: ${animationId}`,
				LogType.Error
			);

			return;
		}

		// Allow off-screen exits?
		if (
			(SceneFlag.AllowExit & this._animation.scenes[0].flags) &&
			! (MateFlag.MayExit & this._flags) &&
			1 === Math.floor(Math.random() * 2)
		) {
			// Turn on.
			this._flags |= MateFlag.MayExit;
		}

		// Stack behind?
		if (! (AnimationFlag.StackBehind & this._animation.flags)) {
			// Turn off.
			this._flags &= ~MateFlag.IsBehind;
		}
		else {
			// Turn on.
			this._flags |= MateFlag.IsBehind;
		}

		// Set the starting position.
		this.setAnimationStart(x, y);

		// Handle the steps.
		this.setSteps();

		// Spawn required child.
		this.spawnChild();

		// Tick it.
		this.maybeTick();
	}

	/**
	 * Check Animation
	 *
	 * Check a newly-assigned animation ID.
	 *
	 * @return {boolean} True/false.
	 */
	checkAnimation() {
		if (
			null === this._animation ||
			(AnimationFlag.NoChildren & this._animation.flags)
		) {
			this.stop();
			return false;
		}

		return true;
	}

	/**
	 * Set Animation Starting Position
	 *
	 * @param {number=} x Start from X.
	 * @param {number=} y Start from Y.
	 * @return {void} Nothing.
	 */
	setAnimationStart(x, y) {
		if (null === this._animation) {
			return;
		}

		// Force the position.
		if ('number' === typeof x && 'number' === typeof y) {
			this.setPosition(x, y, true);
		}
		// If the animation has its own starting point, start there.
		else if (null !== this._animation.scenes[0].start) {
			this.setPosition(
				this._animation.scenes[0].start[0],
				this._animation.scenes[0].start[1],
				true
			);

			// Turn flip off.
			this._flags &= ~MateFlag.IsFlipped;
		}
	}

	/**
	 * Set Next Animation
	 *
	 * @return {void} Nothing.
	 */
	setNextAnimation() {
		if (null === this._animation || null === this._animation.next) {
			this.stop();
			return;
		}

		/** @const {?Playlist} */
		const next = chooseAnimation(this._animation.next);
		if (null === next) {
			this.stop();
			return;
		}

		// Set it!
		this.setAnimation(next);
	}

	/**
	 * Set Edge Animation
	 *
	 * @return {void} Nothing.
	 */
	setEdgeAnimation() {
		if (null === this._animation || null === this._animation.edge) {
			this.stop();
			return;
		}

		/** @const {?Playlist} */
		const next = chooseAnimation(this._animation.edge);
		if (null === next) {
			this.stop();
			return;
		}

		// Set it!
		this.setAnimation(next);
	}

	/**
	 * Set Steps
	 *
	 * @return {void} Nothing.
	 */
	setSteps() {
		if (null === this._animation) {
			return;
		}

		delete this._steps;
		this._steps = generateSceneSteps(this._animation.scenes);
		delete this._step;
		this._step = null;
	}

	/**
	 * Set Position
	 *
	 * @param {number} x X position.
	 * @param {number} y Y position.
	 * @param {boolean=} absolute Absolute.
	 * @return {void} Nothing.
	 */
	setPosition(x, y, absolute) {
		x = parseFloat(x) || 0;
		y = parseFloat(y) || 0;

		if (absolute) {
			this._x = x;
			this._y = y;
		}
		else if (x || y) {
			this._x += x;
			this._y += y;
		}

		// No animations go below the screen edge.
		if (this._y >= Poe.height - TILE_SIZE) {
			this._y = Poe.height - TILE_SIZE;
		}
	}

	/**
	 * Check Gravity
	 *
	 * @return {boolean} True if changes were made.
	 */
	checkGravity() {
		if (
			null !== this._animation &&
			this._y < Poe.height - TILE_SIZE
		) {
			this.stop();
			return true;
		}

		return false;
	}

	/**
	 * Check Bottom
	 *
	 * @param {?Direction} dir Direction of movement.
	 * @return {boolean} True if changes were made.
	 */
	checkBottom(dir) {
		if (
			null !== this._animation &&
			Direction.Down === dir &&
			this._y >= Poe.height - TILE_SIZE
		) {
			this.setPosition(this._x, Poe.height - TILE_SIZE, true);
			this.setEdgeAnimation();
			return true;
		}

		return false;
	}

	/**
	 * Check Floor
	 *
	 * @return {void} Nothing.
	 */
	checkFloor() {
		if (this._y === Poe.height - TILE_SIZE) {
			// Turn on.
			this._flags |= MateFlag.OnFloor;
		}
		else {
			// Turn off.
			this._flags &= ~MateFlag.OnFloor;
		}
	}

	/* eslint-disable no-unused-vars */

	/**
	 * Check Left
	 *
	 * @param {?Direction} dir Direction of movement.
	 * @return {boolean} True if changes were made.
	 */
	checkLeft(dir) {
		return false;
	}

	/**
	 * Check Right
	 *
	 * @param {?Direction} dir Direction of movement.
	 * @return {boolean} True if changes were made.
	 */
	checkRight(dir) {
		return false;
	}

	/* eslint-enable no-unused-vars */

	/**
	 * Check Top
	 *
	 * @param {?Direction} dir Direction of movement.
	 * @return {boolean} True if changes were made.
	 */
	checkTop(dir) {
		if (null !== this._animation && Direction.Up === dir && 0 >= this._y) {
			this.setPosition(this._x, 0, true);
			this.setEdgeAnimation();
			return true;
		}

		return false;
	}



	// -----------------------------------------------------------------
	// State
	// -----------------------------------------------------------------

	/**
	 * Is Disabled?
	 *
	 * @return {boolean} True/false.
	 */
	isDisabled() {
		return null === this._el || null === this._animation;
	}



	// -----------------------------------------------------------------
	// Destruction
	// -----------------------------------------------------------------

	/**
	 * Destructor
	 *
	 * @return {void} Nothing.
	 */
	destructor() {
		// Stop the animation.
		if (null !== this._animation) {
			this.stop();
		}

		// Remove the elements.
		if (null !== this._el) {
			Poe.unobserve(this._el);
			document.body.removeChild(this._el);
			delete this._el;
			this._el = null;
		}
	}

	/**
	 * Stop
	 *
	 * @return {void} Nothing.
	 */
	stop() {
		this.cancelTick();

		this.resetAnimation();

		this.flipped = false;
		this._flags &= ~(MateFlag.IsDragging | MateFlag.MayExit);
		this.maybePaint();
	}



	// -----------------------------------------------------------------
	// Helpers
	// -----------------------------------------------------------------

	/**
	 * Cancel Tick
	 *
	 * @return {void} Nothing.
	 */
	cancelTick() {
		if (null !== this._raf) {
			cancelAnimationFrame(this._raf);
			this._raf = null;
		}
	}

	/**
	 * Maybe Tick
	 *
	 * @return {void} Nothing.
	 */
	maybeTick() {
		// Queue a tick!
		if (null === this._raf) {
			this._raf = requestAnimationFrame((n) => this.tick(n));
		}
	}

	/**
	 * Tick
	 *
	 * @param {number} now Now.
	 * @return {void} Nothing.
	 */
	tick(now) {
		this._raf = null;

		// There's nothing to tick.
		if (
			null === this._el ||
			null === this._animation ||
			null === this._steps
		) {
			return;
		}

		// Queue up the next tick prematurely to avoid overlap.
		this.maybeTick();

		if (this._nextTick <= now) {
			if (this.step(now)) {
				this.maybePaint();
			}
			else {
				this.cancelTick();
				this.stop();
				return;
			}
		}
	}

	/**
	 * Step
	 *
	 * @param {number} now Now.
	 * @return {boolean} True/false.
	 */
	step(now) {
		// There is no animation; we shouldn't be doing anything.
		if (null === this._animation) {
			return false;
		}

		/** @const {!Object} */
		const next = this._steps.next();

		/** @const {Step} */
		const step = next.value;

		/** @const {number} */
		const interval = step.interval / Poe.speed;

		// Adjust the next animation time.
		this._nextTick = now + interval;

		// Set the frame.
		this._frame = step.frame;

		// Play audio?
		if (null !== step.sound && Poe.audio) {
			makeNoise(step.sound);
		}

		if (step.x || step.y) {
			// Flip the X if we need to.
			if (this.flipped) {
				step.x = 0 - step.x;
			}

			// Move it along.
			this.setPosition(step.x, step.y);
		}

		// The animation is over.
		if (next.done) {
			this.cancelTick();

			// Should we flip it?
			if (step.flip) {
				// We have to delay this until after this step.
				setTimeout(() => {
					this.flipped = ! this.flipped;
				}, interval);
			}

			// Where too?
			this.setNextAnimation();

			return true;
		}
		// We don't need to check anything else if we're dragging.
		else if (this.dragging) {
			return true;
		}
		// We need to flip.
		else if (step.flip) {
			this.flipped = ! this.flipped;
		}

		// Gravity.
		/** @const {boolean} */
		const gravity = !! (SceneFlag.ForceGravity & step.flags);
		if (gravity && ! (MateFlag.OnFloor & this._flags) && this.checkGravity()) {
			return true;
		}

		// Edge checks.
		if (! (SceneFlag.IgnoreEdges & step.flags)) {
			if (MateFlag.LeftSide & this._flags) {
				if (this.checkLeft(xDirection(step.x))) {
					return true;
				}
			}
			else if (MateFlag.RightSide & this._flags) {
				if (this.checkRight(xDirection(step.x))) {
					return true;
				}
			}

			if (MateFlag.TopSide & this._flags) {
				if (this.checkTop(yDirection(step.y))) {
					return true;
				}
			}
			// If the problem with the bottom was gravity, it's fixed.
			else if (! gravity && (MateFlag.BottomSide & this._flags)) {
				if (this.checkBottom(yDirection(step.y))) {
					return true;
				}
			}
		}

		return true;
	}

	/**
	 * Maybe Paint
	 *
	 * @return {void} Nothing.
	 */
	maybePaint() {
		// Don't paint if we don't have an element.
		if (null === this._el) {
			return;
		}

		// Start with the main element.

		/** @type {string} */
		let value = this.baseClass;
		if (null === this._animation) {
			value += ' is-disabled';
		}
		else if (this.dragging) {
			value += ' is-dragging';
		}
		else if (MateFlag.IsBehind & this._flags) {
			value += ' is-behind';
		}

		// Update it!
		if (value !== this._elClass) {
			this._elClass = value;
			this._el.className = value;
		}

		// Now style transforms.
		if (this._x || this._y) {
			value = `translate3d(${this._x}px, ${this._y}px, 0)`;
			if (this.flipped) {
				value += ' rotateY(180deg)';
			}
		}
		else if (this.flipped) {
			value = 'rotateY(180deg)';
		}
		else {
			value = '';
		}

		// Update it!
		if (value !== this._elStyleTransform) {
			this._elStyleTransform = value;
			this._el.style.transform = value;
		}

		// And finally the image class.
		value = `poe-img poe-f${this._frame}`;
		if (value !== this._imgClass) {
			this._imgClass = value;
			this._el.children[0].className = value;
		}
	}



	// -----------------------------------------------------------------
	// Callback Handlers
	// -----------------------------------------------------------------

	/**
	 * Any Intersection
	 *
	 * This updates the visibility flag.
	 *
	 * @return {void} Nothing.
	 */
	onIntersect() {
		if (
			0 - TILE_SIZE < this._x &&
			Poe.width > this._x &&
			0 - TILE_SIZE < this._y &&
			Poe.height > this._y
		) {
			// Turn on.
			this._flags |= MateFlag.IsVisible;
		}
		else {
			// Turn off.
			this._flags &= ~MateFlag.IsVisible;
		}
	}

	/**
	 * X Intersect
	 *
	 * A mate is within 20px of either side of the screen.
	 *
	 * @param {!IntersectionObserverEntry} e Entry.
	 * @return {void} Nothing.
	 */
	onXIntersect(e) {
		// Fully within the X boundaries.
		if (1 === e.intersectionRatio) {
			// Turn off.
			this._flags &= ~(MateFlag.LeftSide | MateFlag.RightSide);
		}
		// Approaching the left.
		else if (10 >= this._x) {
			// Turn on.
			this._flags |= MateFlag.LeftSide;
			// Turn off.
			this._flags &= ~MateFlag.RightSide;
		}
		// Approaching the right.
		else {
			// Turn off.
			this._flags &= ~MateFlag.LeftSide;
			// Turn on.
			this._flags |= MateFlag.RightSide;
		}

		// Possibly update the visibility state.
		this.onIntersect();
	}

	/**
	 * Y Intersect
	 *
	 * A mate is within 20px of the top or bottom of the screen.
	 *
	 * @param {!IntersectionObserverEntry} e Entry.
	 * @return {void} Nothing.
	 */
	onYIntersect(e) {
		// Fully within the Y boundaries.
		if (1 === e.intersectionRatio) {
			// Turn off.
			this._flags &= ~(MateFlag.TopSide | MateFlag.BottomSide | MateFlag.OnFloor);
		}
		// Approaching the top.
		else if (10 >= this._y) {
			// Turn on.
			this._flags |= MateFlag.TopSide;
			// Turn off.
			this._flags &= ~(MateFlag.BottomSide | MateFlag.OnFloor);
		}
		// Approaching the bottom.
		else {
			// Turn off.
			this._flags &= ~MateFlag.TopSide;
			// Turn on.
			this._flags |= MateFlag.BottomSide;
			// Check on the floor.
			this.checkFloor();
		}

		// Possibly update the visibility state.
		this.onIntersect();
	}
};

/**
 * Primary Mate
 */
export const Mate = class extends ChildMate {
	// -----------------------------------------------------------------
	// Construction
	// -----------------------------------------------------------------

	/**
	 * Constructor
	 *
	 * @param {number} mateId Mate ID.
	 */
	constructor(mateId) {
		super(mateId);

		/** @private {Object<string, Function>} */
		this._events = {};

		this.setupEvents();
	}

	/**
	 * Bind Event Listeners
	 *
	 * @return {void} Nothing.
	 */
	setupEvents() {
		// Only do this once.
		if (MateFlag.IsBound & this._flags) {
			return;
		}
		this._flags |= MateFlag.IsBound;

		this._events['contextmenu'] = (/** @type {Event} */ e) => { e.preventDefault(); };
		this._events['mousedown'] = (/** @type {!MouseEvent} */ e) => this.onDragStart(e);
		this._events['dblclick'] = (/** @type {Event} */ e) => {
			e.preventDefault();

			/** @const {?Event} */
			const event = new CustomEvent('poestop');
			if (null !== event) {
				window.dispatchEvent(event);
			}
		};

		this._el.addEventListener('contextmenu', this._events['contextmenu']);
		this._el.addEventListener(
			'mousedown',
			this._events['mousedown'],
			{ passive: true }
		);
		this._el.addEventListener(
			'dblclick',
			this._events['dblclick'],
			{ once: true }
		);
	}

	/**
	 * Start
	 *
	 * @return {void} Nothing.
	 */
	start() {
		// Prevent circular restarts.
		this.flipped = false;
		this._flags &= ~(MateFlag.IsDragging | MateFlag.MayExit);

		// Remove the next tick, but only if we're going to be paused for a long time.
		if (2000 < this._nextTick - performance.now()) {
			this._nextTick = 0;
		}

		/** @const {!Playlist} */
		const id = /** @type {!Playlist} */ (chooseAnimation(FIRST_CHOICES));

		// Choose something!
		switch (id) {
		// Fall from a random place.
		case Playlist.Fall:
			this.setAnimation(
				Playlist.Fall,
				Math.floor(Math.random() * (Poe.width - TILE_SIZE)),
				0 - TILE_SIZE
			);
			return;

		// Bath Dive.
		// Black Sheep.
		// Chase a Martian!
		// Stargaze.
		default:
			this.setAnimation(id);
		}
	}



	// -----------------------------------------------------------------
	// Getters and Setters
	// -----------------------------------------------------------------

	/**
	 * Element Base Class(es)
	 *
	 * @return {string} Class.
	 */
	get baseClass() {
		return 'poe';
	}



	// -----------------------------------------------------------------
	// Methods
	// -----------------------------------------------------------------

	/**
	 * Check Animation
	 *
	 * Check a newly-assigned animation ID.
	 *
	 * @return {boolean} True/false.
	 */
	checkAnimation() {
		if (
			null === this._animation ||
			(AnimationFlag.NoParents & this._animation.flags)
		) {
			// Primary mates cannot be unset in this way.
			/** @const {?Event} */
			const event = new CustomEvent('poestop');
			if (null !== event) {
				window.dispatchEvent(event);
			}

			return false;
		}

		// Kill children if falling.
		if (AnimationFlag.FallingAnimation & this._animation.flags) {
			// If we are totally off-screen, let's move it in-screen or it'll go on a while.
			if (0 - TILE_SIZE >= this._x) {
				this._x = 0;
				this._y = 0 - TILE_SIZE;
			}
			else if (Poe.width <= this._x) {
				this._x = Poe.width - TILE_SIZE;
				this._y = 0 - TILE_SIZE;
			}

			Poe.stopChildren();
		}

		return true;
	}

	/**
	 * Set Next Animation
	 *
	 * @return {void} Nothing.
	 */
	setNextAnimation() {
		/** @type {null|!Playlist|!Array<WeightedChoice>} */
		let choices = null;

		// If we aren't visible, do an entrance animation.
		if (! (MateFlag.IsVisible & this._flags)) {
			choices = ENTRANCE_CHOICES;
		}
		// Repeat the current animation if we're halfway out the door exiting.
		else if (
			(MateFlag.MayExit & this._flags) &&
			null !== this._animation &&
			(0 > this._x || Poe.width - TILE_SIZE < this._x)
		) {
			this.setAnimation(this._animation.id);
			return;
		}
		// If we have a valid next, use that.
		else if (null !== this._animation && null !== this._animation.next) {
			choices = this._animation.next;
		}
		// Otherwise pull from the default pool.
		else {
			choices = DEFAULT_CHOICES;
		}

		/** @const {?Playlist} */
		const next = chooseAnimation(choices);
		if (null === next) {
			Poe.log(
				'Unable to set the next animation.',
				LogType.Error
			);
			this.stop();
			return;
		}

		// Set it!
		this.setAnimation(next);
	}

	/**
	 * Set Edge Animation
	 *
	 * @return {void} Nothing.
	 */
	setEdgeAnimation() {
		if (null === this._animation) {
			this.stop();
			return;
		}

		// If there is no edge animation, choose something else.
		if (null === this._animation.edge) {
			this.setNextAnimation();
			return;
		}

		/** @const {?Playlist} */
		const next = chooseAnimation(this._animation.edge);
		if (null === next) {
			this.stop();
			return;
		}

		// Set it!
		this.setAnimation(next);
	}

	/**
	 * Check Gravity
	 *
	 * @return {boolean} True if changes were made.
	 */
	checkGravity() {
		if (
			null !== this._animation &&
			this._y < Poe.height - TILE_SIZE
		) {
			this.setAnimation(Playlist.Fall);
			Poe.stopChildren();
			return true;
		}

		return false;
	}

	/**
	 * Check Left
	 *
	 * @param {?Direction} dir Direction of movement.
	 * @return {boolean} True if changes were made.
	 */
	checkLeft(dir) {
		if (
			null !== this._animation &&
			! (MateFlag.MayExit & this._flags) &&
			Direction.Left === dir &&
			0 >= this._x
		) {
			this.setPosition(0, this._y, true);
			this.setEdgeAnimation();
			return true;
		}

		return false;
	}

	/**
	 * Check Right
	 *
	 * @param {?Direction} dir Direction of movement.
	 * @return {boolean} True if changes were made.
	 */
	checkRight(dir) {
		if (
			null !== this._animation &&
			! (MateFlag.MayExit & this._flags) &&
			Direction.Right === dir &&
			this._x >= Poe.width - TILE_SIZE
		) {
			this.setPosition(Poe.width - TILE_SIZE, this._y, true);
			this.setEdgeAnimation();
			return true;
		}

		return false;
	}



	// -----------------------------------------------------------------
	// Destruction
	// -----------------------------------------------------------------

	/**
	 * Destructor
	 *
	 * @return {void} Nothing.
	 */
	destructor() {
		// Cancel the ticks.
		this.cancelTick();

		// Make sure we've stopped.
		if (null !== this._animation) {
			this.resetAnimation();
		}

		if (null !== this._el) {
			Poe.unobserve(this._el);
			this.removeEvents();
			document.body.removeChild(this._el);
			delete this._el;
			this._el = null;
		}
	}

	/**
	 * Stop
	 *
	 * @return {void} Nothing.
	 */
	stop() {
		// The main sprite cannot be killed this way.
		this.start();
	}

	/**
	 * Remove Event Listeners
	 *
	 * @return {void} Nothing.
	 */
	removeEvents() {
		// Nothing bound, nothing to lose.
		if (! (MateFlag.IsBound & this._flags)) {
			return;
		}
		this._flags &= ~MateFlag.IsBound;

		/** @const {!Array<string>} */
		const keys = Object.keys(/** @type {!Object} */ (this._events));
		for (let i = 0; i < keys.length; ++i) {
			this._el.removeEventListener(keys[i], this._events[keys[i]]);
			delete this._events[keys[i]];
		}
	}



	// -----------------------------------------------------------------
	// Callback Handlers
	// -----------------------------------------------------------------

	/**
	 * Drag Start
	 *
	 * @param {!MouseEvent} e Event.
	 * @return {void} Nothing.
	 */
	onDragStart(e) {
		if (
			! this.dragging &&
			(1 === e.buttons) &&
			(0 === e.button)
		) {
			// Cancel all children.
			Poe.stopChildren();

			// Update the flags.
			this._flags |= MateFlag.IsDragging;
			this.flipped = false;
			this._flags &= ~MateFlag.MayExit;

			// Set the animation.
			this.setAnimation(Playlist.Drag);
		}
	}

	/**
	 * Drag
	 *
	 * @param {!MouseEvent} e Event.
	 * @return {void} Nothing.
	 */
	onDrag(e) {
		if (this.dragging) {
			/** @const {number} */
			const x = parseFloat(e.clientX) || 0;

			/** @const {number} */
			const y = parseFloat(e.clientY) || 0;

			this.setPosition(
				x - TILE_SIZE / 2,
				y - TILE_SIZE / 2,
				true
			);
		}
	}

	/**
	 * End Drag
	 *
	 * @return {void} Nothing.
	 */
	onEndDrag() {
		if (this.dragging) {
			this._flags &= ~MateFlag.IsDragging;
			this.setAnimation(Playlist.Fall);
		}
	}

	/**
	 * Resize
	 *
	 * @return {void} Nothing.
	 */
	onResize() {
		// Nothing to do.
		if (null === this._animation) {
			return;
		}

		// Do something from off-screen.
		if (! (MateFlag.IsVisible & this._flags)) {
			this.start();
			return;
		}

		/** @type {boolean} */
		let changed = false;

		// Check gravity.
		if (
			null !== this._step &&
			(SceneFlag.ForceGravity & this._step.flags) &&
			Poe.height - TILE_SIZE !== this._y
		) {
			this.setPosition(this._x, Poe.height - TILE_SIZE, true);
			changed = true;
		}

		// Climbing up and down requires being glued to the sides.
		if (Playlist.ClimbDown === this._animation.id) {
			/** @const {number} */
			const position = this.flipped ? 0 : Poe.width - TILE_SIZE;

			if (position !== this._x) {
				this.setPosition(position, this._y, true);
				changed = true;
			}
		}
		// Climbing up requires being glued to the left.
		else if (Playlist.ClimbUp === this._animation.id) {
			/** @const {number} */
			const position = this.flipped ? Poe.width - TILE_SIZE : 0;

			if (position !== this._x) {
				this.setPosition(position, this._y, true);
				changed = true;
			}
		}

		// Paint if we changed something.
		if (changed) {
			this.maybePaint();
		}
	}
};
