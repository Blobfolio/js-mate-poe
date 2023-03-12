/*!
# RS Mate Poe: Universe
*/

use crate::{
	Position,
	Sprite,
	State,
};
#[cfg(feature = "director")] use crate::{Animation, dom};
use std::sync::atomic::{
	AtomicU8,
	AtomicU16,
	AtomicU32,
	AtomicU64,
	Ordering::SeqCst,
};



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

/// # Random Seed.
///
/// This holds the seed for our ~~weak~~ simple, local PNRG. The default value
/// is only for testing; in browser contexts it is reseeded with `Math.random`
/// during initialization.
static SEED: AtomicU64 = AtomicU64::new(0x8a5c_d789_635d_2dff);

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

	#[inline]
	/// # Are We Paused?
	pub(crate) fn paused() -> bool { SPEED.load(SeqCst) == 0 }

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

	/// # Speed.
	///
	/// Returns the current playback speed if other than "normal" or paused.
	pub(crate) fn speed() -> Option<f32> {
		let speed = SPEED.load(SeqCst);
		if speed == 0 || speed == 100 { None }
		else { Some(f32::from(speed) / 100.0) }
	}
}

impl Universe {
	/// # Random Value.
	///
	/// Return a random `u64`.
	pub(crate) fn rand() -> u64 {
		let mut seed = SEED.load(SeqCst);
		seed ^= seed << 13;
		seed ^= seed >> 7;
		seed ^= seed << 17;
		SEED.store(seed, SeqCst);
		seed
	}

	#[allow(clippy::cast_possible_truncation)]
	/// # Random (Capped) U16.
	///
	/// Return a random number between `0..max`.
	pub(crate) fn rand_u16(max: u16) -> u16 {
		if max == 0 { 0 }
		else { (Self::rand() % u64::from(max)) as u16 }
	}
}

impl Universe {
	#[cfg(target_arch = "wasm32")]
	#[allow(clippy::cast_sign_loss, clippy::cast_possible_truncation, clippy::cast_precision_loss)]
	/// # Reseed Randomness.
	fn reseed() {
		// Convert the f64 into a decent u64. This misses out on some of the
		// possible range, but is good enough for our purposes.
		let seed = (js_sys::Math::random() * (1u64 << f64::MANTISSA_DIGITS) as f64) as u64;
		if seed != 0 {
			SEED.store(seed, SeqCst);
			#[cfg(feature = "director")] dom::debug!(format!(
				"Resseded PRNG with {seed}."
			));
		}
	}

	/// # Set Width/Height.
	///
	/// This updates the cached window dimensions.
	pub(crate) fn resize(width: u16, height: u16) {
		let width = width.to_le_bytes();
		let height = height.to_le_bytes();
		SIZE.store(u32::from_le_bytes([width[0], width[1], height[0], height[1]]), SeqCst);
	}

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
				#[cfg(target_arch = "wasm32")] Self::reseed();

				// Set up the DOM elements and event bindings, and being the
				// animation frame loop.
				State::init();
			}
			else {
				FLAGS.fetch_and(Self::AUDIO | Self::STATE, SeqCst);
			}
			true
		}
	}

	/// # Set Assign Child Flag.
	///
	/// This will also remove the incompatible no-child flag.
	pub(crate) fn set_assign_child() {
		FLAGS.fetch_or(Self::ASSIGN_CHILD, SeqCst);
		FLAGS.fetch_and(! Self::NO_CHILD, SeqCst);
	}

	/// # Set Allow Audio.
	///
	/// Enables or disables audio playback.
	pub(crate) fn set_audio(v: bool) {
		if v { FLAGS.fetch_or(Self::AUDIO, SeqCst); }
		else { FLAGS.fetch_and(! Self::AUDIO, SeqCst); }
	}

	/// # Set Dragging.
	///
	/// Enables or disables the `DRAGGING` flag used to capture mouse
	/// positioning during a drag event.
	pub(crate) fn set_dragging(v: bool) {
		if v { FLAGS.fetch_or(Self::DRAGGING, SeqCst); }
		else { FLAGS.fetch_and(! Self::DRAGGING, SeqCst); }
	}

	/// # Set No Child Flag.
	///
	/// This will also remove the incompatible assign-child flag.
	pub(crate) fn set_no_child() {
		FLAGS.fetch_or(Self::NO_CHILD, SeqCst);
		FLAGS.fetch_and(! Self::ASSIGN_CHILD, SeqCst);
	}

	/// # Set Position.
	///
	/// Update the cached X/Y mouse coordinates, only used when dragging a
	/// Poe around the screen.
	pub(crate) fn set_pos(x: i32, y: i32) {
		let half_tile = Sprite::TILE_SIZE_I.saturating_div(2);
		let x = x.saturating_sub(half_tile).to_le_bytes();
		let y = y.saturating_sub(half_tile).to_le_bytes();
		let pos = u64::from_le_bytes([
			x[0], x[1], x[2], x[3],
			y[0], y[1], y[2], y[3],
		]);
		POS.store(pos, SeqCst);
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

	/// # Set State Active.
	///
	/// Enables or disables the secondary STATE flag.
	pub(crate) fn set_state(v: bool) {
		if v { FLAGS.fetch_or(Self::STATE, SeqCst); }
		else { FLAGS.fetch_and(! Self::STATE, SeqCst); }
	}
}

#[cfg(feature = "director")]
impl Universe {
	/// # Browserland Next Animation.
	///
	/// This returns (and clears) the animation set by `Poe.play`, if any.
	pub(crate) fn next_animation() -> Option<Animation> {
		Animation::from_u8(NEXT_ANIMATION.swap(0, SeqCst))
	}

	/// # Set Browserland Next Animation.
	///
	/// `Poe.play` uses this to manually override the primary mate's current
	/// animation.
	pub(crate) fn set_next_animation(next: u8) {
		NEXT_ANIMATION.store(next, SeqCst);
	}
}



#[cfg(test)]
mod tests {
	use super::*;

	#[test]
	fn t_rand_u16() {
		let mut all = Vec::with_capacity(5000);
		for _ in 0..5000 {
			let x = Universe::rand_u16(100);
			assert!((0..100).contains(&x), "Random u16 out of range: {x}");
			all.push(x);
		}

		all.sort_unstable();
		all.dedup();
		assert_eq!(
			all.len(),
			100,
			"Failed to collect 100/100 possibilities in 5000 tries."
		);
	}
}
