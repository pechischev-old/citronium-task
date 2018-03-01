import Component from '../components/Component';
import Game from '../model/Game';

export default class GameView extends Component {
	/**
	 * @param {Game} game
	 */
	constructor(game) {
		super({className: "game-item"});
		/** @private {Game} */
		this._game = game;

		const ownerContainer = new Component({className: "game-item__owner user"});
		ownerContainer.setTextContent(game.owner().name());
		this.addChild(ownerContainer);

		const opponentContainer = new Component({className: "game-item__opponent user"});
		const opponent = game.opponent();
		if (opponent)
		{
			opponentContainer.setTextContent(opponent.name());
		}
		this.addChild(opponentContainer);

		const timeContainer = new Component({className: "game-item__time"});
		timeContainer.setTextContent("00:00:00");
		this.addChild(timeContainer);
	}

	gameId() {
		return this._game.id();
	}
}