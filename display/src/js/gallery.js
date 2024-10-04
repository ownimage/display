class Gallery {

    constructor(contentDiv, gallery, speed) {
        this.contentDiv = contentDiv;
        this.gallery = gallery;
        this.galleries = []
        this.speed = speed;
        this.count = 0;
        this.images = [];
        this.onscreen = 1;
    }

    getName() {
        return 'gallery';
    }

    getTitle() {
        return 'Gallery';
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

    showConfigPage() {
        console.log(`galleries ${JSON.stringify(Object.keys(this.galleries))}`);
        this.contentDiv.innerHTML =
`
<div id='galleryConfig' class='pt-3 container'>
    <h1>Gallery Config Page</h1>
    ${this.getGalleriesSelectionBox()}
    <button type='button' class='btn btn-primary mt-3' onclick='controller.changeApp("config", event)'>OK</button>
</div>
`;
        document.getElementById('gallerySelect').addEventListener('change', (event) => {
            this.setGallery(event.target.value);
        });
    }
    
    getGalleriesSelectionBox() {
        var html = `
<select id='gallerySelect' class='form-select' aria-label='Default select example'>
  <option selected>Select gallery</option>
`;
        Object.keys(this.galleries).forEach(g => html += `<option value='${g}'>${g}</option>`)
        html += `
    </select>
`;
        return html;
    }

    stop() {
        clearInterval(this.rotateInterval);
    }

    async run() {
        await Common.fetch_content_json('gallery.json')
            .then(j => {this.process_json(j); this.create_display();})
            .then(() => this.scheduled_rotate());
        console.log('done');
    }
}

