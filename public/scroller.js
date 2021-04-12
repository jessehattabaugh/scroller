import { LitElement, html, css } from 'https://cdn.skypack.dev/lit-element';

import shuffle from 'https://cdn.skypack.dev/shuffle-array';
import emojisList from 'https://cdn.skypack.dev/emojis-list';

import ScoreBoard from './scoreboard.js';
customElements.define('score-board', ScoreBoard);

import Sprite from './sprite.js';
customElements.define('sprite-comp', Sprite);

import themes from './themes.js';

class Scroller extends LitElement {
	static get properties() {
		return {
			clicks: { type: Number },
			isFlashing: { type: Boolean },
			isWinning: { type: Boolean },
			numberOfKindsOfBadGuys: { type: Number },
			numberOfKindsOfCollectibles: {type: Number},
			numberOfColumns: { type: Number },
			numberOfSprites: { type: Number },
			ratioOfCollectibles: { type: Number },
			rotationPercentage: { type: Number },
			sizeVariability: { type: Number },
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
				display: grid;
			}
			#halo {
				background-image: linear-gradient(to right top, #d16ba5, #8aa7ec, #5ffbf1);
				flex: 1;
				outline-color: transparent;
				outline-offset: -2em;
				outline-style: solid;
				outline-width: 2em;
				overflow-x: hidden;
				overflow-y: scroll;
				transition: 2s outline-color ease-out;
			}
			#halo.winning {
				outline-color: rgba(255, 255, 255, 0.75);
				transition: none;
			}
			#halo.losing {
				outline-color: rgba(255, 0, 0, 0.75);
				transition: none;
			}
		`;
	}

	constructor() {
		super();
		this.badGuyTotals = {};
		this.bonusPoints = 0;
		this.clicks = 0;
		this.collected = [];
		this.intersected = [];
		this.isFlashing = false;
		this.isWinning = true; /* winning by default */
		this.kindTotals = {};
		this.rotationPercentage = null;
		this.sizeVariability = null;
		this.sprites = [];
		this.timerEnd = null;
		this.timerStart = null;

		this.observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						//console.log('👀 collectible came into view', entry.target.innerText);
						this.intersected.push(entry.target);
					} else {
						//console.log('🙈 collectible became hidden', entry.target.innerText);
						delete this.intersected[this.intersected.indexOf(entry.target)];
					}
				});
			},
			{ threshold: 0.25 },
		);
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
		let badGuyKinds = [];
		for (let i = 0; i < this.numberOfKindsOfBadGuys; i++) {
			badGuyKinds.push(shuffle.pick(themes[this.theme].avoidable));
		}
		for (let i = 0; i < numberOfBadGuys; i++) {
			const kind = shuffle.pick(badGuyKinds);
			this.sprites.push({ kind: kind, isCollectible: true, isBad: true });
			this.badGuyTotals[kind] = (this.badGuyTotals[kind] || 0) + 1;
		}
		console.log(`😈 watch out for bad guys `, this.badGuyTotals);

		// collectible sprites
		const numberOfCollectibles = this.numberOfSprites * this.ratioOfCollectibles;
		let collectibleKinds = [];
		for (let i = 0; i < this.numberOfKindsOfCollectibles; i++) {
			collectibleKinds.push(shuffle.pick(themes[this.theme].collectible)); // TODO check to make sure it's not a duplicate
		}
		for (let i = 0; i < numberOfCollectibles; i++) {
			const kind = shuffle.pick(collectibleKinds);
			this.sprites.push({ kind: kind, isCollectible: true });
			this.kindTotals[kind] = (this.kindTotals[kind] || 0) + 1; // TODO rename this.kindTotals to this.score
		}
		console.log(`🔎 collect all of these! `, this.kindTotals);

		// uncollectible sprites TODO rename "uncollectible" to "ordinary"
		const numberOfUncollectibles =
			this.numberOfSprites - (numberOfCollectibles + numberOfBadGuys);
		const numberOfUncollectibleKinds = 10; // TODO make this a property
		const uncollectibleKinds = [];
		for (let i = 0; i < numberOfUncollectibleKinds; i++) {
			uncollectibleKinds.push(shuffle.pick(themes[this.theme].ordinary)); // TODO check to make sure it's not a duplicate
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
				if (themes[this.theme].avoidable.includes(sprite.innerText)) {
					if (!sprite.classList.contains('collected')) {
						// bad guy got them!
						console.log(`😱 bad guy got you! -5 bonus points`);
						this.bonusPoints -= 5;
						sprite.bonusPoints = -5;
					}
				} else {
					this.collected.push(sprite);

					// more sprites more bonus!
					numberFoundThisClick++; // more bonus next time!
					this.bonusPoints += numberFoundThisClick;
					sprite.bonusPoints = numberFoundThisClick;

					// reduce the tally in the scoreboard
					console.log(
						`🍄 you collected a ${sprite.innerText} and got ${numberFoundThisClick} bonus points`,
					);
					this.kindTotals[sprite.innerText]--;
				}

				// make the sprite fade away
				sprite.isCollected = true;
				sprite.classList.add('collected'); // this seems dangerous but it works...

				// end the game when there are none left to find
				const leftToFind = Object.values(this.kindTotals).reduce((a, b) => a + b);
				if (!leftToFind) {
					console.log(`🎉 none left to find!`, leftToFind);
					this.timerEnd = new Date().getTime();
				}
			}
		}
		const totalBonusPoints = this.bonusPoints - bonusPointsBefore;
		this.isWinning = Math.sign(totalBonusPoints) === 1;
		console.log(
			`⭐ got ${totalBonusPoints} bonus points total ${
				this.isWinning ? '🏆winning' : '💀losing'
			}`,
		);

		this.isFlashing = true;
		setTimeout(() => (this.isFlashing = false), 500);
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
				.baddies="${this.badGuyTotals}"
				.timer="${this.timer}"
				class="${isPlaying ? 'playing' : 'stopped'} ${isStarted ? 'started' : 'notstarted'}"
			></score-board>
			${!isStarted || isPlaying
				? html`<div
						id="halo"
						class="${this.isFlashing ? (this.isWinning ? 'winning' : 'losing') : ''}"
				  >
						<div class="container" @click="${this.handleClick}">
							${this.sprites.map(
								(sprite) =>
									html`<sprite-comp
										.columns="${this.numberOfColumns}"
										.isCollectible="${sprite.isCollectible}"
										.observer="${this.observer}"
										.rotatability="${this.rotationPercentage}"
										.sizeVariability="${this.sizeVariability}"
										>${sprite.kind}</sprite-comp
									>`,
							)}
						</div>
				  </div>`
				: null}`;
	}
}

export default Scroller;
