class Gallery extends Base{

    constructor(contentDiv, gallery='test', delay=3000) {
        super('gallery', true);
        this.hasAppPage = true;
        this.hasConfigPage = true;
        this.title = 'Gallery';

        this.gallery = gallery;
        this.delay = delay;

        this.count = 0;
        this.galleries = []
        this.images = [];
        this.onscreen = 1; // used of onscreen offscreen rendering
}

    rotate_image() {
        if (this.images.length != 0) {
            this.display_image(this.count % this.images.length);
            this.count++;
        }
    }

    async create_display() {
        this.getContentElement().innerHTML =
`
<div class='gallery'>
    <img id='0' src='images/${this.gallery}/${this.images[0]}' class='fullsize-image'>
    <img id='1' src='images/${this.gallery}/${this.images[1]}' class='fullsize-image'>
</div>
`;
        this.get_onscreen_image().style.display = 'none';
        this.get_offscreen_image().style.display = 'none';
    }

    process_json(json) {
        this.galleries = json.galleries;
        this.setGallery(this.gallery)
    }

    setGallery(gallery) {
        this.gallery = gallery;
        this.images = this.galleries[this.gallery];
        localStorage.setItem("gallery.gallery", gallery);
    }

    get_onscreen_image() {
        return this.is_onscreen_0() ? document.getElementById('0') : document.getElementById('1');
    }

    get_offscreen_image() {
        return this.is_onscreen_0() ? document.getElementById('1') : document.getElementById('0');
    }

    is_onscreen_0() {
        return this.onscreen == 0;
    }

    display_image(i) {
        this.get_offscreen_image().onload = () => {
            this.get_offscreen_image().style.display = 'block';
            this.get_onscreen_image().style.display = 'none';
            this.onscreen = 1 - this.onscreen;
        }
        this.get_offscreen_image().src = `images/${this.gallery}/${this.images[i]}`;
    }

    async scheduled_rotate() {
        if (this.images.length != 0) {
            this.rotate_image()
            this.rotateInterval = setInterval(() => this.rotate_image(), this.delay);
        }
    }

    supportsConfig() {
        return true;
    }

    async showConfigPage() {
        await this.init();
        console.log(`galleries ${JSON.stringify(Object.keys(this.galleries))}`);
        this.getContentElement().innerHTML =
`
<div id='galleryConfig' class='pt-3 container'>
    <h1 class='text-center'>${this.title} Config Page</h1>
    <div class='row mt-3'>
        <div class='col-4'>
            <p class='float-end'>Gallery: </p>
        </div>
        <div class='col-8'>
            ${this.getGalleriesSelectionBox()}
        </div>
    </div>
    <div class='row mt-4'>
        <div class='col-4'>
            <p class='float-end'>Delay: </p>
        </div>
        <div class='col-4'>
            <input id='delay' type='range' class='custom-range' min='3000' max='30000' value='${this.delay}'>
        </div>
        <div class='col-4'>
            <p id='delayText'>${this.delay}</p>
        </div>
        <button type='button btn-block' class='btn btn-primary mt-3' onclick='controller.changeApp("config", event)'>OK</button>
    </div>
</div>
`;
        const setText = () => { document.getElementById('delayText').textContent = `${this.delay/1000} s`; }
        setText();

        document.getElementById('gallerySelect').addEventListener('change', (event) => {
            this.setGallery(event.target.value);
        });
        document.getElementById('delay').addEventListener('input', (event) => {
            this.delay = +event.target.value;
            setText();
        });
    }
    
    getGalleriesSelectionBox() {
        var html = `
<select id='gallerySelect' class='form-select' aria-label='Default select example'>
  <option selected>Select gallery</option>
`;
        Object.keys(this.galleries).forEach(g => html += `<option value='${g}'${g == this.gallery ? 'selected' : ''}>${g}</option>`)
        html += `
    </select>
`;
        return html;
    }

    stop() {
        clearInterval(this.rotateInterval);
    }

    async run() {
        await this.init();
        this.create_display();
        this.scheduled_rotate();
    }

    async init() {
        const url = window.location.href.startsWith('http://localhost:') ? '' : 'app/gallery/gallery.php';
        await this.fetch_content_json(url).then(j => this.process_json(j));
        if (localStorage.getItem("gallery.gallery") !== null) {
            this.setGallery(localStorage.getItem("gallery.gallery"));
        };
    }
}

controller.register(new Gallery() );

