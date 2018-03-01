import Game from '../model/Game';
import EventDispathcer from '../components/EventDispatcher';
import {default as Player} from '../model/Player';
import {default as GameState} from '../model/GameState';

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

		this._updateStateGame();
    }

	/**
	 * @return {boolean}
	 */
	isPlayingAvailable() {
	    return this._game && (this._game.state() != GameState.PLAYING || this._game.state() != GameState.READY);
    }

	/**
	 * @param {number} row
	 * @param {number} col
	 */
	setStep(row, col) {
        if (this.isPlayingAvailable())
        {
        	// TODO: вернуть эту опцию
            //return;
        }
        const size = this._game.fieldSize();
        const isCorrectRowValue = (0 <= row && row < size);
        const isCorrectColumnValue = (0 <= col && col < size);
        if (!(isCorrectRowValue && isCorrectColumnValue))
        {
            throw new Error(`Step is contains invalid value: ${step}`);
        }

		this._game.setState(GameState.PLAYING);
        this._invalidateField(row, col, this._player );
    }

    invalidate() {

    }

	/**
	 * @private
	 */
    _updateStateGame() {
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
				for(const column of row)
				{
					if (field[row][column])
					{
						state = GameState.PLAYING;
						break;
					}
				}
			}
		}
		this._game.setState(state);
    }

    /**
     * @private
     */
    _checkWinner() {
        const field = this._game.fieldData();
        const size = this._game.fieldSize();

        const checkMainDiagonal = () => {
            const startSymbol = field[0][0];
            let isMatches = true;
            for (const i of size)
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
            let isMatches = true;
            for (let i = size - 1; i >= 0; --i)
            {
                if (startSymbol != field[i][(size - 1) - i])
                {
                    isMatches = false;
                    break;
                }
            }
            return { check: isMatches, value: startSymbol};
        };

        for (let row = 0; row < size; ++row)
        {
            const startSymbol = field[row][0];
            for (let column = 0; column < size; ++column)
            {
                if (startSymbol != field[row][column])
                {
                    break;
                }
            }
        }
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