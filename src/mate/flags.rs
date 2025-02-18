/*!
# RS Mate Poe: Mate Flags
*/



#[derive(Debug, Clone, Copy)]
/// # Mate Flags.
///
/// This abstracts all the different mate flags, getters, and setters.
pub(crate) struct MateFlags(u16);

impl MateFlags {
	/// # Flag: Flip horizontally.
	const FLIPPED_X: u16 =         0b0000_0000_0000_0001;

	/// # Flag: Flip X on _next_ tick.
	const FLIP_X_NEXT: u16 =       0b0000_0000_0000_0010;

	/// # Flag: Gravity applies.
	const GRAVITY: u16 =           0b0000_0000_0000_0100;

	/// # Flag: No edge checking needed.
	const IGNORE_EDGES: u16 =      0b0000_0000_0000_1000;

	/// # Flag: Allowed to exit.
	const MAY_EXIT: u16 =          0b0000_0000_0001_0000;

	/// # Flag: Primary sprite.
	const PRIMARY: u16 =           0b0000_0000_0010_0000;

	/// # Flag: Disable focus/click/drag.
	const NO_FOCUS: u16 =          0b0000_0000_0100_0000;

	/// # Flag: Class-affecting property changed.
	const CHANGED_CLASS: u16 =     0b0000_0000_1000_0000;

	/// # Flag: Image frame changed.
	const CHANGED_FRAME: u16 =     0b0000_0001_0000_0000;

	/// # Flag: Screen resized.
	const CHANGED_SIZE: u16 =      0b0000_0010_0000_0000;

	/// # Flag: Need to play a sound.
	const CHANGED_SOUND: u16 =     0b0000_0100_0000_0000;

	/// # Flag: X position changed.
	const CHANGED_TRANS_X: u16 =   0b0000_1000_0000_0000;

	/// # Flag: Y position changed.
	const CHANGED_TRANS_Y: u16 =   0b0001_0000_0000_0000;

	/// # Transform-related changes.
	const CHANGED_TRANSFORM: u16 =
		Self::CHANGED_TRANS_X | Self::CHANGED_TRANS_Y;

	/// # Edge-related changes.
	const CHANGED_EDGES: u16 = Self::CHANGED_SIZE | Self::CHANGED_TRANSFORM;

	/// # All change-related settings.
	const CHANGED: u16 =
		Self::CHANGED_CLASS | Self::CHANGED_FRAME |
		Self::CHANGED_SOUND | Self::CHANGED_TRANSFORM;

	/// # Scene Mask.
	const SCENE_MASK: u16 =
		Self::FLIP_X_NEXT | Self::GRAVITY | Self::IGNORE_EDGES;
}

impl MateFlags {
	/// # New.
	pub(crate) const fn new(primary: bool) -> Self {
		if primary { Self(Self::PRIMARY) }
		else { Self(0) }
	}
}

/// # Helper: Flag Getter.
macro_rules! get {
	($title:literal, $flag:ident, $fn:ident) => (
		#[doc = concat!("# Is ", $title, "?")]
		pub(crate) const fn $fn(self) -> bool {
			Self::$flag == self.0 & Self::$flag
		}
	);
}

impl MateFlags {
	get!("Flipped (X)", FLIPPED_X, flipped_x);
	get!("Gravity Applies", GRAVITY, gravity);
	get!("Ignore Edges", IGNORE_EDGES, ignore_edges);
	get!("Allowed to Exit Screen", MAY_EXIT, may_exit);
	get!("No Focus?", NO_FOCUS, no_focus);
	get!("Primary Mate", PRIMARY, primary);
	get!("Class Changed", CHANGED_CLASS, class_changed);
	get!("Frame Changed", CHANGED_FRAME, frame_changed);
	get!("Transform (X) Changed", CHANGED_TRANS_X, transform_x_changed);
	get!("Transform (Y) Changed", CHANGED_TRANS_Y, transform_y_changed);

	/// # Any Edge-related Changes?
	///
	/// Note: calling this will reset the size-changed flag, so unless there's
	/// movement (or the screen size changes again), this won't return true
	/// twice.
	pub(crate) fn edges_changed(&mut self) -> bool {
		if 0 == self.0 & Self::CHANGED_EDGES { false }
		else {
			self.0 &= ! Self::CHANGED_SIZE;
			true
		}
	}

