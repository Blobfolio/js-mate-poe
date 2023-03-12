/*!
# RS Mate Poe: Build
*/

use guff_css::Css;
use std::path::{
	Path,
	PathBuf,
};



/// # Compile Styles.
pub fn main() {
	println!("cargo:rerun-if-env-changed=CARGO_PKG_VERSION");
	println!("cargo:rerun-if-changed=skel/scss/core.scss");

	let css = build_css();
	let path = out_path("poe.html");
	write_file(&path, format!(
		r#"<style>{css}</style><div id="p" class="child off"><img id="i" width="640" height="440"></div>"#
	).as_bytes());

	let js = build_js_header();
	let path = out_path("header.js");
	write_file(&path, js.as_bytes());
}

fn build_css() -> String {
	let src = std::fs::canonicalize("skel/scss/core.scss").expect("Missing core.scss");
	Css::try_from(src.as_path())
		.expect("Unable to parse core.scss")
		.minified(None)
		.expect("Unable to minify core.css")
}

fn build_js_header() -> String {
	format!(
		r#"/**
 * JS Mate Poe
 *
 * @version {}
 * @see {{https://github.com/Blobfolio/js-mate-poe}}
 */
"#,
		std::env::var("CARGO_PKG_VERSION").expect("Missing version."),
	)
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
