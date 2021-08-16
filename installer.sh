#!/bin/bash

#unpack the electron bootstrapper into the local directory
asar extract ~/AppData/Local/Microsoft/Teams/current/resources/electron.asar ./electron.unpacked

#If we have already been injected, remove the existing code before adding new stuff
sed -i '/\/\*\{8\}BEGIN EMOJIINJECT\*\{8\}\//,/\/\*\{8\}END EMOJIINJECT\*\{8\}\//d' ./electron.unpacked/browser/chrome-extension.js

#Inject the emoji payload
echo "/********BEGIN EMOJIINJECT********/" >> ./electron.unpacked/browser/chrome-extension.js;
echo "app.on('browser-window-created', function (event, bWindow) {bWindow.webContents.executeJavaScript(\`" >> ./electron.unpacked/browser/chrome-extension.js;
# this line used to force debgging inside electron
# echo "app.on('browser-window-focus', function (event, bWindow) {bWindow.webContents.openDevTools();debugger;bWindow.webContents.executeJavaScript(\`" >> ./electron.unpacked/browser/chrome-extension.js;


#Inject the source emoji server from an environment variable
echo "window.EMOJI_API = '"$EMOJI_URL"';" >> ./electron.unpacked/browser/chrome-extension.js;
#sed is used here to escape any existing backtick quotes or escape characters. using those style of quotes for now because the payload comes in as multiline
#in the future would be nice to have a minified single-line payload to inject
sed 's/\\/\\\\/g' payload.js | sed 's/`/\\`/g' >> ./electron.unpacked/browser/chrome-extension.js
echo "\`)})" >> ./electron.unpacked/browser/chrome-extension.js
echo "/********END EMOJIINJECT********/" >> ./electron.unpacked/browser/chrome-extension.js;

#re-pack the whole app back into the install locations
asar pack ./electron.unpacked ~/AppData/Local/Microsoft/Teams/current/resources/electron.asar