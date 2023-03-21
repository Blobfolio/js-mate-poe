/*!
# RS Mate Poe: DOM
*/

use wasm_bindgen::prelude::*;
use web_sys::{
	Document,
	Element,
	HtmlElement,
	Window,
};

#[cfg(feature = "director")]
pub(crate) use gloo_console::{
	debug,
	info,
	warn,
};



/// # Body.
pub(crate) fn body() -> HtmlElement {
	web_sys::window()
		.and_then(|w| w.document())
		.and_then(|d| d.body())
		.expect_throw("Missing `document.body`.")
}

/// # Document.
pub(crate) fn document() -> Document {
	web_sys::window()
		.and_then(|w| w.document())
		.expect_throw("Missing `document`.")
}

/// # Document Element.
pub(crate) fn document_element() -> Element {
	web_sys::window()
		.and_then(|w| w.document())
		.and_then(|d| d.document_element())
		.expect_throw("Missing `document.documentElement`.")
}

/// # Window.
pub(crate) fn window() -> Window {
	web_sys::window().expect_throw("Missing `window`.")
}
