import Entity from './entity';
import StatueIcon from '../img/statue.png';

function Statue(id, x, y)
{
	Entity.apply(this, Array.prototype.slice.call(arguments));

	this.type = 'statue';
	this.name = 'S';
	this.r1 = 70;
	this.r2 = 120;
	this.width = 2*this.r2;
	this.height = 2*this.r2;
	this.color = 'orange';

	this.img = new Image();
	this.img.src = StatueIcon;

	this.timer = 0;
	this.lifetime = 500;
	this.hasInteractedWithPlayer = false;
	this.lastInRangePosition = {};
	this.lastAntiClockwisePosition = {};
	this.isSurrounding = false;
	this.suroundedAngle = 0.0;
	this.degreesToSurround = 1080;

	this.returnPoint = null;
	this.circumferenceReturnPoint = null;
}

Statue.prototype = new Entity();

Statue.prototype.update = function(canvasCtx, player)
{
  this.updatePosition(canvasCtx);
  this.updateInteractionWithPlayer(canvasCtx, player);
  this.draw(canvasCtx);
}

Statue.prototype.updatePosition = function(canvasCtx)
{
	var self = this;
	//progress bar for time left
  self.drawProgressBar({
  	crtValue: this.timer,
  	maxValue: this.lifetime,
  	canvasCtx: canvasCtx,
  	color: '#4286f4',
  	type: 'desc',
  	position: 'top'
  });
  
  if(self.hasInteractedWithPlayer){
  	//progress bar for angle surounded
  	self.drawProgressBar({
	  	crtValue: this.suroundedAngle,
	  	maxValue: this.degreesToSurround,
	  	canvasCtx: canvasCtx,
	  	color: '#42f448',
	  	type: 'asc',
	  	position: 'bottom'
  	});
  }
}

Statue.prototype.draw = function(canvasCtx)
{
	canvasCtx.save();
	canvasCtx.beginPath();
	//ctx.arc(statue.x, statue.y, statue.r1, 0*Math.PI, 1.5*Math.PI); //center
	canvasCtx.arc(this.x, this.y, this.r1, 0, 2*Math.PI); //inner circle
	canvasCtx.arc(this.x, this.y, this.r2, 0, 2*Math.PI); //outer circle
	canvasCtx.stroke();

	//params are: image, cropStartX, cropStartY,
	//			cropWidth, cropHeight,
	//			drawX, drawY,
	//			drawWidth, drawHeight
	canvasCtx.drawImage(
			this.img, 0, 0,
			this.img.width, this.img.height,
			this.x - 50, this.y - 50,
			100, 100
	);
}

Statue.prototype.updateInteractionWithPlayer = function(canvasCtx, player)
{
	var isInsideRange = this.isPlayerInsideRange(player);

	if(isInsideRange){
		this.hasInteractedWithPlayer = true;
		var playerAngle = this.getPlayerAngleRelativeToStatue(player);

		var antiClockwiseMovement = this.isMovingAntiClockwise(player);

		if(antiClockwiseMovement){
			this.updateAntiClockwiseInteraction(canvasCtx, player);
		}else{
			this.updateClockwiseInteraction(canvasCtx, player);
		}

		this.updateLastInRangePosition(player);
	}else{
		if(this.hasInteractedWithPlayer){
			this.resetInteractionValues();
		}
	}
}

Statue.prototype.updateAntiClockwiseInteraction = function(canvasCtx, player)
{
	if(this.returnPoint === null){
		this.isSurrounding = true;
		var frameSuroundedAngle = this.getMovementAngle(player);
		this.updateSuroundedAngle(frameSuroundedAngle);
	}else{
		if(this.hasPassedReturnBoarder(player)){
			this.returnPoint = null;
		}else{
			this.drawReturnBoarder(canvasCtx);
		}
	}
}

Statue.prototype.updateClockwiseInteraction = function(canvasCtx, player)
{
	if(this.isSurrounding === true){
		this.isSurrounding = false;
		this.setReturnPoint(player);
		this.setCircumferenceReturnPoint();
		this.drawReturnBoarder(canvasCtx);
	}else{
		if(this.returnPoint){
			this.drawReturnBoarder(canvasCtx);
		}
	}
}

Statue.prototype.setReturnPoint = function(player)
{
	this.returnPoint = {
		x: player.x,
		y: player.y
	}
}

Statue.prototype.setCircumferenceReturnPoint = function()
{
	if(this.returnPoint){
		// gat return point angle with the center of the circle
		// the angle depends on the x,y of the statue and the x,y of the player
		//so in order to get the angle of the return point relative to the statue we need to
		//subtract the statue pos from the return point pos
		//we will get the angle in radians
		var returnPointRelativeToStatueY = this.returnPoint.y - this.y;
		var returnPointRelativeToStatueX = this.returnPoint.x - this.x;

		var returnPointAngle = Math.atan2(
				returnPointRelativeToStatueY,
				returnPointRelativeToStatueX
			);

		this.circumferenceReturnPoint = {
			x: this.x + this.r2 * Math.cos(returnPointAngle),
			y: this.y + this.r2 * Math.sin(returnPointAngle)
		}
	}
}


