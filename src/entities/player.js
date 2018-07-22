import Actor from './actor';
import Icon from '../img/character.png';

function Player(){
	Actor.apply(this, Array.prototype.slice.call(arguments));

	this.id = 'myId';
	this.width = 25;
	this.height = 25;
	this.color = 'green';
	this.type = 'player';
	this.hp = 10;

	this.img = new Image();
	this.img.src = Icon;
}

Player.prototype = new Actor();

Player.prototype.update = function(canvasCtx){
  var self = this;

  self.draw(canvasCtx);
}

Player.prototype.updatePosition = function(canvasCtx, mouse){
	var mouseX = mouse.clientX - canvasCtx.canvas.getBoundingClientRect().left;
	var mouseY = mouse.clientY - canvasCtx.canvas.getBoundingClientRect().top;

	if(mouseX < this.width/2) mouseX = this.width/2;
	if(mouseX > canvasCtx.canvas.width - this.width/2) mouseX = canvasCtx.canvas.width - this.width/2;

	if(mouseY < this.height/2) mouseY = this.height/2;
	if(mouseY > canvasCtx.canvas.height - this.height/2) mouseY = canvasCtx.canvas.height - this.height/2;

	this.x = mouseX;
	this.y = mouseY;
}

// export the class
export default Player;