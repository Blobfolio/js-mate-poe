/**
 * @file Firefox Extension: Foreground Script.
 *
 * This is the entry point for the extension's "content script". It loads and
 * initializes the wasm, but manually controls playback (based on signals from
 * the background script).
 */

// Pull in the two things we need from the glue.
import init, { poeInitMedia, Poe } from './generated/glue.mjs';

// Keep track of the Wasm initialization so we don't try to take action too
// early.
let loadedWasm = false;

// Also keep track of duplicate instance warnings so we don't print the same
// message repeatedly.
let libraryDetected = false;

/**
 * Initialize Wasm.
 *
 * Initialize the wasm, then let the background script know we're ready to do
 * stuff.
 *
 * @return {void} Nothing.
 */
init(browser.runtime.getURL('js-mate-poe.wasm')).then((w) => {
	// Initialize media.
	poeInitMedia(w);

	// Let the background script know after a slightly delay.
	setTimeout(function() {
		loadedWasm = true;
		browser.runtime.sendMessage({ action: 'poeTabInit' });
	}, 500);
});

/**
 * Synchronize State.
 *
 * This listens for background-triggered state synchronization requests, and
 * updates the local Poe instance accordingly.
 *
 * In other words, it toggles activeness and/or audio.
 *
 * This will return a Promise boolean if the message was applicable — the sync
 * request we're expecting — or false if not. The promise will be true except
 * in cases where the library version of Poe has been detected, in which case
 * the extension goes dormant to avoid the confusion of having multiple sheep
 * running around at once.
 *
 * @param {!Object} m Message (settings).
 * @return {mixed} Promise or false.
 */
browser.runtime.onMessage.addListener(function(m) {
	if (
		loadedWasm &&
		(null !== m) &&
		('object' === typeof m) &&
		('poeUpdate' === m.action)
	) {
		// Suppress the extension if the library version of Poe is detected on
		// the page. We aren't allowed to check for window.Poe, so the best we
		// can do is look at the page scripts to see if any have the default
		// library name.
		if (Array.from(document.querySelectorAll('script')).some(s => -1 !== s.src.indexOf('js-mate-poe.min.js'))) {
			if (! libraryDetected) {
				libraryDetected = true;
				console.warn('Another instance of JS Mate Poe was detected; the extension has been disabled for this page.');
				Poe.active = false;
			}

			return Promise.resolve(false);
		}

		// Update the state as requested!
		Poe.audio = !! m.audio;
		Poe.active = !! m.active;
		return Promise.resolve(true);
	}
	// This either wasn't the message we were expecting, or it was triggered
	// too soon. Returning a non-promise false lets the background script know
	// no action was taken.
	else { return false; }
});

/**
 * Disable on Exit.
 *
 * This deactivates Poe on exit to clear the elements, etc., from the DOM.
 * While not strictly necessary, this can help workaround inconsistent state
 * issues arising from stale history caches, etc.
 *
 * @return {void} Nothing.
 */
window.addEventListener('beforeunload', function() {
	if (loadedWasm) { Poe.active = false; }
}, { passive: true });
