import Component from '../components/Component';
import Game from '../model/Game';
import FieldItemView from './FieldItemView';
import GameController from '../controller/GameController';
import {default as Player} from '../model/Player';

const OWNER_MODIFIER = "cross";
const OPPONENT_MODIFIER = "circle";
const FIELD_ITEM_SIZE = 82;
const CONTENT_WIDTH = 535;

export default class GamePageView extends Component {
	/**
	 * @param {GameController} gameController
	 */
	constructor(gameController) {
		super({container: document.getElementById("game")});

		const button = new Component({container: document.getElementById("back-button")});
		button.listen("click", () => {
			this.dispatch("showGamesList");
		});
		/** @private {?Game} */
		this._game = null;
		/** @private {GameController} */
		this._gameController = gameController;

		/** @private {Player} */
		this._player = Player.OWNER;

		/** @private {Component} */
		this._ownerField = new Component({container: document.getElementsByClassName("owner")[0]});
		/** @private {Component} */
		this._opponentField = new Component({container: document.getElementsByClassName("opponent")[0]});
		/** @private {Component} */
		this._field = new Component({container: document.getElementById("field")});
	}

	/**
	 * @param {!Game} game
	 */
	initGame(game) {
		this._game = game;
		this._gameController.initGame(game);
		this.updatePage(game);
	}

	/**
	 * @param {!Game} game
	 */
	updatePage(game) {
		this._clearPage();

		this._ownerField.setTextContent(game.owner().name());

		const opponent = game.opponent();
		if (opponent)
		{
			this._opponentField.setTextContent(opponent.name());
		}

		const activeClass = "user_active";
		this._ownerField.toggleClassName(activeClass, (this._game.currentPlayer() == Player.OWNER));
		this._opponentField.toggleClassName(activeClass, (this._game.currentPlayer() == Player.OPPONENT));

		this._createField();

		// TODO: вернуть после внесения изменений по обновлению состояния игры
		//this.toggleClassName("game_invalid", this._gameController.isPlayingAvailable())
	}

	/** @private */
	_createField() {
		const size = this._game.fieldSize();
		const data = this._game.fieldData();

		const width = size * FIELD_ITEM_SIZE;

		if (width > CONTENT_WIDTH)
		{
			this._field.container.setAttribute("style", `right: ${(width - CONTENT_WIDTH) / 2}px`)
		}

		this._field.setWidth(size * FIELD_ITEM_SIZE);
		this._field.setHeight(size * FIELD_ITEM_SIZE);

		for (let row = 0; row < size; ++row)
		{
			for (let column = 0; column < size; ++column)
			{
				const modifier = this._getFieldModifierByCoordinate(row, column);
				const item = this._createFieldItem(row, column, modifier);
				const value = data[row][column];
				let typeIcon = "";
				switch (value)
				{
					case Player.OWNER:
						typeIcon = OWNER_MODIFIER;
						break;
					case Player.OPPONENT:
						typeIcon = OPPONENT_MODIFIER;
						break;
				}
				item.setTypeIcon(typeIcon);
				this._field.addChild(item);
			}
		}
	}

	/**
	 * @param {number} row
	 * @param {number} col
	 * @returns {string|null}
	 * @private
	 */
	_getFieldModifierByCoordinate(row, col) {
		const size = this._game.fieldSize();
		if (row == 0)
		{
			if (col == 0)
			{
				return "left-top";
			}
			else if (col == size - 1)
			{
				return "right-top";
			}
			else
			{
				return "top";
			}
		}
		else if (row == size - 1)
		{
			if (col == 0)
			{
				return "left-bottom";
			}
			else if (col == size - 1)
			{
				return "right-bottom";
			}
			else
			{
				return "bottom";
			}
		}
		else
		{
			if (col == 0)
			{
				return "left";
			}
			else if (col == size - 1)
			{
				return "right";
			}
		}
		return null;
	}

	/**
	 * @param {number} row
	 * @param {number} column
	 * @param {string=} modifier
	 * @return {!FieldItemView}
	 * @private
	 */
	_createFieldItem(row, column, modifier = "") {
		const coordinate = {row, column};
		const item = new FieldItemView(coordinate, modifier);
		item.listen("click", this._onItemClick.bind(this, item));
		return item;
	}

	/**
	 * @param {FieldItemView} item
	 * @private
	 */
	_onItemClick(item) {
		const {row, column} = item.coordinate();
		this._gameController.setStep(row, column);
	}

	/** @private */
	_clearPage() {
		this._field.removeChildren();
		this._field.container.setAttribute("style", "");
		this._ownerField.setTextContent("");
		this._opponentField.setTextContent("");
	}
};