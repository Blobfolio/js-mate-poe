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


/// # Entrance Delay.
///
/// It can look weird if a sprite wanders offscreen on, say, the left, and
/// _imediately_ pops back up from the right. This slight delay softens the
/// transition a bit.
const ENTRANCE_DELAY: Scene = Scene::new(1000, &[Frame::None])
	.with_flags(Scene::IGNORE_EDGES);


/// # For `Animation::Abduction`.
pub(super) const ABDUCTION: &[Scene] = &[
	Scene::new(30, &[
		Frame::F081, Frame::F081, Frame::F081, Frame::F081, Frame::F081,
		Frame::F081, Frame::F081,

		Frame::F019, Frame::F019, Frame::F019, Frame::F019, Frame::F019,
		Frame::F019, Frame::F019, Frame::F019, Frame::F019, Frame::F019,
		Frame::F019, Frame::F019, Frame::F019,

		Frame::F038, Frame::F038, Frame::F038, Frame::F038,

		Frame::F038, Frame::F038, Frame::F038, Frame::F038, Frame::F038,
		Frame::F038, Frame::F038, Frame::F038, Frame::F038, Frame::F038,
		Frame::F038, Frame::F039, Frame::F039, Frame::F039, Frame::F040,
		Frame::F040, Frame::F040, Frame::F040, Frame::F038, Frame::F038,

		Frame::F038, Frame::F038, Frame::F038, Frame::F038, Frame::F038,
		Frame::F038, Frame::F038, Frame::F038, Frame::F038, Frame::F038,
		Frame::F038, Frame::F038, Frame::F038, Frame::F038, Frame::F038,
		Frame::F038, Frame::F038, Frame::F038, Frame::F038, Frame::F038,
	])
		.with_repeat(2, 24)
		.with_flags(Scene::GRAVITY),
	Scene::new(30, &[
		Frame::F038, Frame::F038, Frame::F038, Frame::F038, Frame::F038,
		Frame::F046, Frame::F046, Frame::F046, Frame::F046, Frame::F046,
	])
		.with_flags(Scene::GRAVITY),
	Scene::new(30, &[
		Frame::F075, Frame::F075, Frame::F075, Frame::F075,
		Frame::F076, Frame::F076, Frame::F076, Frame::F076,
		Frame::F094, Frame::F094, Frame::None, Frame::F094,

		Frame::F075, Frame::F075, Frame::None, Frame::None,
		Frame::F076, Frame::None, Frame::F076, Frame::F076,
		Frame::F094, Frame::F094, Frame::F094, Frame::F094,

		Frame::F075, Frame::None, Frame::None, Frame::None,
		Frame::F076, Frame::None, Frame::F076, Frame::None,
		Frame::F094, Frame::None, Frame::F094, Frame::None,
	])
		.with_move_to(Position::new(0, -1)),
	Scene::new(30, &[Frame::None])
		.with_repeat(220, 0),
];

/// # For `Animation::AbductionChild`.
pub(super) const ABDUCTION_CHILD: &[Scene] = &[
	Scene::new(30, &[Frame::F131, Frame::F132, Frame::F133, Frame::F134])
		.with_move_to(Position::new(0, 4))
		.with_repeat(29, 0)
		.with_flags(Scene::EASE_OUT | Scene::IGNORE_EDGES),
	Scene::new(30, &[
		Frame::F135, Frame::F135,
		Frame::F136, Frame::F136,
		Frame::F137, Frame::F137,
		Frame::F138, Frame::F138,
	])
		.with_repeat(14, 0)
		.with_flags(Scene::IGNORE_EDGES),
	Scene::new(30, &[Frame::F131, Frame::F132, Frame::F133, Frame::F134])
		.with_move_to(Position::new(0, -16))
		.with_repeat(29, 0)
		.with_flags(Scene::EASE_IN | Scene::IGNORE_EDGES),
];

