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
export default Physics;