/**
 * @file Firefox Extension: Background Script.
 */

// Watch for clicks to the icon, and let the foreground script know about it.
browser.action.onClicked.addListener((tab)=>{
	browser.tabs.sendMessage(tab.id, {"message": "clickedPoe"}).then((r) => {
		let icon = r.response ? 'image/sit.svg' : 'image/sleep.svg';
		let title = r.response ? 'Disable JS Mate Poe' : 'Enable JS Mate Poe';
		browser.action.setIcon({
			path: icon,
			tabId: tab.id,
		});
		browser.action.setTitle({
			title: title,
			tabId: tab.id,
		});
	})
});
