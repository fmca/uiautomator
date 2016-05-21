'use strict'

var request = require("request");
var Setup = require("./setup");
const DELAY = 500;
const HOST = 'http://localhost';
const PORT = 9008;
const MAX_CONNECTION_TRIES = 10;
const CONNECTION_TRY_DELAY = 1000;

class Server {

	constructor(cb) {
		this.url = new String(HOST) + ':' + new String(PORT);
		this.jsonrpc_url = this.url + '/jsonrpc/0';
		this.stop_url = this.url  + '/stop';
		this._counter = 0;
		this._callbacks = {};
		this._setup = new Setup(['libs/app.apk', 'libs/app-test.apk'], PORT);
		this._setup.init();
		this._connectionTries = 0;
		this._responseCallback = cb;
		this.verifyConnection();
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
					if(self.connectionTries > MAX_CONNECTION_TRIES){
						self._responseCallback(err, this)
					}else{
						self.connectionTries += 1;
						self.verifyConnection();
					}
				}else{
					self._responseCallback(err, this);
				}
			})
		}, CONNECTION_TRY_DELAY);
		
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
		}, DELAY);
		
	}
}

module.exports = Server;