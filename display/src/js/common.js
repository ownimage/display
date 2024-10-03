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
