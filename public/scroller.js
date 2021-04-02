import shuffle from 'https://cdn.skypack.dev/shuffle-array';

import { creappend as $ } from './creappend.js';

class Scroller extends HTMLElement {

	/*static get observedAttributes() {
		return ['foo', 'bar'];
	}*/

	constructor() {
		super();
		console.log('🚧 constructed Scroller');

		this.shadow = this.attachShadow({ mode: 'open' });

		const style = $('style', this.shadow);
		style.innerText = `
			:host {
				all: initial;
				background: black;
				contain: content;
				display: grid;
				grid-template-columns: repeat(7, 1fr);
				height: 100%;
				left: 0;
				position: absolute;
				top: 0;
				width: 100%;
				overflow: scroll;
			}

			div {
				justify-self: center;
				margin: .5em;
				font-size: 5vw;
			}
		`;
	}

	handleScroll() {
		console.log('📜', window.scrollY);
	}

	connectedCallback() {
		console.log('🥌 Scroller connected');
		this.addEventListener('scroll', this.handleScroll);
		const numberOfSprites = this.getAttribute('numberOfSprites');
		const ratioOfCollectibles = this.getAttribute('ratioOfCollectibles');

		const sprites = [];

		// create some number of collectible sprites
		const numberOfCollectibles = numberOfSprites * ratioOfCollectibles;
		const collectibleKinds = [`🎅`, `🤶`];
		for (let i = 0; i < numberOfCollectibles; i++) {
			sprites.push({ kind: shuffle.pick(collectibleKinds), isCollectible: true});
		}

		// create some other number of uncollectible sprites
		const numberOfUncollectibles = numberOfSprites - numberOfCollectibles;
		const uncollectibleKinds = [
			`👩`,
			`👨`,
			`🧑`,
			`👧`,
			`👦`,
			`🧒`,
			`👶`,
			`👵`,
			`👴`,
			`🧓`,
			`👩‍🦰`,
			`👨‍🦰`,
			`👩‍🦱`,
			`👨‍🦱`,
			`👩‍🦲`,
			`👨‍🦲`,
			`👩‍🦳`,
			`👨‍🦳`,
			`👱‍♀️`,
			`👱‍♂️`,
			`👸`,
			`🤴`,
			`👳‍♀️`,
			`👳‍♂️`,
			`👲`,
			`🧔`,
			`👼`,
		];
		for (let i = 0; i < numberOfUncollectibles; i++) {
			sprites.push({kind: shuffle.pick(uncollectibleKinds), isCollectible: false});
		}

		// randomize them and add them to the shadow root
		shuffle(sprites);
		for (let i = 0, n = sprites.length; i < n; i++) {
			const el = document.createElement('div');
			el.innerText = sprites[i].kind;
			if(sprites[i].isCollectible) {
				el.addEventListener('click', () => {
					alert('you found me!');
				});
			}
			this.shadow.appendChild(el);
		}
	}

	disconnectedCallback() {
		console.log('🔌');
		this.removeEventListener('scroll', this.handleScroll);
	}

	/*adoptedCallback() {
		console.log('🤱');
	}*/

	/*attributeChangedCallback(name, oldValue, newValue) {
		console.log('📶', name, oldValue, newValue);
	}*/
}

export default Scroller;
