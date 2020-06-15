#!/usr/bin/env node
const { program } = require('commander');
const { listLanguages, donwloadSubtitles } = require('../src');

(async function () {
    program
        .command('list-languages <video-id>')
        .description('list available subtitle languages')
        .action(async (videoId) => {
            const result = await listLanguages(videoId)
            if (result === null) {
                console.error(`"${videoId}" does not have any subtitles`)
                return;
            }
            process.stdout.write(result);
        })

    program
        .command('download-subtitles <video-id> <language-code>')
        .description('downloads subtitles for given 2-letter language code and output SRT')
        .action(async (videoId, languageCode) => {
            const result = await donwloadSubtitles(videoId, languageCode);
            if (result === null) {
                console.error(`"${videoId}" does not have "${languageCode}" subtitles`)
                return;
            }
            process.stdout.write(result);
        });

    program.parse(process.argv);
})()

