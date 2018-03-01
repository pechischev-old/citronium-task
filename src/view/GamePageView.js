import Component from '../components/Component';
import Game from '../model/Game';
import FieldItemView from './FieldItemView';
import GameController from '../controller/GameController';
import Timer from '../components/Timer';
import {default as Player} from '../model/Player';
import GameState from "../model/GameState";

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

		/** @private {Component} */
		this._button = new Component({container: document.getElementById("back-button")});
		this._button.listen("click", this._onButtonClick.bind(this));
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

		/** @private {Component} */
		this._timeContainer = new Component({container: document.getElementsByClassName("time-container")[0]});

		this._timer = new Timer();
		this._timer.addEventListener("ontick", () => {
			if (!this._game)
			{
				return;
			}
			this._timeContainer.setTextContent(this._game.getGameTime());
		})
	}

	/**
	 * @param {!Game} game
	 */
	initGame(game) {
		this.destruct();

		this._game = game;
		this._game.addEventListener("changeGameState", this.invalidate.bind(this));
		this._gameController.initGame(game);
		if (!this._game.isGameOver())
		{
			this._timer.run();
		}
		this._timeContainer.setTextContent(this._game.getGameTime());

		this.updatePage(game);
		this.invalidate();
	}

	invalidate() {
		this._updateButtonText();
		if (this._game.isGameOver())
		{
			this.toggleClassName("game_invalid", true);
			return;
		}
		this.toggleClassName("game_invalid", !this._gameController.isPlayingAvailable())
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

	/** @private */
	_updateButtonText() {
		const textContainer = this._button.container.childNodes[0];
		textContainer.textContent = (this._game.isPlaying()) ? "Surrender" : "Back";
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

	/** @private */
	_onButtonClick() {
		if (this._game.isPlaying())
		{
			this._gameController.surrender();
		}

		this.dispatch("showGamesList");
		this.destruct();
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

	destruct() {
		if (this._game)
		{
			this._clearPage();
			this._game.removeEventListener("changeGameState", this.invalidate.bind(this));
			this._timer.stop();
		}
	}
};