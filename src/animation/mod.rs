/*!
# RS Mate Poe: Animations
*/

pub(super) mod scene;
mod scenes;

use crate::{
	Direction,
	SceneList,
	Universe,
};
use scene::SceneListKind;



#[cfg(any(test, feature = "director"))] const MIN_ANIMATION_ID: u8 = 1;  // The lowest Animation ID.
#[cfg(any(test, feature = "director"))] const MAX_ANIMATION_ID: u8 = 62; // The highest Animation ID.

/// # Default Animations.
const DEFAULT: &[Animation] = &[
	Animation::Walk, Animation::Walk, Animation::Walk, Animation::Walk, Animation::Walk,
	Animation::Walk, Animation::Walk, Animation::Walk, Animation::Walk, Animation::Walk,
	Animation::Walk, Animation::Walk, Animation::Walk, Animation::Walk, Animation::Walk,
	Animation::BeginRun, Animation::BeginRun, Animation::BeginRun, Animation::BeginRun, Animation::BeginRun,
	Animation::Beg, Animation::Beg,
	Animation::Blink, Animation::Blink,
	Animation::Eat, Animation::Eat,
	Animation::Handstand, Animation::Handstand,
	Animation::Roll, Animation::Roll,
	Animation::Scratch, Animation::Scratch,
	Animation::Spin, Animation::Spin,
	Animation::Abduction,
	Animation::Bleat,
	Animation::BoredSleep,
	Animation::Doze,
	Animation::Jump,
	Animation::PlayDead,
	Animation::Rest,
	Animation::Rotate,
	Animation::Scoot,
	Animation::Scream,
	Animation::Sleep,
	Animation::Sneeze,
	Animation::Urinate,
];

/// # Entrance Animations.
const ENTRANCE: &[Animation] = &[
	Animation::BathDive,
	Animation::BigFish,
	Animation::BlackSheepChase,
	Animation::BlackSheepRomance,
	Animation::ChaseAMartian,
	Animation::Stargaze,
	Animation::Yoyo,
];

/// # Start-Up Animations.
const FIRST: &[Animation] = &[
	Animation::Fall, Animation::Fall, Animation::Fall, Animation::Fall, Animation::Fall,
	Animation::BathDive,
	Animation::BigFish,
	Animation::BlackSheepChase,
	Animation::BlackSheepRomance,
	Animation::ChaseAMartian,
	Animation::Stargaze,
	Animation::Yoyo,
];



#[repr(u8)]
#[derive(Debug, Clone, Copy, Eq, PartialEq)]
#[allow(missing_docs)]
/// # Animations.
///
/// This enum holds all possible sprite animations, for both primary and child
/// mates, as well as secondary (linked) sequences.
///
/// Each variant is equivalent to a `u8`, starting with `1`.
pub(crate) enum Animation {
	// Animations for the primary mate.
	Abduction = 1_u8,
	BathDive,
	Beg,
	BeginRun,
	BigFish,
	BlackSheepChase,
	BlackSheepRomance,
	Bleat,
	Blink,
	BoredSleep,
	ChaseAMartian,
	Doze,
	Eat,
	Handstand,
	Jump,
	PlayDead,
	Rest,
	Roll,
	Rotate,
	Run,
	Scoot,
	Scratch,
	Scream,
	Sleep,
	Slide,
	Sneeze,
	Spin,
	Stargaze,
	Urinate,
	Walk,
	Yoyo,

	// Primary animations of a special/supporting nature.
	BathCoolDown,
	Boing,
	Bounce,
	ClimbDown,
	ClimbUp,
	DangleFall,
	DangleRecover,
	DeepThoughts,
	Drag,
	EndRun,
	Fall,
	GraspingFall,
	ReachCeiling,
	ReachFloor,
	ReachSide1,
	ReachSide2,
	RunDown,
	RunUpsideDown,
	SlideDown,
	Splat,
	WalkUpsideDown,
	WallSlide,

