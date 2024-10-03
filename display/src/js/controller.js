class Controller {
    constructor() {
        this.contentId = 'content';
        this.logArray = [];
    }

    async run() {
        this.addHandlers();
        this.redirectConsoleLog();

        const control = await fetch_content_json('control.json');
        console.log(`control=${JSON.stringify(control)}`)

        const contentDiv = this.getContentElement();

        const consoleLog = new ConsoleLog();
        const gallery = new Gallery(contentDiv, control.gallery.gallery, control.gallery.speed);
        const clock = new Clock(contentDiv);

        this.apps = {
            'consoleLog': consoleLog,
            'gallery': gallery,
            'clock': clock,
        };

        this.currentApp = this.apps[control.app];
        this.currentApp.run();
    }

    getContentElement() {
        return document.getElementById(this.contentId);
    }

    redirectConsoleLog() {
        const originalLog = console.log;
       console.log = (message) => {
            originalLog(message);
            this.logArray.push(message);
        };

        console.log('Test message');
    }

    calcMilliSecondDelay(h, m) {
        const targetTime = new Date();
        targetTime.setHours(h, m, 0, 0);

        const currentTime = new Date();
        return targetTime - currentTime;
    }

    processSchedule(schedule) {
        delay = calcMilliSecondDelay(schedule.h, schedule.m);
        setTimeout(() => {
                controller.changeApp(schedule.app, schedule.options)
            }
            , 5000);
    }

    async changeApp(appName, options) {
        console.log('changeApp');
        this.currentApp.stop(); // is this valid syntax
        this.currentApp = this.apps[appName];
        this.currentApp.run();
    }

    addHandlers() {
        this.getContentElement().setAttribute('onclick', 'controller.handleClick(event)');
        this.getContentElement().setAttribute('onTouchStart', 'controller.handleClick(event)');
    }

    handleClick(event) {
        console.log(event.constructor.name);
        let mouseX = 0;
        let mouseY = 0;

        if (event.constructor.name == "PointerEvent") {
            mouseX = event.pageX;
            mouseY = event.pageY;
        }
        else if (event.constructor.name == "TouchEvent") {
            mouseX = event.touches[0].clientX;
            mouseY = event.touches[0].clientY;
        }
        else return;

        const width = window.innerWidth;
        const height = window.innerHeight;
        const relX = mouseX/width;
        const relY = mouseY/height;
        this.changeApp('consoleLog');
    }

    getLog() {
        let out = "";
        for (const log of this.logArray) {
            out += `<p>${log}</p>`
        }
        return out;
    }

}

const controller = new Controller();
controller.run();



//console.log('past run');
//setTimeout(() => console.log('timeout'), 1000);
//setTimeout(() => controller.changeApp('gallery'), 5000);
//setTimeout(() => controller.changeApp('clock'), 20000);
