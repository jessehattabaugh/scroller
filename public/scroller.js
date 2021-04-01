import shuffle from 'https://cdn.skypack.dev/shuffle-array';

console.log('🥾');

class Scroller extends HTMLElement {
	static get observedAttributes() {
		return ['foo', 'bar'];
	}

	constructor() {
		super();
		console.log('🚧');

		const shadow = this.attachShadow({ mode: 'open' });

		const style = document.createElement('style');
		style.innerText = `
			:host {
				all: initial;
				contain: content;
				display: grid;
				grid-template-columns: repeat(10, 1fr);
			}

			div {
				justify-self: center;
				margin: 1em;
				font-size: 3vw;
			}
		`;
		shadow.appendChild(style);

		const sprites = [];

		// create some number of collectible sprites
		const someNumber = 10;
		const collectibleKinds = [`🎅`, `🤶`];
		for (let i = 0; i < someNumber; i++) {
			sprites.push({ kind: shuffle.pick(collectibleKinds), isCollectible: true});
		}

		// create some other number of uncollectible sprites
		const someOtherNumber = 1000;
		const otherKinds = [
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
		for (let i = 0; i < someOtherNumber; i++) {
			sprites.push({kind: shuffle.pick(otherKinds), isCollectible: false});
		}

		// randomize them and add them to the shadow root
		shuffle(sprites);
		for (let i = 0, n = sprites.length; i < n; i++) {
			const el = document.createElement('div');
			el.innerText = sprites[i].kind;
			if(sprites[i].isCollectible) {
				el.addEventListener('click', () => {
					alert('you found me!');
				});
			}
			shadow.appendChild(el);
		}

	}

	handleScroll() {
		console.log('📜', window.scrollY);
	}

	connectedCallback() {
		console.log('🍾');
		document.addEventListener('scroll', this.handleScroll);
	}

	disconnectedCallback() {
		console.log('🔌');
		document.removeEventListener('scroll', this.handleScroll);
	}

	adoptedCallback() {
		console.log('🤱');
	}

	attributeChangedCallback(name, oldValue, newValue) {
		console.log('📶', name, oldValue, newValue);
	}
}

export default Scroller;
