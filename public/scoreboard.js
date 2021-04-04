import { LitElement, html, css } from 'https://cdn.skypack.dev/lit-element';

class ScoreBoard extends LitElement {
	static get styles() {
		return css`
			:host {
				align-items: center;
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
				align-items: center;
				font-size: 9vw;
			}
			:host(.stopped) span {
				font-size: 18vw;
			}
			button {
				background: lime;
				border-radius: 1em;
				border: 0.4em outset magenta;
				color: blue;
				font-family: fantasy;
				font-size: 7vw;
				padding: 0.75em;
			}
			output {
				font-size: min(10vw, 3em);
			}
		`;
	}

	static get properties() {
		return {
			clicks: { type: Number },
			score: { type: String },
			timer: { type: String },
		};
	}

	constructor() {
		super();
		this.clicks = 0;
		this.timer = '00:00';
	}

	handleBackClick() {
		history.back();
	}

	render() {
		const isStopped = this.classList.contains('stopped');
		return html`${isStopped
				? html`You found them all!`
				: html`Find these:
						<output
							>${Object.keys(this.score)
								.map((kind, i) => `${kind}:${this.score[kind]}`)
								.join(' ')}</output
						>`}
			<span>${this.timer}</span>
			<span>${this.clicks} ${isStopped ? ' clicks' : null}</span>
			${isStopped ? html`<button @click="${this.handleBackClick}">Back</button>` : null}`;
	}
}

export default ScoreBoard;
