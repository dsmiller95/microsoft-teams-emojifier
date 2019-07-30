
function breakIntoTopPageScope(javascriptString) {
    const script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.innerHTML = javascriptString;

    const header = document.getElementsByTagName('head')[0];
    header.appendChild(script);
}

//Make sure the payload is injected only once per context at most
if (window.SECRET_EMOJI_KEY != 'set') {
    window.SECRET_EMOJI_KEY = 'set';
    if (window.EMOJI_API) {
        // if this is an injection into the electron app
        inject(window.EMOJI_API, window);
    } else if (chrome && chrome.storage) {
        // if we are in the chrome extension
        chrome.storage.sync.get('api-url', (data) => {
            setTimeout(() => {
                const EMOJI_URL = data['api-url'];
                //we need to break into the top-level scope to make use of the JQuery-lite utility that already exists in ms-teams
                breakIntoTopPageScope(inject.toString() + `;inject('${EMOJI_URL}');`);
            },
                1000);
        });
    }
}

function inject(emojiApiPath) {

    function getValidEmojis() {
        return new Promise((resolve, reject) => {
            $.get(
                emojiApiPath + '/emoticons',
                (result) => {
                    resolve(result);
                });
        });
    }

    function getMessageContentList() {
        return $('.message-body-content > div:not(.' + emojiClass + ')').toArray();
    }

    function createImgTag(emoticonName) {
        return '<img class="emoji-img" src="' + emojiApiPath + '/emoticon/' + emoticonName + '">';
    }

    var emojiMatch = /:([\w-]+):/g;
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

    function injectCSS(inputCss) {
        var style = document.createElement('style');
        style.innerHTML = inputCss;
        style.setAttribute('style', 'text/css');
        document.getElementsByTagName('HEAD')[0].appendChild(style);
    }

    function init() {
        injectCSS(CssInject);
        console.log("fetching valid emojis from " + emojiApiPath);
        getValidEmojis().then(emojis => {
            console.log(emojis);
            setInterval(
                () => {
                    var messageList = getMessageContentList();
                    messageList.forEach(div => emojifyMessageDiv(div, emojis));
                },
                2000
            );
        });
    }

    init();
}