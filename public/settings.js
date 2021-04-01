import { creappend as $ } from './creappend.js';

import Scroller from './scroller.js';
customElements.define('scroller-modal', Scroller);

class Settings extends HTMLElement {
	constructor() {
		super();
		console.log('💠');

		const shadow = this.attachShadow({ mode: 'open' });

		const style = $('style', shadow);
		style.innerText = `
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

		this.numberOfSprites = 10000;
		this.ratioOfCollectibles = 0.02;

		const formTemplate = document.createElement('template');
		formTemplate.innerHTML = `<form>
			<label>
				number of sprites
				<input
					id="numberOfSprites"
					type="range"
					min="10"
					max="99999"
					value="${this.numberOfSprites}" />
				<output id="numberOfSpritesOutput">${this.numberOfSprites}</output>
			</label>
			<label>
				ratio of collectibles
				<input
					id="ratioOfCollectibles"
					type="range"
					min="0.001"
					max="0.5"
					step="0.001"
					value="${this.ratioOfCollectibles}" />
				<output id="ratioOfCollectiblesOutput">${this.ratioOfCollectibles}</output>
			</label>
			<input type="submit" value="Play!" />
		</form>`;
		const formClone = formTemplate.content.cloneNode(true);

		this.numberOfSpritesOutput = formClone.getElementById('numberOfSpritesOutput');

		formClone.getElementById('numberOfSprites').onchange = (event) => {
			console.log(`🧚‍♀️ number of sprites changed`, this.numberOfSprites, event.target.value);
			this.numberOfSprites = event.target.value;
			this.numberOfSpritesOutput.innerText = this.numberOfSprites;
		};

		this.ratioOfCollectiblesOutput = formClone.getElementById('ratioOfCollectiblesOutput');

		formClone.getElementById('ratioOfCollectibles').onchange = (event) => {
			console.log(`🧜‍♀️ ratio changed`, this.ratioOfCollectibles, event.target.value);
			this.ratioOfCollectibles = event.target.value;
			this.ratioOfCollectiblesOutput.innerText = this.ratioOfCollectibles;
		};

		formClone.querySelector('input[type=submit]').onclick = (event) => {
			console.log('🎲', this.numberOfCollectibles);
			event.preventDefault();

			const scroller = document.createElement('scroller-modal');
			scroller.setAttribute('numberOfSprites', this.numberOfSprites);
			scroller.setAttribute(
				'ratioOfCollectibles',
				this.ratioOfCollectibles,
			);
			shadow.appendChild(scroller);
			// TODO delete any existing scrollers before adding a new one

			return false;
		};

		shadow.appendChild(formClone);
	}
}

export default Settings;
