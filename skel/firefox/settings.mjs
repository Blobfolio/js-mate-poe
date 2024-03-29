/**
 * @file Firefox Extension: Settings.
 */

import { isRealObject } from './is_real_object.mjs';

/**
 * Sanitize Settings.
 *
 * @param {Object} val Settings.
 * @return {Object} Sanitized settings.
 */
export const sanitizeSettings = function(val) {
	const out = {
		active: false,
		audio: false,
		focus: true,
	};

	// Copy valid properties from the source, if any.
	if (isRealObject(val)) {
		if ('undefined' !== typeof val.active) { out.active = !! val.active; }
		if ('undefined' !== typeof val.audio) { out.audio = !! val.audio; }
		if ('undefined' !== typeof val.focus) { out.focus = !! val.focus; }
	}

	return out;
};

/**
 * Get Settings (Nice).
 *
 * Return the settings as an object.
 *
 * @return {Object} Settings.
 */
export const getSettings = async function() {
	return browser.storage.local.get(['active', 'audio', 'focus']).then(
		(raw) => sanitizeSettings(raw),
		() => sanitizeSettings(null),
	);
};

/**
 * Save Settings (Nice).
 *
 * Update the local settings, returning `true` if changed.
 *
 * @param {Object} val Settings.
 * @return {boolean} True/false.
 */
export const saveSettings = async function(val) {
	val = sanitizeSettings(val);
	const old = await getSettings();
	if (
		(old.active === val.active) &&
		(old.audio === val.audio) &&
		(old.focus === val.focus)
	) {
		return Promise.resolve(false);
	}
	else {
		await browser.storage.local.set(val);
		return Promise.resolve(true);
	}
};
