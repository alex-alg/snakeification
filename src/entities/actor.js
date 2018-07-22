import Entity from './entity';

function Actor(id, x, y, type, spdX, spdY, width, height){
	Entity.apply(this, Array.prototype.slice.call(arguments));
}

Actor.prototype = new Entity();

Actor.prototype.update = function(canvasCtx){
  this.updatePosition(canvasCtx.canvas.width, canvasCtx.canvas.height);
  this.draw(canvasCtx);
}

Actor.prototype.updatePosition = function(canvasWidth, canvasHeight){
  //new position on canvas redraw
  //override in concrete entity if necessary
  this.x += this.spdX;
  this.y += this.spdY;

  //new position on canvas redraw if values are out of canvas bounds
  if(this.x < 0 || this.x > canvasWidth){
    this.spdX = -this.spdX;
  }

  if(this.y < 0 || this.y > canvasHeight){
    this.spdY = -this.spdY;
  }
}

Actor.prototype.draw = function(canvasCtx)
{
  this.drawActorImage(canvasCtx);

  if(this.hp){
    this.drawProgressBar({
      crtValue: this.hp,
      maxValue: 10,
      canvasCtx: canvasCtx,
      color: '#ad0d01',
      type: 'asc',
      position: 'top'
    });
  }
}

Actor.prototype.drawActorImage = function(canvasCtx)
{
  //save and restore canvasCtx due to change in fill style
  canvasCtx.save();

  var x = this.x - this.width / 2;
  var y = this.y - this.height / 2;

  if(typeof this.img !== 'undefined'){
    //params are: image, cropStartX, cropStartY, cropWidth, cropHeight,
    //            drawX, drawY, drawWidth, drawHeight
    canvasCtx.drawImage(this.img, 0, 0, this.img.width, this.img.height, x, y, this.width, this.height);
  }else{
    canvasCtx.fillStyle = this.color;
  
  //trick to center the position for the mouse
    canvasCtx.fillRect(x, y, this.width, this.height);
  }

  canvasCtx.restore();
}

Actor.prototype.isCollidingWith = function(entity){
  var rectangle1 = {
    x: this.x - this.width/2,
    y: this.y - this.height/2,
    width: this.width,
    height: this.height
  }

  var rectangle2 = {
    x: entity.x - entity.width/2,
    y: entity.y - entity.height/2,
    width: entity.width,
    height: entity.height
  }

  var physics = new Physics();

  return physics.testCollisionBetweenRectangles(rectangle1, rectangle2);
}

// export the class
export default Actor;