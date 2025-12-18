/*!
# RS Mate Poe: Mate
*/

mod flags;

use crate::{
	Animation,
	Direction,
	dom,
	Frame,
	IMAGE_HEIGHT,
	IMAGE_WIDTH,
	Position,
	SceneList,
	Sound,
	StateAudio,
	Step,
	Universe,
};
use flags::MateFlags;
use wasm_bindgen::prelude::*;
use web_sys::{
	DomTokenList,
	Element,
	HtmlElement,
	HtmlImageElement,
	ShadowRootInit,
	ShadowRootMode,
};



#[derive(Debug)]
/// # Mate.
pub(crate) struct Mate {
	/// # Element.
	el: Element,

	/// # Size.
	size: (u16, u16),

	/// # Flags.
	flags: MateFlags,

	/// # Current Frame.
	frame: Frame,

	/// # Current Sound.
	sound: Option<Sound>,

	/// # Current Position.
	pos: Position,

	/// # Current Animation.
	animation: Option<Animation>,

	/// # Animation Scenes.
	scenes: Option<SceneList>,

	/// # Next Animation.
	next_animation: Option<Animation>,

	/// # Next Tick Time.
	next_tick: u32,
}

impl Mate {
	/// # New.
	///
	/// Create a new instance (and supporting DOM elements).
	pub(crate) fn new(primary: bool, image: &str) -> Self {
		let el = make_element(primary, image);
		Self {
			el,
			size: Universe::size(),
			flags: MateFlags::new(primary),
			frame: Frame::None,
			sound: None,
			pos: Position::new(0, 0),
			animation: None,
			scenes: None,
			next_animation: None,
			next_tick: 0,
		}
	}
}

impl Mate {
	/// # Is Active?
	pub(crate) const fn active(&self) -> bool { self.animation.is_some() }

	/// # Child Animation.
	///
	/// Return the child animation required by this animation, if any.
	pub(crate) const fn child(&self) -> Option<Animation> {
		if let Some(a) = self.animation { a.child() }
		else { None }
	}

	/// # Element.
	pub(crate) const fn el(&self) -> &Element { &self.el }

	/*
	/// # Position.
	pub(crate) const fn pos(&self) -> Position { self.pos }
	*/
}

impl Mate {
	/// # Start.
	///
	/// Pick a start-up animation to use for the primary mate. This can be
	/// called at any time, but is intended for use post-initialization.
	pub(crate) fn start(&mut self) {
		if self.flags.primary() {
			// Clear some settings.
			self.flags.clear();
			self.set_animation(Animation::entrance_choice(true), true);
		}
	}

	/// # Stop.
	///
	/// Stop the animation, if any.
	pub(crate) const fn stop(&mut self) {
		// Clear animations and scenes, if any.
		let a = self.animation.take();
		let b = self.next_animation.take();
		let c = self.scenes.take();

		// If there were any, mark a change so we get painted one last time.
		if a.is_some() || b.is_some() || c.is_some() || self.flags.changed() {
			self.next_tick = 0;
			self.flags.mark_class_changed();
		}
	}

	/// # Set Child Animation.
	///
	/// Set a specific animation for a child, with reference coordinates from
	/// the owner.
	pub(crate) fn set_child_animation(&self, child: &mut Self) {
		if ! self.active() { return; }

		let Some(animation) = self.child() else { return; };

		// Make sure the mate has the correct geometry.
		child.pretick_resize();

		// Flip to match.
		child.flags.flip_x(Some(self.flags.flipped_x()));

		// Set the animation.
		child.animation.take();
		child.set_animation(animation, true);

		// Some animations require a position override using knowledge of the
		// primary sprite's position.
		if let Some(pos) = match animation {
			Animation::Flower | Animation::MagicFlower1 => {
				let x =
					if self.flags.flipped_x() { self.pos.x + 38 }
					else { self.pos.x - 38 };
				Some(Position::new(x, self.pos.y))
			},
			Animation::AbductionChild => Some(Position::new(
				self.pos.x,
				self.pos.y - Frame::SIZE_I * 2 - 480,
			)),
			Animation::ShadowShowdownChild1 => {
				let x =
					if self.flags.flipped_x() { self.pos.x - 40 }
					else { self.pos.x + 40 };
				Some(Position::new(x, self.pos.y))
			},
			Animation::SneezeShadow | Animation::SplatGhost => Some(self.pos),
			_ => None,
		} {
			child.set_position(pos, true);
		}
	}