	// Animations for the child mates.
	AbductionChild,
	BathDiveChild,
	BigFishChild,
	BlackSheepChaseChild,
	BlackSheepRomanceChild,
	ChaseAMartianChild,
	FlowerChild,
	SneezeShadow,
	StargazeChild,
}

impl Animation {
	#[cfg(any(test))]
	/// # All Animations.
	pub(crate) const fn all() -> Animations { Animations(0) }

	#[cfg(any(test, feature = "director"))]
	#[allow(unsafe_code)]
	/// # From U8.
	///
	/// Return the `Animation` corresponding to the given ID, or `None` if out
	/// of range.
	pub(crate) fn from_u8(src: u8) -> Option<Self> {
		// Safety: only transmute if the number is in range.
		if (MIN_ANIMATION_ID..=MAX_ANIMATION_ID).contains(&src) {
			Some(unsafe { std::mem::transmute(src) })
		}
		else { None }
	}

	#[cfg(any(test, feature = "director"))]
	/// # Directly Playable?
	///
	/// Returns `true` if the animation can be cued up via the userland setter
	/// `Poe.play`.
	pub(crate) const fn playable(self) -> bool {
		matches!(
			self,
			Self::Abduction | Self::BathDive | Self::Beg | Self::BeginRun |
			Self::BigFish | Self::BlackSheepChase | Self::BlackSheepRomance |
			Self::Bleat | Self::Blink | Self::BoredSleep | Self::ChaseAMartian |
			Self::Doze | Self::Eat | Self::Handstand | Self::Jump |
			Self::PlayDead | Self::Rest | Self::Roll | Self::Rotate | Self::Run |
			Self::Scoot | Self::Scratch | Self::Scream | Self::Sleep |
			Self::Slide | Self::Sneeze | Self::Spin | Self::Stargaze |
			Self::Urinate | Self::Walk | Self::Yoyo
		)
	}
}

impl Animation {
	/// # Default Choice.
	///
	/// Return a generic default animation for use in contexts where an
	/// explicit one is unspecified.
	pub(crate) fn default_choice() -> Self { choose(DEFAULT) }

	/// # Entrance Choice.
	///
	/// Same as `Animation::default_choice`, but for cases where the mate is
	/// currently positioned off-screen.
	pub(crate) fn entrance_choice() -> Self { choose(ENTRANCE) }

	/// # First Choice.
	///
	/// Return a random start-up animation for a newly-created (primary) mate.
	pub(crate) fn first_choice() -> Self { choose(FIRST) }
}

