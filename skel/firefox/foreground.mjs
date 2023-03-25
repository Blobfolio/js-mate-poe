/**
 * @file Firefox Extension: Foreground Script.
 *
 * This is the entry point for the extension's "content script". It loads and
 * initializes the wasm, but manually controls playback (based on signals from
 * the background script).
 */

// Pull in the two things we need from the glue.
import init, { Poe } from './generated/glue.mjs';

// Relative Audio File Locations.
const Sounds = [
	'sound/baa.flac',
	'sound/sneeze.flac',
	'sound/yawn.flac',
];

// This flag is used to keep track of whether or not we have let the user know
// they might need to click the page before Firefox will let audio playback
// happen. (We don't want to bother them twice.)
let audioWarned = false;

/**
 * Play Sound
 *
 * This script has to manually handle audio playback (rather than letting the
 * wasm do it) to work around potential per-site CSP conflicts.
 *
 * The wasm still has to figure out what to play and when, so triggers a
 * custom "poe-sound" event with the details for us.
 *
 * @param {Event} e Event.
 * @return {void} Nothing.
 */
document.addEventListener('poe-sound', function(e) {
	let idx = parseInt(e.detail);
	if (! isNaN(idx) && 0 <= idx && idx < Sounds.length) {
		const url = browser.runtime.getURL(Sounds[idx]);
		const audio = new Audio(url);
		audio.addEventListener("canplaythrough", () => {
			audio.play().catch((e) => {
				if (! audioWarned) {
					audioWarned = true;
					console.info('You might have to click somewhere (anywhere) on the page before Firefox will let audio play.')
				}
			});
		}, { once: true, passive: true });
	}
}, { passive: true });

/**
 * Check for JS Mate Poe Library Script.
 *
 * We aren't allowed to check the existence of a window.Poe object directly.
 * The best we can do is run through the script sources to see if there's
 * anything matching the default script name.
 *
 * This is unlikely to produce any false positives, but will miss scripts that
 * have been renamed or bundled. Still, it's better than nothing…
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

/**
 * Initialize and Connect!
 *
 * This initializes the wasm binary, then creates a connection to the
 * background script. (That script will in turn let us know the current
 * settings, and ping us if there are any updates down the road.)
 *
 * @return {void} Nothing.
 */
init(browser.runtime.getURL('js-mate-poe.wasm')).then(() => {
	// Take a brief moment before issuing the connection to help mitigate any
	// signal criss-crosses from rapid changes.
	setTimeout(function() {
		// Abort if this page seems to have the library version of JS Mate Poe
		// enqueued. (It would be confusing have two Poes running around.)
		if (hasLibrary()) {
			console.warn('Another instance of JS Mate Poe was detected; the extension has been disabled for this page.');
			Poe.active = false;
			return Promise.resolve(false);
		}

		// Firefox produces intermittent "decoding" errors with the audio
		// files. This seems to happen most often during the first request, so
		// maybe "priming" will help? It certainly won't hurt…
		for (let i = 0; i < Sounds.length; i++) {
			let url = browser.runtime.getURL(Sounds[i]);
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
		 * Pre-emptively ensure the state is unloaded before discarding the
		 * page. (The browser doesn't always do this, particularly during
		 * back/next navigation.)
		 *
		 * @return {void} Nothing.
		 */
		window.addEventListener('beforeunload', function() {
			try {
				Poe.active = false;
				port.disconnect();
			}
			catch (e) { console.warn('unload failed', e); }
		}, { once: true, passive: true });

		/**
		 * Disconnect Handler.
		 *
		 * This ensures the state is cleaned up in the unlikely event the
		 * background script cancels us. (Annoyingly, it won't trigger if we
		 * cancel ourselves, hence all the duplicate code.)
		 *
		 * @return {void} Nothing.
		 */
		port.onDisconnect.addListener((p) => { Poe.active = false; });
	}, 250);
});
