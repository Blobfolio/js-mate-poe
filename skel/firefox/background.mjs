/**
 * @file Firefox Extension: Background Script.
 *
 * This is the entry point for the extension's "background script". It handles
 * the "page_action" — a simple on/off toggle for the "active" settings — and
 * synchronizes state changes with all the tabs.
 */

import { getSettings, sanitizeSettings, saveSettings } from './settings.mjs';

/**
 * Sync One Tab.
 *
 * This sends the current audio/active settings to the given tab so its content
 * script can synchronize its state accordingly, and afterwards, makes sure the
 * tab's pageIcon has the appropriate visibility, icon, and title.
 *
 * @param {number} tab Tab ID.
 * @param {?Object} settings Settings.
 * @return {Promise} Resolutions or false.
 */
const syncOne = async function(tab, settings) {
	// Handle settings.
	if ((null === settings) || ('object' !== typeof settings)) {
		settings = await getSettings();
	}
	else { settings = sanitizeSettings(settings); }
	settings.action = 'poeFgSync';

	try {
		// Send a synchronization request to the tab.
		let r = await browser.tabs.sendMessage(tab, settings).catch((e) => {});

		// A Promise-false response means we should "disable" the extension for
		// this tab. Insofar as the background script is concerned, that just
		// means hiding its pageIcon.
		if (false === r) {
			if (await browser.pageAction.isShown({ tabId: tab })) {
				return browser.pageAction.hide(tab);
			}
			return Promise.resolve(false);
		}
		// A Promise-true is the normal response; here we just need to make
		// sure its pageIcon is visible.
		else if (true === r) {
			if (! await browser.pageAction.isShown({ tabId: tab })) {
				await browser.pageAction.show(tab);
			}
		}
		// We can ignore all other responses.
		else { return Promise.resolve(false); }
	}
	catch (e) {}

	// If we're here, the pageIcon should be visible, so we should make sure
	// its icon and title reflect the current state.
	return Promise.all([
		browser.pageAction.setIcon({
			path: settings.active ? 'image/sit.svg' : 'image/sleep.svg',
			tabId: tab,
		}),
		browser.pageAction.setTitle({
			title: settings.active ? 'JS Mate Poe: Enabled' : 'JS Mate Poe: Disabled',
			tabId: tab,
		}),
	]);
};

/**
 * Sync All Tabs.
 *
 * This calls `syncOne` for every open http/s tab. It's a bit much, but is only
 * triggered when the global settings change, which shouldn't be very often.
 *
 * @param {?Object} settings Settings.
 * @return {Promise} Resolutions.
 */
const syncAll = async function(settings) {
	// Handle settings.
	if ((null === settings) || ('object' !== typeof settings)) {
		settings = await getSettings();
	}
	else { settings = sanitizeSettings(settings); }

	// Call all tabs.
	const tabs = await browser.tabs.query({url: ['http://*/*', 'https://*/*']});
	const waiting = [];
	for (const tab of tabs) {
		if ('number' === typeof tab.id) { waiting.push(syncOne(tab.id, settings)); }
	}
	return Promise.allSettled(waiting);
};

/**
 * Toggle Activeness on Icon Click.
 *
 * Turn Poe on/off for all tabs whenever a pageIcon is clicked.
 *
 * @param {number|Object} tab Tab.
 * @return {void} Nothing.
 */
browser.pageAction.onClicked.addListener(function() {
	// Get the original settings.
	getSettings()
		// Invert, save, and send.
		.then(async (settings) => {
			settings.active = ! settings.active;
			await saveSettings(settings);
			return syncAll(settings);
		})
		.catch((e) => {});
});

/**
 * Message Listener.
 *
 * This listens for broadcasts from newly-initialized content scripts, and
 * sync-all requests from the options handler. In either case, it will
 * coordinate a (re)synchronization for the relevant tab(s).
 *
 * @param {!Object} m Message.
 * @param {!Object} sender Sender.
 * @return {boolean} False.
 */
browser.runtime.onMessage.addListener(function(m, sender) {
	if ((null !== m) && ('object' === typeof m)) {
		if ('poeBgNewConnection' === m.action) {
			syncOne(sender.tab.id).catch((e) => {});
		}
		else if ('poeBgSyncAll' === m.action) {
			syncAll().catch((e) => {});
		}
	}

	// We don't need to wait for a response.
	return false;
});

/**
 * Pre-Update Cleanup.
 *
 * This attempts to stop any running instances of Poe so that their elements
 * can be cleaned up before Firefox nukes their content scripts.
 *
 * @return {void} Nothing.
 */
browser.runtime.onUpdateAvailable.addListener(function() {
	syncAll({ active: false }).then(() => {
		browser.runtime.reload();
	});
});

/**
 * Active Tab Sync.
 *
 * The message handlers can occasionally miss a target, so this redundantly
 * calls the active tab to make sure it is reflecting the correct state.
 *
 * @param {Object} info Info.
 * @return {void} Nothing.
 */
browser.tabs.onActivated.addListener(function(info) {
	if ('number' === typeof info.tabId) { syncOne(info.tabId); }
});
