import Component from '../components/Component';
import Game from '../model/Game';
import User from '../model/User';
import GameView from './GameView';
import {default as CustomEvents} from '../event/CustomEvents';
import {default as Events} from '../event/Events';

export default class GamesListView extends Component {
	/**
	 * @param {User} user
	 */
	constructor(user) {
		const container = document.getElementById("games-list");
		super({container});
		/** @private {Array<GameView>} */
		this._gamesListView = [];
		/** @private {Component} */
		this._gamesContainer = new Component({container: document.getElementById("games-container")});
		const userContainer = new Component({container: document.getElementById("user")});
		userContainer.setTextContent(user.name());
		/** @private {Component} */
		this._addGameButton = new Component({container: document.getElementById("create-game")});
		this._addGameButton.listen(Events.CLICK, () => {
			this.dispatch(CustomEvents.APPEND_GAME);
		});
	}

	/**
	 * @param {Game} game
	 */
	appendGameView(game) {
		const gameView = new GameView(game);
		gameView.listen(Events.CLICK, () => {
			this.dispatch(CustomEvents.SHOW_GAME_PAGE, {id: game.id()});
		});
		this._gamesContainer.addChild(gameView);
		this._gamesListView.push(gameView);
	}
}