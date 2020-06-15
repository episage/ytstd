const { program } = require('commander');
var xml2js = require('xml2js');
const fetch = require('node-fetch');
var os = require('os');
var _ = require('lodash');

(async function () {
    program
        .command('list-languages <video-id>')
        .description('list available subtitle languages')
        .action(async (videoId) => {
            var url = `http://www.youtube.com/api/timedtext?type=list&v=${videoId}`;
            var xml = await (await fetch(url)).text();
            var parser = new xml2js.Parser();
            var jso = await parser.parseStringPromise(xml)
            var out = jso.transcript_list.track.map(t => t['$'].lang_code).join(os.EOL);
            process.stdout.write(out + os.EOL);
        })

    program
        .command('download-subtitles <video-id> <language-code>')
        .description('downloads subtitles for given 2-letter language code and output SRT')
        .action(async (videoId, languageCode) => {
            var url = `http://video.google.com/timedtext?lang=${languageCode}&v=${videoId}`;
            var xml = await (await fetch(url)).text();
            var parser = new xml2js.Parser();
            var jso = await parser.parseStringPromise(xml)
            var srt = jso.transcript.text.map((t, idx) => {
                var text = t["_"];
                var start = parseFloat(t["$"].start);
                var duration = parseFloat(t["$"].dur);

                return `${idx}\n${toSrtTime(start)} --> ${toSrtTime(start + duration)}\n${text}\n\n`;
            }).join('');
            process.stdout.write(srt + '\n');
        });

    program.parse(process.argv);
})()

const padTime = (str, len) => _.padStart(str, len, '0');
function toSrtTime(secondsTotal) {
    // 00:00:08,509 --> 00:00:09,927
    const ms = `${Math.floor((secondsTotal % 1) * 1000)}`.substring(0, 2);
    const s = Math.floor(secondsTotal % 60);
    const m = Math.floor(secondsTotal / 60);
    const h = Math.floor(secondsTotal / (60 * 60));
    return `${padTime(h, 2)}:${padTime(m, 2)}:${padTime(s, 2)},${padTime(ms, 3)}`;
}

// samples:
// =======

// 1
// 00:00:08,509 --> 00:00:09,927
// Las noticias nunca terminan.

// 2
// 00:00:10,094 --> 00:00:12,012
// Transmitiendo desde el 1080
// de Ciudad Gótica Radio.

// {
//     "_": "I’m worried we might grow apart.",
//     "$": {
//       "start": "14.751",
//       "dur": "4.343"
//     }
//   },
//   {
//     "$": {
//       "start": "19.094",
//       "dur": "9.952"
//     }
//   },