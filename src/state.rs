/*!
# RS Mate Poe: State
*/

use crate::{
	dom,
	Mate,
	Sound,
	Universe,
};
use std::{
	cell::RefCell,
	rc::Rc,
};
use js_sys::{
	Array,
	Uint8Array,
};
use wasm_bindgen::{
	JsCast,
	prelude::*,
};
use web_sys::{
	AddEventListenerOptions,
	Blob,
	BlobPropertyBag,
	Element,
	Event,
	HtmlAudioElement,
	MouseEvent,
	Url,
};



#[cfg(feature = "firefox")]
#[wasm_bindgen]
extern "C" {
	#[wasm_bindgen(js_namespace = ["browser", "runtime"], js_name = "getURL")]
	#[expect(clippy::allow_attributes, reason = "Buggy lint.")]
	#[allow(unsafe_code, reason = "For FFI.")]
	/// # Firefox URL.
	pub(super) fn firefox_url(path: &str) -> String;
}



/// # Raw Sprite Image.
static IMAGE: &[u8] = include_bytes!("../skel/img/poe.png");

#[cfg(not(feature = "firefox"))]
/// # Raw Sound: Baa.
static BAA: &[u8] = include_bytes!("../skel/sound/baa.flac");

#[cfg(not(feature = "firefox"))]
/// # Raw Sound: Sneeze.
static SNEEZE: &[u8] = include_bytes!("../skel/sound/sneeze.flac");

#[cfg(not(feature = "firefox"))]
/// # Raw Sound: Yawn.
static YAWN: &[u8] = include_bytes!("../skel/sound/yawn.flac");



#[expect(clippy::type_complexity, reason = "It is what it is.")]
/// # Runtime State.
///
/// This holds the registered elements and events associated with an actively-
/// running `Poe` session. Unlike the atomic settings of the [`Universe`], this
/// data cannot be safely shared between threads, so instead has to live in a
/// weird recursive purgatory courtesy of [`Rc`].
///
/// If the `requestAnimationFrame` handler discovers the [`Universe`] has been
/// deactivated, it won't request another, causing the last [`State`] reference
/// to be dropped, at which point it will unbind all of its associated events,
/// elements, and objects.
pub(crate) struct State {
	/// # Image Sprite.
	image: String,

	/// # Sound Player.
	sound: StateAudio,

	/// # Mate Elements.
	mates: RefCell<[Mate; 2]>,

	/// # `requestAnimationFrame`.
	raf: RefCell<Option<Closure<dyn FnMut(f64)>>>,

	/// # Events.
	events: StateEvents,
}

impl Default for State {
	fn default() -> Self {
		// Update the universe.
		Universe::set_state(true);
		let quirks = dom::is_quirks();
		if quirks { size_quirks(); }
		else { size_standards(); }

		// Set up the media.
		let image = url(IMAGE, "image/png");
		let sound = StateAudio::default();

		// Initialize the mates and add them to the document body.
		let mut m1 = Mate::new(true, &image);
		let mut m2 = Mate::new(false, &image);
		dom::body()
			.expect_throw("Missing body.")
			.append_with_node_2(m1.el(), m2.el())
			.expect_throw("!");

		// Queue up their starting positions.
		m1.start();
		if Universe::assign_child() { m1.set_child_animation(&mut m2); }

		// Set up the event bindings.
		let events = StateEvents::new(quirks);
		events.bind(m1.el(), &sound.el);

		Self {
			image,
			sound,
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
		self.events.unbind(m[0].el(), &self.sound.el);

		// Detach the mate elements.
		if let Some(body) = dom::body() {
			let _res = body.remove_child(m[0].el()).ok();
			let _res = body.remove_child(m[1].el()).ok();
		}

		// Revoke the image URL.
		let _res = Url::revoke_object_url(&self.image);

		// Let the Universe know we're dead.
		Universe::set_state(false);
		#[cfg(feature = "director")] dom::console_warn("Poe deactivated.");
	}
}

impl State {
	#[expect(
		clippy::cast_possible_truncation,
		clippy::cast_sign_loss,
		reason = "False positive.",
	)]
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
		let state2 = Rc::clone(&state1);
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
				let b = dom::body().expect_throw("!");
				match (con1, con2) {
					(false, false) => b.append_with_node_2(el1, el2),
					(false, true) => b.append_child(el1).map(|_| ()),
					(true, false) => b.append_child(el2).map(|_| ()),
					_ => Ok(()),
				}.expect_throw("!");
			}
		}

		m1.paint(now, &self.sound);

		if Universe::no_child() { m2.stop(); }
		else if Universe::assign_child() { m1.set_child_animation(m2); }
		m2.paint(now, &self.sound);
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



