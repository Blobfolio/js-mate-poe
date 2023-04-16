/*!
# RS Mate Poe: Animation Scenes
*/

use crate::{
	Direction,
	Frame,
	Position,
	Sound,
};
use std::num::NonZeroU16;



#[derive(Debug, Clone, Copy, Eq, PartialEq)]
/// # Scene.
///
/// This represents a sequence of frames to flip through while moving a fixed
/// distance in time and/or space.
///
/// (A given `Animation` might comprise several `Scene`s, i.e. a `SceneList`.)
pub(crate) struct Scene {
	move_to: Option<Position>,
	fpms: u16,
	frames: &'static [Frame],
	repeat: Option<(NonZeroU16, u8)>,
	sound: Option<(Sound, u8)>,
	flags: u8,
}

impl Scene {
	/// # New.
	pub(crate) const fn new(fpms: u16, frames: &'static [Frame]) -> Self {
		Self {
			move_to: None,
			fpms,
			frames,
			repeat: None,
			sound: None,
			flags: 0,
		}
	}

	/// # With Move To.
	pub(crate) const fn with_move_to(self, pos: Position) -> Self {
		Self { move_to: Some(pos), ..self }
	}

	/// # With Repeat.
	pub(crate) const fn with_repeat(self, repeat: u16, from: u8) -> Self {
		if let Some(repeat) = NonZeroU16::new(repeat) {
			Self { repeat: Some((repeat, from)), ..self }
		}
		else { self }
	}

	/// # With Sound.
	pub(crate) const fn with_sound(self, sound: Sound, idx: u8) -> Self {
		Self { sound: Some((sound, idx)), ..self }
	}

	/// # With Flags.
	pub(crate) const fn with_flags(self, flags: u8) -> Self {
		Self { flags, ..self }
	}
}

impl Scene {
	/// # Number of Steps.
	///
	/// Return the total number of steps for the `Scene`, ultimately determined
	/// by the frame count (including repeats).
	pub(crate) const fn steps(&self) -> usize {
		let len = self.frames.len();
		if let Some((repeat, from)) = self.repeat {
			len + (len - from as usize) * repeat.get() as usize
		}
		else { len }
	}

	/// # Frame at Step Number.
	///
	/// Note: Steps start from zero for the purposes of this method.
	pub(crate) const fn frame_at_step(&self, mut idx: usize) -> Frame {
		let len = self.frames.len();

		if len <= idx {
			idx = match self.repeat {
				None | Some((_, 0)) => idx % len,
				Some((_, from)) => {
					let from = from as usize;
					from + (idx - from) % (len - from)
				},
			};
		}

		// This won't fail, but the condition lets the compiler omit a panic
		// handler, saving a lot of space in the compiled binary.
		if idx < len { self.frames[idx] }
		else { Frame::None }
	}

	/// # Sound at Step Number.
	///
	/// Note: Steps start from zero for the purposes of this method.
	pub(crate) const fn sound_at_step(&self, idx: usize) -> Option<Sound> {
		if let Some((out, idx2)) = self.sound {
			if idx2 as usize == idx { Some(out) }
			else { None }
		}
		else { None }
	}

	#[cfg(not(feature = "director"))]
	/// # Next Tick.
	pub(crate) const fn next_tick(&self) -> u16 { self.fpms }

	#[cfg(feature = "director")]
	#[allow(clippy::cast_possible_truncation, clippy::cast_sign_loss)]
	/// # Next Tick.
	pub(crate) fn next_tick(&self) -> u16 {
		crate::Universe::speed().map_or(
			self.fpms,
			|speed| (f32::from(self.fpms) / speed) as u16
		)
	}
}

impl Scene {
	pub(super) const EASE_IN: u8 =       0b0000_0001;
	pub(super) const EASE_OUT: u8 =      0b0000_0010;
	pub(crate) const FLIP_X_NEXT: u8 =   0b0000_0100;
	pub(crate) const FLIP_Y_NEXT: u8 =   0b0000_1000;
	pub(crate) const GRAVITY: u8 =       0b0001_0000;
	pub(crate) const IGNORE_EDGES: u8 =  0b0010_0000;
	pub(super) const END_SCENELIST: u8 = 0b0100_0000;

	pub(crate) const MATE_MASK: u8 =
		Self::FLIP_X_NEXT | Self::FLIP_Y_NEXT | Self::GRAVITY | Self::IGNORE_EDGES;
}

