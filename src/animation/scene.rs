/*!
# RS Mate Poe: Animation Scenes
*/

use crate::{
	Direction,
	Position,
	Sound,
	Universe,
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
	frames: &'static [u8],
	repeat: Option<(NonZeroU16, u8)>,
	sound: Option<(Sound, u8)>,
	flags: u8,
}

impl Scene {
	/// # New.
	pub(crate) const fn new(fpms: u16, frames: &'static [u8]) -> Self {
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
	/// Note: Frames start from zero for the purposes of this method.
	pub(crate) const fn frame_at_step(&self, idx: u16) -> u8 {
		let idx = idx as usize;
		let len = self.frames.len();

		if idx < len { self.frames[idx] }
		else {
			match self.repeat {
				None | Some((_, 0)) => self.frames[idx % len],
				Some((_, from)) => {
					let from = from as usize;
					self.frames[from + (idx - from) % (len - from)]
				}
			}
		}
	}

	/// # Sound at Step Number.
	///
	/// Note: Steps start from zero for the purposes of this method.
	pub(crate) const fn sound_at_step(&self, idx: u16) -> Option<Sound> {
		if let Some((out, idx2)) = self.sound {
			if idx2 as u16 == idx { Some(out) }
			else { None }
		}
		else { None }
	}
}

macro_rules! get {
	($title:literal, $flag:ident, $get:ident) => (
		#[must_use]
		#[doc = concat!("# ", $title, "?")]
		pub(crate) const fn $get(&self) -> bool { Self::$flag == self.flags & Self::$flag }
	);
}

impl Scene {
	pub(super) const EASE_IN: u8 =       0b0000_0001;
	pub(super) const EASE_OUT: u8 =      0b0000_0010;
	pub(super) const FLIP_X_AFTER: u8 =  0b0000_0100;
	pub(super) const FLIP_Y_AFTER: u8 =  0b0000_1000;
	pub(super) const GRAVITY: u8 =       0b0001_0000;
	pub(super) const IGNORE_EDGES: u8 =  0b0010_0000;
	pub(super) const END_SCENE: u8 =     0b0100_0000;
	pub(super) const END_SCENELIST: u8 = 0b1000_0000;
}

impl Scene {
	get!("Ease In", EASE_IN, ease_in);
	get!("Ease Out", EASE_OUT, ease_out);
	//get!("Flip (X) After Scene", FLIP_X_AFTER, flip_x_after);
	//get!("Flip (Y) After Scene", FLIP_Y_AFTER, flip_y_after);
	//get!("Gravity Applies", GRAVITY, gravity);
	//get!("Ignore Edges", IGNORE_EDGES, ignore_edges);
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
	step_idx: u16,
	moved: (i32, i32),
}

impl SceneList {
	/// # New.
	pub(crate) const fn new(scenes: SceneListKind) -> Self {
		Self {
			scenes,
			scene_idx: 0,
			step_idx: 0,
			moved: (0, 0),
		}
	}
}

impl Iterator for SceneList {
	type Item = Step;

