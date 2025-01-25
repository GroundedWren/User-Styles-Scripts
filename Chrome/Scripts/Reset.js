/**
 * @author Vera Konigin vera@groundedwren.com
 */
 
(function GW(ns) {
	ns.CssReset = `
	* {
		--background-color: #FFFFFF;
		--background-color-2: #E3E3E3;
		--text-color: #000000;
		--border-color: #000000;
		--selected-color: #90CBDB;
		--button-face-color: #C8C8C8;
		--button-text-color: #000000;
		--input-text-color: #000000;
		--input-background-color: #FFFFFF;
		--link-color: #0000EE;
		--link-background-color: #BDE0F2;
		--focus-color: #FF0701;
		--icon-color: #000000;
		--banner-color: #B3B3B3;
		--mark-color: #D2FCC5;
		--accent-color: #D5B3D9;
		--invalid-color: #5C01D8;
		
		input {
			color-scheme: light;
		}
	}

	@media(prefers-color-scheme: dark) {
		* {
			--background-color: #000000;
			--background-color-2: #242424;
			--text-color: #FFFFFF;
			--border-color: #FFFFFF;
			--selected-color: #223891;
			--button-face-color: #474747;
			--button-text-color: #FFFFFF;
			--input-text-color: #FFFFFF;
			--input-background-color: #000000;
			--link-color: #74D7EE;
			--link-background-color: #3C5054;
			--focus-color: #FF0701;
			--icon-color: #FFFFFF;
			--banner-color: #404040;
			--mark-color: #005C08;
			--accent-color: #8D4A95;
			--invalid-color: #A35FFE;
			
			input {
				color-scheme: dark;
			}
		}
	}

	*, *::before, *::after {
		box-sizing: border-box;
	}

	form {
		background-color: var(--background-color);
		color: var(--text-color);
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
		word-break: break-word;
		font-size: 1rem;
		line-height: initial;
	}

	h1, h2, h3, h4, h5, h6 {
		margin: 0px;
	}

	a {
		color: var(--link-color);
		
		&.full {
			padding: 4px;
			border-radius: 20px;
			background-color: var(--link-background-color);
		}
	}

	.sr-only {
		position: absolute !important;
		left: -99999999px;
		top: 0px;
	}

	.hide-until-focus {
		position: absolute;
		left: -99999999px;
		top: 0px;
		
		&:focus-within {
			position: revert;
			left: revert;
			top: revert;
		}
	}

	.hidden {
		display: none !important;
	}

	label:has(> :focus-visible), *:not(label) > :focus-visible, *[tabindex="-1"]:focus {
		outline-width: 4px !important;
		outline-color: var(--focus-color) !important;
		outline-style: solid !important;
		outline-offset: 1px !important;
		position: relative !important;
		z-index: 100 !important;
	}
	label > :focus-visible {
		outline: none !important;
	}
	*[tabindex="-1"]:focus {
		outline-style: dashed !important;
	}

	summary, label, input:is([type="checkbox"], [type="radio"]) {
		cursor: pointer;
		user-select: none;
		-webkit-user-select: none;
	}

	table, th, td {
		border: 1px solid;
		border-collapse: collapse;
	}
	table {
		width: 100%;
	}
	caption {
		font-style: italic;
	}
	thead {
		border-bottom: 2px solid;
		text-align: center;
		font-weight: bold;
	}
	tbody th {
		text-align: left;
	}

	footer {
		border-top: 1px solid var(--border-color);
		font-size: 0.9em;
		background-color: var(--background-color-2);
		padding: 2px
	}

	summary {
		min-height: auto;
		padding: 5px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 3px;

		&::marker {
			content: "";
		}
		&::-webkit-details-marker {
			display: none;
		}
		&::before, &::after {
			content: "";
			display: inline-block;
			width: 0.5em;
			height: 0.5em;
			transform: rotate(45deg);
		}
		&::after {
			border-top: 2px solid var(--border-color);
			border-right: 2px solid var(--border-color);
		}
		&::before {
			border-bottom: 2px solid var(--border-color);
			border-left: 2px solid var(--border-color);
		}
	}
	details[open] summary {
		&::after {
			border-top: none;
			border-right: none;
			border-bottom: 2px solid var(--border-color);
			border-left: 2px solid var(--border-color);
		}
		&::before {
			border-bottom: none;
			border-left: none;
			border-top: 2px solid var(--border-color);
			border-right: 2px solid var(--border-color);
		}
	}
	[dir="rtl"] summary {
		&::before, &::after {
			transform: rotate(225deg);
		}
	}

	:popover-open, dialog {
		color: var(--text-color);
		background-color: var(--background-color);
	}

	button, input:is([type="button"], [type="submit"], [type="reset"]), input[type="file"]::file-selector-button, select, summary {
		background-color: var(--button-face-color);
		color: var(--button-text-color);
		border: 1px solid var(--link-color);
		cursor: pointer;
		min-width: 30px;
		min-height: 30px;
		user-select: none;
		-webkit-user-select: none;
	}
	/** https://browserstrangeness.bitbucket.io/css_hacks.html#safari **/
	@supports (-webkit-hyphens:none) {
		select {
			background-color: white;
			color: black;
		}
	}

	button[aria-expanded="true"], button[aria-pressed="true"], details[open] summary {
		background-color: var(--selected-color);
		box-shadow: 0px 0px 3px 1px var(--link-color) inset;
	}

	:is(button, select, input:is([type="button"], [type="submit"], [type="reset"]))[disabled], input[type="file"][disabled]::file-selector-button {
		text-decoration: line-through;
		border: 1px solid var(--border-color);
		opacity: 0.5;
	}

	:is(button, select, input:is([type="button"], [type="submit"], [type="reset"]))[disabled]:hover, input[type="file"][disabled]::file-selector-button:hover {
		cursor: not-allowed;
	}

	input:is([type="text"], [type="password"], [type="number"], [type="email"], [type="date"], [type="time"]), textarea {
		color: var(--input-text-color);
		background-color: var(--input-background-color);
		border: 2px groove var(--border-color);
	}

	:is(input:is([type="text"], [type="password"], [type="number"], [type="email"], [type="date"], [type="time"]), textarea, select):invalid {
		box-shadow: -3px 0px 0px 0px var(--invalid-color);
		&:focus-within {
			box-shadow: inset 0px 0px 4px 2px var(--invalid-color), -3px 0px 0px 0px var(--invalid-color);
		}
	}

	textarea {
		min-height: 15px;
		min-width: 60px;
	}

	mark {
		background-color: var(--mark-color);
		color: var(--text-color);
	}

	form {
		button[type="submit"], button:not([type="reset"], [type="button"]), input[type="submit"] {
			border-width: 2px;
			font-weight: bold;
		}
	}

	.input-vertical {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;
	}
	label:not(.input-vertical) {
		display: inline-flex;
		align-items: center;
		&:is(.text-after, :has(input:is([type="checkbox"], [type="radio"]))) {
			padding-inline-end: 2px;
			:is(input, select) {
				margin-inline-end: 5px;
			}
		}
		&:not(:is(.text-after, :has(input:is([type="checkbox"], [type="radio"])))) :is(input, select) {
			margin-inline-start: 5px;
		}
		&.wide {
			> * {
				flex-grow: 1;
			}
		}
	}

	label:has(input:checked) {
		background-color: var(--selected-color);
	}
	`;
}) (window.GW = window.GW || {});