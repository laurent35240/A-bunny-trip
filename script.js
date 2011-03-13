var canvas;
var ctx;
var canvasWidth;
var canvasHeight;
var x;
var y;
var speedX;
var speedY;
var FRAME_DURATION = 18;
var totalTimer;
var fps;
var frameCount;
var fpsTimer;
var SPEED = 30;
var BOX_WIDTH = 32;
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

// Gravity definition.
var GRAVITY = +200;


function init(){
    canvas = document.getElementById('canvas');
    
    document.onkeydown = function(e){
        onKeyDown(e);
    };
    
    document.onkeyup = function(e){
        onKeyUp(e);
    };
    
    canvasWidth = canvas.width;
    canvasHeight = canvas.height;
    if(canvas.getContext){
        ctx = canvas.getContext('2d');
        
    }
    
    initGame();
    
    
}

function updateKeys(){
    keys = keysAsync;
    //keysAsync = 0;
}

function onKeyDown( event )
{
    switch( event.keyCode )
    {
        case 120:
        case 88:
        case 32:
            keysAsync |= JOY_BTN_A;
            break;
        
        case 99:
        case 67:
            keysAsync |= JOY_BTN_B;
            break;
            
        case 118:
        case 86:
            keysAsync |= JOY_BTN_C;
            break;
        
        case 37:keysAsync |= JOY_LEFT;break;
        case 38:keysAsync |= JOY_UP;break;
        case 39:keysAsync |= JOY_RIGHT;break;
        case 40:keysAsync |= JOY_DOWN;break;
    }
}


function onKeyUp( event )
{
    switch( event.keyCode )
    {
        case 120:
        case 88:
        case 32:
            keysAsync &= ~JOY_BTN_A;
            break;
        
        case 99:
        case 67:
            keysAsync &= ~JOY_BTN_B;
            break;
            
        case 118:
        case 86:
            keysAsync &= ~JOY_BTN_C;
            break;
            
        case 37:keysAsync &= ~JOY_LEFT;break;
        case 38:keysAsync &= ~JOY_UP;break;
        case 39:keysAsync &= ~JOY_RIGHT;break;
        case 40:keysAsync &= ~JOY_DOWN;break;
    }
}

function initCamera()
{
    cameraX = 0;
    cameraY = 0;
    updateCamera();
}

function updateCamera()
{
    //if ( ( keys & JOY_LEFT     ) != 0 )    cameraX -= 1;
    //if ( ( keys & JOY_RIGHT    ) != 0 )    cameraX += 1;
    //if ( ( keys & JOY_UP       ) != 0 )    cameraY -= 1;
    //if ( ( keys & JOY_DOWN     ) != 0 )    cameraY += 1;
    
    // Nemo tracking.
    if ( nemo )
    {
        cameraX = cameraX + ( nemo.posX - cameraX ) / 16;
        cameraY = cameraY + ( nemo.posY - cameraY ) / 16;
    }
    
    cameraLeft      = cameraX - canvasWidth / 2;
    cameraRight     = cameraX + canvasWidth / 2;
    cameraTop       = cameraY - 2 * canvasHeight / 3;
    cameraBottom    = cameraY + 1 * canvasHeight / 3;
}

function initGame(){
    x = BOX_WIDTH / 2;
    y = canvasHeight - BOX_WIDTH / 2;
    speedX = SPEED;
    speedY = SPEED;
    totalTimer = 0;
    fps = 0;
    frameCount = 0;
    fpsTimer = 0;
    
    initCamera();
    nemo = new Actor();
    
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
    //
    updateFps();
    updateKeys();
    updateGame();
    drawGame();
    //
    
    totalTimer += FRAME_DURATION;
        
    
}

function updateGame(){
    
    updateCamera();
    nemo.update();
    
    speedX = 0;
    speedY = 0;

    if ( ( keys & JOY_LEFT     ) != 0 )    speedX += -SPEED;
    if ( ( keys & JOY_RIGHT    ) != 0 )    speedX += +SPEED;
    if ( ( keys & JOY_UP       ) != 0 )    speedY += -SPEED;
    if ( ( keys & JOY_DOWN     ) != 0 )    speedY += +SPEED;
    
      
    if ( ( keys & JOY_BTN_A    ) != 0 )    
    {
        speedX *= 2;
        speedY *= 2;
    }
    
    if ( ( keys & JOY_BTN_B    ) != 0 )    
    {
        speedX *= 4;
        speedY *= 4;
    }
    
    if ( ( keys & JOY_BTN_C    ) != 0 )    
    {
        speedX *= 8;
        speedY *= 8;
    }
    
    x = x + ( speedX*FRAME_DURATION ) /1000;
    y = y + ( speedY*FRAME_DURATION ) /1000;
    
    
    
    if(x > ( canvasWidth - BOX_WIDTH / 2 ) ){
        x = canvasWidth - BOX_WIDTH / 2 ;
    }
    if(x < BOX_WIDTH / 2 ){
        x = BOX_WIDTH / 2;
    }
    if(y > ( canvasHeight - BOX_WIDTH / 2) ){
        y = ( canvasHeight - BOX_WIDTH / 2);
    }
    if(y < BOX_WIDTH / 2) {
        y = BOX_WIDTH / 2;
    }
    
    
}

function drawGame(){
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    
    ctx.fillStyle = "#000";
    ctx.fillText( "fps=" + fps, 20 , 20 );
    
    //ctx.fillStyle = "#000";
    //ctx.fillText( "accelY=" + nemo.accelY, 20 , 40 );
    ctx.fillStyle = "#000";
    ctx.fillText( "accelY=" + nemo.accelY, 20 , 40 );
    ctx.fillText( "velY=" + nemo.velY, 20 , 60 );

    // Draw background.
    drawBackground();
    
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
    ctx.fillRect( 0 , -cameraTop , canvasWidth , canvasHeight );
    
    // Flowers.
    ctx.fillStyle = "rgb(255,0,0)";
    var fy = 0;
    for ( var fx = -1000 ; fx < 1000 ; fx += 140 )
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
    
    this.jumpStartY = 0;
    this.jumpImpulseFinished = true;
    
    
    this.NEMO_WIDTH     = 32;
    this.NEMO_HEIGHT    = 46;
    
    // 20 pixel per second.
    this.NEMO_SPEED_X   = 150;
    
    this.ACCEL_JUMP = 200;
    
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
            
            console.log( deltaY );
            
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
        if ( this.onGround )
        {
            
        }
        else
        {
            
        }
        
        // Acceleration clamping.
        //this.accelX = clamp( this.accelX , -this.MAX_ACCEL , +this.MAX_ACCEL );
        //this.accelY = clamp( this.accelY , -this.MAX_ACCEL ,
        //   this.onGround ? 0 : +this.MAX_ACCEL );
        
        // Accel => Speed.
        this.velX += this.accelX * FRAME_DURATION / 1000;
        this.velY += this.accelY * FRAME_DURATION / 1000;
        
        // Speed clamping.
        this.velX = clamp( this.velX , -this.MAX_SPEED , +this.MAX_SPEED );
        //this.velY = clamp( this.velY , -this.MAX_SPEED , +this.MAX_SPEED );
        
        // Gravity.
        this.velY += 550 * FRAME_DURATION / 1000;
    
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
        
        ctx.fillStyle = "rgb(200,200,0)";
        ctx.fillRect(   screenX - this.NEMO_WIDTH / 2 ,
                        screenY - this.NEMO_HEIGHT,
                        this.NEMO_WIDTH , this.NEMO_HEIGHT );
    }
}