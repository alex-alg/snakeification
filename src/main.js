import './bootstrap';
import Game from './game/game';

(function() {

	//init game
	var game = new Game();

	game.start();

	//console.log(game);

	game.gameInProgress = setInterval(function(){
		game.tick();
	}, 40);

})();