	/// # Set Animation.
	///
	/// Change the active animation and all relevant settings.
	fn set_animation(&mut self, animation: Animation, force: bool) {
		// Primary requires primary sequence, child requires child. Unit tests
		// ensure all animations are one or the other, but not both, so we can
		// do a simple match.
		if self.flags.primary() != animation.primary() {
			self.stop();
			return;
		}

		// Clear and store the old animation to prevent recursion.
		self.next_animation.take();
		self.next_tick = 0;
		let old = self.animation.take();
		let animation_changed = force || old != Some(animation);

		// Old animation business.
		if let Some(o) = old {
			// Change classes if going to or coming from a special animation,
			// or the old/new animations have different smoothing preferences.
			if
				! animation.css_class().is_empty() ||
				! o.css_class().is_empty() ||
				animation.smooth() != o.smooth()
			{
				self.flags.mark_class_changed();
			}

			// Unapply the previous animation-wide flips.
			if o.flip_x() { self.flags.flip_x(None); }
		}
		else {
			self.set_frame(Frame::None);
			self.flags.mark_changed();
		}

		// Miscellaneous animation-specific adjustments (if we changed).
		if animation_changed { self.set_starting_position(animation, old.is_none()); }

		// Exiting off-screen has a 1/15 probability for animations that allow
		// it.
		let animation_exit = animation.may_exit();
		if animation_changed || ! animation_exit { self.flags.set_may_exit(false); }
		if animation_exit && ! self.flags.may_exit() && 0 == Universe::rand_mod(25) {
			self.flags.set_may_exit(true);
		}

		// Apply animation-wide flips.
		if animation.flip_x() { self.flags.flip_x(None); }

		// Store the new animation!
		self.animation.replace(animation);
		self.scenes.replace(animation.scenes(self.size.0));

		// Finally, if this requires a child, request it.
		if animation.child().is_some() { Universe::set_assign_child(); }

		#[cfg(feature = "director")]
		dom::console_debug(&format!(
			"Playing: {} (#{})",
			animation.as_str(),
			animation as u8,
		));
	}

	/// # Set Animation Starting Position.
	///
	/// Manually set absolute starting positions for new animations that need
	/// them (versus just picking up where the last left off). This is part of
	/// the `Mate::set_animation` actions.
	fn set_starting_position(&mut self, animation: Animation, first: bool) {
		let w = i32::from(self.size.0);
		let h = i32::from(self.size.1);

		if let Some(pos) = match animation {
			// Dragging follows the mouse.
			Animation::Drag => Some(Universe::pos()),
			// Basic canvas awareness required.
			Animation::BathDive => Some(Position::new(w, h - 600)),
			Animation::BathDiveChild => Some(Position::new(
				w + Frame::SIZE_I - 790,
				h - Frame::SIZE_I,
			)),
			Animation::BigFish |
				Animation::Stargaze => Some(Position::new(
					w,
					h - Frame::SIZE_I,
				)),
			Animation::BigFishChild => Some(Position::new(w + 50, h + 35)),
				Animation::BlackSheepCatch |
				Animation::BlackSheepCatchChild |
				Animation::BlackSheepCatchFail |
				Animation::BlackSheepCatchFailChild |
				Animation::SlideIn => Some(Position::new(
					-Frame::SIZE_I,
					h - Frame::SIZE_I,
				)),
			Animation::BlackSheepChase |
				Animation::ChaseAMartian => Some(Position::new(
					w + Frame::SIZE_I * 3,
					h - Frame::SIZE_I,
				)),
			Animation::BlackSheepChaseChild |
				Animation::BlackSheepRomance |
				Animation::ChaseAMartianChild => Some(Position::new(
					w + Frame::SIZE_I,
					h - Frame::SIZE_I,
				)),
			Animation::BlackSheepRomanceChild => Some(Position::new(
				-Frame::SIZE_I * 2,
				h - Frame::SIZE_I,
			)),
			Animation::ClimbIn => Some(Position::new(0, h)),
			Animation::JumpIn => Some(Position::new(
				w,
				h - 149 - Frame::SIZE_I,
			)),
			Animation::StargazeChild => Some(Position::new(
				-Frame::SIZE_I,
				Frame::SIZE_I * 2,
			)),
			// Randomize positioning.
			Animation::BeamIn => Some(Position::new(
				self.random_x(),
				h - Frame::SIZE_I,
			)),
			Animation::FloatIn => Some(Position::new(
				self.random_x().max(10),
				h,
			)),
			Animation::Gopher => Some(Position::new(self.random_x(), h)),
			Animation::Yoyo => Some(Position::new(self.random_x(), -Frame::SIZE_I)),
			Animation::Fall |
				Animation::GraspingFall |
				Animation::WallSlide
				if first || self.pos.x < 0 || w - Frame::SIZE_I < self.pos.x =>
					Some(Position::new(self.random_x(), -Frame::SIZE_I)),
			_ => None,
		} {
			self.flags.flip_x(Some(false));
			self.set_position(pos, true);
		}
	}

