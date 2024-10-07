let calendar = null;

class Calendar extends Base {

    constructor(contentDiv) {
        super('calendar')
        calendar = this;
        this.contentDiv = contentDiv;
        this.hasAppPage = true;
        this.hasConfigPage = false;
        this.title = 'Calendar';

        this.tokenClient = null;
        this.gapiInited = false;
        this.gisInited = false;
    }

    setupDisplay() {
        this.contentDiv.innerHTML =
            `
<h1>Upcoming Google Calendar Events</h1>
<button id="authorize_button" style="visibility: hidden;" onTouchStart="calendar.handleAuthClick(event)" onclick="calendar.handleAuthClick(event)">Authorize</button>
<div id="events"></div>
`}

    gapiLoaded() {
        gapi.load('client', () => this.initializeGapiClient(this));
    }

    async initializeGapiClient(who) {
        await gapi.client.init({
            apiKey: 'AIzaSyDKUfxX-7Z_uv6qBc6LTNZy8mQNMMJ2JQs',
            discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
        });
        who.gapiInited = true;
        who.maybeEnableButtons();
    }

    gisLoaded() {
        this.tokenClient = google.accounts.oauth2.initTokenClient({
            client_id: '621701457931-ufnkse0r4vhhr2h6csbemdmcj8hrbii6.apps.googleusercontent.com',
            scope: 'https://www.googleapis.com/auth/calendar.readonly',
            callback: '', // defined later
        });
        this.gisInited = true;
        this.maybeEnableButtons();
    }

    maybeEnableButtons() {
        if (this.gapiInited && this.gisInited) {
            document.getElementById('authorize_button').style.visibility = 'visible';
        }
    }

    handleAuthClick(event) {
        event.stopPropagation();
        this.tokenClient.callback = async (resp) => {
            if (resp.error !== undefined) {
                throw (resp);
            }
            await this.listUpcomingEvents();
        };

        if (gapi.client.getToken() === null) {
            this.tokenClient.requestAccessToken({ prompt: 'consent' });
        } else {
            this.tokenClient.requestAccessToken({ prompt: '' });
        }
    }

    async listUpcomingEvents() {
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


    async run() {
        this.setupDisplay();
        this.gapiLoaded();
        this.gisLoaded();
    }

    stop() {
    }

}


