let calendar = null;

class Calendar extends Base {

    constructor(contentDiv) {
        super('calendar')
        calendar = this;
        this.hasAppPage = true;
        this.hasConfigPage = true;
        this.title = 'Calendar App';

        this.fetchSize = 100;

        this.tokenClient = null;
        this.eventPage = `<div class='col-12'><h1>No events to show.</h1></div>`;
    }

    setupDisplay() {
        this.getContentElement().innerHTML =
`
<div class='container'>
    <div class='col-12'>
        <button id='button' type='button' class='btn btn-danger w-100 mt-5'>Login</button>
    </div>
    <div id='events'>
        ${this.eventPage}
    </div>
</div>
`;
        this.addListener('button', () => calendar.refreshToken(event));
    }

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
            apiKey: this.config.apiKey,
            discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
        });
        this.gisLoaded()
    }

    gisLoaded() {
        console.log('gisLoaded');
        this.tokenClient = google.accounts.oauth2.initTokenClient({
            client_id: this.config.client_id,
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
            localStorage.setItem('google_token', resp.access_token);
            localStorage.setItem('google_refresh_token', response.refresh_token);
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
        console.log('listUpcomingEvents');

        const token = localStorage.getItem('google_token');
        if (token) {
            gapi.client.setToken({ access_token: token });
        }

        this.setButtonVisible(false);
        let response;
        try {
            response = await gapi.client.calendar.events.list({
                'calendarId': 'primary',
                'timeMin': (new Date()).toISOString(),
                'showDeleted': false,
                'singleEvents': true,
                'maxResults': this.fetchSize,
                'orderBy': 'startTime'
            });
        } catch (err) {
            this.setButtonVisible(true);
            console.error(err.message);
            return;
        }

        const events = response.result.items;
        const output = document.getElementById('events');
        if (!events || events.length == 0) {
            output.innerHTML = this.eventPage;
            return;
        }

        this.eventPage = '';
        this.buildEventPage(null);
        let myEvents = events.map(this.convert);
        this.expandMultiDayEvent(myEvents);
        myEvents.forEach((currentValue, index, arr) => {this.eventPage += this.buildEventPage(currentValue);});
        this.eventPage += this.buildEventPage(null);
        output.innerHTML = this.eventPage;

    }

    expandMultiDayEvent(events) {
        const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const months = ["January", "February", "March", "April", "May", "June",
                        "July", "August", "September", "October", "November", "December"
        ];

        events.forEach((event, index, arr) => {
            for (let i = 1; i < event.numDays; i++) {
                let newEvent = {};
                newEvent.startDate = new Date(event.startDate.getTime() + i * 86400000);
                newEvent.year= newEvent.startDate.getFullYear()
                newEvent.month = months[newEvent.startDate.getMonth()];
                newEvent.dom = newEvent.startDate.getDate();
                newEvent.day = daysOfWeek[newEvent.startDate.getDay()];
                newEvent.recurring = event.recurring;
                newEvent.allDay = event.allDay;
                newEvent.numDays = 1;
                newEvent.startTime = event.startTime;
                newEvent.endTime = event.endTime;
                newEvent.summary = event.summary;

                events.push(newEvent);
            }
            event.numDays = 1;


        });
        events.sort((a, b) => { return a.startDate.getTime() - b.startDate.getTime();});
    }

    convert(event) {

        const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const months = ["January", "February", "March", "April", "May", "June",
                        "July", "August", "September", "October", "November", "December"
        ];

        const start = new Date(Date.parse(event.start.dateTime || event.start.date));
        const end = new Date(Date.parse(event.end.dateTime || event.end.date));


        const newEvent = {
            'startDate': start,
            'year': start.getFullYear(),
            'month': months[start.getMonth()],
            'dom': start.getDate(),
            'day': daysOfWeek[start.getDay()],
            'year': start.getFullYear(),
            'month': months[start.getMonth()],
            'dom': start.getDate(),
            'day': daysOfWeek[start.getDay()],
            'recurring': event.recurringEventId? true : false,
            'allDay': event.start.date ? true : false,
            'numDays': Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)),
            'startTime': start.toLocaleTimeString(),
            'endTime': end.toLocaleTimeString(),
            'summary': event.summary,
        }
        return newEvent;
    }

    buildEventPage(event) {
        console.log(JSON.stringify(event));
        if (!this.lastEvent && !event) {
            this.lastEvent = event;
            return;
        }

        let fragment = '';

        // close day
        if (!event || (this.lastEvent && !this.sameDay(event, this.lastEvent) ) ) fragment += `
          </ul>
    </div>
</div>
`;
        // close month
        if (!event || (this.lastEvent && !this.sameMonth(event, this.lastEvent) ) ) fragment += `
        </div>
`;

        // open month
        if (!this.lastEvent || (event && !this.sameMonth(this.lastEvent, event)) ) fragment += `
        <div class="Row">
            <h1 class="bg-primary mb-3 pb-1">${event.month}, ${event.year}</h1>
`;

        // open day
        if (!this.lastEvent || (event && !this.sameDay(this.lastEvent, event)) ) fragment += `
<div class='col-md-4'>
    <div class="card text-white bg-secondary mb-3">
         <h3 class="card-title">&nbsp;${event.day} ${event.dom}</h3>
          <ul class="list-group list-group-flush">
`;

        if (event) fragment += `${this.formatEventLine(event)}`;

        this.lastEvent = event;
        return fragment;
    }

    formatEventLine(event) {
        if (event.allDay) {
            return `<li class="list-group-item bg-warning text-black">${event.summary}<i class="float-end mx-1 fa-regular fa-calendar"></i><i class="bi bi-calendar2-day"></i></li>`;

        }
        else if (event.recurring) {
            return `<li class="list-group-item bg-info text-dark">${event.startTime} - ${event.endTime} ${event.summary}<i class="float-end mx-1 fa-solid fa-repeat"></i></li>`;
        }
        return `<li class="list-group-item bg-danger">${event.startTime} - ${event.endTime} ${event.summary}</li>`;
    }

    sameDay(e1, e2) {
    // same if both exist and both have same month and year
        return this.sameMonth && e1.dom === e2.dom;
    }

    sameMonth(e1, e2) {
    // same if both exist and both have same month and year
        return e1 && e2 && e1.month === e2.month && e1.year === e2.year;
    }

    async showConfigPage() {
        this.getContentElement().innerHTML =
`
<div id='calendarConfig' class='pt-3 container'>
    <h1 class='text-center'>${this.title} Config Page</h1>
    <div class='row mt-3'>
        <div class='col-4'>
            <p class='float-end'>Fetch size: </p>
        </div>
        <div class='col-4'>
            <input id='fetchSize' type='range' class='custom-range' min='20' max='300' value='${this.fetchSize}'>
        </div>
        <div class='col-4'>
            <p id='fetchSizeText'>${this.delay}</p>
        </div>
        <button type='button btn-block' class='btn btn-primary mt-3' onclick='controller.changeApp("config", event)'>OK</button>
    </div>
</div>
`;
        const setText = () => { document.getElementById('fetchSizeText').textContent = `${this.fetchSize}`; }
        setText();
        document.getElementById('fetchSize').addEventListener('input', (event) => {
            this.fetchSize = +event.target.value;
            setText();
        });
    }

    autoRefreshToken() {
        const refreshToken = localStorage.getItem('google_refresh_token');
        if (refreshToken) {
            fetch('https://oauth2.googleapis.com/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    'client_id': this.config.client_id,
                    'client_secret': this.config.client_secret,
                    'refresh_token': refreshToken,
                    'grant_type': 'refresh_token'
                })
            }).then(response => response.json())
            .then(data => {
                if (data.access_token) {
                  localStorage.setItem('google_token', data.access_token);
                  gapi.client.setToken({ access_token: data.access_token });
                }
          }).catch(error => console.error('Error refreshing token:', error));
        }
    }


    process_json(json) {
        this.config = json;
    }

    async init() {
        await this.fetch_content_json().then(j => this.process_json(j));
        await this.loadScript('https://apis.google.com/js/api.js');
        await this.loadScript('https://accounts.google.com/gsi/client');
        this.gapiLoaded();
        setInterval(this.autoRefreshToken, 50 * 60 * 1000);
    }


    async run() {
        console.log('run');
        this.setupDisplay();
        this.listUpcomingEvents();
    }

    stop() {
    }

}

controller.register(new Calendar());


