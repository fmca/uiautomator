# uiautomator [Alpha]
NodeJS wrapper for UiAutomator

### Installation
```
npm install uiautomator-wrapper
```

### Usage

#### CommonJS
```javascript
var Device = require('uiautomator-wrapper');

var device = new Device();
device.connect()
    .then(() => device.home())
    .then(() => device.click({ description: 'Apps' }))
    .then(() => device.back())
    .then(() => console.log('Finished'))
    .catch((err) => console.error(err))

```

#### ES6
```javascript
import Device from 'uiautomator-wrapper';

const test = async () => {
  const device = new Device();
  await device.connect();
  await device.home();
  await device.click({ description: 'Apps' });
  await device.back();
};

test()
  .then(() => console.log('Finished'))
  .catch(err => console.error(err));
```



### Device setup

```javascript
var options = {
    serial: "emulator5554"
}

var device = new Device(options);
```

Default options:
```javascript
{
    hostname: 'localhost',
    delay: 500, //delay between commands
    port: 9008,
    devicePort: 9008,
    connectionMaxTries: 5,
    connectionTriesDelay: 1000,
    serial: undefined //Not necessary if there is only one device available
}

```


### API

* Device info

    ```javascript
    device.info()
    ```
* Key events
    ```javascript
    //Press home
    device.home()
    //Press back
    device.back()
    ```
    * All key functions:
        ```home```, ```volumeUp```, ```volumeDown```, ```volumeMute```, ```back```, ```right```, ```left```, ```up```, ```down```, ```menu```, ```search```, ```center```, ```enter```, ```delete```, ```recent```, ```camera```, ```power```

* Selectors
    ```javascript
    device.click({description: 'Apps'});
    ```
    * Supported Selectors:
        ```text```,```textContains```,```textMatches```,```textStartsWith```,```className```,```classNameMatches```,```description```,```descriptionContains```,```descriptionMatches```,```descriptionStartsWith```,```checkable```,```checked```,```clickable```,```longClickable```,```scrollable```,```enabled```,```focusable```,```focused```,```selected```,```packageName```,```packageNameMatches```,```resourceId```,```resourceIdMatches```,```index```,```instance```
        

### Acknowledgement
This package is inspired by [xiaocong/uiautomator](https://github.com/xiaocong/uiautomator) python library, even using its [android-uiautomator-server](https://github.com/xiaocong/android-uiautomator-server).