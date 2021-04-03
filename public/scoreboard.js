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

	render() {
		return html`Find these: <output>${JSON.stringify(this.score)}</output>
			<span>${this.timer}</span>`;
	}
}

export default ScoreBoard;
