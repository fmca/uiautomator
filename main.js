'use strict'

var sync = require("synchronize");
var ui = require("./ui")
var d = new ui.Device();

sync(d.server, 'isAlive');


sync.fiber(function(){
    
    var alive = d.server.isAlive();
    console.log(alive);
    d.home(function(err, data){
        console.log(err, data);
    });
})