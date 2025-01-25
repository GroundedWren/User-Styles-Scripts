/**
 * @author Vera Konigin vera@groundedwren.com
 */
 
(function GW() {
	browser.action.onClicked.addListener(async () => {
		let queryOptions = { active: true, currentWindow: true };
		let tabs = await browser.tabs.query(queryOptions);
		browser.tabs.sendMessage(tabs[0].id, { Type: "ShowDialog" });
	});
}) ();