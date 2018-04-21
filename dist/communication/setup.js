'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _child_process = require('child_process');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Setup = function () {
  function Setup(apks, options) {
    _classCallCheck(this, Setup);

    this._apks = apks;
    this._port = options.port;
    this._devicePort = options.devicePort;
    this._serial = options.serial;
  }

  /**
   * @returns Promise
   */


  _createClass(Setup, [{
    key: 'init',
    value: function init() {
      this._installIfNecessary();
      this._forward();
      this._start();
      return Promise.resolve();
    }
  }, {
    key: '_installIfNecessary',
    value: function _installIfNecessary() {
      var packages = (0, _child_process.execSync)('adb shell pm list packages').toString().split('\n');
      var hasApp = false;
      var hasTestApp = false;
      for (var i = 0; i < packages.length; i += 1) {
        var pkg = packages[i];
        hasApp = hasApp || pkg.indexOf('com.github.uiautomator') >= 0;
        hasTestApp = hasTestApp || pkg.indexOf('com.github.uiautomator.test') >= 0;
      }

      if (!hasApp || !hasTestApp) {
        for (var index = 0; index < this._apks.length; index += 1) {
          (0, _child_process.execSync)(['adb', 'install'].concat(this._serialArr()).concat([this._apks[index]]).join(' '));
        }
      }
    }
  }, {
    key: '_forward',
    value: function _forward() {
      (0, _child_process.execSync)(['adb'].concat(this._serialArr()).concat(['forward', 'tcp:' + this._port, 'tcp:' + this._devicePort]).join(' '));
    }
  }, {
    key: '_start',
    value: function _start() {
      this._uiautomator_process = (0, _child_process.spawn)('adb', this._serialArr().concat(['shell', 'am', 'instrument', '-w', 'com.github.uiautomator.test/android.support.test.runner.AndroidJUnitRunner']));
    }
  }, {
    key: '_serialArr',
    value: function _serialArr() {
      return this._serial ? ['-s', this._serial] : [];
    }
  }, {
    key: 'process',
    value: function process() {
      return this._uiautomator_process;
    }
  }]);

  return Setup;
}();

exports.default = Setup;