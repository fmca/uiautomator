'use strict'

var humps = require("humps");
var Server = require("../communication");
var Selector = require("./selector");

class Device {
    
    constructor(cb) {        
        var pressKeyMethods = ['home', 'volumeUp', 'volumeDown', 'volumeMute', 'back', 'right', 'left',
            'up', 'down', 'menu', 'search', 'center', 'enter', 'delete', 'recent', 'camera', 'power'
        ];
        var aloneMethods = ['wakeUp', 'sleep', 'openNotification', 'openQuickSettings'];
        this._register(pressKeyMethods, 'pressKey');
        this._register(aloneMethods);  
        var self = this;
        this._server = new Server(function(err, data){
            cb(err, self);
        }); 
    }
    
    stop(cb){
        this._server.stop(cb);
    }

    isConnected(cb){
        this._server.isAlive(cb);
    }
    
    click(selector, cb){
        var preparedSelector = new Selector(selector);
        this._server.send('click', [preparedSelector], cb);
    }
    
    info(cb){
        this._server.send('deviceInfo', [], cb);
    }

    
    _register(methods, prefix){
        for (let index in methods) {
            let methodName = methods[index];
            let decamelizedMethodName = humps.decamelize(methodName);
            if(prefix){
                this[methodName] = function (cb) { this._server.send(prefix, [decamelizedMethodName], cb) };
            }else{
                this[methodName] = function (cb) { this._server.send(methodName, [], cb) };
            }
        }
    }
    
}

exports.Device = Device;


