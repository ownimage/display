 class AppSwitcher extends AppList {

    constructor(contentDiv) {
        super('appSwitcher', false, contentDiv, (app) => {return app.hasAppPage}, 'show');
        this.hasAppPage = false;
        this.hasConfigPage = false;
        this.title = 'Application List'
    }

}

controller.register(new AppSwitcher() );


