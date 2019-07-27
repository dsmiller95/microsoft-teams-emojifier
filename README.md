# Emojinator

Adds custom emoji to microsoft teams' electron app.

This is a feature that was [requested in late 2016](https://microsoftteams.uservoice.com/forums/555103-public/suggestions/16934329-allow-adding-custom-emoji-memes-gifs-reactions), but microsoft isn't listening to the obviously ravenus need of emoji, so the task is left up to us.

## Setup

To get this setup on your client with the default install location, these steps should work:

* clone this repo
* `npm install`
* `npm run install-local`
  * If you have a non-standard install location, modify the installer.sh script to point to your electron package. default path to the install directory is ~/AppData/Local/Microsoft/Teams/