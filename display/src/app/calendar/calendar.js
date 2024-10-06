class Calendar extends Base  {

    constructor(contentDiv) {
        super('calendar')
        this.contentDiv = contentDiv;
        this.hasAppPage = true;
        this.hasConfigPage = false;
        this.title = 'Calendar';
    }

    setupDisplay() {
        this.contentDiv.innerHTML =
`
`}

    async run() {
        this.setupDisplay();
    }

    stop() {
    }
}


