(function() {
    var oldLog = console.log;
    console.log = function(message) {
        oldLog.apply(console, arguments); // Call the original console.log
        var output = document.getElementById('consoleOutput');
        if (output) {
            var newMessage = document.createElement('div');
            newMessage.textContent = message;
            output.appendChild(newMessage);
        }
    };
})();


async function fetch_content_json(filename) {
    try {
        const response = await fetch(filename);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const t = await response.text();
        const j = JSON.parse(t);
        return j;
    } catch (error) {
        console.error('Error fetching the HTML file:', error);
    }
}
