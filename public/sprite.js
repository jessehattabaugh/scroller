import { LitElement, html, css } from 'https://cdn.skypack.dev/lit-element';

class Sprite extends LitElement {
	static get styles() {
		return css`
			:host {
				justify-self: center;
				transform: scale(4);
				font-size: 4vw;
			}
			:host(.collected) {
				transition-property: opacity;
				transition-duration: 1s;
				transition-timing-function: cubic-bezier(0.6, -0.28, 0.74, 0.05);
				opacity: 0.15;

				animation-name: collected;
				animation-duration: 1s;
				animation-iteration-count: 1;
				animation-direction: alternate;

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
		return html`<slot>${this.kind}</slot>`;
	}
}

export default Sprite;
