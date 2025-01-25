/**
 * @author Vera Konigin vera@groundedwren.com
 */
 
(function GW(ns) {
	browser.runtime.onMessage.addListener((message) => {
		switch(message.Type) {
			case "ShowDialog":
				showDialog();
			break;
		}
	});

	function showDialog() {
		ns.Dialog = document.createElement("dialog");
		ns.Dialog.style = `padding: 0; border: none; width: 1100px;`;
		ns.Dialog.appendChild(document.createElement("article"));
		const shadowRoot = ns.Dialog.firstChild.attachShadow({ mode: "closed" });
		shadowRoot.innerHTML = `
			<style>${ns.CssReset}</style>
			<style>
				form {
					display: flex;
					flex-direction: column;
					gap: 5px;
					background-color: var(--background-color-2);
					padding-block-end: 4px;

					h1 {
						background-color: var(--accent-color);
						text-align: center;
					}

					label {
						margin-inline: 5px;
						&:has(input[type="checkbox"]) {
							align-self: end;
						}
						kbd {
							background-color: var(--background-color);
							padding: 2px;
						}
						
						textarea {
							width: 100%;
							height: 150px;
							padding-inline: 4px;
							resize: vertical;
						}
					}

					aside {
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
				<label>
					<kbd>tab</kbd>&nbsp;to&nbsp;<u>a</u>djust indentation
					<input type="checkbox" name="alt" title="Alt+A">
				</label>
				<label class="input-vertical">
					Script (js)
					<textarea
						name="script"
						autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"
					></textarea>
				</label>
				<label class="input-vertical">
					Style (css)
					<textarea
						name="style"
						autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"
					></textarea>
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
		Array.from(shadowRoot.querySelectorAll(`textarea`)).forEach(txa => txa.addEventListener("keydown", onTxaKeydown));
		ns.TxaAltCbx = shadowRoot.querySelector(`[name="alt"]`);
		ns.AsiPolite = shadowRoot.querySelector(`aside`);

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
			case "a":
				ns.TxaAltCbx.click();
				ns.AsiPolite.insertAdjacentHTML(
					"afterbegin",
					`<article id="gw-uss-msg-${++ns.MessageIdx}" class="sr-only">
						Tab now ${ns.TxaAltCbx.checked ? "adjusts indentation" : "moves focus"}
					</article>`
				);
				setTimeout(hideMsg, 100, ns.MessageIdx);
				break;
			case "s":
				event.preventDefault();
				updateContent();

				ns.Dialog.close();
				ns.Dialog.remove();
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

	ns.TxaTabBuffer = {
		"script": null,
		"style": null,
	};
	onTxaKeydown = (event) => {
		const txa = event.target;

		const tabBuffer = ns.TxaTabBuffer[txa.name];
		if(event.key === "z" && event.ctrlKey && tabBuffer !== null) {
			event.preventDefault();
			txa.value = tabBuffer.Value;
			txa.selectionStart = tabBuffer.SelStart;
			txa.selectionEnd = tabBuffer.SelEnd;
			ns.TxaTabBuffer[txa.name] = null;
		}

		if(ns.TxaAltCbx.checked) {
			if(event.key === "Tab") {
				onTxaTab(event);
				return;
			}
			if(event.key === "Enter") {
				onTxaEnter(event);
				return;
			}
		}

		if(event.key !== "Tab" && event.key.length === 1) {
			ns.TxaTabBuffer[txa.name] = null;
		}
	}

	onTxaTab = (event) => {
		const txa = event.target;
		const origValue = txa.value;
		const origStart = txa.selectionStart;
		const origEnd = txa.selectionEnd;
		const lineStart = origValue.lastIndexOf("\n", origStart - 1) + 1;

		if(origStart !== origEnd) {
			event.preventDefault();

			let containedStr = origValue.substring(lineStart, origEnd);
			let lines = containedStr.split("\n");
			const origLineZeroLen = lines[0].length;
			lines = lines.map(line => {
				if(event.shiftKey) {
					return (line[0] === "\t") ? line.substring(1) : line;
				}
				else {
					return "\t" + line;
				}
			});
			const shouldAdjustLineZero = lines[0].length !== origLineZeroLen && lines[0].length;

			containedStr = lines.join("\n");
			txa.value = origValue.substring(0, lineStart) + containedStr + origValue.substring(origEnd);
			txa.selectionStart = origStart;
			if(shouldAdjustLineZero) {
				txa.selectionStart += event.shiftKey ? -1 : 1;
			}
			txa.selectionEnd = origStart + containedStr.length - (origStart - lineStart);
		}
		else {
			if(event.shiftKey) {
				if(origValue.charAt(lineStart) === "\t") {
					event.preventDefault();
					txa.value = origValue.substring(0, lineStart) + origValue.substring(lineStart + 1);
					txa.selectionStart = origStart - 1;
					txa.selectionEnd = origEnd - 1;
				}
				else {
					return;
				}
			}
			else {
				event.preventDefault();
	
				txa.value = origValue.substring(0, origStart) + '\t' + origValue.substring(origEnd);
				txa.selectionStart = txa.selectionEnd = (origStart + 1);
			}
		}
		ns.TxaTabBuffer[txa.name] = {Value: origValue, SelStart: origStart, SelEnd: origEnd};
	};

	onTxaEnter = (event) => {
		const txa = event.target;
		const origValue = txa.value;
		const origStart = txa.selectionStart;
		const origEnd = txa.selectionEnd;
		const lineStart = origValue.lastIndexOf("\n", origStart - 1) + 1;

		let charIdx = lineStart;
		while(origValue[charIdx] === "\t") {
			charIdx++;
		}

		let insertStr = "\n" + "\t".repeat(charIdx - lineStart);
		txa.value = origValue.substring(0, origStart) + insertStr + origValue.substring(origEnd);
		txa.selectionStart = txa.selectionEnd = (origStart + insertStr.length);

		event.preventDefault();
	};

	onFormSubmit = (event) => {
		event.preventDefault();

		updateContent();

		ns.Dialog.close();
		ns.Dialog.remove();
	};

	updateContent = function updateContent() {
		const data = new FormData(ns.Form);

		localStorage.setItem("gw-uss-script", data.get("script"));
		localStorage.setItem("gw-uss-style", data.get("style"));

		loadContent(localStorage.getItem("gw-uss-script"), localStorage.getItem("gw-uss-style"));
	}

	window.addEventListener("load", () => {
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
}) (window.GW = window.GW || {});