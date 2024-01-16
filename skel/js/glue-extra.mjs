/**
 * @file Wasm Imports & Glue
 */

/**
 * Import: Get URL (Firefox).
 *
 * The audio assets — but _not_ the image for whatever reason — have to be
 * bundled with the extension rather than the wasm to exempt them from per-site
 * CSP restrictions.
 *
 * This wrapper gives the wasm a way to generate URLs for them so it can do
 * what it needs to do.
 *
 * @param {string} path Relative Path.
 * @return {string} URL.
 */
const poeGetUrl = function(path) { return browser.runtime.getURL(path); };
