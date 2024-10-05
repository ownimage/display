class Config extends AppList {
    constructor(contentDiv) {
        super(contentDiv, (app) => {return app.hasConfigPage}, 'showConfig');
         this.hasConfigPage = false;
    }


    getName() {
        return 'config';
    }

    getTitle() {
        return 'Configuration';
    }
}




