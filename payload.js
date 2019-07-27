if (window.SECRET_EMOJI_KEY != 'set') {
    window.SECRET_EMOJI_KEY = 'set';

    function upperWords(sent) {
        return sent.split(" ").map(x => x ? (x[0].toUpperCase() + x.substr(1)) : x).join(' ');
    }

    function getMessageContentList(window) {
        return window.$('.message-body-content > div:not(.' + emojiClass + ')').toArray();
    }

    function createImgTag(source) {
        return '<img class="emoji-img" src="' + source + '">';
    }

    var emojiMatch = /:([\\w-]+):/g;
    function injectEmojiImages(inputText) {
        console.log(emojiMatch);
        var resultStr = "";
        var matches = inputText.matchAll(emojiMatch);
        console.log(matches);
        var currentIndexInInput = 0;

        var match;
        while (!(match = matches.next()).done) {
            emoji = emojiMap[match.value[1]];
            emoji = emoji ? createImgTag(emoji) : match.value[0];
            resultStr += inputText.substring(currentIndexInInput, match.value.index);
            resultStr += emoji;
            currentIndexInInput = match.value.index + match.value[0].length;
        }
        resultStr += inputText.substring(currentIndexInInput, inputText.length);
        if (!resultStr.endsWith('&nbsp;')) {
            resultStr += '&nbsp;';
        }
        return resultStr;
    }

    var emojiClass = 'EMOJIFIER-CHECKED';

    function processMessageDiv(div) {
        div.innerHTML = injectEmojiImages(div.innerHTML);
        div.classList.add(emojiClass);
    }

    var CssInject = `
        .emoji-img {
            height: 1em !important;
            display: inline-block;
            position: static !important;
        }`

    function injectCSS(inputCss, bDoc) {
        var style = bDoc.createElement('style');
        style.innerHTML = inputCss;
        style.setAttribute('style', 'text/css');
        bDoc.getElementsByTagName('HEAD')[0].appendChild(style);
    }

    function init(window) {
        injectCSS(CssInject, window.document);
        var timer = window.setInterval(
            () => {
                var list = getMessageContentList(window);
                console.log(list);
                list.forEach(div => processMessageDiv(div));
            },
            1000
        );
    }

    var emojiMap = {
        parrot: "https://cultofthepartyparrot.com/parrots/hd/parrot.gif",
        "open-source-parrot": "https://cultofthepartyparrot.com/parrots/hd/opensourceparrot.gif",
        "middle-parrot": "https://cultofthepartyparrot.com/parrots/hd/middleparrot.gif",
        "reverse-parrot": "https://cultofthepartyparrot.com/parrots/hd/reverseparrot.gif",
        "aussie-parrot": "https://cultofthepartyparrot.com/parrots/hd/aussieparrot.gif",
        "goth-parrot": "https://cultofthepartyparrot.com/parrots/hd/gothparrot.gif",
        "old-timey-parrot": "https://cultofthepartyparrot.com/parrots/oldtimeyparrot.gif",
        "bored-parrot": "https://cultofthepartyparrot.com/parrots/hd/boredparrot.gif",
        "shuffle-parrot": "https://cultofthepartyparrot.com/parrots/hd/shuffleparrot.gif",
        "shuffle-further-parrot": "https://cultofthepartyparrot.com/parrots/shufflefurtherparrot.gif",
        "conga-line-parrot": "https://cultofthepartyparrot.com/parrots/hd/congaparrot.gif",
        "reverse-conga-line-parrot": "https://cultofthepartyparrot.com/parrots/hd/reversecongaparrot.gif",
        "party-parrot": "https://cultofthepartyparrot.com/parrots/hd/partyparrot.gif",
        "sad-parrot": "https://cultofthepartyparrot.com/parrots/hd/sadparrot.gif",
        "cop-parrot": "https://cultofthepartyparrot.com/parrots/hd/copparrot.gif",
        "fast-parrot": "https://cultofthepartyparrot.com/parrots/hd/fastparrot.gif",
        "ultra-fast-parrot": "https://cultofthepartyparrot.com/parrots/hd/ultrafastparrot.gif",
        "slow-parrot": "https://cultofthepartyparrot.com/parrots/hd/slowparrot.gif",
        "slo-mo-parrot": "https://cultofthepartyparrot.com/parrots/slomoparrot.gif",
        "dad-parrot": "https://cultofthepartyparrot.com/parrots/hd/dadparrot.gif",
        "deal-with-it-parrot": "https://cultofthepartyparrot.com/parrots/hd/dealwithitparrot.gif",
        "deal-with-it-now-parrot": "https://cultofthepartyparrot.com/parrots/hd/dealwithitnowparrot.gif",
        "fiesta-parrot": "https://cultofthepartyparrot.com/parrots/fiestaparrot.gif",
        "pizza-parrot": "https://cultofthepartyparrot.com/parrots/pizzaparrot.gif",
        "burger-parrot": "https://cultofthepartyparrot.com/parrots/hamburgerparrot.gif",
        "bannana-parrot": "https://cultofthepartyparrot.com/parrots/bananaparrot.gif",
        "chill-parrot": "https://cultofthepartyparrot.com/parrots/chillparrot.gif",
        "explody-parrot": "https://cultofthepartyparrot.com/parrots/explodyparrot.gif",
        "shuffle-party-parrot": "https://cultofthepartyparrot.com/parrots/shufflepartyparrot.gif",
        "ice-cream-parrot": "https://cultofthepartyparrot.com/parrots/icecreamparrot.gif",
        "sassy-parrot": "https://cultofthepartyparrot.com/parrots/hd/sassyparrot.gif",
        "confused-parrot": "https://cultofthepartyparrot.com/parrots/hd/confusedparrot.gif",
        "aussie-conga-line-parrot": "https://cultofthepartyparrot.com/parrots/hd/aussiecongaparrot.gif",
        "aussie-reverse-conga-line-parrot": "https://cultofthepartyparrot.com/parrots/hd/aussiereversecongaparrot.gif",
        "parrot-wave-1": "https://cultofthepartyparrot.com/parrots/wave1parrot.gif",
        "parrot-wave-2": "https://cultofthepartyparrot.com/parrots/wave2parrot.gif",
        "parrot-wave-3": "https://cultofthepartyparrot.com/parrots/wave3parrot.gif",
        "parrot-wave-4": "https://cultofthepartyparrot.com/parrots/wave4parrot.gif",
        "parrot-wave-5": "https://cultofthepartyparrot.com/parrots/wave5parrot.gif",
        "parrot-wave-6": "https://cultofthepartyparrot.com/parrots/wave6parrot.gif",
        "parrot-wave-7": "https://cultofthepartyparrot.com/parrots/wave7parrot.gif",
        "parrot-wave-8": "https://cultofthepartyparrot.com/parrots/wave8parrot.gif",
        "parrot-wave-9": "https://cultofthepartyparrot.com/parrots/wave9parrot.gif",
        "conga-party-parrot": "https://cultofthepartyparrot.com/parrots/hd/congapartyparrot.gif",
        "moonwalking-parrot": "https://cultofthepartyparrot.com/parrots/hd/moonwalkingparrot.gif",
        "thumbs-up-parrot": "https://cultofthepartyparrot.com/parrots/hd/thumbsupparrot.gif",
        "coffee-parrot": "https://cultofthepartyparrot.com/parrots/coffeeparrot.gif",
        "parrot-with-mustache": "https://cultofthepartyparrot.com/parrots/hd/mustacheparrot.gif",
        "christmas-parrot": "https://cultofthepartyparrot.com/parrots/hd/christmasparrot.gif",
        "sleepy-parrot": "https://cultofthepartyparrot.com/parrots/hd/sleepingparrot.gif",
        "happy-hour-parrot": "https://cultofthepartyparrot.com/parrots/hd/beerparrot.gif",
        "dark-beer-parrot": "https://cultofthepartyparrot.com/parrots/darkbeerparrot.gif",
        "blonde-sassy-parrot": "https://cultofthepartyparrot.com/parrots/blondesassyparrot.gif",
        "blues-clues-parrot": "https://cultofthepartyparrot.com/parrots/bluescluesparrot.gif",
        "gentleman-parrot": "https://cultofthepartyparrot.com/parrots/hd/gentlemanparrot.gif",
        "margarita-parrot": "https://cultofthepartyparrot.com/parrots/margaritaparrot.gif",
        "dreidel-parrot": "https://cultofthepartyparrot.com/parrots/dreidelparrot.gif",
        "harry-potter-parrot": "https://cultofthepartyparrot.com/parrots/harrypotterparrot.gif",
        "upvote-parrot": "https://cultofthepartyparrot.com/parrots/upvoteparrot.gif",
        "twins-parrot": "https://cultofthepartyparrot.com/parrots/hd/twinsparrot.gif",
        "triplets-parrot": "https://cultofthepartyparrot.com/parrots/tripletsparrot.gif",
        "stable-parrot": "https://cultofthepartyparrot.com/parrots/hd/stableparrot.gif",
        "ship-it-parrot": "https://cultofthepartyparrot.com/parrots/shipitparrot.gif",
        "ski-parrot": "https://cultofthepartyparrot.com/parrots/skiparrot.gif",
        "love-parrot": "https://cultofthepartyparrot.com/parrots/loveparrot.gif",
        "halal-parrot": "https://cultofthepartyparrot.com/parrots/halalparrot.gif",
        "wendy's-parrot": "https://cultofthepartyparrot.com/parrots/hd/wendyparrot.gif",
        "popcorn-parrot": "https://cultofthepartyparrot.com/parrots/hd/popcornparrot.gif",
        "donut-parrot": "https://cultofthepartyparrot.com/parrots/hd/donutparrot.gif",
        "evil-parrot": "https://cultofthepartyparrot.com/parrots/hd/evilparrot.gif",
        "disco-parrot": "https://cultofthepartyparrot.com/parrots/hd/discoparrot.gif",
        "matrix-parrot": "https://cultofthepartyparrot.com/parrots/matrixparrot.gif",
        "papal-parrot": "https://cultofthepartyparrot.com/parrots/papalparrot.gif",
        "stalker-parrot": "https://cultofthepartyparrot.com/parrots/stalkerparrot.gif",
        "science-parrot": "https://cultofthepartyparrot.com/parrots/hd/scienceparrot.gif",
        "revolution-parrot": "https://cultofthepartyparrot.com/parrots/hd/revolutionparrot.gif",
        "fidget-spinner-parrot": "https://cultofthepartyparrot.com/parrots/fidgetparrot.gif",
        "beret-parrot": "https://cultofthepartyparrot.com/parrots/hd/beretparrot.gif",
        "taco-parrot": "https://cultofthepartyparrot.com/parrots/tacoparrot.gif",
        "ryan-gosling-parrot": "https://cultofthepartyparrot.com/parrots/ryangoslingparrot.gif",
        "lucky-parrot": "https://cultofthepartyparrot.com/parrots/luckyparrot.gif",
        "birthday-party-parrot": "https://cultofthepartyparrot.com/parrots/hd/birthdaypartyparrot.gif",
        "jedi-parrot": "https://cultofthepartyparrot.com/parrots/hd/jediparrot.gif",
        "sith-parrot": "https://cultofthepartyparrot.com/parrots/hd/sithparrot.gif",
        "angry-parrot": "https://cultofthepartyparrot.com/parrots/hd/angryparrot.gif",
        "invisible-parrot": "https://cultofthepartyparrot.com/parrots/hd/invisibleparrot.gif",
        "rotating-parrot": "https://cultofthepartyparrot.com/parrots/rotatingparrot.gif",
        "crypto-parrot": "https://cultofthepartyparrot.com/parrots/cryptoparrot.gif",
        "sushi-parrot": "https://cultofthepartyparrot.com/parrots/hd/sushiparrot.gif",
        "pumpkin-parrot": "https://cultofthepartyparrot.com/parrots/hd/pumpkinparrot.gif",
        "angel-parrot": "https://cultofthepartyparrot.com/parrots/hd/angelparrot.gif",
        "blunt-parrot": "https://cultofthepartyparrot.com/parrots/hd/bluntparrot.gif",
        "sinterklaas-parrot": "https://cultofthepartyparrot.com/parrots/hd/sintparrot.gif",
        "pirate-parrot": "https://cultofthepartyparrot.com/parrots/hd/pirateparrot.gif",
        "ceiling-parrot": "https://cultofthepartyparrot.com/parrots/hd/ceilingparrot.gif",
        "mardi-gras-parrot": "https://cultofthepartyparrot.com/parrots/hd/mardigrasparrot.gif",
        "soviet-parrot": "https://cultofthepartyparrot.com/parrots/sovjetparrot.gif",
        "portal-parrot": "https://cultofthepartyparrot.com/parrots/portalparrot.gif",
        "hard-hat-parrot": "https://cultofthepartyparrot.com/parrots/hd/hardhatparrot.gif",
        "flying-money-parrot": "https://cultofthepartyparrot.com/parrots/hd/flyingmoneyparrot.gif"
    }

    init(window);
}