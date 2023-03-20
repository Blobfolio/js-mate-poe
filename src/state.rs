/*!
# RS Mate Poe: State
*/

use crate::{
	dom,
	Mate,
	sprite_as_blob,
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
	Event,
	EventListenerOptions,
	HtmlElement,
	MouseEvent,
	Url,
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
	events: RefCell<StateEvents>,
}

impl Drop for State {
	fn drop(&mut self) {
		self.events.borrow().unbind(&self.mates.borrow()[0].el);
		Universe::set_state(false);
		#[cfg(feature = "director")] dom::warn!("Poe deactivated.");
	}
}

impl State {
	#[allow(clippy::cast_sign_loss, clippy::cast_possible_truncation)]
	/// # New.
	pub(crate) fn init() {
		Universe::set_state(true);

		// Manually set the universe size before registering the elements so we
		// know where to put them!
		let (w, h) = size();
		Universe::resize(w, h);

		let url = Url::create_object_url_with_blob(&sprite_as_blob()).unwrap_throw();

		// Initialize the primary mate.
		let mut m1 = Mate::new(true, &url);
		m1.start();

		// Initialize the child mate.
		let mut m2 = Mate::new(false, &url);
		if Universe::assign_child() { m1.set_child_animation(&mut m2); }

		// Set up the event bindings.
		let events = StateEvents::default();
		events.bind(&m1.el);

		// Shove what we've got so far into the state.
		let state1 = Rc::new(Self {
			mates: RefCell::new([m1, m2]),
			raf: RefCell::new(None),
			events: RefCell::new(events),
		});

		// Set up the recursive requestAnimationFrame callback, using a clone
		// for the setup and initial call. (It will be dropped when the
		// method terminates, leaving only the original reference.)
		let state2 = state1.clone();
		state2.raf.borrow_mut().replace(Closure::new(Box::new(move |e: f64| {
			if Universe::active() {
				if ! Universe::paused() { state1.paint(e as u32); } // No change if paused!
				state1.raf.borrow()
					.as_ref()
					.and_then(|f| dom::window().request_animation_frame(f.as_ref().unchecked_ref()).ok());
			}
			else { state1.raf.borrow_mut().take(); }
		})));

		// Move the state into a frame request!
		state2.raf.borrow()
			.as_ref()
			.and_then(|f| dom::window().request_animation_frame(f.as_ref().unchecked_ref()).ok());
	}

	/// # Paint!
	///
	/// Tick and paint each of the mates if their time has come.
	fn paint(&self, now: u32) {
		let [m1, m2] = &mut *self.mates.borrow_mut();
		m1.paint(now);

		if Universe::no_child() { m2.stop(); }
		else if Universe::assign_child() { m1.set_child_animation(m2); }
		m2.paint(now);
	}
}



/// # Event Handlers.
struct StateEvents {
	contextmenu: Closure<dyn FnMut(Event)>,

	#[cfg(not(feature = "firefox"))] dblclick: Closure<dyn FnMut(Event)>,

	mousedown: Closure<dyn FnMut(MouseEvent)>,
	mousemove: Closure<dyn FnMut(MouseEvent)>,
	mouseup: Closure<dyn FnMut(Event)>,
	resize: Closure<dyn FnMut(Event)>,
}

impl Default for StateEvents {
	fn default() -> Self {
		Self {
			contextmenu: Closure::new(Box::new(|e: Event| {
				e.prevent_default();
			})),
			#[cfg(not(feature = "firefox"))]
			dblclick: Closure::new(Box::new(|_| {
				Universe::set_active(false);
			})),
			mousedown: Closure::new(Box::new(|e: MouseEvent| {
				if 1 == e.buttons() && 0 == e.button() {
					Universe::set_dragging(true);
					Universe::set_pos(e.client_x(), e.client_y());
				}
			})),
			mousemove: Closure::new(Box::new(|e: MouseEvent| {
				if Universe::dragging() {
					Universe::set_pos(e.client_x(), e.client_y());
				}
			})),
			mouseup: Closure::new(Box::new(|_| {
				Universe::set_dragging(false);
			})),
			resize: Closure::new(Box::new(|_| {
				// Update the dimensions.
				let (w, h) = size();
				Universe::resize(w, h);
			})),
		}
	}
}

impl StateEvents {
	/// # Bind Event Listeners.
	fn bind(&self, el: &HtmlElement) {
		let document_element = dom::document_element();

		macro_rules! bind {
			($el:expr, $event:ident, $opt:ident) => (
				$el.add_event_listener_with_callback_and_add_event_listener_options(
					stringify!($event),
					self.$event.as_ref().unchecked_ref(),
					AddEventListenerOptions::new().$opt(true),
				).unwrap_throw();
			);
		}

		bind!(el, contextmenu, capture);
		#[cfg(not(feature = "firefox"))] bind!(el, dblclick, passive);
		bind!(el, mousedown, passive);
		bind!(document_element, mousemove, passive);
		bind!(document_element, mouseup, passive);
		bind!(dom::window(), resize, passive);
	}

	/// # Unbind Event Listeners.
	fn unbind(&self, el: &HtmlElement) {
		let document_element = dom::document_element();

		// This one works different from the rest because it was registered
		// with the capture hint.
		el.remove_event_listener_with_callback_and_event_listener_options(
			"contextmenu",
			self.contextmenu.as_ref().unchecked_ref(),
			EventListenerOptions::new().capture(true),
		).unwrap_throw();

		macro_rules! unbind {
			($el:expr, $event:ident) => (
				$el.remove_event_listener_with_callback(
					stringify!($event),
					self.$event.as_ref().unchecked_ref(),
				).unwrap_throw();
			);
		}

		#[cfg(not(feature = "firefox"))] unbind!(el, dblclick);
		unbind!(el, mousedown);
		unbind!(document_element, mousemove);
		unbind!(document_element, mouseup);
		unbind!(dom::window(), resize);
	}
}



#[allow(clippy::cast_possible_truncation, clippy::cast_sign_loss)]
/// # Get Width/Height.
///
/// Pull the closest thing to a window size we can get without injecting our
/// own 100% fixed element. This may or may not factor the width of the
/// scrollbar (if any), but most browsers auto-hide them nowadays anyway.
fn size() -> (u16, u16) {
	const MAX: i32 = u16::MAX as i32;
	let el = dom::document_element();

	let size = el.client_width();
	let width =
		if size <= 0 { 0 }
		else if size < MAX { size as u16 }
		else { u16::MAX };

	let size = el.client_height();
	let height =
		if size <= 0 { 0 }
		else if size < MAX { size as u16 }
		else { u16::MAX };

	(width, height)
}
