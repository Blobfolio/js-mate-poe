/*!
# RS Mate Poe: Universe
*/

use crate::{
	Frame,
	Position,
	State,
};
#[cfg(feature = "director")] use crate::{Animation, dom};
use std::sync::atomic::{
	AtomicU8,
	AtomicU32,
	AtomicU64,
	Ordering::SeqCst,
};
#[cfg(feature = "director")] use std::sync::atomic::AtomicU16;
#[cfg(target_arch = "wasm32")] use wasm_bindgen::prelude::*;



#[cfg(target_arch = "wasm32")]
#[wasm_bindgen]
extern "C" {
	#[allow(unsafe_code)]
	#[wasm_bindgen(js_namespace = Math, js_name = "random")]
	/// # Math.random.
	///
	/// This is the only `js_sys` thing we'd be using, so may as well handle
	/// the import manually.
	fn js_random() -> f64;
}



/// # Flags.
///
/// This holds a few basic bitflag runtime settings. (See the constants defined
/// on the [`Universe`] below.)
static FLAGS: AtomicU8 = AtomicU8::new(Universe::AUDIO);

#[cfg(feature = "director")]
/// # Next Animation.
///
/// This holds the `u8` equivalent of an animation requested from Browserland,
/// if any. Because those begin at `1`, zero is equivalent to none.
static NEXT_ANIMATION: AtomicU8 = AtomicU8::new(0);

/// # Mouse Coordinates.
///
/// This holds the (x, y) mouse coordinates captured while dragging.
///
/// The logical values for each are `i32`, but because they're always accessed
/// or updated as a pair, they're stored within a single 64-bit atomic.
static POS: AtomicU64 = AtomicU64::new(0);

/// # Xoshi Seed #1.
static SEED1: AtomicU64 = AtomicU64::new(0x8596_cc44_bef0_1aa0);

/// # Xoshi Seed #2.
static SEED2: AtomicU64 = AtomicU64::new(0x98d4_0948_da60_19ae);

/// # Xoshi Seed #3.
static SEED3: AtomicU64 = AtomicU64::new(0x49f1_3013_c503_a6aa);

/// # Xoshi Seed #4.
static SEED4: AtomicU64 = AtomicU64::new(0xc4d7_82ff_3c9f_7bef);

#[cfg(feature = "director")]
/// # Speed.
///
/// This holds the playback speed as an integer percentage in the range of
/// `0..=1000`, where `100` is normal.
static SPEED: AtomicU16 = AtomicU16::new(100);

/// # Screen Width and Height.
///
/// The dimensions are both `u16`, stored together because they're only ever
/// accessed/updated as a pair.
static SIZE: AtomicU32 = AtomicU32::new(0);



#[derive(Debug, Clone, Copy)]
/// # Universe.
///
/// This struct holds global settings that can be statically accessed from
/// anywhere within the application, mimicking Javascript's slutty inheritance
/// model, but safely because all of the data is atomic.
///
/// The [`Poe`](crate::Poe) struct exposes some of these settings — start/stop,
/// audio, speed — to the end user, but the rest are fully closed off.
pub(crate) struct Universe;

impl Universe {
	const ACTIVE: u8 =        0b0000_0001; // Poe is active.
	const AUDIO: u8 =         0b0000_0010; // Audio is enabled.
	const DRAGGING: u8 =      0b0000_0100; // Poe is currently being dragged.
	const ASSIGN_CHILD: u8 =  0b0000_1000; // The primary mate needs a child animation.
	const NO_CHILD: u8 =      0b0001_0000; // Children must be stopped!
	const STATE: u8 =         0b0010_0000; // State is active.
}

macro_rules! get {
	($title:literal, $flag:ident, $fn:ident) => (
		#[doc = concat!("# Is ", $title, "?")]
		#[inline]
		pub(crate) fn $fn() -> bool {
			Self::$flag == FLAGS.load(SeqCst) & Self::$flag
		}
	);
}

