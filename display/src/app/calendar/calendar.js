class Calendar extends Base  {

    constructor(contentDiv) {
        super('calendar')
        this.contentDiv = contentDiv;
        this.hasAppPage = true;
        this.hasConfigPage = false;
        this.title = 'Calendar';
    }

    setupDisplay() {
        document.body.innerHTML =
`
`}

    async run() {
        this.setupDisplay();
    }

    stop() {
    }
}


