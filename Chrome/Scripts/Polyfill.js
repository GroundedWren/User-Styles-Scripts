window.GW = window.GW || {};
(function USS(ns) {
	ns.IsCustomElementsPolyfilled = false;
	if(!window.customElements) {
		Object.defineProperty(window, "customElements", {value: {}, writable: true});
		window.customElements = {
			Elements: {},
			get: function(name) { return window.customElements.Elements[name] },
			define: function(name, elemClass) {
				window.customElements.Elements[name] = {
					Class: elemClass,
					Initializer: getInitilaizer(elemClass)
				};
			}
		};
		ns.IsCustomElementsPolyfilled = true;
	}

	function getInitilaizer(elemClass) {
		switch(elemClass.Name) {
			case "gw-dynamic-textarea-uss":
				return function initialize() {
					DynamicTextareaElUSS = GW.Controls.DynamicTextareaElUSS;

					this.TabBuffer = [];
					this.MessageIdx = 0;
					this.AsiPolite = null;

					this.InstanceId = DynamicTextareaElUSS.InstanceCount++;
					if(this.InstanceId === 0) {
						DynamicTextareaElUSS.EditorMode = localStorage.getItem(`${DynamicTextareaElUSS.Name}-editor-mode`) === "on";
					}

					this.AsiPolite = document.createElement("aside");
					this.AsiPolite.setAttribute("aria-live", "polite");
					this.AsiPolite.setAttribute(
						"style",
						"position: absolute; left: -99999999px; top: 0px;"
					);
				}
			default:
				return function emptyInitialize() {};
		}
	}
}) (window.GW.USS = window.GW.USS || {});