import Component from '../components/Component';

export default class FieldItemView extends Component {
	/**
	 * @param {{
	 *    row: number,
	 *    column: number,
	 * }}coordinate
	 * @param {string=} blockName
	 */
	constructor(coordinate, blockName) {
		super({
			className: "field__item item",
		});

		this.addClassNames(`${blockName ? "field__item_" + blockName : ""}`);

		/** @private {Component} */
		this._icon = new Component({className: "item__icon"});
		this.addChild(this._icon);

		/** @private {{ row: number, column: number}} */
		this._coordinate = coordinate;
	}

	/**
	 * @param {string} type
	 */
	setTypeIcon(type) {
		if (!type)
		{
			return;
		}
		this._icon.addClassNames("item__icon_" + type);
	}

	/**
	 * @return {{row: number, column: number}}
	 */
	coordinate() {
		return this._coordinate;
	}
}