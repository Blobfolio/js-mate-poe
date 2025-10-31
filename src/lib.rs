/*!
# RS Mate Poe
*/

#![deny(
	clippy::allow_attributes_without_reason,
	clippy::correctness,
	unreachable_pub,
	unsafe_code,
)]

#![warn(
	clippy::complexity,
	clippy::nursery,
	clippy::pedantic,
	clippy::perf,
	clippy::style,

	clippy::allow_attributes,
	clippy::clone_on_ref_ptr,
	clippy::create_dir,
	clippy::filetype_is_file,
	clippy::format_push_string,
	clippy::get_unwrap,
	clippy::impl_trait_in_params,
	clippy::implicit_clone,
	clippy::lossy_float_literal,
	clippy::missing_assert_message,
	clippy::missing_docs_in_private_items,
	clippy::needless_raw_strings,
	clippy::panic_in_result_fn,
	clippy::pub_without_shorthand,
	clippy::rest_pat_in_fully_bound_structs,
	clippy::semicolon_inside_block,
	clippy::str_to_string,
	clippy::todo,
	clippy::undocumented_unsafe_blocks,
	clippy::unneeded_field_pattern,
	clippy::unseparated_literal_suffix,
	clippy::unwrap_in_result,

	macro_use_extern_crate,
	missing_copy_implementations,
	missing_docs,
	non_ascii_idents,
	trivial_casts,
	trivial_numeric_casts,
	unused_crate_dependencies,
	unused_extern_crates,
	unused_import_braces,
)]

#![expect(clippy::redundant_pub_crate, reason = "Unresolvable.")]

mod animation;
pub(crate) mod dom;
mod mate;
mod position;
mod state;
mod universe;



pub(crate) use animation::{
	Animation,
	frame::Frame,
	scene::{
		Scene,
		SceneList,
		Step,
	},
	sound::Sound,
};
pub(crate) use mate::Mate;
pub(crate) use position::{
	Direction,
	Position,
};
pub(crate) use state::{
	State,
	StateAudio,
};
pub(crate) use universe::Universe;

use wasm_bindgen::prelude::*;



// Generated media exports.
include!(concat!(env!("OUT_DIR"), "/media.rs"));



#[cfg(feature = "director")]
#[wasm_bindgen(start)]
/// # Bootstrap.
///
/// Print library details after initialization.
pub fn bootstrap() {
	// Print the program name and version.
	web_sys::console::info_3(
		&JsValue::from_str(concat!("%cJS Mate Poe: %c", env!("CARGO_PKG_VERSION"))),
		&JsValue::from_str("color:#ff1493;font-weight:bold;"),
		&JsValue::from_str("color:#00abc0;font-weight:bold;"),
	);

	// Print the playlist.
	web_sys::console::info_2(
		&JsValue::from_str(concat!("%c", include_str!("../skel/playlist.txt"))),
		&JsValue::from_str("color:#b2bec3;font-family:monospace;"),
	);
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
	/// # Is Poe Active?
	///
	/// Return `true` if active, or `false` if not.
	pub fn active() -> bool { Universe::active() }

	#[wasm_bindgen(getter)]
	#[must_use]
	/// # Audio Allowed?
	///
	/// Return `true` if audio playback is allowed, or `false` if not.
	pub fn audio() -> bool { Universe::audio() }

	#[wasm_bindgen(getter)]
	#[must_use]
	/// # Is Focus/Dragging Allowed?
	///
	/// Return `true` if the primary sprite can be clicked and dragged, or
	/// `false` if not.
	pub fn focus() -> bool { ! Universe::no_focus() }

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
}

#[wasm_bindgen]
/// ## Setters.
impl Poe {
	#[cfg(feature = "firefox")]
	#[wasm_bindgen]
	/// # Set Fix Bindings Flag.
	///
	/// This hints to the state that it should try to rebind the mate elements
	/// to the document body.
	pub fn fix_bindings() { Universe::set_fix_bindings(); }

	#[wasm_bindgen(setter)]
	/// # Set Active.
	///
	/// Enable or disable Poe.
	pub fn set_active(v: bool) { Universe::set_active(v); }

	#[wasm_bindgen(setter)]
	/// # Toggle Audio.
	///
	/// Enable or disable audio playback.
	pub fn set_audio(v: bool) { Universe::set_audio(v); }

	#[wasm_bindgen(setter)]
	/// # Toggle Focus/Draggability.
	///
	/// Enable or disable the ability to click and drag the primary sprite.
	pub fn set_focus(v: bool) { Universe::set_no_focus(! v); }

	#[cfg(feature = "director")]
	#[wasm_bindgen(setter)]
	/// # Set Playback Speed.
	///
	/// Set the playback speed as a float percentage, e.g. `1.0` is normal,
	/// `0.25` is quarter-speed, `3.0` is 3x speed.
	pub fn set_speed(speed: f32) { Universe::set_speed(speed); }

	#[cfg(feature = "director")]
	#[wasm_bindgen(setter)]
	/// # Play Animation.
	///
	/// Cue up a specific animation by its ID. Invalid entries are ignored.
	pub fn set_play(id: u8) { Universe::set_next_animation(id); }
}
