# ytstd - YouTube subtitles downloader

## Example Usage

```bash
$ ytstd list-languages W1Re3QxRDuY
en
ko
```

```bash
$ ytstd download-subtitles W1Re3QxRDuY en
1
00:00:14,075 --> 00:00:19,094
I’m worried we might grow apart.

2
00:00:19,094 --> 00:00:29,045


3
00:00:29,045 --> 00:00:30,042
Hello, everyone.

.../snip/...
```

## Installation
```bash
npm install --global ytstd
```

## Help
```bash
Usage: cli [options] [command]

Options:
  -h, --help                                     display help for command

Commands:
  list-languages <video-id>                      list available subtitle languages
  download-subtitles <video-id> <language-code>  downloads subtitles for given 2-letter language code and output SRT
  help [command]                                 display help for command
```