/* 
 * @author Laurent Clouet <laurent35240@gmail.com>
 * @copyright Copyright (c) 2011 A Bunny Trip (http://www.a-bunny-trip.com/)
 */

function LivingObject(){
    this.life;
    
    this.isAlive = function(){
        return (this.life > 0);
    }
}

LivingObject.inheritsFrom(MovingObject);