import Device from '.';
import { execSync } from 'child_process';

describe('Smoke tests for one device', () => {

    let device;

    beforeAll(() => {
        device = new Device();
    });

    test('connect', () => {
        return device.connect();
    })

   
    test('check simple command home', () => {
        return device.home().then(() => {
            const result = execSync(['adb', 'shell', '"dumpsys activity | grep top-activity"'].join(' '));
            expect(result.toString().includes("com.google.android.apps.nexuslauncher")).toBe(true);
        });

    });

    test('check open chrome', () => {
        return device.click({description: 'Chrome'}).then(() => {
            const result = execSync(['adb', 'shell', '"dumpsys activity | grep top-activity"'].join(' '));
            expect(result.toString().includes("com.android.chrome")).toBe(true);
        });
    });

    test('add contact', () => {
        return device.home()
            .then(() => device.swipe(160, 460, 160, 200)) // Open apps tray
            .then(() => device.click({description: 'Phone'}))
            .then(() => device.click({text: 'Contacts'}))
            .then(() => device.click({text: 'CREATE NEW CONTACT'}))
            .then(() => device.exists({text: 'CANCEL'}))
            .then((popup) => {
                if (popup) {
                    return device.click({text: 'CANCEL'});
                }
                return Promise.resolve();
            })
            .then(() => device.setText({text: 'First name'}, 'Test123'))
            .then(() => device.click({text: 'SAVE'}))
            .then(() => device.exists({descriptionContains: 'Test123'}))
            .then((contactCreated) => expect(contactCreated).toBe(true)) // check
    });

    afterAll(() => {
        return device.disconnect();
    })
});


