/**
 * @file The sprite object!
 */

import {
	animation,
	DEFAULT_CHOICES,
	ENTRANCE_CHOICES,
	FIRST_CHOICES,
	verifyAnimationId
} from './_animations.mjs';
import { makeNoise } from './_audio.mjs';
import { IMAGE } from './_bin.mjs';
import {
	bindEvent,
	cbPreventDefault,
	clearEvents,
	rankedChoice,
	screenHeight,
	screenWidth
} from './_helpers.mjs';
import { TILE_SIZE } from './_image.mjs';
import {
	FLAGS,
	PLAYLIST,
	MateAnimation,
	MateAnimationPossibility,
	MateAnimationScene,
	MateAnimationSetup,
	MateAnimationStep,
	SOUNDS
} from './_types.mjs';



/**
 * Mates
 *
 * These should be static properties on Mate but Javascript classes are a joke and neither eslint nor Closure Compiler understand them.
 *
 * @type {{
	length: number,
	primary: ?Mate,
	children: !Object<number, Mate>
 * }}
 */
let _mates = {
	length: 0,
	primary: null,
	children: {},
};

/**
 * Mate
 */
export const Mate = class {
	// -----------------------------------------------------------------
	// Setup
	// -----------------------------------------------------------------

	/**
	 * A Poe Sprite!
	 *
	 * @param {boolean} child Treat as child sprite.
	 * @param {number} mateId Mate ID.
	 */
	constructor(child, mateId) {
		child = !! child;
		mateId = parseInt(mateId, 10) || 0;

		/**
		 * The Mate ID
		 *
		 * @public {number}
		 */
		this.mateId = mateId;

		/**
		 * The Child Mate ID
		 *
		 * @private {number}
		 */
		this.childMateId = 0;

		/**
		 * Mate is Child?
		 *
		 * @private {boolean}
		 */
		this.child = child;

		/**
		 * The Mate Element
		 *
		 * @private {?HTMLDivElement}
		 */
		this.el = /** @type {HTMLDivElement} */ (document.createElement('DIV'));
		this.el.className = 'poe' + (this.child ? ' is-child' : '');

		/** @type {HTMLImageElement} */
		let img = /** @type {HTMLImageElement} */ (document.createElement('IMG'));
		img.src = IMAGE;
		this.el.appendChild(img);

		// Add the element to the body.
		document.body.appendChild(this.el);

		/**
		 * Whether Mate Can Walk Offscreen
		 *
		 * @private {boolean}
		 */
		this.mayExit = false;

		/**
		 * Current X Position
		 *
		 * @private {number}
		 */
		this.x = -100;

		/**
		 * Current Y Position
		 *
		 * @private {number}
		 */
		this.y = -100;

		/**
		 * Whether We've Bound Event Listeners
		 *
		 * @private {boolean}
		 */
		this.bound = false;

		/**
		 * RAF Queue
		 *
		 * @private {boolean}
		 */
		this.queued = false;

		/**
		 * Current Frame
		 *
		 * @private {number}
		 */
		this.frame = 0;

		/**
		 * Steps to Paint
		 *
		 * @private {Array<MateAnimationStep>}
		 */
		this.steps = [];

		/**
		 * Mate is Flipped?
		 *
		 * @private {boolean}
		 */
		this.flipped = false;

		/**
		 * Mate is Dragging?
		 *
		 * @private {boolean}
		 */
		this.dragging = false;

		/**
		 * Current Animation
		 *
		 * @private {?MateAnimation}
		 */
		this.animation = null;

		// Set up element bindings.
		this.setupEl();
	}

	/**
	 * Create Element
	 *
	 * @return {void} Nothing.
	 * @private
	 */
	setupEl() {
		// Don't double-bind.
		if (this.bound) {
			return;
		}
		this.bound = true;

		// Bind events to the main Mate.
		if (this.child) {
			// Add the fade-in class after a little delay so it paints.
			setTimeout(() => {
				if (null !== this.el) {
					this.el.classList.add('fade-in');
				}
			}, 5);
		}
		else {
			bindEvent(
				this.el,
				'contextmenu',
				cbPreventDefault
			);
			bindEvent(
				this.el,
				'mousedown',
				(/** @type {MouseEvent} */ e) => this.onDragStart(e),
				{ passive: true }
			);
			bindEvent(
				this.el,
				'dblclick',
				(/** @type {Event} */ e) => {
					e.preventDefault();

					/** @const {?Event} */
					const event = new CustomEvent('poeShutdown');
					if (null !== event) {
						window.dispatchEvent(event);
					}
				},
				{ once: true }
			);
		}
	}

	/**
	 * Clean-Up
	 *
	 * Remove all references so the object can be deleted from memory.
	 *
	 * @param {?boolean=} fade Fade out.
	 * @return {void} Nothing.
	 */
	detach(fade) {
		fade = !! fade;
		if (fade && null !== this.el) {
			this.el.classList.remove('fade-in');
			setTimeout(() => this.detach(), 500);
			return;
		}

		if (null !== this.el) {
			// Remove bound events.
			clearEvents(this.el);

			// Kill the element.
			document.body.removeChild(this.el);
			delete this.el;
			this.el = null;
		}

		if (this.childMateId) {
			this.detachChild();
		}

		/** @const {?Event} */
		const event = new CustomEvent('poeDetached', {detail: {mateId: this.mateId}});
		if (null !== event) {
			window.dispatchEvent(event);
		}
	}

	/**
	 * Disable Mate
	 *
	 * @return {void} Nothing.
	 * @private
	 */
	detachChild() {
		if (this.childMateId) {
			/** @type {?Mate} */
			let child = Mate.get(this.childMateId);
			if (null !== child) {
				child.detach();
			}

			this.childMateId = 0;
		}
	}



	// -----------------------------------------------------------------
	// Getters
	// -----------------------------------------------------------------

	/**
	 * Is Child?
	 *
	 * @return {boolean} True/false.
	 * @public
	 */
	isChild() {
		return !! this.child;
	}

	/**
	 * Is Dragging?
	 *
	 * @return {boolean} True/false.
	 * @public
	 */
	isDragging() {
		return !! this.dragging;
	}

	/**
	 * Is Flipped?
	 *
	 * @return {boolean} True/false.
	 * @public
	 */
	isFlipped() {
		return !! this.flipped;
	}

	/**
	 * Is Partially Visible?
	 *
	 * @return {boolean} True/false.
	 * @private
	 */
	isPartiallyVisible() {
		return (this.isPartiallyVisibleX() || this.isPartiallyVisibleY());
	}

	/**
	 * Is Partially Visible?
	 *
	 * @return {boolean} True/false.
	 * @private
	 */
	isPartiallyVisibleX() {
		return this.isVisibleX() &&
			(0 > this.x || screenWidth() - TILE_SIZE < this.x);

	}

	/**
	 * Is Partially Visible?
	 *
	 * @return {boolean} True/false.
	 * @private
	 */
	isPartiallyVisibleY() {
		return this.isVisibleY() &&
			(0 > this.y || screenHeight() - TILE_SIZE < this.y);

	}

	/**
	 * Is Visible?
	 *
	 * @return {boolean} True/false.
	 * @private
	 */
	isVisible() {
		return this.isVisibleX() && this.isVisibleY();
	}

	/**
	 * Is Visible?
	 *
	 * @return {boolean} True/false.
	 * @private
	 */
	isVisibleX() {
		return null !== this.el &&
			(0 - TILE_SIZE < this.x) &&
			(screenWidth() > this.x);
	}

	/**
	 * Is Visible?
	 *
	 * @return {boolean} True/false.
	 * @private
	 */
	isVisibleY() {
		return null !== this.el &&
			(0 - TILE_SIZE < this.y) &&
			(screenHeight() > this.y);
	}



	// -----------------------------------------------------------------
	// Setters
	// -----------------------------------------------------------------

	/**
	 * Set Animation
	 *
	 * @param {number} id Animation ID.
	 * @param {?number=} x Start at X.
	 * @param {?number=} y Start at Y.
	 * @return {boolean} True/false.
	 * @public
	 */
	setAnimation(id, x, y) {
		if (0 >= id) {
			console.error(`Invalid animation ID: ${id}`);
			this.detach();
			return false;
		}

		// Disable exit possibility if we're changing animations or the animation doesn't allow exiting.
		if (
			null === this.animation ||
			id !== this.animation.id ||
			! (FLAGS.allowExit & this.animation.scene[0].flags)
		) {
			this.mayExit = false;
		}

		// Pull the animation details, if any.
		this.animation = animation(id);
		if (
			(null === this.animation) ||
			(this.child && (FLAGS.noChildren & this.animation.flags))
		) {
			// If the parent got a bad animation request, we should hear about it!
			if (! this.child) {
				console.error(`Invalid animation ID: ${id}`);
			}

			this.detach();
			return false;
		}

		// We might need to force the child's destruction.
		if (
			(PLAYLIST.Fall === id) ||
			(
				this.childMateId &&
				this.animation.childId
			)
		) {
			this.detachChild();
		}

		// Should we allow the mate to walk off-screen?
		if ((FLAGS.allowExit & this.animation.scene[0].flags) && ! this.mayExit) {
			// Give it a one-in-five chance.
			this.mayExit = 4 === Math.floor(Math.random() * 5);
		}

		// If this animation has a fixed starting place, go ahead and set it.
		if (
			null !== this.animation.scene[0].startFrom &&
			'number' === typeof this.animation.scene[0].startFrom.x &&
			'number' === typeof this.animation.scene[0].startFrom.y
		) {
			x = this.animation.scene[0].startFrom.x;
			y = this.animation.scene[0].startFrom.y;
			this.setFlip(false);
		}

		// Move it somewhere before we begin?
		if ('number' === typeof x && 'number' === typeof y) {
			this.setPosition(x, y, true);
		}

		// Precalculate the steps.
		this.steps = [];

		/** @const {number} */
		const sceneLength = this.animation.scene.length;

		/** @const {number} */
		const now = performance.now();

		/** @type {number} */
		let step = 0;

		/** @type {number} */
		let last = 0 - this.animation.scene[0].start.speed;

		// Loop through the scenes.
		for (let i = 0; i < sceneLength; ++i) {
			/** @const {MateAnimationScene} */
			const scene = this.animation.scene[i];

			/** @const {number} */
			const framesLength = scene.frames.length;

			/** @const {number} */
			const stepsLength = framesLength + (framesLength - scene.repeatFrom) * scene.repeat;

			/** @const {number} */
			const speedDiff = scene.end.speed - scene.start.speed;

			/** @const {number} */
			const xDiff = scene.end.x - scene.start.x;

			/** @const {number} */
			const yDiff = scene.end.y - scene.start.y;

			// Figure out what each slice should look like.
			for (let j = 0; j < stepsLength; ++j) {
				/** @const {number} */
				const progress = j / stepsLength;

				/** @const {number} */
				const time = Math.floor(last + scene.start.speed + speedDiff * progress);

				/** @const {number} */
				const interval = time - last;

				last = time;

				// What frame should we show?
				/** @type {number} */
				let frame = 0;
				if (j < framesLength) {
					frame = scene.frames[j];
				}
				else if (! scene.repeatFrom) {
					frame = scene.frames[j % framesLength];
				}
				else {
					frame = scene.frames[scene.repeatFrom + (j - scene.repeatFrom) % (framesLength - scene.repeatFrom)];
				}

				/** @type {?SOUNDS} */
				let audio = null;
				if (
					null !== scene.audio &&
					scene.audio.sound &&
					scene.audio.start === j
				) {
					audio = scene.audio.sound;
				}

				this.steps.push(/** @type {!MateAnimationStep} */ ({
					step: step,
					scene: i,
					time: now + time,
					interval: interval,
					frame: frame,
					x: scene.start.x + xDiff * progress,
					y: scene.start.y + yDiff * progress,
					audio: audio,
					flip: !! ((FLAGS.autoFlip & scene.flags) && stepsLength - 1 === j),
					flags: scene.flags,
				}));

				++step;
			}
		}

		// Reverse the steps so we can pop() instead of shift().
		this.steps = this.steps.reverse();

		// Set up the child if applicable.
		if (this.animation.childId) {
			this.attachChild();
		}

		// Do it!
		this.queuePaint();
		return true;
	}

	/**
	 * Set Child Animation
	 *
	 * @return {void} Nothing.
	 * @private
	 */
	attachChild() {
		/** @type {?MateAnimationSetup} */
		let setup = null;

		switch (this.animation.childId) {
		// Bath dive.
		// Black Sheep.
		// Stargazing.
		case PLAYLIST.BathDiveChild:
		case PLAYLIST.BlackSheepChild:
		case PLAYLIST.StargazeChild:
		case PLAYLIST.ChasingAMartianChild:
			setup = {
				id: this.animation.childId,
				x: null,
				y: null,
			};

			break;

		// Eat.
		case PLAYLIST.FlowerChild:
			setup = {
				id: PLAYLIST.FlowerChild,
				x: this.flipped ?
					this.x + TILE_SIZE * 0.9 :
					this.x - TILE_SIZE * 0.9,
				y: this.y,
			};

			break;

		// Abduction.
		case PLAYLIST.AbductionChild:
			setup = {
				id: PLAYLIST.AbductionChild,
				x: this.x,
				y: screenHeight() - TILE_SIZE * 2 - 4 * 120,
			};

			break;

		// Abduction beam.
		case PLAYLIST.AbductionBeamChild:
			setup = {
				id: PLAYLIST.AbductionBeamChild,
				x: this.x,
				y: screenHeight() - TILE_SIZE,
			};

			break;
		}

		// Nothing doing?
		if (null === setup) {
			return;
		}

		/** @type {?Mate} */
		let mate = Mate.init(true);
		if (null === mate) {
			this.childMateId = 0;
			return;
		}

		this.childMateId = mate.mateId;

		requestAnimationFrame(() => {
			mate.setFlip(this.flipped);
			mate.setAnimation(setup.id, setup.x, setup.y);
		});
	}

	/**
	 * Set Flip
	 *
	 * @param {boolean} flip Flip.
	 * @return {void} Nothing.
	 * @private
	 */
	setFlip(flip) {
		flip = !! flip;

		if (this.flipped !== flip) {
			this.flipped = flip;
			this.paintTransform();
		}
	}

	/**
	 * Toggle Flip
	 *
	 * @return {void} Nothing.
	 * @private
	 */
	flip() {
		this.setFlip(! this.flipped);
	}

	/**
	 * Move Sprite
	 *
	 * @param {number} x X position.
	 * @param {number} y Y position.
	 * @param {boolean=} absolute Jump to the literal position.
	 * @return {void} Nothing.
	 * @private
	 */
	setPosition(x, y, absolute) {
		x = parseFloat(x) || 0;
		y = parseFloat(y) || 0;

		// Move somewhere specific.
		if (absolute) {
			// No change.
			if (this.x === x && this.y === y) {
				return;
			}

			this.x = x;
			this.y = y;
		}
		else {
			// No change.
			if (! x && ! y) {
				return;
			}

			this.x += x;
			this.y += y;
		}

		// Literally move it.
		this.paintTransform();
	}



	// -----------------------------------------------------------------
	// Painting
	// -----------------------------------------------------------------

	/**
	 * Paint: Position/Flip
	 *
	 * @return {void} Nothing.
	 * @private
	 */
	paintTransform() {
		/* @type {string} */
		let css = '';

		// Position.
		if (this.x && this.y) {
			css += `translate(${this.x}px, ${this.y}px)`;
		}
		else if (this.x) {
			css += `translateX(${this.x}px)`;
		}
		else if (this.y) {
			css += `translateY(${this.y}px)`;
		}

		// Rotation.
		if (this.flipped) {
			css += ' rotateY(180deg)';
		}

		this.el.style.transform = css;
	}

	/**
	 * Paint: Tick
	 *
	 * @param {number} now Now.
	 * @return {void} Nothing.
	 * @private
	 */
	paint(now) {
		this.queued = false;

		/** @type {number} */
		let stepsLength = this.steps.length;

		// Should we be animating?
		if ((null === this.el) || ! stepsLength) {
			// If a child, make sure we kill it!
			if (this.child) {
				this.detach();
			}

			return;
		}

		// If we've exited, simply restart.
		if (this.mayExit && ! this.isVisible()) {
			this.start();
			return;
		}

		/** @type {?MateAnimationStep} */
		let step = null;
		while (undefined !== this.steps[stepsLength - 1] && this.steps[stepsLength - 1].time <= now) {
			step = this.steps.pop();
			--stepsLength;
		}

		// We might be a bit early.
		if (null === step) {
			this.queuePaint();
			return;
		}

		// Always set the frame.
		if (this.frame !== step.frame) {
			this.frame = step.frame;
			this.el.children[0].className = `poe-img poe-f${this.frame}`;
		}

		// Play audio?
		if (step.audio && /** @type {function():boolean} */ (window['Poe']['audio'])()) {
			makeNoise(step.audio);
		}

		// Pull dimensions once.

		/** @const {number} */
		const sw = screenWidth();

		/** @const {number} */
		const sh = screenHeight();

		// Flip it?

		/** @type {number} */
		let x = step.x;

		/** @const {number} */
		const y = step.y;

		if (this.flipped) {
			x = 0 - x;
		}

		// Move it along.
		this.setPosition(x, y);

		// No animations go below the screen edge.
		if (this.y >= sh - TILE_SIZE) {
			this.setPosition(this.x, sh - TILE_SIZE, true);
		}

		// The animation is over.
		if (! stepsLength) {
			// Use a timeout to transition the animation so the last frame doesn't get cut off.
			setTimeout(() => {
				// Maybe we can flip it?
				if (step.flip) {
					this.flip();
				}

				// Where to?
				if (! this.child || null !== this.animation.next) {
					// If we've gone offscreen, start over.
					if (! this.child && ! this.isVisible()) {
						this.start();
						return;
					}

					this.setAnimation(this.chooseNext(this.animation.next));
				}
				// Remove child sprite.
				else {
					this.detach(true);
				}
			}, step.interval);

			return;
		}
		// Flip now.
		else if (step.flip) {
			this.flip();
		}

		// Did we hit an edge?
		if (null !== this.animation.edge && ! (FLAGS.ignoreEdges & step.flags)) {
			/** @type {boolean} */
			let change = false;

			// Too left.
			if (! this.mayExit && 0 > x && 0 >= this.x) {
				this.setPosition(0, this.y, true);
				change = true;
			}
			// Too right.
			else if (
				! this.mayExit &&
				0 < x &&
				this.x >= sw - TILE_SIZE
			) {
				this.setPosition(sw - TILE_SIZE, this.y, true);
				change = true;
			}
			// Too high.
			else if (0 > y && 0 >= this.y) {
				this.setPosition(this.x, 0, true);
				change = true;
			}
			// Too low.
			else if (
				0 < y &&
				this.y >= sh - TILE_SIZE
			) {
				this.setPosition(this.x, sh - TILE_SIZE, true);
				change = true;
			}

			// Go somewhere else!
			if (change) {
				// Border crawling only works from the left.
				if (1 === this.animation.id && this.flipped) {
					this.setAnimation(2, this.x, this.y);
					return;
				}

				// Let nature do its thing.
				this.setAnimation(
					this.chooseNext(this.animation.edge),
					this.x,
					this.y
				);
				return;
			}
		}

		// Does gravity matter?
		if ((FLAGS.forceGravity & step.flags) && this.y < sh - TILE_SIZE - 2) {
			this.setAnimation(PLAYLIST.Fall);
			return;
		}

		// Can't finish?
		if (
			(! this.mayExit && 0 > this.x && 0 > this.animation.scene[step.scene].end.x) ||
			(! this.mayExit && this.x > sw - TILE_SIZE && 0 < this.animation.scene[step.scene].end.x) ||
			(0 > this.y && 0 > this.animation.scene[step.scene].end.y) ||
			(this.y >= sh - TILE_SIZE && 0 < this.animation.scene[step.scene].end.y)
		) {
			// We can ignore a few animations.
			if (! (FLAGS.ignoreEdges & step.flags)) {
				// Pick something else.
				if (! this.child) {
					// If we've gone offscreen, start over.
					if (! this.isVisible()) {
						this.start();
						return;
					}

					this.setAnimation(this.chooseNext(null));
				}
				// Destroy the child!
				else {
					this.detach();
				}

				return;
			}
		}

		// Do it all over again!
		this.queuePaint();
		return;
	}

	/**
	 * Queue Painting
	 *
	 * Prevent multiple callbacks being bound to the same animationFrame.
	 *
	 * @return {void} Nothing.
	 * @private
	 */
	queuePaint() {
		if (! this.queued) {
			this.queued = true;
			requestAnimationFrame((/** @type {number} */ n) => this.paint(n));
		}
	}


	// -----------------------------------------------------------------
	// Helpers
	// -----------------------------------------------------------------

	/**
	 * Choose First Animation
	 *
	 * @return {boolean} True/false.
	 * @public
	 */
	start() {
		// This cannot be called on a child.
		if (this.child) {
			this.detach();
			return false;
		}

		// Prevent circular restarts.
		this.mayExit = false;
		this.setFlip(false);

		/** @const {number} */
		const id = rankedChoice(FIRST_CHOICES);

		// Choose something!
		switch (id) {
		// Fall from a random place.
		case PLAYLIST.Fall:
			return this.setAnimation(
				PLAYLIST.Fall,
				parseInt(Math.random() * (screenWidth() - TILE_SIZE), 10),
				0 - TILE_SIZE
			);

		// Bath Dive.
		// Black Sheep.
		// Chase a Martian!
		// Stargaze.
		default:
			return this.setAnimation(id);
		}
	}

	/**
	 * Choose an Animation
	 *
	 * Choose an animation given a sequence, or pick something "normal" at random.
	 *
	 * @param {(null|number|Array<(number|MateAnimationPossibility)>)} choices Choices.
	 * @return {number} Animation ID.
	 * @private
	 */
	chooseNext(choices) {
		// If we're in the middle of exiting, let's just keep going.
		if (this.mayExit && this.isPartiallyVisible()) {
			return this.animation.id;
		}

		// A number is all there is.
		if ('number' === typeof choices && verifyAnimationId(choices)) {
			return choices;
		}

		// We need to choose something random.
		if (
			null === choices ||
			! Array.isArray(choices) ||
			! choices.length
		) {
			choices = this.isVisible() ? DEFAULT_CHOICES : ENTRANCE_CHOICES;
		}

		// Pick something random!
		/** @const {number} */
		const result = rankedChoice(choices);
		if (! result || ! verifyAnimationId(result)) {
			return this.chooseNext(null);
		}

		return result;
	}



	// -----------------------------------------------------------------
	// Callbacks
	// -----------------------------------------------------------------

	/**
	 * Event: Mouse Move
	 *
	 * @param {MouseEvent} e Event.
	 * @return {void} Nothing.
	 * @public
	 */
	onDragStart(e) {
		if (! this.dragging && (1 === e.buttons) && (0 === e.button)) {
			this.detachChild();
			this.mayExit = false;
			this.setFlip(false);
			this.dragging = true;
			this.el.classList.add('is-dragging');
			this.setAnimation(PLAYLIST.Drag);
		}
	}

	/**
	 * On Drag
	 *
	 * @param {MouseEvent} e Event.
	 * @return {void} Nothing.
	 * @public
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
	 * @public
	 */
	endDrag() {
		if (this.dragging) {
			this.dragging = false;
			this.el.classList.remove('is-dragging');
			this.setAnimation(PLAYLIST.Fall);
		}
	}

	/**
	 * Event: Resize
	 *
	 * @return {void} Nothing.
	 * @public
	 */
	onResize() {
		// We can't check.
		if (
			(null === this.el) ||
			(null === this.animation)
		) {
			return;
		}

		// If we're invisible, reboot.
		if (! this.isVisible()) {
			this.start();
			return;
		}

		// If gravity applies and we're too high, glue to the bottom.
		/** @const {number} */
		const sh = screenHeight();

		/** @const {number} */
		const stepsLength = this.steps.length;
		if (
			stepsLength &&
			(FLAGS.forceGravity & this.steps[stepsLength - 1].flags) &&
			this.y < sh - TILE_SIZE
		) {
			this.setPosition(this.x, sh - TILE_SIZE, true);
			return;
		}

		// Climbing down we need to be glued to the right side.
		/** @const {number} */
		const sw = screenWidth();
		if (PLAYLIST.ClimbDown === this.animation.id && sw - TILE_SIZE !== this.x) {
			this.setPosition(sw - TILE_SIZE, this.y, true);
			return;
		}
	}



	// -----------------------------------------------------------------
	// Static
	// -----------------------------------------------------------------

	/**
	 * New Mate
	 *
	 * @param {boolean=} child Is Child?
	 * @return {?Mate} Mate or null.
	 */
	static init(child) {
		child = !! child;
		if (child !== (null !== _mates.primary)) {
			return null;
		}

		/** @type {number} */
		let mateId = 2;
		while ('undefined' !== typeof _mates.children[mateId]) {
			++mateId;
		}

		++_mates.length;
		if (child) {
			_mates.children[mateId] = new Mate(true, mateId);
			return _mates.children[mateId];
		}
		else {
			_mates.primary = new Mate(false, 1);
			return _mates.primary;
		}
	}

	/**
	 * Delete Mate
	 *
	 * @param {number} mateId Mate ID.
	 * @return {void} Nothing.
	 */
	static delete(mateId) {
		mateId = parseInt(mateId, 10) || 0;

		// Is this the primary?
		if (null !== _mates.primary && mateId === _mates.primary.mateId) {
			Mate.deleteChildren();
			delete _mates.primary;
			_mates.primary = null;
		}
		// A child mate?
		else if ('undefined' !== typeof _mates.children[mateId]) {
			delete _mates.children[mateId];
		}

		// Update the length.
		_mates.length = (null !== _mates.primary ? 1 + Object.keys(_mates.children).length : 0);
	}

	/**
	 * Delete All
	 *
	 * @return {void} Nothing.
	 */
	static deleteAll() {
		if (null !== _mates.primary) {
			_mates.primary.detach();
		}
		else {
			Mate.deleteChildren();
		}
	}

	/**
	 * Delete Children
	 *
	 * @return {void} Nothing.
	 */
	static deleteChildren() {
		/** @const {Array<number>} */
		const keys = /** @type {!Array<number>} */ (Object.keys(_mates.children));

		/** @const {number} */
		const length = keys.length;

		for (let i = 0; i < length; ++i) {
			/** @type {?Mate} */
			let mate = Mate.get(keys[i]);
			if (null !== mate) {
				mate.detach();
			}
		}
	}

	/**
	 * Get Mate
	 *
	 * @param {number} mateId Mate ID.
	 * @return {?Mate} Mate or null.
	 */
	static get(mateId) {
		mateId = parseInt(mateId, 10) || 0;

		if (null !== _mates.primary && mateId === _mates.primary.mateId) {
			return _mates.primary;
		}
		else if ('undefined' !== typeof _mates.children[mateId]) {
			return _mates.children[mateId];
		}

		return null;
	}

	/**
	 * Length
	 *
	 * @return {number} Mate length.
	 */
	static get length() {
		return _mates.length;
	}

	/**
	 * Primary
	 *
	 * @return {?Mate} Primary mate.
	 */
	static get primary() {
		return _mates.primary;
	}
};
