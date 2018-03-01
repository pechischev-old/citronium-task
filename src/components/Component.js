import EventDispatcher from './EventDispatcher';

export default class Component extends EventDispatcher {
	constructor(args = {}) {
		super();
		const {className, tagName, container} = args;

		this.container = container || this._createElement((tagName || "div"), className);

		this._width = 0;
		this._height = 0;
	}

	addChild(child) {
		const node = (child instanceof Component) ? child.container : child;
		this.container.appendChild(node);
	}

	removeChild(child) {
		if (this.container.contains(child))
		{
			this.container.removeChild(child);
		}
	}

	setWidth(width) {
		this._width = width;
		this.container.style.width = `${width}px`;
	}

	setHeight(height) {
		this._height = height;
		this.container.style.height = `${height}px`;
	}

	/**
	 * @param {Array<string>|string} classNames
	 */
	addClassNames(classNames) {
		if ((classNames instanceof Array && classNames.length) || classNames)
		{
			this.container.classList.add(classNames);
		}
	}

	/**
	 * @param {string} className
	 * @returns {boolean}
	 */
	hasClassName(className) {
		return this.container.classList.contains(className);
	}

	/**
	 * @param {string} className
	 * @param {boolean} value
	 */
	toggleClassName(className, value) {
		this.container.classList.toggle(className, value)
	}

	/**
	 * @param {Array<string>|string} classNames
	 */
	removeClassNames(classNames) {
		if (classNames instanceof Array)
		{
			for (const name of classNames)
			{
				if (this.hasClassName(name))
				{
					this.container.classList.remove(name);
				}
			}
			return;
		}
		if (this.hasClassName(classNames))
		{
			this.container.classList.remove(classNames);
		}
	}

	setTextContent(text) {
		if (this.container.textContent != "undefined")
		{
			this.container.textContent = text;
		}
		else
		{
			this.container.value = text;
		}
	}

	removeChildren() {
		while(this.container.firstChild)
		{
			this.removeChild(this.container.firstChild);
		}
	}

	/**
	 * @param {boolean} value
	 */
	setVisible(value) {
		this.container.style.display = (value) ? "" : "none";
	}

	/**
	 * @param {string} eventType
	 * @param {function(event):*} handler
	 */
	listen(eventType, handler) {
		this.container.addEventListener(eventType, handler);
	}

	/**
	 * @param {string} eventType
	 * @param {function(event):*} handler
	 */
	unlisten(eventType, handler) {
		this.container.removeEventListener(eventType, handler);
	}

	/**
	 * @param {string} elementTag
	 * @param {string} className
	 * @param {Element} parentElement
	 * @returns {Element}
	 * @protected
	 */
	_createElement(elementTag, className, parentElement) {
		const element = document.createElement(elementTag);
		if (className)
		{
			element.setAttribute("class", className);
		}
		if (parentElement)
		{
			parentElement.appendChild(element);
		}
		return element;
	}
}