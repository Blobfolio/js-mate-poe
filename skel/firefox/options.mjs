/**
 * @file Firefox Extension: Options Script.
 *
 * This is the entry point for the extension's options page script. It ensures
 * the checkboxes reflect the current settings when the preferences are first
 * loaded, and handles form submissions (i.e. saving the settings).
 */

import { getSettings, saveSettings } from './settings.mjs';

/**
 * Save Options.
 *
 * @param {Event} e Event.
 * @return {boolean} False.
 */
const saveOptions = function(e) {
	e.preventDefault();

	let val = !! document.getElementById('audio').checked;
	const btn = document.getElementById('btn');
	getSettings().then((s) => {
		if (s.audio !== val) {
			s.audio = val;
			saveSettings(s).then(() => {
				try { browser.extension.getBackgroundPage().updateTabs(); }
				catch (e) {}

				// Give a visual indication that something happened.
				btn.classList.add('saved');
				setTimeout(function() {
					btn.classList.remove('saved');
				}, 1500);
			});
		}
		else {
			// Give a visual indication that something would have happened, had
			// the settings actually needed saving. Haha.
			btn.classList.add('saved');
			setTimeout(function() {
				btn.classList.remove('saved');
			}, 500);
		}
	});

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
		document.getElementById('audio').checked = v.audio;
	});
};

document.addEventListener('DOMContentLoaded', getOptions);
document.getElementById('form').addEventListener('submit', saveOptions);
