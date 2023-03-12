/*!
# RS Mate Poe: Position
*/

#[derive(Debug, Clone, Copy, Default, Eq, PartialEq)]
/// # Position.
///
/// This struct represents a simple X/Y coordinate, either an explicit position
/// or a desired movement.
pub(crate) struct Position {
	pub(crate) x: i32,
	pub(crate) y: i32,
}

impl Position {
	/// # New.
	pub(crate) const fn new(x: i32, y: i32) -> Self { Self { x, y } }

	#[must_use]
	/// # Relative Direction.
	///
	/// Return the directional movement this position would have, were it
	/// applied to another.
	pub(crate) const fn direction(self) -> Direction {
		match (self.x, self.y) {
			(0, 0) => Direction::None,
			(0, _) =>
				if self.y.is_positive() { Direction::Down }
				else { Direction::Up },
			(_, 0) =>
				if self.x.is_positive() { Direction::Right }
				else { Direction::Left },
			_ => match (self.x.is_positive(), self.y.is_positive()) {
				(true, true) => Direction::RightDown,
				(true, false) => Direction::RightUp,
				(false, true) => Direction::LeftDown,
				(false, false) => Direction::LeftUp,
			},
		}
	}
}

impl Position {
	/// # Invert (X).
	pub(crate) const fn invert_x(&self) -> Self {
		Self::new(self.x.saturating_neg(), self.y)
	}

	/// # Invert (Y).
	pub(crate) const fn invert_y(&self) -> Self {
		Self::new(self.x, self.y.saturating_neg())
	}

	/// # Move To.
	///
	/// Add `pos` to `self`, returning `true` if the coordinates changed as a
	/// result.
	pub(crate) fn move_to(&mut self, pos: Self) -> bool {
		if pos.x == 0 && pos.y == 0 { false }
		else {
			self.x = self.x.saturating_add(pos.x);
			self.y = self.y.saturating_add(pos.y);
			true
		}
	}
}



#[allow(missing_docs)]
#[derive(Debug, Clone, Copy, Default, Eq, PartialEq)]
/// # Relative Direction.
pub(crate) enum Direction {
	#[default]
	None,      // No X or Y.
	Up,        // No X, upward Y.
	Down,      // No X, downward Y.

	Left,      // Leftward X, no Y.
	LeftDown,  // Left and Down.
	LeftUp,    // Left and Up.

	Right,     // Rightward X, no Y.
	RightDown, // Right and down.
	RightUp,   // Right and up.
}

impl Direction {
	/// # Is Leftward Movement?
	pub(crate) const fn is_left(self) -> bool {
		matches!(self, Self::Left | Self::LeftDown | Self::LeftUp)
	}

	/// # Is Rightward Movement?
	pub(crate) const fn is_right(self) -> bool {
		matches!(self, Self::Right | Self::RightDown | Self::RightUp)
	}

	/// # Is Upward Movement?
	pub(crate) const fn is_up(self) -> bool {
		matches!(self, Self::LeftUp | Self::RightUp | Self::Up)
	}

	/// # Is Downward Movement?
	pub(crate) const fn is_down(self) -> bool {
		matches!(self, Self::Down | Self::LeftDown | Self::RightDown)
	}
}

impl Direction {
	/// # Invert X.
	pub(crate) const fn invert_x(self) -> Self {
		match self {
			Self::Left => Self::Right,
			Self::LeftDown => Self::RightDown,
			Self::LeftUp => Self::RightUp,
			Self::Right => Self::Left,
			Self::RightDown => Self::LeftDown,
			Self::RightUp => Self::LeftUp,
			_ => self,
		}
	}

	/// # Invert Y.
	pub(crate) const fn invert_y(self) -> Self {
		match self {
			Self::Down => Self::Up,
			Self::LeftDown => Self::LeftUp,
			Self::LeftUp => Self::LeftDown,
			Self::RightDown => Self::RightUp,
			Self::RightUp => Self::RightDown,
			Self::Up => Self::Down,
			_ => self,
		}
	}
}



#[cfg(test)]
mod tests {
	use super::*;

	#[test]
	fn t_direction() {
		// No direction.
		let pos = Position::new(0, 0);
		let dir = pos.direction();
		assert!(matches!(dir, Direction::None));
		assert!(! dir.is_left());
		assert!(! dir.is_right());
		assert!(! dir.is_up());
		assert!(! dir.is_down());

		// Left.
		let pos = Position::new(-10, 0);
		let dir = pos.direction();
		assert!(matches!(dir, Direction::Left));
		assert!(dir.is_left());
		assert!(! dir.is_right());
		assert!(! dir.is_up());
		assert!(! dir.is_down());

		// Left/Up.
		let pos = Position::new(-10, -10);
		let dir = pos.direction();
		assert!(matches!(dir, Direction::LeftUp));
		assert!(dir.is_left());
		assert!(! dir.is_right());
		assert!(dir.is_up());
		assert!(! dir.is_down());

		// Left/Down.
		let pos = Position::new(-10, 10);
		let dir = pos.direction();
		assert!(matches!(dir, Direction::LeftDown));
		assert!(dir.is_left());
		assert!(! dir.is_right());
		assert!(! dir.is_up());
		assert!(dir.is_down());

		// Right.
		let pos = Position::new(10, 0);
		let dir = pos.direction();
		assert!(matches!(dir, Direction::Right));
		assert!(! dir.is_left());
		assert!(dir.is_right());
		assert!(! dir.is_up());
		assert!(! dir.is_down());

		// Right/Up.
		let pos = Position::new(10, -10);
		let dir = pos.direction();
		assert!(matches!(dir, Direction::RightUp));
		assert!(! dir.is_left());
		assert!(dir.is_right());
		assert!(dir.is_up());
		assert!(! dir.is_down());

		// Right/Down.
		let pos = Position::new(10, 10);
		let dir = pos.direction();
		assert!(matches!(dir, Direction::RightDown));
		assert!(! dir.is_left());
		assert!(dir.is_right());
		assert!(! dir.is_up());
		assert!(dir.is_down());

		// Up.
		let pos = Position::new(0, -10);
		let dir = pos.direction();
		assert!(matches!(dir, Direction::Up));
		assert!(! dir.is_left());
		assert!(! dir.is_right());
		assert!(dir.is_up());
		assert!(! dir.is_down());

		// Down.
		let pos = Position::new(0, 10);
		let dir = pos.direction();
		assert!(matches!(dir, Direction::Down));
		assert!(! dir.is_left());
		assert!(! dir.is_right());
		assert!(! dir.is_up());
		assert!(dir.is_down());
	}
}
