class Controller {
    constructor() {
        this.contentId = 'content';
        this.hasConfigPage = false;
        this.logArray = [];
        this.currentAppNum = 0;
        this.handleEventsActive = true;
    }

    async run() {
        this.addHandlers();
        this.redirectConsoleLog();

        const control = await Common.fetch_content_json('controller.json');

        const contentDiv = this.getContentElement();

        this.appList = [
            new AppSwitcher(contentDiv),
            new Calendar(contentDiv),
            new Clock(contentDiv),
            new Config(contentDiv),
            new ConsoleLog(contentDiv),
            new Gallery(contentDiv, control.gallery.gallery, control.gallery.speed),
            new Quotes(contentDiv),
            new Weather(contentDiv),
        ];

        this.appDictionary = {};
        this.appList.forEach(app => this.appDictionary[app.name] = app);

        this.appDictionary['appSwitcher'].setAppList(this.appList);
        this.appDictionary['config'].setAppList(this.appList);

        this.currentApp = this.appDictionary[this.getCurrentAppName()];
        this.currentApp = this.appDictionary['calendar'];
        this.currentApp.run();
    }

    getCurrentAppName() {
        return this.appList[this.currentAppNum % this.appList.length].name;
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

    addHandlers() {
        this.getContentElement().setAttribute('onclick', 'controller.handleClick(event)');
        this.getContentElement().setAttribute('onTouchStart', 'controller.handleClick(event)');
    }

    handleClick(event) {
        if (this.handleEventsActive) {
            event.stopPropagation();
            let i = Common.eventToTouchArea(event)
            console.log(`Touched area ${Common.eventToTouchArea(event)}`);
            if (i !== null) [
                () => this.showPreviousApp(),
                () => this.showNextApp(),
                () => this.changeApp('appSwitcher'),
                () => this.changeApp('consoleLog')
            ][i]();
        }
    }

    async changeApp(appName, event) {
        this.handleEventsActive = true;
        this.previousApp = this.currentApp;
        this.currentApp.stop(); // is this valid syntax
        this.currentApp = this.appDictionary[appName];
        this.currentApp.run();
    }

    showNextApp() {
        this.currentAppNum = (this.currentAppNum + 1) % this.appList.length;
        this.changeApp(this.getCurrentAppName());
    }

    showPreviousApp() {
        this.currentAppNum = (this.currentAppNum + this.appList.length - 1) % this.appList.length;
        this.changeApp(this.getCurrentAppName());
    }

    back(event){
        event.stopPropagation();
        this.handleEventsActive = false;
        this.changeApp('clock');
        console.log('back');
    }

    showConfig(appName) {
        this.handleEventsActive = false;
        this.appDictionary[appName].showConfigPage();
    }

    appAction(appName, actionString, event) {
        if (event) event.stopPropagation();
        if (actionString == 'show') {
            this.changeApp(appName, event);
        }
        else if (actionString = 'showConfig') {
            this.showConfig(appName);
        }
        else console.log(`Invalid call to appAction('${appName}', '${actionString}')`)
    }

    getLog() {
        let out = '';
        for (let i = this.logArray.length - 1; i >= 0; i--) {
            out += `<p>${this.logArray[i]}</p>`
        }
        return out;
    }

    setOpacity(opacity) {
        this.getContentElement().style.opacity = opacity;
    }

}


const controller = new Controller();
setTimeout(() => controller.run(), 1000);