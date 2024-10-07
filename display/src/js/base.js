class Base {

    constructor(name, hasStylesheet) {
        this.name = name;
        if (hasStylesheet) { this.addStylesheet(); }
    }

    addStylesheet() {
            let link = document.createElement('link');
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = `app/${this.name}/${this.name}.css`; // Replace with your stylesheet URL
            document.head.appendChild(link);
    }

    async fetch_content_json(url='') {
        if (url == '') {
            url = `app/${this.name}/${this.name}.json`
        }

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const t = await response.text();
            const j = JSON.parse(t);
            return j;
        } catch (error) {
            console.error('Error fetching the HTML file:', error);
        }
    }

    async init(){
    }

}