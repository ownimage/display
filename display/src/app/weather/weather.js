class Weather extends Base  {

    constructor(contentDiv) {
        super('weather')
        this.contentDiv = contentDiv;
        this.hasAppPage = true;
        this.hasConfigPage = false;
        this.title = 'Weather';
    }

    setupDisplay() {
        document.body.innerHTML =
`
<div class='elfsight-app-4f411016-6dcc-416b-8cce-a0ca4c7edb53' data-elfsight-app-lazy></div>
`}

    async run() {
        this.setupDisplay();
    }

    stop() {
    }
}


