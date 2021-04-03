import { LitElement, html, css } from 'https://cdn.skypack.dev/lit-element';

class ScoreBoard extends LitElement {
	static get styles() {
		return css`
			:host {
				background: black;
				color: white;
				display: flex;
				justify-content: space-around;
				padding: 0.5em;
			}
			:host(.stopped) {
				background: black;
				height: 100%;
				flex-direction: column;
			}
			:host(.stopped) span {
				font-size: 5em;

			}
		`;
	}

	static get properties() {
		return {
			score: { type: String },
			timer: { type: String },
		};
	}

	constructor() {
		super();

		this.timer = '00:00';
	}

	handleBackClick() {
		history.back();
	}

	render() {
		const isStopped = this.classList.contains('stopped');
		return html`${isStopped
				? html`You found them all!`
				: html`Find these: <output>${Object.keys(this.score).map((kind, i) => `${kind}:${this.score[kind]}`).join(' ')}</output>`}
			<span>${this.timer}</span>
			${isStopped ? html`<button @click="${this.handleBackClick}">Back</button>`: null}`;
	}
}

export default ScoreBoard;