#[cfg(any(test, feature = "director"))]
impl Animation {
	/// # As Str.
	///
	/// Return a human-readable "title" for the `Animation` as a static string
	/// slice.
	pub(crate) const fn as_str(self) -> &'static str {
		match self {
			Self::Abduction => "Abduction",
			Self::AbductionChild => "Abduction (Child)",
			Self::BathCoolDown => "Bath Cool Down",
			Self::BathDive => "Bath Dive",
			Self::BathDiveChild => "Bathtub (Child)",
			Self::Beg => "Beg",
			Self::BeginRun => "Begin Run",
			Self::BigFish => "Big Fish",
			Self::BigFishChild => "Big Fish (Child)",
			Self::BlackSheepChase => "Black Sheep Chase",
			Self::BlackSheepChaseChild => "Black Sheep Chase (Child)",
			Self::BlackSheepRomance => "Black Sheep Romance",
			Self::BlackSheepRomanceChild => "Black Sheep Romance (Child)",
			Self::Bleat => "Bleat",
			Self::Blink => "Blink",
			Self::Boing => "Boing!",
			Self::BoredSleep => "Bored Sleep",
			Self::Bounce => "Bounce",
			Self::ChaseAMartian => "Chase a Martian",
			Self::ChaseAMartianChild => "Chase a Martian (Child)",
			Self::ClimbDown => "Climb Down",
			Self::ClimbUp => "Climb Up",
			Self::DangleFall => "Dangle (Maybe) Fall",
			Self::DangleRecover => "Dangle Fall Recovery",
			Self::DeepThoughts => "Deep Thoughts",
			Self::Doze => "Doze",
			Self::Drag => "Drag",
			Self::Eat => "Eat",
			Self::EndRun => "End Run",
			Self::Fall => "Fall",
			Self::FlowerChild => "Flower (Child)",
			Self::GraspingFall => "Grasping Fall",
			Self::Handstand => "Handstand",
			Self::Jump => "Jump",
			Self::PlayDead => "Play Dead",
			Self::ReachCeiling => "Reach Ceiling",
			Self::ReachFloor => "Reach Floor",
			Self::ReachSide1 => "Reach Side (From Floor)",
			Self::ReachSide2 => "Reach Side (From Ceiling)",
			Self::Rest => "Rest",
			Self::Roll => "Roll",
			Self::Rotate => "Rotate",
			Self::Run => "Run",
			Self::RunDown => "Run Down",
			Self::RunUpsideDown => "Run Upside Down",
			Self::Scoot => "Scoot",
			Self::Scratch => "Scratch",
			Self::Scream => "Scream",
			Self::Sleep => "Sleep",
			Self::Slide => "Slide",
			Self::SlideDown => "Slide Down",
			Self::Sneeze => "Sneeze",
			Self::SneezeShadow => "Sneeze Shadow (Child)",
			Self::Spin => "Spin",
			Self::Splat => "Splat",
			Self::Stargaze => "Stargaze",
			Self::StargazeChild => "Stargaze (Child)",
			Self::Urinate => "Urinate",
			Self::Walk => "Walk",
			Self::WalkUpsideDown => "Walk Upside Down",
			Self::WallSlide => "Wall Slide",
			Self::Yoyo => "Yo-Yo",
		}
	}
}

impl Animation {
	/// # Change Class?
	///
	/// Returns true if the animation has a dedicated DOM class for the
	/// sprite's wrapper element or otherwise does weird things requiring extra
	/// scrutiny during render.
	pub(crate) const fn change_class(self) -> bool {
		matches!(
			self,
			Self::Abduction | Self::BigFishChild | Self::Drag | Self::SneezeShadow
		)
	}

	/// # Clamp to Wall.
	///
	/// Returns the side — left or right — to clamp the animation's X position
	/// to, if any. (If flipped, the opposite should be applied.)
	pub(crate) const fn clamp_x(self) -> Option<Direction> {
		match self {
			Self::ClimbDown | Self::RunDown | Self::SlideDown => Some(Direction::Right),
			Self::ClimbUp | Self::WallSlide => Some(Direction::Left),
			_ => None,
		}
	}

	/// # Flip (X).
	///
	/// Returns `true` if the animation needs to flip the sprite image
	/// horizontally.
	pub(crate) const fn flip_x(self) -> bool {
		matches!(self, Self::BlackSheepChaseChild | Self::ReachSide2)
	}

	/// # Flip (Y).
	///
	/// Returns `true` if the animation needs to flip the sprite image
	/// vertically.
	pub(crate) const fn flip_y(self) -> bool {
		matches!(self, Self::DangleRecover | Self::DeepThoughts)
	}

	/// # Animation May Exit Screen?
	///
	/// Returns `true` if the relative-moving animation is allowed to ever
	/// leave the viewport. (Actual passage is randomly assigned at runtime.)
	pub(crate) const fn may_exit(self) -> bool {
		matches!(
			self,
			Self::BlackSheepChase | Self::ChaseAMartian | Self::Run |
			Self::SneezeShadow | Self::Walk
		)
	}

