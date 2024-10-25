class AppRotator extends Base{

    constructor(contentDiv, gallery='test', delay=3000) {
        super('appRotator', false);
        this.hasAppPage = true;
        this.hasConfigPage = true;
        this.title = 'App Rotator';

        this.count = 0;
    }

    rotate_app(context) {
        if (context.rotateActive && context.appRotatorConfig.length != 0) {
            if (context.currentApp) { context.currentApp.stop(); }
            const appConfig = context.appRotatorConfig[context.count % context.appRotatorConfig.length];
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
`;
    }

    async showConfigPage() {
        this.getContentElement().innerHTML =
`
<div id='appRotatorConfig' class='pt-3 container'>
    <h1 class='text-center'>${this.title} Config Page</h1>
    <div id='root' class='row mt-3'>
         <button type='button btn-block col-12' class='btn btn-primary mt-3 w-100' onclick='controller.changeApp("config", event)'>OK</button>
    </div>
</div>
`;
        const { useState } = React;

        function ListEditor() {
            const [list, setList] = useState(['Item 1', 'Item 2', 'Item 3']);
            const [newItem, setNewItem] = useState('');

            const handleAddItem = () => {
                if (newItem.trim()) {
                    setList([...list, newItem]);
                    setNewItem('');
                }
            };

            const handleInputChange = (event) => {
                setNewItem(event.target.value);
            };

            const handleEditItem = (index, newValue) => {
                const updatedList = [...list];
                updatedList[index] = newValue;
                setList(updatedList);
            };

            return (
                <div>
                    <h1>List Editor</h1>
                    <ul>
                        {list.map((item, index) => (
                            <li key={index}>
                                <input
                                    type="text"
                                    value={item}
                                    onChange={(event) => handleEditItem(index, event.target.value)}
                                />
                            </li>
                        ))}
                    </ul>
                    <input
                        type="text"
                        value={newItem}
                        onChange={handleInputChange}
                        placeholder="Add new item"
                    />
                    <button onClick={handleAddItem}>Add Item</button>
                </div>
            );
        }

        ReactDOM.render(<ListEditor />, document.getElementById('root'));

    }

    process_json(json) {
        this.appRotatorConfig = json;
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
        await this.fetch_content_json().then(j => this.process_json(j));
    }

}

controller.register(new AppRotator() );

