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
    <h1 class='text-center'>Config Page</h1>
    <div class='row mt-3'>
       <div class='col-6'>
            <p class='float-end'>Brightness: </p>
        </div>
        <div class='col-6'>
            <input id='opacity' type='range' class='custom-range' min='20' max='100'>
        </div>
        <button type='button btn-block' class='btn btn-primary mt-3' onclick='controller.changeApp("appSwitcher", event)'>OK</button>
    </div>
</div>
`;

        document.getElementById('opacity').addEventListener('input', (event) => controller.setOpacity(event.target.value/100));
    }

    async run() {
        this.setupDisplay();
    }

    stop() {
    }
}




