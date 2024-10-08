class ConsoleLog extends Base {

    constructor() {
        super('consoleLog', true)
        this.hasAppPage = true;
        this.hasConfigPage = false;
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

    async run() {
        this.setupDisplay();
    }

    stop() {
    }
}

controller.register(new ConsoleLog() );


