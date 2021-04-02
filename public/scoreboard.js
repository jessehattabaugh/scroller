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
				background: red;
				border-radius: 1em;
				left: 1vw;
				position: fixed;
				top: 1vw;
				width: 100%;
				color: white;
			}
		`;

		this.scoreOutput = $('output', this.shadow);
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
