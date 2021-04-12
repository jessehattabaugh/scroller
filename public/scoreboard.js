import { LitElement, html, css } from 'https://cdn.skypack.dev/lit-element';

class ScoreBoard extends LitElement {
	static get styles() {
		return css`
			:host {
				align-items: flex-end;
				background: black;
				color: white;
				display: flex;
				font-size: min(7vw, 3em);
				gap: 0.5em;
				justify-content: space-around;
				padding: 0.25em;
				text-shadow: 0 0 0.5em rgba(255, 255, 255, 0.5);
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
				font-size: 14vw;
			}
			:host(.stopped) span {
				font-size: 14vw;
			}
			output {
				white-space: initial;
			}
			button {
				appearance: none;
				background: lime;
				border-radius: 1em;
				border: 0.4em outset magenta;
				color: blue;
				font-size: 7vw;
				outline: none;
				padding: 0.75em;
			}
			button:focus {
				box-shadow: 0 0 1em white;
			}
			h4 {
				font-size: 0.5em;
				margin: 0;
			}
			div {
				text-align: center;
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
					: html`<h4>Find:</h4>
							<output
								>${Object.keys(this.score)
									.map((kind, i) => `${kind}:${this.score[kind]}`)
									.join(' ')}</output
							>`}
			</div>
			${isStopped
				? null
				: html`<div>
						<h4>Avoid:</h4>
						${Object.keys(this.baddies)
							.map((kind, i) => kind)
							.join(' ')}
				  </div>`}
			${isStarted ? null : html`<div>${this.timer}</div>`}
			${isStarted ? html`<div><h4>★</h4>${this.bonus}</div>` : null}
			${isStopped ? html`<button @click="${this.handleBackClick}">Back</button>` : null}`;
	}
}

export default ScoreBoard;
