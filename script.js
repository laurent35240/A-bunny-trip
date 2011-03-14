var canvas;
var ctx;
var FRAME_DURATION = 18;
var totalTimer;
var fps;
var frameCount;
var fpsTimer;

//Key management
var key;
var keyAsync;
var keys;
var keysAsync;
var JOY_UP      = 1 << 0;
var JOY_DOWN    = 1 << 1;
var JOY_LEFT    = 1 << 2;
var JOY_RIGHT   = 1 << 3;
var JOY_BTN_A   = 1 << 4;
var JOY_BTN_B   = 1 << 5;
var JOY_BTN_C   = 1 << 6;

// Camera values.
var cameraX;
var cameraY;
var cameraTop;
var cameraLeft;
var cameraBottom;
var cameraRight;

// Nemo.
var nemo;

var control;
var obstacle;

// Gravity definition.
var GRAVITY = 550;


function init(){
    canvas = document.getElementById('canvas');
    
    if(canvas.getContext){
        ctx = canvas.getContext('2d');
        initGame();
    }
}

function updateKeys(){
    keys = keysAsync;
    //keysAsync = 0;
}

function initCamera()
{
    cameraX = 0;
    cameraY = 0;
    updateCamera();
}

function updateCamera()
{
    // Nemo tracking.
    if ( nemo )
    {
        cameraX = cameraX + ( nemo.posX - cameraX ) / 16;
        cameraY = cameraY + ( nemo.posY - cameraY ) / 16;
    }
    
    cameraLeft      = cameraX - canvas.width / 2;
    cameraRight     = cameraX + canvas.width / 2;
    cameraTop       = cameraY - 2 * canvas.height / 3;
    cameraBottom    = cameraY + 1 * canvas.height / 3;
}

function initGame(){
    totalTimer = 0;
    fps = 0;
    frameCount = 0;
    fpsTimer = 0;
    
    initCamera();
    nemo = new Actor();
    control = new Control();
    obstacle = new Obstacle();
    
    setInterval(gameLoop, FRAME_DURATION);
}

function updateFps(){
    frameCount ++;
    fpsTimer += FRAME_DURATION;
    
    if(fpsTimer > 1000){
        fps = frameCount;
        frameCount = 0;
        fpsTimer -= 1000;
    }
}

function gameLoop(){
    updateFps();
    updateKeys();
    updateGame();
    drawGame();
    
    totalTimer += FRAME_DURATION;
    
}

function updateGame(){
    
    updateCamera();
    nemo.update();
    
    updateCollision();
    
}

function updateCollision(){
    //Check nemo vs obstacles
    nemo.adjust(obstacle);
}

function drawGame(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = "#000";
    ctx.fillText( "fps=" + fps, 20 , 20 );
    
    //Debug
    ctx.fillStyle = "#000";
    ctx.fillText( "accelY=" + nemo.accelY, 20 , 40 );
    ctx.fillText( "velY=" + nemo.velY, 20 , 50 );
    ctx.fillText( "Y=" + nemo.posY, 20 , 60 );

    // Draw background.
    drawBackground();
    
    //Draw obstaces
    obstacle.draw();
    
    // Draw Nemo.
    nemo.draw();
}

function clamp( value , min , max )
{
    if ( value < min ) return min;
    if ( value > max ) return max;
    
    return value;
}

function drawBackground() {
    
    // Clouds.
    ctx.fillStyle = "rgb(150,190,255)";
    var fy = 0;
    for ( var fx = -1000 ; fx < 1000 ; fx += 170 )
    {
        fy += 90;
        
        // Draw single cloud.
        ctx.fillRect( fx - ( cameraLeft / 2 ) , ( ( ( fy % 200 ) - 250 ) / 2 ) - cameraTop , 100 , 42 );
    }
    
    // Ground.
    ctx.fillStyle = "rgb(0,150,0)";
    ctx.fillRect( 0 , -cameraTop , canvas.width , canvas.height );
    
    // Flowers.
    ctx.fillStyle = "rgb(255,0,0)";
    fy = 0;
    for (fx = -1000 ; fx < 1000 ; fx += 140 )
    {
        fy += 65;
        
        // Draw single flower.
        ctx.fillRect( fx - cameraLeft , ( fy % 100 ) - cameraTop , 10 , 10 );
    }
    
}

