class Gallery {

    constructor(gallery, speed) {
        this.count = 0;
        this.gallery = gallery;
        this.images = [];
        this.onscreen = 1;
        this.speed = speed;
    }

    rotate_image() {
        if (this.images.length != 0) {
            this.display_image(this.count % this.images.length);
            this.count++;
        }
    }

    async create_display() {
        document.body.innerHTML = "<img id=\"0\" src=\"images/" + this.gallery + "/" + this.images[0] + "\" class=\"fullsize-image\">" +
        "<img id=\"1\" src=\"images/" + this.gallery + "/" + this.images[1] + "\" class=\"fullsize-image\">";
        this.get_onscreen_image().style.display = 'none';
        this.get_offscreen_image().style.display = 'none';
    }

    process_json(json) {
        this.images = json.galleries[this.gallery];
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

    stop() {
        clearInterval(this.rotateInterval);
    }

    async run() {
        await fetch_content_json('content.json')
            .then(j => {this.process_json(j); this.create_display();})
            .then(() => this.scheduled_rotate());
        console.log('done');
    }
}

