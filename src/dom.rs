/*!
# RS Mate Poe: DOM
*/

use web_sys::{
	Document,
	Element,
	HtmlElement,
};
pub(crate) use web_sys::window;

#[cfg(feature = "director")]
pub(crate) use gloo_console::{
	debug,
	info,
	warn,
};



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