	/// # Any Transform Changed?
	pub(crate) const fn transform_changed(self) -> bool {
		0 != self.0 & Self::CHANGED_TRANSFORM
	}

	/// # Anything Changed?
	pub(crate) const fn changed(self) -> bool {
		0 != self.0 & Self::CHANGED
	}
}

impl MateFlags {
	/// # Clear.
	///
	/// Reset all flags except `Self::PRIMARY`.
	pub(crate) fn clear(&mut self) {
		if self.primary() { self.0 = Self::PRIMARY; }
		else { self.0 = 0; }
	}

	/// # Clear All Change-Related Flags.
	pub(crate) fn clear_changed(&mut self) { self.0 &= ! Self::CHANGED; }

	/// # Mark Class Changed.
	pub(crate) fn mark_class_changed(&mut self) { self.0 |= Self::CHANGED_CLASS; }

	/// # Mark Frame Changed.
	pub(crate) fn mark_frame_changed(&mut self) { self.0 |= Self::CHANGED_FRAME; }

	/// # Mark Size Changed.
	pub(crate) fn mark_size_changed(&mut self) { self.0 |= Self::CHANGED_SIZE; }

	/// # Mark Sound Changed.
	pub(crate) fn mark_sound_changed(&mut self) { self.0 |= Self::CHANGED_SOUND; }

	/// # Mark Transform (X) Changed.
	pub(crate) fn mark_transform_x_changed(&mut self) { self.0 |= Self::CHANGED_TRANS_X; }

	/// # Mark Transform (Y) Changed.
	pub(crate) fn mark_transform_y_changed(&mut self) { self.0 |= Self::CHANGED_TRANS_Y; }

	/// # Mark All Changed.
	pub(crate) fn mark_changed(&mut self) { self.0 |= Self::CHANGED; }

	/// # Apply Next.
	///
	/// Remove the next X/Y properties and flip (the current state) accordingly.
	pub(crate) fn apply_next(&mut self) {
		if Self::FLIP_X_NEXT == self.0 & Self::FLIP_X_NEXT {
			self.0 ^= Self::FLIPPED_X | Self::FLIP_X_NEXT;
			self.mark_class_changed();
		}
	}

	/// # Flip (X).
	///
	/// Flip/unflip horizontally, or toggle if `None`.
	pub(crate) fn flip_x(&mut self, v: Option<bool>) {
		if v.is_none_or(|v| v != self.flipped_x()) {
			self.0 ^= Self::FLIPPED_X;
			self.mark_class_changed();
		}
	}

	/// # Set May Exit.
	pub(crate) fn set_may_exit(&mut self, v: bool) {
		if v { self.0 |= Self::MAY_EXIT; }
		else { self.0 &= ! Self::MAY_EXIT; }
	}

	/// # Set No Focus.
	pub(crate) fn set_no_focus(&mut self, v: bool) {
		if self.no_focus() != v {
			if v { self.0 |= Self::NO_FOCUS; }
			else { self.0 &= ! Self::NO_FOCUS; }
			self.mark_class_changed();
		}
	}

	/// # Set Scene Flags.
	pub(crate) fn set_scene_flags(&mut self, flags: u16) {
		self.0 &= ! Self::SCENE_MASK;
		self.0 |= flags & Self::SCENE_MASK;
	}
}



#[cfg(test)]
mod tests {
	use super::*;
	use wasm_bindgen_test::*;

	#[wasm_bindgen_test]
	fn t_mate_scene_flags() {
		use crate::Scene;

		macro_rules! flag {
			($flag:ident) => (
				assert_eq!(
					Scene::$flag as u16, MateFlags::$flag,
					concat!(stringify!($flag), " flags are not equivalent."),
				);
			);
		}

		flag!(FLIP_X_NEXT);
		flag!(GRAVITY);
		flag!(IGNORE_EDGES);

		assert_eq!(
			u16::from(Scene::MATE_MASK),
			MateFlags::SCENE_MASK,
			"MATE_MASK/SCENE_MASK flags are not equivalent.",
		);
	}
}
