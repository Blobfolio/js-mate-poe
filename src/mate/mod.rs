/*!
# RS Mate Poe: Mate
*/

mod flags;

use crate::{
	Animation,
	Direction,
	dom,
	Frame,
	Position,
	SceneList,
	Sound,
	Step,
	Universe,
};
#[cfg(feature = "director")] use crate::dom::debug;
use flags::MateFlags;
use wasm_bindgen::prelude::*;
use web_sys::{
	Element,
	ShadowRootInit,
	ShadowRootMode,
};



#[wasm_bindgen]
extern "C" {
	#[allow(unsafe_code)]
	#[wasm_bindgen(js_name = "poeWriteCssProperty")]
	fn write_css_property(el: &Element, key: char, value: i32);

	#[allow(unsafe_code)]
	#[wasm_bindgen(js_name = "poeToggleWrapperClasses")]
	fn toggle_wrapper_classes(el: &Element, rx: bool, ry: bool, frame: i16, scene: i8);

	#[allow(unsafe_code)]
	#[wasm_bindgen(js_name = "poePlaySound")]
	fn play_sound(idx: u8);

	#[allow(unsafe_code)]
	#[wasm_bindgen(js_name = "poeMakeImage")]
	fn make_image() -> Element;
}



#[derive(Debug)]
/// # Mate.
pub(crate) struct Mate {
	el: Element,
	size: (u16, u16),
	flags: MateFlags,
	frame: Frame,
	sound: Option<Sound>,
	pos: Position,
	animation: Option<Animation>,
	scenes: Option<SceneList>,
	next_animation: Option<Animation>,
	next_tick: u32,
}

