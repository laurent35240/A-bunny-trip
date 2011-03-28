var canvas;
var ctx;
var FRAME_DURATION = 18;

// Variables for fps
var totalTimer;
var fps;
var frameCount;
var fpsTimer;

var camera;

// Nemo.
var nemo;

var control;
var obstacles;

var ennemies;

// Gravity definition.
var GRAVITY = 550;


function init(){
    canvas = document.getElementById('canvas');
    
    if(canvas.getContext){
        ctx = canvas.getContext('2d');
        initGame();
    }
}

function initGame(){
    totalTimer = 0;
    fps = 0;
    frameCount = 0;
    fpsTimer = 0;
    
    //initCamera();
    nemo = new Actor(0,0,49,46);
    camera = new Camera(nemo);
    camera.update();
    control = new Control();
    
    //Creating new obstacles
    obstacles = new Array();
    for(var i=0; i<100; i++){
        obstacles.push(new Obstacle(i*160 + 300, (i%3) * 20 -70, 10, 100));
    }
    
    //Creating ennemies
    ennemies = new Array();
    for(var j=0; j<10; j++){
        ennemies.push(new Ennemy(50 + 100*j, 0, 32, 46));
    }
    
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
    control.updateKeys();
    updateGame();
    drawGame();
    
    totalTimer += FRAME_DURATION;
    
}

function updateGame(){
    
    camera.update();
    nemo.update();
    
    for(var i=0; i<ennemies.length; i++){
        ennemies[i].update();
    }
    
    updateCollision();
    
}

function updateCollision(){
    //Check nemo vs obstacles
    for(var i=0; i < obstacles.length; i ++){
        nemo.adjust(obstacles[i]);
    }
    
    for(var j=0; j < ennemies.length; j ++){
        nemo.adjustWithEnnemy(ennemies[j]);
    }
    
}

function drawGame(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = "#000";
    ctx.fillText( "fps=" + fps, 20 , 20 );
    
    //Debug
    ctx.fillStyle = "#000";
    ctx.fillText( "accelY=" + nemo.accelY, 20 , 40 );
    ctx.fillText( "velY=" + nemo.velY, 20 , 50 );
    ctx.fillText( "Y=" + nemo.y, 20 , 60 );
    ctx.fillText( "life=" + nemo.life, 20 , 70 );

    // Draw background.
    drawBackground();
    
    //Draw obstacles
    for(var i=0; i < obstacles.length; i ++){
        obstacles[i].draw();
    }
    
    // Draw Nemo.
    nemo.draw();
    
    //Draw ennemies
    for(var j=0; j < ennemies.length; j++){
        ennemies[j].draw();
    }
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
        ctx.fillRect( fx - ( camera.left / 2 ) , ( ( ( fy % 200 ) - 250 ) / 2 ) - camera.top , 100 , 42 );
    }
    
    // Ground.
    ctx.fillStyle = "rgb(0,150,0)";
    ctx.fillRect( 0 , -camera.top , canvas.width , canvas.height );
    
    // Flowers.
    ctx.fillStyle = "rgb(255,0,0)";
    fy = 0;
    for (fx = -1000 ; fx < 1000 ; fx += 140 )
    {
        fy += 65;
        
        // Draw single flower.
        ctx.fillRect( fx - camera.left , ( fy % 100 ) - camera.top , 10 , 10 );
    }
    
}

//Launching game when document is loaded
window.onload = function(){
    init();
}