/*!
# RS Mate Poe: DOM
*/

use js_sys::{
	Array,
	Uint8Array,
};
use wasm_bindgen::prelude::*;
use web_sys::{
	Blob,
	BlobPropertyBag,
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



#[allow(unsafe_code)]
/// # Make a Blob.
pub(crate) fn blob(data: &[u8], mime: &str) -> Blob {
	// Safety: this weird slice->uint8->jsvalue->uint8 back-and-forth is
	// required to keep the view from arbitrarily expiring on us.
	let arru8 = Uint8Array::new(unsafe { Uint8Array::view(data) }.as_ref());
	let arr = Array::new();
	arr.push(&arru8.buffer());

	// Then convert _that_ to a Blob.
	Blob::new_with_u8_array_sequence_and_options(
		&arr,
		BlobPropertyBag::new().type_(mime)
	).unwrap_throw()
}


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
