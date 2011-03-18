/* 
 * @author Laurent Clouet <laurent35240@gmail.com>
 * @copyright Copyright (c) 2011 A Bunny Trip (http://www.a-bunny-trip.com/)
 */

function Ennemy(x, y, width, height){
    this.x = x;
    this.y = y;
    this.width  = width;
    this.height = height;
    this.velX = 30;
    this.maxDistance = 150;
    this.attack = 10;
    this.life = 10;
    this.isScared = false;
    
    this.color = 'black';
    
    this.escapeVelCoeff = 4;
    
    var initialX = x;
    
    this.update = function(){
        if(this.x < initialX || this.x > (initialX + this.maxDistance)){
            if(this.isScared){
                //Ennemy was scared, he is no more when is coming back
                this.velX /= this.escapeVelCoeff;
                this.isScared = false;
            }
            
            this.x = (this.x < initialX ? initialX : initialX + this.maxDistance);
            this.velX = -this.velX;
        }
        
        if(!this.isAlive()){
            this.canGoThroughFloor = true;
        }
                
        // Accel, Speed, Pos.
        this.updatePhysics();
    }
    
    this.escape = function(forward){
        if(forward){
            initialX = this.x;
        }
        else{
            initialX = this.x - this.maxDistance;
        }
        
        if(!this.isScared){
            var directionMultiplicator = (forward ? 1 : -1);
            var velXAbs = Math.max(this.velX, -this.velX);
            
            this.isScared = true;
            this.velX = this.escapeVelCoeff * directionMultiplicator * velXAbs;
        }
    }
}

Ennemy.inheritsFrom(LivingObject);