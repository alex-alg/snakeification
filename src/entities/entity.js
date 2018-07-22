function Entity(id, x, y, spdX, spdY, width, height)
{
  this.id = id;
  this.x = x;
  this.y = y;

  this.spdX = spdX;
  this.spdY = spdY;
  this.width = width;
  this.height = height;
}

/**
 * Create progress bar
 * The progress bar should be as long as the entity's width
 *
 * @param {object} entityParams {
		crtValue,
		maxValue,
		canvasCtx,
		color,
		type,
		position
	}
*/
Entity.prototype.drawProgressBar = function(entityParams)
{
	//percetage calc
	var progress = 100*entityParams.crtValue/entityParams.maxValue;
	var progressPixels = this.width*progress/100;

	//position calc
	var progressBarX = this.x - this.width/2;
	var progressBarY = null;

	if(entityParams.position === 'top'){
		progressBarY = this.y - this.height/2 - 15;
	}else{
		progressBarY = this.y + this.height/2 + 15;
	}

	entityParams.canvasCtx.save();
	entityParams.canvasCtx.globalAlpha  = 0.2;
	entityParams.canvasCtx.fillRect(progressBarX, progressBarY, this.width, 10);
	entityParams.canvasCtx.globalAlpha = 1.0;
	entityParams.canvasCtx.restore();

	entityParams.canvasCtx.save();
	entityParams.canvasCtx.fillStyle = entityParams.color;

	if(entityParams.type == 'desc'){
		entityParams.canvasCtx.fillRect(progressBarX, progressBarY, this.width - progressPixels, 10);
	}else{
		entityParams.canvasCtx.fillRect(progressBarX, progressBarY, progressPixels, 10);
	}

	entityParams.canvasCtx.restore();
}

// export the class
export default Entity;