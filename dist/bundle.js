/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__entity__ = __webpack_require__(1);


function Actor(id, x, y, type, spdX, spdY, width, height){
	__WEBPACK_IMPORTED_MODULE_0__entity__["a" /* default */].apply(this, Array.prototype.slice.call(arguments));
}

Actor.prototype = new __WEBPACK_IMPORTED_MODULE_0__entity__["a" /* default */]();

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
/* harmony default export */ __webpack_exports__["a"] = (Actor);

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
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
/* harmony default export */ __webpack_exports__["a"] = (Entity);

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__bootstrap__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__game_game__ = __webpack_require__(5);



(function() {

	//init game
	var game = new __WEBPACK_IMPORTED_MODULE_1__game_game__["a" /* default */]();

	game.start();

	//console.log(game);

	game.gameInProgress = setInterval(function(){
		game.tick();
	}, 40);

})();

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__physics_physics_js__ = __webpack_require__(4);


window.Physics = __WEBPACK_IMPORTED_MODULE_0__physics_physics_js__["a" /* default */];

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//Constructor
function Physics(){}

/**
 * Check if the position of two rectangles is overlapping
 *
 * @param {object} rectangle1
 * @param {object} rectangle2
 */
Physics.prototype.testCollisionBetweenRectangles = function(rectangle1, rectangle2)
{
	return rectangle1.x <= rectangle2.x + rectangle2.width &&
				rectangle2.x <= rectangle1.x + rectangle1.width &&
				rectangle1.y <= rectangle2.y + rectangle2.height &&
				rectangle2.y <= rectangle1.y + rectangle1.height;
}

/**
 * Get distance between the center position of two status
 *
 * @param {object} statue1
 * @param {object} statue2
 */
Physics.prototype.getDistanceBetweenStatues = function (statue1, statue2)
{
	var vx = statue1.x - statue2.x;
	var vy = statue1.y - statue2.y;

	return Math.sqrt(vx*vx + vy*vy);
}

/**
 * Get distance between two points
 * Pythagorean theorem
 *
 * @param {object} point1
 * @param {object} point2
 */
Physics.prototype.getDistanceBetweenPoints = function(p1, p2)
{
	var a = p1.x - p2.x;
	var b = p1.y - p2.y;
	var c = Math.sqrt(a*a + b*b);

	return c;
}

/**
 * Check if a point is within a circle's radius
 *
 * @param int positionX
 * @param int positionY
 * @param int circleX
 * @param int circleY
 * @param int radius
 */
Physics.prototype.isPositionInsideCircle = function(positionX, positionY, circleX, circleY, circleRadius)
{
	return Math.sqrt(
			(positionX - circleX) * (positionX - circleX) +
			(positionY - circleY) * (positionY - circleY)
		) < circleRadius;
}

/**
*  Convert radians angle to degree angle
* @param number angle
*/
Physics.prototype.toDegrees = function(angle)
{
	return (angle*180) / Math.PI;
}

/**
*  Convert degree angle to radians angle
* @param number angle
*/
Physics.prototype.toRadians = function(angle)
{
	return angle * (Math.PI / 180);
}

/**
* Given the position x,y and the circle's position x,y
* calculate the angele between the given position and the circle's positive X axys
*  @param {object} position
*  @param {object} circlePosition
*/
Physics.prototype.getRelativeAngleToCircle = function(position, circle)
{
	var x = position.x - circle.x;
	var y = position.y - circle.y;

	return Math.atan2(y, x);
}



// export the class
/* harmony default export */ __webpack_exports__["a"] = (Physics);

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__entities_enemy__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__entities_player__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__entities_statue__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__structures_entity_list__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__img_museum1_png__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__img_museum1_png___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4__img_museum1_png__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__img_tiles_png__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__img_tiles_png___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5__img_tiles_png__);







