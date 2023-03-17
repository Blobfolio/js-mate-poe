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
init(base64toBlob(wasmFile, 'application/wasm').arrayBuffer()).then(() => {
	// Make the Poe instance public.
	window.Poe = Poe;

	// Disable audio?
	if (currentScript.hasAttribute('data-no-audio')) { Poe.audio = false; }

	// Autostart?
	if (! currentScript.hasAttribute('data-no-start')) { Poe.active = true; }
});
