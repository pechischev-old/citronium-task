import {expect} from 'chai';
import GameController from '../src/controller/GameController';
import Game from '../src/model/Game';

describe('GameControllerTest', () => {
	const controller = new GameController();

	const user = {
		name: function () {
			return "name";
		}
	};
	const size = 3;

	describe("_checkWinner", () => {
		it("should not win when field is empty", () => {
			const data = [
				["", "", ""],
				["", "", ""],
				["", "", ""],
			];
			const game = new Game(user, size, data);
			controller.initGame(game);

			expect(controller._checkWinner()).to.deep.equal({check: false});
		});

		it("should win by main diagonal", () => {
			const data = [
				["X", "", ""],
				["", "X", ""],
				["", "", "X"],
			];
			const game = new Game(user, size, data);
			controller.initGame(game);

			expect(controller._checkWinner()).to.deep.equal({check: true, value: "X"});
		});

		it("should not win by main diagonal", () => {
			const data = [
				["X", "", ""],
				["", "X", ""],
				["X", "", ""],
			];
			const game = new Game(user, size, data);
			controller.initGame(game);

			expect(controller._checkWinner()).to.deep.equal({check: false});
		});

		it("should win by secondary diagonal", () => {
			const data = [
				["", "", "X"],
				["", "X", ""],
				["X", "", ""],
			];
			const game = new Game(user, size, data);
			controller.initGame(game);

			expect(controller._checkWinner()).to.deep.equal({check: true, value: "X"});
		});

		it("should win by horizontal diagonal", () => {
			const data = [
				["0", "0", "0"],
				["", "X", ""],
				["X", "", ""],
			];
			const game = new Game(user, size, data);
			controller.initGame(game);

			expect(controller._checkWinner()).to.deep.equal({check: true, value: "0"});
		});

		it("should win by vertical diagonal", () => {
			const data = [
				["", "0", ""],
				["", "0", ""],
				["X", "0", ""],
			];
			const game = new Game(user, size, data);
			controller.initGame(game);

			expect(controller._checkWinner()).to.deep.equal({check: true, value: "0"});
		});

		it("should not win to fill field", () => {
			const data = [
				["0", "X", "0"],
				["0", "X", "X"],
				["X", "0", "0"],
			];
			const game = new Game(user, size, data);
			controller.initGame(game);

			expect(controller._checkWinner()).to.deep.equal({check: false});
		});
	});
});