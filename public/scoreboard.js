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

	connectedCallback() {
		super.connectedCallback();

		this.timerStart = new Date().getTime();

		this.timerInterval = setInterval(() => {
			const now = new Date().getTime();
			const distance = now - this.timerStart;
			const seconds = Math.floor((distance % (1000 * 60)) / 1000) + '';
			const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)) + '';
			this.timer = `${minutes.padStart(2, 0)}:${seconds.padStart(2, 0)}`;
		}, 1000);

		console.log('⏱ ScoreBoard connected');
	}

	render() {
		return html`Find these: <output>${JSON.stringify(this.score)}</output>
			<span>${this.timer}</span>`;
	}
}

export default ScoreBoard;