	/// # Set Frame.
	pub(crate) const fn set_frame(&mut self, frame: Frame) {
		if frame as u8 != self.frame as u8 {
			// Mark the class as having changed too if the old or new frame is
			// a halfsie.
			if frame.styled() || self.frame.styled() {
				self.flags.mark_class_changed();
			}

			self.frame = frame;
			self.flags.mark_frame_changed();
		}
	}

	/// # Set Position.
	pub(crate) const fn set_position(&mut self, pos: Position, absolute: bool) {
		if absolute {
			if pos.x != self.pos.x {
				self.pos.x = pos.x;
				self.flags.mark_transform_x_changed();
			}
			if pos.y != self.pos.y {
				self.pos.y = pos.y;
				self.flags.mark_transform_y_changed();
			}
		}
		else if pos.x != 0 || pos.y != 0 {
			self.pos.move_to(pos);
			if pos.x != 0 {
				self.flags.mark_transform_x_changed();
			}
			if pos.y != 0 {
				self.flags.mark_transform_y_changed();
			}
		}
	}
}

impl Mate {
	/// # Paint!
	///
	/// Crunch the animation step details and repaint the DOM elements if
	/// needed.
	pub(crate) fn paint(&mut self, now: u32, audio: &StateAudio) {
		if self.pretick(now) { self.tick(now); }
		self.render(audio);
	}

	/// # Pre-Tick.
	///
	/// Determine whether or not we should do anything at all, and maybe apply
	/// some requested overrides, such as switching to a cued animation.
	///
	/// Returns `true` if the full `Mate::tick` processing should be conducted.
	///
	/// Note: repainting will take place regardless if any relevant changes
	/// have been flagged.
	fn pretick(&mut self, now: u32) -> bool {
		let dragging = matches!(self.animation, Some(Animation::Drag));

		// If inactive, there's nothing to tick.
		if ! self.active() { false }
		// If we're newly dragging, update some things and ignore the original
		// status.
		else if self.flags.primary() && dragging != Universe::dragging() {
			Universe::set_no_child();
			if dragging { self.set_animation(Animation::Fall, false); }
			else { self.set_animation(Animation::Drag, false); }
			true
		}
		// Tick it if we got it.
		else if self.next_tick <= now {
			// Maybe toggle focus.
			if self.flags.primary() { self.flags.set_no_focus(Universe::no_focus()); }

			// Make sure we have the right screen size.
			self.pretick_resize();

			// Browser override?
			#[cfg(feature = "director")]
			if self.flags.primary() && let Some(n) = Universe::next_animation() {
				Universe::set_no_child();
				self.animation.take();
				self.next_animation.replace(n);
			}

			// Flip if flipping is needed.
			self.flags.apply_next();

			// Switch animations?
			if let Some(a) = self.next_animation.take() { self.set_animation(a, false); }
			// Otherwise if we're dragging, make sure to update the
			// coordinates.
			else if dragging { self.set_position(Universe::pos(), true); }

			// Full tick if active (which we should be).
			self.active()
		}
		// Just update the X/Y.
		else if dragging {
			self.set_position(Universe::pos(), true);
			false
		}
		// Nothing doing.
		else { false }
	}

