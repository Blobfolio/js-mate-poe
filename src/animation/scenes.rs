/*!
# RS Mate Poe: Scene Details
*/

use crate::{
	Position,
	Scene,
	SceneList,
	Sound,
	Sprite,
	Universe,
};
use super::SceneListKind;



/// # For `Animation::Abduction`.
pub(super) const ABDUCTION: &[Scene] = &[
	Scene::new(254, &[9, 10, 10, 10, 10, 34])
		.with_repeat(11, 5)
		.with_flags(Scene::GRAVITY),
	Scene::new(200, &[34, 81])
		.with_flags(Scene::GRAVITY),
	Scene::new(83, &[
		88, 89, 90, 88, 89, 90, 88, 89, 90,
		Sprite::EMPTY_TILE, 89, Sprite::EMPTY_TILE,
		88, Sprite::EMPTY_TILE, 90,
		Sprite::EMPTY_TILE, 89, Sprite::EMPTY_TILE,
		88, Sprite::EMPTY_TILE, 90,
		Sprite::EMPTY_TILE, 89, Sprite::EMPTY_TILE,
	])
		.with_move_to(Position::new(0, -30)),
	Scene::new(5500, &[Sprite::EMPTY_TILE])
];

/// # For `Animation::AbductionChild`.
pub(super) const ABDUCTION_CHILD: &[Scene] = &[
	Scene::new(28, &[158, 159, 160, 161])
		.with_move_to(Position::new(0, 480))
		.with_repeat(29, 0)
		.with_flags(Scene::EASE_OUT | Scene::IGNORE_EDGES),
	Scene::new(50, &[162, 163, 164, 165])
		.with_repeat(18, 0)
		.with_flags(Scene::IGNORE_EDGES),
	Scene::new(30, &[158, 159, 160, 161])
		.with_move_to(Position::new(600, -480))
		.with_repeat(29, 0)
		.with_flags(Scene::EASE_IN | Scene::IGNORE_EDGES),
];

