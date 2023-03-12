/**
 * @file Entry Point.
 */

// Take the two things we need from the gratuitous wasm bootstrap.
import init, { Poe } from './wasm/rs_mate_poe.js';

// Derive the wasm URL from this script's URL (i.e. replace "min.js" with
// "wasm").
const script_src = new URL(document.currentScript.src, location.href)
	.toString()
	.slice(0, -6) + 'wasm';

// Intialize it and copy Poe into the global scope!
init(script_src).then(() => { window.Poe = Poe; });
