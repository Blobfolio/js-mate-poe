/*!
# RS Mate Poe: Animations
*/

pub(super) mod frame;
pub(super) mod scene;
mod scenes;
pub(super) mod sound;

use crate::{
	Direction,
	SceneList,
	Universe,
};
use scene::SceneListKind;



#[cfg(any(test, feature = "director"))] const MIN_ANIMATION_ID: u8 = 1;  // The lowest Animation ID.
#[cfg(any(test, feature = "director"))] const MAX_ANIMATION_ID: u8 = 76; // The highest Animation ID.

/// # Entrance Animations.
const ENTRANCE: &[Animation] = &[
	Animation::BathDive,
	Animation::BigFish,
	Animation::BlackSheepChase,
	Animation::BlackSheepRomance,
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
	ChaseAMartian,
	Cry,
	Dance,
	Eat,
	Flop,
	Handstand,
	Hop,
	Jump,
	LayDown,
	LegLifts,
	LookDown,
	LookUp,
	Nah,
	PlayDead,
	Popcorn,
	Really,
	Rest,
	Roll,
	Rotate,
	Run,
	Scoot,
	Scratch,
	Scream,
	Sleep,
	SleepSitting,
	SleepStanding,
	Slide,
	Sneeze,
	Spin,
	Stargaze,
	Tornado,
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
	TornadoExit,
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
	SplatGhost,
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
			Self::Abduction |
			Self::BathDive |
			Self::BeginRun |
			Self::Beg |
			Self::BigFish |
			Self::BlackSheepChase |
			Self::BlackSheepRomance |
			Self::Bleat |
			Self::Blink |
			Self::ChaseAMartian |
			Self::Cry |
			Self::Dance |
			Self::Eat |
			Self::Flop |
			Self::Handstand |
			Self::Hop |
			Self::Jump |
			Self::LayDown |
			Self::LegLifts |
			Self::LookDown |
			Self::LookUp |
			Self::Nah |
			Self::PlayDead |
			Self::Popcorn |
			Self::Really |
			Self::Rest |
			Self::Roll |
			Self::Rotate |
			Self::Run |
			Self::Scoot |
			Self::Scratch |
			Self::Scream |
			Self::Sleep |
			Self::SleepSitting |
			Self::SleepStanding |
			Self::Slide |
			Self::Sneeze |
			Self::Spin |
			Self::Stargaze |
			Self::Tornado |
			Self::Urinate |
			Self::Walk |
			Self::Yoyo
		)
	}
}

impl Animation {
	/// # Default Choice.
	///
	/// Return a generic default animation for use in contexts where an
	/// explicit one is unspecified.
	pub(crate) fn default_choice() -> Self {
		let rand = Universe::rand() % 100;
		if rand < 40 { Self::Walk }
		else if rand < 65 { Self::BeginRun }
		else if rand < 90 { Self::default_common() }
		else if rand < 99 { Self::default_rare() }
		else { Self::default_secret() }
	}

	/// # Default Common Animations.
	///
	/// This class of animations has a 25% chance of happening, meaning each
	/// individually occurs about 2.08% of the time.
	fn default_common() -> Self {
		match Universe::rand() % 12 {
			0 => Self::Beg,
			1 => Self::Dance,
			2 => Self::Eat,
			3 => Self::Flop,
			4 => Self::Handstand,
			5 => Self::Hop,
			6 => Self::LayDown,
			7 => Self::LookDown,
			8 => Self::LookUp,
			9 => Self::Roll,
			10 => Self::Rotate,
			_ => Self::Spin,
		}
	}

	/// # Default Rare Animations.
	///
	/// These are a little more noticeable than the "common" animations, so
	/// should play less often.
	///
	/// This class of animations has a 9% chance of happening, meaning each
	/// individually occurs about 0.69% of the time.
	fn default_rare() -> Self {
		match Universe::rand() % 13 {
			0 => Self::Blink,
			1 => Self::Cry,
			2 => Self::LegLifts,
			3 => Self::Nah,
			4 => Self::PlayDead,
			5 => Self::Popcorn,
			6 => Self::Really,
			7 => Self::Rest,
			8 => Self::Scoot,
			9 => Self::Scratch,
			10 => Self::Scream,
			11 => Self::SleepSitting,
			_ => Self::SleepStanding,
		}
	}

