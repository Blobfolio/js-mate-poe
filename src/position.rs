/*!
# RS Mate Poe: Position
*/

#[expect(clippy::missing_docs_in_private_items, reason = "Self-explanatory.")]
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
	pub(crate) const fn invert_x(self) -> Self {
		Self::new(self.x.saturating_neg(), self.y)
	}

	#[cfg(test)]
	/// # Invert (Y).
	pub(crate) const fn invert_y(self) -> Self {
		Self::new(self.x, self.y.saturating_neg())
	}

	/// # Move To.
	///
	/// Add `pos` to `self`, returning `true` if the coordinates changed as a
	/// result.
	pub(crate) const fn move_to(&mut self, pos: Self) -> bool {
		if pos.x == 0 && pos.y == 0 { false }
		else {
			self.x = self.x.saturating_add(pos.x);
			self.y = self.y.saturating_add(pos.y);
			true
		}
	}
}



#[repr(u8)]
#[derive(Debug, Clone, Copy, Default, Eq, PartialEq)]
/// # Relative Direction.
pub(crate) enum Direction {
	#[default]
	None =      0b0000_0000, // No X or Y.
	Left =      0b0000_0001, // Leftward X, no Y.
	Right =     0b0000_0010, // Rightward X, no Y.
	Up   =      0b0000_0100, // No X, upward Y.
	Down =      0b0000_1000, // No X, downward Y.
	LeftUp =    0b0000_0101, // Left and Up.
	LeftDown =  0b0000_1001, // Left and Down.
	RightUp =   0b0000_0110, // Right and up.
	RightDown = 0b0000_1010, // Right and down.
}

impl Direction {
	/// # Left and/or Right.
	const BOTH_X: u8 = Self::Left as u8 | Self::Right as u8;

	#[cfg(test)]
	/// # Up and/or Down.
	const BOTH_Y: u8 = Self::Up as u8 | Self::Down as u8;

	/// # From U8.
	const fn from_u8(flag: u8) -> Self {
		match flag & 0b0000_1111 {
			0b0000_0001 => Self::Left,
			0b0000_0010 => Self::Right,
			0b0000_0100 => Self::Up,
			0b0000_1000 => Self::Down,
			0b0000_0101 => Self::LeftUp,
			0b0000_1001 => Self::LeftDown,
			0b0000_0110 => Self::RightUp,
			0b0000_1010 => Self::RightDown,
			_ => Self::None,
		}
	}
}

/// # Helper: Is Direction?
macro_rules! is {
	($title:literal, $fn:ident, $flag:ident) => (
		#[doc = concat!("# Is ", $title, " Movement?")]
		pub(crate) const fn $fn(self) -> bool {
			Self::$flag as u8 == self as u8 & Self::$flag as u8
		}
	);
}

impl Direction {
	is!("Leftward", is_left, Left);
	is!("Rightward", is_right, Right);
	is!("Upward", is_up, Up);
	is!("Downward", is_down, Down);
}

impl Direction {
	/// # Invert X.
	pub(crate) const fn invert_x(self) -> Self {
		if 0 == self as u8 & Self::BOTH_X { self }
		else { Self::from_u8(self as u8 ^ Self::BOTH_X) }
	}

	#[cfg(test)]
	/// # Invert Y.
	pub(crate) const fn invert_y(self) -> Self {
		if 0 == self as u8 & Self::BOTH_Y { self }
		else { Self::from_u8(self as u8 ^ Self::BOTH_Y) }
	}
}



#[cfg(test)]
mod tests {
	use super::*;
	use wasm_bindgen_test::*;

	macro_rules! test_x {
		($var:ident) => (
			assert!(! $var.is_left(), "{:?}", $var);
			assert!(! $var.is_right(), "{:?}", $var);
			assert!(! $var.invert_x().is_left(), "!x {:?}", $var);
			assert!(! $var.invert_x().is_right(), "!x {:?}", $var);
		);
		($var:ident, $left:literal, $right:literal) => (
			assert_eq!($var.is_left(),  $left, "{:?}", $var);
			assert_eq!($var.is_right(), $right, "{:?}", $var);
			assert_ne!($var.invert_x().is_left(),  $left, "!x {:?}", $var);
			assert_ne!($var.invert_x().is_right(), $right, "!x {:?}", $var);
			assert_eq!($var.invert_y().is_left(),  $left, "!y {:?}", $var);
			assert_eq!($var.invert_y().is_right(), $right, "!y {:?}", $var);
		);
	}
	macro_rules! test_y {
		($var:ident) => (
			assert!(! $var.is_up(), "{:?}", $var);
			assert!(! $var.is_down(), "{:?}", $var);
			assert!(! $var.invert_y().is_up(), "!x {:?}", $var);
			assert!(! $var.invert_y().is_down(), "!x {:?}", $var);
		);
		($var:ident, $up:literal, $down:literal) => (
			assert_eq!($var.is_up(),  $up, "{:?}", $var);
			assert_eq!($var.is_down(), $down, "{:?}", $var);
			assert_eq!($var.invert_x().is_up(),  $up, "!x {:?}", $var);
			assert_eq!($var.invert_x().is_down(), $down, "!x {:?}", $var);
			assert_ne!($var.invert_y().is_up(),  $up, "!y {:?}", $var);
			assert_ne!($var.invert_y().is_down(), $down, "!y {:?}", $var);
		);
	}

