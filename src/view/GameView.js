import Component from '../components/Component';
import Game from '../model/Game';
import Timer from '../components/Timer';
import {default as Result} from '../model/Result';

export default class GameView extends Component {
	/**
	 * @param {Game} game
	 */
	constructor(game) {
		super({className: "game-item"});
		/** @private {Game} */
		this._game = game;

		/** @private {Component} */
		this._ownerContainer = new Component({className: "game-item__owner user"});
		this._ownerContainer.setTextContent(game.owner().name());
		this.addChild(this._ownerContainer);

		/** @private {Component} */
		this._opponentContainer = new Component({className: "game-item__opponent user"});
		const opponent = game.opponent();
		if (opponent)
		{
			this._opponentContainer.setTextContent(opponent.name());
		}
		this.addChild(this._opponentContainer);

		this._game.addEventListener("changeResult", this._onChangeResult.bind(this));

		/** @private {Component} */
		this._timeContainer = new Component({className: "game-item__time"});
		this._timeContainer.setTextContent(this._game.getGameTime());
		this.addChild(this._timeContainer);

		this._timer = new Timer();
		this._timer.addEventListener("ontick", this._onTimerTick.bind(this));
		this._timer.run();
	}

	/**
	 * @return {string}
	 */
	gameId() {
		return this._game.id();
	}

	destruct() {
		this._timer.stop();
		this._timer.removeEventListener("ontick", this._onTimerTick.bind(this));
		this._game.removeEventListener("changeResult", this._onChangeResult.bind(this));
	}

	/** @private */
	_onTimerTick() {
		this._timeContainer.setTextContent(this._game.getGameTime());
		if (this._game.isGameOver())
		{
			this._timer.stop();
		}
	}

	/** @private */
	_onChangeResult() {
		this._ownerContainer.addClassNames(this._getClassNameByResult(this._game.result()));
		this._opponentContainer.addClassNames(this._getClassNameByResult(this._game.result()));

		const className = (this._game.result() == Result.DRAW) ? "game-item_resolved" : "game-item_resolved-with-winner";
		this.addClassNames(className);
	}

	/**
	 * @param {Result} result
	 * @private
	 */
	_getClassNameByResult(result) {
		if (result == Result.DRAW)
		{
			return "";
		}
		return (result == Result.OWNER) ? "user_winner" : "user_loser";
	}
}