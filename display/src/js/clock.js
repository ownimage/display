

class Clock {
    constructor() {
    }

    getCurrentTime() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    }

    setupDisplay() {
        document.body.innerHTML = `<h1 class=clock>${this.getCurrentTime()}</h1>`
    }
}

const clock = new Clock();
clock.setupDisplay();
setInterval(() => clock.setupDisplay(), 1000);
