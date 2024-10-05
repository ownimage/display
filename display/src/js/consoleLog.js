class ConsoleLog {

    constructor(contentDiv) {
        this.contentDiv = contentDiv;
         this.hasConfigPage = false;
    }
    getName() {
        return 'consoleLog';
    }

    getTitle() {
        return 'Console Log';
    }

    setupDisplay() {
        this.contentDiv.innerHTML =
`
<div class='consoleLog pt-3 container'>
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


