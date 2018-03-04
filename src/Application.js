import User from './model/User';
import Presenter from './controller/Presenter';
import Loader from './model/Loader';

let userName = "";
while (!userName)
{
	userName = prompt("Enter your name", "User");
}

const loader = new Loader();
const games = loader.load(json);

const user = new User(userName);
const presenter = new Presenter(user, games);