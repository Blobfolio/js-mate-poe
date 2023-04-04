/**
 * @file Firefox Extension: Foreground Script.
 *
 * This is the entry point for the extension's "content script". It loads and
 * initializes the wasm, but manually controls playback (based on signals from
 * the background script).
 */

// Pull in the two things we need from the glue.
import init, { poeInitMedia, Poe } from './generated/glue.mjs';

/**
 * Initialize and Connect!
 *
 * This initializes the wasm binary, then creates a connection to the
 * background script. (That script will in turn let us know the current
 * settings, and ping us if there are any updates down the road.)
 *
 * @return {void} Nothing.
 */
init(browser.runtime.getURL('js-mate-poe.wasm')).then((w) => {
	// Initialize media.
	poeInitMedia(w);

	// Take a brief moment before issuing the connection to help mitigate any
	// signal criss-crosses from rapid changes.
	setTimeout(function() {
		// Abort if this page seems to have the library version of JS Mate Poe
		// enqueued. (It would be confusing have two Poes running around.)
		if (Array.from(document.querySelectorAll('script')).some(s => -1 !== s.src.indexOf('js-mate-poe.min.js'))) {
			console.warn('Another instance of JS Mate Poe was detected; the extension has been disabled for this page.');
			Poe.active = false;
			return Promise.resolve(false);
		}

		// Okay, let's connect to the background script now!
		let port = browser.runtime.connect({ name: 'Poe-' + Math.random().toString() });

		/**
		 * Synchronize State.
		 *
		 * The background script will let us know the current settings after
		 * connecting, and let us know if they change down the road. This
		 * synchronizes our state accordingly.
		 *
		 * @param {Object} m Message.
		 * @return {void} Nothing.
		 */
		port.onMessage.addListener((m) => {
			if ((null !== m) && ('object' === typeof m) && ('poeUpdate' === m.action)) {
				Poe.audio = !! m.audio;
				Poe.active = !! m.active;
			}
		});

		/**
		 * Disconnect on Leave.
		 *
		 * Make sure Poe is inactive before we leave the page, just in case the
		 * browser decides to leave back/next history in a weird half-
		 * remembered state.
		 *
		 * @return {void} Nothing.
		 */
		window.addEventListener('beforeunload', function() {
			Poe.active = false;
		}, { passive: true });

		/**
		 * Disconnect Handler.
		 *
		 * This ensures the state is cleaned up in the unlikely event the
		 * background script cancels us. (Annoyingly, it won't trigger if we
		 * cancel ourselves, hence all the duplicate code.)
		 *
		 * @return {void} Nothing.
		 */
		port.onDisconnect.addListener(() => { Poe.active = false; });
	}, 250);
});
