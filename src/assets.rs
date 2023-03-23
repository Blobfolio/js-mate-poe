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

// Register the Blob/URLs _once_ and hold onto them since garbage collection is
// iffy.
thread_local! {
	static IMG_POE: String = url(include_bytes!("../skel/img/poe.png"), "image/png");
}

#[cfg(not(feature = "firefox"))]
thread_local! {
	static SND_BAA: String = url(include_bytes!("../skel/sound/baa.flac"), "audio/flac");
	static SND_SNEEZE: String = url(include_bytes!("../skel/sound/sneeze.flac"), "audio/flac");
	static SND_YAWN: String = url(include_bytes!("../skel/sound/yawn.flac"), "audio/flac");
}



#[inline]
/// # Image Sprite.
///
/// Return an image element populated with the sprite.
pub(crate) fn sprite_image_element() -> HtmlImageElement {
	let el = HtmlImageElement::new_with_width_and_height(Frame::SPRITE_WIDTH, Frame::SPRITE_HEIGHT)
		.expect_throw("!");
	el.set_id("i");
	IMG_POE.with(|s| el.set_src(s));
	el
}



#[repr(u8)]
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
			Self::Baa => SND_BAA.with(|s| HtmlAudioElement::new_with_src(s).ok()),
			Self::Sneeze => SND_SNEEZE.with(|s| HtmlAudioElement::new_with_src(s).ok()),
			Self::Yawn => SND_YAWN.with(|s| HtmlAudioElement::new_with_src(s).ok()),
		}
			.and_then(|obj| obj.play().ok());
	}
}



/// # Slice to Blob to URL.
fn url(data: &'static [u8], mime: &str) -> String {
	Blob::new_with_u8_array_sequence_and_options(
		&Array::of1(&Uint8Array::from(data)),
		BlobPropertyBag::new().type_(mime)
	)
		.and_then(|b| Url::create_object_url_with_blob(&b))
		.expect_throw("!")
}