	#[allow(
		clippy::cast_possible_truncation,
		clippy::cast_precision_loss,
		clippy::cast_sign_loss,
	)]
	fn next(&mut self) -> Option<Self::Item> {
		loop {
			let scene = self.scenes.get(self.scene_idx)?;
			let steps = scene.steps() as u16;
			if self.step_idx < steps {
				self.step_idx += 1;

				// Adjust flags.
				let mut scene_flags = scene.flags;
				if self.step_idx == steps {
					scene_flags |= Scene::END_SCENE;
					if self.scene_idx + 1 == self.scenes.len() {
						scene_flags |= Scene::END_SCENELIST;
					}
				}

				// Calculate the step movement, if any.
				let move_to = scene.move_to.and_then(|m| {
					let pos =
						// For the last step, just return whatever's left.
						if Scene::END_SCENE == scene_flags & Scene::END_SCENE {
							Position::new(m.x - self.moved.0, m.y - self.moved.1)
						}
						// Otherwise we need to math it a bit.
						else {
							// Find the percentage of the total movements reached by
							// this step.
							let mut scale = f32::from(self.step_idx) / f32::from(steps);
							if scene.ease_in() { scale *= scale; }
							else if scene.ease_out() {
								scale = (scale * (2.0 - scale)).powi(2);
							}

							// Subtract what we covered previously to arrive at this
							// step's personal contributions.
							let pos = Position::new(
								(m.x as f32 * scale) as i32 - self.moved.0,
								(m.y as f32 * scale) as i32 - self.moved.1,
							);

							// Update the total movements accordingly.
							self.moved.0 += pos.x;
							self.moved.1 += pos.y;

							pos
						};
					if pos.x != 0 || pos.y != 0 { Some(pos) }
					else { None }
				});

				// The absolute direction, just in case easing or rounding has
				// zeroed out a particular movement.
				let direction = scene.move_to.map_or(Direction::None, Position::direction);

				return Some(Step {
					move_to,
					direction,
					frame: scene.frame_at_step(self.step_idx - 1),
					sound: scene.sound_at_step(self.step_idx - 1),
					next_tick: Universe::speed().map_or(
						scene.fpms,
						|speed| (f32::from(scene.fpms) / speed) as u16
					),
					scene_flags,
				});
			}

			// Scene change.
			self.step_idx = 0;
			self.scene_idx += 1;
			self.moved = (0, 0);
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
	frame: u8,
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
	pub(crate) const fn frame(&self) -> u8 { self.frame }

	/// # Sound.
	pub(crate) const fn sound(&self) -> Option<Sound> { self.sound }

	/// # Done.
	///
	/// This returns `true` when the step is the very last one for a given
	/// `SceneList`.
	pub(crate) const fn done(&self) -> bool {
		Scene::END_SCENELIST == self.scene_flags & Scene::END_SCENELIST
	}

	/// # Flip X (after this step).
	///
	/// This returns `true` when the scene wants the _next_ step reversed.
	/// This only applies for the last step of a given `Scene`.
	pub(crate) const fn flip_x_after(&self) -> bool {
		let flag = Scene::FLIP_X_AFTER | Scene::END_SCENE;
		flag == self.scene_flags & flag
	}

	/// # Flip Y (after this step).
	///
	/// This returns `true` when the scene wants the _next_ step reversed.
	/// This only applies for the last step of a given `Scene`.
	pub(crate) const fn flip_y_after(&self) -> bool {
		let flag = Scene::FLIP_Y_AFTER | Scene::END_SCENE;
		flag == self.scene_flags & flag
	}

	/// # Gravity Applies?
	///
	/// Returns `true` if the sprite should remain floored for the duration of
	/// the `Scene`.
	pub(crate) const fn gravity(&self) -> bool {
		Scene::GRAVITY == self.scene_flags & Scene::GRAVITY
	}

	/// # Ignore Edges?
	///
	/// Returns `true` if the sprite is allowed to cross the screen edge
	/// while progressing through the `Scene`.
	pub(crate) const fn ignore_edges(&self) -> bool {
		Scene::IGNORE_EDGES == self.scene_flags & Scene::IGNORE_EDGES
	}
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
			frames: &[62, 62, 63, 64, 65, 66, 67, 68, 69, 70, 6],
			repeat: Some((NonZeroU16::new(20).unwrap(), 1)),
			sound: Some((Sound::Baa, 0)),
			flags: Scene::EASE_OUT | Scene::GRAVITY,
		};

		let built = Scene::new(100, &[62, 62, 63, 64, 65, 66, 67, 68, 69, 70, 6])
			.with_move_to(Position::new(55, 0))
			.with_repeat(20, 1)
			.with_sound(Sound::Baa, 0)
			.with_flags(Scene::EASE_OUT | Scene::GRAVITY);

		assert_eq!(expected, built);
	}

	#[test]
	fn scenes() {
		for a in Animation::all() {
			let scenes = a.scenes(1024);

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

	#[test]
	fn t_divisibility() {
		let mut iffy = Vec::new();
		for a in Animation::all() {
			// Let's stick with childless primary animations; combinations
			// sometimes require concessions.
			if a.primary() && a.child().is_none() {
				let scenes = a.scenes(1024);
				for (k, v) in scenes.scenes.as_slice().iter().enumerate() {
					// If we aren't easing and have X/Y movement, make sure
					// they also divide evenly into the number of steps.
					if 0 == v.flags & (Scene::EASE_IN | Scene::EASE_OUT) {
						if let Some(Position { x, y }) = v.move_to {
							let steps = v.steps();
							let x = x.abs() as usize;
							let y = y.abs() as usize;

							let x_per_extra = x % steps;
							let y_per_extra = y % steps;
							if x_per_extra != 0 || y_per_extra != 0 {
								iffy.push(format!(
									"  \x1b[1m{} #{k}\x1b[0m Fractional movement: ({x},{y}) / {steps} = ({},{}) + ({x_per_extra},{y_per_extra})",
									a.as_str(),
									x / steps,
									y / steps,
								));
							}
						}
					}
				}
			}
		}

		// Assert once so we can get all the failure details.
		assert!(iffy.is_empty(), "\n{}\n", iffy.join("\n"));
	}
}
