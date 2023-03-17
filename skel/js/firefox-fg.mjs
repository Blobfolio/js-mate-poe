/**
 * @file Combined Entry Point.
 *
 * This entry point is used for the single-file (combined) release of JS Mate
 * Poe.
 *
 * Only having one file to deal with is more convenient than two, but comes at
 * the cost of encoding bloat (larger file size).
 */

// Pull in the two things we need from the glue.
import init, { Poe } from './generated/rs_mate_poe.js';

// Pull in the wasm payload.
import { wasmFile } from './generated/wasm_file.mjs';

// Pull in a helper to decode our base64 into a more useful format.
import { base64toBlob } from './b64_to_blob.mjs';

// Let's party like it's 1996!
init(base64toBlob(wasmFile, 'application/wasm').arrayBuffer());

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
