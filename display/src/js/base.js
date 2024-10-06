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

}