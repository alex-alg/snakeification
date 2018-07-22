import Actor from './actor';
import Icon from '../img/bat4.png';

function Enemy(id, x, y, spdX, spdY, width, height){
	Actor.apply(this, Array.prototype.slice.call(arguments));

	this.color = 'red';
	this.type = 'enemy';
	this.hp = null;

	this.img = new Image();
	this.img.src = Icon;
}

Enemy.prototype = new Actor();

// export the class
export default Enemy;