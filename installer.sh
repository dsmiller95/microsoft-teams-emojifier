#!/bin/bash

asar extract ~/AppData/Local/Microsoft/Teams/current/resources/electron.asar ./electron.unpacked

sed -i '/\/\*\{8\}BEGIN EMOJIINJECT\*\{8\}\//,/\/\*\{8\}END EMOJIINJECT\*\{8\}\//d' ./electron.unpacked/browser/chrome-extension.js

echo "/********BEGIN EMOJIINJECT********/" >> ./electron.unpacked/browser/chrome-extension.js;
echo "app.on('browser-window-focus', function (event, bWindow) {bWindow.webContents.executeJavaScript(\`" >> ./electron.unpacked/browser/chrome-extension.js;
sed 's/`/\\`/g' payload.js >> ./electron.unpacked/browser/chrome-extension.js
echo "\`)})" >> ./electron.unpacked/browser/chrome-extension.js
echo "/********END EMOJIINJECT********/" >> ./electron.unpacked/browser/chrome-extension.js;

asar pack ./electron.unpacked ~/AppData/Local/Microsoft/Teams/current/resources/electron.asar