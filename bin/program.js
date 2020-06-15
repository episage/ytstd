const { program } = require('commander');
const { listLanguages, donwloadSubtitles } = require('../src');

(async function () {
    program
        .command('list-languages <video-id>')
        .description('list available subtitle languages')
        .action((videoId) => {
            process.stdout.write(listLanguages(videoId));
        })

    program
        .command('download-subtitles <video-id> <language-code>')
        .description('downloads subtitles for given 2-letter language code and output SRT')
        .action((videoId, languageCode) => {
            process.stdout.write(donwloadSubtitles(videoId, languageCode));
        });

    program.parse(process.argv);
})()

