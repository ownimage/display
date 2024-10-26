class AppRotator extends Base{

    constructor(contentDiv, gallery='test', delay=3000) {
        super('appRotator', false);
        this.hasAppPage = true;
        this.hasConfigPage = true;
        this.title = 'App Rotator';

        this.count = 0;
    }

    rotate_app(context) {
        if (context.rotateActive && context.config.length != 0) {
            if (context.currentApp) { context.currentApp.stop(); }
            const appConfig = context.config[context.count % context.config.length];
            context.currentApp = controller.appDictionary[appConfig.appName];
            context.currentApp.run();
            context.count++;
            setTimeout(context.rotate_app, (appConfig.min * 60 + appConfig.sec) * 1000, context);
        }
    }

    async create_display() {
        this.getContentElement().innerHTML =
`
<div id='appRotator'>
    <h1>App Rotator</h
</div>
`;}

    async showConfigPage() {
        this.getContentElement().innerHTML =
`
<div id='appRotatorConfig' class='pt-3 container'>
    <h1 class='text-center'>${this.title} Config Page</h1>
    <div id='root' class='row mt-3'>
    </div>
    <div class='row mt-3'>
         <button type='button' class='btn btn-primary mt-3 col-12' onclick='controller.changeApp("config", event)'>OK</button>
    </div>
</div>
`;
        const { useState } = React;
        const appRotatorConfig = this.config;

        function ListEditor(props) {
            const [list, setList] = useState(props.config);
            const [newItem, setNewItem] = useState('');

            const handleAddItem = () => {
                props.config.push({ appName: 'clock', min: 0, sec: 30});
                setList([...props.config]);
                setNewItem('');
            };

            const handleEditItem = (index, newValue) => {
                const updatedList = [...list];
                updatedList[index] = newValue;
                setList(updatedList);
                localStorage.setItem('appRotator.config', JSON.stringify(props.config));
            };

            const handleEditMins = (index, newValue) => {
                props.config[index].min = newValue;
                setList([...props.config]);
                localStorage.setItem('appRotator.config', JSON.stringify(props.config));
            };

            const handleEditSecs = (index, newValue) => {
                props.config[index].sec = newValue;
                setList([...props.config]);
                localStorage.setItem('appRotator.config', JSON.stringify(props.config));
            };

            const handleDelete = (index) => {
                props.config.splice(index, 1);
                setList([...props.config]);
                localStorage.setItem('appRotator.config', JSON.stringify(props.config));
            };


            const appSelector = (app) => {
               return (
                    <select class='form-select' defaultValue={app}>
                        <option selected>Select App</option>
                        {controller.appList
                            .map((item, index) => (
                                <option value={item.name}>
                                    {item.name}
                                </option>
                            ))
                        }
                    </select>
            )};

            return (
                <div class='container'>
                    {list.map((item, index) => (
                        <div class='row'>
                            <div class='col-3'>
                                {appSelector(item.appName)}
                            </div>
                            <input
                                id='mins'
                                type='range'
                                class='custom-range col-2'
                                min='0'
                                max='60'
                                value={item.min}
                                onChange={(event) => handleEditMins(index, event.target.value)}
                                />
                           <div class='col-2'>
                                <p id='delayText'>{item.min + ' min(s)'}</p>
                            </div>
                            <input
                                id='secs'
                                type='range'
                                class='custom-range col-2'
                                min='0'
                                max='60'
                                value={item.sec}
                                onChange={(event) => handleEditSecs(index, event.target.value)}
                                />
                            <div class='col-2'>
                                <p id='delayText'>{item.sec + ' sec(s)'}</p>
                            </div>
                            <button
                                type='button'
                                class='btn btn-danger col-1 my-1'
                                onClick={(event) => handleDelete(index)}
                            >
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    ))}
                    <div class='row mt-3'>
                        <button
                            type='button'
                            class='btn btn-success col-6 mt-3'
                            onClick={(event) => handleAddItem()}
                        >
                            &nbsp;<i class="bi bi-plus-square-fill"></i>&nbsp;
                        </button>
                    </div>
                </div>
            );
        }

        document.getElementById('root').innerHTML = '';
        ReactDOM.render(<ListEditor config={this.config}/>, document.getElementById('root'));
    }

    stop() {
        this.rotateActive = false;
    }

    async run(config) {
        this.appList = config.appList;
        this.create_display();
        this.rotateActive = true;
        this.rotate_app(this);
    }

   async init() {
        const s = localStorage.getItem('appRotator.config');
        if (s) {
            this.config = JSON.parse(s);
        } else {
            await this.fetch_content_json().then(j => this.config = j);
        }
    }

}

controller.register(new AppRotator());

