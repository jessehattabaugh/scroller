import { LitElement, html, css } from 'https://cdn.skypack.dev/lit-element';

import shuffle from 'https://cdn.skypack.dev/shuffle-array';
import emojisList from 'https://cdn.skypack.dev/emojis-list';

import ScoreBoard from './scoreboard.js';
customElements.define('score-board', ScoreBoard);

import Sprite from './sprite.js';
customElements.define('sprite-comp', Sprite);

class Scroller extends LitElement {
	static get properties() {
		return {
			clicks: { type: Number },
			numberOfColumns: { type: Number },
			numberOfSprites: { type: Number },
			ratioOfCollectibles: { type: Number },
			timer: { type: String },
		};
	}
	static get styles() {
		return css`
			:host {
				display: flex;
				flex-direction: column;
				height: 100%;
				left: 0;
				position: absolute;
				top: 0;
				width: 100%;
			}
			.container {
				background-image: linear-gradient(to right top, #d16ba5, #8aa7ec, #5ffbf1);
				display: grid;
				flex: 1;
				overflow-x: hidden;
				overflow-y: scroll;
			}
		`;
	}

	constructor() {
		super();
		this.clicks = 0;
		this.collected = [];
		this.intersected = [];
		this.kindTotals = {};
		this.sprites = [];
		this.timerEnd = null;

		this.observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					//console.log('👀 collectible came into view', entry.target.innerText);
					this.intersected.push(entry.target);
				} else {
					//console.log('🙈 collectible became hidden', entry.target.innerText);
					delete this.intersected[this.intersected.indexOf(entry.target)];
				}
			});
		});
	}

	connectedCallback() {
		console.log('🥌 Scroller connected');
		super.connectedCallback();
		this.generateSprites();
		this.startTimer();
	}

	randomEmoji() {
		const goodEmojis = emojisList.slice(316, 3057);
		return shuffle.pick(goodEmojis);
	}

	generateSprites() {
		// create some number of collectible sprites
		const numberOfCollectibles = this.numberOfSprites * this.ratioOfCollectibles;
		const numberOfCollectibleKinds = 2;
		const collectibleKinds = [];
		for (let i = 0; i < numberOfCollectibleKinds; i++) {
			collectibleKinds.push(this.randomEmoji());
		}

		for (let i = 0; i < numberOfCollectibles; i++) {
			const kind = shuffle.pick(collectibleKinds);
			this.sprites.push({ kind: kind, isCollectible: true });
			this.kindTotals[kind] = (this.kindTotals[kind] || 0) + 1;
		}
		console.log('👨‍👩‍👧‍👧 kindTotals: ', this.kindTotals);

		// create some other number of uncollectible sprites
		const numberOfUncollectibles = this.numberOfSprites - numberOfCollectibles;
		const numberOfUncollectibleKinds = 10;
		const uncollectibleKinds = [];
		for (let i = 0; i < numberOfUncollectibleKinds; i++) {
			uncollectibleKinds.push(this.randomEmoji());
		}

		for (let i = 0; i < numberOfUncollectibles; i++) {
			this.sprites.push({
				kind: shuffle.pick(uncollectibleKinds),
				isCollectible: false,
			});
		}

		shuffle(this.sprites);
	}

	startTimer() {
		this.timerStart = new Date().getTime();

		this.timerInterval = setInterval(() => {
			// stop the clock when an end time gets set
			if (this.timerEnd !== null) {
				clearInterval(this.timerInterval);
			}
			const now = new Date().getTime();
			const distance = now - this.timerStart;
			const seconds = Math.floor((distance % (1000 * 60)) / 1000) + '';
			const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)) + '';
			this.timer = `${minutes.padStart(2, 0)}:${seconds.padStart(2, 0)}`;
		}, 1000);
	}

	handleClick() {
		console.log(`📸 collecting ${this.collected.length}`);
		this.clicks++;

		// collect all the intersected sprites
		for (let sprite of this.intersected) {
			if (sprite && !this.collected.includes(sprite)) {
				this.collected.push(sprite);
				sprite.classList.add('collected'); // this seems dangerous but it works...
				this.kindTotals[sprite.innerText]--;

				// end the game when there are none left to find
				const leftToFind = Object.values(this.kindTotals).reduce((a, b) => a + b);
				if (!leftToFind) {
					console.log(`🎉 done!`, leftToFind);
					this.timerEnd = new Date().getTime();
				}
			}
		}
	}

	render() {
		return html`
			<style>
				.container {
					grid-row-gap: ${80 / this.numberOfColumns}vw;
					grid-template-columns: repeat(${this.numberOfColumns}, 1fr);
				}
			</style>
			<score-board
				.clicks="${this.clicks}"
				.score="${this.kindTotals}"
				.timer="${this.timer}"
				class="${this.timerEnd !== null ? 'stopped' : 'playing'}"
			></score-board>
			${this.timerEnd
				? null
				: html`<div class="container" @click="${this.handleClick}">
						${this.sprites.map(
							(sprite) =>
								html`<sprite-comp
									.columns="${this.numberOfColumns}"
									.observer="${this.observer}"
									.isCollectible="${sprite.isCollectible}"
									>${sprite.kind}</sprite-comp
								>`,
						)}
				  </div>`}
		`;
	}
}

export default Scroller;
