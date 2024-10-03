class ConsoleLog {
    constructor() {
    }


    setupDisplay() {
        controller.getContentElement().innerHTML = `
        <div class="consoleLog">
            <h1>console.log</h1>
            ${controller.getLog()}
        </div>
    `}

    async run() {
        this.setupDisplay();
    }

    stop() {
    }
}


