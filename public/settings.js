import { LitElement, html, css } from 'https://cdn.skypack.dev/lit-element';

import Scroller from './scroller.js';
customElements.define('scroller-modal', Scroller);

class Settings extends LitElement {
	static get styles() {
		return css`
			form {
				font-size: 1.5em;
				padding: 1em;
			}
			input {
				display: block;
				width: 100%;
			}
			label {
				display: block;
				padding: max(0em, 2vw);
				user-select: none;
			}
			[type='submit'] {
				appearance: none;
				background: hotpink;
				border-radius: 1em;
				border: 0.25em outset lime;
				color: yellow;
				font-family: 'Lucida Console', Monaco, monospace;
				font-size: 2.25em;
				font-weight: bold;
				margin: auto;
				outline: none;
				padding: 0.5em;
				width: min(100%, 7em);
			}
			[type='submit']:focus {
				box-shadow: 0 0 1em white;
			}
		`;
	}

	static get properties() {
		return {
			isPlaying: { type: Boolean },
			numberOfColumns: { type: Number },
			numberOfSprites: { type: Number },
			ratioOfBadGuys: { type: Number },
			ratioOfCollectibles: { type: Number },
			rotationPercentage: { type: Number },
			sizeVariability: { type: Number },
		};
	}

	constructor() {
		super();
		this.numberOfColumns = 5;
		this.numberOfSprites = 500;
		this.ratioOfBadGuys = 0.01;
		this.ratioOfCollectibles = 0.025;
		this.rotationPercentage = 0;
		this.sizeVariability = 0.5;
	}

	connectedCallback() {
		super.connectedCallback();
		console.log('🧮 Settings Connected');
		window.addEventListener('popstate', this.handlePopstate.bind(this));
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		console.log('🛑 Settings Disconnected');
		window.removeEventListener('popstate', this.handlePopstate);
	}

	handlePopstate() {
		console.log('🍿 user navigated back');
		this.isPlaying = false;
	}

	handleNumberOfSpritesChange(event) {
		this.numberOfSprites = event.target.value;
	}

	handleRatioOfCollectiblesChange(event) {
		this.ratioOfCollectibles = event.target.value;
	}

	handleNumberOfColumnsChange(event) {
		this.numberOfColumns = event.target.value;
	}

	handleRatioOfBadGuysChange(event) {
		this.ratioOfBadGuys = event.target.value;
	}

	handleRotationPercentageChange(event) {
		this.rotationPercentage = event.target.value;
	}

	handleSubmit(event) {
		event.preventDefault();
		console.log(`🎲 let's play!`);

		this.isPlaying = true;

		// update the url
		const url = new URL(window.location);
		url.searchParams.set('🍆', this.numberOfSprites);
		url.searchParams.set('💩', this.ratioOfCollectibles);
		window.history.pushState({}, '', url);

		return false;
	}

	handleSizeVariabilityChange(event) {
		this.sizeVariability = event.target.value;
	}

	render() {
		return html`${this.isPlaying
			? null
			: html`<form @submit="${this.handleSubmit}">
					<label>
						<input type="submit" value="Play!" />
					</label>
					<label>
						number of sprites: <output>${this.numberOfSprites}</output>
						<input
							@change="${this.handleNumberOfSpritesChange}"
							max="9999"
							min="10"
							type="range"
							value="${this.numberOfSprites}"
						/>
					</label>
					<label>
						ratio of collectibles: <output>${this.ratioOfCollectibles}</output>
						<input
							@change="${this.handleRatioOfCollectiblesChange}"
							max="0.1"
							min="0.001"
							step="0.001"
							type="range"
							value="${this.ratioOfCollectibles}"
						/>
					</label>
					<label>
						number of columns: <output>${this.numberOfColumns}</output>
						<input
							@change="${this.handleNumberOfColumnsChange}"
							max="10"
							min="1"
							type="range"
							value="${this.numberOfColumns}"
						/>
					</label>
					<label>
						ratio of bad guys: <output>${this.ratioOfBadGuys}</output>
						<input
							@change="${this.handleRatioOfBadGuysChange}"
							max="0.1"
							min="0.001"
							type="range"
							step="0.001"
							value="${this.ratioOfBadGuys}"
						/>
					</label>
					<label>
						rotation percentage: <output>${this.rotationPercentage}</output>
						<input
							@change="${this.handleRotationPercentageChange}"
							max="1"
							min="0"
							type="range"
							step="0.001"
							value="${this.rotationPercentage}"
						/>
					</label>
					<label>
						size variability: <output>${this.sizeVariability}</output>
						<input
							@change="${this.handleSizeVariabilityChange}"
							max="1"
							min="0"
							type="range"
							step="0.001"
							value="${this.sizeVariability}"
						/>
					</label>
			  </form>`}
		${this.isPlaying
			? html`<scroller-modal
					.numberOfColumns="${this.numberOfColumns}"
					.numberOfSprites="${this.numberOfSprites}"
					.ratioOfBadGuys="${this.ratioOfBadGuys}"
					.ratioOfCollectibles="${this.ratioOfCollectibles}"
					.rotationPercentage="${this.rotationPercentage}"
					.sizeVariability="${this.sizeVariability}"
			  ></scroller-modal>`
			: null}`;
	}
}

export default Settings;
