/*!
# RS Mate Poe: Sounds.
*/

#[expect(clippy::missing_docs_in_private_items, reason = "Self-explanatory.")]
#[repr(u8)]
#[derive(Debug, Clone, Copy, Eq, PartialEq)]
/// # Sounds.
pub(crate) enum Sound {
	Baa,
	Sneeze,
	Yawn,
}
