console.log('🥾');

class Scroller extends HTMLElement {

	static get observedAttributes() {
		return ['foo', 'bar'];
	}

	constructor() {
		super();
		console.log('🚧');

		const shadow = this.attachShadow({mode: 'open'});

		for (let i = 0; i < 1000; i++) {
			const div = document.createElement('div');
			div.innerText = '👋';
			shadow.appendChild(div);
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
