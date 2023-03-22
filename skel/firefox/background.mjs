import { getSettings, saveSettings } from './settings.mjs';

/**
 * Update (One) Foreground Tab.
 *
 * Turn Poe on or off, and/or audio on or off, for the given tab.
 *
 * @param {number|Object} tab Tab.
 * @param {Object} settings Settings.
 * @return {void} Nothing.
 */
const updateTab = async function(tab, settings) {
	// Normalize the "tab" value. (We want a numeric ID.)
	if ((null !== tab) && ('object' === typeof tab)) {
		if ('number' === typeof tab.id) { tab = tab.id; }
		else if ('number' === typeof tab.tabId) { tab = tab.tabId; }
		else { return; }
	}
	else if ('number' !== typeof tab) { return; }

	settings.message = 'updateFg';

	// Try to update the state, but don't worry too much if it fails.
	browser.tabs.sendMessage(tab, {'message': settings}).catch((e) => {});

	// Try to update the icon/title, independently of the state because some
	// pages don't support extensions, but may still show the icon.
	try {
		browser.pageAction.setIcon({
			path: settings.active ? 'image/sit.svg' : 'image/sleep.svg',
			tabId: tab,
		});
		browser.pageAction.setTitle({
			title: settings.active ? 'Disable JS Mate Poe' : 'Enable JS Mate Poe',
			tabId: tab,
		});
	} catch (e) {}
};

/**
 * Update (All) Foreground Tabs.
 *
 * Turn Poe on or off, and/or audio on or off, for every applicable tab.
 *
 * @param {Object} settings Settings.
 * @return {void} Nothing.
 */
const updateTabs = async function(settings) {
	let tabs = await browser.tabs.query({});
	for (tab of tabs) { updateTab(tab, settings); }
};

/**
 * New/Changed Page Handler.
 *
 * Make sure Poe is synced with the desired state when a new tab is opened or
 * a new page is loaded.
 *
 * @param {number|Object} tab Tab.
 * @return {void} Nothing.
 */
const newPage = async function(tab) {
	let settings = await getSettings();
	updateTab(tab, settings);
};

browser.tabs.onActivated.addListener(newPage);
browser.tabs.onUpdated.addListener(newPage);

/**
 * Toggle State on Icon Click
 *
 * Turn Poe on/off for all tabs whenever the extension icon is clicked, and
 * save the setting for next time.
 *
 * @param {number|Object} tab Tab.
 * @return {void} Nothing.
 */
browser.pageAction.onClicked.addListener(async function(tab) {
	let settings = await getSettings();
	settings.active = ! settings.active;
	await saveSettings(settings);
	updateTabs(settings);
});