function Game()
{
	this.ctx = document.getElementById('ctx').getContext('2d');
	this.ctx.font = '15px Arial';

	document.getElementById('museum').src = __WEBPACK_IMPORTED_MODULE_4__img_museum1_png___default.a;

	this.gameInProgress = false;
	this.timeWhenGameStarted = null;
	this.frameCount = 0;
	this.score = 0;
	this.statueLifetime = 10000;

	this.player = null;
	this.enemyList = new __WEBPACK_IMPORTED_MODULE_3__structures_entity_list__["a" /* default */]();
	this.statueList = new __WEBPACK_IMPORTED_MODULE_3__structures_entity_list__["a" /* default */]();

	this.tileAtlas = new Image();
	this.tileAtlas.src = __WEBPACK_IMPORTED_MODULE_5__img_tiles_png___default.a;

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

	self.player = new __WEBPACK_IMPORTED_MODULE_1__entities_player__["a" /* default */]();
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

	var enemy = new __WEBPACK_IMPORTED_MODULE_0__entities_enemy__["a" /* default */](id, x, y, spdX, spdY, width, height);

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

	var statue = new __WEBPACK_IMPORTED_MODULE_2__entities_statue__["a" /* default */](id, x, y);
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
/* harmony default export */ __webpack_exports__["a"] = (Game);


/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__actor__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__img_bat4_png__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__img_bat4_png___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__img_bat4_png__);



function Enemy(id, x, y, spdX, spdY, width, height){
	__WEBPACK_IMPORTED_MODULE_0__actor__["a" /* default */].apply(this, Array.prototype.slice.call(arguments));

	this.color = 'red';
	this.type = 'enemy';
	this.hp = null;

	this.img = new Image();
	this.img.src = __WEBPACK_IMPORTED_MODULE_1__img_bat4_png___default.a;
}

Enemy.prototype = new __WEBPACK_IMPORTED_MODULE_0__actor__["a" /* default */]();

// export the class
/* harmony default export */ __webpack_exports__["a"] = (Enemy);

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "d207b1dc65fe44427d1fae6e5c8b1016.png";

/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__actor__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__img_character_png__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__img_character_png___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__img_character_png__);



function Player(){
	__WEBPACK_IMPORTED_MODULE_0__actor__["a" /* default */].apply(this, Array.prototype.slice.call(arguments));

	this.id = 'myId';
	this.width = 25;
	this.height = 25;
	this.color = 'green';
	this.type = 'player';
	this.hp = 10;

	this.img = new Image();
	this.img.src = __WEBPACK_IMPORTED_MODULE_1__img_character_png___default.a;
}

Player.prototype = new __WEBPACK_IMPORTED_MODULE_0__actor__["a" /* default */]();

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
/* harmony default export */ __webpack_exports__["a"] = (Player);

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "bade87133f6bdf7b831e4ef562915613.png";

/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__entity__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__img_statue_png__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__img_statue_png___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__img_statue_png__);



function Statue(id, x, y)
{
	__WEBPACK_IMPORTED_MODULE_0__entity__["a" /* default */].apply(this, Array.prototype.slice.call(arguments));

	this.type = 'statue';
	this.name = 'S';
	this.r1 = 70;
	this.r2 = 120;
	this.width = 2*this.r2;
	this.height = 2*this.r2;
	this.color = 'orange';

	this.img = new Image();
	this.img.src = __WEBPACK_IMPORTED_MODULE_1__img_statue_png___default.a;

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

Statue.prototype = new __WEBPACK_IMPORTED_MODULE_0__entity__["a" /* default */]();

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

/* harmony default export */ __webpack_exports__["a"] = (Statue);


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "b34eaac5516455eba883cb5b054b5a24.png";

/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
function EntityList(){
	this.list = [];
}

EntityList.prototype.add = function(item){
	this.list[item.id] = item;
}

EntityList.prototype.remove = function(itemKey){
	delete this.list[itemKey];
}

/* harmony default export */ __webpack_exports__["a"] = (EntityList);

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "c6dd3fa409911d76ee6626b32d9c2d43.png";

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "915c1f04b733aea4fa6228e72ed11290.png";

/***/ })
/******/ ]);