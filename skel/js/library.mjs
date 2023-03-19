/**
 * @file Library Entry Point.
 *
 * This is the entry point for the library version of JS Mate Poe. It compiles
 * to a sngle file — audio, images, wasm, etc., included.
 */

// Pull in the two things we need from the glue.
import init, { Poe } from './generated/lib/glue.mjs';

// Pull in the wasm payload.
import { wasmFile } from './generated/lib/wasm_b64.mjs';

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
