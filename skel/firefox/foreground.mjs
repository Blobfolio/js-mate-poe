/**
 * @file Firefox Extension: Foreground Script.
 *
 * This is the entry point for the extension's "content script". It loads and
 * initializes the wasm, but manually controls playback (based on signals from
 * the background script).
 */

// Pull in the two things we need from the glue.
import init, { Poe } from './generated/glue.mjs';

/**
 * Check for JS Mate Poe Library Script.
 *
 * Returns true if the library version of JS Mate Poe is (maybe) attached to
 * the page. (We don't want to run two instances as that would be confusing.)
 *
 * This could be easily done by looking for window.Poe — which the library adds
 * — but browser extensions can't see page-created window properties.
 *
 * The best we can do is enumerate the document's script elements to see if any
 * have a source like 'js-mate-poe.min.js' — the default name.
 *
 * There shouldn't be any false positives, but this will miss scripts that were
 * renamed or bundled. Still, better than nothing.
 *
 * @return {boolean} True/false.
 */
const hasLibrary = function() {
	const scripts = document.querySelectorAll('script');
	if (null !== scripts) {
		for (script of scripts) {
			if (-1 !== script.src.indexOf('js-mate-poe.min.js')) {
				return true;
			}
		}
	}

	return false;
};

// Let's party like it's 1996!
init(browser.runtime.getURL('js-mate-poe.wasm'));

// Sounds.
const Sounds = [
	'sound/baa.flac',
	'sound/sneeze.flac',
	'sound/yawn.flac',
];

/**
 * Play Sound
 *
 * This script has to manually handle audio playback (rather than letting the
 * wasm do it) to work around potential CSP conflicts.
 *
 * The wasm still has to figure out what to play and when, so triggers a
 * custom "poe-sound" event with the details that this script can react to.
 *
 * @param {Event} e Event.
 * @return {void} Nothing.
 */
document.addEventListener('poe-sound', function(e) {
	let idx = Number(e.detail);
	if (! isNaN(idx) && 0 <= idx && idx < Sounds.length) {
		const audio = new Audio(browser.runtime.getURL(Sounds[idx]));
		audio.play().catch((e) => {});
	}
}, { passive: true });

/**
 * Toggle State
 *
 * Turn Poe on or off, and/or the audio on or off, for the page running this
 * script.
 *
 * Returns false if this tab should not be doing stuff, otherwise false.
 *
 * @param {Object} request Request.
 * @return {boolean} True/false.
 */
browser.runtime.onMessage.addListener(function(request) {
	// If the library version of JS Mate Poe is detected, make sure the
	// extension version is off (for this page), and let the background script
	// know so it can hide the pageAction icon.
	if (hasLibrary()) {
		if (Poe.active) {
			console.warn('Another JS Mate Poe instance was detected; disabling the extension for this page.');
			Poe.active = false;
		}
		return Promise.resolve(false);
	}
	// Otherwise synchronize the audio and/or activeness with the background
	// state.
	else if (
		(null !== request.message) &&
		('object' === typeof request.message) &&
		('updateFg' === request.message.message)
	) {
		if (Poe.audio !== request.message.audio) {
			Poe.audio = !! request.message.audio;
		}
		if (Poe.active !== request.message.active) {
			Poe.active = !! request.message.active;
		}
	}

	return Promise.resolve(true);
});
