import User from './User';
import EventDispatcher from '../components/EventDispatcher';
import {default as Player} from './Player';
import {default as Result} from './Result';
import {default as GameState} from './GameState';

export default class Game extends EventDispatcher {
	/**
	 * @param {!User} owner
	 * @param {number} size
	 * @param {!Array<string>} fieldData
	 */
	constructor(owner, size, fieldData = null) {
		super();
		/** @private {string} */
		this._id = 'id-' + Math.random().toString(36).substr(2, 16);

		/** @private {number} */
		this._fieldSize = size;

		/** @private {!Array<!Array<string>>} */
		this._fieldData = fieldData ? fieldData : this._initField();

		/** @private {!GameState} */
		this._state = GameState.READY;
		/** @private {!Result} */
		this._result = null;

		/** @private {!User} */
		this._owner = owner;
		/** @private {?User} */
		this._opponent = null;
		/** @private {Player} */
		this._currentPlayer = Player.OWNER;
		/** @private {number} */
		this._startTime = null;
		/** @private {number} */
		this._durationTime = null;
	}

	/**
	 * @param {number} time
	 */
	setStartTime(time) {
		this._startTime = time;
	}

	/**
	 * @return {number}
	 */
	duration() {
		return this._durationTime;
	}

	/**
	 * @return {number}
	 */
	startTime() {
		return this._startTime;
	}

	/**
	 * @return {string}
	 */
	getGameTime() {
		if (!this._startTime)
		{
			return "00:00:00";
		}
		this._durationTime = this.isGameOver() ? this._durationTime : Date.now() - this._startTime;
		const time = new Date(this._durationTime);

		const formatTime = (time) => {
			if (time < 10)
			{
				return `0${time}`;
			}
			return time;
		};

		return `00:${formatTime(time.getMinutes())}:${formatTime(time.getSeconds())}`;
	}

	/**
	 * @return {boolean}
	 */
	isGameOver() {
		return (this._state == GameState.DONE);
	}

	/**
	 * @returns {Result}
	 */
	result() {
		return this._result;
	}

	/**
	 * @return {boolean}
	 */
	isFilledField() {
		for (const row of this._fieldData)
		{
			for (const item of row)
			{
				if (!item)
				{
					return false;
				}
			}
		}
		return true;
	}

	/**
	 * @param {Result} result
	 */
	setResult(result) {
		if (!this._result)
		{
			this._result = result;
			this.dispatch("changeResult");
		}
	}

	/**
	 * @param {Player} player
	 */
	setCurrentPlayer(player) {
		if (this._currentPlayer != player)
		{
			this._currentPlayer = player;
		}
	}

	/**
	 * @return {Player}
	 */
	currentPlayer() {
		return this._currentPlayer;
	}

	/**
	 * @return {string}
	 */
	id() {
		return this._id;
	}

	/**
	 * @param {!User} opponent
	 */
	setOpponent(opponent) {
		this._opponent = opponent;
		this.dispatch("changeOpponent");
	}

	/**
	 * @returns {?User}
	 */
	opponent() {
		return this._opponent;
	}

	/**
	 * @returns {!User}
	 */
	owner() {
		return this._owner;
	}

	/**
	 * @param {!GameState} state
	 */
	setState(state) {
		if (this._state != state)
		{
			this._state = state;
			this.dispatch("changeGameState");
		}
	}

	/**
	 * @return {!GameState}
	 */
	state() {
		return this._state
	}

	/**
	 * @param data
	 */
	setFieldData(data) {
		this._fieldData = data;
		this.dispatch("updateFieldData");
	}

	fieldData() {
		return this._fieldData.slice();
	}

	fieldSize() {
		return this._fieldSize;
	}

	/**
	 * @return {!Array<!Array<string>>}
	 * @private
	 */
	_initField() {
		const field = [];
		for(let i = 0; i < this._fieldSize; ++i)
		{
			const row = [];
			for(let j = 0; j < this._fieldSize; ++j)
			{
				row.push("");
			}
			field.push(row);
		}
		return field;
	}
}