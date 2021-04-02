import { creappend as $ } from './creappend.js';

import Scroller from './scroller.js';
customElements.define('scroller-modal', Scroller);

class Settings extends HTMLElement {
	constructor() {
		super();
		console.log('💠');

		this.shadow = this.attachShadow({ mode: 'open' });

		const style = $('style', this.shadow);
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

		this.numberOfSprites = 500;
		this.ratioOfCollectibles = 0.025;

		// cloning the settings form from a template to save the pain of building it piece by piece
		const formTemplate = document.createElement('template');
		formTemplate.innerHTML = `<form>
			<label>
				number of sprites
				<input
					id="numberOfSprites"
					type="range"
					min="10"
					max="9999"
					value="${this.numberOfSprites}" />
				<output id="numberOfSpritesOutput">${this.numberOfSprites}</output>
			</label>
			<label>
				ratio of collectibles
				<input
					id="ratioOfCollectibles"
					type="range"
					min="0.001"
					max="0.1"
					step="0.001"
					value="${this.ratioOfCollectibles}" />
				<output id="ratioOfCollectiblesOutput">${this.ratioOfCollectibles}</output>
			</label>
			<input type="submit" value="Play!" />
		</form>`;
		const formClone = formTemplate.content.cloneNode(true);

		// need to store a reference to this because the formClone seems to go stale
		this.numberOfSpritesOutput = formClone.getElementById(
			'numberOfSpritesOutput',
		);

		formClone.getElementById('numberOfSprites').onchange = (event) => {
			console.log(
				`🧚‍♀️ number of sprites changed`,
				this.numberOfSprites,
				event.target.value,
			);
			this.numberOfSprites = event.target.value;
			this.numberOfSpritesOutput.innerText = this.numberOfSprites;
		};

		// need to store a reference to this because the formClone seems to go stale
		this.ratioOfCollectiblesOutput = formClone.getElementById(
			'ratioOfCollectiblesOutput',
		);

		formClone.getElementById('ratioOfCollectibles').onchange = (event) => {
			console.log(
				`🧜‍♀️ ratio changed`,
				this.ratioOfCollectibles,
				event.target.value,
			);
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
			this.shadow.appendChild(scroller);
			// TODO delete any existing scrollers before adding a new one

			const url = new URL(window.location);
			url.searchParams.set('numberOfSprites', this.numberOfSprites);
			url.searchParams.set(
				'ratioOfCollectibles',
				this.ratioOfCollectibles,
			);
			window.history.pushState({}, '', url);

			return false;
		};

		this.shadow.appendChild(formClone);
	}

	popstateHandler(event) {
		console.log('🍿 state is popping');
		this.shadow.querySelector('scroller-modal').remove();
	}

	connectedCallback() {
		console.log('🧮 Settings Connected');
		window.addEventListener('popstate', this.popstateHandler.bind(this));
	}

	disconnectedCallback() {
		console.log('🛑 Settings Disconnected');
		window.removeEventListener('popstate', this.popstateHandler);
	}
}

export default Settings;
