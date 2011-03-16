/* 
 * @author Laurent Clouet <laurent35240@gmail.com>
 * @copyright Copyright (c) 2011 A Bunny Trip (http://www.a-bunny-trip.com/)
 */

function Ennemy(x, y, width, height){
    this.x = x;
    this.y = y;
    this.width  = width;
    this.height = height;
    
    this.color = 'black';
}

Ennemy.inheritsFrom(MovingObject);