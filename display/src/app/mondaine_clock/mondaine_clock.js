class MondaineClock extends Base {

    constructor(contentDiv) {
        super('mondaine_clock', true);
        this.hasAppPage = true;
        this.hasConfigPage = false;
        this.title = 'Mondaine Clock';
    }

    updateDisplay() {
        const now = new Date();

        var seconds = now.getSeconds() + now.getMilliseconds() / 1000.0;
        const seconds_angle = (seconds / 58.0) * 360 - 90;
        if (seconds >= 58) seconds_angle = -90;
        const seconds_transform = `rotate(${seconds_angle})`
        document.getElementById('second').setAttribute('transform', seconds_transform);
        document.getElementById('second-circle').setAttribute('transform', seconds_transform);

        const minutes = now.getMinutes();
        const minutes_angle = minutes * 6 - 90;
        const minutes_transform = `rotate(${minutes_angle})`
        document.getElementById('minute').setAttribute('transform', minutes_transform);

        const hours = now.getHours();
        const hours_angle = (hours + minutes/60) * 30 - 90;
        const hours_transform = `rotate(${hours_angle})`
        document.getElementById('hour').setAttribute('transform', hours_transform);
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
                ${this.outerRing()}
                ${dial}
                ${this.drawHand('hour', 175, 60, 12, 17)}
                ${this.drawHand('minute', 236, 56, 10, 15)}
                <g class='second'>
                    ${this.drawHand('second', 170, 80, 3, 3)}
                    <circle id='second-circle' cx='170' cy='0' r='21' />
                    <circle id='second-center' cx='0' cy='0' r='12' />
                </g>
                <circle id='center' cx='0' cy='0' r='6' />
            </g>
        </svg>
    <div>
</div>
`;
    }

    outerRing() {
        return `
                    <defs>
                        <filter id='brushedAluminum'>
                            <feTurbulence type='fractalNoise' baseFrequency='0.5' numOctaves='3' result='noise'/>
                            <feDisplacementMap in='SourceGraphic' in2='noise' scale='5'/>
                        </filter>
                        <linearGradient id='grad1' x1='0%' y1='0%' x2='100%' y2='0%'>
                            <stop offset='0%' style='stop-color:#ddd;stop-opacity:1' />
                            <stop offset='100%' style='stop-color:#bbb;stop-opacity:1' />
                        </linearGradient>
                        <mask id='ringMask'>
                            <circle cx='0' cy='0' r='287' fill='white'/>
                            <circle cx='0' cy='0' r='265' fill='black'/>
                        </mask>
                    </defs>
                    <circle id='outer' cx='0' cy='0' r='575' fill='url(#grad1)' filter='url(#brushedAluminum)' mask='url(#ringMask)'/>
`;}

    async run() {
        this.setupDisplay();
        this.updateDisplay();
        this.intervalId = setInterval(() => this.updateDisplay(), 50);
    }

    stop() {
        clearInterval(this.intervalId);
    }
}

controller.register(new MondaineClock() );


