/**
 * @file Firefox Extension: Foreground Script.
 *
 * Unlike the general library, Poe is started/stopped when signals are
 * received from the extension's background script, and the audio is stored
 * and triggered outside the wasm (to avoid CSP issues).
 */

// Pull in the two things we need from the glue.
import init, { Poe } from './generated/glue.mjs';

// Let's party like it's 1996!
init(browser.runtime.getURL('js-mate-poe.wasm'));

// Sounds.
const Sounds = {
	'baa': 'sound/baa.flac',
	'sneeze': 'sound/sneeze.flac',
	'yawn': 'sound/yawn.flac',
};

// Play Sound.
document.addEventListener('poe-sound', function(e) {
	if ('string' === typeof Sounds[e.detail]) {
		const audio = new Audio(browser.runtime.getURL(Sounds[e.detail]));
		audio.play().catch(() => {});
	}
}, { passive: true });

/**
 * Toggle State
 *
 * Turn Poe on or off for the current page according to the wishes of the
 * background script.
 *
 * @param {Object} request Request.
 * @return {void} Nothing.
 */
browser.runtime.onMessage.addListener(function(request) {
	if ('startPoe' === request.message) {
		if (! Poe.active) {
			Poe.active = true;
		}
	}
	else if (('stopPoe' === request.message) && Poe.active) {
		Poe.active = false;
	}
});
