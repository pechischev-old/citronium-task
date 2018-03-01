import User from './model/User';
import Presenter from './controller/Presenter';

let userName = "user";
while (!userName)
{
	userName = prompt("Enter your name", "name");
}

const user = new User(userName);
const presenter = new Presenter(user, null);