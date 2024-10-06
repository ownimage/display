 class AppSwitcher extends AppList {

    constructor(contentDiv) {
        super(contentDiv, (app) => {return app.hasAppPage}, 'show');
        this.hasAppPage = false;
        this.hasConfigPage = false;
        this.name = 'appSwitcher';
        this.title = 'Applications'
    }


    getName() {
        return 'appSwitcher';
    }

    getTitle() {
        return 'Applications';
    }
}



