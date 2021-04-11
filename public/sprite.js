import { LitElement, html, css } from 'https://cdn.skypack.dev/lit-element';

class Sprite extends LitElement {
	static get styles() {
		return css`
			:host {
				backface-visibility: hidden; /* prevents blurry emojis */
				justify-self: center;
				text-shadow: 0 0.05em 0.08em rgba(0, 0, 0, 0.5);
				user-select: none;
			}
			:host(.collected) div {
				animation-direction: alternate;
				animation-duration: 1s;
				animation-iteration-count: 1;
				animation-name: collected;
				animation-timing-function: ease-in-out;
				opacity: 0.15;
			}
			@keyframes collected {
				0% {
					opacity: 1;
				}
				50% {
					transform: translateY(0.35em) rotate(1turn) scale(3);
				}
				75% {
					opacity: 1;
				}
			}
			span {
				font-weight: bold;
				left: 0;
				margin-top: 0.25em;
				position: absolute;
				text-align: center;
				top: 0;
				width: 100%;
			}
			.win {
				color: yellow;
			}
			.loss {
				color: red;
			}
		`;
	}
	static get properties() {
		return {
			bonusPoints: {type: Number},
			columns: { type: Number },
			isCollected: { type: Boolean },
			isCollectible: { type: Boolean },
			observer: { type: Object, attribute: false },
			rotatability: { type: Number },
			sizeVariability: { type: Number },
		};
	}

	constructor() {
		super();
		this.bonusPoints = 0;
	}

	connectedCallback() {
		super.connectedCallback();
		if (this.isCollectible) {
			this.observer.observe(this);
		}

		this.fontSize = `${40 / this.columns}vw`;

		const randomRotation = Math.random();
		const rotationFactor = randomRotation * this.rotatability;
		this.rotation =
			randomRotation == 0 ? 0 : Math.random() < 0.5 ? -rotationFactor : rotationFactor;

		this.scale = Math.random() * (this.sizeVariability * 3) + 1.25;
	}

	render() {
		return html`<style>
				:host {
					font-size: ${this.fontSize};
					transform: translateY(0.35em) rotate(${this.rotation}turn) scale(${this.scale});
				}
			</style>
			<div><slot>${this.kind}</slot></div>
			${this.isCollected
				? html`<span class="${Math.sign(this.bonusPoints) === 1 ? 'win' : 'loss'}"
						>${this.bonusPoints}</span>`
				: null}`;
	}
}

export default Sprite;
