class Config extends AppList {

    constructor(contentDiv) {
        super(contentDiv, (app) => {return app.hasConfigPage}, 'showConfig');
        this.hasAppPage = true;
        this.hasConfigPage = false;
        this.name = 'config';
        this.title = 'Configuration';
    }

}




