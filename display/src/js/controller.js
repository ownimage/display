class Controller {
    constructor() {
        this.contentId = 'content';
        this.logArray = [];
    }

    async run() {
        this.addHandlers();
        this.redirectConsoleLog();

        const control = await fetch_content_json('control.json');

        const contentDiv = this.getContentElement();

        this.allApps = [
            new Gallery(contentDiv, control.gallery.gallery, control.gallery.speed),
            new Clock(contentDiv),
            new Config(contentDiv),
            new ConsoleLog(contentDiv)
        ];

        this.appDictionary = {};
        this.allApps.forEach(app => this.appDictionary[app.getName()] = app);

        this.currentApp = this.appDictionary[control.app];
        this.currentApp = this.appDictionary['config'];
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
        this.previousApp = this.currentApp;
        this.currentApp.stop(); // is this valid syntax
        this.currentApp = this.appDictionary[appName];
        this.currentApp.run();
    }

    addHandlers() {
        this.getContentElement().setAttribute('onclick', 'controller.handleClick(event)');
        this.getContentElement().setAttribute('onTouchStart', 'controller.handleClick(event)');
    }

    handleClick(event) {
        let mouseX = 0;
        let mouseY = 0;

        if (event.constructor.name == 'PointerEvent') {
            mouseX = event.pageX;
            mouseY = event.pageY;
        }
        else if (event.constructor.name == 'TouchEvent') {
            mouseX = event.touches[0].clientX;
            mouseY = event.touches[0].clientY;
        }
        else return;

        const width = window.innerWidth;
        const height = window.innerHeight;
        const relX = mouseX/width;
        const relY = mouseY/height;

        if (relY > 0.5) { // bottom half of screen
            this.changeApp('config');
        }
        else if (relX < 0.5) { // left half of top
            this.showPreviousApp();
        }
        else { // right half of top
            this.showNextApp();
        }

    }

    showNextApp() {
        console.log('showNextApp');
    }

    showPreviousApp() {
        console.log('showPreviousApp');
    }

    back(event){
        event.stopPropagation();
        this.changeApp('clock');
    }

    getLog() {
        let out = '';
        for (const log of this.logArray) {
            out += `<p>${log}</p>`
        }
        return out;
    }

}

const controller = new Controller();
controller.run();