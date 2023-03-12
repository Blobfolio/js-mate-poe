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
	const REVERSED_X: u16 =        0b0000_0001_0000_0000; // Reverse X movements.
	const REVERSED_Y: u16 =        0b0000_0010_0000_0000; // Reverse Y movements.

	const CHANGED_CLASS: u16 =     0b0000_0100_0000_0000; // Class-affecting property changed.
	const CHANGED_FRAME: u16 =     0b0000_1000_0000_0000; // Image frame changed.
	const CHANGED_SOUND: u16 =     0b0001_0000_0000_0000; // Need to play a sound.
	const CHANGED_TRANSFORM: u16 = 0b0010_0000_0000_0000; // Transform-affecting property changed.
	const CHANGED: u16 =
		Self::CHANGED_CLASS | Self::CHANGED_FRAME |
		Self::CHANGED_SOUND | Self::CHANGED_TRANSFORM;
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
	get!("Gravity Applies", GRAVITY, gravity);
	get!("Ignore Edges", IGNORE_EDGES, ignore_edges);
	get!("Allowed to Exit Screen", MAY_EXIT, may_exit);
	get!("Reversed (X)", REVERSED_X, reversed_x);
	get!("Reversed (Y)", REVERSED_Y, reversed_y);
	get!("Primary Mate", PRIMARY, primary);
	get!("Class Changed", CHANGED_CLASS, class_changed);
	get!("Frame Changed", CHANGED_FRAME, frame_changed);
	get!("Transform Changed", CHANGED_TRANSFORM, transform_changed);

	/// # Anything Changed?
	pub(crate) const fn changed(self) -> bool {
		0 != self.0 & Self::CHANGED
	}

	/// # Is Flipped (X)?
	pub(crate) const fn flipped_x(self) -> bool {
		if self.reversed_x() { 0 == self.0 & Self::FLIPPED_X }
		else { Self::FLIPPED_X == self.0 & Self::FLIPPED_X }
	}

	/// # Is Flipped (Y)?
	pub(crate) const fn flipped_y(self) -> bool {
		if self.reversed_y() { 0 == self.0 & Self::FLIPPED_Y }
		else { Self::FLIPPED_Y == self.0 & Self::FLIPPED_Y }
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

	/// # Set Reversed (X).
	pub(crate) fn set_reversed_x(&mut self, v: bool) -> bool {
		if v == self.reversed_x() { false }
		else {
			if v { self.0 |= Self::REVERSED_X; }
			else { self.0 &= ! Self::REVERSED_X; }
			true
		}
	}

	/// # Set Reversed (Y).
	pub(crate) fn set_reversed_y(&mut self, v: bool) -> bool {
		if v == self.reversed_y() { false }
		else {
			if v { self.0 |= Self::REVERSED_Y; }
			else { self.0 &= ! Self::REVERSED_Y; }
			true
		}
	}

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

	/// # Mark Transform Changed.
	pub(crate) fn mark_transform_changed(&mut self) { self.0 |= Self::CHANGED_TRANSFORM; }

	/// # Mark All Changed.
	pub(crate) fn mark_changed(&mut self) { self.0 |= Self::CHANGED; }

	/// # Apply Next.
	///
	/// Remove the next X/Y properties and flip (the current state) accordingly.
	pub(crate) fn apply_next(&mut self) {
		if Self::FLIP_X_NEXT == self.0 & Self::FLIP_X_NEXT { self.flip_x(None); }
		if Self::FLIP_Y_NEXT == self.0 & Self::FLIP_Y_NEXT { self.flip_y(None); }
		self.0 &= ! (Self::FLIP_X_NEXT | Self::FLIP_Y_NEXT);
	}

	/// # Clear All Flip-Related Flags.
	pub(crate) fn clear_flips(&mut self) {
		self.0 &= ! (Self::FLIPPED_X | Self::FLIPPED_Y | Self::REVERSED_X | Self::REVERSED_Y);
	}

	/// # Flip (X).
	///
	/// Flip/unflip horizontally, or toggle if `None`.
	///
	/// If `Self::REVERSED_X` is set, this does the opposite of what is
	/// requested to keep things logically consistent.
	pub(crate) fn flip_x(&mut self, v: Option<bool>) {
		let old = self.flipped_x();
		let v = v.map_or_else(
			|| ! old,
			|v| if self.reversed_x() { ! v } else { v },
		);

		if v != old {
			if v { self.0 |= Self::FLIPPED_X; }
			else { self.0 &= ! Self::FLIPPED_X; }
			self.mark_class_changed();
		}
	}

	/// # Flip (Y).
	///
	/// Flip/unflip vertically, or toggle if `None`.
	///
	/// If `Self::REVERSED_Y` is set, this does the opposite of what is
	/// requested to keep things logically consistent.
	pub(crate) fn flip_y(&mut self, v: Option<bool>) {
		let old = self.flipped_y();
		let v = v.map_or_else(
			|| ! old,
			|v| if self.reversed_y() { ! v } else { v },
		);

		if v != old {
			if v { self.0 |= Self::FLIPPED_Y; }
			else { self.0 &= ! Self::FLIPPED_Y; }
			self.mark_class_changed();
		}
	}
}
