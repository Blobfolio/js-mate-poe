/*!
# RS Mate Poe: DOM
*/

#[cfg(feature = "director")] use wasm_bindgen::prelude::*;
use web_sys::{
	Document,
	Element,
	HtmlElement,
	VisibilityState,
};
pub(crate) use web_sys::window;



/// # Body.
pub(crate) fn body() -> Option<HtmlElement> {
	web_sys::window()
		.and_then(|w| w.document())
		.and_then(|d| d.body())
}

#[cfg(feature = "director")]
/// # Console Debug.
///
/// This is a simple wrapper for the JS `console.debug` method that accepts a
/// single string, taking the guesswork out of trying to work with the various
/// `web-sys` imports each and every time.
pub(crate) fn console_debug(msg: &str) {
	web_sys::console::debug_1(&JsValue::from_str(msg));
}

#[cfg(feature = "director")]
/// # Console Warn.
///
/// This is a simple wrapper for the JS `console.warn` method that accepts a
/// single string, taking the guesswork out of trying to work with the various
/// `web-sys` imports each and every time.
pub(crate) fn console_warn(msg: &str) {
	web_sys::console::warn_1(&JsValue::from_str(msg));
}

/// # Document.
pub(crate) fn document() -> Option<Document> {
	web_sys::window()
		.and_then(|w| w.document())
}

/// # Document Element.
pub(crate) fn document_element() -> Option<Element> {
	web_sys::window()
		.and_then(|w| w.document())
		.and_then(|d| d.document_element())
}

/// # Is Quirks?
///
/// Returns `true` if the page is operating in "quirks" mode.
pub(crate) fn is_quirks() -> bool {
	document().map_or(true, |d| d.compat_mode() == "BackCompat")
}

/// # Is Visible?
///
/// Returns `true` if the tab has focus.
pub(crate) fn is_visible() -> bool {
	document().map_or(false, |d| matches!(d.visibility_state(), VisibilityState::Visible))
}