	/// # Pre-Tick Resize.
	///
	/// Returns `true` if a resize-related change occurred, as determined by
	/// comparing the universe's current size with the value cached on this
	/// particular mate.
	fn pretick_resize(&mut self) {
		let (w, h) = Universe::size();
		if self.size.0 != w || self.size.1 != h {
			self.flags.mark_size_changed();
			self.size.0 = w;
			self.size.1 = h;
		}
	}

	/// # Tick.
	///
	/// Crunch the step changes, if any.
	fn tick(&mut self, now: u32) {
		let Some(step) = self.tick_next_step() else {
			self.stop();
			return;
		};

		// Adjust the timings.
		self.next_tick = now + u32::from(step.next_tick());
		self.flags.set_scene_flags(step.mate_flags());

		// Easy stuff.
		self.set_frame(step.frame());

		// Sound if enabled.
		if let Some(sound) = step.sound() && Universe::audio() {
			self.sound.replace(sound);
			self.flags.mark_sound_changed();
		}
		else { self.sound = None; }

		// Move it?
		if let Some(mut pos) = step.move_to() {
			if self.flags.flipped_x() { pos = pos.invert_x(); }
			self.set_position(pos, false);
		}

		// Edge-related business.
		if self.flags.edges_changed() {
			// Clamp wall animations to the appropriate side, if necessary.
			if let Some(mut side) = self.animation.and_then(Animation::clamp_x) {
				if self.flags.flipped_x() { side = side.invert_x(); }
				if side.is_left() {
					if self.pos.x != 0 {
						self.set_position(Position::new(0, self.pos.y), true);
					}
				}
				else if side.is_right() && self.pos.x != self.max_x() {
					self.set_position(Position::new(self.max_x(), self.pos.y), true);
				}
			}

			// Note the direction we're moving.
			let mut dir = step.direction();
			if self.flags.flipped_x() { dir = dir.invert_x(); }

			// Make sure we didn't crash into an edge, and if we did and the
			// animation changed, recurse.
			if self.check_edges(dir) {
				if self.active() { self.tick(now); }
				return;
			}
		}

		// If this was the last step, queue up the next animation before we go.
		if step.done() {
			self.next_animation = self.tick_next_animation();
		}
	}

	/// # Tick Step.
	///
	/// Pull the next step, changing animations if necessary.
	fn tick_next_step(&mut self) -> Option<Step> {
		// There is already a next step ready and waiting.
		if let Some(step) = self.scenes.as_mut().and_then(Iterator::next) {
			return Some(step);
		}

		// We need to switch animations or disable the whole shebang.
		if let Some(animation) = self.tick_next_animation() {
			self.set_animation(animation, false);
			self.scenes.as_mut().and_then(Iterator::next)
		}
		else { None }
	}

	/// # Next Animation.
	///
	/// Choose the next animation, factoring in the sprite's visibility on the
	/// screen.
	fn tick_next_animation(&self) -> Option<Animation> {
		if self.flags.primary() {
			match self.visibility() {
				// If hidden, go with an entrance animation.
				0 => Some(Animation::entrance_choice(false)),
				// If partially visible and exiting, keep going.
				1 if self.flags.may_exit() => self.animation,
				// Otherwise go with the animation's named successor.
				_ => self.animation.and_then(Animation::next),
			}
				// Fall back to the default choice.
				.or_else(|| Some(Animation::default_choice()))
		}
		else { self.animation.and_then(Animation::next) }
	}

	/// # Render.
	///
	/// Apply any and all necessary changes to the DOM elements.
	fn render(&mut self, audio: &StateAudio) {
		if ! self.flags.changed() { return; }

		let shadow = self.el.shadow_root().expect_throw("Missing mate shadow.");

		// Update the wrapper div's classes and/or styles.
		if self.flags.class_changed() || self.flags.transform_changed() {
			let wrapper = shadow.get_element_by_id("p")
				.expect_throw("Missing mate wrapper.");

			if self.flags.class_changed() {
				let list = wrapper.class_list();

				// Orientation.
				let mut rx = self.flags.flipped_x();
				if self.frame.reversed() { rx = ! rx; }
				toggle_class(&list, "rx", rx);

				// Smoothing?
				toggle_class(&list, "smooth", self.animation.is_some_and(Animation::smooth));

				// Focus only affects the primary.
				if self.flags.primary() {
					toggle_class(&list, "no-focus", self.flags.no_focus());
				}

				// Special frame and animation classes.
				let _res = wrapper.set_attribute("data-f", self.frame.css_class())
					.and_then(|()| wrapper.set_attribute("data-a", self.animation.map_or("", Animation::css_class)));

				// Disabled?
				toggle_class(&list, "off", self.animation.is_none());
			}

			if self.flags.transform_x_changed() {
				CssProperty::write(&wrapper, "--x", self.pos.x);
			}

			if self.flags.transform_y_changed() {
				CssProperty::write(&wrapper, "--y", self.pos.y);
			}
		}

		// Update the image frame class.
		if self.flags.frame_changed() {
			let img = shadow.get_element_by_id("i")
				.expect_throw("Missing mate image.");
				CssProperty::write(&img, "--c", self.frame.offset());
		}

		// Play a sound?
		if let Some(sound) = self.sound.take() { audio.play(sound); }

		// Reset the change flags.
		self.flags.clear_changed();
	}
}

