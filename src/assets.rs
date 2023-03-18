/*!
# RS Mate Poe: Assets
*/

use crate::dom;
use web_sys::Blob;



const IMG_POE: &[u8] = include_bytes!("../skel/img/poe.png");

#[cfg(not(feature = "firefox"))] const SND_BAA: &[u8] = include_bytes!("../skel/sound/baa.flac");
#[cfg(not(feature = "firefox"))] const SND_SNEEZE: &[u8] = include_bytes!("../skel/sound/sneeze.flac");
#[cfg(not(feature = "firefox"))] const SND_YAWN: &[u8] = include_bytes!("../skel/sound/yawn.flac");



/// # Image Sprite.
pub(crate) fn sprite_as_blob() -> Blob { dom::blob(IMG_POE, "image/png") }



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
	/// # As Blob.
	pub(crate) fn as_blob(self) -> Blob {
		match self {
			Self::Baa => dom::blob(SND_BAA, "audio/flac"),
			Self::Sneeze => dom::blob(SND_SNEEZE, "audio/flac"),
			Self::Yawn => dom::blob(SND_YAWN, "audio/flac"),
		}
	}
}
