/*!
# RS Mate Poe: Mate
*/

mod flags;

use crate::{
	Animation,
	Direction,
	dom,
	Position,
	SceneList,
	Sound,
	Sprite,
	Step,
	Universe,
};
#[cfg(feature = "director")] use crate::dom::debug;
use flags::MateFlags;
use std::mem::MaybeUninit;
use wasm_bindgen::prelude::*;
use web_sys::{
	HtmlAudioElement,
	HtmlElement,
	ShadowRootInit,
	ShadowRootMode,
	Url,
};



/// # Buffer for our --x, --y values.
type TransformBuffer = [MaybeUninit::<u8>; 13];



#[derive(Debug)]
/// # Mate.
pub(crate) struct Mate {
	pub(crate) el: HtmlElement,
	size: (u16, u16),
	flags: MateFlags,
	frame: u8,
	sound: Option<Sound>,
	pos: Position,
	animation: Option<Animation>,
	scenes: Option<SceneList>,
	next_animation: Option<Animation>,
	next_tick: u32,
}

impl Drop for Mate {
	/// # Drop.
	///
	/// Remove the event listeners, if any, and detach the element from the
	/// body, hopefully allowing for eventual garbage collection.
	fn drop(&mut self) {
		let _res = dom::body().remove_child(&self.el);
	}
}

impl Mate {
	/// # New.
	///
	/// Create a new instance, including all of the initial DOM setup.
	pub(crate) fn new(primary: bool) -> Self {
		let el = make_element(primary);
		Self {
			el,
			size: Universe::size(),
			flags: MateFlags::new(primary),
			frame: Sprite::EMPTY_TILE,
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
			self.next_animation.take();
			self.next_tick = 0;
			self.set_animation(Animation::first_choice());
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

		// Flip to match.
		child.flags.clear_flips();
		child.flags.flip_x(Some(self.flags.flipped_x()));
		child.flags.flip_y(Some(self.flags.flipped_y()));

		// Set the animation.
		child.set_animation(animation);

		// Some animations require a position override.
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
					self.pos.y - Sprite::TILE_SIZE_I * 2 - 480,
				))
			},
			Animation::SneezeShadow =>
				// This effect doesn't work when flipped.
				if self.flags.flipped_x() {
					child.stop();
					return;
				}
				else { Some(self.pos) },
			_ => None,
		} {
			child.set_position(pos, true);
		}
	}

	/// # Set Animation.
	///
	/// Change the active animation and all relevant settings.
	fn set_animation(&mut self, animation: Animation) {
		// Primary requires primary sequence, child requires child. Unit tests
		// ensure all animations are one or the other, but not both, so we can
		// do a simple match.
		if self.flags.primary() != animation.primary() {
			self.stop();
			return;
		}

		// Clear and store the old animation to prevent recursion.
		let old = self.animation.take();
		let animation_changed = old.map_or(true, |a| a != animation);

		// Old animation business.
		if let Some(o) = old {
			// Change classes if going to or coming from a special animation.
			if animation.change_class() || o.change_class() {
				self.flags.mark_class_changed();
			}

			// Unflip if the old animation was flipped.
			if o.flip_x() { self.flags.flip_x(None); }
			if o.flip_y() { self.flags.flip_y(None); }
		}
		else {
			self.set_frame(Sprite::EMPTY_TILE);
			self.flags.mark_changed();
		}

		// Remove flippage for these two.
		if matches!(animation, Animation::Drag | Animation::Fall) {
			self.flags.clear_flips();
		}

		// Miscellaneous animation-specific adjustments, only necessary for new
		// animations.
		if animation_changed { self.set_starting_position(animation, old.is_none()); }

		// Exiting off-screen has a 1/15 probability for animations that allow
		// it.
		let animation_exit = animation.may_exit();
		if animation_changed || ! animation_exit { self.flags.set_may_exit(false); }
		if animation_exit && ! self.flags.may_exit() && 0 == Universe::rand() % 15 {
			self.flags.set_may_exit(true);
		}

		// Flip if the entire animation is flipped.
		if animation.flip_x() { self.flags.flip_x(None); }
		if animation.flip_y() { self.flags.flip_y(None); }

		// Store the new animation!
		self.scenes.replace(animation.scenes(self.size.0));
		self.animation.replace(animation);

		// Finally, if this requires a child, request it.
		if animation.child().is_some() { Universe::set_assign_child(); }

		#[cfg(feature = "director")]
		if animation_changed {
			debug!(&format!("Playing: {} (#{})", animation.as_str(), animation as u16));
		}
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
				w + Sprite::TILE_SIZE_I - 790,
				h - Sprite::TILE_SIZE_I,
			)),
			Animation::BlackSheepChase | Animation::ChaseAMartian => Some(Position::new(
				w + Sprite::TILE_SIZE_I * 3,
				h - Sprite::TILE_SIZE_I,
			)),
			Animation::BlackSheepChaseChild |
			Animation::BlackSheepRomance |
			Animation::ChaseAMartianChild => Some(Position::new(
				w + Sprite::TILE_SIZE_I,
				h - Sprite::TILE_SIZE_I,
			)),
			Animation::BlackSheepRomanceChild => Some(Position::new(
				-Sprite::TILE_SIZE_I * 2,
				h - Sprite::TILE_SIZE_I,
			)),
			Animation::Stargaze => Some(Position::new(w, h - Sprite::TILE_SIZE_I)),
			Animation::StargazeChild => Some(Position::new(
				-Sprite::TILE_SIZE_I,
				Sprite::TILE_SIZE_I * 2,
			)),
			// Randomize positioning.
			Animation::Yoyo => Some(Position::new(
				self.random_x(),
				-Sprite::TILE_SIZE_I,
			)),
			Animation::Fall | Animation::GraspingFall | Animation::WallSlide if first || self.pos.x < 0 || w - Sprite::TILE_SIZE_I < self.pos.x =>
				Some(Position::new(self.random_x(), -Sprite::TILE_SIZE_I)),
			_ => None,
		} {
			self.flags.flip_x(Some(false));
			self.flags.flip_y(Some(false));
			self.set_position(pos, true);
		}
	}

	/// # Set Frame.
	pub(crate) fn set_frame(&mut self, frame: u8) {
		if frame != self.frame {
			self.frame = frame;
			self.flags.mark_frame_changed();
		}
	}

	/// # Set Position.
	pub(crate) fn set_position(&mut self, pos: Position, absolute: bool) {
		if absolute {
			if pos.x != self.pos.x || pos.y != self.pos.y {
				self.pos = pos;
				self.flags.mark_transform_changed();
			}
		}
		else if pos.x != 0 || pos.y != 0 {
			self.pos.move_to(pos);
			self.flags.mark_transform_changed();
		}
	}
}

