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
    .then(() => device.click({description: 'Phone'}))
    .then(() => device.click({text: 'Contacts'}))
    .then(() => device.click({text: 'Create new contact'}))
    .then(() => device.setText({text: 'First name'}, 'Test123'))
    .then(() => device.click({text: 'Save'}))
    .then(() => device.exists({descriptionContains: 'Test123'}))
    .then((contactCreated) => {
        console.log("contact created?", contactCreated);
        return device.back()
    })
    .then(() => device.disconnect())
    .then(() -> console.log("Finished"))
    .catch((err) => console.error(err))

```

#### ES6
```javascript
import Device from 'uiautomator-wrapper';

const test = async () => {
  const device = new Device();
  await device.connect();
  await device.home();
  await device.click({description: 'Phone'});
  await device.click({text: 'Create new contact'});
  await device.setText({text: 'First name'}, 'Test123');
  await device.click({text: 'Save'});
  let contactCreated = await device.exists({descriptionContains: 'Test123'});
  console.log("contact created?", contactCreated);
  await device.back();
  await device.disconnect();
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
    hostname: '127.0.0.1',
    delay: 500, //delay between commands
    port: 9008,
    devicePort: 9008,
    connectionMaxTries: 3,
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
    device.exists({text: 'Contacts'});
    ```
    * Supported Selectors:
        ```text```,```textContains```,```textMatches```,```textStartsWith```,```className```,```classNameMatches```,```description```,```descriptionContains```,```descriptionMatches```,```descriptionStartsWith```,```checkable```,```checked```,```clickable```,```longClickable```,```scrollable```,```enabled```,```focusable```,```focused```,```selected```,```packageName```,```packageNameMatches```,```resourceId```,```resourceIdMatches```,```index```,```instance```
        
* Input text
    ```javascript
    device.setText({description: 'Message'}, 'Hello World');
    ```

### Acknowledgement
This package is inspired by [xiaocong/uiautomator](https://github.com/xiaocong/uiautomator) python library, even using its [android-uiautomator-server](https://github.com/xiaocong/android-uiautomator-server).