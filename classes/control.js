/* 
 * @author Laurent Clouet <laurent35240@gmail.com>
 * @copyright Copyright (c) 2011 A Bunny Trip (http://www.a-bunny-trip.com/)
 */

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
    
    //Key management
    this.keys = 0;
    this.keysAsync = 0;
    this.JOY_UP      = 1 << 0;
    this.JOY_DOWN    = 1 << 1;
    this.JOY_LEFT    = 1 << 2;
    this.JOY_RIGHT   = 1 << 3;
    this.JOY_BTN_A   = 1 << 4;
    this.JOY_BTN_B   = 1 << 5;
    this.JOY_BTN_C   = 1 << 6;


    
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
                this.keysAsync |= this.JOY_BTN_A;
                break;

            case this.keyCodes['c']:
            case this.keyCodes['C']:
                this.keysAsync |= this.JOY_BTN_B;
                break;

            case this.keyCodes['v']:
            case this.keyCodes['V']:
                this.keysAsync |= this.JOY_BTN_C;
                break;

            case this.keyCodes['left']:this.keysAsync |= this.JOY_LEFT;break;
            case this.keyCodes['up']:this.keysAsync |= this.JOY_UP;break;
            case this.keyCodes['right']:this.keysAsync |= this.JOY_RIGHT;break;
            case this.keyCodes['down']:this.keysAsync |= this.JOY_DOWN;break;
        }
    }


    this.onKeyUp = function( event )
    {
        switch( event.keyCode )
        {
            case this.keyCodes['space']:
            case this.keyCodes['x']:
            case this.keyCodes['X']:
                this.keysAsync &= ~this.JOY_BTN_A;
                break;

            case this.keyCodes['c']:
            case this.keyCodes['C']:
                this.keysAsync &= ~this.JOY_BTN_B;
                break;

            case this.keyCodes['v']:
            case this.keyCodes['V']:
                this.keysAsync &= ~this.JOY_BTN_C;
                break;

            case this.keyCodes['left']:this.keysAsync &= ~this.JOY_LEFT;break;
            case this.keyCodes['up']:this.keysAsync &= ~this.JOY_UP;break;
            case this.keyCodes['right']:this.keysAsync &= ~this.JOY_RIGHT;break;
            case this.keyCodes['down']:this.keysAsync &= ~this.JOY_DOWN;break;
        }
    }
    
    this.updateKeys = function(){
        this.keys = this.keysAsync;

    }
}