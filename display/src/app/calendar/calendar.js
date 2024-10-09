let calendar = null;

class Calendar extends Base {

    constructor(contentDiv) {
        super('calendar')
        calendar = this;
        this.hasAppPage = true;
        this.hasConfigPage = false;
        this.title = 'Calendar';

        this.tokenClient = null;
    }

    setupDisplay() {
        this.getContentElement().innerHTML =
`
<div class='container'>
    <h1>Upcoming Google Calendar Events</h1>
    <button id='button' type='button' class='btn btn-primary' onTouchStart='calendar.refreshToken(event)' onclick='calendar.refreshToken(event)'>Refresh</button>
    <div id='events'></div>
</div>
`}

    refreshToken(event) {
        if (event) { event.stopPropagation(); }
        console.log('refreshToken');
        this.handleAuthClick();
    }

    setButtonVisible(visible=true) {
        if (visible) {
            document.getElementById('button').classList.remove('d-none');
        }
        else {
            document.getElementById('button').classList.add('d-none');
        }

    }

    gapiLoaded(event) {
        if (event) { event.stopPropagation(); }
        console.log('gapiLoaded');
        gapi.load('client', () => this.initializeGapiClient());
    }

    async initializeGapiClient() {
        console.log('initializeGapiClient');
        await gapi.client.init({
            apiKey: 'AIzaSyDKUfxX-7Z_uv6qBc6LTNZy8mQNMMJ2JQs',
            discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
        });
        this.gisLoaded()
    }

    gisLoaded() {
        console.log('gisLoaded');
        this.tokenClient = google.accounts.oauth2.initTokenClient({
            client_id: '621701457931-ufnkse0r4vhhr2h6csbemdmcj8hrbii6.apps.googleusercontent.com',
            scope: 'https://www.googleapis.com/auth/calendar.readonly',
            callback: '', // defined later
        });

    }

    handleAuthClick(event) {
        console.log('handleAuthClick');
        if (event) { event.stopPropagation(); }

        this.tokenClient.callback = async (resp) => {
            if (resp.error !== undefined) {
                throw (resp);
            }
            await this.listUpcomingEvents();
        };

        if (gapi.client.getToken() === null) {
            this.setButtonVisible(true);
            this.tokenClient.requestAccessToken({ prompt: 'consent' });
        } else {
            this.tokenClient.requestAccessToken({ prompt: '' });
            this.listUpcomingEvents();
        }
    }

    async listUpcomingEvents() {
        this.setButtonVisible(false);
        console.log('listUpcomingEvents');
        let response;
        try {
            response = await gapi.client.calendar.events.list({
                'calendarId': 'primary',
                'timeMin': (new Date()).toISOString(),
                'showDeleted': false,
                'singleEvents': true,
                'maxResults': 10,
                'orderBy': 'startTime'
            });
        } catch (err) {
            console.error(err.message);
            return;
        }

        const events = response.result.items;
        const output = document.getElementById('events');
        if (!events || events.length == 0) {
            output.innerHTML = '<p>No upcoming events found.</p>';
            return;
        }

        output.innerHTML = '<h2>Upcoming events:</h2>';

        for (let i = 0; i < events.length; i++) {
            const event = events[i];
            const when = event.start.dateTime || event.start.date;
            output.innerHTML += `<p>${event.summary} (${when})</p>`;
        }

    }

    async init() {
        console.log('init');
        await this.loadScript('https://apis.google.com/js/api.js');
        await this.loadScript('https://accounts.google.com/gsi/client');
        this.gapiLoaded();
    }


    async run() {
        console.log('run');
        this.setupDisplay();
        this.handleAuthClick();
    }

    stop() {
    }

}

(()=>{
    let calendar = new Calendar();
    calendar.init()
    .then( () => controller.register(calendar) );
})();


