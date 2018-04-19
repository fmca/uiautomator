import { decamelize } from 'humps';
import Server from '../communication';
import Selector from './selector';

class Device {
  constructor(cb, options) {
    const pressKeyMethods = ['home', 'volumeUp', 'volumeDown', 'volumeMute', 'back', 'right', 'left',
      'up', 'down', 'menu', 'search', 'center', 'enter', 'delete', 'recent', 'camera', 'power',
    ];
    const aloneMethods = ['wakeUp', 'sleep', 'openNotification', 'openQuickSettings'];
    this._register(pressKeyMethods, 'pressKey');
    this._register(aloneMethods);
    const self = this;
    this._server = new Server(((err) => {
      cb(err, self);
    }), options);
  }

  stop(cb) {
    this._server.stop(cb);
  }

  isConnected(cb) {
    this._server.isAlive(cb);
  }

  click(selector, cb) {
    const preparedSelector = new Selector(selector);
    this._server.send('click', [preparedSelector], cb);
  }

  info(cb) {
    this._server.send('deviceInfo', [], cb);
  }


  _register(methods, prefix) {
    for (let index = 0; index < methods.length; index += 1) {
      const methodName = methods[index];
      const decamelizedMethodName = decamelize(methodName);
      if (prefix) {
        this[methodName] = cb => this._server.send(prefix, [decamelizedMethodName], cb);
      } else {
        this[methodName] = cb => this._server.send(methodName, [], cb);
      }
    }
  }
}

const _Device = Device;
export default _Device;

