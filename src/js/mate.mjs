/**
 * @file The sprite object!
 */

import { DRAGGING_ANIMATION, FALLING_ANIMATION, DEFAULT_CHOICES, OFFSCREEN_CHOICES, STARTUP_CHOICES, animation, verifyAnimationId } from './animations.mjs';
import { audioFile } from './audio.mjs';
import { cbPreventDefault, bindEvent, clearEvents, isElement, NAME, rankedChoice, screenWidth, screenHeight } from './helpers.mjs';
import { IMAGE, TILE_SIZE } from './image.mjs';
import { MateAnimation, MateAnimationPossibility, MateAnimationSetup, MateAnimationStep } from './types.mjs';



export const Mate = class {
	// -----------------------------------------------------------------
	// Setup
	// -----------------------------------------------------------------

	/**
	 * A Poe Sprite!
	 *
	 * @param {boolean=} child Treat as child sprite.
	 */
	constructor(child) {
		/** @type {Mate} */
		this.mate = null;

		/** @type {boolean} */
		this.child = !! child;

		/** @type {?Element} */
		this.el = null;

		/** @type {?Element} */
		this.img = null;

		/** @type {boolean} */
		this.allowExit = false;

		/** @type {number} */
		this.x = -100;

		/** @type {number} */
		this.y = -100;

		/** @type {number} */
		this.frame = 0;

		/** @type {Array<MateAnimationStep>} */
		this.steps = [];

		/** @type {boolean} */
		this.flipped = false;

		/** @type {boolean} */
		this.dragging = false;

		/** @type {?MateAnimation} */
		this.animation = null;

		// Create the element and bindings.
		this.setupEl();
	}

	/**
	 * Create Element
	 *
	 * @return {void} Nothing.
	 */
	setupEl() {
		if (! isElement(this.el)) {
			this.el = document.createElement('DIV');
			this.el.className = 'poe';
			if (this.child) {
				this.el.classList.add('is-child');
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
					(e) => this.onDragStart(e),
					{ passive: true }
				);
				bindEvent(
					this.el,
					'dblclick',
					(e) => {
						e.preventDefault();
						const event = new CustomEvent('poeDestroy');
						window.dispatchEvent(event);
					}
				);
			}

			this.img = document.createElement('IMG');
			this.img.alt = NAME;
			this.img.src = IMAGE;
			this.el.appendChild(this.img);

			document.body.appendChild(this.el);
		}
	}

	/**
	 * Destroy!
	 *
	 * @return {void} Nothing.
	 */
	destroy() {
		// Remove the element and bindings.
		if (isElement(this.el)) {
			// Remove the main sprite.
			if (! this.child) {
				// Remove bound events.
				clearEvents(this.el);

				// Kill the element.
				document.body.removeChild(this.el);
				delete this.el;
				this.el = null;

				this.reset();
			}
			// Remove the child.
			else {
				this.el.classList.remove('fade-in');
				setTimeout(() => {
					if (null !== this.el) {
						// Give the owner a chance to clear its reference.
						const event = new CustomEvent('poeChildDestroy');
						this.el.dispatchEvent(event);

						// Kill the element.
						document.body.removeChild(this.el);
						delete this.el;
						this.el = null;
					}

					this.reset();
				}, 500);
			}
		}
	}

	/**
	 * Disable Mate
	 *
	 * @return {void} Nothing.
	 */
	destroyMate() {
		if (null !== this.mate) {
			try {
				this.mate.destroy();
				delete this.mate;
				this.mate = null;
			} catch (Ex) {
				delete this.mate;
				this.mate = null;
			}
		}
	}

	/**
	 * Reset
	 *
	 * @return {void} Nothing.
	 */
	reset() {
		if (null !== this.img) {
			delete this.img;
			this.img = null;
		}

		this.child = false;
		this.allowExit = false;
		this.x = -100;
		this.y = -100;
		this.frame = 0;
		this.steps = [];
		this.flipped = false;
		this.dragging = false;
		this.animation = null;
	}



	// -----------------------------------------------------------------
	// Getters
	// -----------------------------------------------------------------

	/**
	 * Is Child?
	 *
	 * @return {boolean} True/false.
	 */
	isChild() {
		return !! this.child;
	}

	/**
	 * Is Dragging?
	 *
	 * @return {boolean} True/false.
	 */
	isDragging() {
		return !! this.dragging;
	}

	/**
	 * Is Flipped?
	 *
	 * @return {boolean} True/false.
	 */
	isFlipped() {
		return !! this.flipped;
	}

	/**
	 * Is Partially Visible?
	 *
	 * @return {boolean} True/false.
	 */
	isPartiallyVisible() {
		return (this.isPartiallyVisibleX() || this.isPartiallyVisibleY());
	}

	/**
	 * Is Partially Visible?
	 *
	 * @return {boolean} True/false.
	 */
	isPartiallyVisibleX() {
		return this.isVisibleX() &&
			(0 > this.x || screenWidth() - TILE_SIZE < this.x);

	}

	/**
	 * Is Partially Visible?
	 *
	 * @return {boolean} True/false.
	 */
	isPartiallyVisibleY() {
		return this.isVisibleY() &&
			(0 > this.y || screenHeight() - TILE_SIZE < this.y);

	}

	/**
	 * Is Visible?
	 *
	 * @return {boolean} True/false.
	 */
	isVisible() {
		return this.isVisibleX() && this.isVisibleY();
	}

	/**
	 * Is Visible?
	 *
	 * @return {boolean} True/false.
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
	 */
	setAnimation(id, x, y) {
		if (0 >= id) {
			console.error(`Invalid animation ID: ${id}`);
			this.destroy();
			return false;
		}

		// Changing animation.
		if (null === this.animation || id !== this.animation.id) {
			this.allowExit = false;

			// Pull the animation details, if any.
			this.animation = animation(id);
			if (null === this.animation) {
				console.error(`Invalid animation ID: ${id}`);
				this.destroy();
				return false;
			}

			// We might need to force the child's destruction.
			if (
				(FALLING_ANIMATION === id) ||
				(
					null !== this.mate &&
					this.animation.childId
				)
			) {
				this.destroyMate();
			}

			// Should we allow the mate to walk off-screen?
			if (this.animation.allowExit) {
				// Give it a one-in-five chance.
				this.allowExit = 5 === Math.floor(Math.random() * 5);
			}
		}
		else if (! this.animation.allowExit) {
			this.allowExit = false;
		}

		// If this animation has a fixed starting place, go ahead and set it.
		if (
			null !== this.animation.startFrom &&
			'number' === typeof this.animation.startFrom.x &&
			'number' === typeof this.animation.startFrom.y
		) {
			x = this.animation.startFrom.x;
			y = this.animation.startFrom.y;
			this.setFlip(false);
		}

		// Move it somewhere before we begin?
		if ('number' === typeof x && 'number' === typeof y) {
			this.setPosition(x, y, true);
		}

		// Precalculate the steps.
		this.steps = [];

		/** @type {number} */
		const framesLength = this.animation.frames.length;

		/** @type {number} */
		const stepsLength = framesLength + (framesLength - this.animation.repeatFrom) * this.animation.repeat;

		/** @type {number} */
		const speedDiff = this.animation.end.speed - this.animation.start.speed;

		/** @type {number} */
		const xDiff = this.animation.end.x - this.animation.start.x;

		/** @type {number} */
		const yDiff = this.animation.end.y - this.animation.start.y;

		/** @type {number} */
		const now = performance.now();

		// Figure out what each slice should look like.
		/** @type {number} */
		let last = 0 - this.animation.start.speed;
		for (let i = 0; i < stepsLength; ++i) {
			/** @type {number} */
			const progress = i / stepsLength;

			/** @type {number} */
			const time = Math.floor(last + this.animation.start.speed + speedDiff * progress);

			/** @type {number} */
			const interval = time - last;

			last = time;

			// What frame should we show?
			/** @type {number} */
			let frame = 0;
			if (i < framesLength) {
				frame = this.animation.frames[i];
			}
			else if (! this.animation.repeatFrom) {
				frame = this.animation.frames[i % framesLength];
			}
			else {
				frame = this.animation.frames[this.animation.repeatFrom + (i - this.animation.repeatFrom) % (framesLength - this.animation.repeatFrom)];
			}

			/** @type {?string} */
			let audio = null;
			if (
				null !== this.animation.audio &&
				this.animation.audio.file &&
				this.animation.audio.start === i
			) {
				audio = audioFile(this.animation.audio.file);
			}

			this.steps.push(/** @type {!MateAnimationStep} */ ({
				step: i,
				time: now + time,
				interval: interval,
				frame: frame,
				x: this.animation.start.x + xDiff * progress,
				y: this.animation.start.y + yDiff * progress,
				audio: audio,
			}));
		}

		// Set up the child if applicable.
		if (this.animation.childId) {
			this.enableMate();
		}

		// Do it!
		window.requestAnimationFrame((n) => this.paint(n));
		return true;
	}

	/**
	 * Set Child Animation
	 *
	 * @return {void} Nothing.
	 */
	enableMate() {
		/** @type {?MateAnimationSetup} */
		let setup = null;

		switch (this.animation.childId) {
		// Bath dive.
		// Black Sheep.
		// Stargazing.
		case 23:
		case 31:
		case 56:
		case 64:
			setup = {
				id: this.animation.childId,
				x: null,
				y: null,
			};

			break;

		// Eat.
		case 27:
			setup = {
				id: 27,
				x: this.flipped ?
					this.x + TILE_SIZE * 0.9 :
					this.x - TILE_SIZE * 0.9,
				y: this.y,
			};

			break;

		// Abduction.
		case 58:
			setup = {
				id: 58,
				x: this.x,
				y: screenHeight() - TILE_SIZE * 2 - 4 * 120,
			};

			break;

		// Abduction beam.
		case 61:
			setup = {
				id: 61,
				x: this.x,
				y: screenHeight() - TILE_SIZE,
			};

			break;
		}

		// Nothing doing?
		if (null === setup) {
			return;
		}

		this.mate = new Mate(true);
		this.mate.setFlip(this.flipped);
		this.mate.setAnimation(setup.id, setup.x, setup.y);
		this.mate.el.addEventListener('poeChildDestroy', () => {
			delete this.mate;
			this.mate = null;
		}, {once: true});
	}

	/**
	 * Set Flip
	 *
	 * @param {boolean} flip Flip.
	 * @return {void} Nothing.
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
	 * @param {?number=} now Now.
	 * @return {void} Nothing.
	 */
	paint(now) {
		/** @type {number} */
		let stepsLength = this.steps.length;

		// Should we be animating?
		if ((null === this.el) || ! stepsLength) {
			return;
		}

		// If we've exited, simply restart.
		if (this.allowExit && ! this.isVisible()) {
			this.start();
			return;
		}

		/** @type {?MateAnimationStep} */
		let step = null;
		while (undefined !== this.steps[0] && this.steps[0].time <= now) {
			step = this.steps.shift();
			--stepsLength;
		}

		// We might be a bit early.
		if (null === step) {
			window.requestAnimationFrame((n) => this.paint(n));
			return;
		}

		// Fade child sprites in.
		if (this.child && ! this.el.classList.contains('fade-in')) {
			this.el.className += ' fade-in';
		}

		// Always set the frame.
		if (this.frame !== step.frame) {
			this.frame = step.frame;
			this.img.className = `poe-f${this.frame}`;
		}

		// Play audio?
		if (step.audio && window['Poe']['audio']()) {
			const audio = new Audio(step.audio);
			audio.play();
		}

		// Pull dimensions once.
		const sw = screenWidth();
		const sh = screenHeight();

		// Flip it?

		/** @type {number} */
		let x = step.x;

		/** @type {number} */
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
				if (this.animation.autoFlip) {
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
					this.destroy();
				}
			}, step.interval);

			return;
		}

		// Did we hit an edge?
		if (! this.animation.ignoreEdges && null !== this.animation.edge) {
			let change = false;

			// Too left.
			if (! this.allowExit && 0 > x && 0 >= this.x) {
				this.setPosition(0, this.y, true);
				change = true;
			}
			// Too right.
			else if (
				! this.allowExit &&
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
		if (this.animation.forceGravity && this.y < sh - TILE_SIZE - 2) {
			this.setAnimation(FALLING_ANIMATION);
			return;
		}

		// Can't finish?
		if (
			(! this.allowExit && 0 > this.x && 0 > this.animation.end.x) ||
			(! this.allowExit && this.x > sw - TILE_SIZE && 0 < this.animation.end.x) ||
			(0 > this.y && 0 > this.animation.end.y) ||
			(this.y >= sh - TILE_SIZE && 0 < this.animation.end.y)
		) {
			// We can ignore a few animations.
			if (! this.animation.ignoreEdges) {
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
					this.destroy();
				}

				return;
			}
		}

		// Do it all over again!
		window.requestAnimationFrame((n) => this.paint(n));
		return;
	}


	// -----------------------------------------------------------------
	// Helpers
	// -----------------------------------------------------------------

	/**
	 * Choose First Animation
	 *
	 * @return {boolean} True/false.
	 */
	start() {
		// Prevent circular restarts.
		this.allowExit = false;
		this.setFlip(false);

		/** @type {number} */
		const id = rankedChoice(STARTUP_CHOICES);

		// Choose something!
		switch (id) {
		// Fall from a random place.
		case 5:
			return this.setAnimation(
				5,
				Math.random() * (screenWidth() - TILE_SIZE),
				0 - TILE_SIZE
			);

		// Bathtub.
		// Black Sheep.
		// Stargazing.
		case 21:
		case 28:
		case 54:
			return this.setAnimation(id);
		}

		// This will never execute.
		return false;
	}

	/**
	 * Choose an Animation
	 *
	 * Choose an animation given a sequence, or pick something "normal" at random.
	 *
	 * @param {(null|number|Array<(number|MateAnimationPossibility)>)} choices Choices.
	 * @return {number} Animation ID.
	 */
	chooseNext(choices) {
		// If we're in the middle of exiting, let's just keep going.
		if (this.allowExit && this.isPartiallyVisible()) {
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
			choices = this.isVisible() ? DEFAULT_CHOICES : OFFSCREEN_CHOICES;
		}

		// Pick something random!
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
	 * @param {Event} e Event.
	 * @return {void} Nothing.
	 */
	onDragStart(e) {
		if (! this.dragging && (1 === e.buttons) && (0 === e.button)) {
			this.destroyMate();
			this.allowExit = false;
			this.setFlip(false);
			this.dragging = true;
			this.el.classList.add('is-dragging');
			this.setAnimation(DRAGGING_ANIMATION);
		}
	}

	/**
	 * End Drag
	 *
	 * @return {void} Nothing.
	 */
	endDrag() {
		if (this.dragging) {
			this.dragging = false;
			this.el.classList.remove('is-dragging');
			this.setAnimation(FALLING_ANIMATION);
		}
	}

	/**
	 * Event: Resize
	 *
	 * @return {void} Nothing.
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
		const sh = screenHeight();
		if (this.animation.forceGravity && this.y < sh - TILE_SIZE) {
			this.setPosition(this.x, sh - TILE_SIZE, true);
			return;
		}

		// Climbing down we need to be glued to the right side.
		const sw = screenWidth();
		if (41 === this.animation.id && sw - TILE_SIZE !== this.x) {
			this.setPosition(sw - TILE_SIZE, this.y, true);
			return;
		}
	}
};
