import { LitElement, html, css } from 'https://cdn.skypack.dev/lit-element';

class Sprite extends LitElement {
	static get styles() {
		return css`
			:host {
				font-size: 13vw;
				justify-self: center;
			}
			:host(.collected) {
				opacity: .25;
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
