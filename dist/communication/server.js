'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _path = require('path');

var _fs = require('fs');

var _request = require('request');

var _url = require('url');

var _setup = require('./setup');

var _setup2 = _interopRequireDefault(_setup);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var defaultOptions = {
  hostname: 'localhost',
  delay: 500,
  port: 9008,
  devicePort: 9008,
  connectionMaxTries: 5,
  connectionTriesDelay: 1000
};

var getPath = function getPath(relativePath) {
  return (0, _path.join)((0, _path.dirname)((0, _fs.realpathSync)(__filename)), relativePath);
};

var Server = function () {
  function Server(newOptions) {
    _classCallCheck(this, Server);

    this.options = Object.assign({}, defaultOptions, newOptions);
    this.url = (0, _url.format)({ protocol: 'http', hostname: this.options.hostname, port: this.options.port });
    this.jsonrpc_url = (0, _url.resolve)(this.url, '/jsonrpc/0');
    this.stop_url = (0, _url.resolve)(this.url, '/stop');
    this._counter = 0;
    this._setup = new _setup2.default([getPath('../libs/app.apk'), getPath('../libs/app-test.apk')], this.options);
    this._connectionTries = 0;
  }

  /**
   * @returns Promise
   */


  _createClass(Server, [{
    key: 'start',
    value: function start() {
      var self = this;
      return self._setup.init().then(function () {
        return self.verifyConnection();
      });
    }

    /**
     * @returns Promise
     */

  }, {
    key: 'stop',
    value: function stop() {
      (0, _request.get)(this.stop_url, {}, function () {});
      this._setup.process().stdin.pause();
      this._setup.process().kill();
      return Promise.resolve();
    }

    /**
     * @returns Promise
     */

  }, {
    key: 'verifyConnection',
    value: function verifyConnection(parentResolve, parentReject) {
      var _this = this;

      var self = this;
      return new Promise(function (resolve, reject) {
        var chosenResolve = parentResolve || resolve;
        var chosenReject = parentReject || reject;
        setTimeout(function () {
          self.isAlive().then(function (alive) {
            if (!alive) {
              if (self.connectionTries > self.options.connectionMaxTries) {
                return chosenReject();
              }
              return self.verifyConnection(chosenResolve, chosenReject);
            }
            return chosenResolve(self);
          });
        }, _this.options.connectionTriesDelay);
      });
    }

    /**
     * @returns Promise
     */

  }, {
    key: 'isAlive',
    value: function isAlive() {
      var _this2 = this;

      return new Promise(function (resolve) {
        (0, _request.post)(_this2.jsonrpc_url, {
          json: {
            jsonrpc: '2.0',
            method: 'ping',
            params: [],
            id: '1'
          }
        }, function (err, res, body) {
          return resolve(!err && body && body.result === 'pong');
        });
      });
    }

    /**
     * @returns Promise
     */

  }, {
    key: 'send',
    value: function send(method, extraParams) {
      var _this3 = this;

      this._counter = this._counter + 1;
      var params = {
        jsonrpc: '2.0',
        method: method,
        params: extraParams,
        id: this._counter
      };
      var self = this;
      return new Promise(function (resolve, reject) {
        setTimeout(function () {
          (0, _request.post)(_this3.jsonrpc_url, { json: params }, function (err, res, body) {
            if (err) return reject(err);
            if (body.error) return reject(body.error);
            return resolve(body.result);
          });
        }, self.options.delay);
      });
    }
  }]);

  return Server;
}();

exports.default = Server;