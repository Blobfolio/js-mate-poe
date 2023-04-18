/*!
# RS Mate Poe: Scene Details
*/

use crate::{
	Frame,
	Position,
	Scene,
	SceneList,
	Sound,
};
use super::SceneListKind;



/// # For `Animation::Abduction`.
pub(super) const ABDUCTION: &[Scene] = &[
	Scene::new(30, &[
		Frame::F008, Frame::F008, Frame::F008, Frame::F008, Frame::F008,
		Frame::F008, Frame::F008,

		Frame::F009, Frame::F009, Frame::F009, Frame::F009, Frame::F009,
		Frame::F009, Frame::F009, Frame::F009, Frame::F009, Frame::F009,
		Frame::F009, Frame::F009, Frame::F009,

		Frame::F031, Frame::F031, Frame::F031, Frame::F031,

		Frame::F031, Frame::F031, Frame::F031, Frame::F031, Frame::F031,
		Frame::F031, Frame::F031, Frame::F031, Frame::F031, Frame::F031,
		Frame::F031, Frame::F032, Frame::F032, Frame::F032, Frame::F033,
		Frame::F033, Frame::F033, Frame::F033, Frame::F031, Frame::F031,

		Frame::F031, Frame::F031, Frame::F031, Frame::F031, Frame::F031,
		Frame::F031, Frame::F031, Frame::F031, Frame::F031, Frame::F031,
		Frame::F031, Frame::F031, Frame::F031, Frame::F031, Frame::F031,
		Frame::F031, Frame::F031, Frame::F031, Frame::F031, Frame::F031,
	])
		.with_repeat(2, 24)
		.with_flags(Scene::GRAVITY),
	Scene::new(30, &[
		Frame::F031, Frame::F031, Frame::F031, Frame::F031, Frame::F031,
		Frame::F040, Frame::F040, Frame::F040, Frame::F040, Frame::F040,
	])
		.with_flags(Scene::GRAVITY),
	Scene::new(30, &[
		Frame::F084, Frame::F084, Frame::F084, Frame::F084,
		Frame::F085, Frame::F085, Frame::F085, Frame::F085,
		Frame::F086, Frame::F086, Frame::None, Frame::F086,

		Frame::F084, Frame::F084, Frame::None, Frame::None,
		Frame::F085, Frame::None, Frame::F085, Frame::F085,
		Frame::F086, Frame::F086, Frame::F086, Frame::F086,

		Frame::F084, Frame::None, Frame::None, Frame::None,
		Frame::F085, Frame::None, Frame::F085, Frame::None,
		Frame::F086, Frame::None, Frame::F086, Frame::None,
	])
		.with_move_to(Position::new(0, -1)),
	Scene::new(30, &[Frame::None])
		.with_repeat(220, 0),
];

/// # For `Animation::AbductionChild`.
pub(super) const ABDUCTION_CHILD: &[Scene] = &[
	Scene::new(30, &[Frame::F144, Frame::F145, Frame::F146, Frame::F147])
		.with_move_to(Position::new(0, 4))
		.with_repeat(29, 0)
		.with_flags(Scene::EASE_OUT | Scene::IGNORE_EDGES),
	Scene::new(30, &[
		Frame::F148, Frame::F148,
		Frame::F149, Frame::F149,
		Frame::F150, Frame::F150,
		Frame::F151, Frame::F151,
	])
		.with_repeat(14, 0)
		.with_flags(Scene::IGNORE_EDGES),
	Scene::new(30, &[Frame::F144, Frame::F145, Frame::F146, Frame::F147])
		.with_move_to(Position::new(0, -16))
		.with_repeat(29, 0)
		.with_flags(Scene::EASE_IN | Scene::IGNORE_EDGES),
];