impl Mate {
	/// # Image Class Name.
	///
	/// This represents the current step's sprite frame.
	const fn image_class_name(&self) -> MateFrame { MateFrame::new(self.frame) }
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
			if dragging { self.set_animation(Animation::Fall); }
			else { self.set_animation(Animation::Drag); }
			true
		}
		// Tick it if we got it.
		else if self.next_tick <= now {
			self.pretick_resize();

			// Browser override?
			#[cfg(feature = "director")]
			if let Some(n) = Universe::next_animation() {
				Universe::set_no_child();
				self.next_animation.replace(n);
			}

			// Switch animations?
			if let Some(a) = self.next_animation.take() { self.set_animation(a); }
			// Otherwise if we're dragging, make sure to update the
			// coordinates.
			else if dragging { self.set_position(Universe::pos(), true); }

			// Flip if flipping is needed.
			self.flags.apply_next();

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
	fn pretick_resize(&mut self) -> bool {
		if self.active() {
			let (w, h) = Universe::size();
			if self.size.0 != w || self.size.1 != h {
				self.size.0 = w;
				self.size.1 = h;

				// If we're totally off-screen, we need to restart.
				if 0 == self.visibility() {
					if self.flags.primary() { self.start(); }
					else { self.stop(); }
					return true;
				}
			}
		}

		false
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
		self.flags.set_flip_x_next(step.flip_x_after());
		self.flags.set_flip_y_next(step.flip_y_after());
		self.flags.set_gravity(step.gravity());
		self.flags.set_ignore_edges(step.ignore_edges());

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
		let mut dir = step.direction();
		if let Some(mut pos) = step.move_to() {
			if self.flags.flipped_x() {
				pos = pos.invert_x();
				dir = dir.invert_x();
			}
			if self.flags.flipped_y() {
				pos = pos.invert_y();
				dir = dir.invert_y();
			}
			self.set_position(pos, false);
		}

		// Clamp wall animations to the appropriate side, if necessary.
		if let Some(mut dir2) = self.animation.and_then(Animation::clamp_x) {
			if self.flags.flipped_x() { dir2 = dir2.invert_x(); }
			if dir2.is_left() {
				if self.pos.x != 0 {
					self.set_position(Position::new(0, self.pos.y), true);
				}
			}
			else if dir2.is_right() && self.pos.x != self.max_x() {
				self.set_position(Position::new(self.max_x(), self.pos.y), true);
			}
		}

		// Rinse and repeat/switch/stop if we've crossed an edge.
		if self.check_edges(dir) {
			if self.active() { self.tick(now); }
		}
		// Switch animations.
		else if step.done() {
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
			self.set_animation(animation);
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
		if self.flags.changed() {
			let shadow = self.el.shadow_root().unwrap_throw();

			// Update the wrapper div's class and/or style.
			if self.flags.class_changed() || self.flags.transform_changed() {
				let wrapper: HtmlElement = shadow.get_element_by_id("p")
					.unwrap_throw()
					.unchecked_into();

				if self.flags.class_changed() {
					let classes = wrapper.class_list();
					classes.toggle_with_force("off", ! self.active()).unwrap_throw();
					classes.toggle_with_force("rx", self.flags.flipped_x()).unwrap_throw();
					classes.toggle_with_force("ry", self.flags.flipped_y()).unwrap_throw();
					classes.toggle_with_force("a1", matches!(self.animation, Some(Animation::Drag))).unwrap_throw();
					classes.toggle_with_force("a2", matches!(self.animation, Some(Animation::SneezeShadow))).unwrap_throw();
					classes.toggle_with_force("a3", matches!(self.animation, Some(Animation::Abduction))).unwrap_throw();
				}

				if self.flags.transform_changed() {
					let style = wrapper.style();
					let mut buf = [MaybeUninit::<u8>::uninit(); 13];
					style.set_property("--x", write_transform(self.pos.x, &mut buf)).unwrap_throw();
					style.set_property("--y", write_transform(self.pos.y, &mut buf)).unwrap_throw();
				}
			}

			// Update the image frame class.
			if self.flags.frame_changed() {
				let frame = self.image_class_name();
				shadow.get_element_by_id("i")
					.unwrap_throw()
					.set_class_name(frame.as_str());
			}

			// Play a sound?
			if let Some(sound) = self.sound.take() {
				let blob = sound.as_blob();
				let _res = Url::create_object_url_with_blob(&blob)
					.and_then(|src| HtmlAudioElement::new_with_src(&src))
					.and_then(|player| player.play());
			}

			self.flags.clear_changed();
		}
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
				self.set_animation(Animation::Fall);
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
			if self.pos.x <= 0 - Sprite::TILE_SIZE_I {
				if ! dir.is_right() { hit_edge = true; }
			}
			else if self.pos.x >= w && ! dir.is_left() { hit_edge = true; }
		}
		// We're at the left edge.
		else if self.pos.x <= 0 {
			// Unless we're moving right, something happened.
			if ! dir.is_right() {
				// Let offscreen fix itself with an entrance choice.
				if self.pos.x <= 0 - Sprite::TILE_SIZE_I { hit_edge = true; }
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
				if self.pos.y <= 0 - Sprite::TILE_SIZE_I { hit_edge = true; }
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
					else { animation.next_edge().unwrap_or(Animation::Rotate) }
				);
			}
			else { self.stop(); }
			true
		}
		else { false }
	}

	/// # Max X Position.
	const fn max_x(&self) -> i32 {
		self.size.0.saturating_sub(Sprite::TILE_SIZE) as i32
	}

	/// # Max Y Position.
	const fn max_y(&self) -> i32 {
		self.size.1.saturating_sub(Sprite::TILE_SIZE) as i32
	}

	#[allow(clippy::cast_sign_loss, clippy::cast_possible_truncation)]
	/// # Random X Position.
	///
	/// Return a random horizontal position within the boundaries of the
	/// screen, used by some start-up/entrance animations.
	fn random_x(&self) -> i32 {
		i32::from(Universe::rand_u16(self.max_x() as u16 + 1))
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
			self.pos.x <= -Sprite::TILE_SIZE_I ||
			self.pos.y <= -Sprite::TILE_SIZE_I ||
			self.pos.x >= self.size.0 as i32 ||
			self.pos.y >= self.size.1 as i32
		{
			0
		}
		// A bit of both.
		else { 1 }
	}
}



