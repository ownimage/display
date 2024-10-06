class AppList { // abstract class

    constructor(contentDiv, filter, actionString) {
    // filter is of form boolean filter(app) // note the parameter is an app not an appName
    // action is of the form action(app)
        this.contentDiv = contentDiv;
        this.filter = filter;
        this.actionString = actionString;
    }

    getName() {
        return 'appList';
    }

    getTitle() {
        return 'Application List';
    }

    setAppList(appList) { // this is a set of instances not names
        this.appList = appList;
    }

    setupDisplay() {
        this.contentDiv.innerHTML =
`
<div id='config' class='p-3 container'>
    <h1 class='text-center'>${this.getTitle()}</h1>
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
                if (this.filter(app)) {
                    html += this.generateCard(app);
                }
            }
        }
        return html;
    }

    generateCard(app) {
        return `
        <div class='col-md-4'>
            <div class='card text-white bg-secondary mb-3'
                    onclick='AppList.handleEvent(event, "${app.getName()}", "${this.actionString}")'
                    onTouchStart='AppList.handleEvent(event, "${app.getName()}", "${this.actionString}")'>
                <img src='icon/${app.getName()}.jpg' class='card-img-top' alt='${app.getTitle()}'>
                <div class='mt-5'>
                    <h3 class='heading text-center'>${app.getTitle()}</h3>
                </div>
            </div>
        </div>
`;
    }

    static handleEvent(event, appName, actionString) {
        controller.appAction(appName, actionString, event);
    }

    async run() {
        this.setupDisplay();
    }

    stop() {
    }
}


