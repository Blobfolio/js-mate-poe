/*!
# RS Mate Poe: DOM
*/

use js_sys::{
	Array,
	Uint8Array,
};
use wasm_bindgen::{
	JsCast,
	prelude::*,
};
use web_sys::{
	Blob,
	BlobPropertyBag,
	Document,
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
	// Convert it to an "Array" first.
	// Note: for some reason there is no safe method to initialize a byte array
	// from literal bytes. Haha.
	let arru8 = Uint8Array::new(&unsafe { Uint8Array::view(data) }.into());
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
		.unchecked_into()
}

/// # Document.
pub(crate) fn document() -> Document {
	web_sys::window().and_then(|w| w.document()).expect_throw("Missing `document`.")
}

/// # Document Element.
pub(crate) fn document_element() -> HtmlElement {
	web_sys::window()
		.and_then(|w| w.document())
		.and_then(|d| d.document_element())
		.expect_throw("Missing `document.documentElement`.")
		.unchecked_into()
}

/// # Request Animation Frame.
pub(crate) fn request_animation_frame(f: &Closure<dyn FnMut(f64)>) -> i32 {
	window().request_animation_frame(f.as_ref().unchecked_ref()).unwrap_or(0)
}

/// # Window.
pub(crate) fn window() -> Window {
	web_sys::window().expect_throw("Missing `window`.")
}