#[derive(Debug, Clone, Copy, Eq, PartialEq)]
/// # Mate Frame.
///
/// This is a simple wrapper holding the CSS class to use for a given image
/// frame. Because the logic and sizing is so tight, this lets us minimize
/// allocations, leading to a smaller overall binary.
struct MateFrame([u8; 5]);

impl MateFrame {
	#[allow(clippy::integer_division)]
	#[must_use]
	/// # New.
	const fn new(src: u8) -> Self {
		let row = hex_half_byte((src / 16) & 0xf);
		let col = hex_half_byte((src % 16) & 0xf);
		Self([b'r', row, b' ', b'c', col])
	}

	#[allow(unsafe_code)]
	#[must_use]
	/// # As Str.
	const fn as_str(&self) -> &str {
		// Safety: the inner array is valid ASCII.
		unsafe { std::str::from_utf8_unchecked(self.0.as_slice()) }
	}
}



/// # Hex Encode Half Byte.
///
/// This quickly maps a single-digit decimal to its lower-hex equivalent. There
/// are no sanity checks or anything; we know the values being passed to it are
/// appropriately clamped.
const fn hex_half_byte(byte: u8) -> u8 {
	if byte < 10 { byte + b'0' }
	else { byte - 10 + b'a' }
}

/// # Make Element.
fn make_element(primary: bool) -> HtmlElement {
	let document = dom::document();

	// Create the main element, its shadow DOM, and its shadow elements.
	let el: HtmlElement = document.create_element("div")
		.unwrap_throw()
		.unchecked_into();

	let shadow = el.attach_shadow(&ShadowRootInit::new(ShadowRootMode::Open))
		.unwrap_throw();

	shadow.set_inner_html(include_str!(concat!(env!("OUT_DIR"), "/poe.html")));

	// Change the wrapper class for primary sprites.
	if primary {
		shadow.get_element_by_id("p")
			.unwrap_throw()
			.set_class_name("off");
	}

	// Set the image source.
	let img = shadow.get_element_by_id("i").unwrap_throw();
	let blob = Sprite::as_blob();
	Url::create_object_url_with_blob(&blob)
		.and_then(|u| img.set_attribute("src", &u))
		.unwrap_throw();

	// Attach it to the body.
	dom::body().append_child(&el).unwrap_throw();

	el
}

#[allow(unsafe_code)]
/// # Write Transform.
///
/// This writes a given X/Y translate value to a (reusable) buffer and returns
/// the resulting string slice.
///
/// Pointer madness is faster than using `format!()`, but the real reason we're
/// doing it this way is to reduce the binary size. Even with the extra
/// dependency, this comes out about `500 KiB` smaller in release mode.
///
/// ## Safety
///
/// The buffer is 13 bytes, which has enough room for the worst-case value
/// (11 bytes) and the 2-byte "px" suffix.
fn write_transform(v: i32, buf: &mut TransformBuffer) -> &str {
	// Stringify the value.
	let len = unsafe { itoap::write_to_ptr(buf.as_mut_ptr().cast::<u8>(), v) };
	unsafe {
		// Add the unit.
		std::ptr::copy_nonoverlapping(
			b"px".as_ptr(),
			buf.as_mut_ptr().add(len).cast::<u8>(),
			2,
		);

		// Stringify what we've written.
		std::str::from_utf8_unchecked(
			&*(std::ptr::addr_of!(buf[..len + 2]) as *const [u8])
		)
	}
}
