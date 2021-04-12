import { LitElement, html, css } from 'https://cdn.skypack.dev/lit-element';

class ScoreBoard extends LitElement {
	static get styles() {
		return css`
			:host {
				align-items: flex-end;
				background: black;
				color: white;
				display: flex;
				justify-content: space-around;
				padding: 0.5em;
				transition-duration: 1s;
				transition-property: all;
				transition-timing-function: linear;
				white-space: nowrap;
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
			h4 {
				margin: 0;
			}
		`;
	}

	static get properties() {
		return {
			baddies: { type: Object },
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
		return html`<div>
				${isStopped
					? html`You found them all!`
					: html`<h4>Find these:</h4>
							<output
								>${Object.keys(this.score)
									.map((kind, i) => `${kind}:${this.score[kind]}`)
									.join(' ')}</output
							>`}
			</div>
			<div>
				<h4>Avoid:</h4>
				${Object.keys(this.baddies)
					.map((kind, i) => `${kind}:${this.baddies[kind]}`)
					.join(' ')}
			</div>
			${isStarted ? null : html`<div>${this.timer}</div>`}
			${isStarted ? html`<div>⭐: ${this.bonus}</div>` : null}
			${isStopped ? html`<button @click="${this.handleBackClick}">Back</button>` : null}`;
	}
}

export default ScoreBoard;
