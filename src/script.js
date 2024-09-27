// This function will be called every 5 seconds
var count = 0;
function myFunction() {
    console.log("This function runs every 1 seconds");
    changeBodyContent();
    count++;
}

// Set the interval to 5000 milliseconds (5 seconds)
setInterval(myFunction, 1000);

function changeBodyContent() {
    document.body.innerHTML = "<h1>New Content</h1><p>This is the new content of the body tag. " + count + "</p>"
    + "<img src=\"images/202404-_DSC_5066.jpg.jpg\" width=\"800\" height=\"600\">"
}

// Call the function to change the content
changeBodyContent();