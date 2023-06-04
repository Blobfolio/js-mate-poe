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

	let audio = !! document.getElementById('audio').checked;
	let focus = !! document.getElementById('focus').checked;
	const btn = document.getElementById('btn');
	getSettings().then((s) => {
		s.audio = audio;
		s.focus = focus;
		saveSettings(s).then(async (r) => {
			// If something changed, sync the state.
			if (r) {
				await browser.runtime.sendMessage({action: 'poeBgSyncAll'});
			}

			// Give a visual indication that something happened.
			btn.classList.add('saved');
			setTimeout(function() {
				btn.classList.remove('saved');
			}, 1500);

			return Promise.resolve(true);
		});
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
		document.getElementById('focus').checked = v.focus;
	});
};

document.addEventListener('DOMContentLoaded', getOptions);
document.getElementById('form').addEventListener('submit', saveOptions);
