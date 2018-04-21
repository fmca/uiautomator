import { join, dirname } from 'path';
import { realpathSync } from 'fs';
import { get, post } from 'request';
import { format, resolve as urlResolve } from 'url';
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
  constructor(newOptions) {
    this.options = Object.assign({}, defaultOptions, newOptions);
    this.url = format({ protocol: 'http', hostname: this.options.hostname, port: this.options.port });
    this.jsonrpc_url = urlResolve(this.url, '/jsonrpc/0');
    this.stop_url = urlResolve(this.url, '/stop');
    this._counter = 0;
    this._setup = new Setup(
      [getPath('../libs/app.apk'),
        getPath('../libs/app-test.apk')],
      this.options,
    );
    this._connectionTries = 0;
  }

  /**
   * @returns Promise
   */
  start() {
    const self = this;
    return self._setup.init()
      .then(() => self.verifyConnection());
  }

  /**
   * @returns Promise
   */
  stop() {
    get(this.stop_url, {}, () => {});
    this._setup.process().stdin.pause();
    this._setup.process().kill();
    return Promise.resolve();
  }

  /**
   * @returns Promise
   */
  verifyConnection(parentResolve, parentReject) {
    const self = this;
    return new Promise((resolve, reject) => {
      const chosenResolve = parentResolve || resolve;
      const chosenReject = parentReject || reject;
      setTimeout(() => {
        self.isAlive().then((alive) => {
          if (!alive) {
            if (self.connectionTries > self.options.connectionMaxTries) {
              return chosenReject();
            }
            return self.verifyConnection(chosenResolve, chosenReject);
          }
          return chosenResolve(self);
        });
      }, this.options.connectionTriesDelay);
    });
  }

  /**
   * @returns Promise
   */
  isAlive() {
    return new Promise((resolve) => {
      post(this.jsonrpc_url, {
        json: {
          jsonrpc: '2.0',
          method: 'ping',
          params: [],
          id: '1',
        },
      }, (err, res, body) => resolve(!err && body && body.result === 'pong'));
    });
  }

  /**
   * @returns Promise
   */
  send(method, extraParams) {
    this._counter = this._counter + 1;
    const params = {
      jsonrpc: '2.0',
      method,
      params: extraParams,
      id: this._counter,
    };
    const self = this;
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        post(
          this.jsonrpc_url, { json: params },
          (err, res, body) => {
            if (err) return reject(err);
            if (body.error) return reject(body.error);
            return resolve(body.result);
          },
        );
      }, self.options.delay);
    });
  }
}

export default Server;
