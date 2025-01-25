/**
 * @author Vera Konigin vera@groundedwren.com
 */
 
(function GW() {
	chrome.action.onClicked.addListener(async () => {
		let queryOptions = { active: true, currentWindow: true };
		let tabs = await chrome.tabs.query(queryOptions);
		chrome.tabs.sendMessage(tabs[0].id, { Type: "ShowDialog" });
	});

	chrome.runtime.onMessage.addListener((message) => {
		switch(message.Type) {
			case "Script-Update":
				updateScript(message.Object);
				break;
		}
	});

	async function updateScript(scriptObj) {
		const existingScripts = await chrome.userScripts.getScripts({
			ids: [scriptObj.id]
		});
		const method = existingScripts.length ? chrome.userScripts.update : chrome.userScripts.register;
		method([scriptObj]);
	}
}) ();