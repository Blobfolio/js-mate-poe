/**
 * @file Library Entry Point.
 *
 * This is the entry point for the library version of JS Mate Poe. It compiles
 * to a sngle file — audio, images, wasm, etc., included.
 */

// Pull in the two things we need from the glue.
import init, { poeInitImage, poeInitAudio, Poe } from './generated/glue.mjs';

// Pull in the wasm payload.
import { wasmBase64 } from './generated/wasm_base64.mjs';

// Our decoding helper function.
import { base64toUint8 } from './base64_to_uint8.mjs';

// Let's party like it's 1996!
init(base64toUint8(wasmBase64).buffer).then((w) => {
	// Initialize media.
	poeInitImage(w);
	poeInitAudio(w);

	// Make the Poe instance public.
	window.Poe = Poe;

	// Disable audio?
	if (currentScript.hasAttribute('data-no-audio')) { Poe.audio = false; }

	// Autostart?
	if (! currentScript.hasAttribute('data-no-start')) { Poe.active = true; }
});
