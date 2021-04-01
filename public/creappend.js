export function creappend(tagName, parent) {
	const element = document.createElement(tagName);
	parent.appendChild(element);
	return element;
}
