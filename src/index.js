var xml2js = require('xml2js');
var fetch = require('node-fetch');
var _ = require('lodash');

async function listLanguages(videoId) {
    var url = `http://www.youtube.com/api/timedtext?type=list&v=${videoId}`;
    var xml = await (await fetch(url)).text();
    var parser = new xml2js.Parser();
    var jso = await parser.parseStringPromise(xml)
    var tracks = _.get(jso, 'transcript_list.track');
    if (!tracks) {
        return [];
    }
    return tracks.map(t => t['$'].lang_code);
}

async function donwloadSubtitles(videoId, languageCode) {
    var url = `http://video.google.com/timedtext?lang=${languageCode}&v=${videoId}`;
    var xml = await (await fetch(url)).text();
    var parser = new xml2js.Parser();
    var jso = await parser.parseStringPromise(xml)
    if (!jso) {
        return null;
    }
    var srtObjects = jso.transcript.text.map((t, idx) => {
        var text = t["_"];
        var start = parseFloat(t["$"].start);
        var duration = parseFloat(t["$"].dur);

        return {
            id: idx + 1,
            fromSeconds: start,
            toSeconds: start + duration,
            text: unescape(text || ''),
        }
    });

    // fix toSeconds when duration was undefined
    srtObjects.forEach((next, i) => {
        var prev = srtObjects[i - 1];
        if (prev) {
            if (!Number.isFinite(prev.toSeconds)) {
                prev.toSeconds = Math.min(next.fromSeconds, next.fromSeconds + textReadingDurationSeconds(prev.text));
            }
        }
    })

    return srtObjects;
}

function textReadingDurationSeconds(text) {
    // http://www.permondo.eu/volunteers/introduction-to-subtitling/#:~:text=The%20subtitle%20(formed%20by%202,of%206%20seconds%20on%20screen.
    var secondsPerChar = 70 / 6;
    return text.length * secondsPerChar;
}

module.exports = {
    listLanguages,
    donwloadSubtitles,
    toSrtTimeString,
    toSrt,
}

var padTime = (str, len) => _.padStart(str, len, '0');
function toSrtTimeString(secondsTotal) {
    // 00:00:08,509 --> 00:00:09,927
    const ms = `${Math.floor((secondsTotal % 1) * 1000)}`.substring(0, 2);
    const s = Math.floor(secondsTotal % 60);
    const m = Math.floor(secondsTotal / 60);
    const h = Math.floor(secondsTotal / (60 * 60));
    return `${padTime(h, 2)}:${padTime(m, 2)}:${padTime(s, 2)},${padTime(ms, 3)}`;
}

function toSrt(srtObjects) {
    const str = srtObjects.map(({ id, fromSeconds, toSeconds, text }) => {
        return `${id}\n${toSrtTimeString(fromSeconds)} --> ${toSrtTimeString(toSeconds)}\n${text}\n\n`;
    }) + '\n';
    return str;
}