	/// # Is Primary Animation?
	///
	/// Returns `true` if the animation only applies to the primary sprite.
	///
	/// Note, this is equivalent to `! self.for_child()`.
	pub(crate) const fn primary(self) -> bool {
		matches!(
			self,
			Self::Abduction | Self::BathCoolDown | Self::BathDive | Self::Beg |
			Self::BeginRun | Self::BigFish | Self::BlackSheepChase |
			Self::BlackSheepRomance | Self::Bleat | Self::Blink | Self::Boing |
			Self::BoredSleep | Self::Bounce | Self::ChaseAMartian |
			Self::ClimbDown | Self::ClimbUp | Self::DangleFall |
			Self::DangleRecover | Self::DeepThoughts | Self::Doze | Self::Drag |
			Self::Eat | Self::EndRun | Self::Fall | Self::GraspingFall |
			Self::Handstand | Self::Jump | Self::PlayDead | Self::ReachCeiling |
			Self::ReachFloor | Self::ReachSide1 | Self::ReachSide2 |
			Self::Rest | Self::Roll | Self::Rotate | Self::Run | Self::RunDown |
			Self::RunUpsideDown | Self::Scoot | Self::Scratch | Self::Scream |
			Self::Sleep | Self::Slide | Self::SlideDown | Self::Sneeze |
			Self::Spin | Self::Splat | Self::Stargaze | Self::Urinate |
			Self::Walk | Self::WalkUpsideDown | Self::WallSlide | Self::Yoyo
		)
	}
}

impl Animation {
	/// # Child Animation.
	///
	/// Return the child animation required by this primary animation, if any.
	pub(crate) const fn child(self) -> Option<Self> {
		match self {
			Self::Abduction => Some(Self::AbductionChild),
			Self::BathDive => Some(Self::BathDiveChild),
			Self::BigFish => Some(Self::BigFishChild),
			Self::BlackSheepChase => Some(Self::BlackSheepChaseChild),
			Self::BlackSheepRomance => Some(Self::BlackSheepRomanceChild),
			Self::ChaseAMartian => Some(Self::ChaseAMartianChild),
			Self::Eat => Some(Self::FlowerChild),
			Self::Sneeze => Some(Self::SneezeShadow),
			Self::Stargaze => Some(Self::StargazeChild),
			_ => None,
		}
	}