impl Universe {
	get!("Active", ACTIVE, active);
	get!("Audio Enabled", AUDIO, audio);
	get!("Dragging", DRAGGING, dragging);

	/// # Assign Child Animation?
	///
	/// Returns `true` if the previous mate requested a new child since the
	/// last time this method was called.
	pub(crate) fn assign_child() -> bool {
		let old = FLAGS.fetch_and(! Self::ASSIGN_CHILD, SeqCst);
		Self::ASSIGN_CHILD == old & Self::ASSIGN_CHILD
	}

	/// # Stop Child Animations?
	///
	/// Returns `true` if the previous mate requested the end to childhood.
	pub(crate) fn no_child() -> bool {
		let old = FLAGS.fetch_and(! Self::NO_CHILD, SeqCst);
		Self::NO_CHILD == old & Self::NO_CHILD
	}

	#[cfg(feature = "director")]
	#[inline]
	/// # Are We Paused?
	pub(crate) fn paused() -> bool { SPEED.load(SeqCst) == 0 }

	#[cfg(not(feature = "director"))]
	/// # We Aren't Paused.
	pub(crate) const fn paused() -> bool { false }

	/// # Position.
	///
	/// The current — or last recorded — X/Y position of the mouse on the
	/// screen.
	///
	/// This information is only captured when the primary Poe mate is being
	/// dragged, so will otherwise grow stale.
	pub(crate) fn pos() -> Position {
		let pos = POS.load(SeqCst).to_le_bytes();
		let x = i32::from_le_bytes([pos[0], pos[1], pos[2], pos[3]]);
		let y = i32::from_le_bytes([pos[4], pos[5], pos[6], pos[7]]);
		Position::new(x, y)
	}

	/// # Width/Height.
	///
	/// Returns the current — or last recorded — dimensions of the screen.
	///
	/// These are captured when the universe is first initialized and refreshed
	/// whenever the window is resized, but will grow stale when Poe has been
	/// de-activated.
	pub(crate) fn size() -> (u16, u16) {
		let size = SIZE.load(SeqCst).to_le_bytes();
		let width = u16::from_le_bytes([size[0], size[1]]);
		let height = u16::from_le_bytes([size[2], size[3]]);
		match (width, height) {
			(0, 0) => (1, 1),
			(0, h) => (1, h),
			(w, 0) => (w, 1),
			(w, h) => (w, h),
		}
	}
}

impl Universe {
	#[inline]
	/// # Random Value.
	///
	/// Return a random `u64` (xoshiro256).
	pub(crate) fn rand() -> u64 {
		let mut seeds = get_seeds();
		let out = seeds[1].overflowing_mul(5).0.rotate_left(7).overflowing_mul(9).0;
		update_seeds(&mut seeds);
		set_seeds(&seeds);
		out
	}

	#[allow(clippy::cast_possible_truncation)]
	/// # Random (Capped) U16.
	///
	/// Return a random number between `0..max`, mitigating bias the same way
	/// as `fastrand` (i.e. <https://lemire.me/blog/2016/06/30/fast-random-shuffling/>).
	pub(crate) fn rand_mod(n: u16) -> u16 {
		let mut r = Self::rand() as u16;
		let mut hi = mul_high_u16(r, n);
		let mut lo = r.wrapping_mul(n);
		if lo < n {
			let t = n.wrapping_neg() % n;
			while lo < t {
				r = Self::rand() as u16;
				hi = mul_high_u16(r, n);
				lo = r.wrapping_mul(n);
			}
		}
		hi
	}
}

macro_rules! set {
	($title:literal, $flag:ident, $fn:ident) => (
		#[doc = concat!("# Set ", $title, ".")]
		pub(crate) fn $fn(v: bool) {
			if v { FLAGS.fetch_or(Self::$flag, SeqCst); }
			else { FLAGS.fetch_and(! Self::$flag, SeqCst); }
		}
	);
}