	/// # Default Very Rare Animations.
	///
	/// These animations are meant to be surprising, and so are tuned down low.
	///
	/// This class has only a 1% chance of occuring, meaning each individually
	/// occurs about 0.16% of the time.
	fn default_secret() -> Self {
		match Universe::rand() % 6 {
			0 => Self::Abduction, // Exit/Sound.
			1 => Self::Bleat,     // Sound.
			2 => Self::Sleep,     // Sound.
			3 => Self::Sneeze,    // Sound.
			4 => Self::Tornado,   // Exit.
			_ => Self::Urinate,   // Uncivilized.
		}
	}

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
			Self::Bounce => "Bounce",
			Self::ChaseAMartian => "Chase a Martian",
			Self::ChaseAMartianChild => "Chase a Martian (Child)",
			Self::ClimbDown => "Climb Down",
			Self::ClimbUp => "Climb Up",
			Self::Cry => "Cry",
			Self::Dance => "Dance",
			Self::DangleFall => "Dangle (Maybe) Fall",
			Self::DangleRecover => "Dangle Fall Recovery",
			Self::DeepThoughts => "Deep Thoughts",
			Self::Drag => "Drag",
			Self::Eat => "Eat",
			Self::EndRun => "End Run",
			Self::Fall => "Fall",
			Self::Flop => "Flop",
			Self::FlowerChild => "Flower (Child)",
			Self::GraspingFall => "Grasping Fall",
			Self::Handstand => "Handstand",
			Self::Hop => "Hop",
			Self::Jump => "Jump",
			Self::LayDown => "Lay Down",
			Self::LegLifts => "Leg Lifts",
			Self::LookDown => "Look Down",
			Self::LookUp => "Look Up",
			Self::Nah => "Nah…",
			Self::PlayDead => "Play Dead",
			Self::Popcorn => "Popcorn",
			Self::ReachCeiling => "Reach Ceiling",
			Self::ReachFloor => "Reach Floor",
			Self::ReachSide1 => "Reach Side (From Floor)",
			Self::ReachSide2 => "Reach Side (From Ceiling)",
			Self::Really => "Really?!",
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
			Self::SleepSitting => "Sleep (Sitting)",
			Self::SleepStanding => "Sleep (Standing)",
			Self::Slide => "Slide",
			Self::SlideDown => "Slide Down",
			Self::Sneeze => "Sneeze",
			Self::SneezeShadow => "Sneeze Shadow (Child)",
			Self::Spin => "Spin",
			Self::Splat => "Splat",
			Self::SplatGhost => "Splat (Ghost)",
			Self::Stargaze => "Stargaze",
			Self::StargazeChild => "Stargaze (Child)",
			Self::Tornado => "Tornado",
			Self::TornadoExit => "Tornado (Exit)",
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
			Self::Abduction | Self::BigFishChild | Self::Drag |
			Self::SneezeShadow | Self::SplatGhost
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
			Self::SneezeShadow | Self::Tornado | Self::Walk
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
			Self::Abduction |
			Self::BathCoolDown |
			Self::BathDive |
			Self::Beg |
			Self::BeginRun |
			Self::BigFish |
			Self::BlackSheepChase |
			Self::BlackSheepRomance |
			Self::Bleat |
			Self::Blink |
			Self::Boing |
			Self::Bounce |
			Self::ChaseAMartian |
			Self::ClimbDown |
			Self::ClimbUp |
			Self::Cry |
			Self::Dance |
			Self::DangleFall |
			Self::DangleRecover |
			Self::DeepThoughts |
			Self::Drag |
			Self::Eat |
			Self::EndRun |
			Self::Fall |
			Self::Flop |
			Self::GraspingFall |
			Self::Handstand |
			Self::Hop |
			Self::Jump |
			Self::LayDown |
			Self::LegLifts |
			Self::LookDown |
			Self::LookUp |
			Self::Nah |
			Self::PlayDead |
			Self::Popcorn |
			Self::ReachCeiling |
			Self::ReachFloor |
			Self::ReachSide1 |
			Self::ReachSide2 |
			Self::Really |
			Self::Rest |
			Self::Roll |
			Self::Rotate |
			Self::Run |
			Self::RunDown |
			Self::RunUpsideDown |
			Self::Scoot |
			Self::Scratch |
			Self::Scream |
			Self::Sleep |
			Self::SleepSitting |
			Self::SleepStanding |
			Self::Slide |
			Self::SlideDown |
			Self::Sneeze |
			Self::Spin |
			Self::Splat |
			Self::Stargaze |
			Self::Tornado |
			Self::TornadoExit |
			Self::Urinate |
			Self::Walk |
			Self::WalkUpsideDown |
			Self::WallSlide |
			Self::Yoyo
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
			Self::Splat => Some(Self::SplatGhost),
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
			Self::BeginRun |
				Self::BlackSheepChase |
				Self::Scream => Some(Self::Run),
			Self::BigFish => Some(choose(&[Self::Walk, Self::Walk, Self::Sneeze])),
			Self::Bleat |
				Self::Bounce |
				Self::EndRun |
				Self::LayDown |
				Self::LookDown |
				Self::LookUp |
				Self::PlayDead |
				Self::ReachFloor |
				Self::Rest |
				Self::Rotate |
				Self::Sleep |
				Self::SleepSitting |
				Self::Slide |
				Self::Splat |
				Self::Urinate => Some(Self::Walk),
			Self::Boing => Some(choose(&[
				Self::Rotate, Self::Rotate, Self::Rotate, Self::Rotate, Self::Rotate,
				Self::Rotate, Self::Rotate, Self::Rotate,
				Self::Walk, Self::Walk, Self::Walk, Self::Walk,
				Self::BeginRun,
			])),
			Self::ChaseAMartian => Some(Self::Bleat),
			Self::ClimbDown => Some(Self::ClimbDown),
			Self::ClimbUp |
				Self::ReachSide1 => Some(Self::ClimbUp),
			Self::DangleFall => Some(choose(&[
				Self::DangleRecover, Self::DangleRecover, Self::DangleRecover,
				Self::GraspingFall,
			])),
			Self::DangleRecover |
				Self::ReachCeiling => Some(choose(&[
					Self::WalkUpsideDown, Self::WalkUpsideDown, Self::WalkUpsideDown, Self::WalkUpsideDown,
					Self::DeepThoughts,
				])),
			Self::DeepThoughts |
				Self::RunUpsideDown => Some(Self::RunUpsideDown),
			Self::Drag => Some(Self::Drag),
			Self::Eat |
				Self::SleepStanding => Some(choose(&[Self::Rest, Self::Walk, Self::Walk])),
			Self::Fall |
				Self::GraspingFall => Some(Self::GraspingFall),
			Self::Jump => Some(choose(&[
				Self::Run, Self::Run,
				Self::Slide, Self::Slide,
				Self::Jump,
			])),
			Self::LegLifts => Some(Self::BeginRun),
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
			Self::Spin => Some(Self::PlayDead),
			Self::Stargaze => Some(choose(&[Self::Nah, Self::Scream])),
			Self::Tornado => Some(Self::TornadoExit),
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
			Self::BeginRun |
				Self::EndRun |
				Self::Run => Some(Self::Boing),
			Self::ClimbDown |
				Self::RunDown |
				Self::SlideDown => Some(Self::ReachFloor),
			Self::ClimbUp => Some(Self::ReachCeiling),
			Self::DangleRecover |
				Self::DeepThoughts |
				Self::RunUpsideDown |
				Self::WalkUpsideDown => Some(Self::ReachSide2),
			Self::Fall => Some(Self::Bounce),
			Self::GraspingFall => Some(choose(&[
				Self::Splat, Self::Splat, Self::Splat,
				Self::Bounce,
				Self::PlayDead,
			])),
			Self::Jump | Self::Hop => Some(Self::WallSlide),
			Self::Tornado | Self::WallSlide => Some(Self::Rotate),
			Self::Walk => Some(choose(&[
				Self::Rotate, Self::Rotate, Self::Rotate, Self::Rotate, Self::Rotate,
				Self::Scoot, Self::Scoot,
				Self::ReachSide1,
			])),
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
			Self::Bounce => fixed!(BOUNCE),
			Self::ChaseAMartian => scenes::chase_a_martian(width),
			Self::ChaseAMartianChild => scenes::chase_a_martian_child(width),
			Self::ClimbDown => fixed!(CLIMB_DOWN),
			Self::ClimbUp => fixed!(CLIMB_UP),
			Self::Cry => fixed!(CRY),
			Self::Dance => fixed!(DANCE),
			Self::DangleFall => fixed!(DANGLE_FALL),
			Self::DangleRecover => fixed!(DANGLE_RECOVER),
			Self::DeepThoughts => fixed!(DEEP_THOUGHTS),
			Self::Drag => fixed!(DRAG),
			Self::Eat => fixed!(EAT),
			Self::Fall => fixed!(FALL),
			Self::Flop => fixed!(FLOP),
			Self::FlowerChild => fixed!(FLOWER_CHILD),
			Self::GraspingFall => fixed!(GRASPING_FALL),
			Self::Handstand => fixed!(HANDSTAND),
			Self::Hop => fixed!(HOP),
			Self::Jump => fixed!(JUMP),
			Self::LayDown => scenes::lay_down(),
			Self::LegLifts => fixed!(LEG_LIFTS),
			Self::LookDown => fixed!(LOOK_DOWN),
			Self::LookUp => fixed!(LOOK_UP),
			Self::Nah => fixed!(NAH),
			Self::PlayDead => fixed!(PLAY_DEAD),
			Self::Popcorn => fixed!(POPCORN),
			Self::ReachCeiling => fixed!(REACH_CEILING),
			Self::ReachFloor => fixed!(REACH_FLOOR),
			Self::ReachSide1 => fixed!(REACH_SIDE1),
			Self::ReachSide2 => fixed!(REACH_SIDE2),
			Self::Really => fixed!(REALLY),
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
			Self::SleepSitting => fixed!(SLEEP_SITTING),
			Self::SleepStanding => fixed!(SLEEP_STANDING),
			Self::Slide => fixed!(SLIDE),
			Self::SlideDown => fixed!(SLIDE_DOWN),
			Self::Sneeze => fixed!(SNEEZE),
			Self::SneezeShadow => fixed!(SNEEZE_SHADOW),
			Self::Spin => fixed!(SPIN),
			Self::Splat => fixed!(SPLAT),
			Self::SplatGhost => fixed!(SPLAT_GHOST),
			Self::Stargaze => fixed!(STARGAZE),
			Self::StargazeChild => fixed!(STARGAZE_CHILD),
			Self::Tornado => fixed!(TORNADO),
			Self::TornadoExit => scenes::tornado_exit(width),
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
	use std::collections::HashSet;

	#[test]
	fn t_choose() {
		let possible = &[
			Animation::Abduction,
			Animation::ClimbUp,
			Animation::Run,
			Animation::Splat,
		];
		let set = (0..5_000_u16).into_iter()
			.map(|_| choose(possible) as u8)
			.collect::<HashSet::<u8>>();

		assert_eq!(
			possible.len(),
			set.len(),
			"Failed to choose all {} possibilities in 5000 tries.", possible.len()
		);
	}

	#[test]
	fn t_default() {
		let set = (0..5_000_u16).into_iter()
			.map(|_| Animation::default_choice() as u8)
			.collect::<HashSet::<u8>>();

		assert_eq!(
			set.len(),
			33,
			"Failed to choose all 33 default possibilities in 5000 tries."
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

	#[cfg(feature = "director")]
	#[test]
	fn dbg_list() {
		assert_eq!(
			Animation::StargazeChild as u8,
			MAX_ANIMATION_ID,
			"MAX_ANIMATION_ID is wrong!"
		);

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
		let old = std::fs::read_to_string("skel/playlist.txt").expect("Missing playlist.txt");
		assert_eq!(
			old.trim(),
			new.trim(),
			"Playlist has changed:\n\n{new}\n",
		);
	}
}
