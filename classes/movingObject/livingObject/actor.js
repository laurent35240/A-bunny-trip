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
    
    //Life management
    this.maxLife = 100;
    this.life = this.maxLife;
    
    // Attacks parameter
    this.stumpAttack = 100;
    this.hmpfAttack = false;
    this.hmpfAttackDistance = 20;
    this.scratchAttack = false;
    this.scratchAttackPoint = 50;
    this.scratchAttackDistance = 20;
    
    //Animation initialisation
    this.standingAnimation = new Animation('img/actor.png', ['frame1']);
    this.runningAnimation = new Animation('img/actor.png', ['frame1', 'frame2', 'frame1', 'frame3']);
    
    
    this.update = function(){
        //If actor is dead we must reset him at the beignning of level
        if(!this.isAlive()){
            this.reset();
        }
        
        //Reseting the attacks
        this.hmpfAttack = false;
        this.scratchAttack = false;
        
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
        
        //Attacks keys
        if ( ( control.keys & control.JOY_BTN_B     ) != 0 ){
            this.hmpfAttack = true;
        }
        
        //Attacks keys
        if ( ( control.keys & control.JOY_BTN_A     ) != 0 ){
            this.scratchAttack = true;
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
           this.velY = -this.velY + 2*ennemy.velY;
           
           ennemy.life -= this.stumpAttack;
       }

       //Actor must be put back on bottom
       if(
        overlap['bottom'] > 0
        && overlap['bottom'] < overlap['left']
        && overlap['bottom'] < overlap['right']
       ){
           this.y += overlap['bottom'];
           this.accelY = GRAVITY;
           this.velY = -this.velY + 2*ennemy.velY;
           this.jumpImpulseFinished = true;
           
           this.life -= ennemy.attack;
       }

       //Actor must be put back on left
       if(
        overlap['left'] > 0
        && overlap['left'] < overlap['top']
        && overlap['left'] < overlap['bottom']
       ){
           this.x -= overlap['left'];
           this.accelX = 0;
           this.velX = -this.velX + 2*ennemy.velX;
           
           this.life -= ennemy.attack;
       }

       //Actor must be put back on right
       if(
        overlap['right'] > 0
        && overlap['right'] < overlap['top']
        && overlap['right'] < overlap['bottom']
       ){
           this.x += overlap['right'];
           this.accelX = 0;
           this.velX = -this.velX + 2*ennemy.velX;
           
           this.life -= ennemy.attack;
       }
       
       //Attacks behavoiurs
       var ennemyEscapeForward = true;
       var ennemyIsForward = (ennemy.x > this.x);
       //hmpf attack
       if(this.hmpfAttack 
           && Math.max(this.x - ennemy.x, ennemy.x - this.x) < (this.width / 2 + this.hmpfAttackDistance + ennemy.width / 2)
           && ennemyIsForward == this.goForward //Direction of attack must be the same than ennemy
       ){
           if(this.x > ennemy.x){
               ennemyEscapeForward = false;
           }
           ennemy.escape(ennemyEscapeForward);
       }
       
       //scratch attack
       if(this.scratchAttack
            && Math.max(this.x - ennemy.x, ennemy.x - this.x) < (this.width / 2 + this.scratchAttackDistance + ennemy.width / 2)
            && ennemyIsForward == this.goForward //Direction of attack must be the same than ennemy
       ){
            ennemy.life -= this.scratchAttackPoint;
           
           if(this.x > ennemy.x){
               ennemyEscapeForward = false;
           }
           ennemy.escape(ennemyEscapeForward);
       }
    }
    
    this.isRunning = function(){
        return (
            this.onGround 
            && (
                this.velX > 10 
                || this.velX < -10
            )
        );
    }
    
    this.draw = function(){
        var screenX = this.x - camera.left;
        var screenY = this.y - camera.top;
        
        //this.parent.draw.call(this);
        ctx.save();
        ctx.translate(
            screenX,
            screenY - this.height
        );
        if(!this.goForward){
            ctx.scale(-1,1);
        }

        if(this.isRunning()){
            this.runningAnimation.drawAnimation(
                - this.width / 2 ,
                0, 
                this.width, 
                this.height);
        }
        else{
            this.standingAnimation.drawAnimation(
                - this.width / 2 ,
                0, 
                this.width, 
                this.height
            );
        }

        ctx.restore();
    }
    
    this.reset = function(){
        //Reseting attacks
        this.hmpfAttack = false;
        this.scratchAttack = false;
        
        //Putting him back to the beginning
        this.x = 0;
        this.y = 0;
        this.velX = 0;
        this.velY = 0;
        this.accelX = 0;
        this.accelY = 0;
        
        //Giving back his life
        this.life = this.maxLife;
    }

    /**
     * Adjust position of actor according to different obstacles of the level
     */
    this.adjustWithLevel = function(level){
        for(var i=0; i < level.obstacles.length; i ++){
            this.adjust(level.obstacles[i]);
        }
    }
  
}

Actor.inheritsFrom(LivingObject);
