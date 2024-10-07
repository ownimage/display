class Gallery extends Base{

    constructor(contentDiv, gallery, speed) {
        super('gallery', true);
        this.hasAppPage = true;
        this.hasConfigPage = true;
        this.title = 'Gallery';

        this.contentDiv = contentDiv;
        this.gallery = gallery;
        this.speed = speed;

        this.isInit = false;

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
        this.contentDiv.innerHTML =
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
            this.rotateInterval = setInterval(() => this.rotate_image(), this.speed);
        }
    }

    supportsConfig() {
        return true;
    }

    async showConfigPage() {
        await this.init();
        console.log(`galleries ${JSON.stringify(Object.keys(this.galleries))}`);
        this.contentDiv.innerHTML =
`
<div id='galleryConfig' class='pt-3 container'>
    <h1 class='text-center'>Gallery Config Page</h1>
    <div class='row mt-3'>
        <div class='col-6'>
            <p class='float-end'>Gallery: </p>
        </div>
        <div class='col-6'>
            ${this.getGalleriesSelectionBox()}
        </div>
    </div>
    <div class='row mt-3'>
        <div class='col-6'>
            <p class='float-end'>Speed: </p>
        </div>
        <div class='col-6'>
            <input id='speed' type='range' class='custom-range' min='3000' max='30000' value='${this.speed}'>
        </div>
        <button type='button btn-block' class='btn btn-primary mt-3' onclick='controller.changeApp("config", event)'>OK</button>
    </div>
</div>
`;
        document.getElementById('gallerySelect').addEventListener('change', (event) => {
            this.setGallery(event.target.value);
        });
        document.getElementById('speed').addEventListener('change', (event) => {
            this.speed = event.target.value;
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
        console.log('done');
    }

    async init() {
        if (!this.isInit) {
            this.isInit = true;
            await this.fetch_content_json()
                .then(j => this.process_json(j));
        }
    }
}

