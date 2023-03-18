/*!
# RS Mate Poe: Scene Details
*/

use crate::{
	Frame,
	Position,
	Scene,
	SceneList,
	Sound,
	Universe,
};
use super::SceneListKind;



/// # For `Animation::Abduction`.
pub(super) const ABDUCTION: &[Scene] = &[
	Scene::new(254, &[
		Frame::F009, Frame::F010, Frame::F010,
		Frame::F010, Frame::F010, Frame::F034,
	])
		.with_repeat(11, 5)
		.with_flags(Scene::GRAVITY),
	Scene::new(200, &[Frame::F034, Frame::F081])
		.with_flags(Scene::GRAVITY),
	Scene::new(83, &[
		Frame::F088, Frame::F089, Frame::F090, Frame::F088, Frame::F089,
		Frame::F090, Frame::F088, Frame::F089, Frame::F090, Frame::None,
		Frame::F089, Frame::None, Frame::F088, Frame::None, Frame::F090,
		Frame::None, Frame::F089, Frame::None, Frame::F088, Frame::None,
		Frame::F090, Frame::None, Frame::F089, Frame::None,
	])
		.with_move_to(Position::new(0, -30)),
	Scene::new(5500, &[Frame::None])
];

/// # For `Animation::AbductionChild`.
pub(super) const ABDUCTION_CHILD: &[Scene] = &[
	Scene::new(28, &[Frame::F158, Frame::F159, Frame::F160, Frame::F161])
		.with_move_to(Position::new(0, 480))
		.with_repeat(29, 0)
		.with_flags(Scene::EASE_OUT | Scene::IGNORE_EDGES),
	Scene::new(50, &[Frame::F162, Frame::F163, Frame::F164, Frame::F165])
		.with_repeat(18, 0)
		.with_flags(Scene::IGNORE_EDGES),
	Scene::new(30, &[Frame::F158, Frame::F159, Frame::F160, Frame::F161])
		.with_move_to(Position::new(600, -480))
		.with_repeat(29, 0)
		.with_flags(Scene::EASE_IN | Scene::IGNORE_EDGES),
];

