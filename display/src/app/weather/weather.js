class Weather extends Base  {

    constructor(contentDiv) {
        super('weather');
        this.hasAppPage = true;
        this.hasConfigPage = true;
        this.title = 'Weather';

        this.delay = 3000;

        this.url = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/chester-le-street?unitGroup=metric&key=TNYUBN3FLWYRKV8SGQ8UGG945&contentType=json'
    }

    setupDisplay() {
        this.getContentElement().innerHTML =
`
<div id="carouselExample" class="carousel slide vh-100 vw-100" data-bs-ride="carousel">
  <div class="carousel-inner h-100 w-100">
    <div class="carousel-item active h-100 w-100">
        <p>Current temperature: ${this.weather.currentConditions.temp}</p>
        <p>Wind Speed: ${this.weather.currentConditions.windspeed}</p>
        <p>Wind Gust: ${this.weather.currentConditions.windgust}</p>
        <p>Wind Dir: ${this.weather.currentConditions.winddir}</p>
        <p>Pressure: ${this.weather.currentConditions.pressure}</p>
        <p>Cloud Cover: ${this.weather.currentConditions.cloudcover}</p>
    </div>
    <div class="carousel-item h-100 w-100">
          <p>Solar Radiation: ${this.weather.currentConditions.solarradiation}</p>
          <img src='app/weather/icons/${this.weather.currentConditions.icon}.png'</img>
          <p>Conditions: ${this.weather.currentConditions.conditions}</p>
          <p>Solar Radiation: ${this.weather.currentConditions.solarradiation}</p>
          <p>Sunrise: ${this.weather.currentConditions.sunrise}</p>
          <p>Sunset: ${this.weather.currentConditions.sunset}</p>
          <p>MoonPhase: ${this.weather.currentConditions.moonphase}</p>
    </div>
  </div>
</div>
`}

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

    async run() {
        this.setupDisplay();
        var myCarousel = document.getElementById('carouselExample');
        var carousel = new bootstrap.Carousel(myCarousel, {
          interval: this.delay,
          wrap: true
        });
    }

    stop() {
    }

    async init() {
        let url = (window.location.href.startsWith('http://localhost:')) ? '' : this.url;
        await this.fetch_content_json(url).then(j => this.process_json(j));
    }

    process_json(json) {
        this.weather = json
    }

    // icons from https://github.com/visualcrossing/WeatherIcons
    //curl 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/chester-le-street?unitGroup=metric&key=TNYUBN3FLWYRKV8SGQ8UGG945&contentType=json'
}

controller.register(new Weather() );
