/* 
 * @author Laurent Clouet <laurent35240@gmail.com>
 * @copyright Copyright (c) 2011 A Bunny Trip (http://www.a-bunny-trip.com/)
 */

function Obstacle(x, y, height, width){
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;
    
    this.draw = function(){
        ctx.fillStyle = "rgb(0,230,0)";
        ctx.fillRect( -cameraLeft + this.x - this.width / 2, -cameraTop + this.y - this.height, this.width, this.height);
    }
}


