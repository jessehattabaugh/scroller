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
				display: flex;
				flex-direction: column;
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
			}
			.container {
				background-image: linear-gradient(to right top, #d16ba5, #c777b9, #ba83ca, #aa8fd8, #9a9ae1, #8aa7ec, #79b3f4, #69bff8, #52cffe, #41dfff, #46eefa, #5ffbf1);
				display: grid;
				grid-template-columns: repeat(5, 1fr);
				overflow: scroll;
			}
			.sprite {
				font-size: 13vw;
				justify-self: center;
				margin: 1vw;
			}
			.collected {
				background: red;
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

		// create a scoreboard
		this.scoreboard = $('score-board', this.shadow);
		this.scoreboard.setAttribute('score', JSON.stringify(this.kindTotals));

		// randomize the sprites and add them to a .container
		shuffle(sprites);
		const container = $('div', this.shadow);
		container.className = 'container';

		const intersected = [];
		const collected = [];

		this.observer = new IntersectionObserver((entries, observer) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					console.log(
						'👀 collectible came into view',
						entry.target.innerText,
					);
					intersected.push(entry.target);
				} else {
					console.log(
						'🙈 collectible became hidden',
						entry.target.innerText,
					);
					delete intersected[intersected.indexOf(entry.target)];
				}
			});
		});

		for (let i = 0, n = sprites.length; i < n; i++) {
			const sprite = sprites[i];
			const spriteElement = $('div', container);
			spriteElement.innerText = sprite.kind;
			spriteElement.className = 'sprite';
			if (sprite.isCollectible) {
				spriteElement.addEventListener('click', () => {
					alert('you found me!');
				});
				this.observer.observe(spriteElement);
			}
		}

		// clicking anywhere on the sprite container collects all the collectible sprites in the view port
		container.onclick = (event) => {
			for (let sprite of intersected) {
				if (sprite && !collected.includes(sprite)) {
					console.log(sprite, typeof sprite);
					collected.push(sprite);
					sprite.classList.add('collected');
				}
			}

			console.log(
				'📸 collecting all the sprites that intersect the viewport',
				collected.length,
			);
		};
	}

	disconnectedCallback() {
		console.log('🔌');
		this.removeEventListener('scroll', this.handleScroll);
	}
}

export default Scroller;
