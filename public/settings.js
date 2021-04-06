import { LitElement, html, css } from 'https://cdn.skypack.dev/lit-element';

import Scroller from './scroller.js';
customElements.define('scroller-modal', Scroller);

class Settings extends LitElement {
	static get styles() {
		return css`
			form {
				font-size: 6vw;
				padding: 1em;
			}
			input {
				display: block;
				width: 100%;
			}
			label {
				display: block;
				padding: 1em;
				user-select: none;
			}
			[type='submit'] {
				background: hotpink;
				border-radius: 1em;
				border: 0.5em outset lime;
				color: cyan;
				font-family: cursive;
				font-size: 5vw;
				outline: none;
				padding: 0.5em;
			}
			[type='submit']:focus {
				background: red;
			}
		`;
	}

	static get properties() {
		return {
			isPlaying: { type: Boolean },
			numberOfColumns: { type: Number },
			numberOfSprites: { type: Number },
			ratioOfCollectibles: { type: Number },
		};
	}

	constructor() {
		super();
		this.numberOfColumns = 5;
		this.numberOfSprites = 500;
		this.ratioOfCollectibles = 0.025;
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

	render() {
		return html`<form @submit="${this.handleSubmit}">
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
					<input type="submit" value="Play!" />
				</label>
			</form>
			${this.isPlaying
				? html`<scroller-modal
						.numberOfColumns="${this.numberOfColumns}"
						.numberOfSprites="${this.numberOfSprites}"
						.ratioOfCollectibles="${this.ratioOfCollectibles}"
				  ></scroller-modal>`
				: null}`;
	}
}

export default Settings;
