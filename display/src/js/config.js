class Config {

    constructor(contentDiv) {
        this.contentDiv = contentDiv;
    }

    getName() {
        return 'config';
    }

    getTitle() {
        return 'Configuration';
    }

    setupDisplay() {
        this.contentDiv.innerHTML =
`
<div id='config' class='pt-3 container'>
    <button type='button' class='btn btn-primary float-end' onclick='controller.showConfig(event, "gallery")'
       onTouchStart='controller.showConfig(event, "gallery")' >Config Gallery</button>
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


