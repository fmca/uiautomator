'use strict'

var proc = require("child_process");

class Setup {
	constructor(apks, port) {
		this._apks = apks;
		this._port = port;
	}

	init(install) {
		if (install) this._install();
		this._forward();
		this._start();
	}

	_install() {
		for (var index in this._apks) {
			proc.execSync('adb install -rt ' + this._apks[index]);
		}
	}

	_forward() {
		proc.execSync('adb forward tcp:' + this._port + " tcp:" + this._port);
	}

	_start() {
		this._uiautomator_process = proc.spawn('adb', ['shell', 'am', 'instrument', '-w',
			'com.github.uiautomator.test/android.support.test.runner.AndroidJUnitRunner']);
	}
}

module.exports = Setup