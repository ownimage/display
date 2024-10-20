class AppList extends Base { // abstract class

    constructor(name, hasStylesheet, contentDiv, filter, actionString) {
    // filter is of form boolean filter(app) // note the parameter is an app not an appName
    // action is of the form action(app)
        super(name, hasStylesheet);
        this.filter = filter;
        this.actionString = actionString;
    }

    getName() {
        return 'appList';
    }

    getTitle() {
        return 'Application List';
    }

    setupDisplay(appList) {
        this.getContentElement().innerHTML =
`
<div id='config' class='p-3 container'>
    <h1 class='text-center'>${this.title}</h1>
<div class='container mt-5 mb-3'>
    <div class='row'>
${this.generateCards(appList)}
    </div>
</div>
</div>
`;
        this.addListeners(appList);
    }

    generateCards(appList) {
        let html = '';
        if (appList) {
            for (const app of appList) {
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
            <div id='card-${app.name}' class='card text-white bg-secondary mb-3'>
                <img src='app/${app.name}/${app.name}.jpg' class='card-img-top' alt='${app.title}'>
                <div class='mt-5'>
                    <h3 class='heading text-center'>${app.title}</h3>
                </div>
            </div>
        </div>
`;
    }

    addListeners(appList) {
        for (const app of appList) {
            if (this.filter(app)) {
                this.addListener(`card-${app.name}`, () => controller.appAction(app.name, this.actionString) );
            }
        }
    }

    static handleEvent(event, appName, actionString) {
        controller.appAction(appName, actionString, event);
    }

    async run(config={'appList': []}) {

        this.setupDisplay(config.appList);
    }

    stop() {
    }
}


