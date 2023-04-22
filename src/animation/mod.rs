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
use std::sync::atomic::{
	AtomicU32,
	Ordering::SeqCst,
};



#[cfg(any(test, feature = "director"))] const MIN_ANIMATION_ID: u8 = 1;  // The lowest Animation ID.
#[cfg(any(test, feature = "director"))] const MAX_ANIMATION_ID: u8 = 94; // The highest Animation ID.



/// # Special Default.
///
/// Keep track of the non-Walk default animation selections so we don't repeat
/// ourselves too frequently.
static LAST_SPECIAL: AtomicU32 = AtomicU32::new(0);

/// # Last Entrance Choice.
///
/// Same as `LAST_SPECIAL`, but for entrance animation selections.
static LAST_ENTRANCE: AtomicU32 = AtomicU32::new(0);



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
	BeamIn,
	Beg,
	BigFish,
	BlackSheepChase,
	BlackSheepSkip,
	BlackSheepRomance,
	Bleat,
	Blink,
	ChaseAMartian,
	ClimbIn,
	Cry,
	Dance,
	Eat,
	EatMagicFlower,
	FloatIn,
	Gopher,
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
	ShadowShowdown,
	Shake,
	Skip,
	Sleep,
	SleepSitting,
	SleepStanding,
	Slide,
	SlideIn,
	Sneeze,
	Spin,
	Stargaze,
	Tornado,
	Urinate,
	Walk,
	Yawn,
	Yoyo,

	// Primary animations of a special/supporting nature.
	BathCoolDown,
	Boing,
	Bounce,
	ClimbDown,
	ClimbUp,
	DangleFall,
	DangleRecover,
	DigestMagicFlower1,
	DigestMagicFlower2,
	Drag,
	EatingMagicFlower,
	EndRun,
	Fall,
	GraspingFall,
	Hydroplane,
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
	BlackSheepSkipChild,
	BlackSheepSkipExitChild,
	BlackSheepRomanceChild,
	ChaseAMartianChild,
	Flower,
	MagicFlower1,
	MagicFlower2,
	ShadowShowdownChild1,
	ShadowShowdownChild2,
	SneezeShadow,
	SplatGhost,
	StargazeChild,
}

impl Animation {
	#[cfg(test)]
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
}

// The Animation::default_choice method is generated by build.rs.
include!(concat!(env!("OUT_DIR"), "/default-animations.rs"));

