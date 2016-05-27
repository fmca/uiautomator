# uiautomator [Alpha]
NodeJS wrapper for UiAutomator

### Installation
```
npm install uiautomator-wrapper
```

### Usage
```javascript
var Test = require('uiautomator-wrapper');

new Test((err, device) => {
    device.click({description: 'Apps'}, (err, result) => {
        //Handle result
        device.info((err, info) => {
            console.log(err, info);
            device.stop();
        })
    });
});
```

### Device setup

```javascript
var Test = require('uiautomator-wrapper');
var options = {
    serial: "emulator5554"
}

new Test((err, device) => {
    /* ... */
}, options);
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
* ```javascript
    device.info((err, info) => {})
    ```
* Key events
* ```javascript
    //Press home
    device.home(callback)
    //Press back
    device.back(callback)
    ```
    * All key functions:
        ```home```, ```volumeUp```, ```volumeDown```, ```volumeMute```, ```back```, ```right```, ```left```, ```up```, ```down```, ```menu```, ```search```, ```center```, ```enter```, ```delete```, ```recent```, ```camera```, ```power```

* Selectors
    ```javascript
    device.click({description: 'Apps'}, callback);
    ```
    * Supported Selectors:
        ```text```,```textContains```,```textMatches```,```textStartsWith```,```className```,```classNameMatches```,```description```,```descriptionContains```,```descriptionMatches```,```descriptionStartsWith```,```checkable```,```checked```,```clickable```,```longClickable```,```scrollable```,```enabled```,```focusable```,```focused```,```selected```,```packageName```,```packageNameMatches```,```resourceId```,```resourceIdMatches```,```index```,```instance```
        

### Acknowledgement
This package is inspired by [xiaocong/uiautomator](https://github.com/xiaocong/uiautomator) python library, even using its [android-uiautomator-server](https://github.com/xiaocong/android-uiautomator-server).