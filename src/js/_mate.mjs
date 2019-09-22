/**
 * @file The sprite object!
 */

import { FLAGS, PLAYLIST, DEFAULT_CHOICES, ENTRANCE_CHOICES, FIRST_CHOICES, animation, verifyAnimationId } from './_animations.mjs';
import { makeNoise } from './_audio.mjs';
import { cbPreventDefault, bindEvent, clearEvents, isElement, NAME, rankedChoice, screenWidth, screenHeight } from './_helpers.mjs';
import { IMAGE, TILE_SIZE } from './_image.mjs';
import { MateAnimation, MateAnimationPossibility, MateAnimationScene, MateAnimationSetup, MateAnimationStep } from './_types.mjs';



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

		/** @type {boolean} */
		this.queued = false;

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
			this.el.className = 'poe' + (this.child ? ' is-child' : '');

			// Bind events to the main Mate.
			if (this.child) {
				// Add the fade-in class after a little delay.
				requestAnimationFrame(() => this.el.classList.add('fade-in'));
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
		this.queued = false;
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

		// Disable exit possibility if we're changing animations or the animation doesn't allow exiting.
		if (
			null === this.animation ||
			id !== this.animation.id ||
			! (FLAGS.allowExit & this.animation.scene[0].flags)
		) {
			this.allowExit = false;
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

			this.destroy();
			return false;
		}

		// We might need to force the child's destruction.
		if (
			(PLAYLIST.Fall === id) ||
			(
				null !== this.mate &&
				this.animation.childId
			)
		) {
			this.destroyMate();
		}

		// Should we allow the mate to walk off-screen?
		if ((FLAGS.allowExit & this.animation.scene[0].flags) && ! this.allowExit) {
			// Give it a one-in-five chance.
			this.allowExit = 4 === Math.floor(Math.random() * 5);
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

		/** @type {number} */
		const sceneLength = this.animation.scene.length;

		/** @type {number} */
		const now = performance.now();

		/** @type {number} */
		let step = 0;

		/** @type {number} */
		let last = 0 - this.animation.scene[0].start.speed;

		// Loop through the scenes.
		for (let i = 0; i < sceneLength; ++i) {
			/** @type {MateAnimationScene} */
			const scene = this.animation.scene[i];

			/** @type {number} */
			const framesLength = scene.frames.length;

			/** @type {number} */
			const stepsLength = framesLength + (framesLength - scene.repeatFrom) * scene.repeat;

			/** @type {number} */
			const speedDiff = scene.end.speed - scene.start.speed;

			/** @type {number} */
			const xDiff = scene.end.x - scene.start.x;

			/** @type {number} */
			const yDiff = scene.end.y - scene.start.y;

			// Figure out what each slice should look like.
			for (let j = 0; j < stepsLength; ++j) {
				/** @type {number} */
				const progress = j / stepsLength;

				/** @type {number} */
				const time = Math.floor(last + scene.start.speed + speedDiff * progress);

				/** @type {number} */
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

				/** @type {?string} */
				let audio = null;
				if (
					null !== scene.audio &&
					scene.audio.file &&
					scene.audio.start === j
				) {
					audio = scene.audio.file;
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
			this.enableMate();
		}

		// Do it!
		this.queuePaint();
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
	 * @param {number} now Now.
	 * @return {void} Nothing.
	 */
	paint(now) {
		this.queued = false;

		/** @type {number} */
		let stepsLength = this.steps.length;

		// Should we be animating?
		if ((null === this.el) || ! stepsLength) {
			// If a child, make sure we kill it!
			if (this.child) {
				this.destroy();
			}

			return;
		}

		// If we've exited, simply restart.
		if (this.allowExit && ! this.isVisible()) {
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
			this.img.className = `poe-f${this.frame}`;
		}

		// Play audio?
		if (step.audio && /** @type {function():boolean} */ (window['Poe']['audio'])()) {
			makeNoise(step.audio);
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
					this.destroy();
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
		if ((FLAGS.forceGravity & step.flags) && this.y < sh - TILE_SIZE - 2) {
			this.setAnimation(PLAYLIST.Fall);
			return;
		}

		// Can't finish?
		if (
			(! this.allowExit && 0 > this.x && 0 > this.animation.scene[step.scene].end.x) ||
			(! this.allowExit && this.x > sw - TILE_SIZE && 0 < this.animation.scene[step.scene].end.x) ||
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
					this.destroy();
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
	 */
	start() {
		// This cannot be called on a child.
		if (this.child) {
			this.destroy();
			return false;
		}

		// Prevent circular restarts.
		this.allowExit = false;
		this.setFlip(false);

		/** @type {number} */
		const id = rankedChoice(FIRST_CHOICES);

		// Choose something!
		switch (id) {
		// Fall from a random place.
		case PLAYLIST.Fall:
			return this.setAnimation(
				PLAYLIST.Fall,
				Math.random() * (screenWidth() - TILE_SIZE),
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
			choices = this.isVisible() ? DEFAULT_CHOICES : ENTRANCE_CHOICES;
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
	 * @param {MouseEvent} e Event.
	 * @return {void} Nothing.
	 */
	onDragStart(e) {
		if (! this.dragging && (1 === e.buttons) && (0 === e.button)) {
			this.destroyMate();
			this.allowExit = false;
			this.setFlip(false);
			this.dragging = true;
			this.el.classList.add('is-dragging');
			this.setAnimation(PLAYLIST.Drag);
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
			this.setAnimation(PLAYLIST.Fall);
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
		/** @type {number} */
		const sh = screenHeight();

		/** @type {number} */
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
		/** @type {number} */
		const sw = screenWidth();
		if (PLAYLIST.ClimbDown === this.animation.id && sw - TILE_SIZE !== this.x) {
			this.setPosition(sw - TILE_SIZE, this.y, true);
			return;
		}
	}
};
