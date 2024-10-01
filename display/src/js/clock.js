class Clock {
    constructor() {
    }

    updateDisplay() {
        const now = new Date();

        const hours = now.getHours().toString().padStart(2, '0');
        const hours_angle = hours * 30 - 90;
        const hours_transform = `rotate(${hours_angle})`
        document.getElementById('hour').setAttribute('transform', hours_transform);

        const minutes = now.getMinutes().toString().padStart(2, '0');
        const minutes_angle = minutes * 6 - 90;
        const minutes_transform = `rotate(${minutes_angle})`
        document.getElementById('minute').setAttribute('transform', minutes_transform);


        const seconds = now.getSeconds().toString().padStart(2, '0');
        const seconds_angle = seconds * 6 - 90;
        const seconds_transform = `rotate(${seconds_angle})`
        document.getElementById('second').setAttribute('transform', seconds_transform);
    }

    drawHand(id, length, width, tail=0, tip_width=0, tail_width=0) {
        return `<polygon id="${id}" points="${-tail},${-tail_width} ${-tail},${tail_width} 0,${width} ${length},${tip_width} ${length},${-tip_width} 0,-${width}"/>`;
    }

    drawTick(angle, length=10, width=2, diameter=190) {
        return `<polygon class="tick" points="${-length},${-width} ${length},${-width} ${length},${width} ${-length},${width}" transform="rotate(${angle}) translate(${diameter},0)"/>`;
    }

    setupDisplay() {
        var dial = ""
        for (var i = 1; i <= 12; i++) {
            var angle = i*30-90;
            dial += `${this.drawTick(angle, 20, 4, 200)}`;
        }

        const clock_normal_size = 480;
        const scale = Math.min(window.innerWidth, window.innerHeight) / clock_normal_size;

        document.body.innerHTML = `
        <svg id="clock" height="${window.innerHeight}" width="${window.innerWidth}" xmlns="http://www.w3.org/2000/svg">
            <g transform="translate(${window.innerWidth/2},${window.innerHeight/2}) scale(${scale})">
                ${dial}
                ${this.drawHand('hour', 120, 10, 10, 5, 2)}
                ${this.drawHand('minute', 175, 10, 30, 5, 2)}
                ${this.drawHand('second', 200, 10, 50, 0, 0)}
            </g>
        </svg>
        `
    }
}

const clock = new Clock();
clock.setupDisplay();
clock.updateDisplay();
setInterval(() => clock.updateDisplay(), 1000);
