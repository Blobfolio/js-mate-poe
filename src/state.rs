/*!
# RS Mate Poe: State
*/

use crate::{
	dom,
	Mate,
	Universe,
};
use std::{
	cell::RefCell,
	rc::Rc,
};
use wasm_bindgen::{
	JsCast,
	prelude::*,
};
use web_sys::{
	AddEventListenerOptions,
	Element,
	Event,
	MouseEvent,
};



#[allow(clippy::type_complexity)]
/// # Runtime State.
///
/// This holds the registered elements and events associated with an actively-
/// running `Poe` session. Unlike the atomic settings of the [`Universe`], this
/// data cannot be safely shared between threads, so instead has to live in a
/// weird recursive purgatory courtesy of [`Rc`].
///
/// If the `requestAnimationFrame` handler discovers the [`Universe`] has been
/// deactivated, it unbinds the other events and drops itself, and as such the
/// last reference to the [`State`].
pub(crate) struct State {
	mates: RefCell<[Mate; 2]>,
	raf: RefCell<Option<Closure<dyn FnMut(f64)>>>,
	events: StateEvents,
}

impl Default for State {
	fn default() -> Self {
		// Update the universe.
		Universe::set_state(true);
		let quirks = dom::document().expect_throw("Missing DocumentElement.").compat_mode() == "BackCompat";
		if quirks { size_quirks(); }
		else { size_standards(); }

		// Initialize the mates and add them to the document body.
		let mut m1 = Mate::new(true);
		let mut m2 = Mate::new(false);
		dom::body()
			.expect_throw("Missing body.")
			.append_with_node_2(m1.el(), m2.el())
			.expect_throw("!");

		// Queue up their starting positions.
		m1.start();
		if Universe::assign_child() { m1.set_child_animation(&mut m2); }

		// Set up the event bindings.
		let events = StateEvents::new(quirks);
		events.bind(m1.el());

		Self {
			mates: RefCell::new([m1, m2]),
			raf: RefCell::new(None),
			events,
		}
	}
}

impl Drop for State {
	fn drop(&mut self) {
		// Unbind events.
		let m = self.mates.borrow();
		self.events.unbind(m[0].el());

		// Detach the mate elements.
		if let Some(body) = dom::body() {
			let _res = body.remove_child(m[0].el()).ok();
			let _res = body.remove_child(m[1].el()).ok();
		}

		// Let the Universe know we're dead.
		Universe::set_state(false);
		#[cfg(feature = "director")] dom::warn!("Poe deactivated.");
	}
}

impl State {
	#[allow(clippy::cast_sign_loss, clippy::cast_possible_truncation)]
	/// # New.
	///
	/// Initialize a new state and throw it into a `requestAnimationFrame`
	/// loop.
	pub(crate) fn init() {
		// Shove what we've got so far into the state.
		let state1 = Rc::new(Self::default());

		// Set up the recursive requestAnimationFrame callback, using a clone
		// for the setup and initial call. (It will be dropped when the
		// method terminates, leaving only the original reference.)
		let state2 = state1.clone();
		state2.raf.borrow_mut().replace(Closure::wrap(Box::new(move |e: f64| {
			if Universe::active() {
				// Unless we're paused, go ahead and (maybe) repaint.
				if ! Universe::paused() { state1.paint(e as u32); }
				state1.raf();
			}
			else { state1.raf.borrow_mut().take(); }
		})));

		// Move the state into a frame request!
		state2.raf();
	}

	/// # Paint!
	///
	/// Tick and paint each of the mates if their time has come.
	fn paint(&self, now: u32) {
		let [m1, m2] = &mut *self.mates.borrow_mut();

		#[cfg(feature = "firefox")]
		if Universe::fix_bindings() {
			let el1 = m1.el();
			let el2 = m2.el();
			let con1 = el1.is_connected();
			let con2 = el2.is_connected();
			if ! con1 || ! con2 {
				let b = dom::body().expect("!");
				match (con1, con2) {
					(false, false) => b.append_with_node_2(el1, el2),
					(false, true) => b.append_child(el1).map(|_| ()),
					(true, false) => b.append_child(el2).map(|_| ()),
					_ => Ok(()),
				}.expect("!");
			}
		}

		m1.paint(now);

		if Universe::no_child() { m2.stop(); }
		else if Universe::assign_child() { m1.set_child_animation(m2); }
		m2.paint(now);
	}

