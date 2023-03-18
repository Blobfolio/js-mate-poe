/*!
# RS Mate Poe: Assets
*/

use crate::dom;
use web_sys::Blob;



const IMG_POE: &[u8] = include_bytes!("../skel/img/poe.png");

#[cfg(not(feature = "firefox"))] const SND_BAA: &[u8] = include_bytes!("../skel/sound/baa.flac");
#[cfg(not(feature = "firefox"))] const SND_SNEEZE: &[u8] = include_bytes!("../skel/sound/sneeze.flac");
#[cfg(not(feature = "firefox"))] const SND_YAWN: &[u8] = include_bytes!("../skel/sound/yawn.flac");



#[derive(Debug, Clone, Copy)]
/// # Image Sprite.
pub(crate) struct Sprite;

impl Sprite {
	/// # Tile Size.
	pub(crate) const TILE_SIZE: u16 = 40;

	/// # Tile Size.
	pub(crate) const TILE_SIZE_I: i32 = 40;

	/*
	/// # Image Width.
	pub(crate) const WIDTH: &str = "640";

	/// # Image Height.
	pub(crate) const HEIGHT: &str = "440";

	/// # Number of Tiles.
	pub(crate) const TILES: u8 = 176;

	/// # Number of Tiles Per Row.
	pub(crate) const TILES_X: u8 = 16;

	/// # Number of Tile Rows.
	pub(crate) const TILES_Y: u8 = 11;
	*/

	/// # Empty/Blank Tile.
	pub(crate) const EMPTY_TILE: u8 = 173;

	/// # As Blob.
	pub(crate) fn as_blob() -> Blob { dom::blob(IMG_POE, "image/png") }
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
	/// # As Blob.
	pub(crate) fn as_blob(self) -> Blob {
		match self {
			Self::Baa => dom::blob(SND_BAA, "audio/flac"),
			Self::Sneeze => dom::blob(SND_SNEEZE, "audio/flac"),
			Self::Yawn => dom::blob(SND_YAWN, "audio/flac"),
		}
	}
}
