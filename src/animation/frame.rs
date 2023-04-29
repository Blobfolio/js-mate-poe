/*!
# RS Mate Poe: Frame
*/

#[repr(u8)]
#[derive(Debug, Clone, Copy, Eq, PartialEq)]
/// # Animation Frame.
pub(crate) enum Frame {
	F000 = 0_u8,
	F001,
	F002,
	F003,
	F004,
	F005,
	F006,
	F007,
	F008,
	F009,
	F010,
	F011,
	F012,
	F013,
	F014,
	F015,
	F016,
	F017,
	F018,
	F019,
	F020,
	F021,
	F022,
	F023,
	F024,
	F025,
	F026,
	F027,
	F028,
	F029,
	F030,
	F031,
	F032,
	F033,
	F034,
	F035,
	F036,
	F037,
	F038,
	F039,
	F040,
	F041,
	F042,
	F043,
	F044,
	F045,
	F046,
	F047,
	F048,
	F049,
	F050,
	F051,
	F052,
	F053,
	F054,
	F055,
	F056,
	F057,
	F058,
	F059,
	F060,
	F061,
	F062,
	F063,
	F064,
	F065,
	F066,
	F067,
	F068,
	F069,
	F070,
	F071,
	F072,
	F073,
	F074,
	F075,
	F076,
	F077,
	F078,
	F079,
	F080,
	F081,
	F082,
	F083,
	F084,
	F085,
	F086,
	F087,
	F088,
	F089,
	F090,
	F091,
	F092,
	F093,
	F094,
	F095,
	F096,
	F097,
	F098,
	F099,
	F100,
	F101,
	F102,
	F103,
	F104,
	F105,
	F106,
	F107,
	F108,
	F109,
	F110,
	F111,
	F112,
	F113,
	F114,
	F115,
	F116,
	F117,
	F118,
	F119,
	F120,
	F121,
	F122,
	F123,
	F124,
	F125,
	F126,
	F127,
	F128,
	F129,
	F130,
	F131,
	F132,
	F133,
	F134,
	F135,
	F136,
	F137,
	F138,
	F139,
	F140,
	F141,
	F142,
	F143,
	F144,
	F145,
	F146,
	F147,

	H037, // Half-frame.
	H038, // Half-frame.
	H039, // Half-frame.

	M024, // Masked.
	M082, // Masked.
	M126, // Masked.

	None, // Empty tile.
}

impl Frame {
	/// # Tile Size (Unsigned).
	pub(crate) const SIZE: u16 = 40;

	/// # Tile Size (Signed).
	pub(crate) const SIZE_I: i32 = 40;

	/// # Frame Alias.
	///
	/// Returns the frame alias if this is a special masked/etc. version of
	/// another frame, or -1 if not.
	pub(crate) const fn dba(self) -> i16 {
		match self {
			Self::H037 => 37,
			Self::H038 => 38,
			Self::H039 => 39,
			Self::M024 => 24,
			Self::M082 => 82,
			Self::M126 => 126,
			_ => -1
		}
	}

	/// # Sprite Offset.
	///
	/// The (X) transform to apply to the sprite to get this particular frame.
	pub(crate) const fn offset(self) -> i32 {
		match self {
			Self::None => Self::SIZE_I,
			Self::H037 => 37 * -Self::SIZE_I,
			Self::H038 => 38 * -Self::SIZE_I,
			Self::H039 => 39 * -Self::SIZE_I,
			Self::M024 => 24 * -Self::SIZE_I,
			Self::M082 => 82 * -Self::SIZE_I,
			Self::M126 => 126 * -Self::SIZE_I,
			_ => self as i32 * -Self::SIZE_I,
		}
	}
}
