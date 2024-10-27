class Clock extends Base {

    constructor(contentDiv) {
        super('clock', true);
        this.hasAppPage = true;
        this.hasConfigPage = true;
        this.title = 'Clock';
    }

    updateDisplay() {
        const now = new Date();

        const seconds = now.getSeconds() + now.getMilliseconds() / 1000.0;
        const seconds_angle = seconds * 6 - 90;
        const seconds_transform = `rotate(${seconds_angle})`
        document.getElementById('second').setAttribute('transform', seconds_transform);

        const minutes = now.getMinutes();
        const minutes_angle = minutes * 6 - 90;
        const minutes_transform = `rotate(${minutes_angle})`
        document.getElementById('minute').setAttribute('transform', minutes_transform);

        const hours = now.getHours();
        const hours_angle = (hours + minutes/60) * 30 - 90;
        const hours_transform = `rotate(${hours_angle})`
        document.getElementById('hour').setAttribute('transform', hours_transform);
    }

    drawHand(id, length, width, tail=0, tip_width=0, tail_width=0) {
        return `<polygon id='${id}' points='${-tail},${-tail_width} ${-tail},${tail_width} 0,${width} ${length},${tip_width} ${length},${-tip_width} 0,-${width}'/>`;
    }

    drawTick(angle, length=10, width=2, diameter=190) {
        return `<polygon class='tick' points='${-length},${-width} ${length},${-width} ${length},${width} ${-length},${width}' transform='rotate(${angle}) translate(${diameter},0)'/>`;
    }

    setupDisplay() {
        var dial = ''
        for (var i = 0; i <= 12; i++) {
            var angle = i*30-90;
            dial += `${this.drawTick(angle, 20, 4, 200)}`;
        }

        const clock_normal_size = 440;
        const clock_desired_size = Math.min(window.innerHeight, window.innerWidth);
        const scale = clock_desired_size / clock_normal_size;

        this.getContentElement().innerHTML =
`
<div id='clock'>
    <div>
        <svg height='${clock_desired_size}' width='${clock_desired_size}' xmlns='http://www.w3.org/2000/svg'>
            <g transform='translate(${clock_desired_size/2},${clock_desired_size/2}) scale(${scale})'>
                ${dial}
                ${this.drawHand('hour', 120, 10, 10, 5, 2)}
                ${this.drawHand('minute', 175, 10, 30, 3, 2)}
                ${this.drawHand('second', 200, 10, 50, 0, 0)}
            </g>
        </svg>
    <div>
</div>
`;
    }

    async showConfigPage() {
        this.getContentElement().innerHTML = `
<div id='clockConfig' class='pt-3 container'>
    <h1 class='text-center'>${this.title} Config Page</h1>
    <div class='row mt-3'>
        <div class='col-4'>
            <p class='float-end'>Frames Per Second </p>
        </div>
        <input
            id='fps'
            type='range'
            class='custom-range col-2'
            min='1'
            max='10'
            value={this.config.fps}
            />
       <div class='col-2'>
            <p id='fpsText'>${this.config.fps} fps</p>
        </div>
    </div>
    <div class='row mt-3'>
         <button type='button btn-block' class='btn btn-primary mt-3' onclick='controller.changeApp("config", event)'>OK</button>
    </div>
</div>
`;

        const handleEditFPS = (fps) => {
            this.config.fps = fps;
            document.getElementById('fpsText').textContent = `${this.config.fps} fps`;
            localStorage.setItem('clock.config', JSON.stringify(this.config));
        }

        document.getElementById('fps').addEventListener('input', (event) => {
            handleEditFPS(event.target.value);
        });
    }

    async init() {
        let config = localStorage.getItem('clock.config');
        if (this.config == null) {
            this.config = {fps: 5};
        }
        else {
            this.config = JSON.parse(config);
        }
    }

    async run() {
        this.setupDisplay();
        this.updateDisplay();
        this.intervalId = setInterval(() => this.updateDisplay(), 1000 / this.config.fps);
    }

    stop() {
        clearInterval(this.intervalId);
    }
}

controller.register(new Clock());