	/// # Next Animation.
	///
	/// Switch to this animation when the sequence finishes. Some of these
	/// always transition to the same thing, while others work from a list of
	/// possibilities.
	///
	/// Primary animations with no explicit entry will simply move to a random
	/// default choice. Unlisted child animations, on the other hand, will
	/// terminate instead.
	pub(crate) fn next(self) -> Option<Self> {
		match self {
			Self::Abduction => Some(Self::ChaseAMartian),
			Self::BathDive => Some(Self::BathCoolDown),
			Self::BeginRun | Self::BlackSheepChase | Self::Scream => Some(Self::Run),
			Self::BigFish => Some(choose(&[Self::Walk, Self::Walk, Self::Sneeze])),
			Self::Boing => Some(choose(&[
				Self::Rotate, Self::Rotate, Self::Rotate, Self::Rotate, Self::Rotate,
				Self::Rotate, Self::Rotate, Self::Rotate,
				Self::Walk, Self::Walk, Self::Walk, Self::Walk,
				Self::BeginRun,
			])),
			Self::Bleat | Self::Blink | Self::BoredSleep | Self::Bounce |
			Self::EndRun | Self::PlayDead | Self::ReachFloor | Self::Rotate |
			Self::Sleep | Self::Slide | Self::Sneeze | Self::Splat | Self::Rest |
			Self::Urinate => Some(Self::Walk),
			Self::ChaseAMartian => Some(Self::Bleat),
			Self::ClimbDown => Some(Self::ClimbDown),
			Self::ClimbUp | Self::ReachSide1 => Some(Self::ClimbUp),
			Self::DangleFall => Some(choose(&[
				Self::DangleRecover, Self::DangleRecover, Self::DangleRecover,
				Self::GraspingFall,
			])),
			Self::DeepThoughts | Self::RunUpsideDown => Some(Self::RunUpsideDown),
			Self::Drag => Some(Self::Drag),
			Self::Eat => Some(choose(&[Self::Rest, Self::Walk, Self::Walk])),
			Self::Fall | Self::GraspingFall => Some(Self::GraspingFall),
			Self::Jump => Some(choose(&[
				Self::Run, Self::Run,
				Self::Slide, Self::Slide,
				Self::Jump,
			])),
			Self::DangleRecover | Self::ReachCeiling => Some(choose(&[
				Self::WalkUpsideDown, Self::WalkUpsideDown, Self::WalkUpsideDown, Self::WalkUpsideDown,
				Self::DeepThoughts,
			])),
			Self::ReachSide2 => Some(choose(&[
				Self::RunDown, Self::RunDown, Self::RunDown,
				Self::ClimbDown,
				Self::SlideDown,
			])),
			Self::Run => Some(choose(&[
				Self::EndRun, Self::EndRun, Self::EndRun, Self::EndRun,
				Self::Jump, Self::Jump, Self::Jump,
				Self::Run, Self::Run,
			])),
			Self::RunDown => Some(choose(&[
				Self::RunDown, Self::RunDown,
				Self::SlideDown,
			])),
			Self::Scoot => Some(choose(&[
				Self::Scoot, Self::Scoot, Self::Scoot, Self::Scoot,
				Self::Rotate, Self::Rotate,
				Self::Walk,
			])),
			Self::SlideDown => Some(Self::SlideDown),
			Self::Spin => Some(choose(&[Self::PlayDead, Self::Sneeze])),
			Self::Stargaze => Some(Self::Scream),
			Self::Walk => Some(choose(&[
				Self::Walk, Self::Walk, Self::Walk, Self::Walk, Self::Walk, Self::Walk, Self::Walk, Self::Walk,
				Self::BeginRun, Self::BeginRun, Self::BeginRun, Self::BeginRun,
				Self::Beg,
				Self::Blink,
				Self::Eat,
				Self::Handstand,
				Self::Roll,
			])),
			Self::WalkUpsideDown => Some(choose(&[
				Self::WalkUpsideDown, Self::WalkUpsideDown, Self::WalkUpsideDown, Self::WalkUpsideDown, Self::WalkUpsideDown,
				Self::WalkUpsideDown, Self::WalkUpsideDown, Self::WalkUpsideDown, Self::WalkUpsideDown, Self::WalkUpsideDown,
				Self::WalkUpsideDown, Self::WalkUpsideDown, Self::WalkUpsideDown, Self::WalkUpsideDown, Self::WalkUpsideDown,
				Self::DangleFall,
				Self::DeepThoughts,
			])),
			Self::WallSlide => Some(Self::WallSlide),
			_ => None,
		}
	}

	/// # Next at Edge.
	///
	/// This is just like `Animation::next`, but used in cases where a screen
	/// edge has been reached.
	pub(crate) fn next_edge(self) -> Option<Self> {
		match self {
			Self::BathDive => Some(Self::BathCoolDown),
			Self::ClimbDown | Self::RunDown | Self::SlideDown => Some(Self::ReachFloor),
			Self::ClimbUp => Some(Self::ReachCeiling),
			Self::DangleRecover | Self::DeepThoughts | Self::RunUpsideDown |
			Self::WalkUpsideDown => Some(Self::ReachSide2),
			Self::GraspingFall => Some(choose(&[
				Self::Splat, Self::Splat, Self::Splat,
				Self::Bounce,
				Self::PlayDead,
			])),
			Self::Fall => Some(Self::Bounce),
			Self::Jump => Some(Self::WallSlide),
			Self::BeginRun | Self::EndRun | Self::Run => Some(Self::Boing),
			Self::Walk => Some(choose(&[
				Self::Rotate, Self::Rotate, Self::Rotate, Self::Rotate, Self::Rotate,
				Self::Scoot, Self::Scoot,
				Self::ReachSide1,
			])),
			Self::WallSlide => Some(Self::Rotate),
			_ => None,
		}
	}
}