impl Universe {
	set!("Allow Audio", AUDIO, set_audio);
	set!("Dragging", DRAGGING, set_dragging);
	set!("State", STATE, set_state);

	/// # Set Active.
	///
	/// Enable or disable the universe (and Poe, etc.), returning `true` if
	/// different than the previous state.
	pub(crate) fn set_active(v: bool) -> bool {
		if v == (0 != FLAGS.load(SeqCst) & (Self::ACTIVE | Self::STATE)) { false }
		else {
			if v {
				// Set active flag.
				FLAGS.fetch_or(Self::ACTIVE, SeqCst);

				// Seed future randomness if we can.
				#[cfg(target_arch = "wasm32")] reseed();

				// Set up the DOM elements and event bindings, and begin the
				// animation frame loop.
				State::init();
			}
			else {
				// Clear everything but the audio and state properties. (State
				// will clear itself in a moment, hopefully.)
				FLAGS.fetch_and(Self::AUDIO | Self::STATE, SeqCst);
			}
			true
		}
	}

	/// # Set Assign Child Flag.
	///
	/// This will also remove the incompatible no-child flag.
	pub(crate) fn set_assign_child() {
		if Self::NO_CHILD == FLAGS.fetch_or(Self::ASSIGN_CHILD, SeqCst) & Self::NO_CHILD {
			FLAGS.fetch_and(! Self::NO_CHILD, SeqCst);
		}
	}

	/// # Set No Child Flag.
	///
	/// This will also remove the incompatible assign-child flag.
	pub(crate) fn set_no_child() {
		if Self::ASSIGN_CHILD == FLAGS.fetch_or(Self::NO_CHILD, SeqCst) & Self::ASSIGN_CHILD {
			FLAGS.fetch_and(! Self::ASSIGN_CHILD, SeqCst);
		}
	}

	/// # Set Position.
	///
	/// Update the cached X/Y mouse coordinates, only used when dragging a
	/// Poe around the screen.
	pub(crate) fn set_pos(x: i32, y: i32) {
		let half_tile = Frame::SIZE_I.saturating_div(2);
		let x = x.saturating_sub(half_tile).to_le_bytes();
		let y = y.saturating_sub(half_tile).to_le_bytes();
		let pos = u64::from_le_bytes([
			x[0], x[1], x[2], x[3],
			y[0], y[1], y[2], y[3],
		]);
		POS.store(pos, SeqCst);
	}

	/// # Set Width/Height.
	///
	/// This updates the cached window dimensions.
	pub(crate) fn set_size(width: u16, height: u16) {
		let width = width.to_le_bytes();
		let height = height.to_le_bytes();
		SIZE.store(u32::from_le_bytes([width[0], width[1], height[0], height[1]]), SeqCst);
	}
}

#[cfg(feature = "director")]
impl Universe {
	/// # Speed.
	///
	/// Returns the current playback speed if other than "normal" or paused.
	pub(crate) fn speed() -> Option<f32> {
		let speed = SPEED.load(SeqCst);
		if speed == 0 || speed == 100 { None }
		else { Some(f32::from(speed) / 100.0) }
	}

	#[allow(clippy::cast_possible_truncation, clippy::cast_sign_loss)]
	/// # Set Speed.
	///
	/// Change the animation playback speed.
	pub(crate) fn set_speed(speed: f32) {
		// Clamp the range to something sane.
		let speed =
			if speed.is_nan() { 100.0 }
			else { (speed * 100.0).clamp(0.0, 1000.0) };

		// Store as an integer.
		SPEED.store(speed as u16, SeqCst);

		#[cfg(feature = "director")] dom::debug!(format!(
			"Playback Speed: {speed:.2}%"
		));
	}

	/// # Browserland Next Animation.
	///
	/// This returns (and clears) the animation set by `Poe.play`, if any.
	pub(crate) fn next_animation() -> Option<Animation> {
		Animation::from_u8(NEXT_ANIMATION.swap(0, SeqCst)).filter(|a| a.playable())
	}

	/// # Set Browserland Next Animation.
	///
	/// `Poe.play` uses this to manually override the primary mate's current
	/// animation.
	pub(crate) fn set_next_animation(next: u8) {
		NEXT_ANIMATION.store(next, SeqCst);
	}
}



