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
				transition-duration: 1s;
				transition-property: all;
				transition-timing-function: linear;
			}
			:host(.notstarted),
			:host(.stopped) {
				align-items: center;
				background: black;
				flex-direction: column;
				font-size: 9vw;
				height: 100%;
			}
			:host(.notstarted) output {
				font-size: 18vw;
			}
			:host(.stopped) span {
				font-size: 18vw;
			}
			output {
				font-size: min(10vw, 3em);
			}
			button {
				background: lime;
				border-radius: 1em;
				border: 0.4em outset magenta;
				color: blue;
				font-family: fantasy;
				font-size: 7vw;
				padding: 0.75em;
				outline: none;
			}
			button:focus {
				box-shadow: 0 0 1em white;
			}
		`;
	}

	static get properties() {
		return {
			bonus: { type: Number },
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
		const isStarted = this.classList.contains('started');
		return html`${isStopped
				? html`You found them all!`
				: html`Find these:
						<output
							>${Object.keys(this.score)
								.map((kind, i) => `${kind}:${this.score[kind]}`)
								.join(' ')}</output
						>`}
						${isStarted
							? null
							: html`<span>Avoid: 😈</span>`}
			<span>${this.timer}</span>

			${isStarted
				? html`<span>⭐: ${this.bonus}</span>`
				: null}
			${isStopped ? html`<button @click="${this.handleBackClick}">Back</button>` : null}`;
	}
}

export default ScoreBoard;
