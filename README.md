# Emojinator

Adds custom emoji to microsoft teams' electron app.

This is a feature that was [requested in late 2016](https://microsoftteams.uservoice.com/forums/555103-public/suggestions/16934329-allow-adding-custom-emoji-memes-gifs-reactions), but microsoft isn't listening to the obviously ravenus need of emoji, so the task is left up to us.

## Disclaimer

**USE AT YOUR OWN RISK: ONLY USE THIS IF YOU KNOW WHAT YOU'RE DOING**

This is going to inject code into your locally running Microsoft Teams electron app: code injected this way can potentially steal your credentials and gain access to your local filesystem. Whenever you inject code like this, make absolutely sure you know what the code is doing.

I will write this package to be as secure as I feel like, know that **I AM NOT A SECURITY EXPERT**. If you are, please feel free to tear my code to shreds.

## Setup

To get this setup on your client with the default install location, these steps should work:

* clone this repo
* `npm install`
* `npm run install-local`
  * If you have a non-standard install location, modify the [installer](./installer.sh) script to point to your electron package. default path to the install directory is ~/AppData/Local/Microsoft/Teams/

## Support

Currently only a hardcoded list of 100 party parrots is supported. If you want to add your own, the only requirement is that they are externally hosted with the current configuration. Look for the emojiMap variable in [payload.js](./payload.js) . There are future plans to pair this to a remote emoji host server which could allow uploading new custom emoji, but for now this is the complete list of available emoji:

* parrot
* open-source-parrot
* middle-parrot
* reverse-parrot
* aussie-parrot
* goth-parrot
* old-timey-parrot
* bored-parrot
* shuffle-parrot
* shuffle-further-parrot
* conga-line-parrot
* reverse-conga-line-parrot
* party-parrot
* sad-parrot
* cop-parrot
* fast-parrot
* ultra-fast-parrot
* slow-parrot
* slo-mo-parrot
* dad-parrot
* deal-with-it-parrot
* deal-with-it-now-parrot
* fiesta-parrot
* pizza-parrot
* burger-parrot
* bannana-parrot
* chill-parrot
* explody-parrot
* shuffle-party-parrot
* ice-cream-parrot
* sassy-parrot
* confused-parrot
* aussie-conga-line-parrot
* aussie-reverse-conga-line-parrot
* parrot-wave-1
* parrot-wave-2
* parrot-wave-3
* parrot-wave-4
* parrot-wave-5
* parrot-wave-6
* parrot-wave-7
* parrot-wave-8
* parrot-wave-9
* conga-party-parrot
* moonwalking-parrot
* thumbs-up-parrot
* coffee-parrot
* parrot-with-mustache
* christmas-parrot
* sleepy-parrot
* happy-hour-parrot
* dark-beer-parrot
* blonde-sassy-parrot
* blues-clues-parrot
* gentleman-parrot
* margarita-parrot
* dreidel-parrot
* harry-potter-parrot
* upvote-parrot
* twins-parrot
* triplets-parrot
* stable-parrot
* ship-it-parrot
* ski-parrot
* love-parrot
* halal-parrot
* wendy's-parrot
* popcorn-parrot
* donut-parrot
* evil-parrot
* disco-parrot
* matrix-parrot
* papal-parrot
* stalker-parrot
* science-parrot
* revolution-parrot
* fidget-spinner-parrot
* beret-parrot
* taco-parrot
* ryan-gosling-parrot
* lucky-parrot
* birthday-party-parrot
* jedi-parrot
* sith-parrot
* angry-parrot
* invisible-parrot
* rotating-parrot
* crypto-parrot
* sushi-parrot
* pumpkin-parrot
* angel-parrot
* blunt-parrot
* sinterklaas-parrot
* pirate-parrot
* ceiling-parrot
* mardi-gras-parrot
* soviet-parrot
* portal-parrot
* hard-hat-parrot
* flying-money-parrot