function Actor(){
    this.posX = 0;
    this.posY = 0;
    this.velX = 0;
    this.velY = 0;
    this.accelX = 0;
    this.accelY = 0;
    this.onGround = true;
    this.isHumping = false;
    this.color = "rgb(200,200,0)";
    
    this.jumpStartY = 0;
    this.jumpImpulseFinished = true;
    
    
    this.width     = 32;
    this.height    = 46;
    
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
            if ( ( keys & JOY_LEFT     ) != 0 )    this.accelX = -400;
            if ( ( keys & JOY_RIGHT    ) != 0 )    this.accelX = +400;
            
            if ( ( keys & ( JOY_LEFT + JOY_RIGHT) ) == 0 )
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
            if ( ( keys & JOY_UP ) != 0 )
            {
                this.startJumpY = this.posY;
                this.onGround   = false;
                this.velY       = -200;
                this.jumpImpulseFinished = false;
            }
        }
        else
        {
            if ( ( keys & JOY_LEFT     ) != 0 )    this.accelX = -100;
            if ( ( keys & JOY_RIGHT    ) != 0 )    this.accelX = +100;
            
            // Continue jump.
            var deltaY = this.startJumpY - this.posY;
            
            if (          deltaY > 100
                    ||  ( keys & JOY_UP ) == 0 )
            {
                this.jumpImpulseFinished = true;
            }
            
            if ( (      keys & JOY_UP ) != 0 
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
        //this.velY = clamp( this.velY , -this.MAX_SPEED , +this.MAX_SPEED );
    
        // Speed => Positions.
        this.posX += this.velX * FRAME_DURATION / 1000;
        this.posY += this.velY * FRAME_DURATION / 1000;
        
        // Position clamping.
        if ( this.posY >= 0 )
        {
            this.posY = 0;
            this.velY = 0;
            this.accelY = 0;
            this.onGround = true;
        }
        
    }
    
    
    this.draw = function(){
        var screenX = this.posX - cameraLeft;
        var screenY = this.posY - cameraTop;
        
        ctx.fillStyle = this.color;
        ctx.fillRect(   screenX - this.width / 2 ,
                        screenY - this.height,
                        this.width , this.height );
    }
    
    this.adjust = function(obs){
        var actorLeft    = this.posX - this.width / 2;
        var actorRight   = this.posX + this.width / 2;
        var actorTop     = this.posY - this.height;
        var actorBottom  = this.posY;
        
        var obsLeft     = obs.x - obs.width / 2;
        var obsRight    = obs.x + obs.width / 2;
        var obsTop      = obs.y - obs.height;
        var obsBottom   = obs.y;
        
        var notOverlap  = actorRight     < obsLeft
                      ||  actorLeft      > obsRight
                      ||  actorTop       > obsBottom
                      ||  actorBottom    < obsTop;
              
       if(!notOverlap){
           var overlapTop = Math.max(0, actorBottom - obsTop);
           var overlapLeft = Math.max(0, actorRight - obsLeft);;
           var overlapRight = Math.max(0, obsRight - actorLeft);
           var overlapBottom = Math.max(0, obsBottom - actorTop);
           
           //Actor must be put back on top
           if(
            overlapTop > 0
            && this.velY > 0
            && overlapTop < overlapLeft
            && overlapTop < overlapRight
           ){
               this.posY = obsTop;
               this.accelY = 0;
               this.velY = 0;
               this.onGround = true;
           }
           
           //Actor must be put back on bottom
           if(
            overlapBottom > 0
            && this.velY < 0
            && overlapBottom < overlapLeft
            && overlapBottom < overlapRight
           ){
               this.posY += overlapBottom;
               this.accelY = GRAVITY;
               this.velY = 0;
               this.jumpImpulseFinished = true;
           }
           
           //Actor must be put back on left
           if(
            overlapLeft > 0
            && this.velX > 0
            && overlapLeft < overlapTop
            && overlapLeft < overlapBottom
           ){
               this.posX -= overlapLeft;
               this.accelX = 0;
               this.velX = 0;
           }
           
           //Actor must be put back on right
           if(
            overlapRight > 0
            && this.velX < 0
            && overlapRight < overlapTop
            && overlapRight < overlapBottom
           ){
               this.posX += (obsRight - actorLeft);
               this.accelX = 0;
               this.velX = 0;
           }
           
       }
    }
}

//Class managing the keys control
function Control(){
    this.keyCodes = new Array();
    this.keyCodes['X']       = 32
    this.keyCodes['left']    = 37;
    this.keyCodes['up']      = 38;
    this.keyCodes['right']   = 39;
    this.keyCodes['down']    = 40;
    this.keyCodes['C']       = 67;
    this.keyCodes['V']       = 86;
    this.keyCodes['x']       = 88;
    this.keyCodes['c']       = 99;
    this.keyCodes['v']       = 118;
    this.keyCodes['space']   = 120;

    
    //Control must start to listen to keyboard
    var insideControl = this;
    document.onkeydown = function(e){
        insideControl.onKeyDown(e);
    };
    
    document.onkeyup = function(e){
        insideControl.onKeyUp(e);
    };
    
    this.onKeyDown = function( event )
    {
        switch( event.keyCode )
        {
            case this.keyCodes['space']:
            case this.keyCodes['x']:
            case this.keyCodes['X']:
                keysAsync |= JOY_BTN_A;
                break;

            case this.keyCodes['c']:
            case this.keyCodes['C']:
                keysAsync |= JOY_BTN_B;
                break;

            case this.keyCodes['v']:
            case this.keyCodes['V']:
                keysAsync |= JOY_BTN_C;
                break;

            case this.keyCodes['left']:keysAsync |= JOY_LEFT;break;
            case this.keyCodes['up']:keysAsync |= JOY_UP;break;
            case this.keyCodes['right']:keysAsync |= JOY_RIGHT;break;
            case this.keyCodes['down']:keysAsync |= JOY_DOWN;break;
        }
    }


    this.onKeyUp = function( event )
    {
        switch( event.keyCode )
        {
            case this.keyCodes['space']:
            case this.keyCodes['x']:
            case this.keyCodes['X']:
                keysAsync &= ~JOY_BTN_A;
                break;

            case this.keyCodes['c']:
            case this.keyCodes['C']:
                keysAsync &= ~JOY_BTN_B;
                break;

            case this.keyCodes['v']:
            case this.keyCodes['V']:
                keysAsync &= ~JOY_BTN_C;
                break;

            case this.keyCodes['left']:keysAsync &= ~JOY_LEFT;break;
            case this.keyCodes['up']:keysAsync &= ~JOY_UP;break;
            case this.keyCodes['right']:keysAsync &= ~JOY_RIGHT;break;
            case this.keyCodes['down']:keysAsync &= ~JOY_DOWN;break;
        }
    }
}

function Obstacle(){
    this.x = 100;
    this.y = -100;
    this.height = 20;
    this.width = 1000;
    
    this.draw = function(){
        ctx.fillStyle = "rgb(0,230,0)";
        ctx.fillRect( -cameraLeft + this.x - this.width / 2, -cameraTop + this.y - this.height, this.width, this.height);
    }
}

//Launching game when document is loaded
document.body.onload = function(){
    init();
}