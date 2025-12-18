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



/// # Special Default.
///
/// Keep track of the non-Walk default animation selections so we don't repeat
/// ourselves too frequently.
static LAST_SPECIAL: AtomicU32 = AtomicU32::new(0);

/// # Last Entrance Choice.
///
/// Same as `LAST_SPECIAL`, but for entrance animation selections.
static LAST_ENTRANCE: AtomicU32 = AtomicU32::new(0);



/// # Helper: Animations.
macro_rules! animation {
	(@count $odd:tt) => ( 1 );
	(@count $odd:tt $($a:tt $b:tt)+) => ( (animation!(@count $($a)+) * 2) + 1 );
	(@count $($a:tt $b:tt)+) =>         (  animation!(@count $($a)+) * 2      );

	($( $k:ident $( = $v:literal )? $vstr:literal $( @ $dynamic:ident:: )? $scene:ident, )+) => (
		#[repr(u8)]
		#[derive(Debug, Clone, Copy, Eq, PartialEq)]
		/// # Animations.
		///
		/// This enum holds all possible sprite animations, for both primary and child
		/// mates, as well as secondary (linked) sequences.
		///
		/// Each variant is equivalent to a `u8`, starting with `1`.
		pub(crate) enum Animation {
			$( $k $( = $v)?, )+
		}

		impl Animation {
			#[cfg(any(test, feature = "director"))]
			/// # Maximum Animation ID.
			const MAX_ANIMATION_ID: u8 = animation!(@count $($k)+);

			#[cfg(any(test, feature = "director"))]
			/// # All Animations.
			pub(crate) const ALL: [Self; Self::MAX_ANIMATION_ID as usize] = [ $( Self::$k, )+ ];

			#[cfg(feature = "director")]
			/// # From U8.
			///
			/// Return the `Animation` corresponding to the given ID, or `None` if out
			/// of range.
			pub(crate) const fn from_u8(src: u8) -> Option<Self> {
				// Discriminants start at one instead of zero, so we need to
				// knock off one to align it to the indices in ALL.
				if let Some(src) = src.checked_sub(1) && src < Self::MAX_ANIMATION_ID {
					Some(Self::ALL[src as usize])
				}
				else { None }
			}

			#[cfg(any(test, feature = "director"))]
			#[must_use]
			/// # As Str.
			///
			/// Return a human-readable "title" for the `Animation` as a static string
			/// slice.
			pub(crate) const fn as_str(self) -> &'static str {
				match self {
					$( Self::$k => $vstr, )+
				}
			}

			/// # Scenes.
			///
			/// Return the animation's `SceneList`.
			///
			/// Most of these are completely static, identical from run-to-run, but a
			/// few have randomized or environmental modifiers, tweaking them slightly.
			pub(crate) const fn scenes(self, width: u16) -> SceneList {
				macro_rules! scene {
					($s:ident) => ( const { SceneList::new(SceneListKind::Fixed(scenes::$s)) } );
					($s:path) =>  ( $s(width) );
				}

				match self {
					$( Self::$k => scene!($($dynamic::)?$scene), )+
				}
			}
		}
	);
}