impl Scene {
	/// # Ease?
	const fn ease(&self) -> bool {
		0 != self.flags & (Self::EASE_IN | Self::EASE_OUT)
	}
}



#[derive(Debug)]
/// # Scene List Kind.
///
/// This works kind of like a `Cow`, allowing us to work with either static
/// references or owned arrays depending on the list.
pub(crate) enum SceneListKind {
	Fixed(&'static [Scene]),
	Dynamic1([Scene; 1]),
	Dynamic2([Scene; 2]),
	Dynamic3([Scene; 3]),
}

impl SceneListKind {
	#[cfg(test)]
	/// # As Slice.
	pub(crate) const fn as_slice(&self) -> &[Scene] {
		match self {
			Self::Fixed(s) => s,
			Self::Dynamic1(d) => d.as_slice(),
			Self::Dynamic2(d) => d.as_slice(),
			Self::Dynamic3(d) => d.as_slice(),
		}
	}

	/// # Get.
	pub(crate) fn get(&self, idx: usize) -> Option<&Scene> {
		match self {
			Self::Fixed(s) => s.get(idx),
			Self::Dynamic1(d) => d.get(idx),
			Self::Dynamic2(d) => d.get(idx),
			Self::Dynamic3(d) => d.get(idx),
		}
	}

	/// # Length.
	pub(crate) const fn len(&self) -> usize {
		match self {
			Self::Fixed(s) => s.len(),
			Self::Dynamic1(_) => 1,
			Self::Dynamic2(_) => 2,
			Self::Dynamic3(_) => 3,
		}
	}
}



#[derive(Debug)]
/// # Scene List.
///
/// An iterator of steps for a given animation, comprising one or more `Scene`s.
pub(crate) struct SceneList {
	scenes: SceneListKind,
	scene_idx: usize,
	step_idx: usize,
}

impl SceneList {
	/// # New.
	pub(crate) const fn new(scenes: SceneListKind) -> Self {
		Self {
			scenes,
			scene_idx: 0,
			step_idx: 0,
		}
	}
}

impl Iterator for SceneList {
	type Item = Step;

	#[allow(clippy::cast_possible_truncation, clippy::cast_possible_wrap)]
	fn next(&mut self) -> Option<Self::Item> {
		loop {
			let scene = self.scenes.get(self.scene_idx)?;
			let steps = scene.steps();
			if self.step_idx < steps {
				self.step_idx += 1;

				// Adjust flags.
				let scene_flags =
					if self.step_idx < steps {
						scene.flags & ! (Scene::FLIP_X_NEXT | Scene::FLIP_Y_NEXT)
					}
					else if self.scene_idx + 1 == self.scenes.len() {
						scene.flags | Scene::END_SCENELIST
					}
					else { scene.flags };

				// Calculate the step movement, if any.
				let move_to = scene.move_to.and_then(|m|
					if scene.ease() {
						let total_x = m.x * steps as i32;
						let total_y = m.y * steps as i32;

						let (mut x, mut y) =
							if self.scene_idx == steps { (total_x, total_y) }
							else {
								ease(self.step_idx, steps, total_x, total_y, scene.flags)?
							};

						if let Some((last_x, last_y)) = ease(self.step_idx - 1, steps, total_x, total_y, scene.flags) {
							x -= last_x;
							y -= last_y;
						}

						if x == 0 && y == 0 { None }
						else { Some(Position::new(x, y)) }
					}
					else { Some(m) }
				);

				// The absolute direction, just in case easing or rounding has
				// zeroed out a particular movement.
				let direction = scene.move_to.map_or(Direction::None, Position::direction);

				return Some(Step {
					move_to,
					direction,
					frame: scene.frame_at_step(self.step_idx - 1),
					sound: scene.sound_at_step(self.step_idx - 1),
					next_tick: scene.next_tick(),
					scene_flags,
				});
			}

			// Scene change.
			self.step_idx = 0;
			self.scene_idx += 1;
		}
	}
}



#[derive(Debug, Clone, Copy)]
/// # A Single Step.
///
/// This holds all the details for a single animation step, or tick, including
/// relative movements, the sprite frame, sound, etc.
pub(crate) struct Step {
	move_to: Option<Position>,
	direction: Direction,
	next_tick: u16,
	frame: Frame,
	sound: Option<Sound>,
	scene_flags: u8,
}

impl Step {
	/// # Relative Movement.
	pub(crate) const fn move_to(&self) -> Option<Position> { self.move_to }

