/* 
 * @author Laurent Clouet <laurent35240@gmail.com>
 * @copyright Copyright (c) 2011 A Bunny Trip (http://www.a-bunny-trip.com/)
 * 
 * Class responsible for creating any animations
 */

function Animation(imgSrc, frameSequence){
    this.frameSequence = frameSequence;
    
    //gfx part
    var imgLoaded = false;
    this.img = new Image();
    this.img.src = imgSrc;
    this.img.onload = function(){
        imgLoaded = true;
    }
    
    var nameOfCurrentFrame = 'frame2';
    var timeOfLastFrame = 0;
    var currentFrameIndex = 0;
    this.drawAnimation = function(x, y, width, height){
        //Animation can be drawn ony if image is loaded
        if(imgLoaded){
            var frame1 = {
                x: 0,
                y: 0,
                width: 210,
                height: 195
            };
            var frame2 = {
                x: 210,
                y: 0,
                width: 210,
                height: 195
            };
            var frame3 = {
                x: 420,
                y: 0,
                width: 210,
                height: 195
            };

            var frameToDraw = {};
            var nextFrame = {};
            var frameDuration = 200;
            var currentDate = new Date();
            if(currentDate.getTime() - timeOfLastFrame > frameDuration){
                currentFrameIndex++;
                currentFrameIndex = currentFrameIndex % 4;

                timeOfLastFrame = currentDate.getTime();
            }

            nameOfCurrentFrame = this.frameSequence[currentFrameIndex];

            if(nameOfCurrentFrame == 'frame2'){
                frameToDraw = frame2;
            }
            else if(nameOfCurrentFrame == 'frame3'){
                frameToDraw = frame3;
            }
            else{
                frameToDraw = frame1;
            }

            ctx.drawImage(
                this.img,
                frameToDraw['x'],
                frameToDraw['y'],
                frameToDraw['width'],
                frameToDraw['height'],
                x,
                y, 
                width, 
                height
            );
        }
    }
}
