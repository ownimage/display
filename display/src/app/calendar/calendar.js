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

    loadScript(url, callback)
    {
        // Adding the script tag to the head as suggested before
        var head = document.head;
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;

        // Then bind the event to the callback function.
        // There are several events for cross browser compatibility.
        script.onreadystatechange = callback;
        script.onload = callback;

        // Fire the loading
        head.appendChild(script);
    }


    setupDisplay() {
        this.contentDiv.innerHTML =
            `
<h1>Upcoming Google Calendar Events</h1>
<button id="authorize_button" style="visibility: hidden;" onTouchStart="calendar.handleAuthClick(event)" onclick="calendar.handleAuthClick(event)">Authorize</button>
<div id="events"></div>
`}

    gapiLoaded() {
        gapi.load('client', () => this.initializeGapiClient());
        this.clientLoaded = true;
    }

    async initializeGapiClient() {
        await gapi.client.init({
            apiKey: 'AIzaSyDKUfxX-7Z_uv6qBc6LTNZy8mQNMMJ2JQs',
            discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
        });
        this.gapiInited = true;
        this.maybeEnableButtons();
    }

    gisLoaded() {
        this.tokenClient = google.accounts.oauth2.initTokenClient({
            client_id: '621701457931-ufnkse0r4vhhr2h6csbemdmcj8hrbii6.apps.googleusercontent.com',
            scope: 'https://www.googleapis.com/auth/calendar.readonly',
            callback: '', // defined later
        });
        this.apiLoaded = true
        this.gisInited = true;
        this.maybeEnableButtons();
    }

    maybeEnableButtons() {
        if (this.gapiInited && this.gisInited) {
            document.getElementById('authorize_button').style.visibility = 'visible';
        }
        return;
    }

    handleAuthClick(event) {
        document.getElementById('authorize_button').style.visibility = 'hidden';
        if (this.skipAuth) {
            this.listUpcomingEvents();
            return;
        }
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
        this.skipAuth = true;
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
        if (!this.clientLoaded) {
            this.loadScript('https://accounts.google.com/gsi/client', () => this.gapiLoaded());
        }
        if (!this.apiLoaded) {
            this.loadScript('https://apis.google.com/js/api.js', () => this.gisLoaded());
        }

        this.setupDisplay();
        this.gapiLoaded();
        this.gisLoaded();
        this.maybeEnableButtons();
        this.handleAuthClick();
    }

    stop() {
    }

}


