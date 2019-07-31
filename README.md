# Emojinator

Adds custom emoji to microsoft teams, both in browser and in electron!

This is a feature that was [requested in late 2016](https://microsoftteams.uservoice.com/forums/555103-public/suggestions/16934329-allow-adding-custom-emoji-memes-gifs-reactions), but microsoft isn't listening to our ravenous need of emoji, so the task is left up to us.

## Disclaimer

**USE AT YOUR OWN RISK: ONLY USE THIS IF YOU KNOW WHAT YOU'RE DOING**

This is going to inject code into your locally running Microsoft Teams electron app: code injected this way can potentially steal your credentials and gain access to your local filesystem. Whenever you inject code like this, make sure you know what the code is doing.

## Setup

If you use the web client and not the electron app, this plugin is available as a [chrome extension](https://chrome.google.com/webstore/detail/microsoft-teams-emojinato/eflminelddfglcbimfpncahdiacnnegk)

* install the extension
* go to the extension options and enter your team's emoji provider url, and press the button
* go to the web app, and you should see the emojis!

To get this setup on your installed electron client with the default install location, follow these steps:

* clone this repo
* `npm install`
* `EMOJI_URL=<custom emoji server url> npm run install-local`
  * If you have a non-standard install location, modify the [installer](./installer.sh) script to point to your electron package. default path to the install directory is ~/AppData/Local/Microsoft/Teams/
* Make sure to restart microsoft teams -- you may need to find it in the taskbar and kill it manually. If all else fails, restart
* when you reopen Teams, you should see all the emoticons

## Removal

Simply re-run the installer for Microsoft Teams, and the original installation files should overwrite the modified versions, removing the emojinator

## Support

Supports full external emoji sources! This is built to run against a server like this [custom emoji server](https://github.com/dsmiller95/custom-emoji-server). The only required endpoints are GET /emoticons and GET /emoticon/\<emoticonName\>. It will query the list of valid emoticons once and store the result for the current session life of Teams.

## Implementation overview

The injection payload will look for any currently rendered messages every 2 seconds. For every message that hasn't been parsed yet, it will look for any patterns matching `:[\w-]+:` and replace the text with an `<img>` tag if an emoji exists by that name.