impl Animation {
	/// # Scenes.
	///
	/// Return the animation's `SceneList`.
	///
	/// Most of these are completely static, identical from run-to-run, but a
	/// few have randomized or environmental modifiers, tweaking them slightly.
	pub(crate) fn scenes(self, width: u16) -> SceneList {
		macro_rules! fixed {
			($var:ident) => (SceneList::new(SceneListKind::Fixed(scenes::$var)));
		}

		match self {
			Self::Abduction => fixed!(ABDUCTION),
			Self::AbductionChild => fixed!(ABDUCTION_CHILD),
			Self::BathCoolDown => fixed!(BATH_COOL_DOWN),
			Self::BathDive => fixed!(BATH_DIVE),
			Self::BathDiveChild => fixed!(BATH_DIVE_CHILD),
			Self::Beg => fixed!(BEG),
			Self::BeginRun | Self::EndRun => fixed!(BEGIN_END_RUN),
			Self::BigFish => fixed!(BIG_FISH),
			Self::BigFishChild => fixed!(BIG_FISH_CHILD),
			Self::BlackSheepChase => scenes::black_sheep_chase(width),
			Self::BlackSheepChaseChild => scenes::black_sheep_chase_child(width),
			Self::BlackSheepRomance => scenes::black_sheep_romance(width),
			Self::BlackSheepRomanceChild => scenes::black_sheep_romance_child(width),
			Self::Bleat => fixed!(BLEAT),
			Self::Blink => scenes::blink(),
			Self::Boing => fixed!(BOING),
			Self::BoredSleep => scenes::bored_sleep(),
			Self::Bounce => fixed!(BOUNCE),
			Self::ChaseAMartian => scenes::chase_a_martian(width),
			Self::ChaseAMartianChild => scenes::chase_a_martian_child(width),
			Self::ClimbDown => fixed!(CLIMB_DOWN),
			Self::ClimbUp => fixed!(CLIMB_UP),
			Self::DangleFall => fixed!(DANGLE_FALL),
			Self::DangleRecover => fixed!(DANGLE_RECOVER),
			Self::DeepThoughts => fixed!(DEEP_THOUGHTS),
			Self::Doze => scenes::doze(),
			Self::Drag => fixed!(DRAG),
			Self::Eat => fixed!(EAT),
			Self::Fall => fixed!(FALL),
			Self::FlowerChild => fixed!(FLOWER_CHILD),
			Self::GraspingFall => fixed!(GRASPING_FALL),
			Self::Handstand => fixed!(HANDSTAND),
			Self::Jump => fixed!(JUMP),
			Self::PlayDead => fixed!(PLAY_DEAD),
			Self::ReachCeiling => fixed!(REACH_CEILING),
			Self::ReachFloor => fixed!(REACH_FLOOR),
			Self::ReachSide1 => fixed!(REACH_SIDE1),
			Self::ReachSide2 => fixed!(REACH_SIDE2),
			Self::Rest => fixed!(REST),
			Self::Roll => fixed!(ROLL),
			Self::Rotate => fixed!(ROTATE),
			Self::Run => fixed!(RUN),
			Self::RunDown => fixed!(RUN_DOWN),
			Self::RunUpsideDown => fixed!(RUN_UPSIDE_DOWN),
			Self::Scoot => fixed!(SCOOT),
			Self::Scratch => fixed!(SCRATCH),
			Self::Scream => fixed!(SCREAM),
			Self::Sleep => scenes::sleep(),
			Self::Slide => fixed!(SLIDE),
			Self::SlideDown => fixed!(SLIDE_DOWN),
			Self::Sneeze => fixed!(SNEEZE),
			Self::SneezeShadow => fixed!(SNEEZE_SHADOW),
			Self::Spin => fixed!(SPIN),
			Self::Splat => fixed!(SPLAT),
			Self::Stargaze => fixed!(STARGAZE),
			Self::StargazeChild => fixed!(STARGAZE_CHILD),
			Self::Urinate => scenes::urinate(),
			Self::Walk => fixed!(WALK),
			Self::WalkUpsideDown => fixed!(WALK_UPSIDE_DOWN),
			Self::WallSlide => fixed!(WALL_SLIDE),
			Self::Yoyo => fixed!(YOYO),
		}
	}
}



