import shuffle from 'https://cdn.skypack.dev/shuffle-array';

import { creappend as $ } from './creappend.js';

import ScoreBoard from './scoreboard.js';
customElements.define('score-board', ScoreBoard);

class Scroller extends HTMLElement {
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
				grid-template-columns: repeat(5, 1fr);
				height: 100%;
				left: 0;
				position: absolute;
				top: 0;
				width: 100%;
				overflow: scroll;
			}

			div {
				justify-self: center;
				margin: 1vw;
				font-size: 13vw;
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
		this.kindTotals = {};
		for (let i = 0; i < numberOfCollectibles; i++) {
			const kind = shuffle.pick(collectibleKinds);
			sprites.push({ kind: kind, isCollectible: true });
			this.kindTotals[kind] = (this.kindTotals[kind] || 0) + 1;
		}
		console.log('👨‍👩‍👧‍👧 kindTotals: ', this.kindTotals);

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
			sprites.push({
				kind: shuffle.pick(uncollectibleKinds),
				isCollectible: false,
			});
		}

		// randomize the sprites and add them to the shadow root
		shuffle(sprites);
		for (let i = 0, n = sprites.length; i < n; i++) {
			const el = document.createElement('div');
			el.innerText = sprites[i].kind;
			if (sprites[i].isCollectible) {
				el.addEventListener('click', () => {
					alert('you found me!');
				});
			}
			this.shadow.appendChild(el);
		}

		// create a scoreboard
		this.scoreboard = $('score-board', this.shadow);
		this.scoreboard.setAttribute('score', JSON.stringify(this.kindTotals));

	}

	disconnectedCallback() {
		console.log('🔌');
		this.removeEventListener('scroll', this.handleScroll);
	}
}

export default Scroller;
