class Controller {

    async run() {
        const control = await fetch_content_json('control.json');
        console.log(`control=${JSON.stringify(control)}`)

        const gallery = new Gallery(control.gallery.gallery, control.gallery.speed);
        const clock = new Clock();

        this.apps = {
            'gallery': gallery,
            'clock': clock,
        };

        this.currentApp = this.apps[control.app];
        this.currentApp.run();
    }

    calcMilliSecondDelay(h, m) {
        const targetTime = new Date();
        targetTime.setHours(h, m, 0, 0);

        const currentTime = new Date();
        return targetTime - currentTime;
    }

    processSchedule(schedule) {
        delay = calcMilliSecondDelay(schedule.h, schedule.m)
        setTimeout(delay, () => {
            controller.changeApp(schedule.app, schedule.options)
        });
    }

    async changeApp(appName, options) {
        console.log('changeApp');
        this.currentApp?.stop(); // is this valid syntax
        this.currentApp = this.apps[appName];
        this.currentApp.run();
    }

    handleClick() {
        this.changeApp('gallery');
    }

}
console.log(' before run');

const controller = new Controller();
//controller.run();

console.log('run');

//console.log('past run');
//setTimeout(() => console.log('timeout'), 1000);
//setTimeout(() => controller.changeApp('gallery'), 5000);
//setTimeout(() => controller.changeApp('clock'), 20000);