impl Mate {
	/// # Check Edges.
	///
	/// See where the sprite is in relation to the edges of the page, and
	/// change animations or disable the mate if necessary.
	///
	/// Returns true if a change happened.
	fn check_edges(&mut self, dir: Direction) -> bool {
		// We don't need to worry about edges.
		if Universe::dragging() { return false; }

		// Some basic setup.
		let Some(animation) = self.animation else { return false; };
		let w = i32::from(self.size.0);
		let max_x = self.max_x();
		let max_y = self.max_y();

		// Check gravity.
		if self.flags.gravity() && self.pos.y != max_y {
			if self.flags.primary() {
				self.set_animation(Animation::Fall, false);
			}
			else { self.stop(); }
			return true;
		}

		// We can avoid any further checking if edges are ignored.
		if self.flags.ignore_edges() { return false; }

		let mut hit_edge = false;

		// If we're allowed to walk offscreen, horizontal edges only apply
		// once we're totally gone.
		if self.flags.may_exit() {
			if self.pos.x <= 0 - Frame::SIZE_I {
				if ! dir.is_right() { hit_edge = true; }
			}
			else if self.pos.x >= w && ! dir.is_left() { hit_edge = true; }
		}
		// We're at the left edge.
		else if self.pos.x <= 0 {
			// Unless we're moving right, something happened.
			if ! dir.is_right() {
				// Let offscreen fix itself with an entrance choice.
				if self.pos.x <= 0 - Frame::SIZE_I { hit_edge = true; }
				else {
					// Clamp it.
					self.set_position(Position::new(0, self.pos.y), true);
					// If we're moving left, it's time for a change.
					if dir.is_left() { hit_edge = true; }
				}
			}
		}
		// We're at the right edge and not moving left.
		else if self.pos.x >= max_x && ! dir.is_left() {
			// Let offscreen fix itself with an entrance choice.
			if self.pos.x >= w { hit_edge = true; }
			else {
				// Clamp it.
				self.set_position(Position::new(max_x, self.pos.y), true);
				// If we're moving right, it's time for a change.
				if dir.is_right() { hit_edge = true; }
			}
		}

		// Top and moving up, not super likely, but just in case…
		if self.pos.y <= 0 {
			// Unless we're coming down, something happened.
			if ! dir.is_down() {
				// Let offscreen fix itself with an entrance choice.
				if self.pos.y <= 0 - Frame::SIZE_I { hit_edge = true; }
				else {
					// Clamp it.
					self.set_position(Position::new(self.pos.x, 0), true);
					// If we're moving up, it's time for a change.
					if dir.is_up() { hit_edge = true; }
				}
			}
		}
		// Because we already did gravity checks, we only want to call the
		// bottom an edge if we're _under_ it (and not moving upward).
		else if self.pos.y > max_y && ! dir.is_up() {
			self.set_position(Position::new(self.pos.x, max_y), true);
			if dir.is_down() { hit_edge = true; }
		}

		// If we hit an edge, switch animations.
		if hit_edge {
			if self.flags.primary() {
				self.set_animation(
					if 0 == self.visibility() {
						Universe::set_no_child();
						Animation::entrance_choice(false)
					}
					else { animation.next_edge().unwrap_or(Animation::Rotate) },
					false
				);
			}
			else { self.stop(); }
			true
		}
		else { false }
	}

	/// # Max X Position.
	const fn max_x(&self) -> i32 {
		self.size.0.saturating_sub(Frame::SIZE) as i32
	}

