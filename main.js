'use strict'

var sync = require("synchronize");
var ui = require("./ui")
var d = new ui.Device();

sync(d, 'isConnected');
sync(d, 'home');
sync(d, 'volumeUp');
sync(d, 'volumeDown');


sync.fiber(function(){
    
    while(!d.isConnected()){
        //wait
    }
    d.home();
    d.volumeUp();
    d.volumeDown();
    
})