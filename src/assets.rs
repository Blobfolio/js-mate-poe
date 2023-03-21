/*!
# RS Mate Poe: Assets
*/

use crate::Frame;
use js_sys::{
	Array,
	Uint8Array,
};
use wasm_bindgen::prelude::*;
use web_sys::{
	Blob,
	BlobPropertyBag,
	HtmlImageElement,
	Url,
};


thread_local! {
	// Create and hold onto a Blob representation of the image data to keep it
	// in memory for the lifetime of the program.
	static IMG_POE: Blob = slice_to_blob(include_bytes!("../skel/img/poe.png"), "image/png");

	// Generate and hold onto a URL to keep the browser from repeating itself.
	static IMG_POE_URL: String = IMG_POE.with(Url::create_object_url_with_blob).unwrap_throw();
}

#[cfg(not(feature = "firefox"))]
thread_local! {
	// Same as with the image; make and keep some Blobs and URLs.
	static SND_BAA: Blob = slice_to_blob(include_bytes!("../skel/sound/baa.flac"), "audio/flac");
	static SND_SNEEZE: Blob = slice_to_blob(include_bytes!("../skel/sound/sneeze.flac"), "audio/flac");
	static SND_YAWN: Blob = slice_to_blob(include_bytes!("../skel/sound/yawn.flac"), "audio/flac");

	static SND_BAA_URL: String = SND_BAA.with(Url::create_object_url_with_blob).unwrap_throw();
	static SND_SNEEZE_URL: String = SND_SNEEZE.with(Url::create_object_url_with_blob).unwrap_throw();
	static SND_YAWN_URL: String = SND_YAWN.with(Url::create_object_url_with_blob).unwrap_throw();
}



#[inline]
/// # Image Sprite.
///
/// Return an image element populated with the sprite.
pub(crate) fn sprite_image_element() -> HtmlImageElement {
	let el = HtmlImageElement::new_with_width_and_height(Frame::SPRITE_WIDTH, Frame::SPRITE_HEIGHT)
		.unwrap_throw();
	el.set_id("i");
	IMG_POE_URL.with(|s| el.set_src(s));
	el
}



#[allow(missing_docs)]
#[derive(Debug, Clone, Copy, Eq, PartialEq)]
/// # Sounds.
pub(crate) enum Sound {
	Baa,
	Sneeze,
	Yawn,
}

#[cfg(not(feature = "firefox"))]
impl Sound {
	/// # Play Sound.
	pub(crate) fn play(self) {
		use web_sys::HtmlAudioElement;

		match self {
			Self::Baa => SND_BAA_URL.with(|s| HtmlAudioElement::new_with_src(s).ok()),
			Self::Sneeze => SND_SNEEZE_URL.with(|s| HtmlAudioElement::new_with_src(s).ok()),
			Self::Yawn => SND_YAWN_URL.with(|s| HtmlAudioElement::new_with_src(s).ok()),
		}
			.and_then(|obj| obj.play().ok());
	}
}



/// # Slice to Blob.
fn slice_to_blob(data: &'static [u8], mime: &str) -> Blob {
	Blob::new_with_u8_array_sequence_and_options(
		&Array::of1(&Uint8Array::from(data)),
		BlobPropertyBag::new().type_(mime)
	).unwrap_throw()
}