animation! {
	// Animations for the primary mate.
	Abduction = 1_u8             "Abduction"                          ABDUCTION,
	BathDive                     "Bath Dive"                          BATH_DIVE,
	BeamIn                       "Beam In"                            BEAM_IN,
	Beg                          "Beg"                                BEG,
	BigFish                      "Big Fish"                           BIG_FISH,
	BlackSheepCatch              "Black Sheep Catch"                  BLACK_SHEEP_CATCH,
	BlackSheepCatchFail          "Black Sheep (Almost) Catch"         BLACK_SHEEP_CATCH_FAIL,
	BlackSheepChase              "Black Sheep Chase"                  @scenes::black_sheep_chase,
	BlackSheepRomance            "Black Sheep Romance"                @scenes::black_sheep_romance,
	Bleat                        "Bleat"                              BLEAT,
	Blink                        "Blink"                              BLINK,
	ChaseAMartian                "Chase a Martian"                    @scenes::chase_a_martian,
	ClimbIn                      "Climb In"                           CLIMB_IN,
	Cry                          "Cry"                                CRY,
	Dance                        "Dance"                              DANCE,
	Eat                          "Eat"                                EAT,
	EatMagicFlower               "Eat (Magic Flower)"                 EAT_MAGIC_FLOWER,
	FloatIn                      "Float In"                           FLOAT_IN,
	Glitch                       "Glitch"                             GLITCH,
	Gopher                       "Gopher"                             GOPHER,
	Handstand                    "Handstand"                          HANDSTAND,
	Hop                          "Hop"                                HOP,
	Jump                         "Jump"                               JUMP,
	JumpIn                       "Jump In"                            JUMP_IN,
	LayDown                      "Lay Down"                           LAY_DOWN,
	LegLifts                     "Leg Lifts"                          LEG_LIFTS,
	LookDown                     "Look Down"                          LOOK_DOWN,
	LookUp                       "Look Up"                            LOOK_UP,
	Nah                          "Nah…"                               NAH,
	PlayDead                     "Play Dead"                          PLAY_DEAD,
	Popcorn                      "Popcorn"                            POPCORN,
	Really                       "Really?!"                           REALLY,
	Rest                         "Rest"                               REST,
	Roll                         "Roll"                               ROLL,
	Rotate                       "Rotate"                             ROTATE,
	Run                          "Run"                                RUN,
	Scoot                        "Scoot"                              SCOOT,
	Scratch                      "Scratch"                            SCRATCH,
	Scream                       "Scream"                             SCREAM,
	ShadowShowdown               "Shadow Showdown"                    SHADOW_SHOWDOWN,
	Shake                        "Shake"                              SHAKE,
	SideStep                     "Side Step"                          SIDE_STEP,
	Skip                         "Skip"                               SKIP,
	Sleep                        "Sleep"                              SLEEP,
	SleepSitting                 "Sleep (Sitting)"                    SLEEP_SITTING,
	SleepStanding                "Sleep (Standing)"                   SLEEP_STANDING,
	Slide                        "Slide"                              SLIDE,
	SlideIn                      "Slide In"                           SLIDE_IN,
	Sneeze                       "Sneeze"                             SNEEZE,
	Spin                         "Spin"                               SPIN,
	Stargaze                     "Stargaze"                           STARGAZE,
	Tornado                      "Tornado"                            TORNADO,
	Urinate                      "Urinate"                            URINATE,
	Walk                         "Walk"                               WALK,
	Yawn                         "Yawn"                               YAWN,
	Yoyo                         "Yo-Yo"                              YOYO,

	// Primary animations of a special/supporting nature.
	BathCoolDown                 "Bath Cool Down"                     BATH_COOL_DOWN,
	Boing                        "Boing!"                             BOING,
	Bounce                       "Bounce"                             BOUNCE,
	ClimbDown                    "Climb Down"                         CLIMB_DOWN,
	ClimbUp                      "Climb Up"                           CLIMB_UP,
	DangleFall                   "Dangle (Maybe) Fall"                DANGLE_FALL,
	DangleRecover                "Dangle Fall Recovery"               DANGLE_RECOVER,
	DigestMagicFlower1           "Digesting (Magic Flower)"           DIGEST_MAGIC_FLOWER1,
	DigestMagicFlower2           "Digesting (Magic Flower)"           DIGEST_MAGIC_FLOWER2,
	Drag                         "Drag"                               DRAG,
	EatingMagicFlower            "Eating (Magic Flower)"              EATING_MAGIC_FLOWER,
	EndRun                       "End Run"                            END_RUN,
	Fall                         "Fall"                               FALL,
	GraspingFall                 "Grasping Fall"                      GRASPING_FALL,
	Hydroplane                   "Hydroplane"                         HYDROPLANE,
	JumpInLanding                "Jump In (Landing)"                  JUMP_IN_LANDING,
	ReachCeiling                 "Reach Ceiling"                      REACH_CEILING,
	ReachFloor                   "Reach Floor"                        REACH_FLOOR,
	ReachSide1                   "Reach Side (From Floor)"            REACH_SIDE1,
	ReachSide2                   "Reach Side (From Ceiling)"          REACH_SIDE2,
	RunDown                      "Run Down"                           RUN_DOWN,
	RunUpsideDown                "Run Upside Down"                    RUN_UPSIDE_DOWN,
	SlideDown                    "Slide Down"                         SLIDE_DOWN,
	Splat                        "Splat"                              SPLAT,
	TornadoExit                  "Tornado (Exit)"                     @scenes::tornado_exit,
	WalkUpsideDown               "Walk Upside Down"                   WALK_UPSIDE_DOWN,
	WallSlide                    "Wall Slide"                         WALL_SLIDE,

	// Animations for the child mates.
	AbductionChild               "Abduction (Child)"                  ABDUCTION_CHILD,
	BathDiveChild                "Bathtub (Child)"                    BATH_DIVE_CHILD,
	BigFishChild                 "Big Fish (Child)"                   BIG_FISH_CHILD,
	BlackSheepCatchChild         "Black Sheep Catch (Child)"          BLACK_SHEEP_CATCH_CHILD,
	BlackSheepCatchExitChild     "Black Sheep Catch (Child)"          BLACK_SHEEP_CATCH_EXIT_CHILD,
	BlackSheepCatchFailChild     "Black Sheep (Almost) Catch (Child)" BLACK_SHEEP_CATCH_FAIL_CHILD,
	BlackSheepCatchFailExitChild "Black Sheep (Almost) Catch (Child)" @scenes::black_sheep_catch_fail_exit_child,
	BlackSheepChaseChild         "Black Sheep Chase (Child)"          @scenes::black_sheep_chase_child,
	BlackSheepRomanceChild       "Black Sheep Romance (Child)"        @scenes::black_sheep_romance_child,
	ChaseAMartianChild           "Chase a Martian (Child)"            @scenes::chase_a_martian_child,
	Flower                       "Flower (Child)"                     FLOWER,
	MagicFlower1                 "Magic Flower (Child)"               MAGIC_FLOWER1,
	MagicFlower2                 "Magic Flower (Child)"               MAGIC_FLOWER2,
	ShadowShowdownChild1         "Shadow Showdown (Child)"            SHADOW_SHOWDOWN_CHILD1,
	ShadowShowdownChild2         "Shadow Showdown (Child)"            SHADOW_SHOWDOWN_CHILD2,
	SneezeShadow                 "Sneeze Shadow (Child)"              SNEEZE_SHADOW,
	SplatGhost                   "Splat (Ghost)"                      SPLAT_GHOST,
	StargazeChild                "Stargaze (Child)"                   STARGAZE_CHILD,
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
			let next = match Universe::rand_mod(if first { 19 } else { 13 }) {
				0 => Self::BathDive,
				1 => Self::BigFish,
				2 => Self::BlackSheepCatch,
				3 => Self::BlackSheepCatchFail,
				4 => Self::BlackSheepChase,
				5 => Self::BlackSheepRomance,
				6 => Self::ClimbIn,
				7 => Self::FloatIn,
				8 => Self::Gopher,
				9 => Self::JumpIn,
				10 => Self::SlideIn,
				11 => Self::Stargaze,
				12 => Self::Yoyo,
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
			Self::BlackSheepCatch |
			Self::BlackSheepCatchFail |
			Self::BlackSheepChase |
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
			Self::Glitch |
			Self::Gopher |
			Self::Handstand |
			Self::Hop |
			Self::Jump |
			Self::JumpIn |
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
			Self::SideStep |
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
	/// Return the stylized animation "number", if any. As there can be only
	/// one, the value slots into a custom `data-a` attribute on the wrapper
	/// element.
	pub(crate) const fn css_class(self) -> &'static str {
		match self {
			Self::Drag => "1",
			Self::BlackSheepCatchChild | Self::SneezeShadow => "2",
			Self::Abduction => "3",
			Self::BigFishChild => "4",
			Self::SplatGhost => "5",
			Self::EatingMagicFlower => "6",
			Self::MagicFlower1 | Self::MagicFlower2 => "7",
			Self::DigestMagicFlower1 => "8",
			Self::ShadowShowdownChild1 => "9",
			Self::ShadowShowdownChild2 => "a",
			Self::DangleRecover => "b",
			Self::Yoyo => "c",
			Self::BeamIn => "d",
			Self::Glitch => "e",
			Self::BlackSheepCatchExitChild => "f",
			Self::BathDiveChild => "g",
			_ => "",
		}
	}

	/// # Flip (X).
	///
	/// Returns `true` if the animation needs to flip the sprite image
	/// horizontally.
	pub(crate) const fn flip_x(self) -> bool {
		matches!(
			self,
			Self::BlackSheepCatch |
			Self::BlackSheepCatchFail |
			Self::BlackSheepChaseChild |
			Self::ReachSide2
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
			Self::BlackSheepCatch |
			Self::BlackSheepCatchFail |
			Self::BlackSheepChase |
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
			Self::Glitch |
			Self::Gopher |
			Self::GraspingFall |
			Self::Handstand |
			Self::Hop |
			Self::Hydroplane |
			Self::Jump |
			Self::JumpIn |
			Self::JumpInLanding |
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
			Self::SideStep |
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

	/// # Smooth?
	///
	/// Some of the faster animations can benefit from a little "transform"
	/// smoothing.
	pub(crate) const fn smooth(self) -> bool {
		matches!(
			self,
			Self::AbductionChild |
			Self::BathDive |
			Self::BigFish |
			Self::BigFishChild |
			Self::BlackSheepCatchFailExitChild |
			Self::BlackSheepChase |
			Self::BlackSheepRomance |
			Self::BlackSheepRomanceChild |
			Self::ChaseAMartianChild |
			Self::Fall |
			Self::GraspingFall |
			Self::Jump |
			Self::JumpIn |
			Self::Run |
			Self::RunDown |
			Self::RunUpsideDown |
			Self::Skip |
			Self::SlideDown |
			Self::SlideIn |
			Self::WallSlide
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
			Self::BlackSheepCatch => Some(Self::BlackSheepCatchChild),
			Self::BlackSheepCatchFail => Some(Self::BlackSheepCatchFailChild),
			Self::BlackSheepChase => Some(Self::BlackSheepChaseChild),
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

	#[expect(clippy::too_many_lines, reason = "There are a lot of animations.")]
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
			Self::BeamIn |
				Self::Glitch => Some(Self::Shake),
			Self::BigFish => Some(
				if 0 == Universe::rand_mod(3) { Self::Sneeze }
				else { Self::Walk }
			),
			Self::BlackSheepCatch => Some(Self::Skip),
			Self::BlackSheepCatchChild => Some(Self::BlackSheepCatchExitChild),
			Self::BlackSheepCatchFail => Some(Self::LayDown),
			Self::BlackSheepCatchFailChild => Some(Self::BlackSheepCatchFailExitChild),
			Self::BlackSheepChase |
				Self::JumpInLanding |
				Self::LegLifts |
				Self::Scream => Some(Self::Run),
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
			Self::JumpIn => Some(Self::JumpIn),
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
				Self::JumpInLanding |
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
			Self::Hop |
				Self::Jump |
				Self::Skip => Some(Self::WallSlide),
			Self::JumpIn => Some(Self::JumpInLanding),
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
	use wasm_bindgen_test::*;

	#[wasm_bindgen_test]
	fn t_default() {
		const TOTAL: usize = 36;

		let set = (0..5_000_u16)
			.map(|_| Animation::default_choice() as u8)
			.collect::<HashSet::<u8>>();

		assert_eq!(
			set.len(),
			TOTAL,
			"Failed to choose all {TOTAL} default possibilities in 5K tries."
		);
	}

	#[wasm_bindgen_test]
	fn t_playable() {
		for a in Animation::ALL {
			if a.playable() {
				assert!(
					a.primary(),
					"Directly playable must be primary: {}", a.as_str()
				);
			}
		}
	}

	#[wasm_bindgen_test]
	fn t_primary_children() {
		for a in Animation::ALL {
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
	#[wasm_bindgen_test]
	fn dbg_list() {
		assert_eq!(
			Animation::StargazeChild as u8,
			Animation::MAX_ANIMATION_ID,
			"MAX_ANIMATION_ID is wrong!"
		);

		// Manually generate the playlist outputted by Poe::list() using the
		// current animation details as reference.
		let new = Animation::ALL.into_iter().filter_map(|a|
			if a.playable() { Some(format!("#{:<4}{}", a as u8, a.as_str())) }
			else { None }
		)
			.collect::<Vec<String>>()
			.join("\n");

		// Make sure the fresh version matches our pre-computed original,
		// otherwise we'll need to update it.
		let old = include_str!("../../skel/playlist.txt");
		assert_eq!(
			old.trim(),
			new.trim(),
			"Playlist has changed:\n\n{new}\n",
		);
	}
}
