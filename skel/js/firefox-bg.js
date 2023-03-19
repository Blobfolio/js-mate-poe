browser.action.onClicked.addListener((tab) => {
	// Tell the foreground script we want to toggle Poe on/off.
	browser.tabs.sendMessage(tab.id, {"message": "clickedPoe"}).then((r) => {
		// The response is the current status (after toggling). Let's update
		// the icon image/title accordingly.
		browser.action.setIcon({
			path: r.response ? 'image/sit.svg' : 'image/sleep.svg',
			tabId: tab.id,
		});
		browser.action.setTitle({
			title: r.response ? 'Disable JS Mate Poe' : 'Enable JS Mate Poe',
			tabId: tab.id,
		});
	});
});
