import Game from '../model/Game';
import EventDispathcer from '../components/EventDispatcher';
import {default as Player} from '../model/Player';
import {default as GameState} from '../model/GameState';
import {default as Result} from '../model/Result';

export default class GameController extends EventDispathcer {
	constructor() {
		super();
		/** @private {Game} */
		this._game = null;
		/** @private {Player} */
		this._player = null;
	}

	/**
	 * @param {Game} game
	 */
	initGame(game) {
		this._game = game;
		this._player = game.currentPlayer();

		this.invalidate();
	}

	/**
	 * @return {boolean}
	 */
	isPlayingAvailable() {
		return this._game && (this._game.state() == GameState.PLAYING || this._game.state() == GameState.READY);
	}

	/**
	 * @param {number} row
	 * @param {number} col
	 */
	setStep(row, col) {
		if (!this.isPlayingAvailable())
		{
			return;
		}

		const size = this._game.fieldSize();
		const isCorrectRowValue = (0 <= row && row < size);
		const isCorrectColumnValue = (0 <= col && col < size);
		if (!(isCorrectRowValue && isCorrectColumnValue))
		{
			throw new Error(`Step is contains invalid value: ${step}`);
		}

		this._invalidateField(row, col, this._player );
		this.invalidate();
	}

	invalidate() {
		if (!this._game.startTime() && (this._game.state() == GameState.PLAYING))
		{
			this._game.setStartTime(Date.now());
		}

		this._updateGameState();
		this._updateResult();
	}

	/** @private */
	_updateGameState() {
		let state = GameState.READY;
		if (!this._game.opponent())
		{
			state = GameState.WAIT;
		}
		else if (this._game.result())
		{
			state = GameState.DONE;
		}
		else
		{
			const field = this._game.fieldData();
			for(const row of field)
			{
				for(const item of row)
				{
					if (item)
					{
						state = GameState.PLAYING;
						break;
					}
				}
			}
		}
		this._game.setState(state);
	}

	/** @private */
	_updateResult() {
		const checkValue = this._checkWinner();
		let result = null;
		if (checkValue.check)
		{
			const value = checkValue.value;
			result = (Player.OWNER == value) ? Result.OWNER : Result.OPPONENT;
		}
		else if (this._game.isFilledField())
		{
			result = Result.DRAW;
		}

		if (result)
		{
			this._game.setResult(result);
			this._game.setState(GameState.DONE);
		}
	}

	/**
	 * @return {{check: boolean, value: (string|undefined)}}
	 * @private
	 */
	_checkWinner() {
		const field = this._game.fieldData();
		const size = this._game.fieldSize();

		const checkMainDiagonal = () => {
			const startSymbol = field[0][0];
			if (!startSymbol)
			{
				return { check: false};
			}
			let isMatches = true;
			for (let i = 1; i < size; ++i)
			{
				if (startSymbol != field[i][i])
				{
					isMatches = false;
					break;
				}
			}
			return { check: isMatches, value: startSymbol};
		};
		const checkSecondaryDiagonal = () => {
			const startSymbol = field[size - 1][0];
			if (!startSymbol)
			{
				return { check: false};
			}
			let isMatches = true;
			for (let i = 1; i < size; ++i)
			{
				if (startSymbol != field[(size - 1) - i][i])
				{
					isMatches = false;
					break;
				}
			}

			return { check: isMatches, value: startSymbol};
		};
		const checkHorizontal = () => {
			let result = { check: false };
			for (let row = 0; row < size; ++row)
			{
				const startSymbol = field[row][0];
				if (!startSymbol)
				{
					continue;
				}
				let isMatches = true;
				for (let column = 0; column < size; ++column)
				{
					if (startSymbol != field[row][column])
					{
						isMatches = false;
						break;
					}
				}
				if (isMatches)
				{
					result = { check: isMatches, value: startSymbol};
					break;
				}
			}
			return result;
		};
		const checkVertical = () => {
			let result = { check: false };
			for (let column = 0; column < size; ++column)
			{
				const startSymbol = field[0][column];
				if (!startSymbol)
				{
					continue;
				}
				let isMatches = true;
				for (let row = 0; row < size; ++row)
				{
					if (startSymbol != field[row][column])
					{
						isMatches = false;
						break;
					}
				}
				if (isMatches)
				{
					result = { check: isMatches, value: startSymbol};
					break;
				}
			}
			return result;
		};

		const checkSecondaryDiagonalValue = checkSecondaryDiagonal();
		const checkMainDiagonalValue = checkMainDiagonal();
		const checkHorizontalValue = checkHorizontal();
		const checkVerticalValue = checkVertical();

		let checkValue = {check: false};
		if (checkSecondaryDiagonalValue.check)
		{
			checkValue = checkSecondaryDiagonalValue;
		}
		else if (checkMainDiagonalValue.check)
		{
			checkValue = checkMainDiagonalValue;
		}
		else if (checkHorizontalValue.check)
		{
			checkValue = checkHorizontalValue;
		}
		else if (checkVerticalValue.check)
		{
			checkValue = checkVerticalValue;
		}
		return  checkValue;
	}

	/**
	 * @param {number} row
	 * @param {number} column
	 * @param {string} value
	 * @private
	 */
	_invalidateField(row, column, value) {
		const field = this._game.fieldData();
		if (field[row][column] != "")
		{
			return;
		}
		field[row][column] = value;
		this._player = (this._player == Player.OWNER) ? Player.OPPONENT: Player.OWNER;
		this._game.setCurrentPlayer(this._player);

		this._game.setFieldData(field);
	}
}