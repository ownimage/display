// This function will be called every 5 seconds
var count = 0
gallery = ''
var images = []

async function myFunction() {
    console.log("This function runs every 1 seconds")
    changeBodyContent();
    await fetchHTML();
    count++;
}

function rotate_image() {
    index = count % images.length
    document.body.innerHTML = "<img src=\"images/" + gallery + "/" + images[index] + "\" class=\"fullsize-image\">"
    count++
}

async function fetch_content_json() {
    try {
        const response = await fetch('content.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        t = await response.text();
        j = JSON.parse(t)
        process_json(j)
    } catch (error) {
        console.error('Error fetching the HTML file:', error)
    }
}

function process_json(json) {
    console.log(json)
    speed = json.speed
    gallery = json.gallery
    images = json.galleries[gallery]
    if (images.length != 0) {
        rotate_image()
        setInterval(rotate_image, speed);
    }
}

fetch_content_json()

