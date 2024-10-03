class Config {
    constructor() {
    }


    getName() {
        return 'config';
    }

    setupDisplay() {
        controller.getContentElement().innerHTML =
`
<div id='config' class='m-3'>
    <button type='button' class='btn btn-primary float-end' onclick='controller.back(event)'>Return</button>
    <button type='button' class='btn btn-primary float-end' onclick='controller.changeApp("consoleLog")'>console.log</button>
</div>
`;
    }

    async run() {
        this.setupDisplay();
    }

    stop() {
    }
}


