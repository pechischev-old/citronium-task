class Component {
    constructor(args = []) {
        const {className, tagName} = args;

        this.container = this._createElement((tagName || "div"), className);
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