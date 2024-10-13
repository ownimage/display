class Controller extends Base {

    constructor() {
        super('controller)');
        this.hasAppPage = true;
        this.hasConfigPage = false;
        this.title = 'Controller';

        this.logArray = [];
        this.currentAppNum = 0;
        this.handleEventsActive = true;
    }

    async run(apps) {
        this.addHandlers();
        this.redirectConsoleLog();

        const control = await Common.fetch_content_json('controller.json');

        const contentDiv = this.getContentElement();

        await this.loadScript('js/appList.js');

        this.appList = [];
        this.appDictionary = {};

        let promises = [];
        apps.forEach(app => {
            promises.push(this.loadScript(`app/${app}/${app}.js`));
        });
        await Promise.all(promises);

//        this.changeApp(this.getCurrentAppName());
//        this.changeApp('calendar');
        this.changeApp('mondaine_clock');
    }

    clearLog() {
//        this.logArray = [];
        console.log('Console log cleared');
    }

    toggleHandleEvents() {
        this.handleEventsActive =!this.handleEventsActive;
    }

    register(app) {
        this.appList.push(app);
        this.appList.sort((a, b) => a.name.localeCompare(b.name));
        this.appDictionary[app.name] = app;
    }

    getCurrentAppName() {
        return this.appList[this.currentAppNum % this.appList.length].name;
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
            console.log(`Touched area ${i}`);
            if (i == 1) {
                event.preventDefault();
                this.changeApp('appSwitcher');
            }
         }
    }

    async changeApp(appName, event) {
        console.log(`Changing to app ${appName}`);
        if (event) { event.stopPropagation();}
        this.handleEventsActive = true;
        this.previousApp = this.currentApp;
        if (this.currentApp) { this.currentApp.stop(); }
        this.currentApp = this.appDictionary[appName];
        this.currentApp.run({'appList': this.appList});
    }

    showNextApp() {
        this.currentAppNum = (this.currentAppNum + 1) % this.appList.length;
        this.changeApp(this.getCurrentAppName());
    }

    showPreviousApp() {
        this.currentAppNum = (this.currentAppNum + this.appList.length - 1) % this.appList.length;
        this.changeApp(this.getCurrentAppName());
    }

    showConfig(appName) {
        this.handleEventsActive = false;
        this.appDictionary[appName].showConfigPage();
    }

    appAction(appName, actionString) {
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
