import { getSettings, saveSettings } from './settings.mjs';

/**
 * Save Options.
 *
 * @param {Event} e Event.
 * @return {boolean} False.
 */
const saveOptions = function(e) {
	e.preventDefault();
	const el = document.getElementById('audio');
	if (null !== el) {
		let val = !! el.checked;
		getSettings().then((s) => {
			if (s.audio !== val) {
				s.audio = val;
				saveSettings(s).then(() => {
					try {
						browser.extension.getBackgroundPage().updateTabs(s);
					}
					catch (e) {}
				});
			}
		});
	}
	return false;
};

/**
 * Restore Options.
 *
 * Update the form elements to reflect the current settings on load.
 *
 * @return {void} Nothing.
 */
const getOptions = function() {
	getSettings().then((v) => {
		const el = document.getElementById('audio');
		if (null !== el) { el.checked = v.audio; }
	});
};

document.addEventListener('DOMContentLoaded', getOptions);
document.getElementById('form').addEventListener('submit', saveOptions);