/// # For `Animation::BathCoolDown`.
pub(super) const BATH_COOL_DOWN: &[Scene] = &[
	Scene::new(100, &[
		Frame::H038, Frame::H038, Frame::H038, Frame::H039,
		Frame::H040, Frame::H039, Frame::H038, Frame::H038,
	])
		.with_repeat(2, 0)
		.with_flags(Scene::GRAVITY),
	Scene::new(100, &[
		Frame::F105, Frame::F046, Frame::F046,
		Frame::F047, Frame::F047, Frame::F019,
	])
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::BathDive`.
pub(super) const BATH_DIVE: &[Scene] = &[
	ENTRANCE_DELAY,
	Scene::new(30, &[Frame::F108])
		.with_repeat(146, 0)
		.with_move_to(Position::new(-4, 3)),
	Scene::new(30, &[
		Frame::F109, Frame::F109, Frame::F109, Frame::F109, Frame::F110,
		Frame::F110, Frame::F110, Frame::F110, Frame::F111, Frame::F111,
		Frame::F111, Frame::F111, Frame::F112, Frame::F112, Frame::F112,
		Frame::F112, Frame::F113, Frame::F113, Frame::F113, Frame::F113,
		Frame::F114, Frame::F114, Frame::F114, Frame::F114, Frame::F115,
		Frame::F115, Frame::F115, Frame::F115, Frame::F116, Frame::F116,
		Frame::F116, Frame::F116, Frame::F117, Frame::F117, Frame::F117,
		Frame::F117, Frame::F118, Frame::F118, Frame::F118, Frame::F118,
		Frame::F119, Frame::F118, Frame::F119, Frame::F118, Frame::F119,
		Frame::F118, Frame::F119, Frame::F118,
	])
		.with_move_to(Position::new(-4, 3)),
];

/// # For `Animation::BathDiveChild`.
pub(super) const BATH_DIVE_CHILD: &[Scene] = &[
	ENTRANCE_DELAY,
	Scene::new(30, &[Frame::M120])
		.with_repeat(171, 0)
		.with_flags(Scene::GRAVITY),
	Scene::new(30, &[
		Frame::M120, Frame::M120, Frame::M120, Frame::M120, Frame::M120,
		Frame::M120, Frame::M120, Frame::M120, Frame::M120, Frame::M120,
		Frame::M120, Frame::M120, Frame::F120, Frame::F120, Frame::F121,
		Frame::F121, Frame::F121, Frame::F120, Frame::F120, Frame::M120,
	])
		.with_repeat(70, 19)
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::BeamIn`.
pub(super) const BEAM_IN: &[Scene] = &[
	ENTRANCE_DELAY,
	Scene::new(3000, &[Frame::F059])
		.with_flags(Scene::GRAVITY),
	Scene::new(75, &[
		Frame::F059, Frame::F058, Frame::F057, Frame::F058, Frame::F059,
		Frame::F058, Frame::F057, Frame::F058, Frame::F059, Frame::F058,
		Frame::F057, Frame::F058, Frame::F059, Frame::F058, Frame::F057,
		Frame::F057, Frame::F057, Frame::F057, Frame::F057, Frame::F057,
		Frame::F003, Frame::F003, Frame::F068, Frame::F068, Frame::F068,
		Frame::F068, Frame::F068, Frame::F068, Frame::F068, Frame::F068,
		Frame::F003, Frame::F003, Frame::F057, Frame::F057, Frame::F057,
		Frame::F057, Frame::F057, Frame::F057, Frame::F057, Frame::F057,
		Frame::F057, Frame::F003, Frame::F003, Frame::F003, Frame::F003,
		Frame::F003, Frame::F003, Frame::F003, Frame::F003, Frame::F003,
		Frame::F003, Frame::F003, Frame::F003, Frame::F003, Frame::F003,
	])
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::Beg`.
pub(super) const BEG: &[Scene] = &[
	Scene::new(150, &[
		Frame::F081, Frame::F019, Frame::F087, Frame::F088, Frame::F087,
		Frame::F088, Frame::F087, Frame::F088, Frame::F038, Frame::F038,
		Frame::F038, Frame::F038, Frame::F038, Frame::F038, Frame::F019,
		Frame::F081,
	])
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::BigFish`.
pub(super) const BIG_FISH: &[Scene] = &[
	ENTRANCE_DELAY,
	Scene::new(30, &[
		Frame::F017, Frame::F017, Frame::F017, Frame::F017, Frame::F016,
		Frame::F016, Frame::F016, Frame::F016, Frame::F016, Frame::F016,
	])
		.with_move_to(Position::new(-3, 0))
		.with_repeat(6, 0)
		.with_flags(Scene::GRAVITY),
	Scene::new(2000, &[Frame::None])
		.with_move_to(Position::new(-100, Frame::SIZE_I))
		.with_flags(Scene::IGNORE_EDGES),
	FLOAT_IN[0],
	FLOAT_IN[1],
	FLOAT_IN[2],
];

/// # For `Animation::BigFishChild`.
pub(super) const BIG_FISH_CHILD: &[Scene] = &[
	ENTRANCE_DELAY,
	Scene::new(30, &[Frame::F013])
		.with_repeat(34, 0)
		.with_flags(Scene::IGNORE_EDGES),
	Scene::new(30, &[Frame::F013])
		.with_move_to(Position::new(-7, -3))
		.with_repeat(24, 0)
		.with_flags(Scene::IGNORE_EDGES),
	Scene::new(30, &[Frame::F054, Frame::F054, Frame::F013, Frame::F014, Frame::F015])
		.with_move_to(Position::new(-8, 0))
		.with_flags(Scene::IGNORE_EDGES),
	Scene::new(30, &[Frame::F015, Frame::F014, Frame::F015, Frame::F014, Frame::F015])
		.with_move_to(Position::new(-6, 3))
		.with_repeat(4, 0)
		.with_flags(Scene::IGNORE_EDGES),
];

/// # For `Animation::BlackSheepCatch`.
pub(super) const BLACK_SHEEP_CATCH: &[Scene] = &[
	ENTRANCE_DELAY,
	Scene::new(60, &[Frame::None])
		.with_repeat(17, 0)
		.with_flags(Scene::GRAVITY | Scene::IGNORE_EDGES),
	JUMP[0],
	JUMP[1],
	SLIDE[0],
	Scene::new(100, &[Frame::F083, Frame::F010])
		.with_flags(Scene::GRAVITY),
	// Rotate (slightly faster than usual).
	Scene::new(100, &[Frame::F003, Frame::F081, Frame::F019])
		.with_flags(Scene::FLIP_X_NEXT | Scene::GRAVITY),
	Scene::new(100, &[Frame::F081, Frame::F003])
		.with_flags(Scene::GRAVITY),
	LOOK_DOWN[0],
	// Rotate (slightly faster than usual).
	Scene::new(100, &[Frame::F003, Frame::F081, Frame::F019])
		.with_flags(Scene::FLIP_X_NEXT | Scene::GRAVITY),
	Scene::new(100, &[Frame::F081, Frame::F003])
		.with_flags(Scene::GRAVITY),
	LOOK_DOWN[0],
	// Trigger orientation reset since this animation is flipped.
	Scene::new(250, &[Frame::F003])
		.with_flags(Scene::FLIP_X_NEXT | Scene::GRAVITY),
];

/// # For `Animation::BlackSheepCatchChild`.
pub(super) const BLACK_SHEEP_CATCH_CHILD: &[Scene] = &[
	ENTRANCE_DELAY,
	Scene::new(60, &[Frame::F128, Frame::F128, Frame::F128])
		.with_move_to(Position::new(4, -1))
		.with_flags(Scene::IGNORE_EDGES),
	Scene::new(60, &[Frame::F129, Frame::F129, Frame::F129])
		.with_move_to(Position::new(4, 1))
		.with_flags(Scene::IGNORE_EDGES),
	Scene::new(60, &[Frame::F128, Frame::F128, Frame::F128])
		.with_move_to(Position::new(4, -1))
		.with_flags(Scene::IGNORE_EDGES),
	Scene::new(60, &[Frame::F129, Frame::F129, Frame::F129])
		.with_move_to(Position::new(4, 1))
		.with_flags(Scene::IGNORE_EDGES),
	Scene::new(60, &[Frame::F128, Frame::F128, Frame::F128])
		.with_move_to(Position::new(4, -1))
		.with_flags(Scene::IGNORE_EDGES),
	Scene::new(60, &[Frame::F129, Frame::F129, Frame::F129])
		.with_move_to(Position::new(4, 1))
		.with_flags(Scene::IGNORE_EDGES),
	Scene::new(60, &[Frame::F128, Frame::F128, Frame::F128])
		.with_move_to(Position::new(4, -1))
		.with_flags(Scene::IGNORE_EDGES),
	Scene::new(60, &[Frame::F129, Frame::F129, Frame::F129])
		.with_move_to(Position::new(4, 1))
		.with_flags(Scene::IGNORE_EDGES),
];

/// # For `Animation::BlackSheepCatchExitChild`.
pub(super) const BLACK_SHEEP_CATCH_EXIT_CHILD: &[Scene] = &[
	Scene::new(1000, &[Frame::F130, Frame::F130, Frame::F130, Frame::None])
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::BlackSheepCatchFail`.
pub(super) const BLACK_SHEEP_CATCH_FAIL: &[Scene] = &[
	ENTRANCE_DELAY,
	Scene::new(60, &[Frame::None])
		.with_repeat(20, 0)
		.with_flags(Scene::GRAVITY | Scene::IGNORE_EDGES),
	JUMP[0],
	JUMP[1],
	SLIDE[0],
	Scene::new(100, &[Frame::F083, Frame::F010])
		.with_flags(Scene::GRAVITY),
	Scene::new(100, &[Frame::F002, Frame::F003])
		.with_move_to(Position::new(-2, 0))
		.with_repeat(5, 0)
		.with_flags(Scene::GRAVITY),
	Scene::new(200, &[
		Frame::F010, Frame::F010, Frame::F010, Frame::F010, Frame::F010,
		Frame::F010, Frame::F010, Frame::F011, Frame::F012, Frame::F011,
		Frame::F010, Frame::F010, Frame::F010, Frame::F010, Frame::F010,
		Frame::F010, Frame::F010, Frame::F010, Frame::F010, Frame::F010,
	])
		.with_flags(Scene::FLIP_X_NEXT | Scene::GRAVITY),
];

/// # For `Animation::BlackSheepCatchFailChild`.
pub(super) const BLACK_SHEEP_CATCH_FAIL_CHILD: &[Scene] = &[
	ENTRANCE_DELAY,
	Scene::new(60, &[Frame::F128, Frame::F128, Frame::F128])
		.with_move_to(Position::new(4, -1))
		.with_flags(Scene::IGNORE_EDGES),
	Scene::new(60, &[Frame::F129, Frame::F129, Frame::F129])
		.with_move_to(Position::new(4, 1))
		.with_flags(Scene::IGNORE_EDGES),
	Scene::new(60, &[Frame::F128, Frame::F128, Frame::F128])
		.with_move_to(Position::new(4, -1))
		.with_flags(Scene::IGNORE_EDGES),
	Scene::new(60, &[Frame::F129, Frame::F129, Frame::F129])
		.with_move_to(Position::new(4, 1))
		.with_flags(Scene::IGNORE_EDGES),
	Scene::new(60, &[Frame::F128, Frame::F128, Frame::F128])
		.with_move_to(Position::new(4, -1))
		.with_flags(Scene::IGNORE_EDGES),
	Scene::new(60, &[Frame::F129, Frame::F129, Frame::F129])
		.with_move_to(Position::new(4, 1))
		.with_flags(Scene::IGNORE_EDGES),
	Scene::new(60, &[Frame::F128, Frame::F128, Frame::F128])
		.with_move_to(Position::new(4, -1))
		.with_flags(Scene::IGNORE_EDGES),
	Scene::new(60, &[Frame::F129, Frame::F129, Frame::F129])
		.with_move_to(Position::new(4, 1))
		.with_flags(Scene::IGNORE_EDGES),
];

/// # For `Animation::Bleat`.
pub(super) const BLEAT: &[Scene] = &[
	Scene::new(200, &[
		Frame::F003, Frame::F055, Frame::F056, Frame::F055,
		Frame::F056, Frame::F055, Frame::F003,
	])
		.with_sound(Sound::Baa, 1)
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::Blink`.
pub(super) const BLINK: &[Scene] = &[
	Scene::new(200, &[Frame::F081, Frame::F019])
		.with_flags(Scene::GRAVITY),
	Scene::new(150, &[
		Frame::F019, Frame::F019, Frame::F019, Frame::F019, Frame::F020,
		Frame::F021, Frame::F020, Frame::F019, Frame::F019, Frame::F019,
		Frame::F019, Frame::F019, Frame::F019, Frame::F019, Frame::F019,
		Frame::F019, Frame::F019, Frame::F019, Frame::F019, Frame::F019,
		Frame::F019, Frame::F019, Frame::F019,
	])
		.with_repeat(2, 0)
		.with_flags(Scene::GRAVITY),
	Scene::new(200, &[Frame::F019, Frame::F081])
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::Boing`.
pub(super) const BOING: &[Scene] = &[
	Scene::new(100, &[
		Frame::F089, Frame::F089, Frame::F035, Frame::F090, Frame::F062,
		Frame::F091, Frame::F064, Frame::F033, Frame::F066, Frame::F018,
		Frame::F003,
	])
		.with_move_to(Position::new(5, 0))
		.with_flags(Scene::EASE_OUT | Scene::GRAVITY),
];

/// # For `Animation::Bounce`.
pub(super) const BOUNCE: &[Scene] = &[
	Scene::new(100, &[Frame::F041, Frame::F086, Frame::F041])
		.with_flags(Scene::GRAVITY),
	Scene::new(100, &[Frame::F043, Frame::F041])
		.with_move_to(Position::new(0, -3)),
	Scene::new(100, &[Frame::R043]),
	Scene::new(100, &[Frame::F041, Frame::F086])
		.with_move_to(Position::new(0, 3)),
	Scene::new(100, &[
		Frame::F022, Frame::F082, Frame::F003, Frame::F081, Frame::F019,
		Frame::F019, Frame::F019, Frame::F019, Frame::F019, Frame::F019,
		Frame::F019, Frame::F019, Frame::F019, Frame::F019, Frame::F081,
		Frame::F003,
	])
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::ClimbDown`.
pub(super) const CLIMB_DOWN: &[Scene] = &[
	Scene::new(75, &[Frame::F029, Frame::F030])
		.with_move_to(Position::new(0, 2))
		.with_repeat(20, 0),
];

/// # For `Animation::ClimbIn`.
pub(super) const CLIMB_IN: &[Scene] = &[
	ENTRANCE_DELAY,
	Scene::new(150, &[Frame::F026, Frame::F027])
		.with_move_to(Position::new(0, -2))
		.with_repeat(9, 0)
		.with_flags(Scene::IGNORE_EDGES),
	Scene::new(150, &[Frame::F034, Frame::F010])
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::ClimbUp`.
pub(super) const CLIMB_UP: &[Scene] = &[
	Scene::new(150, &[Frame::F026, Frame::F027])
		.with_move_to(Position::new(0, -2))
		.with_repeat(20, 0),
];

/// # For `Animation::Cry`.
pub(super) const CRY: &[Scene] = &[
	Scene::new(200, &[
		Frame::F071, Frame::F072, Frame::F071, Frame::F072,
		Frame::F071, Frame::F072, Frame::F071, Frame::F072,
	])
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::Dance`.
pub(super) const DANCE: &[Scene] = &[
	Scene::new(150, &[Frame::F057, Frame::F057, Frame::F092])
		.with_repeat(2, 0)
		.with_flags(Scene::FLIP_X_NEXT | Scene::GRAVITY),
	Scene::new(150, &[Frame::F057, Frame::F057, Frame::F092])
		.with_repeat(2, 0)
		.with_flags(Scene::FLIP_X_NEXT | Scene::GRAVITY),
	Scene::new(150, &[Frame::F057, Frame::F057, Frame::F092])
		.with_repeat(2, 0)
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::DangleFall`.
pub(super) const DANGLE_FALL: &[Scene] = &[
	Scene::new(100, &[Frame::F048, Frame::F049])
		.with_repeat(10, 0),
];

/// # For `Animation::DangleRecover`.
pub(super) const DANGLE_RECOVER: &[Scene] = &[
	Scene::new(200, &[Frame::F075, Frame::F076, Frame::F094])
		.with_move_to(Position::new(-5, 0))
		.with_repeat(1, 0),
	Scene::new(100, &[
		Frame::F046, Frame::F046, Frame::F046, Frame::F047,
		Frame::F019, Frame::F081,
	]),
];

/// # For `Animation::DigestMagicFlower1`.
pub(super) const DIGEST_MAGIC_FLOWER1: &[Scene] = &[PLAY_DEAD[0]];

/// # For `Animation::DigestMagicFlower2`.
pub(super) const DIGEST_MAGIC_FLOWER2: &[Scene] = &[PLAY_DEAD[1]];

/// # For `Animation::Drag`.
pub(super) const DRAG: &[Scene] = &[
	Scene::new(150, &[
		Frame::F041, Frame::F042, Frame::F042,
		Frame::F041, Frame::F044, Frame::F044,
	])
		.with_repeat(2, 0),
];

/// # For `Animation::Eat`.
pub(super) const EAT: &[Scene] = &[
	Scene::new(200, &[
		Frame::F003, Frame::F003, Frame::F003, Frame::F003, Frame::F013,
		Frame::F054, Frame::F054, Frame::F014, Frame::F015, Frame::F014,
		Frame::F015, Frame::F003,
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
	Scene::new(200, &[Frame::F003, Frame::F013])
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::EatingMagicFlower`.
pub(super) const EATING_MAGIC_FLOWER: &[Scene] = &[
	Scene::new(200, &[
		Frame::F054, Frame::F054, Frame::F014, Frame::F015,
		Frame::F014, Frame::F015, Frame::F003,
	])
		.with_repeat(4, 0)
		.with_flags(Scene::GRAVITY),
	Scene::new(200, &[
		Frame::F003, Frame::F003, Frame::F003, Frame::F004, Frame::F005,
		Frame::F003, Frame::F003, Frame::F003, Frame::F003, Frame::F003,
	])
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::EndRun`.
pub(super) const END_RUN: &[Scene] = &[
	Scene::new(75, &[
		Frame::F017, Frame::F002, Frame::F003,
		Frame::F017, Frame::F002, Frame::F003,
		Frame::F002, Frame::F003,
	])
		.with_move_to(Position::new(-4, 0))
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::Fall`.
pub(super) const FALL: &[Scene] = &[
	Scene::new(20, &[Frame::F045])
		.with_move_to(Position::new(0, 5))
		.with_repeat(49, 0)
		.with_flags(Scene::EASE_IN),
];

/// # For `Animation::FloatIn`.
pub(super) const FLOAT_IN: &[Scene] = &[
	ENTRANCE_DELAY,
	Scene::new(50, &[Frame::F034])
		.with_move_to(Position::new(-1, -6))
		.with_repeat(4, 0)
		.with_flags(Scene::IGNORE_EDGES),
	Scene::new(50, &[Frame::F083])
		.with_move_to(Position::new(0, -5))
		.with_repeat(1, 0)
		.with_flags(Scene::IGNORE_EDGES),
	Scene::new(100, &[
		Frame::F083, Frame::F083, Frame::F083,
		Frame::F067, Frame::F068, Frame::F003,
	])
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::Flower`.
pub(super) const FLOWER: &[Scene] = &[
	Scene::new(200, &[
		Frame::F122, Frame::F122, Frame::F122, Frame::F122, Frame::F122,
		Frame::F122, Frame::F122,

		Frame::F123, Frame::F123, Frame::F123, Frame::F123, Frame::F123,
		Frame::F123, Frame::F123,

		Frame::F124, Frame::F124, Frame::F124, Frame::F124, Frame::F124,
		Frame::F124, Frame::F124,

		Frame::F125, Frame::F125, Frame::F125, Frame::F125, Frame::F125,
		Frame::F125, Frame::F125,

		Frame::F126, Frame::F126, Frame::F126, Frame::F126, Frame::F126,
		Frame::F126, Frame::F126,
	])
		.with_flags(Scene::GRAVITY | Scene::IGNORE_EDGES),
];

/// # For `Animation::Glitch`.
pub(super) const GLITCH: &[Scene] = &[
	Scene::new(60, &[
		Frame::F079, Frame::F035, Frame::F003,
		Frame::F117, Frame::F026, Frame::F105,
	])
		.with_repeat(2, 0)
		.with_flags(Scene::GRAVITY),
	Scene::new(150, &[
		Frame::F066, Frame::F066, Frame::F066, Frame::F066, Frame::F066,
		Frame::F067, Frame::F067, Frame::F067, Frame::F067, Frame::F068,
		Frame::F003, Frame::F003, Frame::F004, Frame::F005, Frame::F004,
		Frame::F003, Frame::F003, Frame::F003, Frame::F003, Frame::F003,
	])
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::Gopher`.
pub(super) const GOPHER: &[Scene] = &[
	ENTRANCE_DELAY,
	Scene::new(30, &[Frame::F019])
		.with_move_to(Position::new(0, -1))
		.with_repeat(24, 0)
		.with_flags(Scene::IGNORE_EDGES),
	Scene::new(1500, &[Frame::F019])
		.with_flags(Scene::IGNORE_EDGES),
	Scene::new(30, &[Frame::F019])
		.with_move_to(Position::new(0, 1))
		.with_repeat(24, 0)
		.with_flags(Scene::IGNORE_EDGES),
];

/// # For `Animation::GraspingFall`.
pub(super) const GRASPING_FALL: &[Scene] = &[
	Scene::new(15, &[
		Frame::F048, Frame::F048, Frame::F048, Frame::F048, Frame::F048,
		Frame::F048, Frame::F049, Frame::F049, Frame::F049, Frame::F049,
		Frame::F049, Frame::F049,
	])
		.with_move_to(Position::new(0, 7))
		.with_repeat(9, 0),
];

/// # For `Animation::Handstand`.
pub(super) const HANDSTAND: &[Scene] = &[
	Scene::new(200, &[
		Frame::F073, Frame::F074, Frame::F075, Frame::F076, Frame::F094,
		Frame::F075, Frame::F076, Frame::F094, Frame::F074, Frame::F073,
	])
		.with_move_to(Position::new(-2, 0))
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::Hop`.
pub(super) const HOP: &[Scene] = &[
	Scene::new(75, &[Frame::F002, Frame::F002, Frame::F016])
		.with_move_to(Position::new(-4, -2)),
	Scene::new(75, &[Frame::F016, Frame::F017, Frame::F017])
		.with_move_to(Position::new(-4, 2)),
];

/// # For `Animation::Hydroplane`.
pub(super) const HYDROPLANE: &[Scene] = &[
	Scene::new(30, &[
		Frame::F003, Frame::F003, Frame::F003, Frame::F003, Frame::F003,
		Frame::F003, Frame::F003, Frame::F003, Frame::F003, Frame::F003,
		Frame::F003, Frame::F003, Frame::F003, Frame::F003, Frame::F003,
		Frame::F003, Frame::F003, Frame::F003, Frame::F003, Frame::F003,
		Frame::F050, Frame::F050, Frame::F050, Frame::F050, Frame::F050,
		Frame::F051, Frame::F051, Frame::F051, Frame::F051, Frame::F051,
		Frame::F050, Frame::F050, Frame::F050, Frame::F050, Frame::F050,
		Frame::F051, Frame::F051, Frame::F051, Frame::F051, Frame::F051,
		Frame::F050, Frame::F050, Frame::F050, Frame::F050, Frame::F050,
		Frame::F051, Frame::F051, Frame::F051, Frame::F051, Frame::F051,
		Frame::F050, Frame::F050, Frame::F050, Frame::F050, Frame::F050,
		Frame::F051, Frame::F051, Frame::F051, Frame::F051, Frame::F051,
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
		Frame::F067, Frame::F067, Frame::F052, Frame::F052, Frame::F052,
		Frame::F052,
	])
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::Jump`.
pub(super) const JUMP: &[Scene] = &[
	Scene::new(30, &[
		Frame::F092, Frame::F092, Frame::F034, Frame::F034, Frame::F034,
		Frame::F034, Frame::F034, Frame::F034, Frame::F083,
	])
		.with_move_to(Position::new(-6, -2)),
	Scene::new(30, &[
		Frame::F083, Frame::F083, Frame::F083, Frame::F084, Frame::F084,
		Frame::F084, Frame::F084, Frame::F067, Frame::F067,
	])
		.with_move_to(Position::new(-5, 2)),
];

/// # For `Animation::JumpIn`.
pub(super) const JUMP_IN: &[Scene] = &[
	Scene::new(30, &[
		Frame::F084, Frame::F084, Frame::F084, Frame::F084, Frame::F084,
		Frame::F084, Frame::F084, Frame::F084, Frame::F084, Frame::F084,
	])
		.with_move_to(Position::new(-7, 5)),
];

/// # For `Animation::JumpInLanding`.
pub(super) const JUMP_IN_LANDING: &[Scene] = &[
	Scene::new(30, &[
		Frame::F067, Frame::F033, Frame::F064,
		Frame::F091, Frame::F062, Frame::F090, Frame::F092,
	])
		.with_move_to(Position::new(-7, 0))
		.with_flags(Scene::GRAVITY),
	Scene::new(30, &[
		Frame::F067, Frame::F033, Frame::F064,
		Frame::F091, Frame::F062, Frame::F090, Frame::F092,
	])
		.with_move_to(Position::new(-6, 0))
		.with_flags(Scene::GRAVITY),
	Scene::new(30, &[
		Frame::F067, Frame::F033, Frame::F064,
		Frame::F091, Frame::F062, Frame::F090, Frame::F092,
	])
		.with_move_to(Position::new(-5, 0))
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::LayDown`.
pub(super) const LAY_DOWN: &[Scene] = &[
	Scene::new(200, &[Frame::F010, Frame::M083])
		.with_repeat(10, 1)
		.with_flags(Scene::GRAVITY),
	Scene::new(200, &[Frame::F083])
		.with_repeat(14, 0)
		.with_flags(Scene::GRAVITY),
	Scene::new(200, &[Frame::F070, Frame::M083, Frame::F003])
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::LegLifts`.
pub(super) const LEG_LIFTS: &[Scene] = &[
	Scene::new(125, &[
		Frame::F082,
		Frame::F022, Frame::F023, Frame::M024, Frame::F023,
		Frame::F022, Frame::F023, Frame::M024, Frame::F023,
	])
		.with_flags(Scene::FLIP_X_NEXT | Scene::GRAVITY),
	Scene::new(125, &[
		Frame::F022, Frame::F023, Frame::M024, Frame::F023,
		Frame::F022, Frame::F023, Frame::M024, Frame::F023,
	])
		.with_flags(Scene::FLIP_X_NEXT | Scene::GRAVITY),
	Scene::new(125, &[Frame::F022, Frame::F082])
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::LookDown`.
pub(super) const LOOK_DOWN: &[Scene] = &[
	Scene::new(100, &[
		Frame::F068, Frame::F068, Frame::F068, Frame::F068, Frame::F068,
		Frame::F069, Frame::F070, Frame::F069,
		Frame::F068, Frame::F068, Frame::F068, Frame::F068, Frame::F068,
	])
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::LookUp`.
pub(super) const LOOK_UP: &[Scene] = &[
	Scene::new(100, &[
		Frame::F057, Frame::F057, Frame::F057, Frame::F057, Frame::F057,
		Frame::F058, Frame::F059, Frame::F058,
		Frame::F057, Frame::F057, Frame::F057, Frame::F057, Frame::F057,
	])
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::MagicFlower1`.
pub(super) const MAGIC_FLOWER1: &[Scene] = &[
	Scene::new(200, &[Frame::F122, Frame::F122, Frame::F122])
		.with_flags(Scene::GRAVITY | Scene::IGNORE_EDGES),
	Scene::new(100, &[Frame::F122])
		.with_repeat(9, 0)
		.with_flags(Scene::GRAVITY | Scene::IGNORE_EDGES),
	Scene::new(150, &[Frame::F122])
		.with_repeat(7, 0)
		.with_flags(Scene::GRAVITY | Scene::IGNORE_EDGES),
	Scene::new(100, &[Frame::F122])
		.with_repeat(9, 0)
		.with_flags(Scene::GRAVITY | Scene::IGNORE_EDGES),
	Scene::new(200, &[Frame::F122, Frame::F122])
		.with_flags(Scene::GRAVITY | Scene::IGNORE_EDGES),
];

/// # For `Animation::MagicFlower2`.
pub(super) const MAGIC_FLOWER2: &[Scene] = &[
	Scene::new(200, &[
		Frame::F122, Frame::F122,

		Frame::F123, Frame::F123, Frame::F123, Frame::F123, Frame::F123,
		Frame::F123, Frame::F123,

		Frame::F124, Frame::F124, Frame::F124, Frame::F124, Frame::F124,
		Frame::F124, Frame::F124,

		Frame::F125, Frame::F125, Frame::F125, Frame::F125, Frame::F125,
		Frame::F125, Frame::F125,

		Frame::F126, Frame::F126, Frame::F126, Frame::F126, Frame::F126,
		Frame::F126, Frame::F126,
	])
		.with_flags(Scene::GRAVITY | Scene::IGNORE_EDGES),
];

/// # For `Animation::Nah`.
pub(super) const NAH: &[Scene] = &[
	Scene::new(150, &[
		Frame::F081, Frame::F003, Frame::F082, Frame::F003,
		Frame::F081, Frame::F003, Frame::F082, Frame::F003,
	])
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::PlayDead`.
pub(super) const PLAY_DEAD: &[Scene] = &[
	Scene::new(100, &[
		Frame::F003, Frame::F100, Frame::F100, Frame::F100, Frame::F100,
		Frame::F100, Frame::F100, Frame::F100, Frame::F100, Frame::F100,
		Frame::F100, Frame::F099,
	])
		.with_repeat(4, 11)
		.with_flags(Scene::GRAVITY),
	Scene::new(150, &[Frame::F095, Frame::F046, Frame::F019, Frame::F081])
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::Popcorn`.
pub(super) const POPCORN: &[Scene] = &[
	Scene::new(200, &[Frame::F081, Frame::F019, Frame::F038, Frame::F105])
		.with_repeat(4, 3)
		.with_flags(Scene::GRAVITY),
	Scene::new(50, &[Frame::F105])
		.with_move_to(Position::new(1, 0))
		.with_flags(Scene::GRAVITY),
	Scene::new(50, &[Frame::F105])
		.with_move_to(Position::new(-1, 0))
		.with_flags(Scene::GRAVITY),
	Scene::new(50, &[Frame::F105])
		.with_move_to(Position::new(1, 0))
		.with_flags(Scene::GRAVITY),
	Scene::new(50, &[Frame::F105])
		.with_move_to(Position::new(-1, 0))
		.with_flags(Scene::GRAVITY),
	Scene::new(50, &[Frame::F105])
		.with_move_to(Position::new(1, 0))
		.with_flags(Scene::GRAVITY),
	Scene::new(50, &[Frame::F105])
		.with_move_to(Position::new(-1, 0))
		.with_flags(Scene::GRAVITY),
	Scene::new(50, &[Frame::F105])
		.with_move_to(Position::new(1, 0))
		.with_flags(Scene::GRAVITY),
	Scene::new(50, &[Frame::F105])
		.with_move_to(Position::new(-1, 0))
		.with_flags(Scene::GRAVITY),
	Scene::new(50, &[Frame::F105])
		.with_move_to(Position::new(1, 0))
		.with_flags(Scene::GRAVITY),
	Scene::new(50, &[Frame::F105])
		.with_move_to(Position::new(-1, 0))
		.with_flags(Scene::GRAVITY),
	Scene::new(50, &[Frame::F105])
		.with_move_to(Position::new(1, 0))
		.with_flags(Scene::GRAVITY),
	Scene::new(50, &[Frame::F105])
		.with_move_to(Position::new(-1, 0))
		.with_flags(Scene::GRAVITY),
	Scene::new(50, &[Frame::F105])
		.with_move_to(Position::new(1, 0))
		.with_flags(Scene::GRAVITY),
	Scene::new(50, &[Frame::F105])
		.with_move_to(Position::new(-1, 0))
		.with_flags(Scene::GRAVITY),
	Scene::new(50, &[Frame::F105])
		.with_move_to(Position::new(1, 0))
		.with_flags(Scene::GRAVITY),
	Scene::new(50, &[Frame::F105])
		.with_move_to(Position::new(-1, 0))
		.with_flags(Scene::GRAVITY),
	Scene::new(50, &[Frame::F105])
		.with_move_to(Position::new(1, 0))
		.with_flags(Scene::GRAVITY),
	Scene::new(50, &[Frame::F105])
		.with_move_to(Position::new(-1, 0))
		.with_flags(Scene::GRAVITY),
	Scene::new(50, &[Frame::F105])
		.with_move_to(Position::new(1, 0))
		.with_flags(Scene::GRAVITY),
	Scene::new(50, &[Frame::F105])
		.with_move_to(Position::new(-1, 0))
		.with_flags(Scene::GRAVITY),
	Scene::new(25, &[
		Frame::F019, Frame::F019, Frame::F019, Frame::F019, Frame::F105,
		Frame::F105, Frame::F105, Frame::F105, Frame::F105, Frame::F105,
	])
		.with_move_to(Position::new(0, -10))
		.with_flags(Scene::EASE_OUT),
	Scene::new(25, &[
		Frame::F105, Frame::F105, Frame::F105, Frame::F105, Frame::F105,
		Frame::F105, Frame::F019, Frame::F019, Frame::F019, Frame::F019,
	])
		.with_move_to(Position::new(0, 10))
		.with_flags(Scene::EASE_IN),
	Scene::new(200, &[Frame::F105, Frame::F038, Frame::F019, Frame::F081])
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::ReachCeiling`.
pub(super) const REACH_CEILING: &[Scene] = &[
	Scene::new(100, &[Frame::F027, Frame::F028, Frame::F063])
		.with_move_to(Position::new(1, 0))
		.with_flags(Scene::FLIP_X_NEXT),
];

/// # For `Animation::ReachFloor`.
pub(super) const REACH_FLOOR: &[Scene] = &[
	Scene::new(150, &[
		Frame::F084, Frame::F003, Frame::F003,
		Frame::F003, Frame::F003, Frame::F003,
	])
];

/// # For `Animation::ReachSide1`.
pub(super) const REACH_SIDE1: &[Scene] = &[
	Scene::new(200, &[Frame::F010, Frame::F034])
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::ReachSide2`.
pub(super) const REACH_SIDE2: &[Scene] = &[
	Scene::new(200, &[Frame::F065])
		.with_flags(Scene::FLIP_X_NEXT),
];

/// # For `Animation::Really`.
pub(super) const REALLY: &[Scene] = &[
	Scene::new(100, &[Frame::F081, Frame::F019])
		.with_flags(Scene::GRAVITY),
	Scene::new(250, &[Frame::F019, Frame::F019, Frame::F019, Frame::F020])
		.with_repeat(15, 3)
		.with_flags(Scene::GRAVITY),
	Scene::new(250, &[
		Frame::F039, Frame::F039, Frame::F039, Frame::F039, Frame::F039,
		Frame::F039, Frame::F040, Frame::F039, Frame::F039, Frame::F039,
		Frame::F039, Frame::F039, Frame::F039, Frame::F039, Frame::F039,
		Frame::F039, Frame::F039, Frame::F039, Frame::F039, Frame::F039,
		Frame::F039, Frame::F039, Frame::F039, Frame::F039, Frame::F039,
		Frame::F039, Frame::F040, Frame::F039, Frame::F039, Frame::F039,
		Frame::F039, Frame::F039, Frame::F039, Frame::F039, Frame::F039,
	])
		.with_flags(Scene::GRAVITY),
	Scene::new(150, &[
		Frame::F020, Frame::F020, Frame::F020, Frame::F020, Frame::F081,
	])
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::Rest`.
pub(super) const REST: &[Scene] = &[
	Scene::new(200, &[Frame::F082, Frame::F096, Frame::F097])
		.with_repeat(20, 2)
		.with_flags(Scene::GRAVITY),
	Scene::new(2000, &[Frame::F098])
		.with_flags(Scene::GRAVITY),
	Scene::new(200, &[
		Frame::F097, Frame::F097, Frame::F097, Frame::F097,
		Frame::F096, Frame::F082,
	])
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::Roll`.
pub(super) const ROLL: &[Scene] = &[
	Scene::new(150, &[Frame::F081, Frame::F019, Frame::F019])
		.with_flags(Scene::GRAVITY),
	Scene::new(50, &[
		Frame::F019, Frame::R101, Frame::R102, Frame::R103,
		Frame::F104, Frame::F103, Frame::F102, Frame::F101,
	])
		.with_move_to(Position::new(-8, 0))
		.with_repeat(1, 0)
		.with_flags(Scene::GRAVITY),
	Scene::new(150, &[Frame::F019, Frame::F019, Frame::F081])
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::Rotate`.
pub(super) const ROTATE: &[Scene] = &[
	Scene::new(150, &[Frame::F003, Frame::F081, Frame::F019])
		.with_flags(Scene::FLIP_X_NEXT | Scene::GRAVITY),
	Scene::new(150, &[Frame::F081, Frame::F003])
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::Run`.
pub(super) const RUN: &[Scene] = &[
	Scene::new(30, &[
		Frame::F017, Frame::F017, Frame::F017, Frame::F016,
		Frame::F016, Frame::F016, Frame::F016, Frame::F016,
	])
		.with_move_to(Position::new(-4, 0))
		.with_repeat(5, 0)
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::RunDown`.
pub(super) const RUN_DOWN: &[Scene] = &[
	Scene::new(30, &[
		Frame::F032, Frame::F032, Frame::F032, Frame::F031,
		Frame::F031, Frame::F031, Frame::F031, Frame::F031,
	])
		.with_move_to(Position::new(0, 4))
		.with_repeat(5, 0),
];

/// # For `Animation::RunUpsideDown`.
pub(super) const RUN_UPSIDE_DOWN: &[Scene] = &[
	Scene::new(30, &[
		Frame::F079, Frame::F079, Frame::F079, Frame::F080,
		Frame::F080, Frame::F080, Frame::F080, Frame::F080,
	])
		.with_move_to(Position::new(-4, 0))
		.with_repeat(5, 0),
];

/// # For `Animation::Scoot`.
pub(super) const SCOOT: &[Scene] = &[
	Scene::new(200, &[Frame::F036])
		.with_flags(Scene::GRAVITY),
	Scene::new(200, &[Frame::F037])
		.with_move_to(Position::new(6, 0))
		.with_flags(Scene::GRAVITY),
	Scene::new(200, &[Frame::F036])
		.with_flags(Scene::GRAVITY),
	Scene::new(200, &[Frame::F037])
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
	Scene::new(50, &[Frame::F050, Frame::F051])
		.with_repeat(12, 0)
		.with_flags(Scene::GRAVITY),
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
		Frame::F057, Frame::F057, Frame::F057, Frame::F057, Frame::F057,
		Frame::F058, Frame::F059, Frame::F058, Frame::F057, Frame::F057,
	])
		.with_flags(Scene::GRAVITY | Scene::IGNORE_EDGES),
	Scene::new(50, &[Frame::F003, Frame::F081, Frame::F019, Frame::R081])
		.with_flags(Scene::FLIP_X_NEXT | Scene::GRAVITY | Scene::IGNORE_EDGES),
	BLEAT[0],
];

/// # For `Animation::ShadowShowdownChild1`.
pub(super) const SHADOW_SHOWDOWN_CHILD1: &[Scene] = &[
	SHADOW_SHOWDOWN[0],
	SHADOW_SHOWDOWN[1],
	Scene::new(50, &[Frame::F003, Frame::F081, Frame::F019, Frame::F019])
		.with_flags(Scene::FLIP_X_NEXT | Scene::GRAVITY | Scene::IGNORE_EDGES),
];

/// # For `Animation::ShadowShowdownChild2`.
pub(super) const SHADOW_SHOWDOWN_CHILD2: &[Scene] = &[
	Scene::new(400, &[Frame::F003])
		.with_flags(Scene::GRAVITY | Scene::IGNORE_EDGES),
	Scene::new(30, &[
		Frame::F017, Frame::F017, Frame::F017, Frame::F016,
		Frame::F016, Frame::F016, Frame::F016, Frame::F016,
	])
		.with_move_to(Position::new(-4, 0))
		.with_repeat(12, 0)
		.with_flags(Scene::GRAVITY | Scene::IGNORE_EDGES),
];

/// # For `Animation::Shake`.
pub(super) const SHAKE: &[Scene] = &[
	Scene::new(60, &[
		Frame::F081, Frame::F003, Frame::F082, Frame::F003,
		Frame::F081, Frame::F003, Frame::F082, Frame::F003,
		Frame::F081, Frame::F003, Frame::F082, Frame::F003,
		Frame::F081, Frame::F003, Frame::F082, Frame::F003,
	])
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::SideStep`.
pub(super) const SIDE_STEP: &[Scene] = &[
	Scene::new(150, &[Frame::F003, Frame::F081, Frame::F019])
		.with_flags(Scene::GRAVITY),

	Scene::new(60, &[Frame::F038, Frame::F038, Frame::F038])
		.with_move_to(Position::new(-3, 0))
		.with_flags(Scene::GRAVITY),
	Scene::new(150, &[
		Frame::F019, Frame::F087, Frame::F088, Frame::F087, Frame::F088, Frame::F019,
	])
		.with_flags(Scene::GRAVITY),
	Scene::new(60, &[Frame::F038, Frame::F038, Frame::F038])
		.with_move_to(Position::new(3, 0))
		.with_flags(Scene::GRAVITY),
	Scene::new(150, &[
		Frame::F019, Frame::F087, Frame::F088, Frame::F087, Frame::F088, Frame::F019,
	])
		.with_flags(Scene::GRAVITY),

	Scene::new(150, &[Frame::F019, Frame::F081, Frame::F003])
		.with_flags(Scene::EASE_OUT | Scene::GRAVITY),
];

/// # For `Animation::Skip`.
pub(super) const SKIP: &[Scene] = &[
	Scene::new(60, &[Frame::F017, Frame::F017, Frame::F017])
		.with_move_to(Position::new(-4, -1)),
	Scene::new(60, &[Frame::F002, Frame::F002, Frame::F002])
		.with_move_to(Position::new(-4, 1)),
	Scene::new(60, &[Frame::F017, Frame::F017, Frame::F017])
		.with_move_to(Position::new(-4, -1)),
	Scene::new(60, &[Frame::F002, Frame::F002, Frame::F002])
		.with_move_to(Position::new(-4, 1)),
	Scene::new(60, &[Frame::F017, Frame::F017, Frame::F017])
		.with_move_to(Position::new(-4, -1)),
	Scene::new(60, &[Frame::F002, Frame::F002, Frame::F002])
		.with_move_to(Position::new(-4, 1)),
];

/// # For `Animation::Sleep`.
pub(super) const SLEEP: &[Scene] = &[
	Scene::new(300, &[Frame::F010, Frame::F011, Frame::F012])
		.with_flags(Scene::GRAVITY),
	Scene::new(600, &[Frame::F000, Frame::F001])
		.with_repeat(20, 0)
		.with_flags(Scene::GRAVITY),
	Scene::new(300, &[Frame::F070, Frame::F069, Frame::F068, Frame::F067, Frame::F003])
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::SleepSitting`.
pub(super) const SLEEP_SITTING: &[Scene] = &[
	Scene::new(200, &[
		Frame::F081, Frame::F019, Frame::F038, Frame::F039, Frame::F038,
		Frame::F039, Frame::F040
	])
		.with_repeat(45, 6)
		.with_flags(Scene::GRAVITY),
	Scene::new(200, &[
		Frame::F039, Frame::F040, Frame::F040, Frame::F039, Frame::F038,
		Frame::F038, Frame::F038, Frame::F019, Frame::F081,
	])
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::SleepStanding`.
pub(super) const SLEEP_STANDING: &[Scene] = &[
	Scene::new(200, &[
		Frame::F003, Frame::F003, Frame::F004,
		Frame::F003, Frame::F004, Frame::F005,
	])
		.with_repeat(45, 5)
		.with_flags(Scene::GRAVITY),
	Scene::new(200, &[
		Frame::F004, Frame::F005, Frame::F005, Frame::F004,
		Frame::F003, Frame::F003, Frame::F003,
	])
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::Slide`.
pub(super) const SLIDE: &[Scene] = &[
	Scene::new(100, &[
		Frame::F084, Frame::F083, Frame::F083, Frame::F083,
		Frame::F083, Frame::F083,
	])
		.with_move_to(Position::new(-2, 0))
		.with_flags(Scene::GRAVITY),
	Scene::new(100, &[
		Frame::F083, Frame::F010, Frame::F003,
		Frame::F003, Frame::F003, Frame::F003,
	])
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::SlideDown`.
pub(super) const SLIDE_DOWN: &[Scene] = &[
	Scene::new(30, &[Frame::F106])
		.with_move_to(Position::new(0, 10))
		.with_repeat(25, 0),
];

/// # For `Animation::SlideIn`.
pub(super) const SLIDE_IN: &[Scene] = &[
	ENTRANCE_DELAY,
	Scene::new(30, &[Frame::M024])
		.with_move_to(Position::new(4, 0))
		.with_repeat(19, 0)
		.with_flags(Scene::EASE_OUT | Scene::GRAVITY | Scene::IGNORE_EDGES),
	Scene::new(150, &[Frame::F023, Frame::F022, Frame::R082])
		.with_flags(Scene::FLIP_X_NEXT | Scene::GRAVITY),
];

/// # For `Animation::Sneeze`.
pub(super) const SNEEZE: &[Scene] = &[
	Scene::new(200, &[
		Frame::F061, Frame::F093, Frame::F071, Frame::F072,
		Frame::F071, Frame::F072, Frame::F071, Frame::F003,
	])
		.with_sound(Sound::Sneeze, 0)
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::SneezeShadow`.
pub(super) const SNEEZE_SHADOW: &[Scene] = &[
	Scene::new(100, &[Frame::None, Frame::None, Frame::F093])
		.with_move_to(Position::new(10, 0))
		.with_repeat(3, 2)
		.with_flags(Scene::GRAVITY | Scene::IGNORE_EDGES),
];

/// # For `Animation::Spin`.
pub(super) const SPIN: &[Scene] = &[
	Scene::new(100, &[
		Frame::F003, Frame::F081, Frame::F019, Frame::R081, Frame::R082,
		Frame::F022, Frame::F082, Frame::F004, Frame::F081, Frame::F020,
		Frame::R081, Frame::R082, Frame::F022, Frame::F082,
	])
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::Splat`.
pub(super) const SPLAT: &[Scene] = &[
	Scene::new(200, &[Frame::F085, Frame::F085, Frame::F085, Frame::F085, Frame::F049])
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::SplatGhost`.
pub(super) const SPLAT_GHOST: &[Scene] = &[
	Scene::new(50, &[
		Frame::F087, Frame::F087, Frame::F087, Frame::F087, Frame::F087,
		Frame::F088, Frame::F088, Frame::F088, Frame::F088, Frame::F088,
		Frame::F087, Frame::F087, Frame::F087, Frame::F087, Frame::F087,
		Frame::F088, Frame::F088,
	])
		.with_move_to(Position::new(0, -6))
		.with_flags(Scene::IGNORE_EDGES),
];

/// # For `Animation::Stargaze`.
pub(super) const STARGAZE: &[Scene] = &[
	ENTRANCE_DELAY,
	Scene::new(50, &[Frame::F002, Frame::F003])
		.with_move_to(Position::new(-2, 0))
		.with_repeat(10, 0)
		.with_flags(Scene::GRAVITY),
	Scene::new(50, &[
		Frame::F003, Frame::F003, Frame::F003, Frame::F003, Frame::F003,
		Frame::F057, Frame::F057, Frame::F057, Frame::F057, Frame::F057,
		Frame::F058, Frame::F059, Frame::F059, Frame::F058, Frame::F057,
		Frame::F057, Frame::F057, Frame::F057, Frame::F057, Frame::F057,
		Frame::F057,
	])
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::StargazeChild`.
pub(super) const STARGAZE_CHILD: &[Scene] = &[
	ENTRANCE_DELAY,
	Scene::new(52, &[Frame::F131])
		.with_repeat(20, 0)
		.with_flags(Scene::IGNORE_EDGES),
	Scene::new(6, &[Frame::F131, Frame::F132, Frame::F133, Frame::F134])
		.with_move_to(Position::new(5, -1))
		.with_repeat(40, 0)
		.with_flags(Scene::IGNORE_EDGES),
];

/// # For `Animation::Tornado`.
pub(super) const TORNADO: &[Scene] = &[
	Scene::new(150, &[Frame::F003, Frame::F081, Frame::F019])
		.with_flags(Scene::GRAVITY),
	Scene::new(100, &[Frame::R081, Frame::R082, Frame::F022, Frame::F082])
		.with_flags(Scene::GRAVITY),
	Scene::new(75, &[Frame::F003, Frame::F081, Frame::F019])
		.with_flags(Scene::GRAVITY),
	Scene::new(50, &[Frame::R081, Frame::R082, Frame::F022, Frame::F082])
		.with_flags(Scene::GRAVITY),
	Scene::new(25, &[
		Frame::F003, Frame::F081, Frame::F019, Frame::R081, Frame::R082,
		Frame::F022, Frame::F082,
	])
		.with_flags(Scene::GRAVITY),
	Scene::new(15, &[
		Frame::F003, Frame::F081, Frame::F019, Frame::R081, Frame::R082,
		Frame::F022, Frame::F082, Frame::F004, Frame::F081, Frame::F020,
		Frame::R081, Frame::R082, Frame::F022, Frame::F082,
	])
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::Urinate`.
pub(super) const URINATE: &[Scene] = &[
	Scene::new(150, &[
		Frame::F003, Frame::F082, Frame::F022, Frame::F023,
		Frame::M024, Frame::F024, Frame::F025,
	])
		.with_repeat(14, 5)
		.with_flags(Scene::GRAVITY),
	Scene::new(100, &[
		Frame::M024, Frame::F024, Frame::M024, Frame::M024,
		Frame::F023, Frame::F022, Frame::F082,
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
	Scene::new(100, &[Frame::F078, Frame::F077])
		.with_move_to(Position::new(-2, 0))
		.with_repeat(83, 0),
];

/// # For `Animation::WallSlide`.
pub(super) const WALL_SLIDE: &[Scene] = &[
	Scene::new(40, &[Frame::F107])
		.with_move_to(Position::new(0, 5))
		.with_repeat(10, 0),
];

/// # For `Animation::Yawn`.
pub(super) const YAWN: &[Scene] = &[
	Scene::new(350, &[
		Frame::F003, Frame::F060, Frame::F061,
		Frame::F060, Frame::F061, Frame::F060,
	])
		.with_sound(Sound::Yawn, 1)
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::Yoyo`.
pub(super) const YOYO: &[Scene] = &[
	ENTRANCE_DELAY,
	Scene::new(15, &[Frame::F105])
		.with_move_to(Position::new(0, 11))
		.with_repeat(39, 0)
		.with_flags(Scene::EASE_IN | Scene::IGNORE_EDGES),
	Scene::new(25, &[
		Frame::F019, Frame::F019, Frame::F019, Frame::F019,
		Frame::F019, Frame::F019, Frame::F019, Frame::F019,
	])
		.with_move_to(Position::new(0, -4)),
	Scene::new(25, &[
		Frame::F019, Frame::F019, Frame::F019, Frame::F019,
		Frame::F019, Frame::F019, Frame::F019, Frame::F019,
	])
		.with_move_to(Position::new(0, 4)),
	Scene::new(25, &[
		Frame::F019, Frame::F019, Frame::F019, Frame::F019,
		Frame::F019, Frame::F019, Frame::F019, Frame::F019,
	])
		.with_move_to(Position::new(0, -4)),
	Scene::new(15, &[Frame::F105])
		.with_move_to(Position::new(0, -11))
		.with_repeat(39, 0)
		.with_flags(Scene::EASE_OUT | Scene::IGNORE_EDGES),
];

/// # For `Animation::BlackSheepCatchFailExitChild`.
pub(super) const fn black_sheep_catch_fail_exit_child(w: u16) -> SceneList {
	let repeat = (w + Frame::SIZE).wrapping_div(32);

	SceneList::new(SceneListKind::Dynamic1([
		Scene::new(30, &[
			Frame::F128, Frame::F128, Frame::F128, Frame::F127,
			Frame::F127, Frame::F127, Frame::F127, Frame::F127,
		])
			.with_move_to(Position::new(4, 0))
			.with_repeat(repeat, 0)
			.with_flags(Scene::GRAVITY | Scene::IGNORE_EDGES),
	]))
}

/// # For `Animation::BlackSheepChase`.
pub(super) const fn black_sheep_chase(w: u16) -> SceneList {
	let repeat = (w + Frame::SIZE * 4).wrapping_div(32) + 1;

	SceneList::new(SceneListKind::Dynamic3([
		ENTRANCE_DELAY,
		Scene::new(30, &[
			Frame::F017, Frame::F017, Frame::F017, Frame::F016,
			Frame::F016, Frame::F016, Frame::F016, Frame::F016,
		])
			.with_move_to(Position::new(-4, 0))
			.with_repeat(repeat, 0)
			.with_flags(Scene::FLIP_X_NEXT | Scene::GRAVITY | Scene::IGNORE_EDGES),
		Scene::new(30, &[
			Frame::F017, Frame::F017, Frame::F017, Frame::F016,
			Frame::F016, Frame::F016, Frame::F016, Frame::F016,
		])
			.with_move_to(Position::new(-4, 0))
			.with_repeat(3, 0)
			.with_flags(Scene::GRAVITY | Scene::IGNORE_EDGES),
	]))
}

/// # For `Animation::BlackSheepChaseChild`.
pub(super) const fn black_sheep_chase_child(w: u16) -> SceneList {
	let repeat = (w + Frame::SIZE * 2).wrapping_div(32) + 1;

	SceneList::new(SceneListKind::Dynamic2([
		ENTRANCE_DELAY,
		Scene::new(30, &[
			Frame::F128, Frame::F128, Frame::F128, Frame::F127,
			Frame::F127, Frame::F127, Frame::F127, Frame::F127,
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
			Frame::F017, Frame::F017, Frame::F017, Frame::F016,
			Frame::F016, Frame::F016, Frame::F016, Frame::F016,
		])
			.with_move_to(Position::new(-4, 0))
			.with_repeat(first, 0)
			.with_flags(Scene::GRAVITY),
		Scene::new(100, &[Frame::F002, Frame::F003])
			.with_move_to(Position::new(-3, 0))
			.with_repeat(second, 0)
			.with_flags(Scene::EASE_OUT | Scene::GRAVITY),
		Scene::new(250, &[
			Frame::F005, Frame::F005, Frame::F003, Frame::F003, Frame::F003,
			Frame::F006, Frame::F007, Frame::F007, Frame::F007, Frame::F008,
			Frame::F009, Frame::F008, Frame::F007, Frame::F007, Frame::F008,
			Frame::F009, Frame::F009, Frame::F009, Frame::F009, Frame::F008,
			Frame::F007, Frame::F006, Frame::F003, Frame::F003, Frame::F003,
		])
			.with_flags(Scene::GRAVITY),
	]))
}

/// # For `Animation::BlackSheepRomanceChild`.
pub(super) const fn black_sheep_romance_child(w: u16) -> SceneList {
	let (first, second) = scale_black_sheep_romance(w);

	SceneList::new(SceneListKind::Dynamic3([
		Scene::new(30, &[
			Frame::F128, Frame::F128, Frame::F128, Frame::F127,
			Frame::F127, Frame::F127, Frame::F127, Frame::F127,
		])
			.with_move_to(Position::new(4, 0))
			.with_repeat(first, 0)
			.with_flags(Scene::GRAVITY),
		Scene::new(100, &[Frame::F129, Frame::F130])
			.with_move_to(Position::new(3, 0))
			.with_repeat(second, 0)
			.with_flags(Scene::EASE_OUT | Scene::GRAVITY),
		Scene::new(4500, &[Frame::F130])
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
			Frame::F017, Frame::F017, Frame::F017, Frame::F016,
			Frame::F016, Frame::F016, Frame::F016, Frame::F016,
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
			Frame::F139, Frame::F140, Frame::F139, Frame::F141,
			Frame::F139, Frame::F140, Frame::F139, Frame::F141,
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
			Frame::F003, Frame::F081, Frame::F019, Frame::R081, Frame::R082,
			Frame::F022, Frame::F082, Frame::F004, Frame::F081, Frame::F020,
			Frame::R081, Frame::R082, Frame::F022, Frame::F082,
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
