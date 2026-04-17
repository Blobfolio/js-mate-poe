/*!
# RS Mate Poe: CSS Property Writer.
*/

#[repr(u8)]
#[derive(Debug, Clone, Copy, Eq, Ord, PartialEq, PartialOrd)]
/// # CSS Property Characters.
///
/// This enum contains all of the possible characters used by
/// `CssPropertyBuffer`. While a bit verbose, it proves to both us and the
/// compiler that we can't possibly fuck up a slice so badly it can't be
/// represented as a string. ;)
///
/// TODO: replace with `AsciiChar` if that is ever made stable.
enum CssPropertyChar {
	ChrComma = b',',
	ChrDash =  b'-',
	Chr0 =     b'0',
	Chr1 =     b'1',
	Chr2 =     b'2',
	Chr3 =     b'3',
	Chr4 =     b'4',
	Chr5 =     b'5',
	Chr6 =     b'6',
	Chr7 =     b'7',
	Chr8 =     b'8',
	Chr9 =     b'9',
	ChrP =     b'p',
	ChrX =     b'x',
}

impl CssPropertyChar {
	#[inline]
	/// # From `u32` Digit.
	const fn from_digit(num: u32) -> Self {
		match num % 10 {
			0 => Self::Chr0,
			1 => Self::Chr1,
			2 => Self::Chr2,
			3 => Self::Chr3,
			4 => Self::Chr4,
			5 => Self::Chr5,
			6 => Self::Chr6,
			7 => Self::Chr7,
			8 => Self::Chr8,
			9 => Self::Chr9, // We know n % 10 can't ever be out of range.
			_ => unreachable!(),
		}
	}

	#[expect(clippy::inline_always, reason = "For performance.")]
	#[expect(unsafe_code, reason = "For transmute.")]
	#[inline(always)]
	#[must_use]
	/// # As Str.
	///
	/// Transmute a slice of `CssPropertyChar` into a string slice.
	const fn as_str(src: &[Self]) -> &str {
		// This check is overly-paranoid, but the compiler should
		// optimize it out.
		const {
			assert!(
				align_of::<&[Self]>() == align_of::<&[u8]>() &&
				size_of::<&[Self]>() == size_of::<&[u8]>(),
				"BUG: CssPropertyChar and u8 have different layouts?!",
			);
		}

		// Safety: `CssPropertyChar` is represented by `u8` so shares the
		// same size and alignment.
		unsafe {
			std::str::from_utf8_unchecked(
				std::mem::transmute::<&[Self], &[u8]>(src)
			)
		}
	}
}



#[expect(clippy::missing_docs_in_private_items, reason = "Self-explanatory.")]
#[repr(u8)]
#[derive(Debug, Clone, Copy, Eq, Ord, PartialEq, PartialOrd)]
/// # CSS Property Indices.
///
/// This enum is sized to match `CssPropertyBuffer`, eliminating any doubt in
/// the compiler's mind as to whether or not a given index is in range.
enum CssPropertyIdx {
	Idx00,
	Idx01,
	Idx02,
	Idx03,
	Idx04,
	Idx05,
	Idx06,
	Idx07,
	Idx08,
	Idx09,
	Idx10,
	Idx11,
	Idx12,
	Idx13,
	Idx14,
	Idx15,
	Idx16,
	Idx17,
	Idx18,
	Idx19,
	Idx20,
	Idx21,
	Idx22,
	Idx23,
	Idx24,
	Idx25,
	Idx26,
	Idx27,
	Idx28,
}

impl CssPropertyIdx {
	/// # Max.
	const MAX: Self = Self::Idx28;

	/// # Decrement.
	const fn decrement(self) -> Option<Self> {
		match self {
			Self::Idx00 => None,
			Self::Idx01 => Some(Self::Idx00),
			Self::Idx02 => Some(Self::Idx01),
			Self::Idx03 => Some(Self::Idx02),
			Self::Idx04 => Some(Self::Idx03),
			Self::Idx05 => Some(Self::Idx04),
			Self::Idx06 => Some(Self::Idx05),
			Self::Idx07 => Some(Self::Idx06),
			Self::Idx08 => Some(Self::Idx07),
			Self::Idx09 => Some(Self::Idx08),
			Self::Idx10 => Some(Self::Idx09),
			Self::Idx11 => Some(Self::Idx10),
			Self::Idx12 => Some(Self::Idx11),
			Self::Idx13 => Some(Self::Idx12),
			Self::Idx14 => Some(Self::Idx13),
			Self::Idx15 => Some(Self::Idx14),
			Self::Idx16 => Some(Self::Idx15),
			Self::Idx17 => Some(Self::Idx16),
			Self::Idx18 => Some(Self::Idx17),
			Self::Idx19 => Some(Self::Idx18),
			Self::Idx20 => Some(Self::Idx19),
			Self::Idx21 => Some(Self::Idx20),
			Self::Idx22 => Some(Self::Idx21),
			Self::Idx23 => Some(Self::Idx22),
			Self::Idx24 => Some(Self::Idx23),
			Self::Idx25 => Some(Self::Idx24),
			Self::Idx26 => Some(Self::Idx25),
			Self::Idx27 => Some(Self::Idx26),
			Self::Idx28 => Some(Self::Idx27),
		}
	}
}



#[derive(Debug, Clone, Copy)]
/// # CSS Property Buffer.
///
/// This buffer serves as a reusable scratchpad for the `--c` and `--pos` CSS
/// properties JS Mate Poe is constantly sending back to the browser.
///
/// TODO: replace with CSS Typed OM when baseline.
pub(crate) struct CssPropertyBuffer([CssPropertyChar; 29]);

