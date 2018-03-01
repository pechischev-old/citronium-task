import GamesListView from '../view/GamesListView';
import GamePageView from '../view/GamePageView';
import GameController from '../controller/GameController';
import User from '../model/User';
import Game from '../model/Game';

export default class Presenter {
	/**
	 * @param {User} user
	 * @param {Array<Game>} games
	 */
	constructor(user, games) {
		/** @private {Array<Game>} */
		this._gamesList = games || [];
		/** @private {User} */
		this._user = user;

		/** @private {GameController} */
		this._gameController = new GameController();
		/** @private {GamesListView} */
        this._gamesListView = new GamesListView(this._gamesList, user);
		this._gamesListView.addEventListener("appendGame", () => {
			let size;
			while (!size)
			{
				size = prompt("Enter field size", 3);
			}
		    this.createNewGame({user: this._user, size});
		});
		this._gamesListView.addEventListener("showGamePage", (event) => {
			this.showGamePage(event.target.id);
		});
		/** @private {GamePageView} */
		this._gamePageView = new GamePageView(this._gameController);
		this._gamePageView.setVisible(false);
		this._gamePageView.addEventListener("showGamesList", () => {
			this.showGamesListPage();
		});

		this._init();
	}

	/** @private */
	_init() {
		for (const game of this._gamesList)
		{
			this._appendGame(game);
		}
	}

	/**
	 * @param {Game} game
	 * @private
	 */
	_appendGame(game) {
		game.addEventListener("updateFieldData", () => {
			this._gamePageView.updatePage(game);
		});
		this._gamesListView.appendGameView(game);
	}

	start() {
		this._gamesListView.invalidate();
	}

	/**
	 * @param {Object} data
	 */
    createNewGame(data) {
		const {user, size, field} = data;
		const game = new Game(user, size, field);
		this._appendGame(game);
		this._gamesList.push(game);
    }

    showGamePage(id) {
		const game = this._gamesList.find((game) => game.id() == id);
		if (game)
        {
			if (game.owner().name() != this._user.name() && !game.opponent())
			{
				game.setOpponent(this._user);
			}
			this._gamesListView.setVisible(false);
			this._gamePageView.setVisible(true);
			this._gamePageView.initGame(game);
        }
    }

    showGamesListPage() {
		this._gamesListView.setVisible(true);
		this._gamePageView.setVisible(false);
    }

	/**
	 * @param {string} id
	 */
	removeGame(id) {
        const index = this._gamesList.findIndex((game) => game.id() == id);
        if (index == -1)
        {
            return;
        }
		this._gamesList.splice(index, 1);
		this._gamesListView.invalidate();
    }
}