import Component from '../components/Component';
import Game from '../model/Game';
import User from '../model/User';
import GameView from './GameView';

export default class GamesListView extends Component {
	/**
	 * @param {Array<Game>} gamesList
	 * @param {User} user
	 */
	constructor(gamesList, user) {
		const container = document.getElementById("games-list");
		super({container});
		/** @private {Array<Game>} */
		this._gamesLizt = gamesList;
		/** @private {Array<GameView>} */
		this._gamesListView = [];
		/** @private {Component} */
		this._gamesContainer = new Component({container: document.getElementById("games-container")});
		const userContainer = new Component({container: document.getElementById("user")});
		userContainer.setTextContent(user.name());
		/** @private {Component} */
		this._addGameButton = new Component({container: document.getElementById("create-game")});
		this._addGameButton.listen("click", () => {
			this.dispatch("appendGame");
		});
	}

	/**
	 * @param {!Game} game
	 */
	appendGameView(game) {
		const gameView = new GameView(game);
		gameView.listen("click", () => {
			this.dispatch("showGamePage", {id: game.id()});
		});
		this._gamesContainer.addChild(gameView);
		this._gamesListView.push(gameView);
	}
}