impl Animation {
	/// # Entrance Choice.
	///
	/// Return a default entrance animation for use when the primary mate is
	/// off-screen or newly-activated.
	pub(crate) fn entrance_choice(first: bool) -> Self {
		let mut last = LAST_ENTRANCE.load(SeqCst).to_le_bytes();
		loop {
			let next = match Universe::rand_mod(if first { 18 } else { 12 }) {
				0 => Self::BathDive,
				1 => Self::BeamIn,
				2 => Self::BigFish,
				3 => Self::BlackSheepChase,
				4 => Self::BlackSheepSkip,
				5 => Self::BlackSheepRomance,
				6 => Self::ClimbIn,
				7 => Self::FloatIn,
				8 => Self::Gopher,
				9 => Self::SlideIn,
				10 => Self::Stargaze,
				11 => Self::Yoyo,
				_ => Self::Fall,
			};

			// Accept and return the choice so long as it is fresh, and if
			// we've selected Gopher or Yoyo — which re-exit — make sure
			// neither have been seen recently.
			if match next {
				Self::Gopher | Self::Yoyo => is_fresh(Self::Gopher, last) && is_fresh(Self::Yoyo, last),
				_ => is_fresh(next, last),
			} {
				last.rotate_right(1);
				last[0] = next as u8;
				LAST_ENTRANCE.store(u32::from_le_bytes(last), SeqCst);
				return next;
			}
		}
	}
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
			Self::BeamIn => "Beam In",
			Self::Beg => "Beg",
			Self::BigFish => "Big Fish",
			Self::BigFishChild => "Big Fish (Child)",
			Self::BlackSheepChase => "Black Sheep Chase",
			Self::BlackSheepChaseChild => "Black Sheep Chase (Child)",
			Self::BlackSheepSkip => "Black Sheep Skip",
			Self::BlackSheepSkipChild | Self::BlackSheepSkipExitChild => "Black Sheep Skip(Child)",
			Self::BlackSheepRomance => "Black Sheep Romance",
			Self::BlackSheepRomanceChild => "Black Sheep Romance (Child)",
			Self::Bleat => "Bleat",
			Self::Blink => "Blink",
			Self::Boing => "Boing!",
			Self::Bounce => "Bounce",
			Self::ChaseAMartian => "Chase a Martian",
			Self::ChaseAMartianChild => "Chase a Martian (Child)",
			Self::ClimbDown => "Climb Down",
			Self::ClimbIn => "Climb In",
			Self::ClimbUp => "Climb Up",
			Self::Cry => "Cry",
			Self::Dance => "Dance",
			Self::DangleFall => "Dangle (Maybe) Fall",
			Self::DangleRecover => "Dangle Fall Recovery",
			Self::DigestMagicFlower1 | Self::DigestMagicFlower2 => "Digesting (Magic Flower)",
			Self::Drag => "Drag",
			Self::Eat => "Eat",
			Self::EatMagicFlower => "Eat (Magic Flower)",
			Self::EatingMagicFlower => "Eating (Magic Flower)",
			Self::EndRun => "End Run",
			Self::Fall => "Fall",
			Self::FloatIn => "Float In",
			Self::Flower => "Flower (Child)",
			Self::Gopher => "Gopher",
			Self::GraspingFall => "Grasping Fall",
			Self::Handstand => "Handstand",
			Self::Hop => "Hop",
			Self::Hydroplane => "Hydroplane",
			Self::Jump => "Jump",
			Self::LayDown => "Lay Down",
			Self::LegLifts => "Leg Lifts",
			Self::LookDown => "Look Down",
			Self::LookUp => "Look Up",
			Self::MagicFlower1 | Self::MagicFlower2 => "Magic Flower (Child)",
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
			Self::ShadowShowdown => "Shadow Showdown",
			Self::ShadowShowdownChild1 | Self::ShadowShowdownChild2 => "Shadow Showdown (Child)",
			Self::Shake => "Shake",
			Self::Skip => "Skip",
			Self::Sleep => "Sleep",
			Self::SleepSitting => "Sleep (Sitting)",
			Self::SleepStanding => "Sleep (Standing)",
			Self::Slide => "Slide",
			Self::SlideDown => "Slide Down",
			Self::SlideIn => "Slide In",
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
			Self::Yawn => "Yawn",
			Self::Yoyo => "Yo-Yo",
		}
	}

	/// # Directly Playable?
	///
	/// Returns `true` if the animation can be cued up via the userland setter
	/// `Poe.play`.
	pub(crate) const fn playable(self) -> bool {
		matches!(
			self,
			Self::Abduction |
			Self::BathDive |
			Self::BeamIn |
			Self::Beg |
			Self::BigFish |
			Self::BlackSheepChase |
			Self::BlackSheepSkip |
			Self::BlackSheepRomance |
			Self::Bleat |
			Self::Blink |
			Self::ChaseAMartian |
			Self::ClimbIn |
			Self::Cry |
			Self::Dance |
			Self::Eat |
			Self::EatMagicFlower |
			Self::FloatIn |
			Self::Gopher |
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
			Self::ShadowShowdown |
			Self::Shake |
			Self::Skip |
			Self::Sleep |
			Self::SleepSitting |
			Self::SleepStanding |
			Self::Slide |
			Self::SlideIn |
			Self::Sneeze |
			Self::Spin |
			Self::Stargaze |
			Self::Tornado |
			Self::Urinate |
			Self::Walk |
			Self::Yawn |
			Self::Yoyo
		)
	}
}

