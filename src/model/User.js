export default class User {
    /**
     * @param {string} name
     */
    constructor(name) {
        /** @private {string} */
        this._name = name;
    }

    /**
     * @return {string}
     */
    name() {
        return this._name;
    }
}