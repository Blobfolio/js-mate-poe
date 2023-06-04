/**
 * @file Firefox Extension: Foreground Script.
 *
 * This is the entry point for the extension's "content script". It loads and
 * initializes the wasm, but manually controls playback (based on signals from
 * the background script).
 */

import { isRealObject } from './is_real_object.mjs';
import init, { Poe } from './generated/glue.mjs';

// Keep track of the Wasm initialization so we don't try to take action too
// early.
let loadedWasm = false;

/**
 * MutationObserver.
 *
 * This fires anytime elements are added or removed (directly) to/from the
 * document body. This allows us to:
 * A) restore our elements if the page accidentally removes them;
 * B) cancel ourselves if a library version of Poe happens to initialize;
 *
 * Note: This observer is only connected when Poe is running.
 *
 * @return {void} Nothing.
 */
const observer = new MutationObserver(function() {
	let found = 0;
	for (el of findMates()) {
		// Add extension-generated elements to the count.
		if ('firefox' === el.getAttribute('data-from')) { found += 1; }
		// Otherwise if it's a library element, request a re-sync to force a
		// disconnection.
		else {
			browser.runtime.sendMessage({action: 'poeBgNewConnection'});
			return;
		}
	}

	// If we're active, we should have two elements.
	if (2 !== found) {
		Poe.fix_bindings();
		console.warn('The page accidentally nuked JS Mate Poe; restoring it now.');
	}
});

/**
 * Clean Orphaned Poe Objects.
 *
 * If the extension is hard-reset — such as during an update — it may leave
 * artifacts behind like DOM elements. This looks for and removes them,
 * return `true` if any were found.
 *
 * This would be a job for the extension API's `onUpdateAvailable` hook, but
 * that doesn't execute reliably. Oh well.
 *
 * @return {boolean} True/false.
 */
const cleanOrphanedMates = function() {
	let old = false;
	for (el of findMates()) {
		if ('firefox' === el.getAttribute('data-from')) {
			document.body.removeChild(el);
			old = true;
		}
	}
	return old;
};

/**
 * Find Mate Elements.
 *
 * This will return an array of all mate elements bound to the body, whether
 * added by the library or extension.
 *
 * @return {!Array} Elements.
 */
const findMates = function() {
	return Array.from(document.querySelectorAll('.js-mate-poe-mate'));
};

/**
 * Library Poes.
 *
 * This will return `true` if there are any library instances of JS Mate Poe
 * (1.5.0+) on the page so we can suppress the extension. (Older versions will
 * be missed, but it isn't a very common script.)
 *
 * @return {boolean} True/false.
 */
const hasLibraryPoe = function() {
	return findMates().some(el => 'firefox' !== el.getAttribute('data-from'));
};

/**
 * Activate Poe.
 *
 * Turn Poe on, but only if it isn't already running. This will also connect
 * the MutationObserver so we can keep tabs on our elements.
 *
 * Returns `true` if activeness changed.
 *
 * @param {boolean} audio Audio.
 * @param {boolean} focus Focus.
 * @return {boolean} True/false.
 */
const poeOn = function(audio, focus) {
	// Basic settings.
	Poe.audio = !! audio;
	Poe.focus = !! focus;

	// Turn it on if it isn't already running.
	if (! Poe.active) {
		Poe.active = true;
		observer.observe(document.body, { childList: true });
		return true;
	}

	return false;
};

/**
 * Deactivate Poe.
 *
 * This will also disconnect the MutationObserver.
 *
 * Returns `true` if activeness changed.
 *
 * @return {void} Nothing.
 */
const poeOff = function() {
	if (Poe.active) {
		observer.disconnect();
		Poe.active = false;
		return true;
	}

	return false;
}

/**
 * Initialize Wasm.
 *
 * Initialize the wasm, then let the background script know we're ready to do
 * stuff.
 *
 * @return {void} Nothing.
 */
init(browser.runtime.getURL('js-mate-poe.wasm')).then(() => {
	// Clean up old instances, if any.
	if (cleanOrphanedMates()) {
		console.warn('Removed orphaned JS Mate Poe element(s) from the page.');
	}

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
	if (loadedWasm && isRealObject(m) && 'poeFgSync' === m.action) {
		// Suppress the extension if the library version of Poe is running to
		// avoid confusion.
		if (hasLibraryPoe()) {
			if (poeOff()) {
				console.warn('Detected another instance of JS Mate Poe; disabling the extension for this page.');
			}
			return Promise.resolve(false);
		}

		// Update the state as requested!
		if (m.active) { poeOn(m.audio, m.focus); }
		else { poeOff(); }

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
	if (loadedWasm) { poeOff(); }
}, { passive: true });
