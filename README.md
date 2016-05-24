# uiautomator [Alpha]
NodeJS wrapper for UiAutomator

Installation
=======
```
npm install uiautomator-wrapper
```

Usage
=======
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

Example (Sync)
=======
You can use any strategy to synchronize the test, but here follows one using [async](https://github.com/caolan/async) library.

```javascript
var Test = require('uiautomator-wrapper');
var async = require('async');

new Test((err, device) => {

    async.series([
        (cb) => { device.wakeUp(cb) },
        (cb) => { device.click({description: 'Apps'}, cb) },
        (cb) => { device.click({text: 'Gmail'}, cb) }
    ],
        (err, results) => { device.stop() }
    );

});
```

Acknowledgement
========
This package is inspired by [xiaocong/uiautomator](https://github.com/xiaocong/uiautomator) python library, even using its [android-uiautomator-server](https://github.com/xiaocong/android-uiautomator-server).


Considerations
========
I started this repository to start learning NodeJS. Any suggestion or advice is welcome.