	#[wasm_bindgen_test]
	fn t_direction() {
		// No direction.
		let pos = Position::new(0, 0);
		let dir = pos.direction();
		assert!(matches!(dir, Direction::None));
		assert!(matches!(dir.invert_x(), Direction::None));
		assert!(matches!(dir.invert_y(), Direction::None));
		test_x!(dir);
		test_y!(dir);

		// Bad directions.
		assert_eq!(Direction::from_u8(0b1111_1111), Direction::None);
		assert_eq!(Direction::from_u8(Direction::BOTH_X), Direction::None);
		assert_eq!(Direction::from_u8(Direction::BOTH_Y), Direction::None);
		assert_eq!(Direction::from_u8(Direction::BOTH_X | Direction::Up as u8), Direction::None);
		assert_eq!(Direction::from_u8(Direction::BOTH_Y | Direction::Left as u8), Direction::None);

		// Left.
		let pos = Position::new(-10, 0);
		let dir = pos.direction();
		assert!(matches!(dir, Direction::Left));
		assert!(matches!(dir.invert_x(), Direction::Right));
		assert!(matches!(dir.invert_y(), Direction::Left));
		test_x!(dir, true, false);
		test_y!(dir);

		// Left/Up.
		let pos = Position::new(-10, -10);
		let dir = pos.direction();
		assert!(matches!(dir, Direction::LeftUp));
		assert!(matches!(dir.invert_x(), Direction::RightUp));
		assert!(matches!(dir.invert_y(), Direction::LeftDown));
		test_x!(dir, true, false);
		test_y!(dir, true, false);

		// Left/Down.
		let pos = Position::new(-10, 10);
		let dir = pos.direction();
		assert!(matches!(dir, Direction::LeftDown));
		assert!(matches!(dir.invert_x(), Direction::RightDown));
		assert!(matches!(dir.invert_y(), Direction::LeftUp));
		test_x!(dir, true, false);
		test_y!(dir, false, true);

		// Right.
		let pos = Position::new(10, 0);
		let dir = pos.direction();
		assert!(matches!(dir, Direction::Right));
		assert!(matches!(dir.invert_x(), Direction::Left));
		assert!(matches!(dir.invert_y(), Direction::Right));
		test_x!(dir, false, true);
		test_y!(dir);

		// Right/Up.
		let pos = Position::new(10, -10);
		let dir = pos.direction();
		assert!(matches!(dir, Direction::RightUp));
		assert!(matches!(dir.invert_x(), Direction::LeftUp));
		assert!(matches!(dir.invert_y(), Direction::RightDown));
		test_x!(dir, false, true);
		test_y!(dir, true, false);

		// Right/Down.
		let pos = Position::new(10, 10);
		let dir = pos.direction();
		assert!(matches!(dir, Direction::RightDown));
		assert!(matches!(dir.invert_x(), Direction::LeftDown));
		assert!(matches!(dir.invert_y(), Direction::RightUp));
		test_x!(dir, false, true);
		test_y!(dir, false, true);

		// Up.
		let pos = Position::new(0, -10);
		let dir = pos.direction();
		assert!(matches!(dir, Direction::Up));
		assert!(matches!(dir.invert_x(), Direction::Up));
		assert!(matches!(dir.invert_y(), Direction::Down));
		test_x!(dir);
		test_y!(dir, true, false);

		// Down.
		let pos = Position::new(0, 10);
		let dir = pos.direction();
		assert!(matches!(dir, Direction::Down));
		assert!(matches!(dir.invert_x(), Direction::Down));
		assert!(matches!(dir.invert_y(), Direction::Up));
		test_x!(dir);
		test_y!(dir, false, true);
	}

	#[wasm_bindgen_test]
	fn t_direction_conv() {
		for d in [
			Direction::None, Direction::Left, Direction::Right, Direction::Up,
			Direction::Down, Direction::LeftUp, Direction::LeftDown,
			Direction::RightUp, Direction::RightDown
		] {
			// Make sure Direction-to-U8-to-Direction gets us back where we
			// started.
			let i = d as u8;
			assert_eq!(d, Direction::from_u8(i));
		}
	}

	#[wasm_bindgen_test]
	fn t_pos() {
		// Invert X.
		assert_eq!(Position::new(0, 0).invert_x(), Position::new(0, 0));
		assert_eq!(Position::new(1, 1).invert_x(), Position::new(-1, 1));
		assert_eq!(Position::new(-1, -1).invert_x(), Position::new(1, -1));

		// Invert Y.
		assert_eq!(Position::new(0, 0).invert_y(), Position::new(0, 0));
		assert_eq!(Position::new(1, 1).invert_y(), Position::new(1, -1));
		assert_eq!(Position::new(-1, -1).invert_y(), Position::new(-1, 1));

		// Move absolute.
		let mut pos = Position::new(0, 0);
		assert!(!pos.move_to(Position::new(0, 0)));
		assert_eq!(pos, Position::new(0, 0));

		assert!(pos.move_to(Position::new(1, 1)));
		assert_eq!(pos, Position::new(1, 1));

		assert!(pos.move_to(Position::new(i32::MAX, 10)));
		assert_eq!(pos, Position::new(i32::MAX, 11));

		assert!(!pos.move_to(Position::new(0, 0)));
		assert_eq!(pos, Position::new(i32::MAX, 11));
	}
}
