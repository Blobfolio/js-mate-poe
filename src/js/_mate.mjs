/**
 * @file Mates!
 */

import { NAME } from './_about.mjs';
import {
	animation,
	chooseAnimation,
	DEFAULT_CHOICES,
	ENTRANCE_CHOICES,
	FIRST_CHOICES
} from './_animations.mjs';
import { IMAGE } from './_bin.mjs';
import { xDirection, yDirection } from './_helpers.mjs';
import { makeNoise, TILE_SIZE } from './_media.mjs';
import { Poe } from './_poe.mjs';
import {
	Animation,
	Direction,
	Flags,
	LogType,
	Playlist,
	Scene,
	Sound,
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

		/** @private {Array<Step>} */
		this._steps = [];

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
				(Flags.IsFlipped & this._flags) ?
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
	 */
	get baseClass() {
		return 'poe is-child';
	}

	/**
	 * Stack Behind?
	 *
	 * @return {boolean} True/false.
	 */
	get behind() {
		return !! (Flags.IsBehind & this._flags);
	}

	/**
	 * Stack Behind?
	 *
	 * @param {boolean} v Value.
	 * @return {void} Nothing.
	 */
	set behind(v) {
		// Not visible.
		if (! v) {
			this._flags &= ~Flags.IsBehind;
		}
		// Yes visible.
		else {
			this._flags |= Flags.IsBehind;
		}
	}

	/**
	 * Bottom Side?
	 *
	 * @return {boolean} True/false.
	 */
	get bottomSide() {
		return !! (Flags.BottomSide & this._flags);
	}

	/**
	 * Bottom Side?
	 *
	 * @param {boolean} v Value.
	 * @return {void} Nothing.
	 */
	set bottomSide(v) {
		// Not visible.
		if (! v) {
			this._flags &= ~Flags.BottomSide;
		}
		// Yes visible.
		else {
			this._flags |= Flags.BottomSide;
		}
	}

	/**
	 * Dragging
	 *
	 * @return {boolean} True/false.
	 */
	get dragging() {
		return !! (Flags.IsDragging & this._flags);
	}

	/**
	 * Dragging
	 *
	 * @param {boolean} v True/false.
	 * @return {void} Nothing.
	 */
	set dragging(v) {
		// No flip.
		if (! v) {
			this._flags &= ~Flags.IsDragging;
		}
		// Yes flip.
		else {
			this._flags |= Flags.IsDragging;
		}
	}

	/**
	 * Element Class(es)
	 *
	 * @return {string} Class.
	 */
	get elClass() {
		return this._elClass;
	}

	/**
	 * Set Element Class(es)
	 *
	 * @param {string} v Classes.
	 * @return {void} Nothing.
	 */
	set elClass(v) {
		this._elClass = v;
		if (null !== this._el) {
			this._el.className = v;
		}
	}

	/**
	 * Calculate Element Class(es)
	 *
	 * @return {string} Class.
	 */
	calculateElClass() {
		/** @type {string} */
		let out = this.baseClass;

		// If there is no animation, we're done.
		if (null === this._animation) {
			out += ' is-disabled';
			return out;
		}

		// Dragging?
		if (this.dragging) {
			out += ' is-dragging';
			return out;
		}

		// Behind?
		if (this.behind) {
			out += ' is-behind';
		}

		return out;
	}

	/**
	 * Element Transform Style
	 *
	 * @return {string} Style.
	 */
	get elStyleTransform() {
		return this._elStyleTransform;
	}

	/**
	 * Set Element Transform Style
	 *
	 * @param {string} v Style.
	 * @return {void} Nothing.
	 */
	set elStyleTransform(v) {
		this._elStyleTransform = v;
		if (null !== this._el) {
			this._el.style.transform = v;
		}
	}

	/**
	 * Calculate Element Transform Style
	 *
	 * @return {string} Style.
	 */
	calculateElStyleTransform() {
		/** @type {string} */
		let out = '';

		// Position first.
		if (this._x || this._y) {
			out += `translate3d(${this._x}px, ${this._y}px, 0)`;
		}

		// Flipped?
		if (Flags.IsFlipped & this._flags) {
			out += ' rotateY(180deg)';
		}

		return out;
	}

	/**
	 * Flip
	 *
	 * @return {boolean} True/false.
	 */
	get flipped() {
		return !! (Flags.IsFlipped & this._flags);
	}

	/**
	 * Flip
	 *
	 * @param {boolean} v True/false.
	 * @return {void} Nothing.
	 */
	set flipped(v) {
		// No flip.
		if (! v) {
			this._flags &= ~Flags.IsFlipped;
		}
		// Yes flip.
		else {
			this._flags |= Flags.IsFlipped;
		}
	}

	/**
	 * Image Class(es)
	 *
	 * @return {string} Class.
	 */
	get imgClass() {
		return this._imgClass;
	}

	/**
	 * Set Image Class(es)
	 *
	 * @param {string} v Style.
	 * @return {void} Nothing.
	 */
	set imgClass(v) {
		this._imgClass = v;
		if (null !== this._el) {
			this._el.children[0].className = v;
		}
	}

	/**
	 * Calculate Image Class(es)
	 *
	 * @return {string} Style.
	 */
	calculateImgClass() {
		/** @type {string} */
		let out = 'poe-img';

		// If there is no animation, we're done.
		if (0 < this._frame) {
			out += ' poe-f' + this._frame;
		}

		return out;
	}

	/**
	 * Left Side?
	 *
	 * @return {boolean} True/false.
	 */
	get leftSide() {
		return !! (Flags.LeftSide & this._flags);
	}

	/**
	 * Left Side?
	 *
	 * @param {boolean} v Value.
	 * @return {void} Nothing.
	 */
	set leftSide(v) {
		// Not visible.
		if (! v) {
			this._flags &= ~Flags.LeftSide;
		}
		// Yes visible.
		else {
			this._flags |= Flags.LeftSide;
		}
	}

	/**
	 * Mate ID
	 *
	 * @return {number} Mate ID.
	 */
	get mateId() {
		return this._mateId;
	}

	/**
	 * May Exit
	 *
	 * @return {boolean} True/false.
	 */
	get mayExit() {
		return !! (Flags.MayExit & this._flags);
	}

	/**
	 * May Exit
	 *
	 * @param {boolean} v True/false.
	 * @return {void} Nothing.
	 */
	set mayExit(v) {
		// No flip.
		if (! v) {
			this._flags &= ~Flags.MayExit;
		}
		// Yes flip.
		else {
			this._flags |= Flags.MayExit;
		}
	}

	/**
	 * On Floor?
	 *
	 * @return {boolean} True/false.
	 */
	get onFloor() {
		return !! (Flags.OnFloor & this._flags);
	}

	/**
	 * On Floor?
	 *
	 * @param {boolean} v Value.
	 * @return {void} Nothing.
	 */
	set onFloor(v) {
		// Not visible.
		if (! v) {
			this._flags &= ~Flags.OnFloor;
		}
		// Yes visible.
		else {
			this._flags |= Flags.OnFloor;
		}
	}

	/**
	 * Right Side?
	 *
	 * @return {boolean} True/false.
	 */
	get rightSide() {
		return !! (Flags.RightSide & this._flags);
	}

	/**
	 * Right Side?
	 *
	 * @param {boolean} v Value.
	 * @return {void} Nothing.
	 */
	set rightSide(v) {
		// Not visible.
		if (! v) {
			this._flags &= ~Flags.RightSide;
		}
		// Yes visible.
		else {
			this._flags |= Flags.RightSide;
		}
	}

	/**
	 * Top Side?
	 *
	 * @return {boolean} True/false.
	 */
	get topSide() {
		return !! (Flags.TopSide & this._flags);
	}

	/**
	 * Top Side?
	 *
	 * @param {boolean} v Value.
	 * @return {void} Nothing.
	 */
	set topSide(v) {
		// Not visible.
		if (! v) {
			this._flags &= ~Flags.TopSide;
		}
		// Yes visible.
		else {
			this._flags |= Flags.TopSide;
		}
	}

	/**
	 * Visible?
	 *
	 * @return {boolean} True/false.
	 */
	get visible() {
		return !! (Flags.IsVisible & this._flags);
	}

	/**
	 * Visible?
	 *
	 * @param {boolean} v Value.
	 * @return {void} Nothing.
	 */
	set visible(v) {
		// Not visible.
		if (! v) {
			this._flags &= ~Flags.IsVisible;
		}
		// Yes visible.
		else {
			this._flags |= Flags.IsVisible;
		}
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

		if (this._steps.length) {
			delete this._steps;
			this._steps = [];
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
			! (Flags.AllowExit & this._animation.scenes[0].flags)
		) {
			this.mayExit = false;
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
			(Flags.AllowExit & this._animation.scenes[0].flags) &&
			! this.mayExit &&
			5 === Math.floor(Math.random() * 10)
		) {
			this.mayExit = true;
		}

		// Stack behind?
		this.behind = !! (Flags.StackBehind & this._animation.flags);

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
			(Flags.NoChildren & this._animation.flags)
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
			this._flags &= ~Flags.IsFlipped;
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
		this._steps = [];

		/** @type {number} */
		let step = 0;

		/** @type {number} */
		let last = 0 - this._animation.scenes[0].from[2];

		// Loop through the scenes.
		for (let i = 0; i < this._animation.scenes.length; ++i) {
			/** @const {Scene} */
			const scene = this._animation.scenes[i];

			/** @const {number} */
			const framesLength = scene.frames.length;

			/** @const {number} */
			const repeat = null !== scene.repeat ? scene.repeat[0] : 0;

			/** @const {number} */
			const repeatFrom = repeat ? scene.repeat[1] : 0;

			/** @const {number} */
			const stepsLength = framesLength + (framesLength - repeatFrom) * repeat;

			// Figure out what each slice should look like.
			for (let j = 0; j < stepsLength; ++j) {
				/** @const {number} */
				const progress = j / stepsLength;

				/** @const {number} */
				const time = Math.floor(last + scene.from[2] + (scene.to[2] - scene.from[2]) * progress);

				// What frame should we show?
				/** @type {number} */
				let frame = 0;
				if (j < framesLength) {
					frame = scene.frames[j];
				}
				else if (! repeatFrom) {
					frame = scene.frames[j % framesLength];
				}
				else {
					frame = scene.frames[repeatFrom + (j - repeatFrom) % (framesLength - repeatFrom)];
				}

				/** @type {?Sound} */
				let sound = null;
				if (null !== scene.sound && scene.sound[1] === j) {
					sound = /** @type {!Sound} */ (scene.sound[0]);
				}

				this._steps[step] = /** @type {!Step} */ ({
					step: step,
					scene: i,
					interval: time - last,
					frame: frame,
					x: scene.from[0] + (scene.to[0] - scene.from[0]) * progress,
					y: scene.from[1] + (scene.to[1] - scene.from[1]) * progress,
					sound: sound,
					flip: !! ((Flags.AutoFlip & scene.flags) && stepsLength - 1 === j),
					flags: scene.flags,
				});

				++step;
				last = time;
			}
		}

		// Reverse the steps so we can pop() instead of shift().
		this._steps = this._steps.reverse();
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
		this.onFloor = this._y === Poe.height - TILE_SIZE;
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
		this.dragging = false;
		this.mayExit = false;
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
		// There's nothing to tick.
		if (
			null === this._el ||
			null === this._animation ||
			! this._steps.length
		) {
			this._raf = null;
			return;
		}

		// Queue up the next tick prematurely to avoid overlap.
		this._raf = requestAnimationFrame((n) => this.tick(n));

		if (this._nextTick <= now) {
			/** @const {?boolean} */
			const result = this.step(now);

			// The animation is over with nothing replacing it.
			if (false === result) {
				this.cancelTick();
				this.stop();
				return;
			}
			// We didn't abort due to time constraints.
			else if (true === result) {
				this.maybePaint();
			}
		}
	}

	/**
	 * Step
	 *
	 * @param {number} now Now.
	 * @return {?boolean} True/false.
	 */
	step(now) {
		// There is no animation; we shouldn't be doing anything.
		if (null === this._animation) {
			return false;
		}

		/** @const {Step} */
		const step = this._steps.pop();

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

		/** @type {number} */
		let x = step.x;

		/** @type {number} */
		const y = step.y;

		// Flip the X if we need to.
		if (this.flipped) {
			x = 0 - x;
		}

		// Move it along.
		this.setPosition(x, y);

		// The animation is over.
		if (! this._steps.length) {
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
		// We need to flip.
		else if (step.flip) {
			this.flipped = ! this.flipped;
		}

		// Gravity.
		/** @const {boolean} */
		const gravity = !! (Flags.ForceGravity & step.flags);
		if (gravity && ! this.onFloor && this.checkGravity()) {
			return true;
		}

		// Edge checks.
		if (! this.dragging && ! (Flags.IgnoreEdges & step.flags)) {
			if (this.leftSide) {
				if (this.checkLeft(xDirection(x))) {
					return true;
				}
			}
			else if (this.rightSide) {
				if (this.checkRight(xDirection(x))) {
					return true;
				}
			}

			if (this.topSide) {
				if (this.checkTop(yDirection(y))) {
					return true;
				}
			}
			// If the problem with the bottom was gravity, it's fixed.
			else if (! gravity && this.bottomSide) {
				if (this.checkBottom(yDirection(y))) {
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

		// Start with the element class. This won't change as frequently.

		/** @type {string} */
		let value = this.calculateElClass();
		if (value !== this._elClass) {
			this.elClass = value;
		}

		// Style transforms?
		value = this.calculateElStyleTransform();
		if (value !== this._elStyleTransform) {
			this.elStyleTransform = value;
		}

		// The image class?
		value = this.calculateImgClass();
		if (value !== this._imgClass) {
			this.imgClass = value;
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
		this.visible = 0 - TILE_SIZE < this._x &&
			Poe.width > this._x &&
			0 - TILE_SIZE < this._y &&
			Poe.height > this._y;
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
			this.leftSide = false;
			this.rightSide = false;
		}
		// Approaching the left.
		else if (10 >= this._x) {
			this.leftSide = true;
			this.rightSide = false;
		}
		// Approaching the right.
		else {
			this.leftSide = false;
			this.rightSide = true;
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
			this.topSide = false;
			this.bottomSide = false;
			this.onFloor = false;
		}
		// Approaching the top.
		else if (10 >= this._y) {
			this.topSide = true;
			this.bottomSide = false;
			this.onFloor = false;
		}
		// Approaching the bottom.
		else {
			this.topSide = false;
			this.bottomSide = true;
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
		if (Flags.IsBound & this._flags) {
			return;
		}
		this._flags |= Flags.IsBound;

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
		this.dragging = false;
		this.mayExit = false;

		// Remove the next tick, but only if we're going to be paused for a long time.
		if (200 < this._nextTick - performance.now()) {
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
			(Flags.NoParents & this._animation.flags)
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
		if (Flags.FallingAnimation & this._animation.flags) {
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

		if (! this.visible) {
			choices = ENTRANCE_CHOICES;
		}
		else if (null !== this._animation && null !== this._animation.next) {
			choices = this._animation.next;
		}
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
			! this.mayExit &&
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
			! this.mayExit &&
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
		if (! (Flags.IsBound & this._flags)) {
			return;
		}
		this._flags &= ~Flags.IsBound;

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
			this.dragging = true;
			this.flipped = false;
			this.mayExit = false;

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
			this.dragging = false;
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
		if (! this.visible) {
			this.start();
			return;
		}

		/** @type {boolean} */
		let changed = false;

		// Check gravity.
		if (
			this._steps.length &&
			(Flags.ForceGravity & this._steps[this._steps.length - 1].flags) &&
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
