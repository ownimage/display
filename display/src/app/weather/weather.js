class Weather extends Base  {

    constructor(contentDiv) {
        super('weather', true);
        this.hasAppPage = true;
        this.hasConfigPage = true;
        this.title = 'Weather';

        this.delay = 3000;

        this.testMoonPhase = 0.5;

        this.url = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/chester-le-street?unitGroup=metric&key=TNYUBN3FLWYRKV8SGQ8UGG945&contentType=json'
    }

    setupDisplay() {
        this.getContentElement().innerHTML =
`
<div id='weather' class='carousel slide vh-100 vw-100 container' data-bs-ride='carousel'>

    <div class='row'>
        <label for='testMoonPhase' class='form-label'>Moon Phase</label>
        <input type='range' class='form-range' id='testMoonPhase' min='0' max='1' step='0.01' value='${this.testMoonPhase}'>
    </div>

    <div class='carousel-inner h-100 w-100'>
        <div class='carousel-item active h-100 w-100'>
            <div class='row mt-5'>

                <div class='col-6'>
                    <div class='card text-white bg-secondary mb-3'>
                        <h1 class='text-center'>${this.weather.currentConditions.temp}&deg;C</h1>
                        <img class='mx-auto' src='app/weather/icons/weather/${this.weather.currentConditions.icon}.svg' width='200' height='200'</img>
                        <h3 class='text-center'>${this.weather.currentConditions.conditions}</h3>
                    </div>
                </div>
                <div class='wind col-6'>
                    <div class='card text-white bg-secondary mb-3'>
                        <h1 class='text-center'>Wind</h1>
                        ${this.drawWindCard(this.weather.currentConditions.windspeed,this.weather.currentConditions.windgust, this.weather.currentConditions.winddir) }
                        <h3 class='text-center'>${this.weather.currentConditions.windspeed} mph / ${this.weather.currentConditions.windgust} mph @ ${this.weather.currentConditions.winddir}&deg; ${this.getWindDirLabel(this.weather.currentConditions.winddir)}</h3>
                    </div>
                </div>

            </div>
            <div class='row mt-2'>
                <div class='col-4'>
                    <div class='card text-white bg-secondary'>
                        <h1 class='text-center'>Moon</h1>
                        <div id='moonsvg' class='mx-auto'>
                        </div>
                        <h1 class='text-center'>${this.getMoonPhaseDescription(this.weather.currentConditions.moonphase)}</h1>

                    </div>
                </div>

                <div class='col-4'>
                    <div class='card text-white bg-secondary'>
                        <h1 class='text-center'>Sunrise</h1>
                        <img class='mx-auto' src='app/weather/icons/sun/sunrise.png' width='200' height='200'</img>
                        <h1 class='text-center'>${this.weather.currentConditions.sunrise}</h1>
                    </div>
                </div>
                <div class='col-4'>
                    <div class='card text-white bg-secondary'>
                        <h1 class='text-center'>Sunset</h1>
                        <img class='mx-auto' src='app/weather/icons/sun/sunset.png' width='200' height='200'</img>
                        <h1 class='text-center'>${this.weather.currentConditions.sunset}</h1>
                    </div>
                </div>
                <div class='row mt-5'>
                    <div class='col-6'>
                        <div class='card text-white bg-secondary mb-3'>
                            <p>Solar Radiation: ${this.weather.currentConditions.solarradiation}</p>
                            <p>Solar Radiation: ${this.weather.currentConditions.solarradiation}</p>
                            <p>Pressure: ${this.weather.currentConditions.pressure}</p>
                        </div>
                    </div>
                    <div class='col-6'>
                        <div class='card text-white bg-secondary'>
                            <p>Cloud Cover: ${this.weather.currentConditions.cloudcover}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
`;
        this.drawMoon(this.weather.currentConditions.moonphase);
        const tmp = document.getElementById('testMoonPhase');
        tmp.addEventListener('input', () => {
            this.testMoonPhase = tmp.value;
            this.drawMoon(this.testMoonPhase);
            console.log(`testMoonPhase = ${this.testMoonPhase}`)
        } );
    }

    async showConfigPage() {
        this.getContentElement().innerHTML =
`
<div id='weatherConfig' class='pt-3 container'>
    <h1 class='text-center'>${this.title} Config Page</h1>
    <div class='row mt-3'>
        <div class='col-4'>
            <p class='float-end'>Delay: </p>
        </div>
        <div class='col-4'>
            <input id='delay' type='range' class='custom-range' min='3000' max='30000' value='${this.delay}'>
        </div>
        <div class='col-4'>
            <p id='delayText'>${this.delay}</p>
        </div>
        <button type='button btn-block' class='btn btn-primary mt-3' onclick='controller.changeApp("config", event)'>OK</button>
    </div>
</div>
`;
        const setText = () => { document.getElementById('delayText').textContent = `${this.delay/1000} s`; }
        setText();
        document.getElementById('delay').addEventListener('input', (event) => {
            this.delay = +event.target.value;
            setText();
        });
    }

    getMoonPhaseDescription(phase) {
        const phases = [
            'New Moon', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous',
            'Full Moon', 'Waning Gibbous', 'Last Quarter', 'Waning Crescent'
        ];

        if (phase === 0 || phase === 1) {
            return phases[0]; // 'New Moon'
        }

        const index = Math.floor(phase * 8) % 8;
        return phases[index];
    }

    getWindDirLabel(windDir) {
        const windDirLabels = [
                'N', 'NNE', 'NE', 'ENE',
                'E', 'ESE', 'SE', 'SSE',
                'S', 'SSW', 'SW', 'WSW',
                'W', 'WNW', 'NW', 'NNW'
            ];

            return windDirLabels[Math.floor(((windDir/360 + 31/32) * 16) % 16)];
    }

    drawWindCard(speed=50, gust=80, windFrom=0) {
        const speedScale = 35; //difference in size that doubling the speed makes

        const speedLength = calcSpeedLength(speed, speedScale);
        const gustLength = calcSpeedLength(gust, speedScale);;
        const arrowHeadLength = 30;
        const arrowHeadWidth = 15;

        const translate = [
            {x: 0, y: 200}, {x: 0, y: 200}, {x: 0, y: 0}, {x: 0, y: 0},
            {x: 200, y: 0}, {x: 200, y: 0}, {x: 200, y: 200}, {x: 200, y: 200}
        ];
        const index = Math.floor(((windFrom + 180) /45) % 8);
        console.log(index);

        let cx = translate[index].x;
        let cy = translate[index].y;
        let windSpeedBars = [35, 70, 105, 140, 175];


        function calcSpeedLength(speed, speedScale, firstSpeedBar=5) {
            return speedScale * ( 1 + (Math.log(speed) / Math.LN2) - (Math.log(firstSpeedBar) / Math.LN2));
        }

        let labels = [
            { x: 165, y: 30, text: 5 },
            { x: 130, y: 30, text: 10 },
            { x: 95, y: 30, text: 20 },
            { x: 60, y: 30, text: 40 },
            { x: 25, y: 30, text: 80 },
        ];
        const labelTransforms = [
            l => { return { x: 200-l.x, y: 190, text: l.text } },
            l => { return { x: 15, y: l.x, text: l.text } },
            l => { return { x: 15, y: 200-l.x, text: l.text } },
            l => { return { x: 200-l.x, y: 15, text: l.text } },
            l => { return { x: l.x, y: 15, text: l.text } },
            l => { return { x: 185, y: 200-l.x, text: l.text } },
            l => { return { x: l.x, y: 190, text: l.text } },
            l => { return { x: 185, y: l.x, text: l.text } },
        ];
        labels = labels.map(labelTransforms[index]);


        return `
<svg class='mx-auto' width='200' height='200' xmlns='http://www.w3.org/2000/svg'>

    <g class='windSpeedBars'>
        ${windSpeedBars.map(b => `<circle cx='${cx}' cy='${cy}' r='${b}'/>`).join('\n')}
    </g>

    <g class='windLabels'>
        ${labels.map(l => `<text x='${l.x}' y='${l.y}'>${l.text}</text>`).join('\n')}
    </g>

    <g transform='translate(${cx},${cy}) rotate(${windFrom + 90})'>
        <path class='arrow' d='M0,0 L${gustLength-arrowHeadLength/2},0'/>
        <path class='arrowHead' d='M${gustLength},0 L${gustLength-arrowHeadLength},${arrowHeadWidth} L${gustLength-arrowHeadLength},${-arrowHeadWidth} Z'/>
        <path class='arrowHead' d='M${speedLength},0 L${speedLength-arrowHeadLength},${arrowHeadWidth} L${speedLength-arrowHeadLength},${-arrowHeadWidth} Z'</g>
    </g>

</svg>
`;
    }

    drawMoon(phase) {
        const moonPhaseRadians = 2 * Math.PI * phase;
        const moonRadius = 80;
        console.log(`moonPhaseRadians: ${moonPhaseRadians}`);
        console.log(`Math.cos(moonPhaseRadians + Math.PI) ${Math.cos(moonPhaseRadians + Math.PI)}`);

        let first = true;
        let pathData = '';

        for (let drawThetaDegrees = 0; drawThetaDegrees <= 360; drawThetaDegrees += 10) {
            let drawThetaRadians = Math.PI * drawThetaDegrees / 180;
            pathData += first ? 'M ' : 'L ';
            first = false;
            let x = 0;
            if (Math.cos(drawThetaRadians) < 0) { // left hand side
                moonPhaseRadians < Math.PI ?
                    x = 100 + (moonRadius * Math.cos(drawThetaRadians) ) :
                    x = 100 - (moonRadius * Math.cos(drawThetaRadians) * Math.cos(moonPhaseRadians) );
//                    x = -200;
            }
            else { // right hand side
                moonPhaseRadians > Math.PI ?
                    x = 100 + moonRadius * Math.cos(drawThetaRadians) :
                    x = 100 - moonRadius * Math.cos(drawThetaRadians) * Math.cos(moonPhaseRadians);
            }

            const y = 100 + moonRadius * Math.sin(drawThetaRadians)
            pathData += `${x} ${y} `;
        }
        const svg = `
<svg class='mx-auto' width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'>
    <path d='${pathData}'/>
</svg>`;
    document.getElementById('moonsvg').innerHTML = svg;
    }

    async run() {
        this.setupDisplay();
        var myCarousel = document.getElementById('carouselExample');
//        var carousel = new bootstrap.Carousel(myCarousel, {
//          interval: this.delay,
//          wrap: true
//        });
    }

    stop() {
    }

    async init() {
        let url = (window.location.href.startsWith('http://localhost:')) ? '' : this.url;
        url = this.url;
        await this.fetch_content_json(url).then(j => this.process_json(j));
    }

    process_json(json) {
        this.weather = json
    }

    // icons from https://github.com/visualcrossing/WeatherIcons
    //curl 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/chester-le-street?unitGroup=metric&key=TNYUBN3FLWYRKV8SGQ8UGG945&contentType=json'
}

controller.register(new Weather() );
