/*!
# RS Mate Poe: Assets
*/

use crate::dom;
use web_sys::Blob;



const IMG_POE: &[u8] = include_bytes!("../skel/img/poe.png");

#[allow(unused_macros)]
macro_rules! audio {
	($ext:literal) => (
		const SND_BAA: &[u8] = include_bytes!(concat!("../skel/sound/baa.", $ext));
		const SND_SNEEZE: &[u8] = include_bytes!(concat!("../skel/sound/sneeze.", $ext));
		const SND_YAWN: &[u8] = include_bytes!(concat!("../skel/sound/yawn.", $ext));
		const SND_MIME: &str = concat!("audio/", $ext);
	);
}

#[cfg(not(any(feature = "flac", feature = "firefox")))] audio!("mp3");
#[cfg(feature = "flac")] audio!("flac");



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
			Self::Baa => dom::blob(SND_BAA, SND_MIME),
			Self::Sneeze => dom::blob(SND_SNEEZE, SND_MIME),
			Self::Yawn => dom::blob(SND_YAWN, SND_MIME),
		}
	}
}
