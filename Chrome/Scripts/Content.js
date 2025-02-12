/**
 * @author Vera Konigin vera@groundedwren.com
 */
 
window.GW = window.GW || {};
(function USS(ns) {
	chrome.runtime.onMessage.addListener((message) => {
		switch(message.Type) {
			case "ShowDialog":
				showDialog();
			break;
		}
	});

	function showDialog() {
		if(ns.Dialog) {
			doShow();
			shadowRoot.querySelector(`input`).focus();
			return;
		}

		ns.Dialog = document.createElement("dialog");
		ns.Dialog.style = `padding: 0; border: none; width: 1100px;`;
		ns.Dialog.appendChild(document.createElement("article"));
		const shadowRoot = ns.Dialog.firstChild.attachShadow({ mode: "open" });
		shadowRoot.innerHTML = `
			<style class="reset">${ns.CssReset}</style>
			<style class="form">
				form {
					display: flex;
					flex-direction: column;
					gap: 5px;
					background-color: var(--background-color-2);
					padding-block-end: 4px;
					font-size: initial;

					h1 {
						background-color: var(--accent-color);
						text-align: center;
					}

					label {
						margin-inline: 5px;
						gw-dynamic-textarea {
							width: 100%;
							height: 100%;
						}
						textarea {
							width: 100%;
							height: 150px;
							padding-inline: 4px;
							resize: vertical;
						}
					}

					> aside {
						display: contents;
					}					

					footer {
						border: none;
						margin-inline: 5px;

						display: grid;
						grid-auto-flow: column;
						gap: 5px;
					}

					[id^="gw-uss-msg"] {
						background-color: var(--accent-color);
						text-align: center;
					}
				}
			</style>
			<form aria-labelledby="hAdd">
				<h1 id="hAdd">Add Content for ${window.location.hostname}</h1>
				<label class="input-vertical" data-template="tmplGwUssDynTxa">
					Script (js)
					<gw-dynamic-textarea><textarea
						name="script"
						autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"
					></textarea></gw-dynamic-textarea>
				</label>
				<label class="input-vertical" data-template="tmplGwUssDynTxa">
					Style (css)
					<gw-dynamic-textarea><textarea
						name="style"
						autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"
					></textarea></gw-dynamic-textarea>
				</label>
				<footer>
					<button type="submit" title="Alt+S"><u>S</u>ave</button>
					<button type="button" name="apply" title="Alt+U">A<u>p</u>ply</button>
					<button type="button" name="hide" title="Alt+H"><u>H</u>ide</button>
				</footer>
				<aside aria-live="polite"></aside>
			</form>
		`;

		//Rudimentary polyfill
		if(ns.IsCustomElementsPolyfilled) {
			for (const [name, elemObj] of Object.entries(window.customElements.Elements)) {
				shadowRoot.querySelectorAll(name).forEach(elem => {
					Object.setPrototypeOf(elem, elemObj.Class.prototype);
					elemObj.Initializer.apply(elem);
					elem.connectedCallback();
				});
			}
		}

		ns.Form = shadowRoot.querySelector(`form`);
		ns.Form.addEventListener("submit", onFormSubmit);
		ns.Form.addEventListener("keydown", onFormKeydown);
		shadowRoot.querySelector(`[name="apply"]`).addEventListener("click", doApply);
		shadowRoot.querySelector(`[name="hide"]`).addEventListener("click", doHide);
		shadowRoot.querySelector(`[name="script"]`).value = localStorage.getItem("gw-uss-script") || "";
		shadowRoot.querySelector(`[name="style"]`).value = localStorage.getItem("gw-uss-style") || "";
		ns.AsiPolite = shadowRoot.querySelector(`form > aside`);

		document.body.appendChild(ns.Dialog);

		ns.BtnShow = document.createElement("button");
		ns.BtnShow.innerText = "Show USS Dialog";
		ns.BtnShow.addEventListener("click", doShow);
		document.body.appendChild(ns.BtnShow);

		doShow();
		shadowRoot.querySelector(`input`).focus();
	}

	ns.MessageIdx = 0;
	onFormKeydown = (event) => {
		if(!event.altKey) {
			event.stopPropagation();
			return;
		}

		switch(event.key) {
			case "s":
				event.preventDefault();
				updateContent();

				ns.Dialog.close();
				break;
			case "p":
				event.preventDefault();
				doApply(event)
				break;
			case "h":
				event.preventDefault();
				doHide(event)
				break;
		}

		event.stopPropagation();
	}
	doApply = (_event) => {
		const data = new FormData(ns.Form);
		loadContent(null, data.get("style"));
		ns.AsiPolite.insertAdjacentHTML(
			"afterbegin",
			`<article id="gw-uss-msg-${++ns.MessageIdx}">
				Content applied!
			</article>`
		);
		setTimeout(hideMsg, 3000, ns.MessageIdx);
	};
	function hideMsg(id) {
		ns.AsiPolite.querySelector(`#gw-uss-msg-${id}`).remove();
	}

	doHide = () => {
		ns.Dialog.close();
		ns.BtnShow.style = `position: fixed; bottom: 0; right: 0; background-color: white !important; color: black !important;`;
		ns.BtnShow.focus();
	};
	doShow = () => {
		ns.BtnShow.style = `display: none;`
		ns.Dialog.showModal();
		ns.Form.querySelector(`[name="hide"]`).focus();
	};

	onFormSubmit = (event) => {
		event.preventDefault();

		updateContent();

		ns.Dialog.close();
	};

	updateContent = function updateContent() {
		const data = new FormData(ns.Form);

		localStorage.setItem("gw-uss-script", data.get("script"));
		localStorage.setItem("gw-uss-style", data.get("style"));

		loadContent(localStorage.getItem("gw-uss-script"), localStorage.getItem("gw-uss-style"));
	}

	window.addEventListener("DOMContentLoaded", () => {
		loadContent(localStorage.getItem("gw-uss-script"), localStorage.getItem("gw-uss-style"));
	});
	function loadContent(script, style) {
		Array.from(document.querySelectorAll(`.gw-uss`)).forEach(element => element.remove());
		if(script !== null) {
			const scriptObj = {
				id: window.location.hostname,
				matches: [window.location.href.replace(window.location.pathname, "/*")],
				js: [{code: script}]
			};
			chrome.runtime.sendMessage({Type: "Script-Update", Object: scriptObj});
		}
		if(style !== null) {
			document.head.insertAdjacentHTML("beforeend", `<style class="gw-uss">${style}</style>`);
		}
	}
}) (window.GW.USS = window.GW.USS || {});