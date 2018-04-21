

import { execSync, spawn } from 'child_process';

class Setup {
  constructor(apks, options) {
    this._apks = apks;
    this._port = options.port;
    this._devicePort = options.devicePort;
    this._serial = options.serial;
  }

  /**
   * @returns Promise
   */
  init() {
    this._installIfNecessary();
    this._forward();
    this._start();
    return Promise.resolve();
  }

  _installIfNecessary() {
    const packages = execSync('adb shell pm list packages').toString().split('\n');
    let hasApp = false;
    let hasTestApp = false;
    for (let i = 0; i < packages.length; i += 1) {
      const pkg = packages[i];
      hasApp = hasApp || pkg.indexOf('com.github.uiautomator') >= 0;
      hasTestApp = hasTestApp || pkg.indexOf('com.github.uiautomator.test') >= 0;
    }

    if (!hasApp || !hasTestApp) {
      for (let index = 0; index < this._apks.length; index += 1) {
        execSync(['adb', 'install']
          .concat(this._serialArr())
          .concat([this._apks[index]]).join(' '));
      }
    }
  }

  _forward() {
    execSync(['adb']
      .concat(this._serialArr())
      .concat(['forward', `tcp:${this._port}`, `tcp:${this._devicePort}`]).join(' '));
  }

  _start() {
    this._uiautomator_process = spawn('adb', this._serialArr().concat(['shell', 'am', 'instrument', '-w',
      'com.github.uiautomator.test/android.support.test.runner.AndroidJUnitRunner']));
  }

  _serialArr() {
    return this._serial ? ['-s', this._serial] : [];
  }

  process() {
    return this._uiautomator_process;
  }
}

export default Setup;
