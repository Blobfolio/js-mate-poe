/**
 * @file Firefox Extension: Background Script.
 *
 * This is the entry point for the extension's "background script". It handles
 * the "page_action" — a simple on/off toggle for the "active" settings — and
 * synchronizes state changes with all the tabs.
 */

import { getSettings, saveSettings } from './settings.mjs';

/**
 * Update Tab State.
 *
 * This sends the current audio/active properties to a given tab so its content
 * script can synchronize its state accordingly.
 *
 * It also toggles the pageIcon visibility, title, and icon for the tab, since
 * content scripts can't handle this themselves.
 *
 * @param {number} tab Tab ID.
 * @return {Promise} Resolutions.
 */
const updateTab = async function(tab) {
	// Pull the current settings, and add an "action" to it.
	let settings = await getSettings();
	settings.action = 'poeUpdate';

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
	return Promise.allSettled([
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
 * Update All Tabs.
 *
 * This sends an updateTab request for every open tab anytime the global
 * settings are changed (including a pageIcon click, which toggles activeness).
 *
 * @return {Promise} Resolutions.
 */
const updateTabs = async function() {
	const tabs = await browser.tabs.query({});
	const waiting = [];
	for (const tab of tabs) {
		if ('number' === typeof tab.id) { waiting.push(updateTab(tab.id)); }
	}
	return Promise.allSettled(waiting);
};

/**
 * Toggle Activeness on Icon Click.
 *
 * Turn Poe on/off for all tabs whenever the extension icon is clicked, and
 * save the setting for next time.
 *
 * @param {number|Object} tab Tab.
 * @return {void} Nothing.
 */
browser.pageAction.onClicked.addListener(function() {
	getSettings()
		.then((settings) => {
			// Invert the active property and save the changes.
			settings.active = ! settings.active;
			return saveSettings(settings);
		})
		.then(() => { return updateTabs(); })
		.catch((e) => {});
});

/**
 * Synchronize Tab State on Self-Reported Initialization
 *
 * This sends the current settings to a newly-initialized tab so it can
 * synchronize its state.
 *
 * @param {!Object} m Message.
 * @param {!Object} sender Sender.
 * @return {boolean} False.
 */
browser.runtime.onMessage.addListener(function(m, sender) {
	if (
		(null !== m) &&
		('object' === typeof m) &&
		('poeTabInit' === m.action)
	) {
		updateTab(sender.tab.id).catch((e) => {});
	}

	// We don't need to wait for a response.
	return false;
});
