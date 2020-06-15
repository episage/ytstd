#!/usr/bin/env node
const { program } = require('commander');
const { listLanguages, donwloadSubtitles } = require('../src');

(async function () {
    program
        .command('list-languages <video-id>')
        .description('list available subtitle languages')
        .action(async (videoId) => {
            process.stdout.write(await listLanguages(videoId));
        })

    program
        .command('download-subtitles <video-id> <language-code>')
        .description('downloads subtitles for given 2-letter language code and output SRT')
        .action(async (videoId, languageCode) => {
            process.stdout.write(await donwloadSubtitles(videoId, languageCode));
        });

    program.parse(process.argv);
})()

