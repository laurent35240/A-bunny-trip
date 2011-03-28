/* 
 * @author Laurent Clouet <laurent35240@gmail.com>
 * @copyright Copyright (c) 2011 A Bunny Trip (http://www.a-bunny-trip.com/)
 */

function Camera(objectTracked){
    this.objectTracked = objectTracked;
    
    this.x = 0;
    this.y = 0;
    this.left = 0;
    this.right = 0;
    this.bottom = 0;
    this.top = 0;
    
    this.followRatio = 16;
    
    this.update = function(){
        this.x = this.x + ( this.objectTracked.x - this.x ) / this.followRatio;
        this.y = this.y + ( this.objectTracked.y - this.y ) / this.followRatio;
    
        this.left      = this.x - canvas.width / 2;
        this.right     = this.x + canvas.width / 2;
        this.top       = this.y - 2 * canvas.height / 3;
        this.bottom    = this.y + 1 * canvas.height / 3;
    }
    
}
