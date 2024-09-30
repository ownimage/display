class Gallery {
    constructor() {
        this.count = 0;
        this.gallery = '';
        this.images = [];
        this.onscreen = 1;
        this.speed = 0;
    }

    async myFunction() {
        console.log("This function runs every 1 seconds");
        this.changeBodyContent();
        await this.fetchHTML();
        this.count++;
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
        console.log(this.get_onscreen_image());
        this.get_onscreen_image().style.display = 'none';
        this.get_offscreen_image().style.display = 'none';
    }

    async fetch_content_json() {
        try {
            console.log('fetch_content_json');
            const response = await fetch('content.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const t = await response.text();
            const j = JSON.parse(t);
            this.process_json(j);
            console.log('display created');
        } catch (error) {
            console.error('Error fetching the HTML file:', error);
        }
    }

    process_json(json) {
        console.log(json);
        this.speed = json.speed;
        this.gallery = json.gallery;
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
            setInterval(() => this.rotate_image(), this.speed);
        }
    }

    async run() {
        await this.fetch_content_json()
            .then(() => this.create_display())
            .then(() => this.scheduled_rotate());
        console.log('done');
    }
}

const gallery = new Gallery();
gallery.run();