/// # For `Animation::BathCoolDown`.
pub(super) const BATH_COOL_DOWN: &[Scene] = &[
	Scene::new(100, &[
		Frame::F169, Frame::F169, Frame::F169, Frame::F170,
		Frame::F171, Frame::F170, Frame::F169, Frame::F169,
	])
		.with_repeat(2, 0)
		.with_flags(Scene::GRAVITY),
	Scene::new(100, &[
		Frame::F119, Frame::F081, Frame::F081, Frame::F082, Frame::F082, Frame::F010,
	])
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::BathDive`.
pub(super) const BATH_DIVE: &[Scene] = &[
	Scene::new(30, &[Frame::F134])
		.with_move_to(Position::new(-588, 441))
		.with_repeat(144, 0),
	Scene::new(30, &[
		Frame::F135, Frame::F135, Frame::F135, Frame::F135, Frame::F136,
		Frame::F136, Frame::F136, Frame::F136, Frame::F137, Frame::F137,
		Frame::F137, Frame::F137, Frame::F138, Frame::F138, Frame::F138,
		Frame::F138, Frame::F139, Frame::F139, Frame::F139, Frame::F139,
		Frame::F140, Frame::F140, Frame::F140, Frame::F140, Frame::F141,
		Frame::F141, Frame::F141, Frame::F141, Frame::F142, Frame::F142,
		Frame::F142, Frame::F142, Frame::F143, Frame::F143, Frame::F143,
		Frame::F143, Frame::F144, Frame::F144, Frame::F144, Frame::F144,
		Frame::F145, Frame::F144,
	])
		.with_move_to(Position::new(-192, 144))
		.with_repeat(3, 40),
];

/// # For `Animation::BathDiveChild`.
pub(super) const BATH_DIVE_CHILD: &[Scene] = &[
	Scene::new(30, &[Frame::F146])
		.with_repeat(171, 0)
		.with_flags(Scene::GRAVITY),
	Scene::new(30, &[
		Frame::F146, Frame::F146, Frame::F146, Frame::F146, Frame::F146,
		Frame::F146, Frame::F146, Frame::F146, Frame::F146, Frame::F146,
		Frame::F146, Frame::F146, Frame::F147, Frame::F147, Frame::F148,
		Frame::F148, Frame::F148, Frame::F147, Frame::F147, Frame::F146,
	])
		.with_repeat(70, 19)
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::Beg`.
pub(super) const BEG: &[Scene] = &[
	Scene::new(150, &[
		Frame::F009, Frame::F010, Frame::F054, Frame::F055, Frame::F054,
		Frame::F055, Frame::F054, Frame::F055, Frame::F034, Frame::F034,
		Frame::F034, Frame::F034, Frame::F034, Frame::F034, Frame::F010,
		Frame::F009,
	])
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::BeginRun`.
pub(super) const BEGIN_END_RUN: &[Scene] = &[
	Scene::new(100, &[Frame::F002, Frame::F003])
		.with_move_to(Position::new(-24, 0))
		.with_repeat(2, 0)
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::BigFish`.
pub(super) const BIG_FISH: &[Scene] = &[
	Scene::new(60, &[Frame::F005, Frame::F005, Frame::F004, Frame::F004, Frame::F004])
		.with_move_to(Position::new(-210, 0))
		.with_repeat(6, 0)
		.with_flags(Scene::GRAVITY),
	Scene::new(2000, &[Frame::None])
		.with_move_to(Position::new(-100, Frame::SIZE_I))
		.with_flags(Scene::IGNORE_EDGES),
	Scene::new(50, &[Frame::F030])
		.with_move_to(Position::new(-5, -30))
		.with_repeat(4, 0)
		.with_flags(Scene::IGNORE_EDGES),
	Scene::new(50, &[Frame::F023])
		.with_move_to(Position::new(0, -10))
		.with_repeat(1, 0)
		.with_flags(Scene::IGNORE_EDGES),
	Scene::new(100, &[
		Frame::F023, Frame::F023, Frame::F023, Frame::F077, Frame::F078, Frame::F003,
	])
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::BigFishChild`.
pub(super) const BIG_FISH_CHILD: &[Scene] = &[
	Scene::new(1000, &[Frame::F058])
		.with_flags(Scene::IGNORE_EDGES),
	Scene::new(25, &[Frame::F058])
		.with_move_to(Position::new(-175, -75))
		.with_repeat(24, 0)
		.with_flags(Scene::IGNORE_EDGES),
	Scene::new(25, &[
		Frame::F059, Frame::F059, Frame::F059, Frame::F059, Frame::F059,
		Frame::F058, Frame::F058, Frame::F060, Frame::F060, Frame::F061,
	])
		.with_move_to(Position::new(-40, 0))
		.with_flags(Scene::IGNORE_EDGES),
	Scene::new(25, &[Frame::F061, Frame::F060, Frame::F061, Frame::F060, Frame::F061])
		.with_move_to(Position::new(-150, 75))
		.with_repeat(4, 0)
		.with_flags(Scene::IGNORE_EDGES),
];

/// # For `Animation::Bleat`.
pub(super) const BLEAT: &[Scene] = &[
	Scene::new(200, &[
		Frame::F003, Frame::F071, Frame::F072, Frame::F071,
		Frame::F072, Frame::F071, Frame::F003,
	])
		.with_sound(Sound::Baa, 1)
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::Boing`.
pub(super) const BOING: &[Scene] = &[
	Scene::new(100, &[
		Frame::F062, Frame::F062, Frame::F063, Frame::F064, Frame::F065,
		Frame::F066, Frame::F067, Frame::F068, Frame::F069, Frame::F070,
		Frame::F006,
	])
		.with_move_to(Position::new(55, 0))
		.with_flags(Scene::EASE_OUT | Scene::GRAVITY),
];

/// # For `Animation::Bounce`.
pub(super) const BOUNCE: &[Scene] = &[
	Scene::new(100, &[Frame::F042, Frame::F049, Frame::F042])
		.with_flags(Scene::GRAVITY),
	Scene::new(100, &[Frame::F131, Frame::F042])
		.with_move_to(Position::new(0, -6)),
	Scene::new(100, &[Frame::F132]),
	Scene::new(100, &[Frame::F042, Frame::F049])
		.with_move_to(Position::new(0, 6)),
	Scene::new(100, &[
		Frame::F013, Frame::F012, Frame::F003, Frame::F009, Frame::F010,
		Frame::F010, Frame::F010, Frame::F010, Frame::F010, Frame::F010,
		Frame::F010, Frame::F010, Frame::F010, Frame::F010, Frame::F009,
		Frame::F003,
	])
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::ClimbDown`.
pub(super) const CLIMB_DOWN: &[Scene] = &[
	Scene::new(150, &[Frame::F019, Frame::F020])
		.with_move_to(Position::new(0, 84))
		.with_repeat(20, 0),
];

/// # For `Animation::ClimbUp`.
pub(super) const CLIMB_UP: &[Scene] = &[
	Scene::new(150, &[Frame::F015, Frame::F016])
		.with_move_to(Position::new(0, -84))
		.with_repeat(20, 0),
];

/// # For `Animation::DangleFall`.
pub(super) const DANGLE_FALL: &[Scene] = &[
	Scene::new(100, &[Frame::F046, Frame::F047])
		.with_repeat(10, 0),
];

/// # For `Animation::DangleRecover`.
pub(super) const DANGLE_RECOVER: &[Scene] = &[
	Scene::new(200, &[Frame::F088, Frame::F089, Frame::F090])
		.with_move_to(Position::new(-30, 0))
		.with_repeat(1, 0),
	Scene::new(100, &[
		Frame::F081, Frame::F081, Frame::F081, Frame::F082,
		Frame::F010, Frame::F009, Frame::F003,
	]),
];

/// # For `Animation::DeepThoughts`.
pub(super) const DEEP_THOUGHTS: &[Scene] = &[
	Scene::new(50, &[
		Frame::F003, Frame::F003, Frame::F003, Frame::F003, Frame::F003, Frame::F073,
	])
		.with_repeat(15, 5),
	Scene::new(50, &[Frame::F050, Frame::F051])
		.with_repeat(12, 0),
	Scene::new(50, &[Frame::F003, Frame::F009, Frame::F010])
		.with_flags(Scene::FLIP_X_NEXT),
	Scene::new(50, &[Frame::F010, Frame::F009, Frame::F003]),
];

/// # For `Animation::Drag`.
pub(super) const DRAG: &[Scene] = &[
	Scene::new(150, &[
		Frame::F042, Frame::F043, Frame::F043, Frame::F042, Frame::F044, Frame::F044,
	])
		.with_repeat(2, 0),
];

/// # For `Animation::Eat`.
pub(super) const EAT: &[Scene] = &[
	Scene::new(190, &[
		Frame::F006, Frame::F006, Frame::F006, Frame::F006, Frame::F058,
		Frame::F059, Frame::F059, Frame::F060, Frame::F061, Frame::F060,
		Frame::F061, Frame::F006,
	])
		.with_repeat(5, 5)
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::Fall`.
pub(super) const FALL: &[Scene] = &[
	Scene::new(20, &[Frame::F133])
		.with_move_to(Position::new(0, 250))
		.with_repeat(49, 0)
		.with_flags(Scene::EASE_IN),
];

/// # For `Animation::FlowerChild`.
pub(super) const FLOWER_CHILD: &[Scene] = &[
	Scene::new(205, &[
		Frame::F153, Frame::F153, Frame::F153, Frame::F153, Frame::F153,
		Frame::F153, Frame::F153, Frame::F153, Frame::F153, Frame::F149,
		Frame::F149, Frame::F149, Frame::F149, Frame::F149, Frame::F149,
		Frame::F149, Frame::F149, Frame::F149, Frame::F150, Frame::F150,
		Frame::F150, Frame::F150, Frame::F150, Frame::F150, Frame::F150,
		Frame::F151, Frame::F151, Frame::F151, Frame::F151, Frame::F151,
		Frame::F151, Frame::F151, Frame::F152,
	])
		.with_repeat(11, 32)
		.with_flags(Scene::GRAVITY | Scene::IGNORE_EDGES),
];

/// # For `Animation::GraspingFall`.
pub(super) const GRASPING_FALL: &[Scene] = &[
	Scene::new(15, &[
		Frame::F046, Frame::F046, Frame::F046, Frame::F046, Frame::F046,
		Frame::F046, Frame::F047, Frame::F047, Frame::F047, Frame::F047,
		Frame::F047, Frame::F047,
	])
		.with_move_to(Position::new(0, 840))
		.with_repeat(9, 0),
];

/// # For `Animation::Handstand`.
pub(super) const HANDSTAND: &[Scene] = &[
	Scene::new(200, &[
		Frame::F086, Frame::F087, Frame::F088, Frame::F089, Frame::F090,
		Frame::F088, Frame::F089, Frame::F090, Frame::F087, Frame::F086,
	])
		.with_move_to(Position::new(-20, 0))
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::Jump`.
pub(super) const JUMP: &[Scene] = &[
	Scene::new(35, &[
		Frame::F076, Frame::F076, Frame::F030, Frame::F030, Frame::F030,
		Frame::F030, Frame::F030, Frame::F030, Frame::F023,
	])
		.with_move_to(Position::new(-54, -18)),
	Scene::new(35, &[
		Frame::F023, Frame::F023, Frame::F023, Frame::F024, Frame::F024,
		Frame::F024, Frame::F024, Frame::F077, Frame::F077,
	])
		.with_move_to(Position::new(-45, 18)),
];

/// # For `Animation::PlayDead`.
pub(super) const PLAY_DEAD: &[Scene] = &[
	Scene::new(100, &[
		Frame::F003, Frame::F096, Frame::F096, Frame::F096, Frame::F096,
		Frame::F096, Frame::F096, Frame::F096, Frame::F096, Frame::F096,
		Frame::F096, Frame::F095,
	])
		.with_repeat(4, 11)
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::ReachCeiling`.
pub(super) const REACH_CEILING: &[Scene] = &[
	Scene::new(100, &[Frame::F016, Frame::F017, Frame::F028])
		.with_move_to(Position::new(3, 0))
		.with_flags(Scene::FLIP_X_NEXT),
];

/// # For `Animation::ReachFloor`.
pub(super) const REACH_FLOOR: &[Scene] = &[
	Scene::new(150, &[
		Frame::F024, Frame::F006, Frame::F006, Frame::F006, Frame::F006, Frame::F006,
	])
];

/// # For `Animation::ReachSide1`.
pub(super) const REACH_SIDE1: &[Scene] = &[
	Scene::new(200, &[Frame::F031, Frame::F030])
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::ReachSide2`.
pub(super) const REACH_SIDE2: &[Scene] = &[
	Scene::new(200, &[Frame::F026])
		.with_flags(Scene::FLIP_X_NEXT),
];

/// # For `Animation::Rest`.
pub(super) const REST: &[Scene] = &[
	Scene::new(200, &[Frame::F003, Frame::F012, Frame::F092, Frame::F093])
		.with_repeat(20, 3)
		.with_flags(Scene::GRAVITY),
	Scene::new(2000, &[Frame::F094])
		.with_flags(Scene::GRAVITY),
	Scene::new(200, &[
		Frame::F093, Frame::F093, Frame::F093, Frame::F093,
		Frame::F092, Frame::F012, Frame::F003,
	])
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::Roll`.
pub(super) const ROLL: &[Scene] = &[
	Scene::new(150, &[Frame::F009, Frame::F010, Frame::F010])
		.with_flags(Scene::GRAVITY),
	Scene::new(50, &[
		Frame::F010, Frame::F118, Frame::F117, Frame::F116,
		Frame::F115, Frame::F114, Frame::F113, Frame::F112,
	])
		.with_move_to(Position::new(-128, 0))
		.with_repeat(1, 0)
		.with_flags(Scene::GRAVITY),
	Scene::new(150, &[Frame::F010, Frame::F010, Frame::F009])
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::Rotate`.
pub(super) const ROTATE: &[Scene] = &[
	Scene::new(150, &[Frame::F003, Frame::F009, Frame::F010])
		.with_flags(Scene::FLIP_X_NEXT | Scene::GRAVITY),
	Scene::new(150, &[Frame::F010, Frame::F009, Frame::F003])
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::Run`.
pub(super) const RUN: &[Scene] = &[
	Scene::new(60, &[Frame::F005, Frame::F005, Frame::F004, Frame::F004, Frame::F004])
		.with_move_to(Position::new(-180, 0))
		.with_repeat(5, 0)
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::RunDown`.
pub(super) const RUN_DOWN: &[Scene] = &[
	Scene::new(60, &[Frame::F022, Frame::F022, Frame::F021, Frame::F021, Frame::F021])
		.with_move_to(Position::new(0, 180))
		.with_repeat(5, 0),
];

/// # For `Animation::RunUpsideDown`.
pub(super) const RUN_UPSIDE_DOWN: &[Scene] = &[
	Scene::new(60, &[Frame::F099, Frame::F099, Frame::F100, Frame::F100, Frame::F100])
		.with_move_to(Position::new(-180, 0))
		.with_repeat(5, 0),
];

/// # For `Animation::Scoot`.
pub(super) const SCOOT: &[Scene] = &[
	Scene::new(200, &[Frame::F052])
		.with_flags(Scene::GRAVITY),
	Scene::new(200, &[Frame::F053])
		.with_move_to(Position::new(6, 0))
		.with_flags(Scene::GRAVITY),
	Scene::new(200, &[Frame::F052])
		.with_flags(Scene::GRAVITY),
	Scene::new(200, &[Frame::F053])
		.with_move_to(Position::new(6, 0))
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::Scratch`.
pub(super) const SCRATCH: &[Scene] = &[
	Scene::new(150, &[Frame::F056, Frame::F057])
		.with_repeat(3, 0)
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::Scream`.
pub(super) const SCREAM: &[Scene] = &[
	Scene::new(50, &[Frame::F050, Frame::F051])
		.with_repeat(12, 0)
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::Slide`.
pub(super) const SLIDE: &[Scene] = &[
	Scene::new(100, &[
		Frame::F024, Frame::F023, Frame::F023, Frame::F023, Frame::F023,
		Frame::F023, Frame::F031, Frame::F003, Frame::F003, Frame::F003,
		Frame::F003,
	])
		.with_move_to(Position::new(-22, 0))
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::SlideDown`.
pub(super) const SLIDE_DOWN: &[Scene] = &[
	Scene::new(30, &[Frame::F025])
		.with_move_to(Position::new(0, 260))
		.with_repeat(25, 0),
];

/// # For `Animation::Sneeze`.
pub(super) const SNEEZE: &[Scene] = &[
	Scene::new(200, &[
		Frame::F108, Frame::F109, Frame::F110, Frame::F111,
		Frame::F110, Frame::F111, Frame::F110, Frame::F003,
	])
		.with_sound(Sound::Sneeze, 0)
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::SneezeShadow`.
pub(super) const SNEEZE_SHADOW: &[Scene] = &[
	Scene::new(100, &[Frame::None, Frame::None, Frame::F109])
		.with_move_to(Position::new(60, 0))
		.with_repeat(3, 2)
		.with_flags(Scene::GRAVITY | Scene::IGNORE_EDGES),
];

/// # For `Animation::Spin`.
pub(super) const SPIN: &[Scene] = &[
	Scene::new(100, &[
		Frame::F003, Frame::F009, Frame::F010, Frame::F011, Frame::F014,
		Frame::F013, Frame::F012, Frame::F007, Frame::F009, Frame::F101,
		Frame::F011, Frame::F014, Frame::F013, Frame::F012,
	])
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::Splat`.
pub(super) const SPLAT: &[Scene] = &[
	Scene::new(200, &[Frame::F048, Frame::F048, Frame::F048, Frame::F048, Frame::F047])
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::Stargaze`.
pub(super) const STARGAZE: &[Scene] = &[
	Scene::new(50, &[Frame::F002, Frame::F003])
		.with_move_to(Position::new(-44, 0))
		.with_repeat(10, 0)
		.with_flags(Scene::GRAVITY),
	Scene::new(50, &[
		Frame::F003, Frame::F003, Frame::F003, Frame::F003, Frame::F003, Frame::F073,
	])
		.with_repeat(15, 5)
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::StargazeChild`.
pub(super) const STARGAZE_CHILD: &[Scene] = &[
	Scene::new(52, &[Frame::F158])
		.with_repeat(20, 0)
		.with_flags(Scene::IGNORE_EDGES),
	Scene::new(6, &[Frame::F158, Frame::F159, Frame::F160, Frame::F161])
		.with_move_to(Position::new(820, -164))
		.with_repeat(40, 0)
		.with_flags(Scene::IGNORE_EDGES),
];

/// # For `Animation::Walk`.
pub(super) const WALK: &[Scene] = &[
	Scene::new(150, &[Frame::F002, Frame::F003])
		.with_move_to(Position::new(-84, 0))
		.with_repeat(20, 0)
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::WalkUpsideDown`.
pub(super) const WALK_UPSIDE_DOWN: &[Scene] = &[
	Scene::new(150, &[Frame::F098, Frame::F097])
		.with_move_to(Position::new(-84, 0))
		.with_repeat(20, 0),
];

/// # For `Animation::WallSlide`.
pub(super) const WALL_SLIDE: &[Scene] = &[
	Scene::new(40, &[Frame::F029])
		.with_move_to(Position::new(0, 55))
		.with_repeat(10, 0),
];

/// # For `Animation::Yoyo`.
pub(super) const YOYO: &[Scene] = &[
	Scene::new(16, &[
		Frame::F119, Frame::F120, Frame::F121, Frame::F122,
		Frame::F123, Frame::F124, Frame::F125, Frame::F126,
	])
		.with_move_to(Position::new(0, 528))
		.with_repeat(5, 0)
		.with_flags(Scene::EASE_IN | Scene::IGNORE_EDGES),
	Scene::new(18, &[
		Frame::F112, Frame::F113, Frame::F114, Frame::F115,
		Frame::F116, Frame::F117, Frame::F118, Frame::F110,
	])
		.with_move_to(Position::new(0, -16)),
	Scene::new(18, &[
		Frame::F112, Frame::F113, Frame::F114, Frame::F115,
		Frame::F116, Frame::F117, Frame::F118, Frame::F110,
	])
		.with_move_to(Position::new(0, 16)),
	Scene::new(18, &[
		Frame::F112, Frame::F113, Frame::F114, Frame::F115,
		Frame::F116, Frame::F117, Frame::F118, Frame::F110,
	])
		.with_move_to(Position::new(0, -16)),
	Scene::new(16, &[
		Frame::F119, Frame::F120, Frame::F121, Frame::F122,
		Frame::F123, Frame::F124, Frame::F125, Frame::F126,
	])
		.with_move_to(Position::new(0, -528))
		.with_repeat(5, 0)
		.with_flags(Scene::EASE_OUT | Scene::IGNORE_EDGES),
];

/// # For `Animation::BlackSheepChase`.
pub(super) const fn black_sheep_chase(w: u16) -> SceneList {
	let repeat = (w + Frame::SIZE * 4).wrapping_div(30) + 2;

	SceneList::new(SceneListKind::Dynamic2([
		Scene::new(100, &[Frame::F005, Frame::F004, Frame::F004])
			.with_move_to(Position::new(repeat as i32 * -10 * 3, 0))
			.with_repeat(repeat - 1, 0)
			.with_flags(Scene::FLIP_X_NEXT | Scene::GRAVITY | Scene::IGNORE_EDGES),
		Scene::new(50, &[
			Frame::F005, Frame::F005, Frame::F004,
			Frame::F004, Frame::F004, Frame::F004,
		])
			.with_move_to(Position::new(4 * -10 * 3, 0))
			.with_repeat(3, 0)
			.with_flags(Scene::GRAVITY | Scene::IGNORE_EDGES),
	]))
}

/// # For `Animation::BlackSheepChaseChild`.
pub(super) const fn black_sheep_chase_child(w: u16) -> SceneList {
	let repeat = (w + Frame::SIZE * 2).wrapping_div(30) + 2;

	SceneList::new(SceneListKind::Dynamic1([
		Scene::new(100, &[Frame::F155, Frame::F154, Frame::F154])
			.with_move_to(Position::new(repeat as i32 * 10 * 3, 0))
			.with_repeat(repeat - 1, 0)
			.with_flags(Scene::GRAVITY | Scene::IGNORE_EDGES),
	]))
}

/// # For `Animation::BlackSheepRomance`.
pub(super) const fn black_sheep_romance(w: u16) -> SceneList {
	let (first, second) = scale_black_sheep_romance(w);

	SceneList::new(SceneListKind::Dynamic3([
		Scene::new(100, &[Frame::F005, Frame::F004, Frame::F004])
			.with_move_to(Position::new(first as i32 * -10 * 3, 0))
			.with_repeat(first.saturating_sub(1), 0)
			.with_flags(Scene::GRAVITY),
		Scene::new(100, &[Frame::F002, Frame::F003])
			.with_move_to(Position::new(second as i32 * -3 * 2, 0))
			.with_repeat(second.saturating_sub(1), 0)
			.with_flags(Scene::EASE_OUT | Scene::GRAVITY),
		Scene::new(411, &[
			Frame::F008, Frame::F003, Frame::F003, Frame::F003, Frame::F127,
			Frame::F128, Frame::F129, Frame::F130, Frame::F130, Frame::F130,
			Frame::F130, Frame::F129, Frame::F128, Frame::F127, Frame::F003,
			Frame::F003, Frame::F003,
		])
			.with_flags(Scene::GRAVITY),
	]))
}

/// # For `Animation::BlackSheepRomanceChild`.
pub(super) const fn black_sheep_romance_child(w: u16) -> SceneList {
	let (first, second) = scale_black_sheep_romance(w);

	SceneList::new(SceneListKind::Dynamic3([
		Scene::new(100, &[Frame::F155, Frame::F154, Frame::F154])
			.with_move_to(Position::new(first as i32 * 10 * 3, 0))
			.with_repeat(first.saturating_sub(1), 0)
			.with_flags(Scene::GRAVITY),
		Scene::new(100, &[Frame::F156, Frame::F157])
			.with_move_to(Position::new(second as i32 * 3 * 2, 0))
			.with_repeat(second.saturating_sub(1), 0)
			.with_flags(Scene::EASE_OUT | Scene::GRAVITY),
		Scene::new(450, &[Frame::F157])
			.with_repeat(9, 0)
			.with_flags(Scene::GRAVITY),
	]))
}

/// # For `Animation::Blink`.
pub(super) fn blink() -> SceneList {
	let repeat = 1 + Universe::rand_u16(5);

	SceneList::new(SceneListKind::Dynamic3([
		Scene::new(200, &[Frame::F009, Frame::F010])
			.with_flags(Scene::GRAVITY),
		Scene::new(150, &[
			Frame::F010, Frame::F010, Frame::F010, Frame::F010, Frame::F101,
			Frame::F102, Frame::F010, Frame::F010, Frame::F010, Frame::F010,
			Frame::F010, Frame::F010, Frame::F010, Frame::F010, Frame::F010,
			Frame::F010, Frame::F010, Frame::F010, Frame::F010, Frame::F010,
			Frame::F010, Frame::F010, Frame::F010,
		])
			.with_repeat(repeat, 0)
			.with_flags(Scene::GRAVITY),
		Scene::new(200, &[Frame::F010, Frame::F009])
			.with_flags(Scene::GRAVITY),
	]))
}

/// # For `Animation::BoredSleep`.
pub(super) fn bored_sleep() -> SceneList {
	let repeat = 30 + Universe::rand_u16(10);

	SceneList::new(SceneListKind::Dynamic2([
		Scene::new(200, &[
			Frame::F003, Frame::F009, Frame::F010, Frame::F034, Frame::F035,
			Frame::F034, Frame::F035, Frame::F036, Frame::F036,
		])
			.with_repeat(repeat, 7)
			.with_flags(Scene::GRAVITY),
		Scene::new(200, &[
			Frame::F035, Frame::F036, Frame::F036, Frame::F035, Frame::F034,
			Frame::F034, Frame::F034, Frame::F010, Frame::F009,
		])
			.with_flags(Scene::GRAVITY),
	]))
}

/// # For `Animation::ChaseAMartian`.
pub(super) const fn chase_a_martian(w: u16) -> SceneList {
	let repeat =
		if w >= 60 { w.wrapping_div(60) }
		else { 1 };

	SceneList::new(SceneListKind::Dynamic1([
		Scene::new(100, &[Frame::F005, Frame::F004, Frame::F004])
			.with_move_to(Position::new((repeat as i32 + 1) * -10 * 3, 0))
			.with_repeat(repeat, 0)
			.with_flags(Scene::GRAVITY | Scene::IGNORE_EDGES)
	]))
}

/// # For `Animation::ChaseAMartianChild`.
pub(super) const fn chase_a_martian_child(w: u16) -> SceneList {
	let repeat = w.wrapping_div(48) + 4;

	SceneList::new(SceneListKind::Dynamic1([
		Scene::new(100, &[Frame::F166, Frame::F167, Frame::F166, Frame::F168])
			.with_move_to(Position::new((repeat as i32 + 1) * -12 * 4, 0))
			.with_repeat(repeat, 0)
			.with_flags(Scene::GRAVITY | Scene::IGNORE_EDGES)
	]))
}

/// # For `Animation::Doze`.
pub(super) fn doze() -> SceneList {
	let repeat = 20 + Universe::rand_u16(10);

	SceneList::new(SceneListKind::Dynamic2([
		Scene::new(200, &[
			Frame::F003, Frame::F006, Frame::F007, Frame::F008,
			Frame::F008, Frame::F007, Frame::F008, Frame::F008,
		])
			.with_repeat(repeat, 6)
			.with_flags(Scene::GRAVITY),
		Scene::new(200, &[Frame::F008, Frame::F007, Frame::F006])
			.with_flags(Scene::GRAVITY),
	]))
}

/// # For `Animation::Sleep`.
pub(super) fn sleep() -> SceneList {
	let repeat = 10 + Universe::rand_u16(20);

	SceneList::new(SceneListKind::Dynamic2([
		Scene::new(300, &[
			Frame::F003, Frame::F107, Frame::F108, Frame::F107, Frame::F108,
			Frame::F107, Frame::F031, Frame::F032, Frame::F033, Frame::F000,
			Frame::F001,
		])
			.with_repeat(repeat, 9)
			.with_sound(Sound::Yawn, 1)
			.with_flags(Scene::GRAVITY),
		Scene::new(300, &[
			Frame::F000, Frame::F080, Frame::F079, Frame::F078, Frame::F077,
			Frame::F037, Frame::F038, Frame::F039, Frame::F038, Frame::F037,
			Frame::F006,
		])
			.with_sound(Sound::Yawn, 5)
			.with_flags(Scene::GRAVITY),
	]))
}

/// # For `Animation::Urinate`.
pub(super) fn urinate() -> SceneList {
	let repeat = 5 + Universe::rand_u16(10);

	SceneList::new(SceneListKind::Dynamic2([
		Scene::new(150, &[
			Frame::F003, Frame::F012, Frame::F013, Frame::F103,
			Frame::F104, Frame::F105, Frame::F106,
		])
			.with_repeat(repeat, 5)
			.with_flags(Scene::GRAVITY),
		Scene::new(105, &[
			Frame::F104, Frame::F105, Frame::F104, Frame::F104,
			Frame::F103, Frame::F013, Frame::F012,
		])
			.with_flags(Scene::GRAVITY),
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
	let first = distance.wrapping_div(30).saturating_sub(1);

	// The second movement has a rate of 3px by 2 frames, and should cover
	// whatever's left from the first, plus half a sprite.
	let second = (distance - first * 30 + Frame::SIZE.wrapping_div(2)).wrapping_div(6);

	(first, second)
}
