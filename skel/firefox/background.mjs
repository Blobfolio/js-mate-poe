/**
 * Show Poe?
 *
 * This is a bitflag indicating whether or not the user wants Poe running on
 * their pages.
 *
 * It's the only bitflag right now, but we may have more settings some day…
 *
 * @type {number}
 */
const poeFlagActive =  0b0001;

const poeFlagMask =    poeFlagActive; // Mask of possible settings.
const poeFlagDefault = 0b0000;        // Default value.

/**
 * Get Settings.
 *
 * Return the current extension settings as a single bitflag.
 *
 * @return {number} Extension settings.
 */
const readSettings = async function() {
	return browser.storage.local.get(null).then(
		function(settings) {
			if (('object' === typeof settings) && 'number' === typeof settings.flags) {
				return settings.flags & poeFlagMask;
			}
			else { return poeFlagDefault; }
		},
		function() { return poeFlagDefault; },
	);
};

/**
 * Save Settings.
 *
 * Save the extension settings, again, as a single bitflag.
 *
 * @param {number} Value.
 * @return {void} Nothing.
 */
const writeSettings = async function(val) {
	val = (Number(val) || 0) & poeFlagMask;
	browser.storage.local.set({ flags: val });
};

/**
 * Is Poe Active?
 *
 * Returns `true` if the user wants Poe to be running on every page.
 *
 * @return {boolean} True/false.
 */
const isActive = async function() {
	let flags = await readSettings();
	return Promise.resolve(poeFlagActive === flags & poeFlagActive);
};

/**
 * Toggle Active Setting.
 *
 * Reverse and save the current setting, returning the new value. (If active,
 * it will become inactive, or vice versa.)
 *
 * @return {boolean} True/false.
 */
const toggleSettingActive = async function() {
	let flags = await readSettings();
	flags ^= poeFlagActive;
	await writeSettings(flags);
	return Promise.resolve(poeFlagActive === flags & poeFlagActive);
};

/**
 * Toggle Activeness of a Tab.
 *
 * Turn Poe on or off for the given tab.
 *
 * @param {number|Object} tab Tab.
 * @param {boolean} active On/Off?
 * @return {void} Nothing.
 */
const toggleTab = async function(tab, active) {
	// The tab formatting is extremely inconsistent across the various APIs…
	if ('object' === typeof tab) {
		if ('id' in tab) { tab = Number(tab.id) || 0; }
		else if ('tabId' in tab) { tab = Number(tab.tabId) || 0; }
		else { return; }
	}
	else if ('number' !== typeof tab) { return; }

	// Which action are we triggering?
	let action = active ? 'startPoe' : 'stopPoe';

	// Try to update the state, but don't worry too much if it fails.
	browser.tabs.sendMessage(tab, {"message": action}).catch((e) => {});

	// Try to update the icon/title, independently of the state because some
	// pages don't support extensions, but may still show the icon.
	try {
		browser.pageAction.setIcon({
			path: active ? 'image/sit.svg' : 'image/sleep.svg',
			tabId: tab,
		});
		browser.pageAction.setTitle({
			title: active ? 'Disable JS Mate Poe' : 'Enable JS Mate Poe',
			tabId: tab,
		});
	} catch (e) {}
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
	let active = await isActive();
	toggleTab(tab, active);
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
	let active = await toggleSettingActive();
	browser.tabs.query({}).then((tabs) => {
		for (tab of tabs) { toggleTab(tab, active); }
	});
});
