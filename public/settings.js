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
			/*:host {
				all: initial;
				contain: content;
			}*/
			form {
				font-size: 6vw;
			}
			label input {
				display: block;
				width: 100%;
			}
		`;

		const form = $('form', shadow);

		this.numberOfSprites = 10000;

		const numberOfSpritesLabel = $('label', form);
		numberOfSpritesLabel.innerText = 'number of sprites';

		const numberOfSpritesInput = $('input', numberOfSpritesLabel);
		numberOfSpritesInput.type = 'range';
		numberOfSpritesInput.min = 10;
		numberOfSpritesInput.max = 99999;
		numberOfSpritesInput.value = this.numberOfSprites;
		numberOfSpritesInput.onchange = (event) => {
			console.log(`🧚‍♀️ number of sprites changed`, event.target.value);
			this.numberOfSprites = event.target.value;
		};

		this.ratioOfCollectibles = 0.02;

		const ratioOfCollectiblesLabel = $('label', form);
		ratioOfCollectiblesLabel.innerText = 'ratio of collectibles';

		const ratioOfCollectiblesInput = $('input', ratioOfCollectiblesLabel);
		ratioOfCollectiblesInput.type = 'range';
		ratioOfCollectiblesInput.min = 0.001;
		ratioOfCollectiblesInput.max = 0.5;
		ratioOfCollectiblesInput.step = 0.001;
		ratioOfCollectiblesInput.value = this.ratioOfCollectibles;
		ratioOfCollectiblesInput.onchange = (event) => {
			console.log(`🧜‍♀️ ratio changed`, event.target.value);
			this.ratioOfCollectibles = event.target.value;
		};

		const submit = $('input', form);
		submit.type = 'submit';
		submit.onclick = (event) => {
			console.log('🎲', this.numberOfCollectibles);
			event.preventDefault();

			const scroller = document.createElement('scroller-modal');
			scroller.setAttribute('numberOfSprites', this.numberOfSprites);
			scroller.setAttribute('ratioOfCollectibles', this.ratioOfCollectibles);
			shadow.appendChild(scroller);
			// TODO delete any existing scrollers before adding a new one

			return false;
		};
	}
}

export default Settings;
