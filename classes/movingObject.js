/* 
 * @author Laurent Clouet <laurent35240@gmail.com>
 * @copyright Copyright (c) 2011 A Bunny Trip (http://www.a-bunny-trip.com/)
 */

function MovingObject(x, y, width, height){
    this.x = x;
    this.y = y;
    this.velX = 0;
    this.velY = 0;
    this.accelX = 0;
    this.accelY = 0;
    this.color = "rgb(200,200,0)";
    this.width  = width;
    this.height = height;
    
    
    this.draw = function(){
        var screenX = this.x - cameraLeft;
        var screenY = this.y - cameraTop;
        
        ctx.fillStyle = this.color;
        ctx.fillRect(   screenX - this.width / 2 ,
                        screenY - this.height,
                        this.width , this.height );
    }
}