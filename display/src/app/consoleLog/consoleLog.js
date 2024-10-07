class ConsoleLog extends Base{

    constructor(contentDiv) {
        super('consoleLog', true)
        this.contentDiv = contentDiv;
        this.hasAppPage = true;
        this.hasConfigPage = false;
        this.title = 'Console Log';
    }


    setupDisplay() {
        this.contentDiv.innerHTML =
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


