class AppRotator extends Base{

    constructor(contentDiv, gallery='test', delay=3000) {
        super('appRotator', false);
        this.hasAppPage = true;
        this.hasConfigPage = true;
        this.title = 'App Rotator';

        this.count = 0;
        this.appList = ['clock', 'mondaine_clock'];
}

    rotate_app() {
        if (this.appList.length != 0) {
            if (this.currentApp) { this.currentApp.stop(); }
            const appName = this.appList[this.count % this.appList.length];
            this.currentApp = controller.appDictionary[appName];
            this.currentApp.run();
            this.count++;
        }
    }

    async create_display() {
        this.getContentElement().innerHTML =
`
<div id='appRotator'>
    <h1>App Rotator</h
</div>
`;
    }

    async scheduled_rotate() {
        if (this.appList.length != 0) {
            this.rotate_app()
            this.rotateInterval = setInterval(() => this.rotate_app(), 10000);
        }
    }

    async showConfigPage() {
        this.getContentElement().innerHTML =
`
<div id='appRotatorConfig' class='pt-3 container'>
    <h1 class='text-center'>${this.title} Config Page</h1>
    <div id='root'></div>
</div>
`;
        let script = document.createElement('script');
        script.type = 'text/babel';
        script.textContent = `
    const { useState } = React;

    function App() {
        const [text, setText] = useState('');

        return (
            <div>
                <h1>Change Config Outside</h1>
                <TwoWayBindingComponent text={text} setText={setText} />
                <button onClick={() => setText('External Change')}>Change Text</button>
            </div>
        );
    }

    function TwoWayBindingComponent({ text, setText }) {
        const handleChange = (event) => {
            setText(event.target.value);
        };

        return (
            <div>
                <input
                    type="text"
                    value={text}
                    onChange={handleChange}
                />
                <p>Current text: {text}</p>
            </div>
        );
    }

    ReactDOM.render(<App />, document.getElementById('root'));
`;
        document.getElementById('appRotatorConfig').appendChild(script);
        Babel.transformScriptTags();
    }


    stop() {
        clearInterval(this.rotateInterval);
    }

    async run() {
        await this.init();
        this.create_display();
        this.scheduled_rotate();
    }

}

controller.register(new AppRotator() );

