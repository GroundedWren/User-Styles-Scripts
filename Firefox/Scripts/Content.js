/**
 * @author Vera Konigin vera@groundedwren.com
 */
 
window.GW = window.GW || {};
(function USS(ns) {
	browser.runtime.onMessage.addListener((message) => {
		switch(message.Type) {
			case "ShowDialog":
				showDialog();
			break;
		}
	});

	function showDialog() {
		if(ns.Dialog) {
			doShow();
			ns.Dialog.querySelector(`textarea`).focus();
			return;
		}

		ns.Dialog = document.createElement("dialog");
		ns.Dialog.style = `padding: 0; border: none; width: 1100px;`;
		ns.Dialog.appendChild(document.createElement("article"));
		const shadowRoot = ns.Dialog.firstChild.attachShadow({ mode: "open" });
		shadowRoot.Prism = Prism;
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
							resize: vertical;
						}
						textarea, code {
							padding-inline: 4px;
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
					Script
					<gw-dynamic-textarea data-language="js"><textarea
						name="script"
						autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"
					></textarea></gw-dynamic-textarea>
				</label>
				<label class="input-vertical" data-template="tmplGwUssDynTxa">
					Style
					<gw-dynamic-textarea data-language="css"><textarea
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
		shadowRoot.querySelector(`textarea`).focus();
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
		loadContent(data.get("script"), data.get("style"));
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
			const scriptEl = document.createElement("script");
			scriptEl.type = "text/javascript";
			scriptEl.classList = "gw-uss";
			scriptEl.innerText = script;
			document.head.insertAdjacentElement("beforeend", scriptEl);
		}
		if(style !== null) {
			document.head.insertAdjacentHTML("beforeend", `<style class="gw-uss">${style}</style>`);
		}
	}
}) (window.GW.USS = window.GW.USS || {});