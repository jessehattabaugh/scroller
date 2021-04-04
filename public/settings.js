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
			}
			[type='submit'] {
				color: cyan;
				background: hotpink;
				font-size: 5vw;
				padding: 0.5em;
				border: 0.5em outset lime;
				font-family: cursive;
				border-radius: 1em;
			}
		`;
	}

	static get properties() {
		return {
			isPlaying: { type: Boolean },
			numberOfSprites: { type: Number },
			ratioOfCollectibles: { type: Number },
		};
	}

	constructor() {
		super();
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
						type="range"
						min="10"
						max="9999"
						@change="${this.handleNumberOfSpritesChange}"
						value="${this.numberOfSprites}"
					/>
				</label>
				<label>
					ratio of collectibles: <output>${this.ratioOfCollectibles}</output>
					<input
						type="range"
						min="0.001"
						max="0.1"
						step="0.001"
						@change="${this.handleRatioOfCollectiblesChange}"
						value="${this.ratioOfCollectibles}"
					/>
				</label>
				<label>
					<input type="submit" value="Play!" />
				</label>
			</form>
			${this.isPlaying
				? html`<scroller-modal
						numberOfSprites="${this.numberOfSprites}"
						ratioOfCollectibles="${this.ratioOfCollectibles}"
				  ></scroller-modal>`
				: null}`;
	}
}

export default Settings;
