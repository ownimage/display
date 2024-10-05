class Quotes {

    constructor(contentDiv) {
        this.contentDiv = contentDiv;
        this.hasConfigPage = false;
        this.speed = 20000;
        this.count = 0;
        this.quotes = [{q: 'Nothing to see here.', a: 'Officer Barbrady'}];
        this.api_url = 'https://zenquotes.io/api/quotes'
    }

    getName() {
        return 'quotes';
    }

    getTitle() {
        return 'Quotes';
    }

    setupDisplay() {
        this.contentDiv.innerHTML =
`

<div id='quote' class='pt-3 container'>
    <h1 class='text-center'>Quote:</h1>

    <div class="px-4 py-5 my-5 text-center">
        <h1 class="display-5 fw-bold">${this.quotes[this.count].q}</h1>
        <div class="col-lg-6 mx-auto">
            <p>&nbsp</p>
            <p>&nbsp</p>
            <p class="lead mb-4">${this.quotes[this.count].a}</p>
        </div>
    </div>


</div>
<div class="fixed-bottom">
    <div
         class="text-center p-3"
         style="background-color: rgba(0, 0, 0, 0.2)"
         >
         <p>Quotes from https://zenquotes.io/api/quotes</p>
    </div>
</div>
`;
    }

    rotate_quote() {
        if (this.quotes.length != 0) {
            this.count = (this.count + 1) % this.quotes.length;
            this.setupDisplay();
        }
    }

    async scheduled_rotate() {
        if (this.quotes.length > 1) {
            this.rotate_quote()
            this.rotateInterval = setInterval(() => this.rotate_quote(), this.speed);
        }
    }


    async run() {
        if (this.quotes.length < 2) {
            await Common.fetch_content_json('quotes.json')
                .then(j => this.quotes = j)
        }
        this.count = Math.floor(Math.random() * this.quotes.length);
        this.setupDisplay();
        this.scheduled_rotate()
    }

    stop() {
        clearInterval(this.rotateInterval);
    }
}


