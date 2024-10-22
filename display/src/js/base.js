class Base {

   constructor(name, hasStylesheet=false) {
        this.name = name;
        if (hasStylesheet) { this.addStylesheet(); }
   }

   getContentElement() {
        return document.getElementById('content');
   }

   async showConfigPage() {
        this.getContentElement().innerHTML = this.configPage();
   }

    configPage() {
    return `
<div  class='pt-3 container'>
    <h1 class='text-center'>No Config Page Defined</h1>
</div>
`;}

    loadScript(url, callback=()=>{})
    {
        return new Promise((resolve, reject) => {
            var callbackResolve = () => { callback(); resolve(); };
            var head = document.head;
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = url;
            script.onreadystatechange = callbackResolve
            script.onload = callbackResolve
            head.appendChild(script);
        });
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
            const cleanJsonString = t.replace(/,(\s*[}\]])/g, '$1');
            const j = JSON.parse(cleanJsonString);
            return j;
        } catch (error) {
            console.error('Error fetching the HTML file:', error);
        }
    }

    addListener(id, fn) {
        document.getElementById(id).addEventListener('click', () => { console.log('click'); fn(); });
        document.getElementById(id).addEventListener('touchstart', () => { console.log('touchstart'); fn(); });
    }

    selectDropDown(id, list, selected, label) {
        var html = `
<select id='${id}' class='form-select' aria-label='${label}'>
  <option selected>${selected}</option>
`;
        list.forEach(o => html += `<option value='${o}'${o == selected ? 'selected' : ''}>${o}</option>`)
        html += `
    </select>
`;
        return html;
    }

    async init(){
    }

}