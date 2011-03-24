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
    this.canGoThroughFloor = false;
    this.goForward = true; //We consider that by defaut everything go forward
    
    
    this.draw = function(){
        var screenX = this.x - cameraLeft;
        var screenY = this.y - cameraTop;
        
        ctx.fillStyle = this.color;
        ctx.fillRect(   screenX - this.width / 2 ,
                        screenY - this.height,
                        this.width , this.height );
    }
    
    /**
     * Updating acceleration, velocity and position
     */
    this.updatePhysics = function() {
        this.accelY = GRAVITY
        
        // Accel => Speed.
        this.velX += this.accelX * FRAME_DURATION / 1000;
        this.velY += this.accelY * FRAME_DURATION / 1000;
        
        // Speed clamping.
        this.velX = clamp( this.velX , -this.MAX_SPEED , +this.MAX_SPEED );
    
        // Speed => Positions.
        this.x += this.velX * FRAME_DURATION / 1000;
        this.y += this.velY * FRAME_DURATION / 1000;
        
        // Position clamping.
        if ( this.y >= 0 && !this.canGoThroughFloor)
        {
            this.y = 0;
            this.velY = 0;
            this.accelY = 0;
            this.onGround = true;
        }
        
        //Going forward ?
        if(this.velX > 0){
            this.goForward = true;
        }
        else if(this.velX < 0){
            this.goForward = false;
        }
        
    }
}