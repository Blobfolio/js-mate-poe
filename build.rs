/*!
# RS Mate Poe: Build
*/

use guff_css::Css;
use std::path::{
	Path,
	PathBuf,
};



#[cfg(not(feature = "firefox"))]
/// # Audio URLs.
///
/// This version teases them out of the shared Wasm memory.
const AUDIO_URLS: &str = r"
			URL.createObjectURL(new Blob(
				[new Uint8ClampedArray(wasm.memory.buffer, wasm.baa_ptr(), baaLen)],
				{ type: 'audio/flac' },
			)),
			URL.createObjectURL(new Blob(
				[new Uint8ClampedArray(wasm.memory.buffer, wasm.sneeze_ptr(), sneezeLen)],
				{ type: 'audio/flac' },
			)),
			URL.createObjectURL(new Blob(
				[new Uint8ClampedArray(wasm.memory.buffer, wasm.yawn_ptr(), yawnLen)],
				{ type: 'audio/flac' },
			)),
		";

#[cfg(feature = "firefox")]
/// # Audio URLs.
///
/// This version pulls the audio from the extension assets.
const AUDIO_URLS: &str = r"
			browser.runtime.getURL('sound/baa.flac'),
			browser.runtime.getURL('sound/sneeze.flac'),
			browser.runtime.getURL('sound/yawn.flac'),
		";



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

	let (media_rust, media_js) = build_media();
	write_file(&out_path("media.rs"), media_rust.as_bytes());
	write_file(&out_path("glue-header.mjs"), media_js.as_bytes());
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
/// This generates and returns Rust code — for lib.rs — that works around a
/// memory issue when trying to do binary-Uin8Array-Blob-URL.createObjectURL
/// entirely within Rust. Specifically, it:
/// * Declares static arrays for each embedded media asset;
/// * Export methods (for use in JS) returning pointers to said arrays;
///
/// Note: when the "firefox" feature is enabled, the audio file buffers and
/// pointer methods are omitted. (The extension bundles those directly, so
/// they're left out of the Wasm entirely.)
///
/// This also generates and returns Javascript code to serve as a "header" for
/// the glue wasm-bindgen will subsequently generate. (The two files should
/// be concatenated and saved to skel/js/generated/glue.mjs so Closure
/// Compiler can do its thing.) Specifically, this contains:
/// * The four custom import methods used by this library;
/// * A media initialization method used by the module entrypoint;
/// * The buffer length data (this just prevents having to export methods from Rust that return the same);
fn build_media() -> (String, String) {
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
	let mut js_lengths = Vec::new();

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

		// Add the length to our collection.
		js_lengths.push(format!("const {k}Len = {};", v.len()));
	}

	// Load the JS imports, and swap out the two dynamic bits.
	let mut js = std::fs::read_to_string("skel/js/imports.mjs")
		.expect("Missing imports.mjs")
		.replace("%ASCII%", &std::fs::read_to_string("skel/img/poe.txt").expect("Missing poe.txt"))
		.replace("%AUDIO_URLS%", AUDIO_URLS)
		.replace("%LENGTHS%", &js_lengths.join("\n"))
		.replace("%VERSION%", &std::env::var("CARGO_PKG_VERSION").unwrap_or_else(|_| "0".to_owned()));
	js.push('\n');

	// Return what we've built!
	(out.join("\n\n"), js)
}

/// # Out path.
///
/// This generates a (file/dir) path relative to `OUT_DIR`.
fn out_path(name: &str) -> PathBuf {
	let dir = std::env::var("OUT_DIR").expect("Missing OUT_DIR.");
	let mut out = std::fs::canonicalize(dir).expect("Missing OUT_DIR.");
	if ! name.is_empty() { out.push(name); }
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
