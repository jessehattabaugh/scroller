import { creappend as $ } from './creappend.js';

class ScoreBoard extends HTMLElement {
	static get observedAttributes() {
		return ['score'];
	}

	constructor() {
		super();
		console.log('⏱ constructed ScoreBoard');

		this.shadow = this.attachShadow({ mode: 'open' });

		const style = $('style', this.shadow);
		style.innerText = `
			:host {
				background: black;
				color: white;
				display: flex;
				justify-content: space-around;
				padding: .5em;
			}
		`;
		$('span', this.shadow).innerText = 'Find these:';
		this.scoreOutput = $('output', this.shadow);

		const timer = $('span', this.shadow);
		timer.id = 'timer';
		timer.innerText = ':00';
		this.timerStart = new Date().getTime();

		this.timerInterval = setInterval(() => {
			const now = new Date().getTime();
			const distance = now - this.timerStart;
			const seconds = Math.floor((distance % (1000 * 60)) / 1000);
			timer.innerText = `:${seconds}`;
		}, 1000);
	}

	updateScore(score) {
		this.scoreOutput.innerText = score || 'wtf';
	}

	connectedCallback() {
		console.log('🍍 ScoreBoard connected');
		this.updateScore(this.getAttribute('score'));
	}

	attributeChangedCallback(name, oldValue, newValue) {
		console.log(
			`🍉 scoreboard ${name} changed from ${oldValue} to ${newValue}`,
		);
		if (name == 'score') this.updateScore(newValue);
	}
}

export default ScoreBoard;
