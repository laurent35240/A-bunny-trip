/* 
 * @author Laurent Clouet <laurent35240@gmail.com>
 * @copyright Copyright (c) 2011 A Bunny Trip (http://www.a-bunny-trip.com/)
 */

function Level(levelMap){
    this.blockWidth = 40;
    this.blockHeight = 40;
    
    //Creating new obstacles
    this.obstacles = [];
    
    var levelLayer;
    for(var i=0; i<levelMap.length; i++){
        levelLayer = levelMap[i];
        
        for(var j=0; j<levelLayer.length; j++){
            levelBlockValue = levelLayer[j];
            if(levelBlockValue == 1){
                this.obstacles.push(new Obstacle(j * this.blockWidth, (i - levelMap.length + 1) * this.blockHeight, this.blockWidth, this.blockHeight));
            }
        }
    }
    
//    for(var i=0; i<100; i++){
//        this.obstacles.push(new Obstacle(i*160 + 300, (i%3) * 20 -70, this.blockWidth, this.blockHeight));
//    }
    
    this.draw = function(){
        //Draw obstacles
        for(var i=0; i < this.obstacles.length; i ++){
            this.obstacles[i].draw();
        }
    }
}
