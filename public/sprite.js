import { LitElement, html, css } from 'https://cdn.skypack.dev/lit-element';

class Sprite extends LitElement {
	static get styles() {
		return css`
			:host {
				backface-visibility: hidden; /* prevents blurry emojis */
				justify-self: center;
				user-select: none;
				text-shadow: 0 0.1em 0.2em rgba(0,0,0,0.5);
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
					transform: scale(4) rotate(360deg);
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
			observer: { type: Object, attribute: false },
			isCollectible: { type: Boolean },
			isCollected: { type: Boolean },
			rotatability: { type: Number },
		};
	}

	connectedCallback() {
		super.connectedCallback();
		if (this.isCollectible) {
			this.observer.observe(this);
		}
	}

	render() {
		return html`<style>
				:host {
					font-size: ${40 / this.columns}vw;
					transform:
						scale(2)
						translateY(0.25em)
						rotate(
							${Math.random() < 0.5 ? '-' : ''}${Math.random() *
							this.rotatability}turn
						);
				}</style
			><slot>${this.kind}</slot>`;
	}
}

export default Sprite;