/// # State Audio.
///
/// This holds a reference to a (detached) audio element and URLs that can be
/// used to point to each of the three audio sources at runtime, either actual
/// `URL` objects in the case of the library, or normal strings for the Firefox
/// extension.
///
/// Its [`StateAudio::play`] method is used by [`Mate`] to initiate playback if
/// and when sound is required.
pub(crate) struct StateAudio {
	/// # Element.
	el: HtmlAudioElement,

	/// # Sounds.
	sound: [String; 3],
}

impl Default for StateAudio {
	#[cfg(not(feature = "firefox"))]
	fn default() -> Self {
		let sound = [
			url(BAA, "audio/flac"),
			url(SNEEZE, "audio/flac"),
			url(YAWN, "audio/flac"),
		];

		Self {
			el: HtmlAudioElement::new().expect_throw("!"),
			sound,
		}
	}

	#[cfg(feature = "firefox")]
	#[expect(clippy::allow_attributes, reason = "Buggy lint.")]
	#[allow(unsafe_code, reason = "For FFI.")]
	fn default() -> Self {
		let sound = [
			firefox_url("sound/baa.flac"),
			firefox_url("sound/sneeze.flac"),
			firefox_url("sound/yawn.flac"),
		];

		Self {
			el: HtmlAudioElement::new().expect_throw("!"),
			sound,
		}
	}
}

#[cfg(not(feature = "firefox"))]
impl Drop for StateAudio {
	fn drop(&mut self) {
		// Revoke the URLs.
		for i in &self.sound { let _res = Url::revoke_object_url(i); }
	}
}

impl StateAudio {
	/// # Play Sound.
	///
	/// This updates the audio source and calls the element's `load` method.
	/// (That should in turn trigger its `canplaythrough` event, which in turn
	/// actually _plays_ the source.)
	///
	/// This method has no conditional logic of its own.
	///
	/// The [`Mate`] calling it ensures the global audio option is enabled, and
	/// the `oncanplaythrough` callback makes sure the page is visible/active.
	pub(crate) fn play(&self, sound: Sound) {
		// Update the source.
		self.el.set_src(match sound {
			Sound::Baa => self.sound[0].as_str(),
			Sound::Sneeze => self.sound[1].as_str(),
			Sound::Yawn => self.sound[2].as_str(),
		});
		// Force a reload, just in case.
		self.el.load();
	}
}



#[expect(clippy::missing_docs_in_private_items, reason = "Self-explanatory.")]
/// # Event Handlers.
///
/// This holds all of the event listeners required to make Poe work. They are
/// bound when the [`State`] is instantiated, and unbound when it is dropped,
/// allowing for proper cleanup once the `StateEvents` object is itself
/// dropped.
struct StateEvents {
	canplaythrough: Closure<dyn FnMut(Event)>,
	contextmenu: Closure<dyn FnMut(Event)>,
	#[cfg(not(feature = "firefox"))] dblclick: Closure<dyn FnMut()>,
	mousedown: Closure<dyn FnMut(MouseEvent)>,
	mousemove: Closure<dyn FnMut(MouseEvent)>,
	mouseup: Closure<dyn FnMut()>,
	resize: Closure<dyn FnMut()>,
}