impl CssPropertyBuffer {
	/// # Default.
	///
	/// Zeroes all the way down.
	pub(crate) const DEFAULT: Self = Self([CssPropertyChar::Chr0; 29]);

	/// # Fallback Value.
	///
	/// If for some (impossible) reason formatting fails, this value is kicked
	/// back instead.
	const FALLBACK: &str = "initial";

	#[must_use]
	/// # Format X Offset.
	///
	/// This method converts a single `i32` pixel offset value to ASCII,
	/// returning a reference as a string slice.
	///
	/// This is used for the sprite image, which only slides along a single
	/// axis.
	pub(crate) const fn format_x(&mut self, value: i32) -> &str {
		if let Some(from) = self.write_i32(value, CssPropertyIdx::MAX) {
			let (_, out) = self.0.split_at(from as usize);
			CssPropertyChar::as_str(out)
		}
		// This shouldn't ever fail.
		else { Self::FALLBACK }
	}

	#[must_use]
	/// # Format X/Y Translation Offsets.
	///
	/// This method converts X/Y `i32` pixel offset values to a comma-separated
	/// ASCII string suitable for `transform: translate3d()`.
	///
	/// (The "Z" part is always "0".)
	///
	/// This is used for the mate wrapper.
	pub(crate) const fn format_xy(&mut self, x: i32, y: i32) -> &str {
		// Start by writing ",0".
		self.0[28] = CssPropertyChar::Chr0;
		self.0[27] = CssPropertyChar::ChrComma;

		// Write the Y.
		let Some(from) = self.write_i32(y, CssPropertyIdx::Idx26) else {
			return Self::FALLBACK;
		};

		// A comma.
		let Some(from) = from.decrement() else { return Self::FALLBACK; };
		self.0[from as usize] = CssPropertyChar::ChrComma;

		// Write the X.
		let Some(from) = from.decrement() else { return Self::FALLBACK; };
		if let Some(from) = self.write_i32(x, from) {
			let (_, out) = self.0.split_at(from as usize);
			CssPropertyChar::as_str(out)
		}
		// This shouldn't ever fail.
		else { Self::FALLBACK }
	}

	#[must_use]
	/// # Write `i32`.
	///
	/// Write a single `i32` pixel value into the buffer at the specified
	/// offset, returning its starting index or `None` if impossible.
	///
	/// (This can't actually fail.)
	const fn write_i32(&mut self, value: i32, mut from: CssPropertyIdx)
	-> Option<CssPropertyIdx> {
		// Start with the suffix.
		self.0[from as usize] = CssPropertyChar::ChrX;
		let Some(idx) = from.decrement() else { return None; };
		from = idx;
		self.0[from as usize] = CssPropertyChar::ChrP;

		// Write the number, one digit at a time, right to left.
		let mut num = value.unsigned_abs();
		loop {
			let Some(idx) = from.decrement() else { return None; };
			from = idx;
			self.0[from as usize] = CssPropertyChar::from_digit(num);
			if 9 < num { num /= 10; }
			else { break; }
		}

		// Negative?
		if value.is_negative() {
			let Some(idx) = from.decrement() else { return None; };
			from = idx;
			self.0[from as usize] = CssPropertyChar::ChrDash;
		}

		Some(from)
	}
}



#[cfg(test)]
mod tests {
	use super::*;
	use wasm_bindgen_test::*;

	#[wasm_bindgen_test]
	fn t_i32_len() {
		// The `CSSProperty` struct assumes the longest possible i32 value
		// is eleven bytes. Let's prove it!
		assert_eq!(i32::MIN.to_string().len(), 11);

		// Now we're getting silly, but let's also prove that u32 tops out at
		// ten.
		assert_eq!(u32::MAX.to_string().len(), 10);
	}

	#[wasm_bindgen_test]
	fn t_css_property_idx() {
		// Make sure the last indices match.
		let mut len = CssPropertyBuffer::DEFAULT.0.len() - 1;
		let mut idx = CssPropertyIdx::MAX;
		assert_eq!(idx as usize, len);

		// Double-check they match all the way down.
		while let Some(next) = idx.decrement() {
			idx = next;
			len -= 1;
			assert_eq!(idx as usize, len);
		}

		// Both should be at zero now.
		assert_eq!(idx, CssPropertyIdx::Idx00);
		assert_eq!(len, 0);
	}

	#[wasm_bindgen_test]
	fn t_css_property_buffer_x() {
		let mut buf = CssPropertyBuffer::DEFAULT;
		assert_eq!(buf.format_x(0), "0px");
		assert_eq!(buf.format_x(10), "10px");
		assert_eq!(buf.format_x(432), "432px");
		assert_eq!(buf.format_x(50_000), "50000px");
		assert_eq!(buf.format_x(i32::MIN), "-2147483648px");
	}

	#[wasm_bindgen_test]
	fn t_css_property_buffer_xy() {
		let mut buf = CssPropertyBuffer::DEFAULT;
		assert_eq!(buf.format_xy(0, 0), "0px,0px,0");
		assert_eq!(buf.format_xy(10, i32::MIN), "10px,-2147483648px,0");
		assert_eq!(buf.format_xy(i32::MIN, 432), "-2147483648px,432px,0");
		assert_eq!(buf.format_xy(50_000, 50_000), "50000px,50000px,0");
		assert_eq!(buf.format_xy(i32::MIN, i32::MIN), "-2147483648px,-2147483648px,0");
	}
}
