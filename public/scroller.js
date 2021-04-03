import { LitElement, html, css } from 'https://cdn.skypack.dev/lit-element';

import shuffle from 'https://cdn.skypack.dev/shuffle-array';

import ScoreBoard from './scoreboard.js';
customElements.define('score-board', ScoreBoard);

import Sprite from './sprite.js';
customElements.define('sprite-comp', Sprite);

class Scroller extends LitElement {
	static get properties() {
		return {
			numberOfSprites: { type: String },
			ratioOfCollectibles: { type: String },
		};
	}
	static get styles() {
		return css`
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
				background-image: linear-gradient(to right top, #d16ba5, #8aa7ec, #5ffbf1);
				display: grid;
				grid-template-columns: repeat(5, 1fr);
				overflow: scroll;
			}
		`;
	}

	sprites = [];
	intersected = [];
	collected = [];
	kindTotals = {};

	observer = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				console.log('👀 collectible came into view', entry.target.innerText);
				this.intersected.push(entry.target);
			} else {
				console.log('🙈 collectible became hidden', entry.target.innerText);
				delete this.intersected[this.intersected.indexOf(entry.target)];
			}
		});
	});

	connectedCallback() {
		super.connectedCallback();
		this.generateSprites();
		console.log('🥌 Scroller connected');
	}

	generateSprites() {
		// create some number of collectible sprites
		const numberOfCollectibles = this.numberOfSprites * this.ratioOfCollectibles;
		const collectibleKinds = [`🎅`, `🤶`];

		for (let i = 0; i < numberOfCollectibles; i++) {
			const kind = shuffle.pick(collectibleKinds);
			this.sprites.push({ kind: kind, isCollectible: true });
			this.kindTotals[kind] = (this.kindTotals[kind] || 0) + 1;
		}
		console.log('👨‍👩‍👧‍👧 kindTotals: ', this.kindTotals);

		// create some other number of uncollectible sprites
		const numberOfUncollectibles = this.numberOfSprites - numberOfCollectibles;
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
			this.sprites.push({
				kind: shuffle.pick(uncollectibleKinds),
				isCollectible: false,
			});
		}

		shuffle(this.sprites);
	}

	handleClick() {
		for (let sprite of this.intersected) {
			if (sprite && !this.collected.includes(sprite)) {
				this.collected.push(sprite);
				sprite.classList.add('collected');
				this.kindTotals[sprite.innerText]--;

				const leftToFind = Object.values(this.kindTotals).reduce((a, b) => a + b);

				console.log(`👨‍🎤`, leftToFind);
			}
		}

		console.log(`📸 collecting ${this.collected.length}`);
	}

	render() {
		return html`<score-board .score="${this.kindTotals}"></score-board>
			<div class="container" @click="${this.handleClick}">
				${this.sprites.map(
					(sprite) =>
						html`<sprite-comp
							.observer="${this.observer}"
							.isCollectible="${sprite.isCollectible}"
							>${sprite.kind}</sprite-comp
						>`,
				)}
			</div>`;
	}
}

export default Scroller;
