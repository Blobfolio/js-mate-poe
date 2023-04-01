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
	F018, // f.19
	F019, // f.20
	F020, // f.21
	F021, // f.22
	F022, // f.23
	F023, // f.24
	F024, // f.25
	F025, // f.26
	F026, // f.28
	F027, // f.29
	F028, // f.30
	F029, // f.31
	F030, // f.32
	F031, // f.33
	F032, // f.34
	F033, // f.35
	F034, // f.36
	F035, // f.37
	F036, // f.38
	F037, // f.39
	F038, // f.42
	F039, // f.43
	F040, // f.44
	F041, // f.131
	F042, // f.132
	F043, // f.133
	F044, // f.81
	F045, // f.82
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
	F074, // f.76
	F075, // f.77
	F076, // f.78
	F077, // f.79
	F078, // f.80
	F079, // f.107
	F080, // f.108
	F081, // f.109
	F082, // f.110
	F083, // f.111
	F084, // f.86
	F085, // f.87
	F086, // f.88
	F087, // f.89
	F088, // f.90
	F089, // f.91
	F090, // f.92
	F091, // f.93
	F092, // f.94
	F093, // f.95
	F094, // f.96
	F095, // f.97
	F096, // f.98
	F097, // f.99
	F098, // f.100
	F099, // f.101
	F100, // f.102
	F101, // f.103
	F102, // f.104
	F103, // f.105
	F104, // f.106
	F105, // f.112
	F106, // f.113
	F107, // f.114
	F108, // f.115
	F109, // f.116
	F110, // f.117
	F111, // f.118
	F112, // f.119
	F113, // f.120
	F114, // f.121
	F115, // f.122
	F116, // f.123
	F117, // f.124
	F118, // f.125
	F119, // f.126
	F120, // f.127
	F121, // f.128
	F122, // f.129
	F123, // f.130
	F124, // f.134
	F125, // f.135
	F126, // f.136
	F127, // f.137
	F128, // f.138
	F129, // f.139
	F130, // f.140
	F131, // f.141
	F132, // f.142
	F133, // f.143
	F134, // f.144
	F135, // f.145
	F136, // f.146
	F137, // f.147
	F138, // f.148
	F139, // f.153
	F140, // f.149
	F141, // f.150
	F142, // f.151
	F143, // f.152
	F144, // f.154
	F145, // f.155
	F146, // f.156
	F147, // f.157
	F148, // f.158
	F149, // f.159
	F150, // f.160
	F151, // f.161
	F152, // f.162
	F153, // f.163
	F154, // f.164
	F155, // f.165
	F156, // f.166
	F157, // f.167
	F158, // f.168

	FH32, // f.169 (half-frame)
	FH33, // f.170 (half-frame)
	FH34, // f.171 (half-frame)

	None, // Empty tile.
}

impl Frame {
	/// # Tile Size (Unsigned).
	pub(crate) const SIZE: u16 = 40;

	/// # Tile Size (Signed).
	pub(crate) const SIZE_I: i32 = 40;

	/// # Half Frame.
	///
	/// Three tiles used by the bath animation are redundant in that they're
	/// identical to three other tiles, except only the top halves are
	/// displayed. Rather than keeping these tiles, we're just using the others
	/// and halving the wrapper height with CSS.
	pub(crate) const fn half_frame(self) -> bool {
		matches!(self, Self::FH32 | Self::FH33 | Self::FH34)
	}

	/// # Sprite Offset.
	///
	/// The (X) transform to apply to the sprite to get this particular frame.
	pub(crate) const fn offset(self) -> i32 {
		match self {
			Self::None => Self::SIZE_I,
			Self::FH32 => 32 * -Self::SIZE_I,
			Self::FH33 => 33 * -Self::SIZE_I,
			Self::FH34 => 34 * -Self::SIZE_I,
			_ => self as i32 * -Self::SIZE_I,
		}
	}
}
