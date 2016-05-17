'use strict'

var request = require("request");
var sync = require("synchronize");
var Setup = require("./setup");

class Server {

	constructor(host, port) {
		this.url = new String(host) + ":" + new String(port) + '/jsonrpc/0';
		this._counter = 0;
		this._callbacks = {};
		this._setup = new Setup(['libs/app.apk', 'libs/app-test.apk'], port);
		this._setup.init(false);
	}

	isAlive(cb) {
		request.post(this.url, {
			json: {
				jsonrpc: '2.0',
				method: 'ping',
				params: [],
				id: -1
			}
		}, function (err, res, body) {
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
		request.post(this.url, { json: params },
			function (err, res, body) {
				if (err) {
					console.error("FATAL ERROR", err);
				} else {
					var cb = self._callbacks[body.id];
					delete self._callbacks[body.id];
					if (body.error) {
						cb(body.error, undefined);
					}
					cb(undefined, body.result);
				}
			});
	}
}

var server = new Server('http://localhost', 9008);

module.exports = server;