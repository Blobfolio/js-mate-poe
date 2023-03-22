const poeFlagActive =  0b0001;        // Let Poe run around the screen.
const poeFlagAudio =   0b0010;        // Enable audio playback.

const poeFlagMask =    0b0011;        // Mask of possible settings.
const poeFlagDefault = poeFlagAudio;  // Default value.

/**
 * Get Settings (RAW).
 *
 * Return the current extension settings as a single bitflag.
 *
 * @return {number} Extension settings.
 */
const getSettingsRaw = async function() {
	return browser.storage.local.get(null).then(
		function(raw) {
			if (
				(null !== raw) &&
				('object' === typeof raw) &&
				'number' === typeof raw.flags
			) {
				return raw.flags & poeFlagMask;
			}
			else { return poeFlagDefault; }
		},
		function() { return poeFlagDefault; },
	);
};

/**
 * Save Settings (RAW).
 *
 * Save the extension settings, again, as a single bitflag.
 *
 * @param {number} val Value.
 * @return {boolean} True.
 */
const saveSettingsRaw = async function(val) {
	val = (Number(val) || 0) & poeFlagMask;
	await browser.storage.local.set({ flags: val });
	return Promise.resolve(true);
};

/**
 * Get Settings (Nice).
 *
 * Return the settings as an object.
 *
 * @return {Object} Settings.
 */
export const getSettings = async function() {
	let flags = await getSettingsRaw();
	const out = {
		active: (poeFlagActive === (flags & poeFlagActive)),
		audio:  (poeFlagAudio === (flags & poeFlagAudio)),
	};
	return Promise.resolve(out);
};

/**
 * Save Settings (Nice).
 *
 * Update the local settings, returning `true` if changed.
 *
 * @param {Object} settings Settings.
 * @return {boolean} True/false.
 */
export const saveSettings = async function(settings) {
	let flags = 0b0000;
	if ((null !== settings) && ('object' === typeof settings)) {
		if (settings.active) { flags |= poeFlagActive; }
		if (settings.audio)  { flags |= poeFlagAudio; }
	}

	let old = await getSettingsRaw();
	if (old === flags) {
		return Promise.resolve(false);
	}
	else {
		await saveSettingsRaw(flags);
		return Promise.resolve(true);
	}
};
