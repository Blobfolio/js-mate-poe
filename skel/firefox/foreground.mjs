/**
 * @file Firefox Extension: Foreground Script.
 *
 * This is the entry point for the extension's "content script". It loads and
 * initializes the wasm, but manually controls playback (based on signals from
 * the background script).
 */

// Pull in the two things we need from the glue.
import init, { Poe } from './generated/glue.mjs';

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
		audio.play().catch(() => {});
	}
}, { passive: true });

/**
 * Toggle State
 *
 * Turn Poe on or off, and/or the audio on or off, for the page running this
 * script.
 *
 * @param {Object} request Request.
 * @return {void} Nothing.
 */
browser.runtime.onMessage.addListener(function(request) {
	if (
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
});