	#[inline]
	/// # Request Animation Frame.
	///
	/// Add ourselves to the next `requestAnimationFrame`.
	fn raf(&self) {
		if let Some(cb) = self.raf.borrow().as_ref() {
			if let Some(w) = dom::window() {
				let _res = w.request_animation_frame(cb.as_ref().unchecked_ref());
			}
		}
	}
}



/// # Event Handlers.
struct StateEvents {
	contextmenu: Closure<dyn FnMut(Event)>,
	#[cfg(not(feature = "firefox"))] dblclick: Closure<dyn FnMut()>,
	mousedown: Closure<dyn FnMut(MouseEvent)>,
	mousemove: Closure<dyn FnMut(MouseEvent)>,
	mouseup: Closure<dyn FnMut()>,
	resize: Closure<dyn FnMut()>,
}

impl StateEvents {
	/// # New.
	fn new(quirks: bool) -> Self {
		Self {
			contextmenu: Closure::wrap(Box::new(|e: Event| { e.prevent_default(); })),
			#[cfg(not(feature = "firefox"))]
			dblclick: Closure::wrap(Box::new(|| { Universe::set_active(false); })),
			mousedown: Closure::wrap(Box::new(|e: MouseEvent|
				if 1 == e.buttons() && 0 == e.button() {
					Universe::set_dragging(true);
					Universe::set_pos(e.client_x(), e.client_y());
				}
			)),
			mousemove: Closure::wrap(Box::new(|e: MouseEvent|
				if Universe::dragging() {
					Universe::set_pos(e.client_x(), e.client_y());
				}
			)),
			mouseup: Closure::wrap(Box::new(|| { Universe::set_dragging(false); })),
			resize: Closure::wrap(Box::new(if quirks { size_quirks } else { size_standards })),
		}
	}

	/// # Bind Event Listeners.
	fn bind(&self, el: &Element) {
		let document_element = dom::document_element().expect_throw("Missing documentElement.");
		let window = dom::window().expect_throw("Missing window.");

		macro_rules! bind {
			($el:expr, $event:ident, $passive:literal) => (
				$el.add_event_listener_with_callback_and_add_event_listener_options(
					stringify!($event),
					self.$event.as_ref().unchecked_ref(),
					AddEventListenerOptions::new().passive($passive),
				).expect_throw("!");
			);
		}

		bind!(el, contextmenu, false);
		#[cfg(not(feature = "firefox"))] bind!(el, dblclick, true);
		bind!(el, mousedown, true);
		bind!(document_element, mousemove, true);
		bind!(document_element, mouseup, true);
		bind!(window, resize, true);
	}

	/// # Unbind Event Listeners.
	fn unbind(&self, el: &Element) {
		macro_rules! unbind {
			($el:expr, $event:ident) => (
				let _res = $el.remove_event_listener_with_callback(
					stringify!($event),
					self.$event.as_ref().unchecked_ref(),
				).ok();
			);
		}

		unbind!(el, contextmenu);
		#[cfg(not(feature = "firefox"))] unbind!(el, dblclick);
		unbind!(el, mousedown);
		if let Some(document_element) = dom::document_element() {
			unbind!(document_element, mousemove);
			unbind!(document_element, mouseup);
		}
		if let Some(window) = dom::window() { unbind!(window, resize); }
	}
}



/// # Get/Set Width/Height (Standards Mode).
///
/// This grabs a good-enough approximation of the page's layout dimensions
/// from the `documentElement` and updates the `Universe`'s cache accordingly.
fn size_standards() {
	if let Some(el) = dom::document_element() {
		let w = normalize_size(el.client_width());
		let h = normalize_size(el.client_height());
		Universe::set_size(w, h);
	}
}

/// # Get/Set Width/Height (Quirks Mode).
///
/// This does the same thing as `size_standards`, but with the document body
/// instead, because the Internet is fucking terrible. Haha.
fn size_quirks() {
	if let Some(el) = dom::body() {
		let w = normalize_size(el.client_width());
		let h = normalize_size(el.client_height());
		Universe::set_size(w, h);
	}
}

#[allow(clippy::cast_possible_truncation, clippy::cast_sign_loss)]
/// # Normalize Size.
///
/// This caps an `i32` dimension to a `u16`.
const fn normalize_size(size: i32) -> u16 {
	const MAX: i32 = u16::MAX as i32;

	if size <= 0 { 0 }
	else if size <= MAX { size as u16 }
	else { u16::MAX }
}
