/*!
# RS Mate Poe: Mate Flags
*/



#[derive(Debug, Clone, Copy)]
/// # Mate Flags.
///
/// This abstracts all the different mate flags, getters, and setters.
pub(crate) struct MateFlags(u16);

impl MateFlags {
	const FLIPPED_X: u16 =         0b0000_0000_0000_0001; // Flip horizontally.
	const FLIPPED_Y: u16 =         0b0000_0000_0000_0010; // Flip vertically.
	const FLIP_X_NEXT: u16 =       0b0000_0000_0000_0100; // Flip X on _next_ tick.
	const FLIP_Y_NEXT: u16 =       0b0000_0000_0000_1000; // Flip Y on _next_ tick.
	const GRAVITY: u16 =           0b0000_0000_0001_0000; // Gravity applies.
	const IGNORE_EDGES: u16 =      0b0000_0000_0010_0000; // No edge checking needed.
	const MAY_EXIT: u16 =          0b0000_0000_0100_0000; // Allowed to exit.
	const PRIMARY: u16 =           0b0000_0000_1000_0000; // Primary sprite.

	const CHANGED_CLASS: u16 =     0b0000_0001_0000_0000; // Class-affecting property changed.
	const CHANGED_FRAME: u16 =     0b0000_0010_0000_0000; // Image frame changed.
	const CHANGED_SOUND: u16 =     0b0000_0100_0000_0000; // Need to play a sound.
	const CHANGED_TRANS_X: u16 =   0b0000_1000_0000_0000; // X position changed.
	const CHANGED_TRANS_Y: u16 =   0b0001_0000_0000_0000; // Y position changed.

	// Transform-related changes.
	const CHANGED_TRANSFORM: u16 =
		Self::CHANGED_TRANS_X | Self::CHANGED_TRANS_Y;

	// All change-related settings.
	const CHANGED: u16 =
		Self::CHANGED_CLASS | Self::CHANGED_FRAME |
		Self::CHANGED_SOUND | Self::CHANGED_TRANSFORM;

	// All flip-related settings.
	const FLIPPED: u16 = Self::FLIPPED_X | Self::FLIPPED_Y;
}

impl MateFlags {
	/// # New.
	pub(crate) const fn new(primary: bool) -> Self {
		if primary { Self(Self::PRIMARY) }
		else { Self(0) }
	}
}

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
	get!("Flipped (Y)", FLIPPED_Y, flipped_y);
	get!("Gravity Applies", GRAVITY, gravity);
	get!("Ignore Edges", IGNORE_EDGES, ignore_edges);
	get!("Allowed to Exit Screen", MAY_EXIT, may_exit);
	get!("Primary Mate", PRIMARY, primary);
	get!("Class Changed", CHANGED_CLASS, class_changed);
	get!("Frame Changed", CHANGED_FRAME, frame_changed);
	get!("Transform (X) Changed", CHANGED_TRANS_X, transform_x_changed);
	get!("Transform (Y) Changed", CHANGED_TRANS_Y, transform_y_changed);

	/// # Any Transform Changed?
	pub(crate) const fn transform_changed(self) -> bool {
		0 != self.0 & Self::CHANGED_TRANSFORM
	}

	/// # Anything Changed?
	pub(crate) const fn changed(self) -> bool {
		0 != self.0 & Self::CHANGED
	}
}

macro_rules! set {
	($title:literal, $flag:ident, $set:ident) => (
		#[doc = concat!("# Set ", $title)]
		pub(crate) fn $set(&mut self, v: bool) {
			if v { self.0 |= Self::$flag; }
			else { self.0 &= ! Self::$flag; }
		}
	);
}

impl MateFlags {
	set!("Gravity", GRAVITY, set_gravity);
	set!("Ignore Edges", IGNORE_EDGES, set_ignore_edges);
	set!("Allowed to Exit Screen", MAY_EXIT, set_may_exit);
	set!("Flip (X) Next", FLIP_X_NEXT, set_flip_x_next);
	set!("Flip (Y) Next", FLIP_Y_NEXT, set_flip_y_next);

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
		if 0 != self.0 & (Self::FLIP_X_NEXT | Self::FLIP_Y_NEXT) {
			if Self::FLIP_X_NEXT == self.0 & Self::FLIP_X_NEXT {
				self.0 ^= Self::FLIPPED_X | Self::FLIP_X_NEXT;
			}
			if Self::FLIP_Y_NEXT == self.0 & Self::FLIP_Y_NEXT {
				self.0 ^= Self::FLIPPED_Y | Self::FLIP_Y_NEXT;
			}
			self.mark_class_changed();
		}
	}

	/// # Clear All Flip-Related Flags.
	pub(crate) fn clear_flips(&mut self) {
		if 0 != self.0 & Self::FLIPPED {
			self.0 &= ! Self::FLIPPED;
			self.mark_class_changed();
		}
	}

	/// # Flip (X).
	///
	/// Flip/unflip horizontally, or toggle if `None`.
	pub(crate) fn flip_x(&mut self, v: Option<bool>) {
		if v.map_or(true, |v| v != self.flipped_x()) {
			self.0 ^= Self::FLIPPED_X;
			self.mark_class_changed();
		}
	}

	/// # Flip (Y).
	///
	/// Flip/unflip vertically, or toggle if `None`.
	pub(crate) fn flip_y(&mut self, v: Option<bool>) {
		if v.map_or(true, |v| v != self.flipped_y()) {
			self.0 ^= Self::FLIPPED_Y;
			self.mark_class_changed();
		}
	}
}
