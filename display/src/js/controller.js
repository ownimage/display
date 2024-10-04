class Controller {
    constructor() {
        this.contentId = 'content';
        this.logArray = [];
        this.currentAppNum = 0;
    }

    async run() {
        this.addHandlers();
        this.redirectConsoleLog();

        const control = await Common.fetch_content_json('control.json');

        const contentDiv = this.getContentElement();

        this.allApps = [
            new Gallery(contentDiv, control.gallery.gallery, control.gallery.speed),
            new Clock(contentDiv),
            new Config(contentDiv),
            new ConsoleLog(contentDiv)
        ];

        this.appDictionary = {};
        this.allApps.forEach(app => this.appDictionary[app.getName()] = app);

        this.currentApp = this.appDictionary[this.getCurrentAppName()];
        this.currentApp.run();
    }

    getCurrentAppName() {
        return this.allApps[this.currentAppNum % this.allApps.length].getName();
    }

    showNextApp() {
        this.currentAppNum = (this.currentAppNum + 1) % this.allApps.length;
        this.changeApp(this.getCurrentAppName());
    }

    showPreviousApp() {
        this.currentAppNum = (this.currentAppNum + this.allApps.length - 1) % this.allApps.length;
        this.changeApp(this.getCurrentAppName());
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
        event.stopPropagation();
        let i = Common.eventToTouchArea(event)
        console.log(`Touched area ${Common.eventToTouchArea(event)}`);
        if (i) [
            () => this.showPreviousApp(),
            () => this.showNextApp(),
            () => this.changeApp('config'),
            () => this.changeApp('consoleLog')
        ][i]();
    }

    back(event){
        event.stopPropagation();
        this.changeApp('clock');
        console.log('back');
    }

    getLog() {
        let out = '';
        for (let i = this.logArray.length - 1; i >= 0; i--) {
            out += `<p>${this.logArray[i]}</p>`
        }
        return out;
    }

}

const controller = new Controller();
controller.run();