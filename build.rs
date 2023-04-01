/*!
# RS Mate Poe: Build
*/

use guff_css::Css;
use std::path::{
	Path,
	PathBuf,
};



/// # Main.
pub fn main() {
	println!("cargo:rerun-if-env-changed=CARGO_PKG_VERSION");
	println!("cargo:rerun-if-changed=skel/img/poe.png");
	println!("cargo:rerun-if-changed=skel/js/imports.mjs");
	println!("cargo:rerun-if-changed=skel/scss/core.scss");
	println!("cargo:rerun-if-changed=skel/sound/baa.flac");
	println!("cargo:rerun-if-changed=skel/sound/sneeze.flac");
	println!("cargo:rerun-if-changed=skel/sound/yawn.flac");

	#[cfg(not(feature = "firefox"))]
	println!("cargo:rerun-if-changed=skel/js/imports-audio.mjs");

	let css = build_css();
	write_file(&out_path("poe.css"), css.as_bytes());

	let media = build_media();
	write_file(&out_path("media.rs"), media.as_bytes());
}

/// # Compile CSS.
///
/// This converts the SCSS to CSS, minifies it, and returns it as a string.
fn build_css() -> String {
	let src = std::fs::canonicalize("skel/scss/core.scss").expect("Missing core.scss");
	Css::try_from(src.as_path())
		.expect("Unable to parse core.scss")
		.minified(None)
		.expect("Unable to minify core.css")
}

/// # Import Media/Glue.
///
/// This generates and returns Rust code containing static arrays and export
/// pointer methods for each of our embedded media assets, and a wasm-bindgen
/// "inline_js" snippet binding containing the JS-side media-handling code,
/// as well as the hardcoded import sources used elsewhere in the program.
///
/// It is worth noting that wasm-bindgen snippets weren't designed for the type
/// of post-build system this library requires, so the generated snippet and
/// glue files must be concatenated, in that order, and copied over to the
/// "generated" directory so the entrypoint can import what it needs.
///
/// Also of note, when the "firefox" feature is enabled, the audio bits are
/// left out, since the extension has to handle those manually. (Its snippet
/// and glue must also be concatenated post-build, but with its audio helper
/// injected in between.)
fn build_media() -> String {
	use std::fmt::Write;

	// Individual media.
	let media = [
		std::fs::read("skel/img/poe.png").expect("Missing poe.png"),

		#[cfg(not(feature = "firefox"))]
		std::fs::read("skel/sound/baa.flac").expect("Missing baa.flac"),

		#[cfg(not(feature = "firefox"))]
		std::fs::read("skel/sound/sneeze.flac").expect("Missing sneeze.flac"),

		#[cfg(not(feature = "firefox"))]
		std::fs::read("skel/sound/yawn.flac").expect("Missing yawn.flac"),
	];

	// Code holders.
	let mut out = Vec::new();
	let mut js = "/**
 * @file Wasm Glue
 */

// Buffer lengths.".to_owned();

	// Handle the media bits.
	for (k, v) in ["img", "baa", "sneeze", "yawn"].iter().zip(media.iter()) {
		// Add the buffer.
		out.push(format!(
			r"/// # Buffer ({k}).
static {}_BUFFER: [u8; {}] = {v:?};",
			k.to_ascii_uppercase(),
			v.len(),
		));

		// Add the pointer method.
		out.push(format!(
			r"#[wasm_bindgen]
#[must_use]
/// # Pointer ({k}).
pub fn {k}_ptr() -> *const u8 {{ {}_BUFFER.as_ptr() }}",
			k.to_ascii_uppercase(),
		));

		// Add the length.
		write!(&mut js, "\nconst {k}Len = {};", v.len()).unwrap();
	}

	// Add our hardcoded imports.mjs helper to the JS.
	js.push_str("\n\n");
	js.push_str(&std::fs::read_to_string("skel/js/imports.mjs").expect("Missing imports.mjs"));

	#[cfg(not(feature = "firefox"))]
	{
		js.push_str("\n\n");
		js.push_str(&std::fs::read_to_string("skel/js/imports-audio.mjs").expect("Missing imports-audio.mjs"));
	}

	// Add the JS snippet to the Rust code.
	js.push('\n');
	out.push(format!("#[wasm_bindgen(inline_js = {js:?})] extern \"C\" {{}}"));

	// Return what we've built!
	out.join("\n\n")
}

/// # Out path.
///
/// This generates a (file/dir) path relative to `OUT_DIR`.
fn out_path(name: &str) -> PathBuf {
	let dir = std::env::var("OUT_DIR").expect("Missing OUT_DIR.");
	let mut out = std::fs::canonicalize(dir).expect("Missing OUT_DIR.");
	out.push(name);
	out
}

/// # Write File.
fn write_file(path: &Path, data: &[u8]) {
	use std::io::Write;

	if std::fs::File::create(path)
		.and_then(|mut file| file.write_all(data).and_then(|_| file.flush()))
		.is_err() {
		panic!("Unable to save {path:?}");
	}
}
