/*!
# RS Mate Poe
*/

#![deny(unsafe_code)]

#![warn(
	clippy::filetype_is_file,
	clippy::integer_division,
	clippy::needless_borrow,
	clippy::nursery,
	clippy::pedantic,
	clippy::perf,
	clippy::suboptimal_flops,
	clippy::unneeded_field_pattern,
	macro_use_extern_crate,
	missing_copy_implementations,
	missing_debug_implementations,
	missing_docs,
	non_ascii_idents,
	trivial_casts,
	trivial_numeric_casts,
	unreachable_pub,
	unused_crate_dependencies,
	unused_extern_crates,
	unused_import_braces,
)]

#![allow(
	clippy::module_name_repetitions,
	clippy::redundant_pub_crate,
)]

#[cfg(target_arch = "wasm32")]
#[global_allocator]
static ALLOCATOR: lol_alloc::LockedAllocator<lol_alloc::FreeListAllocator> = lol_alloc::LockedAllocator::new(lol_alloc::FreeListAllocator::new());

mod animation;
mod assets;
pub(crate) mod dom;
mod mate;
mod position;
mod state;
mod universe;



pub(crate) use animation::{
	Animation,
	scene::{
		Scene,
		SceneList,
		Step,
	},
};
pub(crate) use assets::{
	Sound,
	Sprite,
};
pub(crate) use mate::Mate;
pub(crate) use position::{
	Direction,
	Position,
};
pub(crate) use state::State;
pub(crate) use universe::Universe;

use wasm_bindgen::prelude::*;



#[cfg(feature = "director")]
#[wasm_bindgen(start)]
#[allow(clippy::cast_possible_truncation, clippy::cast_sign_loss)]
/// # Bootstrap.
///
/// Automatically start up the Poe animations as soon as the WASM content has
/// initialized in the browser.
pub fn bootstrap() {
	dom::info!(format!("{}\n{}", Poe::version(), Poe::ascii()));
}



#[wasm_bindgen]
#[derive(Debug, Clone, Copy, Default)]
/// # Public Interface.
///
/// This struct has no state information, but gives us a convenient namespace
/// for all of our Javascript exports.
///
/// (For the most part, this is just a thin wrapper around the static
/// `Universe` instance, which isn't directly exposed.)
pub struct Poe;

#[wasm_bindgen]
/// ## Getters.
impl Poe {
	#[wasm_bindgen(getter)]
	#[must_use]
	#[inline]
	/// # Is Poe Active?
	///
	/// Return `true` if active, or `false` if not.
	pub fn active() -> bool { Universe::active() }

	#[cfg(feature = "director")]
	#[wasm_bindgen(getter)]
	#[must_use]
	/// # ASCII Art.
	///
	/// Return an ASCII art representation of Poe.
	pub fn ascii() -> String {
		include_str!("../skel/img/poe.txt").to_owned()
	}

	#[wasm_bindgen(getter)]
	#[must_use]
	#[inline]
	/// # Audio Allowed?
	///
	/// Return `true` if audio playback is allowed, or `false` if not.
	pub fn audio() -> bool { Universe::audio() }

	#[cfg(feature = "director")]
	#[wasm_bindgen(getter)]
	#[must_use]
	/// # Playlist.
	///
	/// Return all directly-playable animation names and IDs.
	pub fn list() -> String {
		include_str!("../skel/playlist.txt").to_owned()
	}

	#[cfg(feature = "director")]
	#[wasm_bindgen(getter)]
	#[must_use]
	/// # Playback Speed.
	///
	/// Return the current playback speed, 100 is "normal".
	pub fn speed() -> f32 {
		Universe::speed().unwrap_or_else(||
			if Universe::paused() { 0.0 }
			else { 1.0 }
		)
	}

	#[cfg(feature = "director")]
	#[wasm_bindgen(getter)]
	#[must_use]
	/// # Version.
	///
	/// Return the current version of the program.
	pub fn version() -> String {
		concat!("RS Mate Poe v", env!("CARGO_PKG_VERSION")).to_owned()
	}
}

#[wasm_bindgen]
/// ## Setters.
impl Poe {
	#[wasm_bindgen(setter)]
	#[inline]
	/// # Set Active.
	///
	/// Enable or disable Poe.
	pub fn set_active(v: bool) { Universe::set_active(v); }

	#[wasm_bindgen(setter)]
	#[inline]
	/// # Toggle Audio.
	///
	/// Enable or disable audio playback.
	pub fn set_audio(v: bool) { Universe::set_audio(v); }

	#[cfg(feature = "director")]
	#[wasm_bindgen(setter)]
	#[inline]
	/// # Set Playback Speed.
	///
	/// Set the playback speed as a float percentage, e.g. `1.0` is normal,
	/// `0.25` is quarter-speed, `3.0` is 3x speed.
	pub fn set_speed(speed: f32) { Universe::set_speed(speed); }

	#[cfg(feature = "director")]
	#[wasm_bindgen(setter)]
	#[inline]
	/// # Play Animation.
	///
	/// Cue up a specific animation by its ID. Invalid entries are ignored.
	pub fn set_play(id: u8) { Universe::set_next_animation(id); }
}




