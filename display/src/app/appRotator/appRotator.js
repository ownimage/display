class AppRotator extends Base{

    constructor(contentDiv, gallery='test', delay=3000) {
        super('appRotator', true);
        this.hasAppPage = true;
        this.hasConfigPage = true;
        this.title = 'App Rotator';

        this.count = 0;
        this.appRotatorConfig = ['clock', 'mondaine_clock'];
}

    rotate_app() {
        if (this.appRotatorConfig.length != 0) {
            if (this.currentApp) { this.currentApp.stop(); }
            const appName = this.appRotatorConfig[this.count % this.appRotatorConfig.length];
            this.currentApp = controller.appDictionary[appName];
            this.currentApp.run();
            this.count++;
        }
    }

    async create_display() {
        this.getContentElement().innerHTML =
`
<div id='appRotator'>
    <h1>App Rotator</h
</div>
`;
    }

    async scheduled_rotate() {
        if (this.appRotatorConfig.length != 0) {
            this.rotate_app()
            this.rotateInterval = setInterval(() => this.rotate_app(), 10000);
        }
    }

    stop() {
        clearInterval(this.rotateInterval);
    }

    async run(config) {
        this.appList = config.appList;
        this.create_display();
        this.scheduled_rotate();
    }

}

controller.register(new AppRotator() );

