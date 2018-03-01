import User from './User';
import Game from './Game';

export default class Loader {
	constructor() {}

	/**
	 * @param {Object} json
	 * @return {Array<Game>}
	 */
	load(json) {
		const games = [];
		for (const gameJson of json)
		{
			const game = this._loadGame(gameJson);
			games.push(game);
		}
		return games;
	}

	/**
	 * @param {Object} json
	 * @return {Game}
	 * @private
	 */
	_loadGame(json) {
		const duration = json["gameDuration"];

		const owner = new User(json["owner"]);
		const opponent = json["opponent"] ? new User(json["opponent"]) : null;
		const game = new Game(owner, json["size"], json["field"]);
		game.setState(json["state"]);
		game.setResult(json["gameResult"]);
		game.setCurrentPlayer(json["stroke"]);

		if (opponent)
		{
			game.setOpponent(opponent);
		}
		return game;
	}
}