	/// # Max Y Position.
	const fn max_y(&self) -> i32 {
		self.size.1.saturating_sub(Frame::SIZE) as i32
	}

	#[expect(
		clippy::cast_possible_truncation,
		clippy::cast_sign_loss,
		reason = "False positive.",
	)]
	/// # Random X Position.
	///
	/// Return a random horizontal position within the boundaries of the
	/// screen, used by some start-up/entrance animations.
	fn random_x(&self) -> i32 {
		i32::from(Universe::rand_mod(self.max_x() as u16))
	}

	/// # Mate Visibility.
	///
	/// Qualify the sprite's visibility on the screen:
	/// * 0 Hidden
	/// * 1 Partially Visible
	/// * 2 Fully Visible
	const fn visibility(&self) -> u8 {
		// Fully visible.
		if
			0 <= self.pos.x &&
			0 <= self.pos.y &&
			self.pos.x <= self.max_x() &&
			self.pos.y <= self.max_y()
		{
			2
		}
		// Fully hidden.
		else if
			self.pos.x <= -Frame::SIZE_I ||
			self.pos.y <= -Frame::SIZE_I ||
			self.pos.x >= self.size.0 as i32 ||
			self.pos.y >= self.size.1 as i32
		{
			0
		}
		// A bit of both.
		else { 1 }
	}
}



/// # Make Element.
///
/// Create and return the "mate" DOM elements.
fn make_element(primary: bool, image: &str) -> Element {
	let document = dom::document().expect_throw("Missing document.");

	// Create the main element, its shadow DOM, and its shadow elements.
	let el = document.create_element("div").expect_throw("!");
	el.set_attribute("aria-hidden", "true").expect_throw("!");
	el.set_class_name("js-mate-poe-mate");

	#[cfg(feature = "firefox")]
	el.set_attribute("data-from", "firefox").expect_throw("!");

	// Create its stylesheet.
	let style = document.create_element("style").expect_throw("!");
	style.set_text_content(Some(include_str!(concat!(env!("OUT_DIR"), "/poe.css"))));

	// And the wrapper div.
	let wrapper = document.create_element("div").expect_throw("!");
	wrapper.set_id("p");
	if primary { wrapper.set_class_name("off"); }
	else { wrapper.set_class_name("child off"); }

	// Create the image and append it to the wrapper.
	make_element_image(image)
		.and_then(|i| wrapper.append_child(&i))
		.expect_throw("!");

	// Create a shadow and move the inner elements into it.
	el.attach_shadow(&ShadowRootInit::new(ShadowRootMode::Open))
		.and_then(|s| s.append_with_node_2(&style, &wrapper))
		.expect_throw("!");

	el
}

/// # Make Image Element.
fn make_element_image(src: &str) -> Result<HtmlImageElement, JsValue> {
	let el = HtmlImageElement::new_with_width_and_height(IMAGE_WIDTH, IMAGE_HEIGHT)?;
	el.set_id("i");
	el.set_src(src);
	Ok(el)
}

/// # Toggle CSS Class.
///
/// Turn a given class on/off, per `force`.
fn toggle_class(list: &DomTokenList, class: &str, force: bool) {
	let _res = list.toggle_with_force(class, force);
}



#[repr(u8)]
#[derive(Debug, Clone, Copy, Eq, Ord, PartialEq, PartialOrd)]
/// # CSS Property Characters.
///
/// This enum contains all of the possible characters used by `CssProperty`.
/// While a bit verbose, it proves to both us and the compiler that we can't
/// possibly fuck up a slice so badly it can't be represented as a string. ;)
enum CssPropertyChar {
	ChrDash = b'-',
	Chr0 =    b'0',
	Chr1 =    b'1',
	Chr2 =    b'2',
	Chr3 =    b'3',
	Chr4 =    b'4',
	Chr5 =    b'5',
	Chr6 =    b'6',
	Chr7 =    b'7',
	Chr8 =    b'8',
	Chr9 =    b'9',
	ChrP =    b'p',
	ChrX =    b'x',
}