/// # For `Animation::BathCoolDown`.
pub(super) const BATH_COOL_DOWN: &[Scene] = &[
	Scene::new(100, &[
		Frame::H031, Frame::H031, Frame::H031, Frame::H032,
		Frame::H033, Frame::H032, Frame::H031, Frame::H031,
	])
		.with_repeat(2, 0)
		.with_flags(Scene::GRAVITY),
	Scene::new(100, &[
		Frame::F109, Frame::F040, Frame::F040,
		Frame::F041, Frame::F041, Frame::F009,
	])
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::BathDive`.
pub(super) const BATH_DIVE: &[Scene] = &[
	Scene::new(30, &[Frame::F121])
		.with_repeat(146, 0)
		.with_move_to(Position::new(-4, 3)),
	Scene::new(30, &[
		Frame::F122, Frame::F122, Frame::F122, Frame::F122, Frame::F123,
		Frame::F123, Frame::F123, Frame::F123, Frame::F124, Frame::F124,
		Frame::F124, Frame::F124, Frame::F125, Frame::F125, Frame::F125,
		Frame::F125, Frame::F126, Frame::F126, Frame::F126, Frame::F126,
		Frame::F127, Frame::F127, Frame::F127, Frame::F127, Frame::F128,
		Frame::F128, Frame::F128, Frame::F128, Frame::F129, Frame::F129,
		Frame::F129, Frame::F129, Frame::F130, Frame::F130, Frame::F130,
		Frame::F130, Frame::F131, Frame::F131, Frame::F131, Frame::F131,
		Frame::F132, Frame::F131, Frame::F132, Frame::F131, Frame::F132,
		Frame::F131, Frame::F132, Frame::F131,
	])
		.with_move_to(Position::new(-4, 3)),
];

/// # For `Animation::BathDiveChild`.
pub(super) const BATH_DIVE_CHILD: &[Scene] = &[
	Scene::new(30, &[Frame::M133])
		.with_repeat(171, 0)
		.with_flags(Scene::GRAVITY),
	Scene::new(30, &[
		Frame::M133, Frame::M133, Frame::M133, Frame::M133, Frame::M133,
		Frame::M133, Frame::M133, Frame::M133, Frame::M133, Frame::M133,
		Frame::M133, Frame::M133, Frame::F133, Frame::F133, Frame::F134,
		Frame::F134, Frame::F134, Frame::F133, Frame::F133, Frame::M133,
	])
		.with_repeat(70, 19)
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::Beg`.
pub(super) const BEG: &[Scene] = &[
	Scene::new(150, &[
		Frame::F008, Frame::F009, Frame::F050, Frame::F051, Frame::F050,
		Frame::F051, Frame::F050, Frame::F051, Frame::F031, Frame::F031,
		Frame::F031, Frame::F031, Frame::F031, Frame::F031, Frame::F009,
		Frame::F008,
	])
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::BigFish`.
pub(super) const BIG_FISH: &[Scene] = &[
	Scene::new(30, &[
		Frame::F005, Frame::F005, Frame::F005, Frame::F005, Frame::F004,
		Frame::F004, Frame::F004, Frame::F004, Frame::F004, Frame::F004,
	])
		.with_move_to(Position::new(-3, 0))
		.with_repeat(6, 0)
		.with_flags(Scene::GRAVITY),
	Scene::new(2000, &[Frame::None])
		.with_move_to(Position::new(-100, Frame::SIZE_I))
		.with_flags(Scene::IGNORE_EDGES),
	Scene::new(50, &[Frame::F027])
		.with_move_to(Position::new(-1, -6))
		.with_repeat(4, 0)
		.with_flags(Scene::IGNORE_EDGES),
	Scene::new(50, &[Frame::F021])
		.with_move_to(Position::new(0, -5))
		.with_repeat(1, 0)
		.with_flags(Scene::IGNORE_EDGES),
	Scene::new(100, &[
		Frame::F021, Frame::F021, Frame::F021,
		Frame::F073, Frame::F074, Frame::F003,
	])
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::BigFishChild`.
pub(super) const BIG_FISH_CHILD: &[Scene] = &[
	Scene::new(30, &[Frame::F054])
		.with_repeat(34, 0)
		.with_flags(Scene::IGNORE_EDGES),
	Scene::new(30, &[Frame::F054])
		.with_move_to(Position::new(-7, -3))
		.with_repeat(24, 0)
		.with_flags(Scene::IGNORE_EDGES),
	Scene::new(30, &[Frame::F055, Frame::F055, Frame::F054, Frame::F056, Frame::F057])
		.with_move_to(Position::new(-8, 0))
		.with_flags(Scene::IGNORE_EDGES),
	Scene::new(30, &[Frame::F057, Frame::F056, Frame::F057, Frame::F056, Frame::F057])
		.with_move_to(Position::new(-6, 3))
		.with_repeat(4, 0)
		.with_flags(Scene::IGNORE_EDGES),
];

/// # For `Animation::Bleat`.
pub(super) const BLEAT: &[Scene] = &[
	Scene::new(200, &[
		Frame::F003, Frame::F067, Frame::F068, Frame::F067,
		Frame::F068, Frame::F067, Frame::F003,
	])
		.with_sound(Sound::Baa, 1)
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::Blink`.
pub(super) const BLINK: &[Scene] = &[
	Scene::new(200, &[Frame::F008, Frame::F009])
		.with_flags(Scene::GRAVITY),
	Scene::new(150, &[
		Frame::F009, Frame::F009, Frame::F009, Frame::F009, Frame::F097,
		Frame::F098, Frame::F097, Frame::F009, Frame::F009, Frame::F009,
		Frame::F009, Frame::F009, Frame::F009, Frame::F009, Frame::F009,
		Frame::F009, Frame::F009, Frame::F009, Frame::F009, Frame::F009,
		Frame::F009, Frame::F009, Frame::F009,
	])
		.with_repeat(2, 0)
		.with_flags(Scene::GRAVITY),
	Scene::new(200, &[Frame::F009, Frame::F008])
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::Boing`.
pub(super) const BOING: &[Scene] = &[
	Scene::new(100, &[
		Frame::F058, Frame::F058, Frame::F059, Frame::F060, Frame::F061,
		Frame::F062, Frame::F063, Frame::F064, Frame::F065, Frame::F066,
		Frame::F003,
	])
		.with_move_to(Position::new(5, 0))
		.with_flags(Scene::EASE_OUT | Scene::GRAVITY),
];

/// # For `Animation::Bounce`.
pub(super) const BOUNCE: &[Scene] = &[
	Scene::new(100, &[Frame::F034, Frame::F045, Frame::F034])
		.with_flags(Scene::GRAVITY),
	Scene::new(100, &[Frame::F037, Frame::F034])
		.with_move_to(Position::new(0, -3)),
	Scene::new(100, &[Frame::F038]),
	Scene::new(100, &[Frame::F034, Frame::F045])
		.with_move_to(Position::new(0, 3)),
	Scene::new(100, &[
		Frame::F012, Frame::F011, Frame::F003, Frame::F008, Frame::F009,
		Frame::F009, Frame::F009, Frame::F009, Frame::F009, Frame::F009,
		Frame::F009, Frame::F009, Frame::F009, Frame::F009, Frame::F008,
		Frame::F003,
	])
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::ClimbDown`.
pub(super) const CLIMB_DOWN: &[Scene] = &[
	Scene::new(150, &[Frame::F017, Frame::F018])
		.with_move_to(Position::new(0, 2))
		.with_repeat(20, 0),
];

/// # For `Animation::ClimbUp`.
pub(super) const CLIMB_UP: &[Scene] = &[
	Scene::new(150, &[Frame::F014, Frame::F015])
		.with_move_to(Position::new(0, -2))
		.with_repeat(20, 0),
];

/// # For `Animation::Cry`.
pub(super) const CRY: &[Scene] = &[
	Scene::new(200, &[
		Frame::F080, Frame::F081, Frame::F080, Frame::F081,
		Frame::F080, Frame::F081, Frame::F080, Frame::F081,
	])
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::Dance`.
pub(super) const DANCE: &[Scene] = &[
	Scene::new(150, &[Frame::F069, Frame::F069, Frame::F072])
		.with_repeat(2, 0)
		.with_flags(Scene::FLIP_X_NEXT | Scene::GRAVITY),
	Scene::new(150, &[Frame::F069, Frame::F069, Frame::F072])
		.with_repeat(2, 0)
		.with_flags(Scene::FLIP_X_NEXT | Scene::GRAVITY),
	Scene::new(150, &[Frame::F069, Frame::F069, Frame::F072])
		.with_repeat(2, 0)
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::DangleFall`.
pub(super) const DANGLE_FALL: &[Scene] = &[
	Scene::new(100, &[Frame::F042, Frame::F043])
		.with_repeat(10, 0),
];

/// # For `Animation::DangleRecover`.
pub(super) const DANGLE_RECOVER: &[Scene] = &[
	Scene::new(200, &[Frame::F084, Frame::F085, Frame::F086])
		.with_move_to(Position::new(-5, 0))
		.with_repeat(1, 0),
	Scene::new(100, &[
		Frame::F040, Frame::F040, Frame::F040, Frame::F041,
		Frame::F009, Frame::F008, Frame::F003,
	]),
];

/// # For `Animation::DeepThoughts`.
pub(super) const DEEP_THOUGHTS: &[Scene] = &[
	Scene::new(50, &[
		Frame::F003, Frame::F003, Frame::F003,
		Frame::F003, Frame::F003, Frame::F069,
	])
		.with_repeat(15, 5),
	Scene::new(50, &[Frame::F046, Frame::F047])
		.with_repeat(12, 0),
	Scene::new(50, &[Frame::F003, Frame::F008, Frame::F009, Frame::F010])
		.with_flags(Scene::FLIP_X_NEXT),
];

/// # For `Animation::DigestMagicFlower1`.
pub(super) const DIGEST_MAGIC_FLOWER1: &[Scene] = &[PLAY_DEAD[0]];

/// # For `Animation::DigestMagicFlower2`.
pub(super) const DIGEST_MAGIC_FLOWER2: &[Scene] = &[PLAY_DEAD[1]];

/// # For `Animation::Drag`.
pub(super) const DRAG: &[Scene] = &[
	Scene::new(150, &[
		Frame::F034, Frame::F035, Frame::F035,
		Frame::F034, Frame::F036, Frame::F036,
	])
		.with_repeat(2, 0),
];

/// # For `Animation::Eat`.
pub(super) const EAT: &[Scene] = &[
	Scene::new(200, &[
		Frame::F003, Frame::F003, Frame::F003, Frame::F003, Frame::F054,
		Frame::F055, Frame::F055, Frame::F056, Frame::F057, Frame::F056,
		Frame::F057, Frame::F003,
	])
		.with_repeat(4, 5)
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::EatMagicFlower`.
pub(super) const EAT_MAGIC_FLOWER: &[Scene] = &[
	Scene::new(200, &[Frame::F003, Frame::F003, Frame::F003])
		.with_flags(Scene::GRAVITY),
	Scene::new(100, &[Frame::F002, Frame::F003])
		.with_move_to(Position::new(2, 0))
		.with_repeat(4, 0)
		.with_flags(Scene::GRAVITY | Scene::IGNORE_EDGES),
	SCRATCH[0],
	Scene::new(100, &[Frame::F002, Frame::F003])
		.with_move_to(Position::new(-2, 0))
		.with_repeat(4, 0)
		.with_flags(Scene::GRAVITY | Scene::IGNORE_EDGES),
	Scene::new(200, &[Frame::F003, Frame::F054])
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::EatingMagicFlower`.
pub(super) const EATING_MAGIC_FLOWER: &[Scene] = &[
	Scene::new(200, &[
		Frame::F055, Frame::F055, Frame::F056, Frame::F057,
		Frame::F056, Frame::F057, Frame::F003,
	])
		.with_repeat(4, 0)
		.with_flags(Scene::GRAVITY),
	Scene::new(200, &[
		Frame::F003, Frame::F003, Frame::F003, Frame::F006, Frame::F007,
		Frame::F003, Frame::F003, Frame::F003, Frame::F003, Frame::F003,
	])
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::EndRun`.
pub(super) const END_RUN: &[Scene] = &[
	Scene::new(75, &[
		Frame::F005, Frame::F002, Frame::F003,
		Frame::F005, Frame::F002, Frame::F003,
		Frame::F002, Frame::F003,
	])
		.with_move_to(Position::new(-4, 0))
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::Fall`.
pub(super) const FALL: &[Scene] = &[
	Scene::new(20, &[Frame::F039])
		.with_move_to(Position::new(0, 5))
		.with_repeat(49, 0)
		.with_flags(Scene::EASE_IN),
];

/// # For `Animation::Flower`.
pub(super) const FLOWER: &[Scene] = &[
	Scene::new(200, &[
		Frame::F135, Frame::F135, Frame::F135, Frame::F135, Frame::F135,
		Frame::F135, Frame::F135,

		Frame::F136, Frame::F136, Frame::F136, Frame::F136, Frame::F136,
		Frame::F136, Frame::F136,

		Frame::F137, Frame::F137, Frame::F137, Frame::F137, Frame::F137,
		Frame::F137, Frame::F137,

		Frame::F138, Frame::F138, Frame::F138, Frame::F138, Frame::F138,
		Frame::F138, Frame::F138,

		Frame::F139, Frame::F139, Frame::F139, Frame::F139, Frame::F139,
		Frame::F139, Frame::F139,
	])
		.with_flags(Scene::GRAVITY | Scene::IGNORE_EDGES),
];

/// # For `Animation::Gopher`.
pub(super) const GOPHER: &[Scene] = &[
	Scene::new(30, &[Frame::F009])
		.with_move_to(Position::new(0, -1))
		.with_repeat(24, 0)
		.with_flags(Scene::IGNORE_EDGES),
	Scene::new(1500, &[Frame::F009])
		.with_flags(Scene::IGNORE_EDGES),
	Scene::new(30, &[Frame::F009])
		.with_move_to(Position::new(0, 1))
		.with_repeat(24, 0)
		.with_flags(Scene::IGNORE_EDGES),
];

/// # For `Animation::GraspingFall`.
pub(super) const GRASPING_FALL: &[Scene] = &[
	Scene::new(15, &[
		Frame::F042, Frame::F042, Frame::F042, Frame::F042, Frame::F042,
		Frame::F042, Frame::F043, Frame::F043, Frame::F043, Frame::F043,
		Frame::F043, Frame::F043,
	])
		.with_move_to(Position::new(0, 7))
		.with_repeat(9, 0),
];

/// # For `Animation::Handstand`.
pub(super) const HANDSTAND: &[Scene] = &[
	Scene::new(200, &[
		Frame::F082, Frame::F083, Frame::F084, Frame::F085, Frame::F086,
		Frame::F084, Frame::F085, Frame::F086, Frame::F083, Frame::F082,
	])
		.with_move_to(Position::new(-2, 0))
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::Hop`.
pub(super) const HOP: &[Scene] = &[
	Scene::new(75, &[Frame::F002, Frame::F002, Frame::F004])
		.with_move_to(Position::new(-4, -2)),
	Scene::new(75, &[Frame::F004, Frame::F005, Frame::F005])
		.with_move_to(Position::new(-4, 2)),
];

/// # For `Animation::Hydroplane`.
pub(super) const HYDROPLANE: &[Scene] = &[
	Scene::new(30, &[
		Frame::F003, Frame::F003, Frame::F003, Frame::F003, Frame::F003,
		Frame::F003, Frame::F003, Frame::F003, Frame::F003, Frame::F003,
		Frame::F003, Frame::F003, Frame::F003, Frame::F003, Frame::F003,
		Frame::F003, Frame::F003, Frame::F003, Frame::F003, Frame::F003,
		Frame::F046, Frame::F046, Frame::F046, Frame::F046, Frame::F046,
		Frame::F047, Frame::F047, Frame::F047, Frame::F047, Frame::F047,
		Frame::F046, Frame::F046, Frame::F046, Frame::F046, Frame::F046,
		Frame::F047, Frame::F047, Frame::F047, Frame::F047, Frame::F047,
		Frame::F046, Frame::F046, Frame::F046, Frame::F046, Frame::F046,
		Frame::F047, Frame::F047, Frame::F047, Frame::F047, Frame::F047,
		Frame::F046, Frame::F046, Frame::F046, Frame::F046, Frame::F046,
		Frame::F047, Frame::F047, Frame::F047, Frame::F047, Frame::F047,
		Frame::F052, Frame::F052, Frame::F052, Frame::F052, Frame::F052,
		Frame::F052, Frame::F052, Frame::F053, Frame::F053, Frame::F053,
		Frame::F052, Frame::F052, Frame::F052, Frame::F052, Frame::F052,
	])
		.with_move_to(Position::new(-4, 0))
		.with_flags(Scene::GRAVITY),
	Scene::new(30, &[
		Frame::F052, Frame::F052, Frame::F052, Frame::F052, Frame::F052,
		Frame::F052, Frame::F052, Frame::F052, Frame::F052, Frame::F052,
	])
		.with_move_to(Position::new(-4, 0))
		.with_flags(Scene::EASE_OUT | Scene::GRAVITY),
	Scene::new(150, &[
		Frame::F073, Frame::F073, Frame::F052, Frame::F052, Frame::F052,
		Frame::F052,
	])
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::Jump`.
pub(super) const JUMP: &[Scene] = &[
	Scene::new(30, &[
		Frame::F072, Frame::F072, Frame::F027, Frame::F027, Frame::F027,
		Frame::F027, Frame::F027, Frame::F027, Frame::F021,
	])
		.with_move_to(Position::new(-6, -2)),
	Scene::new(30, &[
		Frame::F021, Frame::F021, Frame::F021, Frame::F022, Frame::F022,
		Frame::F022, Frame::F022, Frame::F073, Frame::F073,
	])
		.with_move_to(Position::new(-5, 2)),
];

/// # For `Animation::LayDown`.
pub(super) const LAY_DOWN: &[Scene] = &[
	Scene::new(200, &[Frame::F028, Frame::M021])
		.with_repeat(10, 1)
		.with_flags(Scene::GRAVITY),
	Scene::new(200, &[Frame::F021])
		.with_repeat(14, 0)
		.with_flags(Scene::GRAVITY),
	Scene::new(200, &[Frame::F076, Frame::M021, Frame::F003])
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::LegLifts`.
pub(super) const LEG_LIFTS: &[Scene] = &[
	Scene::new(125, &[
		Frame::F011,
		Frame::F012, Frame::F099, Frame::M100, Frame::F099,
		Frame::F012, Frame::F099, Frame::M100, Frame::F099,
	])
		.with_flags(Scene::FLIP_X_NEXT | Scene::GRAVITY),
	Scene::new(125, &[
		Frame::F012, Frame::F099, Frame::M100, Frame::F099,
		Frame::F012, Frame::F099, Frame::M100, Frame::F099,
	])
		.with_flags(Scene::FLIP_X_NEXT | Scene::GRAVITY),
	Scene::new(125, &[Frame::F012, Frame::F011])
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::LookDown`.
pub(super) const LOOK_DOWN: &[Scene] = &[
	Scene::new(100, &[
		Frame::F074, Frame::F074, Frame::F074, Frame::F074, Frame::F074,
		Frame::F075, Frame::F076, Frame::F075,
		Frame::F074, Frame::F074, Frame::F074, Frame::F074, Frame::F074,
	])
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::LookUp`.
pub(super) const LOOK_UP: &[Scene] = &[
	Scene::new(100, &[
		Frame::F069, Frame::F069, Frame::F069, Frame::F069, Frame::F069,
		Frame::F070, Frame::F071, Frame::F070,
		Frame::F069, Frame::F069, Frame::F069, Frame::F069, Frame::F069,
	])
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::MagicFlower1`.
pub(super) const MAGIC_FLOWER1: &[Scene] = &[
	Scene::new(200, &[Frame::F135, Frame::F135, Frame::F135])
		.with_flags(Scene::GRAVITY | Scene::IGNORE_EDGES),
	Scene::new(100, &[Frame::F135])
		.with_repeat(9, 0)
		.with_flags(Scene::GRAVITY | Scene::IGNORE_EDGES),
	Scene::new(150, &[Frame::F135])
		.with_repeat(7, 0)
		.with_flags(Scene::GRAVITY | Scene::IGNORE_EDGES),
	Scene::new(100, &[Frame::F135])
		.with_repeat(9, 0)
		.with_flags(Scene::GRAVITY | Scene::IGNORE_EDGES),
	Scene::new(200, &[Frame::F135, Frame::F135])
		.with_flags(Scene::GRAVITY | Scene::IGNORE_EDGES),
];

/// # For `Animation::MagicFlower2`.
pub(super) const MAGIC_FLOWER2: &[Scene] = &[
	Scene::new(200, &[
		Frame::F135, Frame::F135,

		Frame::F136, Frame::F136, Frame::F136, Frame::F136, Frame::F136,
		Frame::F136, Frame::F136,

		Frame::F137, Frame::F137, Frame::F137, Frame::F137, Frame::F137,
		Frame::F137, Frame::F137,

		Frame::F138, Frame::F138, Frame::F138, Frame::F138, Frame::F138,
		Frame::F138, Frame::F138,

		Frame::F139, Frame::F139, Frame::F139, Frame::F139, Frame::F139,
		Frame::F139, Frame::F139,
	])
		.with_flags(Scene::GRAVITY | Scene::IGNORE_EDGES),
];

/// # For `Animation::Nah`.
pub(super) const NAH: &[Scene] = &[
	Scene::new(150, &[
		Frame::F008, Frame::F003, Frame::F011, Frame::F003,
		Frame::F008, Frame::F003, Frame::F011, Frame::F003,
	])
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::PlayDead`.
pub(super) const PLAY_DEAD: &[Scene] = &[
	Scene::new(100, &[
		Frame::F003, Frame::F092, Frame::F092, Frame::F092, Frame::F092,
		Frame::F092, Frame::F092, Frame::F092, Frame::F092, Frame::F092,
		Frame::F092, Frame::F091,
	])
		.with_repeat(4, 11)
		.with_flags(Scene::GRAVITY),
	Scene::new(150, &[Frame::F087, Frame::F040, Frame::F009, Frame::F008])
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::Popcorn`.
pub(super) const POPCORN: &[Scene] = &[
	Scene::new(200, &[Frame::F008, Frame::F009, Frame::F031, Frame::F109])
		.with_repeat(4, 3)
		.with_flags(Scene::GRAVITY),
	Scene::new(50, &[Frame::F109])
		.with_move_to(Position::new(1, 0))
		.with_flags(Scene::GRAVITY),
	Scene::new(50, &[Frame::F109])
		.with_move_to(Position::new(-1, 0))
		.with_flags(Scene::GRAVITY),
	Scene::new(50, &[Frame::F109])
		.with_move_to(Position::new(1, 0))
		.with_flags(Scene::GRAVITY),
	Scene::new(50, &[Frame::F109])
		.with_move_to(Position::new(-1, 0))
		.with_flags(Scene::GRAVITY),
	Scene::new(50, &[Frame::F109])
		.with_move_to(Position::new(1, 0))
		.with_flags(Scene::GRAVITY),
	Scene::new(50, &[Frame::F109])
		.with_move_to(Position::new(-1, 0))
		.with_flags(Scene::GRAVITY),
	Scene::new(50, &[Frame::F109])
		.with_move_to(Position::new(1, 0))
		.with_flags(Scene::GRAVITY),
	Scene::new(50, &[Frame::F109])
		.with_move_to(Position::new(-1, 0))
		.with_flags(Scene::GRAVITY),
	Scene::new(50, &[Frame::F109])
		.with_move_to(Position::new(1, 0))
		.with_flags(Scene::GRAVITY),
	Scene::new(50, &[Frame::F109])
		.with_move_to(Position::new(-1, 0))
		.with_flags(Scene::GRAVITY),
	Scene::new(50, &[Frame::F109])
		.with_move_to(Position::new(1, 0))
		.with_flags(Scene::GRAVITY),
	Scene::new(50, &[Frame::F109])
		.with_move_to(Position::new(-1, 0))
		.with_flags(Scene::GRAVITY),
	Scene::new(50, &[Frame::F109])
		.with_move_to(Position::new(1, 0))
		.with_flags(Scene::GRAVITY),
	Scene::new(50, &[Frame::F109])
		.with_move_to(Position::new(-1, 0))
		.with_flags(Scene::GRAVITY),
	Scene::new(50, &[Frame::F109])
		.with_move_to(Position::new(1, 0))
		.with_flags(Scene::GRAVITY),
	Scene::new(50, &[Frame::F109])
		.with_move_to(Position::new(-1, 0))
		.with_flags(Scene::GRAVITY),
	Scene::new(50, &[Frame::F109])
		.with_move_to(Position::new(1, 0))
		.with_flags(Scene::GRAVITY),
	Scene::new(50, &[Frame::F109])
		.with_move_to(Position::new(-1, 0))
		.with_flags(Scene::GRAVITY),
	Scene::new(50, &[Frame::F109])
		.with_move_to(Position::new(1, 0))
		.with_flags(Scene::GRAVITY),
	Scene::new(50, &[Frame::F109])
		.with_move_to(Position::new(-1, 0))
		.with_flags(Scene::GRAVITY),
	Scene::new(25, &[
		Frame::F009, Frame::F009, Frame::F009, Frame::F009, Frame::F109,
		Frame::F109, Frame::F109, Frame::F109, Frame::F109, Frame::F109,
	])
		.with_move_to(Position::new(0, -10))
		.with_flags(Scene::EASE_OUT),
	Scene::new(25, &[
		Frame::F109, Frame::F109, Frame::F109, Frame::F109, Frame::F109,
		Frame::F109, Frame::F009, Frame::F009, Frame::F009, Frame::F009,
	])
		.with_move_to(Position::new(0, 10))
		.with_flags(Scene::EASE_IN),
	Scene::new(200, &[Frame::F109, Frame::F031, Frame::F009, Frame::F008])
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::ReachCeiling`.
pub(super) const REACH_CEILING: &[Scene] = &[
	Scene::new(100, &[Frame::F015, Frame::F016, Frame::F025])
		.with_move_to(Position::new(1, 0))
		.with_flags(Scene::FLIP_X_NEXT),
];

/// # For `Animation::ReachFloor`.
pub(super) const REACH_FLOOR: &[Scene] = &[
	Scene::new(150, &[
		Frame::F022, Frame::F003, Frame::F003,
		Frame::F003, Frame::F003, Frame::F003,
	])
];

/// # For `Animation::ReachSide1`.
pub(super) const REACH_SIDE1: &[Scene] = &[
	Scene::new(200, &[Frame::F028, Frame::F027])
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::ReachSide2`.
pub(super) const REACH_SIDE2: &[Scene] = &[
	Scene::new(200, &[Frame::F024])
		.with_flags(Scene::FLIP_X_NEXT),
];

/// # For `Animation::Really`.
pub(super) const REALLY: &[Scene] = &[
	Scene::new(100, &[Frame::F008, Frame::F009])
		.with_flags(Scene::GRAVITY),
	Scene::new(250, &[Frame::F009, Frame::F009, Frame::F009, Frame::F097])
		.with_repeat(15, 3)
		.with_flags(Scene::GRAVITY),
	Scene::new(250, &[
		Frame::F032, Frame::F032, Frame::F032, Frame::F032, Frame::F032,
		Frame::F032, Frame::F033, Frame::F032, Frame::F032, Frame::F032,
		Frame::F032, Frame::F032, Frame::F032, Frame::F032, Frame::F032,
		Frame::F032, Frame::F032, Frame::F032, Frame::F032, Frame::F032,
		Frame::F032, Frame::F032, Frame::F032, Frame::F032, Frame::F032,
		Frame::F032, Frame::F033, Frame::F032, Frame::F032, Frame::F032,
		Frame::F032, Frame::F032, Frame::F032, Frame::F032, Frame::F032,
	])
		.with_flags(Scene::GRAVITY),
	Scene::new(150, &[
		Frame::F097, Frame::F097, Frame::F097, Frame::F097, Frame::F008,
	])
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::Rest`.
pub(super) const REST: &[Scene] = &[
	Scene::new(200, &[Frame::F011, Frame::F088, Frame::F089])
		.with_repeat(20, 2)
		.with_flags(Scene::GRAVITY),
	Scene::new(2000, &[Frame::F090])
		.with_flags(Scene::GRAVITY),
	Scene::new(200, &[
		Frame::F089, Frame::F089, Frame::F089, Frame::F089,
		Frame::F088, Frame::F011,
	])
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::Roll`.
pub(super) const ROLL: &[Scene] = &[
	Scene::new(150, &[Frame::F008, Frame::F009, Frame::F009])
		.with_flags(Scene::GRAVITY),
	Scene::new(50, &[
		Frame::F009, Frame::F108, Frame::F107, Frame::F106,
		Frame::F105, Frame::F104, Frame::F103, Frame::F102,
	])
		.with_move_to(Position::new(-8, 0))
		.with_repeat(1, 0)
		.with_flags(Scene::GRAVITY),
	Scene::new(150, &[Frame::F009, Frame::F009, Frame::F008])
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::Rotate`.
pub(super) const ROTATE: &[Scene] = &[
	Scene::new(150, &[Frame::F003, Frame::F008, Frame::F009])
		.with_flags(Scene::FLIP_X_NEXT | Scene::GRAVITY),
	Scene::new(150, &[Frame::F008, Frame::F003])
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::Run`.
pub(super) const RUN: &[Scene] = &[
	Scene::new(30, &[
		Frame::F005, Frame::F005, Frame::F005, Frame::F004,
		Frame::F004, Frame::F004, Frame::F004, Frame::F004,
	])
		.with_move_to(Position::new(-4, 0))
		.with_repeat(5, 0)
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::RunDown`.
pub(super) const RUN_DOWN: &[Scene] = &[
	Scene::new(30, &[
		Frame::F020, Frame::F020, Frame::F020, Frame::F019,
		Frame::F019, Frame::F019, Frame::F019, Frame::F019,
	])
		.with_move_to(Position::new(0, 4))
		.with_repeat(5, 0),
];

/// # For `Animation::RunUpsideDown`.
pub(super) const RUN_UPSIDE_DOWN: &[Scene] = &[
	Scene::new(30, &[
		Frame::F095, Frame::F095, Frame::F095, Frame::F096,
		Frame::F096, Frame::F096, Frame::F096, Frame::F096,
	])
		.with_move_to(Position::new(-4, 0))
		.with_repeat(5, 0),
];

/// # For `Animation::Scoot`.
pub(super) const SCOOT: &[Scene] = &[
	Scene::new(200, &[Frame::F048])
		.with_flags(Scene::GRAVITY),
	Scene::new(200, &[Frame::F049])
		.with_move_to(Position::new(6, 0))
		.with_flags(Scene::GRAVITY),
	Scene::new(200, &[Frame::F048])
		.with_flags(Scene::GRAVITY),
	Scene::new(200, &[Frame::F049])
		.with_move_to(Position::new(6, 0))
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::Scratch`.
pub(super) const SCRATCH: &[Scene] = &[
	Scene::new(150, &[Frame::F052, Frame::F053])
		.with_repeat(3, 0)
		.with_flags(Scene::GRAVITY | Scene::IGNORE_EDGES),
];

/// # For `Animation::Scream`.
pub(super) const SCREAM: &[Scene] = &[
	DEEP_THOUGHTS[1].with_flags(Scene::GRAVITY),
];

/// # For `Animation::ShadowShowdown`.
pub(super) const SHADOW_SHOWDOWN: &[Scene] = &[
	Scene::new(100, &[Frame::F002, Frame::F003])
		.with_move_to(Position::new(-2, 0))
		.with_repeat(19, 0)
		.with_flags(Scene::GRAVITY | Scene::IGNORE_EDGES),
	Scene::new(100, &[
		Frame::F003, Frame::F003, Frame::F003, Frame::F003, Frame::F003,
		Frame::F003, Frame::F003, Frame::F003, Frame::F003, Frame::F003,
		Frame::F069, Frame::F069, Frame::F069, Frame::F069, Frame::F069,
		Frame::F070, Frame::F071, Frame::F070, Frame::F069, Frame::F069,
	])
		.with_flags(Scene::GRAVITY | Scene::IGNORE_EDGES),
	Scene::new(50, &[Frame::F003, Frame::F008, Frame::F009, Frame::F010])
		.with_flags(Scene::FLIP_X_NEXT | Scene::GRAVITY | Scene::IGNORE_EDGES),
	BLEAT[0],
];

/// # For `Animation::ShadowShowdownChild1`.
pub(super) const SHADOW_SHOWDOWN_CHILD1: &[Scene] = &[
	SHADOW_SHOWDOWN[0],
	SHADOW_SHOWDOWN[1],
	SHADOW_SHOWDOWN[2],
];

/// # For `Animation::ShadowShowdownChild2`.
pub(super) const SHADOW_SHOWDOWN_CHILD2: &[Scene] = &[
	Scene::new(400, &[Frame::F003])
		.with_flags(Scene::GRAVITY | Scene::IGNORE_EDGES),
	Scene::new(30, &[
		Frame::F005, Frame::F005, Frame::F005, Frame::F004,
		Frame::F004, Frame::F004, Frame::F004, Frame::F004,
	])
		.with_move_to(Position::new(-4, 0))
		.with_repeat(12, 0)
		.with_flags(Scene::GRAVITY | Scene::IGNORE_EDGES),
];

/// # For `Animation::Skip`.
pub(super) const SKIP: &[Scene] = &[
	Scene::new(60, &[Frame::F005, Frame::F005, Frame::F005])
		.with_move_to(Position::new(-4, -1)),
	Scene::new(60, &[Frame::F002, Frame::F002, Frame::F002])
		.with_move_to(Position::new(-4, 1)),
	Scene::new(60, &[Frame::F005, Frame::F005, Frame::F005])
		.with_move_to(Position::new(-4, -1)),
	Scene::new(60, &[Frame::F002, Frame::F002, Frame::F002])
		.with_move_to(Position::new(-4, 1)),
	Scene::new(60, &[Frame::F005, Frame::F005, Frame::F005])
		.with_move_to(Position::new(-4, -1)),
	Scene::new(60, &[Frame::F002, Frame::F002, Frame::F002])
		.with_move_to(Position::new(-4, 1)),
];

/// # For `Animation::Sleep`.
pub(super) const SLEEP: &[Scene] = &[
	Scene::new(300, &[Frame::F028, Frame::F029, Frame::F030])
		.with_flags(Scene::GRAVITY),
	Scene::new(600, &[Frame::F000, Frame::F001])
		.with_repeat(20, 0)
		.with_flags(Scene::GRAVITY),
	Scene::new(300, &[Frame::F076, Frame::F075, Frame::F074, Frame::F073, Frame::F003])
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::SleepSitting`.
pub(super) const SLEEP_SITTING: &[Scene] = &[
	Scene::new(200, &[
		Frame::F008, Frame::F009, Frame::F031, Frame::F032, Frame::F031,
		Frame::F032, Frame::F033
	])
		.with_repeat(45, 6)
		.with_flags(Scene::GRAVITY),
	Scene::new(200, &[
		Frame::F032, Frame::F033, Frame::F033, Frame::F032, Frame::F031,
		Frame::F031, Frame::F031, Frame::F009, Frame::F008,
	])
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::SleepStanding`.
pub(super) const SLEEP_STANDING: &[Scene] = &[
	Scene::new(200, &[
		Frame::F003, Frame::F003, Frame::F006,
		Frame::F003, Frame::F006, Frame::F007,
	])
		.with_repeat(45, 5)
		.with_flags(Scene::GRAVITY),
	Scene::new(200, &[
		Frame::F006, Frame::F007, Frame::F007, Frame::F006,
		Frame::F003, Frame::F003, Frame::F003,
	])
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::Slide`.
pub(super) const SLIDE: &[Scene] = &[
	Scene::new(100, &[
		Frame::F022, Frame::F021, Frame::F021, Frame::F021, Frame::F021,
		Frame::F021, Frame::F028, Frame::F003, Frame::F003, Frame::F003,
		Frame::F003,
	])
		.with_move_to(Position::new(-2, 0))
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::SlideDown`.
pub(super) const SLIDE_DOWN: &[Scene] = &[
	Scene::new(30, &[Frame::F023])
		.with_move_to(Position::new(0, 10))
		.with_repeat(25, 0),
];

/// # For `Animation::Sneeze`.
pub(super) const SNEEZE: &[Scene] = &[
	Scene::new(200, &[
		Frame::F078, Frame::F079, Frame::F080, Frame::F081,
		Frame::F080, Frame::F081, Frame::F080, Frame::F003,
	])
		.with_sound(Sound::Sneeze, 0)
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::SneezeShadow`.
pub(super) const SNEEZE_SHADOW: &[Scene] = &[
	Scene::new(100, &[Frame::None, Frame::None, Frame::F079])
		.with_move_to(Position::new(10, 0))
		.with_repeat(3, 2)
		.with_flags(Scene::GRAVITY | Scene::IGNORE_EDGES),
];

/// # For `Animation::Spin`.
pub(super) const SPIN: &[Scene] = &[
	Scene::new(100, &[
		Frame::F003, Frame::F008, Frame::F009, Frame::F010, Frame::F013,
		Frame::F012, Frame::F011, Frame::F006, Frame::F008, Frame::F097,
		Frame::F010, Frame::F013, Frame::F012, Frame::F011,
	])
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::Splat`.
pub(super) const SPLAT: &[Scene] = &[
	Scene::new(200, &[Frame::F044, Frame::F044, Frame::F044, Frame::F044, Frame::F043])
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::SplatGhost`.
pub(super) const SPLAT_GHOST: &[Scene] = &[
	Scene::new(50, &[
		Frame::F050, Frame::F050, Frame::F050, Frame::F050, Frame::F050,
		Frame::F051, Frame::F051, Frame::F051, Frame::F051, Frame::F051,
		Frame::F050, Frame::F050, Frame::F050, Frame::F050, Frame::F050,
		Frame::F051, Frame::F051,
	])
		.with_move_to(Position::new(0, -6))
		.with_flags(Scene::IGNORE_EDGES),
];

/// # For `Animation::Stargaze`.
pub(super) const STARGAZE: &[Scene] = &[
	Scene::new(50, &[Frame::F002, Frame::F003])
		.with_move_to(Position::new(-2, 0))
		.with_repeat(10, 0)
		.with_flags(Scene::GRAVITY),
	Scene::new(50, &[
		Frame::F003, Frame::F003, Frame::F003, Frame::F003, Frame::F003,
		Frame::F069, Frame::F069, Frame::F069, Frame::F069, Frame::F069,
		Frame::F070, Frame::F071, Frame::F071, Frame::F070, Frame::F069,
		Frame::F069, Frame::F069, Frame::F069, Frame::F069, Frame::F069,
		Frame::F069,
	])
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::StargazeChild`.
pub(super) const STARGAZE_CHILD: &[Scene] = &[
	Scene::new(52, &[Frame::F144])
		.with_repeat(20, 0)
		.with_flags(Scene::IGNORE_EDGES),
	Scene::new(6, &[Frame::F144, Frame::F145, Frame::F146, Frame::F147])
		.with_move_to(Position::new(5, -1))
		.with_repeat(40, 0)
		.with_flags(Scene::IGNORE_EDGES),
];

/// # For `Animation::Tornado`.
pub(super) const TORNADO: &[Scene] = &[
	Scene::new(150, &[Frame::F003, Frame::F008, Frame::F009])
		.with_flags(Scene::GRAVITY),
	Scene::new(100, &[Frame::F010, Frame::F013, Frame::F012, Frame::F011])
		.with_flags(Scene::GRAVITY),
	Scene::new(75, &[Frame::F003, Frame::F008, Frame::F009])
		.with_flags(Scene::GRAVITY),
	Scene::new(50, &[Frame::F010, Frame::F013, Frame::F012, Frame::F011])
		.with_flags(Scene::GRAVITY),
	Scene::new(25, &[
		Frame::F003, Frame::F008, Frame::F009, Frame::F010, Frame::F013,
		Frame::F012, Frame::F011,
	])
		.with_flags(Scene::GRAVITY),
	Scene::new(15, &[
		Frame::F003, Frame::F008, Frame::F009, Frame::F010, Frame::F013,
		Frame::F012, Frame::F011, Frame::F006, Frame::F008, Frame::F097,
		Frame::F010, Frame::F013, Frame::F012, Frame::F011,
	])
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::Urinate`.
pub(super) const URINATE: &[Scene] = &[
	Scene::new(150, &[
		Frame::F003, Frame::F011, Frame::F012, Frame::F099,
		Frame::M100, Frame::F100, Frame::F101,
	])
		.with_repeat(14, 5)
		.with_flags(Scene::GRAVITY),
	Scene::new(105, &[
		Frame::M100, Frame::F100, Frame::M100, Frame::M100,
		Frame::F099, Frame::F012, Frame::F011,
	])
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::Walk`.
pub(super) const WALK: &[Scene] = &[
	Scene::new(100, &[Frame::F002, Frame::F003])
		.with_move_to(Position::new(-2, 0))
		.with_repeat(41, 0)
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::WalkUpsideDown`.
pub(super) const WALK_UPSIDE_DOWN: &[Scene] = &[
	Scene::new(100, &[Frame::F094, Frame::F093])
		.with_move_to(Position::new(-2, 0))
		.with_repeat(83, 0),
];

/// # For `Animation::WallSlide`.
pub(super) const WALL_SLIDE: &[Scene] = &[
	Scene::new(40, &[Frame::F026])
		.with_move_to(Position::new(0, 5))
		.with_repeat(10, 0),
];

/// # For `Animation::Yawn`.
pub(super) const YAWN: &[Scene] = &[
	Scene::new(350, &[
		Frame::F003, Frame::F077, Frame::F078,
		Frame::F077, Frame::F078, Frame::F077,
	])
		.with_sound(Sound::Yawn, 1)
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::Yoyo`.
pub(super) const YOYO: &[Scene] = &[
	Scene::new(16, &[
		Frame::F109, Frame::F110, Frame::F111, Frame::F112,
		Frame::F113, Frame::F114, Frame::F115, Frame::F116,
	])
		.with_move_to(Position::new(0, 11))
		.with_repeat(5, 0)
		.with_flags(Scene::EASE_IN | Scene::IGNORE_EDGES),
	Scene::new(18, &[
		Frame::F102, Frame::F103, Frame::F104, Frame::F105,
		Frame::F106, Frame::F107, Frame::F108, Frame::F080,
	])
		.with_move_to(Position::new(0, -2)),
	Scene::new(18, &[
		Frame::F102, Frame::F103, Frame::F104, Frame::F105,
		Frame::F106, Frame::F107, Frame::F108, Frame::F080,
	])
		.with_move_to(Position::new(0, 2)),
	Scene::new(18, &[
		Frame::F102, Frame::F103, Frame::F104, Frame::F105,
		Frame::F106, Frame::F107, Frame::F108, Frame::F080,
	])
		.with_move_to(Position::new(0, -2)),
	Scene::new(16, &[
		Frame::F109, Frame::F110, Frame::F111, Frame::F112,
		Frame::F113, Frame::F114, Frame::F115, Frame::F116,
	])
		.with_move_to(Position::new(0, -11))
		.with_repeat(5, 0)
		.with_flags(Scene::EASE_OUT | Scene::IGNORE_EDGES),
];

/// # For `Animation::BlackSheepChase`.
pub(super) const fn black_sheep_chase(w: u16) -> SceneList {
	let repeat = (w + Frame::SIZE * 4).wrapping_div(32) + 1;

	SceneList::new(SceneListKind::Dynamic2([
		Scene::new(30, &[
			Frame::F005, Frame::F005, Frame::F005, Frame::F004,
			Frame::F004, Frame::F004, Frame::F004, Frame::F004,
		])
			.with_move_to(Position::new(-4, 0))
			.with_repeat(repeat, 0)
			.with_flags(Scene::FLIP_X_NEXT | Scene::GRAVITY | Scene::IGNORE_EDGES),
		Scene::new(30, &[
			Frame::F005, Frame::F005, Frame::F005, Frame::F004,
			Frame::F004, Frame::F004, Frame::F004, Frame::F004,
		])
			.with_move_to(Position::new(-4, 0))
			.with_repeat(3, 0)
			.with_flags(Scene::GRAVITY | Scene::IGNORE_EDGES),
	]))
}

/// # For `Animation::BlackSheepChaseChild`.
pub(super) const fn black_sheep_chase_child(w: u16) -> SceneList {
	let repeat = (w + Frame::SIZE * 2).wrapping_div(32) + 1;

	SceneList::new(SceneListKind::Dynamic1([
		Scene::new(30, &[
			Frame::F141, Frame::F141, Frame::F141, Frame::F140,
			Frame::F140, Frame::F140, Frame::F140, Frame::F140,
		])
			.with_move_to(Position::new(4, 0))
			.with_repeat(repeat, 0)
			.with_flags(Scene::GRAVITY | Scene::IGNORE_EDGES),
	]))
}

/// # For `Animation::BlackSheepRomance`.
pub(super) const fn black_sheep_romance(w: u16) -> SceneList {
	let (first, second) = scale_black_sheep_romance(w);

	SceneList::new(SceneListKind::Dynamic3([
		Scene::new(30, &[
			Frame::F005, Frame::F005, Frame::F005, Frame::F004,
			Frame::F004, Frame::F004, Frame::F004, Frame::F004,
		])
			.with_move_to(Position::new(-4, 0))
			.with_repeat(first, 0)
			.with_flags(Scene::GRAVITY),
		Scene::new(100, &[Frame::F002, Frame::F003])
			.with_move_to(Position::new(-3, 0))
			.with_repeat(second, 0)
			.with_flags(Scene::EASE_OUT | Scene::GRAVITY),
		Scene::new(250, &[
			Frame::F007, Frame::F007, Frame::F003, Frame::F003, Frame::F003,
			Frame::F117, Frame::F118, Frame::F118, Frame::F118, Frame::F119,
			Frame::F120, Frame::F119, Frame::F118, Frame::F118, Frame::F119,
			Frame::F120, Frame::F120, Frame::F120, Frame::F120, Frame::F119,
			Frame::F118, Frame::F117, Frame::F003, Frame::F003, Frame::F003,
		])
			.with_flags(Scene::GRAVITY),
	]))
}

/// # For `Animation::BlackSheepRomanceChild`.
pub(super) const fn black_sheep_romance_child(w: u16) -> SceneList {
	let (first, second) = scale_black_sheep_romance(w);

	SceneList::new(SceneListKind::Dynamic3([
		Scene::new(30, &[
			Frame::F141, Frame::F141, Frame::F141, Frame::F140,
			Frame::F140, Frame::F140, Frame::F140, Frame::F140,
		])
			.with_move_to(Position::new(4, 0))
			.with_repeat(first, 0)
			.with_flags(Scene::GRAVITY),
		Scene::new(100, &[Frame::F142, Frame::F143])
			.with_move_to(Position::new(3, 0))
			.with_repeat(second, 0)
			.with_flags(Scene::EASE_OUT | Scene::GRAVITY),
		Scene::new(4500, &[Frame::F143])
			.with_flags(Scene::GRAVITY),
	]))
}

/// # For `Animation::ChaseAMartian`.
pub(super) const fn chase_a_martian(w: u16) -> SceneList {
	let repeat =
		if w >= 64 { w.wrapping_div(64) }
		else { 1 };

	SceneList::new(SceneListKind::Dynamic1([
		Scene::new(30, &[
			Frame::F005, Frame::F005, Frame::F005, Frame::F004,
			Frame::F004, Frame::F004, Frame::F004, Frame::F004,
		])
			.with_move_to(Position::new(-4, 0))
			.with_repeat(repeat, 0)
			.with_flags(Scene::GRAVITY | Scene::IGNORE_EDGES)
	]))
}

/// # For `Animation::ChaseAMartianChild`.
pub(super) const fn chase_a_martian_child(w: u16) -> SceneList {
	let repeat = w.wrapping_div(48) + 4;

	SceneList::new(SceneListKind::Dynamic1([
		Scene::new(25, &[
			Frame::F152, Frame::F153, Frame::F152, Frame::F154,
			Frame::F152, Frame::F153, Frame::F152, Frame::F154,
		])
			.with_move_to(Position::new(-6, 0))
			.with_repeat(repeat, 0)
			.with_flags(Scene::GRAVITY | Scene::IGNORE_EDGES)
	]))
}

/// # For `Animation::TornadoExit`.
pub(super) const fn tornado_exit(w: u16) -> SceneList {
	let repeat = w.wrapping_div(14 * 8) + 1;

	SceneList::new(SceneListKind::Dynamic1([
		Scene::new(15, &[
			Frame::F003, Frame::F008, Frame::F009, Frame::F010, Frame::F013,
			Frame::F012, Frame::F011, Frame::F006, Frame::F008, Frame::F097,
			Frame::F010, Frame::F013, Frame::F012, Frame::F011,
		])
			.with_move_to(Position::new(-8, 0))
			.with_repeat(repeat, 0)
			.with_flags(Scene::EASE_IN | Scene::GRAVITY | Scene::IGNORE_EDGES),
	]))
}



/// # Black Sheep Romance Scales.
///
/// Both sides work the same way, just with reversed X movements.
const fn scale_black_sheep_romance(w: u16) -> (u16, u16) {
	// Half the screen width.
	let distance = w.wrapping_div(2);

	// The first movement has a rate of 10px by 3 frames, and should cover all
	// of the distance, minus one step.
	let first = distance.wrapping_div(32).saturating_sub(1);

	// The second movement has a rate of 3px by 2 frames, and should cover
	// whatever's left from the first, plus half a sprite.
	let second = (distance - first * 32 + Frame::SIZE.wrapping_div(2)).wrapping_div(6);

	(first.saturating_sub(1), second.saturating_sub(1))
}

