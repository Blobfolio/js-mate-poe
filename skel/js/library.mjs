/**
 * @file Library Entry Point.
 *
 * This is the entry point for the library version of JS Mate Poe. It compiles
 * to a sngle file — audio, images, wasm, etc., included.
 */

// Pull in the two things we need from the glue.
import init, { Poe } from './generated/glue.mjs';

// Pull in the wasm payload.
import { wasmArray } from './generated/wasm.mjs';

// Let's party like it's 1996!
const currentScript = document.currentScript;
init(wasmArray.buffer).then(() => {
	// Make the Poe instance public.
	window.Poe = Poe;

	// Disable focus?
	if (currentScript.hasAttribute('data-no-focus')) { Poe.focus = false; }

	// Disable audio?
	if (currentScript.hasAttribute('data-no-audio')) { Poe.audio = false; }

	// Autostart?
	if (! currentScript.hasAttribute('data-no-start')) { Poe.active = true; }
});
