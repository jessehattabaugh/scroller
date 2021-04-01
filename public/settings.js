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
			</label>
			<input type="submit" />
		</form>`;
		const formClone = formTemplate.content.cloneNode(true);

		formClone.getElementById('numberOfSprites').onchange = (event) => {
			console.log(`🧚‍♀️ number of sprites changed`, event.target.value);
			this.numberOfSprites = event.target.value;
		};

		formClone.getElementById('ratioOfCollectibles').onchange = (event) => {
			console.log(`🧜‍♀️ ratio changed`, event.target.value);
			this.ratioOfCollectibles = event.target.value;
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
