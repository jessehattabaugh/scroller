import { LitElement, html, css } from 'https://cdn.skypack.dev/lit-element';

class Sprite extends LitElement {
	static get styles() {
		return css`
			:host {
				justify-self: center;
				transform: scale(4);
				user-select: none;
			}
			:host(.collected) {
				animation-direction: alternate;
				animation-duration: 1s;
				animation-iteration-count: 1;
				animation-name: collected;
				opacity: 0.15;
				transition-duration: 1s;
				transition-property: opacity;
				transition-timing-function: cubic-bezier(0.6, -0.28, 0.74, 0.05);
			}
			@keyframes collected {
				50% {
					transform: scale(8) rotate(360deg);
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
		};
	}

	connectedCallback() {
		super.connectedCallback();

		if (this.isCollectible) {
			this.observer.observe(this);
		}

		//console.log('👾 sprite connected');
	}

	render() {
		return html`<style>
				:host {
					font-size: ${20 / this.columns}vw;
				}</style
			><slot>${this.kind}</slot>`;
	}
}

export default Sprite;