impl Animation {
	/// # Clamp to Wall.
	///
	/// Returns the side — left or right — to clamp the animation's X position
	/// to, if any. (If flipped, the opposite should be applied.)
	pub(crate) const fn clamp_x(self) -> Option<Direction> {
		match self {
			Self::ClimbDown | Self::RunDown | Self::SlideDown => Some(Direction::Right),
			Self::ClimbIn | Self::ClimbUp | Self::WallSlide => Some(Direction::Left),
			_ => None,
		}
	}

	/// # CSS Class.
	///
	/// If the animation has a corresponding CSS class, this returns its number
	/// (the classes are all named like `a1`, `a2`, etc.), otherwise `-1`.
	pub(crate) const fn css_class(self) -> i8 {
		match self {
			Self::Drag => 1,
			Self::SneezeShadow => 2,
			Self::Abduction => 3,
			Self::BigFishChild => 4,
			Self::SplatGhost => 5,
			Self::EatingMagicFlower => 6,
			Self::MagicFlower1 | Self::MagicFlower2 => 7,
			Self::DigestMagicFlower1 => 8,
			Self::ShadowShowdownChild1 => 9,
			Self::ShadowShowdownChild2 => 10,
			Self::DangleRecover => 11,
			Self::Yoyo => 12,
			Self::BeamIn => 13,
			_ => -1,
		}
	}

	/// # Flip (X).
	///
	/// Returns `true` if the animation needs to flip the sprite image
	/// horizontally.
	pub(crate) const fn flip_x(self) -> bool {
		matches!(
			self,
			Self::BlackSheepChaseChild | Self::BlackSheepSkip | Self::ReachSide2
		)
	}

	/// # Animation May Exit Screen?
	///
	/// Returns `true` if the relative-moving animation is allowed to ever
	/// leave the viewport. (Actual passage is randomly assigned at runtime.)
	pub(crate) const fn may_exit(self) -> bool {
		matches!(
			self,
			Self::BlackSheepChase |
			Self::ChaseAMartian |
			Self::Hydroplane |
			Self::Run |
			Self::SneezeShadow |
			Self::Tornado |
			Self::Walk
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
			Self::BeamIn |
			Self::Beg |
			Self::BigFish |
			Self::BlackSheepChase |
			Self::BlackSheepSkip |
			Self::BlackSheepRomance |
			Self::Bleat |
			Self::Blink |
			Self::Boing |
			Self::Bounce |
			Self::ChaseAMartian |
			Self::ClimbDown |
			Self::ClimbIn |
			Self::ClimbUp |
			Self::Cry |
			Self::Dance |
			Self::DangleFall |
			Self::DangleRecover |
			Self::DigestMagicFlower1 |
			Self::DigestMagicFlower2 |
			Self::Drag |
			Self::Eat |
			Self::EatingMagicFlower |
			Self::EatMagicFlower |
			Self::EndRun |
			Self::Fall |
			Self::FloatIn |
			Self::Gopher |
			Self::GraspingFall |
			Self::Handstand |
			Self::Hop |
			Self::Hydroplane |
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
			Self::ShadowShowdown |
			Self::Shake |
			Self::Skip |
			Self::Sleep |
			Self::SleepSitting |
			Self::SleepStanding |
			Self::Slide |
			Self::SlideDown |
			Self::SlideIn |
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
			Self::Yawn |
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
			Self::BlackSheepSkip => Some(Self::BlackSheepSkipChild),
			Self::BlackSheepRomance => Some(Self::BlackSheepRomanceChild),
			Self::ChaseAMartian => Some(Self::ChaseAMartianChild),
			Self::Eat => Some(Self::Flower),
			Self::EatMagicFlower => Some(Self::MagicFlower1),
			Self::ShadowShowdown => Some(Self::ShadowShowdownChild1),
			Self::Sneeze => Some(Self::SneezeShadow),
			Self::Splat => Some(Self::SplatGhost),
			Self::Stargaze => Some(Self::StargazeChild),
			_ => None,
		}
	}

