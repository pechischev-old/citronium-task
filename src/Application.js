import GameController from 'controller/GameController';
import User from 'model/User';

function start() {

    let userName = '123';
    while (!userName)
    {
        userName = prompt("Enter your name", "name");
    }

   const user = new User(userName);
   const gameController = new GameController(user);
}