var xml2js = require('xml2js');
const fetch = require('node-fetch');
var os = require('os');
var _ = require('lodash');

async function listLanguages(videoId) {
    var url = `http://www.youtube.com/api/timedtext?type=list&v=${videoId}`;
    var xml = await (await fetch(url)).text();
    var parser = new xml2js.Parser();
    var jso = await parser.parseStringPromise(xml)
    var out = jso.transcript_list.track.map(t => t['$'].lang_code).join(os.EOL);
    return out + os.EOL;
}

async function donwloadSubtitles(videoId, languageCode) {
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
    return srt + '\n';
}

module.exports = {
    listLanguages,
    donwloadSubtitles,
}

const padTime = (str, len) => _.padStart(str, len, '0');
function toSrtTime(secondsTotal) {
    // 00:00:08,509 --> 00:00:09,927
    const ms = `${Math.floor((secondsTotal % 1) * 1000)}`.substring(0, 2);
    const s = Math.floor(secondsTotal % 60);
    const m = Math.floor(secondsTotal / 60);
    const h = Math.floor(secondsTotal / (60 * 60));
    return `${padTime(h, 2)}:${padTime(m, 2)}:${padTime(s, 2)},${padTime(ms, 3)}`;
}