#[inline]
/// # Get Seeds.
fn get_seeds() -> [u64; 4] {
	[
		SEED1.load(SeqCst),
		SEED2.load(SeqCst),
		SEED3.load(SeqCst),
		SEED4.load(SeqCst),
	]
}

#[inline]
/// # High 16 Product.
const fn mul_high_u16(a: u16, b: u16) -> u16 {
	(((a as u32) * (b as u32)) >> 16) as u16
}

#[cfg(target_arch = "wasm32")]
/// # Reseed Randomness.
fn reseed() {
	// Splitmix Math.random to give us a reasonable starting point for the
	// subsequent Xoshi randomness.
	let mut seed: u64 = js_random().to_bits();
	let mut seeds = [0_u64; 4];
	for i in &mut seeds { *i = splitmix(&mut seed); }
	set_seeds(&seeds);

	// Print a debug message if we care about that sort of thing.
	#[cfg(feature = "director")]
	dom::debug!(format!(
		"PNRG1: {:016x}\nPNRG2: {:016x}\nPNRG3: {:016x}\nPNRG4: {:016x}",
		seeds[0],
		seeds[1],
		seeds[2],
		seeds[3],
	));
}

/// # Set Seeds.
fn set_seeds(seeds: &[u64; 4]) {
	// We are unlikely to wind up with all zeroes, but just in case…
	if seeds[0] == 0 && seeds[1] == 0 && seeds[2] == 0 && seeds[3] == 0 {
		SEED1.store(0x8596_cc44_bef0_1aa0, SeqCst);
		SEED2.store(0x98d4_0948_da60_19ae, SeqCst);
		SEED3.store(0x49f1_3013_c503_a6aa, SeqCst);
		SEED4.store(0xc4d7_82ff_3c9f_7bef, SeqCst);
	}
	else {
		SEED1.store(seeds[0], SeqCst);
		SEED2.store(seeds[1], SeqCst);
		SEED3.store(seeds[2], SeqCst);
		SEED4.store(seeds[3], SeqCst);
	}
}

/// # Update Seeds.
fn update_seeds(seeds: &mut[u64; 4]) {
	let t = seeds[1] << 17;
	seeds[2] ^= seeds[0];
	seeds[3] ^= seeds[1];
	seeds[1] ^= seeds[2];
	seeds[0] ^= seeds[3];
	seeds[2] ^= t;
	seeds[3] =  seeds[3].rotate_left(45);
}

#[cfg(target_arch = "wasm32")]
/// # Split/Mix.
///
/// This is used to generate our Xoshi256 seeds from a single source `u64`.
fn splitmix(seed: &mut u64) -> u64 {
	// Update the source seed.
	*seed = seed.overflowing_add(0x9e37_79b9_7f4a_7c15).0;

	// Calculate and return a random value.
	let mut z: u64 = (*seed ^ (*seed >> 30)).overflowing_mul(0xbf58_476d_1ce4_e5b9).0;
	z = (z ^ (z >> 27)).overflowing_mul(0x94d0_49bb_1331_11eb).0;
	z ^ (z >> 31)
}



#[cfg(test)]
mod tests {
	use super::*;
	use std::collections::HashSet;

	#[test]
	fn t_rand() {
		assert_eq!(Universe::rand_mod(0), 0, "Random zero broke!");

		let set = (0..5000_u16).into_iter()
			.map(|_| Universe::rand_mod(100))
			.collect::<HashSet<u16>>();

		assert!(set.iter().all(|n| *n < 100), "Value(s) out of range.");
		assert_eq!(
			set.len(),
			100,
			"Failed to collect 100/100 possibilities in 5000 tries."
		);
	}
}
