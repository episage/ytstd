#!/usr/bin/env node
const os = require('os');
const { program } = require('commander');
const { listLanguages, donwloadSubtitles, toSrt } = require('../src');

(async function () {
    program
        .command('list-languages <video-id>')
        .description('list available subtitle languages')
        .action(async (videoId) => {
            const langs = await listLanguages(videoId)
            if (langs.length === 0) {
                console.error(`"${videoId}" does not have any subtitles`)
                return;
            }
            process.stdout.write(langs.join(os.EOL) + os.EOL);
        })

    program
        .command('download-subtitles <video-id> <language-code>')
        .description('downloads subtitles for given 2-letter language code and output SRT')
        .action(async (videoId, languageCode) => {
            const srtObjects = await donwloadSubtitles(videoId, languageCode);
            if (srtObjects === null) {
                console.error(`"${videoId}" does not have "${languageCode}" subtitles`)
                return;
            }

            const str = toSrt(srtObjects);

            process.stdout.write(str);
        });

    program.parse(process.argv);
})()

