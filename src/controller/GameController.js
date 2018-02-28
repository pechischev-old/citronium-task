import Game from '../model/Game';
import User from 'User';
import GameState from 'GameState';

const OWNER_SYMBOL = "X";
const OPPONENT_SYMBOL = "Y";

class GameController {
    /**
     * @param {!User} user
     * @param {!Game} game
     */
    constructor(user, game) {
        this._user = user;

        this._game = game;
    }

    /**
     * @param {{
     *    row: number,
     *    col: number,
     *    value: string
     * }} step
     */
    setStep(step) {
        const { row, col, value } = step;

        const size = this._game.fieldSize();
        const isCorrectRowValue = (0 <= row && row < size);
        const isCorrectColumnValue = (0 <= col && col < size);
        if (!(isCorrectRowValue && isCorrectColumnValue))
        {
            throw new Error(`Step is contains invalid value: ${step}`);
        }

        this._invalidateField(row, col, value );
    }

    invalidate() {

    }

    /**
     *
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
     * @param {number} x
     * @param {number} y
     * @param {string} value
     * @private
     */
    _invalidateField(x, y, value) {
        const field = this._game.fieldData();
        field[y][x] = value;
        this._game.setFieldData(field);
    }
}