impl StateEvents {
	/// # New.
	///
	/// This returns a new, ready-to-bind `StateEvents` instance. The `quirks`
	/// variable determines which of the two approaches should be used to
	/// obtain the window dimensions after a resize event.
	fn new(quirks: bool) -> Self {
		Self {
			canplaythrough: Closure::wrap(Box::new(|e: Event|
				// Only proceed to play the sound if the current tab is visible.
				if dom::is_visible() {
					let _res = e.target()
						.and_then(|t| t.dyn_into::<HtmlAudioElement>().ok())
						.and_then(|t| t.play().ok());
				}
			)),
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
	fn bind(&self, mate: &Element, audio: &Element) {
		let document_element = dom::document_element().expect_throw("Missing documentElement.");
		let window = dom::window().expect_throw("Missing window.");

		/// # Helper: Bind.
		macro_rules! bind {
			($el:expr, $event:ident, $passive:literal) => (
				let e = AddEventListenerOptions::new();
				e.set_passive($passive);
				$el.add_event_listener_with_callback_and_add_event_listener_options(
					stringify!($event),
					self.$event.as_ref().unchecked_ref(),
					&e,
				).expect_throw("!");
			);
		}

		bind!(audio, canplaythrough, true);
		bind!(mate, contextmenu, false);
		#[cfg(not(feature = "firefox"))] bind!(mate, dblclick, true);
		bind!(mate, mousedown, true);
		bind!(document_element, mousemove, true);
		bind!(document_element, mouseup, true);
		bind!(window, resize, true);
	}

	/// # Unbind Event Listeners.
	///
	/// Note: this must be called before the object is dropped, otherwise
	/// active references to the callbacks may persist, preventing their memory
	/// from being properly freed.
	fn unbind(&self, mate: &Element, audio: &Element) {
		/// # Helper: Unbind.
		macro_rules! unbind {
			($el:expr, $event:ident) => (
				let _res = $el.remove_event_listener_with_callback(
					stringify!($event),
					self.$event.as_ref().unchecked_ref(),
				).ok();
			);
		}

		unbind!(audio, canplaythrough);
		unbind!(mate, contextmenu);
		#[cfg(not(feature = "firefox"))] unbind!(mate, dblclick);
		unbind!(mate, mousedown);
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
///
/// Note: this may or may not factor in scrollbar widths.
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
///
/// Note: this may or may not factor in scrollbar widths.
fn size_quirks() {
	if let Some(el) = dom::body() {
		let w = normalize_size(el.client_width());
		let h = normalize_size(el.client_height());
		Universe::set_size(w, h);
	}
}

#[expect(
	clippy::cast_possible_truncation,
	clippy::cast_sign_loss,
	reason = "False positive.",
)]
/// # Normalize Size.
///
/// The `clientWidth`/`clientHeight` values are returned as `i32`, but know
/// resolutions can't be negative, so store them as `u16` instead. This merely
/// performs a saturating cast to keep them in that range.
const fn normalize_size(size: i32) -> u16 {
	/// # Maximum Value.
	const MAX: i32 = u16::MAX as i32;

	if size <= 0 { 0 }
	else if size <= MAX { size as u16 }
	else { u16::MAX }
}

/// # Slice to Blob to URL.
///
/// This generates a Javascript `URL` object pointing to a raw binary slice.
///
/// It's a bit of journey to get there. The slice must first be converted to a
/// `Uint8Array`, placed inside an `Array`, and converted to a `Blob` before a
/// `URL` can be generated.
///
/// Thankfully, this is virtually free memory-wise because the underlying data
/// is part of the Wasm itself.
fn url(data: &'static [u8], mime: &str) -> String {
	let bag = BlobPropertyBag::new();
	bag.set_type(mime);
	Blob::new_with_u8_array_sequence_and_options(
		&Array::of1(&Uint8Array::from(data)),
		&bag
	)
		.and_then(|b| Url::create_object_url_with_blob(&b))
		.expect_throw("!")
}
