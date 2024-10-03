class ConsoleLog {

    constructor(contentDiv) {
        this.contentDiv = contentDiv;
    }
    getName() {
        return 'consoleLog';
    }

    setupDisplay() {
        this.contentDiv.innerHTML =
`
<div class='consoleLog'>
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


