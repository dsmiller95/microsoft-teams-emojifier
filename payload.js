//Make sure the payload is injected only once per context at most
if (window.SECRET_EMOJI_KEY != 'set') {
    window.SECRET_EMOJI_KEY = 'set';

    const emojiApiPath = 'https://sheltered-spire-54939.herokuapp.com';

    function getValidEmojis() {
        return new Promise((resolve, reject) => {
            $.get(
                emojiApiPath + '/emoticons',
                (result) => {
                    resolve(result);
                });
        });
    }

    function getMessageContentList(window) {
        return window.$('.message-body-content > div:not(.' + emojiClass + ')').toArray();
    }

    function createImgTag(emoticonName) {
        return '<img class="emoji-img" src="' + emojiApiPath + '/emoticon/' + emoticonName + '">';
    }

    var emojiMatch = /:([\\w-]+):/g;
    function injectEmojiImages(inputText, validEmojis) {
        var resultStr = "";
        var matches = inputText.matchAll(emojiMatch);
        var currentIndexInInput = 0;

        var match;
        while (!(match = matches.next()).done) {
            var reInjectText = match.value[0];
            if (validEmojis.indexOf(match.value[1]) != -1) {
                reInjectText = createImgTag(match.value[1]);
            }

            resultStr += inputText.substring(currentIndexInInput, match.value.index);
            resultStr += reInjectText;
            currentIndexInInput = match.value.index + match.value[0].length;
        }
        resultStr += inputText.substring(currentIndexInInput, inputText.length);
        if (!resultStr.endsWith('&nbsp;')) {
            //a characer of some sort is requred to get emoji at the end of a message to display correctly
            // don't ask me why
            resultStr += '&nbsp;';
        }
        return resultStr;
    }

    var emojiClass = 'EMOJIFIER-CHECKED';

    function emojifyMessageDiv(div, validEmojis) {
        div.innerHTML = injectEmojiImages(div.innerHTML, validEmojis);
        div.classList.add(emojiClass);
    }

    var CssInject = `
        .emoji-img {
            height: 2em !important;
            display: inline-block;
            position: static !important;
        }`;

    function injectCSS(inputCss, doc) {
        var style = doc.createElement('style');
        style.innerHTML = inputCss;
        style.setAttribute('style', 'text/css');
        doc.getElementsByTagName('HEAD')[0].appendChild(style);
    }

    function init(window) {
        injectCSS(CssInject, window.document);
        getValidEmojis().then(emojis => {
            console.log(emojis);

            window.setInterval(
                () => {
                    var messageList = getMessageContentList(window);
                    messageList.forEach(div => emojifyMessageDiv(div, emojis));
                },
                2000
            );
        });
    }

    init(window);
}