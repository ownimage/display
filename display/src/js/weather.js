class Weather {
    constructor() {
    }

    getName() {
        return 'weather';
    }

    setupDisplay() {
        document.body.innerHTML =
`
<iframe src="https://calendar.google.com/calendar/embed?height=1080&wkst=2&ctz=Europe%2FLondon&bgcolor=%23616161&showNav=0&showCalendars=0&showTabs=0&mode=WEEK&title&showTz=0&showPrint=0&showTitle=0&src=a2g5OTYwQGdtYWlsLmNvbQ&src=YWRkcmVzc2Jvb2sjY29udGFjdHNAZ3JvdXAudi5jYWxlbmRhci5nb29nbGUuY29t&src=ZW4udWsjaG9saWRheUBncm91cC52LmNhbGVuZGFyLmdvb2dsZS5jb20&color=%234285F4&color=%2333B679&color=%230B8043" style="border-width:0" width="1920" height="1080" frameborder="0" scrolling="no"></iframe>
`}

    async run() {
        this.setupDisplay();
    }

    stop() {
    }
}


