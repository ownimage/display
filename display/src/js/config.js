class Config {

    constructor(contentDiv) {
        this.contentDiv = contentDiv;
    }

    getName() {
        return 'config';
    }

    setupDisplay() {
        this.contentDiv.innerHTML =
`
<div id='config' class='p-3'>
    <button type='button' class='btn btn-primary float-end' onclick='controller.back(event)'>Return</button>
    <button type='button' class='btn btn-primary float-end' onclick='controller.changeApp("consoleLog")'>console.log</button>
    <h1>config</h1>
</div>
`;
    }

    async run() {
        this.setupDisplay();
    }

    stop() {
    }
}


