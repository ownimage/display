class AppSwitcher {

    constructor(contentDiv) {
        this.contentDiv = contentDiv;
    }

    getName() {
        return 'appSwitcher';
    }

    getTitle() {
        return 'Applications';
    }

    setAppList(appList) { // this is a set of instances not names
        this.appList = appList;
    }

    setupDisplay() {
        this.contentDiv.innerHTML =
`
<div id='config' class='p-3 container'>
    <h1 class='text-center'>Application Switcher</h1>
<div class='container mt-5 mb-3'>
    <div class='row'>
${this.generateCards()}
    </div>
</div>
</div>
`;
    }

    generateCards() {
        let html = '';
        if (this.appList) {
            for (const app of this.appList) {
                html += this.generateCard(app);
            }
        }
        return html;
    }

    generateCard(app) {
        return `
        <div class='col-md-4'>
            <div class='card text-white bg-secondary mb-3'
                    onclick='AppSwitcher.handleEvent(event, "${app.getName()}")'
                    onTouchStart='AppSwitcher.handleEvent(event, "${app.getName()}")'>
                <img src='icon/${app.getName()}.jpg' class='card-img-top' alt='${app.getTitle()}'>
                <div class='mt-5'>
                    <h3 class='heading text-center'>${app.getTitle()}</h3>
                </div>
            </div>
        </div>
`;
    }

    static handleEvent(event, appName) {
        if (event) event.stopPropagation();
        controller.changeApp(appName);
    }

    async run() {
        this.setupDisplay();
    }

    stop() {
    }
}


