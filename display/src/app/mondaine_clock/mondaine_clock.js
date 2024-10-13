class MondaineClock extends Base {

    constructor(contentDiv) {
        super('mondaine_clock', true);
        this.hasAppPage = true;
        this.hasConfigPage = false;
        this.title = 'Mondaine Clock';
    }

    updateDisplay() {
        const now = new Date();

        const seconds = now.getSeconds();
        const seconds_angle = seconds * 6 - 90;
        const seconds_transform = `rotate(${seconds_angle})`
        document.getElementById('mondaine-second').setAttribute('transform', seconds_transform);
        document.getElementById('mondaine-second-circle').setAttribute('transform', seconds_transform);

        const minutes = now.getMinutes();
        const minutes_angle = minutes * 6 - 90;
        const minutes_transform = `rotate(${minutes_angle})`
        document.getElementById('mondaine-minute').setAttribute('transform', minutes_transform);

        const hours = now.getHours();
        const hours_angle = (hours + minutes/60) * 30 - 90;
        const hours_transform = `rotate(${hours_angle})`
        document.getElementById('mondaine-hour').setAttribute('transform', hours_transform);
    }

    drawHand(id, length, tail=0, tip_width=0, tail_width=0) {
        return `<polygon id='${id}' points='${-tail},${-tail_width} ${-tail},${tail_width} ${length},${tip_width} ${length},${-tip_width}'/>`;
    }

    drawTick(angle, length=10, width=2, diameter=190) {
        return `<polygon class='tick' points='${-length},${-width} ${length},${-width} ${length},${width} ${-length},${width}' transform='rotate(${angle}) translate(${diameter},0)'/>`;
    }

    setupDisplay() {
        var dial = ''
        for (var i = 0; i <= 60; i++) {
            var angle = i*6 - 90;
            if ((i % 5) != 0) {
                dial += `${this.drawTick(angle, 11, 3, 237)}`;
            }
            else {
                dial += `${this.drawTick(angle, 30, 8, 218)}`;
            }
        }

        const clock_normal_size = 575;
        const clock_desired_size = Math.min(window.innerHeight, window.innerWidth);
        const scale = clock_desired_size / clock_normal_size;

        this.getContentElement().innerHTML =
`
<div id='mondaine-clock'>
    <div>
        <svg height='${clock_desired_size}' width='${clock_desired_size}' xmlns='http://www.w3.org/2000/svg'>
            <g transform='translate(${clock_desired_size/2},${clock_desired_size/2}) scale(${scale})'>
                ${dial}
                ${this.drawHand('mondaine-hour', 222, 33, 12, 17)}
                ${this.drawHand('mondaine-minute', 236, 56, 10, 15)}
                ${this.drawHand('mondaine-second', 170, 78, 3, 3)}
                <circle id='mondaine-second-circle' cx='170' cy='0' r='21' />
            </g>
        </svg>
    <div>
</div>
`;
    }

    async run() {
        this.setupDisplay();
        this.updateDisplay();
        this.intervalId = setInterval(() => this.updateDisplay(), 1000);
    }

    stop() {
        clearInterval(this.intervalId);
    }
}

controller.register(new MondaineClock() );