impl Mate {
	/// # New.
	///
	/// Create a new instance (and supporting DOM elements).
	pub(crate) fn new(primary: bool) -> Self {
		let el = make_element(primary);
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
			self.set_animation(Animation::first_choice(), true);
		}
	}

	/// # Stop.
	///
	/// Stop the animation, if any.
	pub(crate) fn stop(&mut self) {
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

	#[allow(clippy::cast_possible_truncation)]
	/// # Set Child Animation.
	///
	/// Set a specific animation for a child, with reference coordinates from
	/// the owner.
	pub(crate) fn set_child_animation(&self, child: &mut Self) {
		if ! self.active() { return; }

		let animation =
			if let Some(a) = self.child() { a }
			else { return };

		// Make sure the mate has the correct geometry.
		child.pretick_resize();

		// Flip to match.
		child.flags.clear_flips();
		child.flags.flip_x(Some(self.flags.flipped_x()));
		child.flags.flip_y(Some(self.flags.flipped_y()));

		// Set the animation.
		child.animation.take();
		child.set_animation(animation, true);

		// Some animations require a position override using knowledge of the
		// primary sprite's position.
		if let Some(pos) = match animation {
			Animation::FlowerChild => {
				let x =
					if self.flags.flipped_x() { self.pos.x + 36 }
					else { self.pos.x - 36 };
				Some(Position::new(x, self.pos.y))
			},
			Animation::AbductionChild => {
				Some(Position::new(
					self.pos.x,
					self.pos.y - Frame::SIZE_I * 2 - 480,
				))
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
		let animation_changed = force || old.map_or(true, |a| a != animation);

		// Old animation business.
		if let Some(o) = old {
			// Change classes if going to or coming from a special animation.
			if animation.change_class() || o.change_class() {
				self.flags.mark_class_changed();
			}

			// Unapply the previous animation-wide flips.
			if o.flip_x() { self.flags.flip_x(None); }
			if o.flip_y() { self.flags.flip_y(None); }
		}
		else {
			self.set_frame(Frame::None);
			self.flags.mark_changed();
		}

		// Remove flippage for these two.
		if matches!(animation, Animation::Drag | Animation::Fall | Animation::GraspingFall) {
			self.flags.clear_flips();
		}

		// Miscellaneous animation-specific adjustments (if we changed).
		if animation_changed { self.set_starting_position(animation, old.is_none()); }

		// Exiting off-screen has a 1/15 probability for animations that allow
		// it.
		let animation_exit = animation.may_exit();
		if animation_changed || ! animation_exit { self.flags.set_may_exit(false); }
		if animation_exit && ! self.flags.may_exit() && 0 == Universe::rand_mod(15) {
			self.flags.set_may_exit(true);
		}

		// Apply animation-wide flips.
		if animation.flip_x() { self.flags.flip_x(None); }
		if animation.flip_y() { self.flags.flip_y(None); }

		// Store the new animation!
		self.animation.replace(animation);
		self.scenes.replace(animation.scenes(self.size.0));

		// Finally, if this requires a child, request it.
		if animation.child().is_some() { Universe::set_assign_child(); }

		#[cfg(feature = "director")]
		debug!(&format!("Playing: {} (#{})", animation.as_str(), animation as u8));
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
			Animation::BigFish | Animation::Stargaze => Some(Position::new(
				w,
				h - Frame::SIZE_I,
			)),
			Animation::BigFishChild => Some(Position::new(
				w + 50,
				h + 35,
			)),
			Animation::BlackSheepChase | Animation::ChaseAMartian => Some(Position::new(
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
			Animation::StargazeChild => Some(Position::new(
				-Frame::SIZE_I,
				Frame::SIZE_I * 2,
			)),
			// Randomize positioning.
			Animation::Yoyo => Some(Position::new(
				self.random_x(),
				-Frame::SIZE_I,
			)),
			Animation::Fall | Animation::GraspingFall | Animation::WallSlide if first || self.pos.x < 0 || w - Frame::SIZE_I < self.pos.x =>
				Some(Position::new(self.random_x(), -Frame::SIZE_I)),
			_ => None,
		} {
			self.flags.flip_x(Some(false));
			self.flags.flip_y(Some(false));
			self.set_position(pos, true);
		}
	}

	/// # Set Frame.
	pub(crate) fn set_frame(&mut self, frame: Frame) {
		if frame as u8 != self.frame as u8 {
			// Mark the class as having changed too if the old or new frame is
			// a halfsie.
			if -1 != frame.dba() || -1 != self.frame.dba() {
				self.flags.mark_class_changed();
			}

			self.frame = frame;
			self.flags.mark_frame_changed();
		}
	}

	/// # Set Position.
	pub(crate) fn set_position(&mut self, pos: Position, absolute: bool) {
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
	pub(crate) fn paint(&mut self, now: u32) {
		if self.pretick(now) { self.tick(now); }
		self.render();
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
			self.pretick_resize();

			// Browser override?
			#[cfg(feature = "director")]
			if self.flags.primary() {
				if let Some(n) = Universe::next_animation() {
					Universe::set_no_child();
					self.animation.take();
					self.next_animation.replace(n);
				}
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
		let step =
			if let Some(step) = self.tick_next_step() { step }
			else {
				self.stop();
				return;
			};

		// Adjust the timings.
		self.next_tick = now + u32::from(step.next_tick());
		self.flags.set_scene_flags(step.mate_flags());

		// Easy stuff.
		self.set_frame(step.frame());

		// Sound if enabled.
		if let Some(sound) = step.sound() {
			if Universe::audio() {
				self.sound.replace(sound);
				self.flags.mark_sound_changed();
			}
			else { self.sound = None; }
		}
		else { self.sound = None; }

		// Move it?
		if let Some(mut pos) = step.move_to() {
			if self.flags.flipped_x() { pos = pos.invert_x(); }
			if self.flags.flipped_y() { pos = pos.invert_y(); }
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
			if self.flags.flipped_y() { dir = dir.invert_y(); }

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
				0 => Some(Animation::entrance_choice()),
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
	fn render(&mut self) {
		if ! self.flags.changed() { return; }

		let shadow = self.el.shadow_root().expect_throw("Missing mate shadow.");

		// Update the wrapper div's class and/or style.
		if self.flags.class_changed() || self.flags.transform_changed() {
			let wrapper = shadow.get_element_by_id("p")
				.expect_throw("Missing mate wrapper.");

			if self.flags.class_changed() {
				toggle_wrapper_classes(
					&wrapper,
					self.flags.flipped_x(),
					self.flags.flipped_y(),
					self.frame.dba(),
					match self.animation {
						None => 0,
						Some(Animation::Drag) => 1,
						Some(Animation::SneezeShadow) => 2,
						Some(Animation::Abduction) => 3,
						Some(Animation::BigFishChild) => 4,
						Some(Animation::SplatGhost) => 5,
						_ => -1,
					}
				);
			}

			if self.flags.transform_x_changed() {
				write_css_property(&wrapper, 'x', self.pos.x);
			}

			if self.flags.transform_y_changed() {
				write_css_property(&wrapper, 'y', self.pos.y);
			}
		}

		// Update the image frame class.
		if self.flags.frame_changed() {
			let img = shadow.get_element_by_id("i")
				.expect_throw("Missing mate image.");
			write_css_property(&img, 'c', self.frame.offset());
		}

		// Play a sound?
		if let Some(sound) = self.sound.take() { play_sound(sound as u8); }

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
		let animation =
			if let Some(a) = self.animation { a }
			else { return false };

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
						Animation::entrance_choice()
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

	#[allow(clippy::cast_sign_loss, clippy::cast_possible_truncation)]
	/// # Random X Position.
	///
	/// Return a random horizontal position within the boundaries of the
	/// screen, used by some start-up/entrance animations.
	fn random_x(&self) -> i32 {
		i32::from(Universe::rand_mod(self.max_x() as u16 + 1))
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
fn make_element(primary: bool) -> Element {
	let document = dom::document().expect_throw("Missing document.");

	// Create the main element, its shadow DOM, and its shadow elements.
	let el = document.create_element("div").expect_throw("!");
	el.set_attribute("aria-hidden", "true").expect_throw("!");

	// Create its stylesheet.
	let style = document.create_element("style").expect_throw("!");
	style.set_text_content(Some(include_str!(concat!(env!("OUT_DIR"), "/poe.css"))));

	// And the wrapper div (with the image).
	let wrapper = document.create_element("div").expect_throw("!");
	wrapper.set_id("p");
	if primary { wrapper.set_class_name("off"); }
	else { wrapper.set_class_name("child off"); }
	wrapper.append_child(&make_image()).expect_throw("!");

	// Create a shadow and move the inner elements into it.
	el.attach_shadow(&ShadowRootInit::new(ShadowRootMode::Open))
		.and_then(|s| s.append_with_node_2(&style, &wrapper))
		.expect_throw("!");

	el
}
