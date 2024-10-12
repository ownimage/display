class ConsoleLog extends Base {

    constructor() {
        super('consoleLog', true)
        this.hasAppPage = true;
        this.hasConfigPage = true;
        this.title = 'Console Log';
    }

    setupDisplay() {
        this.getContentElement().innerHTML =
`
<div class='consoleLog pt-3 container-fluid'>
    <h1 class='p-3'>console.log <button type='button' class='btn btn-primary float-end'>Return</button></h1>
    <div class='p-3'>
        ${controller.getLog()}
    </div>
</div>
`;
    }

    async showConfigPage() {
        this.getContentElement().innerHTML =
`
<div class='pt-3 container'>
    <div class='col-12'>
        <button id='button' type='button' class='btn btn-secondary w-100 mt-5'>Clear console.log</button>
        <button type='button' class='btn btn-primary w-100 mt-5' onclick='controller.changeApp("config", event)'>OK</button>
</div>
`;

        this.addListener('button', (event) => { controller.clearLog(); });
    }

    async run() {
        this.setupDisplay();
    }

    stop() {
    }
}

controller.register(new ConsoleLog() );


