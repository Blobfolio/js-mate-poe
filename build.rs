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
	println!("cargo:rerun-if-changed=skel/img/poe.txt");
	println!("cargo:rerun-if-changed=skel/js/imports.mjs");
	println!("cargo:rerun-if-changed=skel/playlist.txt");
	println!("cargo:rerun-if-changed=skel/scss/core.scss");
	println!("cargo:rerun-if-changed=skel/sound/baa.flac");
	println!("cargo:rerun-if-changed=skel/sound/sneeze.flac");
	println!("cargo:rerun-if-changed=skel/sound/yawn.flac");

	let css = build_css();
	write_file(&out_path("poe.css"), css.as_bytes());

	let media = build_media();
	write_file(&out_path("media.rs"), media.as_bytes());

	let def = build_default_animations();
	write_file(&out_path("default-animations.rs"), def.as_bytes());
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
/// entirely within Rust, and adds a JS "snippet" for wasm-bindgen.
///
/// It is worth noting we aren't actually using snippets correctly. Before
/// transpiling the Javascript modules with Google Closure Compiler, the
/// snippet and main glue file need to be merged together and saved to
/// skel/generated/glue.mjs.
fn build_media() -> String {
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

	// Add the image dimensions to the JS lengths.
	let (w, h) = img_size();
	assert_eq!(w, 6200, "Image width has changed!");
	assert_eq!(h, 40, "Image height has changed!");
	js_lengths.push(format!("const imgWidth = {w};"));
	js_lengths.push(format!("const imgHeight = {h};"));

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
		.replace("%ASCII%", &std::fs::read_to_string("skel/img/poe.txt").unwrap_or_default())
		.replace("%AUDIO_URLS%", AUDIO_URLS)
		.replace("%LENGTHS%", &js_lengths.join("\n"))
		.replace("%PLAYLIST%", &std::fs::read_to_string("skel/playlist.txt").unwrap_or_default())
		.replace("%VERSION%", &std::env::var("CARGO_PKG_VERSION").unwrap_or_default());
	js.push('\n');

	// Add the JS to the Rust in a roundabout way so wasm-bindgen can find it.
	out.push(format!("#[wasm_bindgen(inline_js = {js:?})] extern \"C\" {{}}"));

	// Return what we've built!
	out.join("\n\n")
}

/// # Default Animations w/ Weightings.
const DEFAULT_ANIMATIONS: &[(usize, &str)] = &[
	(36, "Hop"),
	(36, "LookDown"),
	(36, "LookUp"),
	(36, "Skip"),

	(24, "Beg"),
	(24, "Dance"),
	(24, "Eat"),
	(24, "Handstand"),
	(24, "LayDown"),
	(24, "LegLifts"),
	(24, "Roll"),
	(24, "Scratch"),
	(24, "Spin"),

	(12, "SleepSitting"),
	(12, "SleepStanding"),

	(8, "Blink"),
	(8, "Cry"),
	(8, "Nah"),
	(8, "Popcorn"),
	(8, "Really"),
	(8, "Rest"),

	(4, "EatMagicFlower"),
	(4, "PlayDead"),
	(4, "Rotate"),
	(4, "Scoot"),
	(4, "Scream"),

	(1, "Abduction"),
	(1, "Bleat"),
	(1, "ShadowShowdown"),
	(1, "Sneeze"),
	(1, "Tornado"),
	(1, "Urinate"),
	(1, "Yawn"),
];

/// # Build Default Animation List.
///
/// This exports an Animation::default_choice method for choosing a default
/// animation. It will return one of Walk/Run/Special.
///
/// The special animations are relatively weighted to prioritize certain
/// sequences over others, and are additionally constrained to ensure a given
/// selection is different than the previous two (special) selections.
fn build_default_animations() -> String {
	// Secret has no weighting, rare is 8x, common is 24x.
	let total: usize = DEFAULT_ANIMATIONS.iter().map(|(n, _)| *n).sum();

	// We use u16 for capped randomization; make sure this fits before we do
	// anything else.
	assert!(
		total < usize::from(u16::MAX),
		"Default special animation total is too big: {total}"
	);

	// Convert everything to match arms.
	let mut from = 0;
	let mut arms = Vec::new();

	for (n, a) in DEFAULT_ANIMATIONS {
		let to = from + n;
		if from + 1 == total { arms.push(format!("\t\t\t\t\t\t_ => Self::{a},")); }
		else if *n == 1 {
			arms.push(format!("\t\t\t\t\t\t{from} => Self::{a},"));
		}
		else {
			arms.push(format!("\t\t\t\t\t\t{from}..={} => Self::{a},", to - 1));
		}
		from = to;
	}

	// Make sure we got 'em all.
	assert_eq!(from, total, "Missing a default animation match arm.");

	// Build the statement!
	format!(
		r"impl Animation {{
	/// # Default Choice.
	///
	/// Return a generic default animation for use in contexts where no
	/// explicit choice is supplied.
	pub(crate) fn default_choice() -> Self {{
		match Universe::rand_mod(3) {{
			0 => Self::Walk,
			1 => Self::Run,
			_ => {{
				let mut last = LAST_SPECIAL.load(SeqCst).to_le_bytes();
				loop {{
					let next = match Universe::rand_mod({total}) {{
{}
					}};

					// Accept and return the choice so long as it is different
					// than the previous two (special) responses.
					if next as u8 != last[0] && next as u8 != last[1] {{
						last.rotate_right(1);
						last[0] = next as u8;
						LAST_SPECIAL.store(u16::from_le_bytes(last), SeqCst);
						return next;
					}}
				}}

			}}
		}}
	}}
}}",
		arms.join("\n")
	)
}

/// # Image Dimensions.
fn img_size() -> (u32, u32) {
	let dim = imagesize::size("skel/img/poe.png").expect("Failed to read poe.png dimensions.");
	let w = u32::try_from(dim.width).expect("Failed to read poe.png dimensions.");
	let h = u32::try_from(dim.height).expect("Failed to read poe.png dimensions.");
	(w, h)
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
