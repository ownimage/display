class Common {

    static async fetch_content_json(filename) {
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

    static eventToTouchArea(event) {
    // takes an event either pointer or touch and converts it to a number 0..3 to represent which area of the screen
    // was touched.  Id the event is not recognised it returns -1
        event.stopPropagation();
        if (this.lastEvent === event) return; // debounce event

        this.lastEvent = event;

        let relX = 0.0;
        let relY = 0.0;

        if (event.constructor.name == 'PointerEvent') {
            relX = event.pageX / window.innerWidth;
            relY = event.pageY / window.innerHeight;
        }
        else if (event.constructor.name == 'TouchEvent') {
            relX = event.touches[0].clientX / window.innerWidth;
            relY = event.touches[0].clientY / window.innerHeight;
        }
        else return -1;

        if (relY > 0.9) return 1;
        return -1;
    }
}
