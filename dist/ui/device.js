'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _humps = require('humps');

var _communication = require('../communication');

var _communication2 = _interopRequireDefault(_communication);

var _selector = require('./selector');

var _selector2 = _interopRequireDefault(_selector);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var pressKeyMethods = ['home', 'volumeUp', 'volumeDown', 'volumeMute', 'back', 'right', 'left', 'up', 'down', 'menu', 'search', 'center', 'enter', 'delete', 'recent', 'camera', 'power'];
var aloneMethods = ['wakeUp', 'sleep', 'openNotification', 'openQuickSettings'];

var Device = function () {
  function Device(options) {
    _classCallCheck(this, Device);

    this._register(pressKeyMethods, 'pressKey');
    this._register(aloneMethods);
    this._server = new _communication2.default(options);
  }

  /**
   * @returns Promise
   */


  _createClass(Device, [{
    key: 'connect',
    value: function connect() {
      return this._server.start();
    }

    /**
     * @returns Promise
     */

  }, {
    key: 'stop',
    value: function stop() {
      return this._server.stop();
    }

    /**
     * @returns Promise
     */

  }, {
    key: 'isConnected',
    value: function isConnected() {
      return this._server.isAlive();
    }

    /**
     * @returns Promise
     */

  }, {
    key: 'click',
    value: function click(selector) {
      var preparedSelector = new _selector2.default(selector);
      return this._server.send('click', [preparedSelector]);
    }

    /**
     * @returns Promise
     */

  }, {
    key: 'info',
    value: function info() {
      return this._server.send('deviceInfo', []);
    }
  }, {
    key: '_register',
    value: function _register(methods, prefix) {
      var _this = this;

      var _loop = function _loop(index) {
        var methodName = methods[index];
        var decamelizedMethodName = (0, _humps.decamelize)(methodName);
        if (prefix) {
          _this[methodName] = function () {
            return _this._server.send(prefix, [decamelizedMethodName]);
          };
        } else {
          _this[methodName] = function () {
            return _this._server.send(methodName, []);
          };
        }
      };

      for (var index = 0; index < methods.length; index += 1) {
        _loop(index);
      }
    }
  }]);

  return Device;
}();

exports.default = Device;