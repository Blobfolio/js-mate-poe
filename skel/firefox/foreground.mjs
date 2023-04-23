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

	// Let the background script know we're here, but only after a slight
	// delay to give the page time to settle.
	setTimeout(function() {
		loadedWasm = true;
		browser.runtime.sendMessage({action: 'poeBgNewConnection'});
	}, 500);
});

/**
 * Synchronize State.
 *
 * This listens for background-triggered state synchronization requests, and
 * updates the local Poe instance accordingly.
 *
 * It will return a boolean Promise letting the background script know whether
 * or not to show its pageIcon, or (regular) false if the script wasn't ready
 * to listen or received some other random message.
 *
 * @param {!Object} m Message (settings).
 * @return {mixed} Promise or false.
 */
browser.runtime.onMessage.addListener(function(m) {
	if (
		loadedWasm &&
		(null !== m) &&
		('object' === typeof m) &&
		('poeFgSync' === m.action)
	) {
		// Suppress the extension if the library version of Poe is detected on
		// the page (as best we can since window.Poe is unavailable to us) to
		// avoid the confusion of having multiple sheep running around.
		if (Array.from(document.querySelectorAll('script')).some(s => -1 !== s.src.indexOf('js-mate-poe.min.js'))) {
			if (! libraryDetected) {
				libraryDetected = true;
				console.warn('Another instance of JS Mate Poe was detected; the extension has been disabled for this page.');
			}

			Poe.active = false;
			return Promise.resolve(false);
		}

		// Update the state as requested!
		if (m.active) {
			Poe.audio = !! m.audio;
			Poe.active = true;
		}
		else { Poe.active = false; }

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
 * This tries to remove any Poe-generated elements and event listeners from the
 * page before it is unloaded to mitigate any inconsistent/stale history
 * caches on subsequent back/next navigation.
 *
 * @return {void} Nothing.
 */
window.addEventListener('beforeunload', function() {
	if (loadedWasm) { Poe.active = false; }
}, { passive: true });
