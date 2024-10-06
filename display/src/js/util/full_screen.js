// Function to request full-screen mode
function requestFullScreen() {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) { // Firefox
        elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) { // Chrome, Safari and Opera
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { // IE/Edge
        elem.msRequestFullscreen();
    }
}

// Function to hide the address bar
function hideAddressBar() {
    window.scrollTo(0, 1);
}

// Call functions on page load
window.onload = function() {
    requestFullScreen();
    hideAddressBar();
};