impl CssPropertyChar {
	#[inline]
	/// # From `u32` Digit.
	const fn from_digit(num: u32) -> Self {
		match num {
			0 => Self::Chr0,
			1 => Self::Chr1,
			2 => Self::Chr2,
			3 => Self::Chr3,
			4 => Self::Chr4,
			5 => Self::Chr5,
			6 => Self::Chr6,
			7 => Self::Chr7,
			8 => Self::Chr8,
			_ => Self::Chr9, // We know n % 10 can't ever be out of range.
		}
	}

	#[expect(clippy::inline_always, reason = "For performance.")]
	#[expect(unsafe_code, reason = "For transmute.")]
	#[inline(always)]
	#[must_use]
	/// # As Str.
	///
	/// Transmute a slice of `CssPropertyChar` into a string slice.
	pub(super) const fn as_str(src: &[Self]) -> &str {
		// This check is overly-paranoid, but the compiler should
		// optimize it out.
		const {
			assert!(
				align_of::<&[Self]>() == align_of::<&[u8]>() &&
				size_of::<&[Self]>() == size_of::<&[u8]>(),
				"BUG: CssPropertyChar and u8 have different layouts?!",
			);
		}

		// Safety: `CssPropertyChar` is represented by `u8` so shares the
		// same size and alignment.
		unsafe {
			std::str::from_utf8_unchecked(
				std::mem::transmute::<&[Self], &[u8]>(src)
			)
		}
	}
}



#[derive(Debug, Clone, Copy)]
/// # CSS Property Buffer.
///
/// This struct acts like a poor man's `itoa`, saving us the trouble of
/// allocating new strings each and every time a CSS property update needs to
/// be sent back to the browser.
///
/// Note that this assumes all values require a `px` suffix.
struct CssProperty([CssPropertyChar; 13]);

impl CssProperty {
	/// # Default Buffer.
	///
	/// This is equivalent to "00000000000px".
	const DEFAULT: Self = Self([
		CssPropertyChar::Chr0, CssPropertyChar::Chr0, CssPropertyChar::Chr0,
		CssPropertyChar::Chr0, CssPropertyChar::Chr0, CssPropertyChar::Chr0,
		CssPropertyChar::Chr0, CssPropertyChar::Chr0, CssPropertyChar::Chr0,
		CssPropertyChar::Chr0, CssPropertyChar::Chr0, CssPropertyChar::ChrP,
		CssPropertyChar::ChrX,
	]);

	/// # Format Value.
	///
	/// Stringify an `i32` pixel value into the buffer, returning a string
	/// slice of the result.
	const fn format(&mut self, num: i32) -> &str {
		let neg = num.is_negative();
		let mut num = num.unsigned_abs();
		let mut len = 2; // The PX suffix is constant.

		// Right to left, one digit at a time.
		while 9 < num {
			len += 1;
			self.0[13 - len] = CssPropertyChar::from_digit(num % 10);
			num /= 10;
		}
		len += 1;
		self.0[13 - len] = CssPropertyChar::from_digit(num);

		// Negative?
		if neg {
			len += 1;
			self.0[13 - len] = CssPropertyChar::ChrDash;
		}

		// Split off the relevant part.
		let (_, b) = self.0.split_at(13 - len);
		CssPropertyChar::as_str(b)
	}

	#[inline]
	/// # Write Style Property.
	///
	/// Update a given `--prop` pixel value.
	fn write(el: &Element, key: &str, value: i32) {
		if let Some(el) = el.dyn_ref::<HtmlElement>() {
			let mut buf = Self::DEFAULT;
			let _res = el.style().set_property(key, buf.format(value));
		}
	}
}



#[cfg(test)]
mod tests {
	use super::*;

	#[test]
	fn t_i32_len() {
		// The `CSSProperty` struct assumes the longest possible i32 value
		// is eleven bytes. Let's prove it!
		assert_eq!(
			i32::MIN.to_string().len(),
			11,
		);

		// Now we're getting silly, but let's also prove that u32 tops out at
		// ten.
		assert_eq!(
			u32::MAX.to_string().len(),
			10,
		);
	}

	#[test]
	fn t_css_property() {
		let mut buf = CssProperty::DEFAULT;
		assert_eq!(buf.format(0), "0px");
		assert_eq!(buf.format(10), "10px");
		assert_eq!(buf.format(432), "432px");
		assert_eq!(buf.format(50_000), "50000px");
		assert_eq!(buf.format(i32::MIN), "-2147483648px");
	}
}
