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
			:host(.collected) {
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
					transform: translateY(0.35em) rotate(1turn) scale(6);
				}
				75% {
					opacity: 1;
				}
			}
		`;
	}
	static get properties() {
		return {
			columns: { type: Number },
			isCollected: { type: Boolean },
			isCollectible: { type: Boolean },
			observer: { type: Object, attribute: false },
			rotatability: { type: Number },
			sizeVariability: { type: Number },
		};
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
				}</style
			><slot>${this.kind}</slot>${this.isCollected
				? html`<span>${this.bonusPoints}</span>`
				: null}`;
	}
}

export default Sprite;
