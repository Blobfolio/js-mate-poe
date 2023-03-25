/**
 * @file Firefox Extension: Background Script.
 *
 * This is the entry point for the extension's "background script". It handles
 * the "page_action" — a simple on/off toggle for the "active" settings — and
 * synchronizes state changes with all the tabs.
 */

import { getSettings, saveSettings } from './settings.mjs';

// This is used to keep track of all of the connected content scripts.
const ports = new Map();

/**
 * New Connection (with Foreground).
 *
 * The content scripts will reach out to form a connection as soon as they have
 * initialized the wasm. The background, in turn, uses those connections to
 * synchronize the states.
 *
 * @param {Object} port Port.
 * @return {void} Nothing.
 */
browser.runtime.onConnect.addListener(async function(port) {
	// Store the new port, using its random name as the identifier.
	ports.set(port.name, port);

	/**
	 * Handle Disconnection.
	 *
	 * This removes the port from the list on disconnection so we don't keep
	 * sending messages to it.
	 *
	 * @param {Object} port Port.
	 * @return {void} Nothing.
	 */
	port.onDisconnect.addListener((port) => { ports.delete(port.name); });

	// Enable the pageAction icon.
	await browser.pageAction.show(port.sender.tab.id).catch((e) => {});

	// Synchronize the state.
	await updateTab(port);
});

/**
 * Update Tab State.
 *
 * This synchronizes the audio/active properties of a single tab with the
 * current settings, and also adjusts its pageAction icon to match.
 *
 * @param {Object} port Port.
 * @return {Promise} Resolutions.
 */
const updateTab = async function(port) {
	// Pull the current settings, and add an "action" to it.
	let settings = await getSettings();
	settings.action = 'poeUpdate';

	// Send the settings to the content script.
	try { port.postMessage(settings); }
	catch (e) {}

	// Synchronize the pageAction icon properties, regardless of whether or not
	// the settings worked.
	return Promise.allSettled([
		browser.pageAction.setIcon({
			path: settings.active ? 'image/sit.svg' : 'image/sleep.svg',
			tabId: port.sender.tab.id,
		}),
		browser.pageAction.setTitle({
			title: settings.active ? 'JS Mate Poe: Enabled' : 'JS Mate Poe: Disabled',
			tabId: port.sender.tab.id,
		})
	]);
};

/**
 * Update All (Connected) Tabs.
 *
 * Make sure every connected tab is honoring the current settings, and has an
 * appropriate pageAction icon.
 *
 * This is triggered any time a pageAction icon is clicked or the settings are
 * updated. (Otherwise we only communicate with individual tabs as-needed.)
 *
 * @return {Promise} Resolutions.
 */
const updateTabs = async function() {
	let waiting = [];
	for (const port of ports.values()) {
		waiting.push(updateTab(port));
	}
	return Promise.allSettled(waiting);
};

/**
 * Toggle State on Icon Click
 *
 * Turn Poe on/off for all tabs whenever the extension icon is clicked, and
 * save the setting for next time.
 *
 * @param {number|Object} tab Tab.
 * @return {void} Nothing.
 */
browser.pageAction.onClicked.addListener(async function() {
	// Pull the current settings and invert the "active" property.
	let settings = await getSettings();
	settings.active = ! settings.active;

	// Save the settings.
	await saveSettings(settings);

	// Let the tabs know what changed!
	await updateTabs();
});
