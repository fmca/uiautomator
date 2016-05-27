'use strict'

var path = require('path')
var fs = require('fs');
var request = require("request");
var url = require("url");
var Setup = require("./setup");
var defaultOptions = {
	hostname: 'localhost',
	delay: 500,
	port: 9008,
	devicePort: 9008,
	connectionMaxTries: 5,
	connectionTriesDelay: 1000
}

var getPath = function (relativePath) {
	return path.join(path.dirname(fs.realpathSync(__filename)), relativePath);
}

class Server {

	constructor(cb, newOptions) {
		this.options = Object.assign({}, defaultOptions, newOptions);
		this.url = url.format({protocol: 'http', hostname: this.options.hostname, port: this.options.port});
		this.jsonrpc_url = url.resolve(this.url, '/jsonrpc/0');
		this.stop_url = url.resolve(this.url, '/stop');
		this._counter = 0;
		this._callbacks = {};
		this._setup = new Setup([
			getPath('../libs/app.apk'),
			getPath('../libs/app-test.apk')],
			this.options);
		this._connectionTries = 0;
		this._responseCallback = cb;
		this._setup.init(() => {
			this.verifyConnection();
		});
	}
	stop(){
		request.get(this.stop_url, {}, function(err, body, result){
		});
		this._setup.process().stdin.pause();
		this._setup.process().kill();
	}

	verifyConnection(){
		var self = this;
		setTimeout(() => {
			self.isAlive((err, result) => {
				if(err){
					if(self.connectionTries > self.options.connectionMaxTries){
						self._responseCallback(err, this)
					}else{
						self.connectionTries += 1;
						self.verifyConnection();
					}
				}else{
					self._responseCallback(err, this);
				}
			})
		}, this.options);
		
	}

	isAlive(cb) {
		request.post(this.jsonrpc_url, {
			json: {
				jsonrpc: '2.0',
				method: 'ping',
				params: [],
				id: "1"
			}
		}, (err, res, body) => {
			cb(err, body && body.result == 'pong')
		});

	}

	send(method, extraParams, cb) {		
		this._counter = this._counter + 1;
		var params = {
			jsonrpc: '2.0',
			method: method,
			params: extraParams,
			id: this._counter
		}
		var self = this;		
		self._callbacks[params.id] = cb;
		setTimeout(() => {
			request.post(this.jsonrpc_url, { json: params },
			(err, res, body) => {
				if (err) {
					console.error("FATAL ERROR", err);
				} else {
					var cb = self._callbacks[body.id];
					delete self._callbacks[body.id];
					if (body.error) {
						cb(body.error, undefined);
					}else{
						cb(undefined, body.result);
					}
				}
			})
		}, self.options.delay);
		
	}
}

module.exports = Server;