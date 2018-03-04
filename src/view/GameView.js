import Component from '../components/Component';
import Game from '../model/Game';
import Timer from '../components/Timer';
import {default as Result} from '../model/Result';
import {default as Events} from '../event/Events';
import {default as CustomEvents} from '../event/CustomEvents';

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

		this._game.addEventListener(CustomEvents.CHANGE_GAME_RESULT, this._onChangeResult.bind(this));

		/** @private {Component} */
		this._timeContainer = new Component({className: "game-item__time"});
		this._timeContainer.setTextContent(this._game.getGameTime());
		this.addChild(this._timeContainer);

		this._timer = new Timer();
		this._timer.addEventListener(Events.TICK, this._onTimerTick.bind(this));
		this._timer.run();

		this._onChangeResult();
	}

	/**
	 * @return {string}
	 */
	gameId() {
		return this._game.id();
	}

	destroy() {
		this._timer.stop();
		this._timer.removeEventListener(Events.TICK, this._onTimerTick.bind(this));
		this._game.removeEventListener(CustomEvents.CHANGE_GAME_RESULT, this._onChangeResult.bind(this));
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
		if (!this._game.result())
		{
			return;
		}
		const result = this._game.result();
		if (result != Result.DRAW)
		{
			this._ownerContainer.addClassNames((result == Result.OWNER) ? "user_winner" : "user_loser");
			this._opponentContainer.addClassNames((result == Result.OPPONENT) ? "user_winner" : "user_loser");
		}
		this._opponentContainer.setTextContent(this._game.opponent().name());

		const className = (result == Result.DRAW) ? "game-item_resolved" : "game-item_resolved-with-winner";
		this.addClassNames(className);
	}
}