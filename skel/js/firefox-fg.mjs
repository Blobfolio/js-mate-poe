/**
 * @file Firefox Extension: Foreground Script.
 *
 * Unlike the general library, Poe is started/stopped when signals are
 * received from the extension's background script, and the audio is stored
 * and triggered outside the wasm (to avoid CSP issues).
 */

// Pull in the two things we need from the glue.
import init, { Poe } from './generated/ext/glue.mjs';

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

// Toggle the active state anytime the icon is clicked.
browser.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	if (request.message === "clickedPoe") {
		if (Poe.active) {
			Poe.active = false;
			console.info('Poe stopped.');
		}
		else {
			Poe.active = true;
			console.info('Poe started!');
		}
	}

	return Promise.resolve({ response: Poe.active });
});
