var xml2js = require('xml2js');

(async function () {
    var cmd = process.argv[1];
    switch (cmd) {
        case 'list-languages': {
            var videoId = process.argv[2];
            var url = `http://www.youtube.com/api/timedtext?type=list&v=${videoId}`;
            console.error(`fetching`, url)
            var xml = await (await fetch(url)).text();
            var parser = new xml2js.Parser(/* options */);
            var jso = parser.parseStringPromise(xml)
            debugger;
            break;
        }
        case 'download-subtitle': {

            break;
        }
    }
})()