#[cfg(any(test, feature = "director"))]
#[derive(Debug, Clone, Default)]
/// # Animations Iterator.
pub(crate) struct Animations(u8);

#[cfg(any(test, feature = "director"))]
impl Iterator for Animations {
	type Item = Animation;
	fn next(&mut self) -> Option<Self::Item> {
		self.0 += 1;
		if self.0 <= MAX_ANIMATION_ID { Animation::from_u8(self.0) }
		else { None }
	}

	fn size_hint(&self) -> (usize, Option<usize>) {
		let len = self.len();
		(len, Some(len))
	}
}

#[cfg(any(test, feature = "director"))]
impl ExactSizeIterator for Animations {
	fn len(&self) -> usize {
		usize::from(MAX_ANIMATION_ID.saturating_sub(self.0))
	}
}



#[allow(clippy::cast_possible_truncation, unsafe_code)]
/// # Random Choice.
///
/// Return a random animation from the set, or `None` if for some reason the
/// set is empty.
fn choose(set: &[Animation]) -> Animation {
	let idx = (Universe::rand() % set.len() as u64) as usize;
	unsafe { *(set.get_unchecked(idx)) }
}



#[cfg(test)]
mod tests {
	use super::*;

	#[test]
	fn t_choose() {
		let set = &[
			Animation::Abduction,
			Animation::ClimbUp,
			Animation::Run,
			Animation::Splat,
		];
		let mut all = Vec::with_capacity(5000);
		for _ in 0..5000 {
			all.push(choose(set) as u8);
		}

		all.sort_unstable();
		all.dedup();
		assert_eq!(
			all.len(),
			set.len(),
			"Failed to choose all {} possibilities in 5000 tries.", set.len()
		);
	}

	#[test]
	fn t_playable() {
		for a in Animation::all() {
			if a.playable() {
				assert!(
					a.primary(),
					"Directly playable must be primary: {}", a.as_str()
				)
			}
		}
	}

	#[test]
	fn t_primary_children() {
		for a in Animation::all() {
			if let Some(child) = a.child() {
				assert!(
					a.primary(),
					"Only primary animations can have children: {}", a.as_str()
				);
				assert!(
					! child.primary(),
					"Child animations must be for children: {}", child.as_str()
				);
			}
		}
	}

	#[test]
	fn dbg_unused_frames() {
		use crate::Sprite;
		use std::collections::HashSet;

		// These are the frames we weren't using the last time this was run.
		const EXPECTED: &[u8] = &[
			18,
			27,
			40,
			41,
			45,
			74,
			75,
			83,
			84,
			85,
			91,
		];

		// Build a list of every frame used by an animation.
		let mut frames = HashSet::new();
		for a in Animation::all() {
			let scenes = a.scenes(1024);
			for step in scenes {
				frames.insert(step.frame());
			}
		}

		// Do a simple count up to EMPTY_TILE to see which ones are missing.
		let mut missing: Vec<u8> = Vec::new();
		for i in 0..=Sprite::EMPTY_TILE {
			if ! frames.contains(&i) { missing.push(i); }
		}

		// If the list changed, we'll need to update our tile reference file.
		assert_eq!(
			EXPECTED,
			missing,
			"Unused frames changed: {missing:#?}",
		);
	}

	#[cfg(feature = "director")]
	#[test]
	fn dbg_list() {
		// Manually generate the playlist outputted by Poe::list() using the
		// current animation details as reference.
		let new = Animation::all().filter_map(|a|
			if a.playable() { Some(format!("#{:<4}{}", a as u8, a.as_str())) }
			else { None }
		)
			.collect::<Vec<String>>()
			.join("\n");

		// Make sure the fresh version matches our pre-computed original,
		// otherwise we'll need to update it.
		assert_eq!(
			crate::Poe::list().trim(),
			new.trim(),
			"Playlist has changed:\n\n{new}\n",
		);
	}
}
