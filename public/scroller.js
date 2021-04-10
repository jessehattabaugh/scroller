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
			isFlashing: { type: Boolean },
			numberOfColumns: { type: Number },
			numberOfSprites: { type: Number },
			ratioOfCollectibles: { type: Number },
			rotationPercentage: { type: Number },
			timer: { type: String },
		};
	}
	static get styles() {
		return css`
			:host {
				box-sizing: border-box;
				display: flex;
				flex-direction: column;
				height: 100%;
				left: 0;
				position: absolute;
				top: 0;
				width: 100%;
			}
			.container {
				box-sizing: border-box;
				background-image: linear-gradient(to right top, #d16ba5, #8aa7ec, #5ffbf1);
				display: grid;
				flex: 1;
				overflow-x: hidden;
				overflow-y: scroll;
			}
			#halo {
				border-image-slice: 1;
				border-image-source: linear-gradient(to right top, white, gold);
				border-style: solid;
				border-width: 1em;
				box-sizing: border-box;
				box-sizing: border-box;
				filter: opacity(0.5);
				height: 100%;
				left: 0;
				outline-offset: -2em;
				outline: 1em solid rgba(255, 255, 255, 0.5);
				pointer-events: none;
				position: absolute;
				top: 0;
				width: 100%;
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
		this.timerStart = null;
		this.bonusPoints = 0;
		this.rotationPercentage = 0;

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

		// before the game starts the timer is used for a countdown till the timer starts
		this.timer = 5;
		const prestartInterval = setInterval(() => {
			this.timer--;
			if (!this.timer) {
				this.startTimer();
				clearInterval(prestartInterval);
			}
		}, 1000);
	}

	randomEmoji() {
		// early and late emojis all kinda suck
		const goodEmojis = emojisList.slice(316, 3057);
		return shuffle.pick(goodEmojis);
	}

	generateSprites() {
		// TODO clear out old sprites?

		// badguy sprites
		const numberOfBadGuys = this.numberOfSprites * this.ratioOfBadGuys;
		for (let i = 0; i < numberOfBadGuys; i++) {
			const kind = '😈';
			this.sprites.push({ kind: kind, isCollectible: true, isBad: true });
		}

		// collectible sprites
		const numberOfCollectibles = this.numberOfSprites * this.ratioOfCollectibles;
		const numberOfCollectibleKinds = 2; // TODO make this a property
		let collectibleKinds = [];
		for (let i = 0; i < numberOfCollectibleKinds; i++) {
			collectibleKinds.push(this.randomEmoji()); // TODO check to make sure it's not a duplicate
		}
		for (let i = 0; i < numberOfCollectibles; i++) {
			const kind = shuffle.pick(collectibleKinds);
			this.sprites.push({ kind: kind, isCollectible: true });
			this.kindTotals[kind] = (this.kindTotals[kind] || 0) + 1; // TODO rename this.kindTotals to this.score
		}
		console.log('👀 Look for these! ', this.kindTotals);

		// uncollectible sprites TODO rename "uncollectible" to "ordinary"
		const numberOfUncollectibles = this.numberOfSprites - numberOfCollectibles;
		const numberOfUncollectibleKinds = 10; // TODO make this a property
		const uncollectibleKinds = [];
		for (let i = 0; i < numberOfUncollectibleKinds; i++) {
			uncollectibleKinds.push(this.randomEmoji()); // TODO check to make sure it's not a duplicate
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
		console.log('⌚ starting timer');
		this.timerStart = new Date().getTime();
		this.timer = '00:00';
		// I don't know why ^ doesn't trigger an update without v
		this.requestUpdate();

		this.timerInterval = setInterval(() => {
			const isTimerRunning = this.timerEnd === null;
			if (isTimerRunning) {
				const now = new Date().getTime();
				const distance = now - this.timerStart;
				const seconds = Math.floor((distance % (1000 * 60)) / 1000) + '';
				const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)) + '';
				this.timer = `${minutes.padStart(2, 0)}:${seconds.padStart(2, 0)}`;
			} else {
				clearInterval(this.timerInterval);
			}
		}, 1000);
	}

	handleClick() {
		console.log(`📸 collecting`);
		this.clicks++;

		// collect all the intersected sprites
		let numberFoundThisClick = 0;
		const bonusPointsBefore = this.bonusPoints;
		for (let sprite of this.intersected) {
			if (sprite && !this.collected.includes(sprite)) {
				if (sprite.innerText === '😈') {
					// bad guy got them!
					console.log(`😈 bad guy got you! -5 bonus points`);
					this.bonusPoints -= 5;
				} else {
					this.collected.push(sprite);

					// more sprites more bonus!
					numberFoundThisClick++; // more bonus next time!
					this.bonusPoints += numberFoundThisClick;

					// reduce the tally in the scoreboard
					console.log(
						`🍄 you collected a ${sprite.innerText} and got ${numberFoundThisClick} bonus points`,
					);
					this.kindTotals[sprite.innerText]--;
				}

				// make the sprite fade away
				sprite.classList.add('collected'); // this seems dangerous but it works...

				// end the game when there are none left to find
				const leftToFind = Object.values(this.kindTotals).reduce((a, b) => a + b);
				if (!leftToFind) {
					console.log(`🎉 none left to find!`, leftToFind);
					this.timerEnd = new Date().getTime();
				}
			}
		}
		this.isFlashing = true;
		setTimeout(() => (this.isFlashing = false), 1000);
		console.log(`⭐ got ${this.bonusPoints - bonusPointsBefore} bonus points total`);
	}

	render() {
		const isPlaying = this.timerEnd === null;
		const isStarted = this.timerStart !== null;
		return html` <style>
				.container {
					grid-row-gap: ${40 / this.numberOfColumns}vw;
					grid-template-columns: repeat(${this.numberOfColumns}, 1fr);
				}
			</style>
			<score-board
				.bonus="${this.bonusPoints}"
				.clicks="${this.clicks}"
				.score="${this.kindTotals}"
				.timer="${this.timer}"
				class="${isPlaying ? 'playing' : 'stopped'} ${isStarted ? 'started' : 'notstarted'}"
			></score-board>
			${!isStarted || isPlaying
				? html`<div class="container" @click="${this.handleClick}">
						${this.sprites.map(
							(sprite) =>
								html`<sprite-comp
									.columns="${this.numberOfColumns}"
									.observer="${this.observer}"
									.isCollectible="${sprite.isCollectible}"
									.rotatability="${this.rotationPercentage}"
									>${sprite.kind}</sprite-comp
								>`,
						)}
				  </div>`
				: null}
			${this.isFlashing ? html`<div id="halo"></div>` : null}`;
	}
}

export default Scroller;
