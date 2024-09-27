// This function will be called every 5 seconds
var count = 0;
var image = "202404-_DSC_5113.jpg.jpg"

async function myFunction() {
    console.log("This function runs every 1 seconds");
    changeBodyContent();
    await fetchHTML();
    count++;
}

// Set the interval to 5000 milliseconds (5 seconds)
setInterval(myFunction, 1000);

function changeBodyContent() {
    document.body.innerHTML = "<h1>New Content</h1><p>This is the new content of the body tag. " + count + "</p>"
    + "<h2 id=\"content\">change me</h2>"
    + "<img src=\"images/" + image + "\" width=\"800\" height=\"600\">"
}

async function fetchHTML() {
    try {
        const response = await fetch('content.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        t = await response.text();
        image = JSON.parse(t).image;
    } catch (error) {
        console.error('Error fetching the HTML file:', error);
    }
}

