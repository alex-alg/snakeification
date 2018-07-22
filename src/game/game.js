import Enemy from '../entities/enemy';
import Player from '../entities/player';
import Statue from '../entities/statue';
import EntityList from '../structures/entity-list';
import MuseumIcon from '../img/museum1.png';
import TileAtlas from '../img/tiles.png';

function Game()
{
	this.ctx = document.getElementById('ctx').getContext('2d');
	this.ctx.font = '15px Arial';

	document.getElementById('museum').src = MuseumIcon;

	this.gameInProgress = false;
	this.timeWhenGameStarted = null;
	this.frameCount = 0;
	this.score = 0;
	this.statueLifetime = 10000;

	this.player = null;
	this.enemyList = new EntityList();
	this.statueList = new EntityList();

	this.tileAtlas = new Image();
	this.tileAtlas.src = TileAtlas;

	this.map = {
	cols: 16,			//1024 px
    rows: 12,		//768px
    tsize: 64,
    tiles: [
      3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3,
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
     
    ],
    getTile: function (col, row) {
      return this.tiles[row * this.cols + col];
    }
	}
}

Game.prototype.renderMap = function(canvasCtx)
{
	var self = this;

  for (var c = 0; c < self.map.cols; c++) {
    for (var r = 0; r < self.map.rows; r++) {
      var tile = self.map.getTile(c, r);

      if (tile !== 0) { // 0 => empty tile
        canvasCtx.drawImage(
          self.tileAtlas, // image
          (tile - 1) * self.map.tsize, // source x
          0, // source y
          self.map.tsize, // source width
          self.map.tsize, // source height
          c * self.map.tsize,  // target x
          r * self.map.tsize, // target y
          self.map.tsize, // target width
          self.map.tsize // target height
        );
      }
    }
  }
}

Game.prototype.start = function()
{
	var self = this;
	self.timeWhenGameStarted = Date.now();

	self.player = new Player();
	self.generateEnemy();
	self.generateEnemy();
	self.generateStatue();

	document.onmousemove = function(mouse){
		self.player.updatePosition(self.ctx, mouse);
	};
}

Game.prototype.generateEnemy = function()
{
	var id = Math.random();
	var x = Math.random() * this.ctx.canvas.width;
	var y = Math.random() * this.ctx.canvas.height;
	var spdX = 5 + Math.random() * 5;
	var spdY = 5 + Math.random() * 5;
	var height = 40;
	var width = 70;

	var enemy = new Enemy(id, x, y, spdX, spdY, width, height);

	this.enemyList.add(enemy);
}

Game.prototype.generateStatue = function()
{
	var id = Math.random();
	var x = 100 + Math.random() * (this.ctx.canvas.width - 200);
	var y = 100 + Math.random() * (this.ctx.canvas.height - 200);

	var physics = new Physics();

	if(typeof this.statueList !== 'undefined'){
		for(var key in this.statueList.list){
			var distance = physics.getDistanceBetweenStatues(this.statueList.list[key], {x:x, y:y});

			if(distance < this.statueList.list[key].r2 * 2){
				this.generateStatue();
				return false;
			}
		}
	}

	var statue = new Statue(id, x, y);
	this.statueList.add(statue);
}

Game.prototype.tick = function ()
{
	var self = this;

	//clear canvas
	self.ctx.clearRect(0, 0, self.ctx.canvas.width, self.ctx.canvas.height);
	self.renderMap(self.ctx);

	self.frameCount++;
	self.score++;

	// if(self.frameCount % 100 === 0){
	// 	//every 4 seconds
	// 	self.generateEnemy();
	// }

	if(self.frameCount % 75 === 0){
		//every 4 seconds
		if(Object.keys(self.statueList.list).length < 3){
			self.generateStatue();
		}
	}

	// //draw statue entity
	for(var key in self.statueList.list){
		self.statueList.list[key].update(self.ctx, self.player);

		self.statueList.list[key].timer++;

		if(self.statueList.list[key].timer > self.statueList.list[key].lifetime ||
			 self.statueList.list[key].suroundedAngle >= self.statueList.list[key].degreesToSurround
			){
			delete self.statueList.list[key];
			continue;
		}
	}

	//draw every enemy entity
	for(var key in self.enemyList.list){

		self.enemyList.list[key].update(self.ctx);

		// test if the new position is colliding with the player entity
		var isColliding = self.enemyList.list[key].isCollidingWith(self.player);

		if(isColliding){
			self.player.hp = self.player.hp - 1;
		}
	}

	if(self.player.hp <= 0){
		var timeSurvived = Date.now() - self.timeWhenGameStarted;
		console.log('game over, you survived for ' + timeSurvived);

		clearInterval(self.gameInProgress);
	}

	// player.draw();
	self.player.update(self.ctx);

	self.ctx.fillText("HP: " + self.player.hp, 0, 30);
	self.ctx.fillText("Score: " + self.score, 200, 30);

	return true;
}

Game.prototype.end = function (){

}

// export the class
export default Game;
