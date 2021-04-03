import { LitElement, html, css } from 'https://cdn.skypack.dev/lit-element';

import Scroller from './scroller.js';
customElements.define('scroller-modal', Scroller);

class Settings extends LitElement {
	static get styles() {
		return css`
			form {
				font-size: 6vw;
			}
			input {
				display: block;
				width: 100%;
			}
			output {
				display: block;
			}
		`;
	}

	numberOfSprites = 500;
	ratioOfCollectibles = 0.025;

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
		url.searchParams.set('numberOfSprites', this.numberOfSprites);
		url.searchParams.set('ratioOfCollectibles', this.ratioOfCollectibles);
		window.history.pushState({}, '', url);

		return false;
	}

	render() {
		return html`<form @submit="${this.handleSubmit}">
				<label>
					number of sprites
					<input
						id="numberOfSprites"
						type="range"
						min="10"
						max="9999"
						@change="${this.handleNumberOfSpritesChange}"
						value="${this.numberOfSprites}"
					/>
					<output id="numberOfSpritesOutput">${this.numberOfSprites}</output>
				</label>
				<label>
					ratio of collectibles
					<input
						id="ratioOfCollectibles"
						type="range"
						min="0.001"
						max="0.1"
						step="0.001"
						@change="${this.handleRatioOfCollectiblesChange}"
						value="${this.ratioOfCollectibles}"
					/>
					<output id="ratioOfCollectiblesOutput">${this.ratioOfCollectibles}</output>
				</label>
				<input type="submit" value="Play!" />
			</form>
			${this.isPlaying &&
			html`<scroller-modal
				numberOfSprites="${this.numberOfSprites}"
				ratioOfCollectibles="${this.ratioOfCollectibles}"
			></scroller-modal>`}`;
	}
}

export default Settings;
