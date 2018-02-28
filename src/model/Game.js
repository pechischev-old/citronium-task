import GameState from 'GameState';
import User from 'User';

class Game {
    /**
     * @param {!User} owner
     * @param {number} size
     * @param {!Array<string>} fieldData
     */
    constructor(owner, size, fieldData = null) {
        /** @private {number} */
        this._fieldSize = size;

        /** @private {!Array<!Array<string>>} */
        this._fieldData = fieldData;

        /** @private {!GameState} */
        this._state = GameState.READY;

        /** @private {!User} */
        this._owner = owner;
        /** @private {?User} */
        this._opponent = null;
    }

    /**
     * @param {!User} opponent
     */
    setOpponent(opponent) {
        this._opponent = opponent;
        // TODO: dispatch on change opponent
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
        this._state = state;
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
        // TODO: dispatch on change data
    }

    fieldData() {
        return this._fieldData.slice();
    }

    fieldSize() {
        return this._fieldSize;
    }

}