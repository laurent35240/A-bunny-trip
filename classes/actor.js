/* 
 * @author Laurent Clouet <laurent35240@gmail.com>
 * @copyright Copyright (c) 2011 A Bunny Trip (http://www.a-bunny-trip.com/)
 */
function Actor(x, y, width, height){
    this.x = x;
    this.y = y;
    this.width  = width;
    this.height = height;
    this.onGround = true;
    this.isHumping = false;
    
    this.jumpStartY = 0;
    this.jumpImpulseFinished = true;
    
    // Maximum acceleration.
    this.MAX_ACCEL = 300;
    
    // Maximum speed.
    this.MAX_SPEED = 400;
    
    this.update = function(){
        // Check inputs.
        this.updateKeys();
                
        // Accel, Speed, Pos.
        this.updatePhysics();
    }
    
    this.updateKeys = function() {
        if ( this.onGround )
        {
            if ( ( control.keys & control.JOY_LEFT     ) != 0 )    this.accelX = -400;
            if ( ( control.keys & control.JOY_RIGHT    ) != 0 )    this.accelX = +400;
            
            if ( ( control.keys & ( control.JOY_LEFT + control.JOY_RIGHT) ) == 0 )
            {
               this.accelX = 0;
               
               if ( this.velX >= 1 || this.velX <= -1 )
               {
                   this.velX *= 0.94;
               }
               else
               {
                   this.velX = 0;
               }
               
            }
            
            // Jump.
            if ( ( control.keys & control.JOY_UP ) != 0 )
            {
                this.startJumpY = this.y;
                this.onGround   = false;
                this.velY       = -200;
                this.jumpImpulseFinished = false;
            }
        }
        else
        {
            if ( ( control.keys & control.JOY_LEFT     ) != 0 )    this.accelX = -100;
            if ( ( control.keys & control.JOY_RIGHT    ) != 0 )    this.accelX = +100;
            
            // Continue jump.
            var deltaY = this.startJumpY - this.y;
            
            if (          deltaY > 100
                    ||  ( control.keys & control.JOY_UP ) == 0 )
            {
                this.jumpImpulseFinished = true;
            }
            
            if ( (      control.keys & control.JOY_UP ) != 0 
                    && !this.jumpImpulseFinished )
            {
                this.velY       = -200;
            }
        }
    }
    
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
        if ( this.y >= 0 )
        {
            this.y = 0;
            this.velY = 0;
            this.accelY = 0;
            this.onGround = true;
        }
        
    }
    
    /**
     * Is actor overlapping with obstacle ?
     * Return Array {left: xxx, right: xxx, top: xxx, bottom: xxx}
     */
    this.overlapArray = function(obs){
        var actorLeft    = this.x - this.width / 2;
        var actorRight   = this.x + this.width / 2;
        var actorTop     = this.y - this.height;
        var actorBottom  = this.y;
        
        var obsLeft     = obs.x - obs.width / 2;
        var obsRight    = obs.x + obs.width / 2;
        var obsTop      = obs.y - obs.height;
        var obsBottom   = obs.y;
        
        var notOverlap  = actorRight     < obsLeft
                      ||  actorLeft      > obsRight
                      ||  actorTop       > obsBottom
                      ||  actorBottom    < obsTop;
        var overlap = new Array();
        overlap['left'] = 0;
        overlap['right'] = 0;
        overlap['top'] = 0;
        overlap['bottom'] = 0;
        
        
        if(!notOverlap){
           overlap['top'] = Math.max(0, actorBottom - obsTop);
           overlap['left'] = Math.max(0, actorRight - obsLeft);;
           overlap['right'] = Math.max(0, obsRight - actorLeft);
           overlap['bottom'] = Math.max(0, obsBottom - actorTop);
        }
        
        return overlap;
    }
    
    /**
     * Adjust position of actor according to position of the obsctacle
     */
    this.adjust = function(obs){
       var overlap = this.overlapArray(obs);

       //Actor must be put back on top
       if(
        overlap['top'] > 0
        && this.velY > 0
        && overlap['top'] < overlap['left']
        && overlap['top'] < overlap['right']
       ){
           this.y = obs.y - obs.height;
           this.accelY = 0;
           this.velY = 0;
           this.onGround = true;
       }

       //Actor must be put back on bottom
       if(
        overlap['bottom'] > 0
        && this.velY < 0
        && overlap['bottom'] < overlap['left']
        && overlap['bottom'] < overlap['right']
       ){
           this.y += overlap['bottom'];
           this.accelY = GRAVITY;
           this.velY = 0;
           this.jumpImpulseFinished = true;
       }

       //Actor must be put back on left
       if(
        overlap['left'] > 0
        && this.velX > 0
        && overlap['left'] < overlap['top']
        && overlap['left'] < overlap['bottom']
       ){
           this.x -= overlap['left'];
           this.accelX = 0;
           this.velX = 0;
       }

       //Actor must be put back on right
       if(
        overlap['right'] > 0
        && this.velX < 0
        && overlap['right'] < overlap['top']
        && overlap['right'] < overlap['bottom']
       ){
           this.x += overlap['right'];
           this.accelX = 0;
           this.velX = 0;
       }
           
    }
    
    /**
     * Adjusting position with an ennemy
     * Update position, speed and life of actor and ennemy
     */
    this.adjustWithEnnemy = function(ennemy){
        var overlap = this.overlapArray(ennemy);
        
        //Actor must be put back on top
       if(
        overlap['top'] > 0
        && overlap['top'] < overlap['left']
        && overlap['top'] < overlap['right']
       ){
           this.y = ennemy.y - ennemy.height;
           this.accelY = 0;
           this.velY = -this.velY;
       }

       //Actor must be put back on bottom
       if(
        overlap['bottom'] > 0
        && overlap['bottom'] < overlap['left']
        && overlap['bottom'] < overlap['right']
       ){
           this.y += overlap['bottom'];
           this.accelY = GRAVITY;
           this.velY = -this.velY;
           this.jumpImpulseFinished = true;
       }

       //Actor must be put back on left
       if(
        overlap['left'] > 0
        && overlap['left'] < overlap['top']
        && overlap['left'] < overlap['bottom']
       ){
           this.x -= overlap['left'];
           this.accelX = 0;
           this.velX = -this.velX;
       }

       //Actor must be put back on right
       if(
        overlap['right'] > 0
        && overlap['right'] < overlap['top']
        && overlap['right'] < overlap['bottom']
       ){
           this.x += overlap['right'];
           this.accelX = 0;
           this.velX = -this.velX;
       }
    }
}

Actor.inheritsFrom(MovingObject);