	#[allow(clippy::too_many_lines)]
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
			Self::Abduction => Some(
				if 0 == Universe::rand() & 1 { Self::ChaseAMartian }
				else { Self::BeamIn }
			),
			Self::BathCoolDown |
				Self::Beg |
				Self::Bleat |
				Self::Blink |
				Self::Bounce |
				Self::DigestMagicFlower2 |
				Self::EndRun |
				Self::FloatIn |
				Self::Hydroplane |
				Self::LayDown |
				Self::LookDown |
				Self::LookUp |
				Self::Nah |
				Self::PlayDead |
				Self::Popcorn |
				Self::ReachFloor |
				Self::Really |
				Self::Rest |
				Self::Roll |
				Self::Rotate |
				Self::Shake |
				Self::Skip |
				Self::Sleep |
				Self::SleepSitting |
				Self::Slide |
				Self::SlideIn |
				Self::Splat |
				Self::Urinate => Some(Self::Walk),
			Self::BathDive => Some(Self::BathCoolDown),
			Self::BeamIn => Some(Self::Shake),
			Self::BigFish => Some(
				if 0 == Universe::rand_mod(3) { Self::Sneeze }
				else { Self::Walk }
			),
			Self::BlackSheepChase |
				Self::LegLifts |
				Self::Scream => Some(Self::Run),
			Self::BlackSheepSkip => Some(Self::LayDown),
			Self::BlackSheepSkipChild => Some(Self::BlackSheepSkipExitChild),
			Self::Boing => Some(match Universe::rand_mod(10) {
				0..=7 => Self::Rotate,
				8 => Self::Shake,
				_ => Self::Run,
			}),
			Self::ChaseAMartian => Some(Self::Bleat),
			Self::ClimbDown => Some(Self::ClimbDown),
			Self::ClimbIn => Some(Self::Rotate),
			Self::ClimbUp |
				Self::ReachSide1 => Some(Self::ClimbUp),
			Self::DangleFall => Some(
				if 0 == Universe::rand_mod(4) { Self::GraspingFall }
				else { Self::DangleRecover }
			),
			Self::DangleRecover => Some(
				if 0 == Universe::rand_mod(5) { Self::RunUpsideDown }
				else { Self::WalkUpsideDown }
			),
			Self::DigestMagicFlower1 => Some(Self::DigestMagicFlower2),
			Self::Drag => Some(Self::Drag),
			Self::Eat |
				Self::SleepStanding => Some(
					if 0 == Universe::rand_mod(3) { Self::Rest }
					else { Self::Walk }
				),
			Self::EatMagicFlower => Some(Self::EatingMagicFlower),
			Self::EatingMagicFlower => Some(Self::DigestMagicFlower1),
			Self::Fall |
				Self::GraspingFall => Some(Self::GraspingFall),
			Self::Jump => Some(match Universe::rand_mod(5) {
				0..=1 => Self::Run,
				2..=3 => Self::Slide,
				_ => Self::Jump,
			}),
			Self::MagicFlower1 => Some(Self::MagicFlower2),
			Self::ReachCeiling => Some(Self::WalkUpsideDown),
			Self::ReachSide2 => Some(match Universe::rand_mod(5) {
				0 => Self::ClimbDown,
				1 => Self::SlideDown,
				_ => Self::RunDown,
			}),
			Self::Run => Some(match Universe::rand_mod(25) {
				0..=7 => Self::EndRun,
				8..=15 => Self::Jump,
				16..=23 => Self::Run,
				_ => Self::Hydroplane,
			}),
			Self::RunDown => Some(
				if 0 == Universe::rand_mod(3) { Self::SlideDown }
				else { Self::RunDown }
			),
			Self::RunUpsideDown => Some(Self::RunUpsideDown),
			Self::Scoot => Some(match Universe::rand_mod(7) {
				0..=3 => Self::Scoot,
				4..=5 => Self::Rotate,
				_ => Self::Walk,
			}),
			Self::ShadowShowdown => Some(Self::Scratch),
			Self::ShadowShowdownChild1 => Some(Self::ShadowShowdownChild2),
			Self::SlideDown => Some(Self::SlideDown),
			Self::Spin => Some(Self::PlayDead),
			Self::Stargaze => Some(
				if 0 == Universe::rand() & 1 { Self::Nah }
				else { Self::Scream }
			),
			Self::Tornado => Some(Self::TornadoExit),
			Self::WalkUpsideDown => Some(match Universe::rand_mod(15) {
				0 => Self::DangleFall,
				_ => Self::WalkUpsideDown,
			}),
			Self::WallSlide => Some(Self::WallSlide),
			Self::Yawn => Some(Self::Sleep),
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
			Self::EndRun |
				Self::Hydroplane |
				Self::Run => Some(Self::Boing),
			Self::ClimbDown |
				Self::RunDown |
				Self::SlideDown => Some(Self::ReachFloor),
			Self::ClimbUp => Some(Self::ReachCeiling),
			Self::DangleRecover |
				Self::RunUpsideDown |
				Self::WalkUpsideDown => Some(Self::ReachSide2),
			Self::Fall => Some(Self::Bounce),
			Self::GraspingFall => Some(match Universe::rand_mod(5) {
				0 => Self::Bounce,
				1 => Self::PlayDead,
				_ => Self::Splat,
			}),
			Self::Jump | Self::Hop => Some(Self::WallSlide),
			Self::Tornado | Self::WallSlide => Some(Self::Rotate),
			Self::Walk => Some(match Universe::rand_mod(8) {
				0..=4 => Self::Rotate,
				5..=6 => Self::Scoot,
				_ => Self::ReachSide1,
			}),
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
	pub(crate) const fn scenes(self, width: u16) -> SceneList {
		macro_rules! fixed {
			($var:ident) => (SceneList::new(SceneListKind::Fixed(scenes::$var)));
		}

		match self {
			Self::Abduction => fixed!(ABDUCTION),
			Self::AbductionChild => fixed!(ABDUCTION_CHILD),
			Self::BathCoolDown => fixed!(BATH_COOL_DOWN),
			Self::BathDive => fixed!(BATH_DIVE),
			Self::BathDiveChild => fixed!(BATH_DIVE_CHILD),
			Self::BeamIn => fixed!(BEAM_IN),
			Self::Beg => fixed!(BEG),
			Self::BigFish => fixed!(BIG_FISH),
			Self::BigFishChild => fixed!(BIG_FISH_CHILD),
			Self::BlackSheepChase => scenes::black_sheep_chase(width),
			Self::BlackSheepChaseChild => scenes::black_sheep_chase_child(width),
			Self::BlackSheepSkip => fixed!(BLACK_SHEEP_SKIP),
			Self::BlackSheepSkipChild => fixed!(BLACK_SHEEP_SKIP_CHILD),
			Self::BlackSheepSkipExitChild => scenes::black_sheep_skip_exit_child(width),
			Self::BlackSheepRomance => scenes::black_sheep_romance(width),
			Self::BlackSheepRomanceChild => scenes::black_sheep_romance_child(width),
			Self::Bleat => fixed!(BLEAT),
			Self::Blink => fixed!(BLINK),
			Self::Boing => fixed!(BOING),
			Self::Bounce => fixed!(BOUNCE),
			Self::ChaseAMartian => scenes::chase_a_martian(width),
			Self::ChaseAMartianChild => scenes::chase_a_martian_child(width),
			Self::ClimbDown => fixed!(CLIMB_DOWN),
			Self::ClimbIn => fixed!(CLIMB_IN),
			Self::ClimbUp => fixed!(CLIMB_UP),
			Self::Cry => fixed!(CRY),
			Self::Dance => fixed!(DANCE),
			Self::DangleFall => fixed!(DANGLE_FALL),
			Self::DangleRecover => fixed!(DANGLE_RECOVER),
			Self::DigestMagicFlower1 => fixed!(DIGEST_MAGIC_FLOWER1),
			Self::DigestMagicFlower2 => fixed!(DIGEST_MAGIC_FLOWER2),
			Self::Drag => fixed!(DRAG),
			Self::Eat => fixed!(EAT),
			Self::EatMagicFlower => fixed!(EAT_MAGIC_FLOWER),
			Self::EatingMagicFlower => fixed!(EATING_MAGIC_FLOWER),
			Self::EndRun => fixed!(END_RUN),
			Self::Fall => fixed!(FALL),
			Self::FloatIn => fixed!(FLOAT_IN),
			Self::Flower => fixed!(FLOWER),
			Self::Gopher => fixed!(GOPHER),
			Self::GraspingFall => fixed!(GRASPING_FALL),
			Self::Handstand => fixed!(HANDSTAND),
			Self::Hop => fixed!(HOP),
			Self::Hydroplane => fixed!(HYDROPLANE),
			Self::Jump => fixed!(JUMP),
			Self::LayDown => fixed!(LAY_DOWN),
			Self::LegLifts => fixed!(LEG_LIFTS),
			Self::LookDown => fixed!(LOOK_DOWN),
			Self::LookUp => fixed!(LOOK_UP),
			Self::MagicFlower1 => fixed!(MAGIC_FLOWER1),
			Self::MagicFlower2 => fixed!(MAGIC_FLOWER2),
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
			Self::ShadowShowdown => fixed!(SHADOW_SHOWDOWN),
			Self::ShadowShowdownChild1 => fixed!(SHADOW_SHOWDOWN_CHILD1),
			Self::ShadowShowdownChild2 => fixed!(SHADOW_SHOWDOWN_CHILD2),
			Self::Shake => fixed!(SHAKE),
			Self::Skip => fixed!(SKIP),
			Self::Sleep => fixed!(SLEEP),
			Self::SleepSitting => fixed!(SLEEP_SITTING),
			Self::SleepStanding => fixed!(SLEEP_STANDING),
			Self::Slide => fixed!(SLIDE),
			Self::SlideDown => fixed!(SLIDE_DOWN),
			Self::SlideIn => fixed!(SLIDE_IN),
			Self::Sneeze => fixed!(SNEEZE),
			Self::SneezeShadow => fixed!(SNEEZE_SHADOW),
			Self::Spin => fixed!(SPIN),
			Self::Splat => fixed!(SPLAT),
			Self::SplatGhost => fixed!(SPLAT_GHOST),
			Self::Stargaze => fixed!(STARGAZE),
			Self::StargazeChild => fixed!(STARGAZE_CHILD),
			Self::Tornado => fixed!(TORNADO),
			Self::TornadoExit => scenes::tornado_exit(width),
			Self::Urinate => fixed!(URINATE),
			Self::Walk => fixed!(WALK),
			Self::WalkUpsideDown => fixed!(WALK_UPSIDE_DOWN),
			Self::WallSlide => fixed!(WALL_SLIDE),
			Self::Yawn => fixed!(YAWN),
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



/// # Animation Choice is Fresh.
///
/// Returns true if not present among four choices.
const fn is_fresh(animation: Animation, set: [u8; 4]) -> bool {
	let animation = animation as u8;
	set[0] != animation &&
	set[1] != animation &&
	set[2] != animation &&
	set[3] != animation
}



#[cfg(test)]
mod tests {
	use super::*;
	use std::collections::HashSet;

	#[test]
	fn t_default() {
		const TOTAL: usize = 36;

		let set = (0..5_000_u16).into_iter()
			.map(|_| Animation::default_choice() as u8)
			.collect::<HashSet::<u8>>();

		assert_eq!(
			set.len(),
			TOTAL,
			"Failed to choose all {TOTAL} default possibilities in 5K tries."
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
