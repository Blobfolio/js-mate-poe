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



#[cfg(feature = "director")]
#[wasm_bindgen]
extern "C" {
	#[allow(unsafe_code)]
	#[wasm_bindgen(js_name = "poeConsoleDebug")]
	pub(crate) fn console_debug(msg: &str);

	#[allow(unsafe_code)]
	#[wasm_bindgen(js_name = "poeConsoleWarn")]
	pub(crate) fn console_warn(msg: &str);
}



/// # Body.
pub(crate) fn body() -> Option<HtmlElement> {
	web_sys::window()
		.and_then(|w| w.document())
		.and_then(|d| d.body())
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