	/// # Direction.
	pub(crate) const fn direction(&self) -> Direction { self.direction }

	/// # Time Until _Next_ Tick.
	pub(crate) const fn next_tick(&self) -> u16 { self.next_tick }

	/// # Frame.
	pub(crate) const fn frame(&self) -> Frame { self.frame }

	/// # Sound.
	pub(crate) const fn sound(&self) -> Option<Sound> { self.sound }

	/// # Done.
	///
	/// This returns `true` when the step is the very last one for a given
	/// `SceneList`.
	pub(crate) const fn done(&self) -> bool {
		Scene::END_SCENELIST == self.scene_flags & Scene::END_SCENELIST
	}

	/// # Mate Flags.
	///
	/// Convert the scene flags to mate flags to make them easier to set.
	pub(crate) const fn mate_flags(&self) -> u16 {
		(self.scene_flags & Scene::MATE_MASK) as u16
	}
}



#[allow(clippy::cast_precision_loss, clippy::cast_possible_truncation)]
/// # Ease In/Out.
///
/// This returns the cumulative eased movement for a given step, if any.
fn ease(e: usize, d: usize, x: i32, y: i32, ease: u8) -> Option<(i32, i32)> {
	if d == 0 || (x == 0 && y == 0) { return None; }

	// Figure out the scale.
	let mut scale = e as f32 / d as f32;
	if Scene::EASE_IN == ease & Scene::EASE_IN { scale *= scale; }
	else { scale = (scale * (2.0 - scale)).powi(2); }

	// Apply it!
	let x = (scale * x as f32) as i32;
	let y = (scale * y as f32) as i32;

	// Return the coordinates if either are non-zero.
	if x == 0 && y == 0 { None }
	else { Some((x, y)) }
}



#[cfg(test)]
mod tests {
	use super::*;
	use crate::Animation;

	#[test]
	fn builder() {
		let expected = Scene {
			move_to: Some(Position::new(55, 0)),
			fpms: 100,
			frames: &[
				Frame::F062, Frame::F062, Frame::F063, Frame::F064,
				Frame::F065, Frame::F066, Frame::F067, Frame::F068,
				Frame::F069, Frame::F070, Frame::F006,
			],
			repeat: Some((NonZeroU16::new(20).unwrap(), 1)),
			sound: Some((Sound::Baa, 0)),
			flags: Scene::EASE_OUT | Scene::GRAVITY,
		};

		let built = Scene::new(
			100,
			&[
				Frame::F062, Frame::F062, Frame::F063, Frame::F064,
				Frame::F065, Frame::F066, Frame::F067, Frame::F068,
				Frame::F069, Frame::F070, Frame::F006,
			]
		)
			.with_move_to(Position::new(55, 0))
			.with_repeat(20, 1)
			.with_sound(Sound::Baa, 0)
			.with_flags(Scene::EASE_OUT | Scene::GRAVITY);

		assert_eq!(expected, built);
	}

	#[test]
	fn scenes() {
		for a in Animation::all() {
			let scenes = a.scenes(3840);

			let mut total_steps = 0;
			for s in scenes.scenes.as_slice() {
				total_steps += s.steps();

				// We're using u16 for index access in some places, so make
				// sure the value fits.
				assert!(
					total_steps < usize::from(u16::MAX),
					"Step overflow ({total_steps}) {}", a.as_str()
				);

				// Make sure we don't have too short a duration for the number
				// of frames.
				assert!(5 < s.fpms, "Scene too short {}.", a.as_str());

				// If we're repeating or there's sound, make sure the idx is in
				// range.
				assert!(
					s.repeat.map_or(true, |(_, r)| usize::from(r) < s.frames.len()),
					"Repeat overflow {}.", a.as_str(),
				);
				assert!(
					s.sound.map_or(true, |(_, r)| usize::from(r) < s.frames.len()),
					"Sound overflow {}.", a.as_str(),
				);
			}

			let mut count = 0;
			let mut done = false;
			for s in scenes {
				count += 1;
				assert_eq!(done, false, "Steps shouldn't be done yet.");
				if s.done() { done = true; }
			}

			assert_eq!(done, true, "Steps should be done.");

			// Make sure we wind up with the expected number of steps.
			assert_eq!(
				count,
				total_steps,
				"Step mismatch {}.", a.as_str()
			);
		}
	}
}
