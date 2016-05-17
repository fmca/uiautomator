'use strict'

var humps = require("humps");
var server = require("../communication").server;

class Device {
    constructor() {
        this._server = server;
        var serverMethodNames = ['home', 'info', 'volumeUp', 'volumeDown'];

        for (let index in serverMethodNames) {
            let methodName = serverMethodNames[index];
            let decamelizedMethodName = humps.decamelize(methodName);
            this[methodName] = function (cb) { this._server.send("pressKey", [decamelizedMethodName], cb) };
        }
    }
    
    isConnected(cb){
        this._server.isAlive(cb);
    }
}

exports.Device = Device;


