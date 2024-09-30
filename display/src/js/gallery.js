// This function will be called every 5 seconds
var count = 0
gallery = ''
var images = []
onscreen = 1


async function myFunction() {
    console.log("This function runs every 1 seconds")
    changeBodyContent();
    await fetchHTML();
    count++;
}

function rotate_image() {
    if (images.length != 0) {
        display_image(count % images.length);
        count++;
    }
}

async function create_display() {
    document.body.innerHTML = "<img id=\"0\" src=\"images/" + gallery + "/" + images[0] + "\" class=\"fullsize-image\">" +
    "<img id=\"1\" src=\"images/" + gallery + "/" + images[1] + "\" class=\"fullsize-image\">";
    console.log(get_onscreen_image());
    get_onscreen_image().style.display = 'none';
    get_offscreen_image().style.display = 'none';
}

async function fetch_content_json() {
    try {
        console.log('fetch_content_json');
        const response = await fetch('content.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        t = await response.text();
        j = JSON.parse(t);
        process_json(j);
        console.log('display created');
    } catch (error) {
        console.error('Error fetching the HTML file:', error);
    }
}

function process_json(json) {
    console.log(json);
    speed = json.speed;
    gallery = json.gallery;
    images = json.galleries[gallery];
}

function get_onscreen_image() {
    return is_onscreen_0() ? document.getElementById('0') : document.getElementById('1');
}

function get_offscreen_image() {
    return is_onscreen_0() ? document.getElementById('1') : document.getElementById('0');
}

function is_onscreen_0() {
    return onscreen == 0;
}

function display_image(i) {
    get_offscreen_image().onload = function() {
        get_offscreen_image().style.display = 'block';
        get_onscreen_image().style.display = 'none';
        onscreen = 1 - onscreen;
    }
    get_offscreen_image().src = `images/${gallery}/${images[i]}`;
}

//function offscreen_set_src() {
//}
//
//function fetch_content_json() {
//}

async function scheduled_rotate() {
    if (images.length != 0) {
        rotate_image()
        setInterval(rotate_image, speed);
    }
}


fetch_content_json().then(create_display).then(scheduled_rotate);

console.log('done');


