import { join, dirname } from 'path';
import { realpathSync } from 'fs';
import { get, post } from 'request';
import { format, resolve } from 'url';
import Setup from './setup';

const defaultOptions = {
  hostname: 'localhost',
  delay: 500,
  port: 9008,
  devicePort: 9008,
  connectionMaxTries: 5,
  connectionTriesDelay: 1000,
};

const getPath = relativePath => join(dirname(realpathSync(__filename)), relativePath);

class Server {
  constructor(cb, newOptions) {
    this.options = Object.assign({}, defaultOptions, newOptions);
    this.url = format({ protocol: 'http', hostname: this.options.hostname, port: this.options.port });
    this.jsonrpc_url = resolve(this.url, '/jsonrpc/0');
    this.stop_url = resolve(this.url, '/stop');
    this._counter = 0;
    this._callbacks = {};
    this._setup = new Setup(
      [getPath('../libs/app.apk'),
        getPath('../libs/app-test.apk')],
      this.options,
    );
    this._connectionTries = 0;
    this._responseCallback = cb;
    this._setup.init(() => {
      this.verifyConnection();
    });
  }
  stop() {
    get(this.stop_url, {}, () => {});
    this._setup.process().stdin.pause();
    this._setup.process().kill();
  }

  verifyConnection() {
    const self = this;
    setTimeout(() => {
      self.isAlive((err) => {
        if (err) {
          if (self.connectionTries > self.options.connectionMaxTries) {
            self._responseCallback(err, this);
          } else {
            self.connectionTries += 1;
            self.verifyConnection();
          }
        } else {
          self._responseCallback(err, this);
        }
      });
    }, this.options);
  }

  isAlive(cb) {
    post(this.jsonrpc_url, {
      json: {
        jsonrpc: '2.0',
        method: 'ping',
        params: [],
        id: '1',
      },
    }, (err, res, body) => {
      cb(err, body && body.result === 'pong');
    });
  }

  send(method, extraParams, cb) {
    this._counter = this._counter + 1;
    const params = {
      jsonrpc: '2.0',
      method,
      params: extraParams,
      id: this._counter,
    };
    const self = this;
    self._callbacks[params.id] = cb;
    setTimeout(() => {
      post(
        this.jsonrpc_url, { json: params },
        (err, res, body) => {
          if (err) {
            throw Error(`FATAL ERROR ${err}`);
          } else {
            const subCb = self._callbacks[body.id];
            delete self._callbacks[body.id];
            if (body.error) {
              subCb(body.error, undefined);
            } else {
              subCb(undefined, body.result);
            }
          }
        },
      );
    }, self.options.delay);
  }
}

export default Server;
