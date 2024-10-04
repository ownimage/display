class Quotes {

    constructor(contentDiv) {
        this.contentDiv = contentDiv;
        this.quotes = null;
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

<div id='quote' class='pt-3'>
    <p></p>
    <h1 class='text-center'>Quote:</h1>

    <div class="px-4 py-5 my-5 text-center">
        <h1 class="display-5 fw-bold">${this.quotes[0].q}</h1>
        <div class="col-lg-6 mx-auto">
            <p>&nbsp</p>
            <p>&nbsp</p>
            <p class="lead mb-4">${this.quotes[0].a}</p>
        </div>
    </div>


</div>
<div class="fixed-bottom">
    <div
         class="text-center p-3"
         style="background-color: rgba(0, 0, 0, 0.2)"
         >
      © 2020 Copyright:
      <a class="text-white" href="https://mdbootstrap.com/"
         >MDBootstrap.com</a
        >
    </div>
</div>
`;
    }

    async run() {
        if (this.quotes == null) {
            await Common.fetch_content_json('quotes.json')
                .then(j => this.quotes = j)
        }
        this.setupDisplay();
    }

    stop() {
    }
}