/**
*	Check if a point is on the right side of a line
*/
Statue.prototype.hasPassedReturnBoarder = function(player)
{
	var d = (player.x - this.x) * (this.circumferenceReturnPoint.y - this.y) - 
					(player.y - this.y) * (this.circumferenceReturnPoint.x - this.x)

	return d > 0;
}


/**
*	Vectorial formula for anticlockwise movement
*/
Statue.prototype.isMovingAntiClockwise = function(player)
{
	var angle = ((this.lastInRangePosition.x - this.x) *
							(player.y - this.y) -
							(this.lastInRangePosition.y - this.y) *
							(player.x - this.x));

	return angle < 0;
}

/**
 * Check if the player position on canvas is within the statue radius2 area
 * but not within the status radius 1 area
 *
 * @param {object} player
 */
Statue.prototype.isPlayerInsideRange = function(player)
{
	var physics = new Physics();
	var isInsideOuterCircle = physics.isPositionInsideCircle(player.x, player.y, this.x, this.y, this.r2);
	var isInsideInnerCircle = physics.isPositionInsideCircle(player.x, player.y, this.x, this.y, this.r1);

	return (!isInsideInnerCircle && isInsideOuterCircle);
}

/**
 * @param {object} player
 */
Statue.prototype.getPlayerAngleRelativeToStatue = function(player)
{
	var physics = new Physics();
	var relativeAngle = physics.getRelativeAngleToCircle(player, this);
	relativeAngle = physics.toDegrees(relativeAngle);

	return relativeAngle;
}

/**
 * Check if the player rotation movement is clockwise or anticlockwise relative to the last frame
 *
 * @param {object} player
 */
Statue.prototype.checkRotationDirection = function(player)
{
	var isAntiClockwise = true;
	var physics = new Physics();

	if(Object.keys(this.lastInRangePosition).length !== 0){
		var lastPositionAngle = physics.getRelativeAngleToCircle(this.lastInRangePosition, this);
		var crtPositionAngle = physics.getRelativeAngleToCircle(player, this);

		var angle = lastPositionAngle - crtPositionAngle;
		var angle = physics.toDegrees(angle);

		if(angle < 0){
			isAntiClockwise = false;
		}
	}

	return isAntiClockwise;
}

/**
 * Get the player movemnt angle relative to the the last frame position
 *
 * @param {object} player
 */
Statue.prototype.getMovementAngle = function(player)
{
	var physics = new Physics();
	var b = physics.getDistanceBetweenPoints(this, player);  //crt position
	var c = physics.getDistanceBetweenPoints(this, this.lastInRangePosition);
	var a = physics.getDistanceBetweenPoints(player, this.lastInRangePosition);

	// calculate angle //cosinus theorem
	// extract to physics class
	var cosA = (b*b + c*c - a*a)/(2*b*c);
	var angle = Math.acos(cosA);
	var angle = physics.toDegrees(angle);

	if(isNaN(angle)){
		angle = 0;
	}

	return angle;
}

Statue.prototype.updateAntiClockwisePosition = function(player)
{
	this.lastAntiClockwisePosition.x = player.x;
	this.lastAntiClockwisePosition.y = player.y;
}

Statue.prototype.updateSuroundedAngle = function(angle)
{
	this.suroundedAngle += angle;
}

Statue.prototype.drawReturnBoarder = function(canvasCtx)
{
	//draw a line from the center of the circle to it's circumference using the return point angle
	// this represents the last position before the player changed rotation direction to clockwise
	canvasCtx.save();
	canvasCtx.beginPath();
	canvasCtx.moveTo(this.x, this.y);
	canvasCtx.lineTo(this.circumferenceReturnPoint.x, this.circumferenceReturnPoint.y);
	canvasCtx.stroke();
}

Statue.prototype.updateLastInRangePosition = function(player)
{
	this.lastInRangePosition.x = player.x;
	this.lastInRangePosition.y = player.y;
}

Statue.prototype.updateLastAntiClockwisePosition = function(player)
{
	this.lastAntiClockwisePosition.x = player.x;
	this.lastAntiClockwisePosition.y = player.y;
}

Statue.prototype.resetInteractionValues = function()
{
	this.hasInteractedWithPlayer = false;
	this.lastInRangePosition = {};
	this.lastAntiClockwisePosition = {};
	this.isSurrounding = false;
	this.suroundedAngle = 0.0;

	this.returnPoint = null;
	this.circumferenceReturnPoint = null;
}

export default Statue;