/// # For `Animation::BathCoolDown`.
pub(super) const BATH_COOL_DOWN: &[Scene] = &[
	Scene::new(100, &[169, 169, 169, 170, 171, 170, 169, 169])
		.with_repeat(2, 0)
		.with_flags(Scene::GRAVITY),
	Scene::new(100, &[119, 81, 81, 82, 82, 10])
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::BathDive`.
pub(super) const BATH_DIVE: &[Scene] = &[
	Scene::new(30, &[134])
		.with_move_to(Position::new(-588, 441))
		.with_repeat(144, 0),
	Scene::new(
		30,
		&[
			135, 135, 135, 135, 136, 136, 136, 136, 137, 137, 137, 137,
			138, 138, 138, 138, 139, 139, 139, 139, 140, 140, 140, 140,
			141, 141, 141, 141, 142, 142, 142, 142, 143, 143, 143, 143,
			144, 144, 144, 144, 145, 144,
		],
	)
		.with_move_to(Position::new(-192, 144))
		.with_repeat(3, 40),
];

/// # For `Animation::BathDiveChild`.
pub(super) const BATH_DIVE_CHILD: &[Scene] = &[
	Scene::new(30, &[146])
		.with_repeat(171, 0)
		.with_flags(Scene::GRAVITY),
	Scene::new(
		30,
		&[
			146, 146, 146, 146, 146, 146, 146, 146, 146, 146, 146, 146,
			147, 147, 148, 148, 148, 147, 147, 146,
		],
	)
		.with_repeat(70, 19)
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::Beg`.
pub(super) const BEG: &[Scene] = &[
	Scene::new(150, &[9, 10, 54, 55, 54, 55, 54, 55, 34, 34, 34, 34, 34, 34, 10, 9])
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::BeginRun`.
pub(super) const BEGIN_END_RUN: &[Scene] = &[
	Scene::new(100, &[2, 3])
		.with_move_to(Position::new(-24, 0))
		.with_repeat(2, 0)
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::BigFish`.
pub(super) const BIG_FISH: &[Scene] = &[
	Scene::new(60, &[5, 5, 4, 4, 4])
		.with_move_to(Position::new(-210, 0))
		.with_repeat(6, 0)
		.with_flags(Scene::GRAVITY),
	Scene::new(2000, &[Sprite::EMPTY_TILE])
		.with_move_to(Position::new(-100, Sprite::TILE_SIZE_I))
		.with_flags(Scene::IGNORE_EDGES),
	Scene::new(50, &[30])
		.with_move_to(Position::new(-5, -30))
		.with_repeat(4, 0)
		.with_flags(Scene::IGNORE_EDGES),
	Scene::new(50, &[23])
		.with_move_to(Position::new(0, -10))
		.with_repeat(1, 0)
		.with_flags(Scene::IGNORE_EDGES),
	Scene::new(100, &[23, 23, 23, 77, 78, 3])
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::BigFishChild`.
pub(super) const BIG_FISH_CHILD: &[Scene] = &[
	Scene::new(1000, &[58])
		.with_flags(Scene::IGNORE_EDGES),
	Scene::new(25, &[58])
		.with_move_to(Position::new(-175, -75))
		.with_repeat(24, 0)
		.with_flags(Scene::IGNORE_EDGES),
	Scene::new(25, &[59, 59, 59, 59, 59, 58, 58, 60, 60, 61])
		.with_move_to(Position::new(-40, 0))
		.with_flags(Scene::IGNORE_EDGES),
	Scene::new(25, &[61, 60, 61, 60, 61])
		.with_move_to(Position::new(-150, 75))
		.with_repeat(4, 0)
		.with_flags(Scene::IGNORE_EDGES),
];

/// # For `Animation::Bleat`.
pub(super) const BLEAT: &[Scene] = &[
	Scene::new(200, &[3, 71, 72, 71, 72, 71, 3])
		.with_sound(Sound::Baa, 1)
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::Boing`.
pub(super) const BOING: &[Scene] = &[
	Scene::new(100, &[62, 62, 63, 64, 65, 66, 67, 68, 69, 70, 6])
		.with_move_to(Position::new(55, 0))
		.with_flags(Scene::EASE_OUT | Scene::GRAVITY),
];

/// # For `Animation::Bounce`.
pub(super) const BOUNCE: &[Scene] = &[
	Scene::new(100, &[42, 49, 42])
		.with_flags(Scene::GRAVITY),
	Scene::new(100, &[131, 42])
		.with_move_to(Position::new(0, -6)),
	Scene::new(100, &[132]),
	Scene::new(100, &[42, 49])
		.with_move_to(Position::new(0, 6)),
	Scene::new(100, &[13, 12, 3, 9, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 9, 3])
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::ClimbDown`.
pub(super) const CLIMB_DOWN: &[Scene] = &[
	Scene::new(150, &[19, 20])
		.with_move_to(Position::new(0, 84))
		.with_repeat(20, 0),
];

/// # For `Animation::ClimbUp`.
pub(super) const CLIMB_UP: &[Scene] = &[
	Scene::new(150, &[15, 16])
		.with_move_to(Position::new(0, -84))
		.with_repeat(20, 0),
];

/// # For `Animation::DangleFall`.
pub(super) const DANGLE_FALL: &[Scene] = &[
	Scene::new(100, &[46, 47])
		.with_repeat(10, 0),
];

/// # For `Animation::DangleRecover`.
pub(super) const DANGLE_RECOVER: &[Scene] = &[
	Scene::new(200, &[88, 89, 90])
		.with_move_to(Position::new(-30, 0))
		.with_repeat(1, 0),
	Scene::new(100, &[81, 81, 81, 82, 10, 9, 3]),
];

/// # For `Animation::DeepThoughts`.
pub(super) const DEEP_THOUGHTS: &[Scene] = &[
	Scene::new(50, &[3, 3, 3, 3, 3, 73])
		.with_repeat(15, 5),
	Scene::new(50, &[50, 51])
		.with_repeat(12, 0),
	Scene::new(150, &[3, 9, 10])
		.with_flags(Scene::FLIP_X_NEXT),
	Scene::new(150, &[10, 9, 3]),
];

/// # For `Animation::Drag`.
pub(super) const DRAG: &[Scene] = &[
	Scene::new(150, &[42, 43, 43, 42, 44, 44])
		.with_repeat(2, 0),
];

/// # For `Animation::Eat`.
pub(super) const EAT: &[Scene] = &[
	Scene::new(190, &[6, 6, 6, 6, 58, 59, 59, 60, 61, 60, 61, 6])
		.with_repeat(5, 5)
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::Fall`.
pub(super) const FALL: &[Scene] = &[
	Scene::new(20, &[133])
		.with_move_to(Position::new(0, 250))
		.with_repeat(49, 0)
		.with_flags(Scene::EASE_IN),
];

/// # For `Animation::FlowerChild`.
pub(super) const FLOWER_CHILD: &[Scene] = &[
	Scene::new(
		205,
		&[
			153, 153, 153, 153, 153, 153, 153, 153, 153, 149, 149, 149,
			149, 149, 149, 149, 149, 149, 150, 150, 150, 150, 150, 150,
			150, 151, 151, 151, 151, 151, 151, 151, 152,
		],
	)
		.with_repeat(11, 32)
		.with_flags(Scene::GRAVITY | Scene::IGNORE_EDGES),
];

/// # For `Animation::GraspingFall`.
pub(super) const GRASPING_FALL: &[Scene] = &[
	Scene::new(15, &[46, 46, 46, 46, 46, 46, 47, 47, 47, 47, 47, 47])
		.with_move_to(Position::new(0, 840))
		.with_repeat(9, 0),
];

/// # For `Animation::Handstand`.
pub(super) const HANDSTAND: &[Scene] = &[
	Scene::new(200, &[86, 87, 88, 89, 90, 88, 89, 90, 87, 86])
		.with_move_to(Position::new(-20, 0))
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::Jump`.
pub(super) const JUMP: &[Scene] = &[
	Scene::new(40, &[76, 76, 30])
		.with_move_to(Position::new(-50, -30))
		.with_repeat(7, 2),
	Scene::new(25, &[23])
		.with_move_to(Position::new(-32, 0))
		.with_repeat(3, 0),
	Scene::new(40, &[24, 24, 24, 24, 24, 24, 24, 24, 77, 77])
		.with_move_to(Position::new(-50, 30)),
];

/// # For `Animation::PlayDead`.
pub(super) const PLAY_DEAD: &[Scene] = &[
	Scene::new(100, &[3, 96, 96, 96, 96, 96, 96, 96, 96, 96, 96, 95])
		.with_repeat(4, 11)
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::ReachCeiling`.
pub(super) const REACH_CEILING: &[Scene] = &[
	Scene::new(100, &[16, 17, 28])
		.with_move_to(Position::new(3, 0))
		.with_flags(Scene::FLIP_X_NEXT),
];

/// # For `Animation::ReachFloor`.
pub(super) const REACH_FLOOR: &[Scene] = &[Scene::new(150, &[24, 6, 6, 6, 6, 6])];

/// # For `Animation::ReachSide1`.
pub(super) const REACH_SIDE1: &[Scene] = &[
	Scene::new(200, &[31, 30])
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::ReachSide2`.
pub(super) const REACH_SIDE2: &[Scene] = &[
	Scene::new(200, &[26])
		.with_flags(Scene::FLIP_X_NEXT),
];

/// # For `Animation::Rest`.
pub(super) const REST: &[Scene] = &[
	Scene::new(200, &[3, 12, 92, 93])
		.with_repeat(20, 3)
		.with_flags(Scene::GRAVITY),
	Scene::new(2000, &[94])
		.with_flags(Scene::GRAVITY),
	Scene::new(200, &[93, 93, 93, 93, 92, 12, 3])
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::Roll`.
pub(super) const ROLL: &[Scene] = &[
	Scene::new(150, &[9, 10, 10])
		.with_flags(Scene::GRAVITY),
	Scene::new(50, &[10, 118, 117, 116, 115, 114, 113, 112])
		.with_move_to(Position::new(-128, 0))
		.with_repeat(1, 0)
		.with_flags(Scene::GRAVITY),
	Scene::new(150, &[10, 10, 9])
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::Rotate`.
pub(super) const ROTATE: &[Scene] = &[
	Scene::new(150, &[3, 9, 10])
		.with_flags(Scene::FLIP_X_NEXT | Scene::GRAVITY),
	Scene::new(150, &[10, 9, 3])
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::Run`.
pub(super) const RUN: &[Scene] = &[
	Scene::new(60, &[5, 5, 4, 4, 4])
		.with_move_to(Position::new(-180, 0))
		.with_repeat(5, 0)
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::RunDown`.
pub(super) const RUN_DOWN: &[Scene] = &[
	Scene::new(60, &[22, 22, 21, 21, 21])
		.with_move_to(Position::new(0, 180))
		.with_repeat(5, 0),
];

/// # For `Animation::RunUpsideDown`.
pub(super) const RUN_UPSIDE_DOWN: &[Scene] = &[
	Scene::new(60, &[99, 99, 100, 100, 100])
		.with_move_to(Position::new(-180, 0))
		.with_repeat(5, 0),
];

/// # For `Animation::Scoot`.
pub(super) const SCOOT: &[Scene] = &[
	Scene::new(200, &[52])
		.with_flags(Scene::GRAVITY),
	Scene::new(200, &[53])
		.with_move_to(Position::new(6, 0))
		.with_flags(Scene::GRAVITY),
	Scene::new(200, &[52])
		.with_flags(Scene::GRAVITY),
	Scene::new(200, &[53])
		.with_move_to(Position::new(6, 0))
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::Scratch`.
pub(super) const SCRATCH: &[Scene] = &[
	Scene::new(150, &[56, 57])
		.with_repeat(3, 0)
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::Scream`.
pub(super) const SCREAM: &[Scene] = &[
	Scene::new(50, &[50, 51])
		.with_repeat(12, 0)
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::Slide`.
pub(super) const SLIDE: &[Scene] = &[
	Scene::new(100, &[24, 23, 23, 23, 23, 23, 31, 3, 3, 3, 3])
		.with_move_to(Position::new(-22, 0))
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::SlideDown`.
pub(super) const SLIDE_DOWN: &[Scene] = &[
	Scene::new(30, &[25])
		.with_move_to(Position::new(0, 260))
		.with_repeat(25, 0),
];

/// # For `Animation::Sneeze`.
pub(super) const SNEEZE: &[Scene] = &[
	Scene::new(200, &[108, 109, 110, 111, 110, 111, 110, 3])
		.with_sound(Sound::Sneeze, 0)
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::SneezeShadow`.
pub(super) const SNEEZE_SHADOW: &[Scene] = &[
	Scene::new(100, &[Sprite::EMPTY_TILE, Sprite::EMPTY_TILE, 109])
		.with_move_to(Position::new(60, 0))
		.with_repeat(3, 2)
		.with_flags(Scene::GRAVITY | Scene::IGNORE_EDGES),
];

/// # For `Animation::Spin`.
pub(super) const SPIN: &[Scene] = &[
	Scene::new(100, &[3, 9, 10, 11, 14, 13, 12, 7, 9, 101, 11, 14, 13, 12])
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::Splat`.
pub(super) const SPLAT: &[Scene] = &[
	Scene::new(200, &[48, 48, 48, 48, 47])
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::Stargaze`.
pub(super) const STARGAZE: &[Scene] = &[
	Scene::new(50, &[2, 3])
		.with_move_to(Position::new(-44, 0))
		.with_repeat(10, 0)
		.with_flags(Scene::GRAVITY),
	Scene::new(50, &[3, 3, 3, 3, 3, 73])
		.with_repeat(15, 5)
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::StargazeChild`.
pub(super) const STARGAZE_CHILD: &[Scene] = &[
	Scene::new(52, &[158])
		.with_repeat(20, 0)
		.with_flags(Scene::IGNORE_EDGES),
	Scene::new(6, &[158, 159, 160, 161])
		.with_move_to(Position::new(820, -164))
		.with_repeat(40, 0)
		.with_flags(Scene::IGNORE_EDGES),
];

/// # For `Animation::Walk`.
pub(super) const WALK: &[Scene] = &[
	Scene::new(150, &[2, 3])
		.with_move_to(Position::new(-84, 0))
		.with_repeat(20, 0)
		.with_flags(Scene::GRAVITY),
];

/// # For `Animation::WalkUpsideDown`.
pub(super) const WALK_UPSIDE_DOWN: &[Scene] = &[
	Scene::new(150, &[98, 97])
		.with_move_to(Position::new(-84, 0))
		.with_repeat(20, 0),
];

/// # For `Animation::WallSlide`.
pub(super) const WALL_SLIDE: &[Scene] = &[
	Scene::new(40, &[29])
		.with_move_to(Position::new(0, 55))
		.with_repeat(10, 0),
];

/// # For `Animation::Yoyo`.
pub(super) const YOYO: &[Scene] = &[
	Scene::new(16, &[119, 120, 121, 122, 123, 124, 125, 126])
		.with_move_to(Position::new(0, 528))
		.with_repeat(5, 0)
		.with_flags(Scene::EASE_IN | Scene::IGNORE_EDGES),
	Scene::new(18, &[112, 113, 114, 115, 116, 117, 118, 110])
		.with_move_to(Position::new(0, -16)),
	Scene::new(18, &[112, 113, 114, 115, 116, 117, 118, 110])
		.with_move_to(Position::new(0, 16)),
	Scene::new(18, &[112, 113, 114, 115, 116, 117, 118, 110])
		.with_move_to(Position::new(0, -16)),
	Scene::new(16, &[119, 120, 121, 122, 123, 124, 125, 126])
		.with_move_to(Position::new(0, -528))
		.with_repeat(5, 0)
		.with_flags(Scene::EASE_OUT | Scene::IGNORE_EDGES),
];

/// # For `Animation::BlackSheepChase`.
pub(super) const fn black_sheep_chase(w: u16) -> SceneList {
	let repeat = (w + Sprite::TILE_SIZE * 4).wrapping_div(30) + 2;

	SceneList::new(SceneListKind::Dynamic2([
		Scene::new(100, &[5, 4, 4])
			.with_move_to(Position::new(repeat as i32 * -10 * 3, 0))
			.with_repeat(repeat - 1, 0)
			.with_flags(Scene::FLIP_X_NEXT | Scene::GRAVITY | Scene::IGNORE_EDGES),
		Scene::new(50, &[5, 5, 4, 4, 4, 4])
			.with_move_to(Position::new(4 * -10 * 3, 0))
			.with_repeat(3, 0)
			.with_flags(Scene::GRAVITY | Scene::IGNORE_EDGES),
	]))
}

/// # For `Animation::BlackSheepChaseChild`.
pub(super) const fn black_sheep_chase_child(w: u16) -> SceneList {
	let repeat = (w + Sprite::TILE_SIZE * 2).wrapping_div(30) + 2;

	SceneList::new(SceneListKind::Dynamic1([
		Scene::new(100, &[155, 154, 154])
			.with_move_to(Position::new(repeat as i32 * 10 * 3, 0))
			.with_repeat(repeat - 1, 0)
			.with_flags(Scene::GRAVITY | Scene::IGNORE_EDGES),
	]))
}

/// # For `Animation::BlackSheepRomance`.
pub(super) const fn black_sheep_romance(w: u16) -> SceneList {
	let (first, second) = scale_black_sheep_romance(w);

	SceneList::new(SceneListKind::Dynamic3([
		Scene::new(100, &[5, 4, 4])
			.with_move_to(Position::new(first as i32 * -10 * 3, 0))
			.with_repeat(first.saturating_sub(1), 0)
			.with_flags(Scene::GRAVITY),
		Scene::new(100, &[2, 3])
			.with_move_to(Position::new(second as i32 * -3 * 2, 0))
			.with_repeat(second.saturating_sub(1), 0)
			.with_flags(Scene::EASE_OUT | Scene::GRAVITY),
		Scene::new(
			411,
			&[8, 3, 3, 3, 127, 128, 129, 130, 130, 130, 130, 129, 128, 127, 3, 3, 3]
		)
			.with_flags(Scene::GRAVITY),
	]))
}

/// # For `Animation::BlackSheepRomanceChild`.
pub(super) const fn black_sheep_romance_child(w: u16) -> SceneList {
	let (first, second) = scale_black_sheep_romance(w);

	SceneList::new(SceneListKind::Dynamic3([
		Scene::new(100, &[155, 154, 154])
			.with_move_to(Position::new(first as i32 * 10 * 3, 0))
			.with_repeat(first.saturating_sub(1), 0)
			.with_flags(Scene::GRAVITY),
		Scene::new(100, &[156, 157])
			.with_move_to(Position::new(second as i32 * 3 * 2, 0))
			.with_repeat(second.saturating_sub(1), 0)
			.with_flags(Scene::EASE_OUT | Scene::GRAVITY),
		Scene::new(450, &[157])
			.with_repeat(9, 0)
			.with_flags(Scene::GRAVITY),
	]))
}

/// # For `Animation::Blink`.
pub(super) fn blink() -> SceneList {
	let repeat = 1 + Universe::rand_u16(5);

	SceneList::new(SceneListKind::Dynamic3([
		Scene::new(200, &[9, 10])
			.with_flags(Scene::GRAVITY),
		Scene::new(150, &[
			10, 10, 10, 10, 101, 102, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10,
			10, 10, 10, 10, 10, 10, 10,
		])
			.with_repeat(repeat, 0)
			.with_flags(Scene::GRAVITY),
		Scene::new(200, &[10, 9])
			.with_flags(Scene::GRAVITY),
	]))
}

/// # For `Animation::BoredSleep`.
pub(super) fn bored_sleep() -> SceneList {
	let repeat = 30 + Universe::rand_u16(10);

	SceneList::new(SceneListKind::Dynamic2([
		Scene::new(200, &[3, 9, 10, 34, 35, 34, 35, 36, 36])
			.with_repeat(repeat, 7)
			.with_flags(Scene::GRAVITY),
		Scene::new(200, &[35, 36, 36, 35, 34, 34, 34, 10, 9])
			.with_flags(Scene::GRAVITY),
	]))
}

/// # For `Animation::ChaseAMartian`.
pub(super) const fn chase_a_martian(w: u16) -> SceneList {
	let repeat =
		if w >= 60 { w.wrapping_div(60) }
		else { 1 };

	SceneList::new(SceneListKind::Dynamic1([
		Scene::new(100, &[5, 4, 4])
			.with_move_to(Position::new((repeat as i32 + 1) * -10 * 3, 0))
			.with_repeat(repeat, 0)
			.with_flags(Scene::GRAVITY | Scene::IGNORE_EDGES)
	]))
}

/// # For `Animation::ChaseAMartianChild`.
pub(super) const fn chase_a_martian_child(w: u16) -> SceneList {
	let repeat = w.wrapping_div(48) + 4;

	SceneList::new(SceneListKind::Dynamic1([
		Scene::new(100, &[166, 167, 166, 168])
			.with_move_to(Position::new((repeat as i32 + 1) * -12 * 4, 0))
			.with_repeat(repeat, 0)
			.with_flags(Scene::GRAVITY | Scene::IGNORE_EDGES)
	]))
}

/// # For `Animation::Doze`.
pub(super) fn doze() -> SceneList {
	let repeat = 20 + Universe::rand_u16(10);

	SceneList::new(SceneListKind::Dynamic2([
		Scene::new(200, &[3, 6, 7, 8, 8, 7, 8, 8])
			.with_repeat(repeat, 6)
			.with_flags(Scene::GRAVITY),
		Scene::new(200, &[8, 7, 6])
			.with_flags(Scene::GRAVITY),
	]))
}

/// # For `Animation::Sleep`.
pub(super) fn sleep() -> SceneList {
	let repeat = 10 + Universe::rand_u16(20);

	SceneList::new(SceneListKind::Dynamic2([
		Scene::new(300, &[3, 107, 108, 107, 108, 107, 31, 32, 33, 0, 1])
			.with_repeat(repeat, 9)
			.with_sound(Sound::Yawn, 1)
			.with_flags(Scene::GRAVITY),
		Scene::new(300, &[0, 80, 79, 78, 77, 37, 38, 39, 38, 37, 6])
			.with_sound(Sound::Yawn, 5)
			.with_flags(Scene::GRAVITY),
	]))
}

/// # For `Animation::Urinate`.
pub(super) fn urinate() -> SceneList {
	let repeat = 5 + Universe::rand_u16(10);

	SceneList::new(SceneListKind::Dynamic2([
		Scene::new(150, &[3, 12, 13, 103, 104, 105, 106])
			.with_repeat(repeat, 5)
			.with_flags(Scene::GRAVITY),
		Scene::new(105, &[104, 105, 104, 104, 103, 13, 12])
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
	let second = (distance - first * 30 + Sprite::TILE_SIZE.wrapping_div(2)).wrapping_div(6);

	(first, second)
}
