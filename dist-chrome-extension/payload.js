//Make sure the payload is injected only once per context at most
if (window.SECRET_EMOJI_KEY != 'set') {
    window.SECRET_EMOJI_KEY = 'set';
    if (window.EMOJI_API) {
        // if this is an injection into the electron app
        console.log("EMOJI API SET:" + window.EMOJI_API);
        inject(window.EMOJI_API, window);
    } else if (window.chrome && window.chrome.storage) {
        function breakIntoTopPageScope(javascriptString) {
            const script = document.createElement('script');
            script.setAttribute('type', 'text/javascript');
            script.innerHTML = javascriptString;

            const header = document.getElementsByTagName('head')[0];
            header.appendChild(script);
        }
        // if we are in the chrome extension
        chrome.storage.sync.get('api-url', (data) => {
            setTimeout(() => {
                const EMOJI_URL = data['api-url'];
                //we need to break into the top-level scope to make use of the JQuery-lite utility that already exists in ms-teams
                breakIntoTopPageScope(inject.toString() + ";inject('" + EMOJI_URL + "');");
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

    function postEmojiUsages(emojiUsages) {
        return new Promise((resolve, reject) => {
            $.post({
                url: emojiApiPath + '/emoticons/usage',
                data: JSON.stringify(emojiUsages),
                processData: false,
                contentType: 'application/json',
                success: () => resolve()
            })
        });
    }

    function getMessageContentList() {
        return $('.message-body-content > div:not(.' + emojiClass + ')').toArray();
    }

    function createImgTag(emoticonName) {
        return '<img class="emoji-img" src="'+emojiApiPath+'/emoticon/'+emoticonName+'" title="'+emoticonName+'">';
    }
    
    function createElementFromHTML(htmlString) {
        var div = document.createElement('div');
        div.innerHTML = htmlString.trim();
        return div.firstChild; 
    }

    function crawlTree(htmlElement, handleLeaf) {
        if(htmlElement.childElementCount <= 0){
            handleLeaf(htmlElement);
            return;
        }
        for (let index = 0; index < htmlElement.children.length; index++) {
            const htmlChildElement = htmlElement.children[index];
            crawlTree(htmlChildElement, handleLeaf);
        }
    }

    var emojiClass = 'EMOJIFIER-CHECKED';
    var emojiMatch = /:([\w-]+):/g;
    function injectEmojiImages(inputText, validEmojis, emojisUsed) {
        var resultStr = "";
        var matches = inputText.matchAll(emojiMatch);
        var currentIndexInInput = 0;

        var match;
        while (!(match = matches.next()).done) {
            var reInjectText = match.value[0];
            if (validEmojis.indexOf(match.value[1]) != -1) {
                const emojiName = match.value[1];
                reInjectText = createImgTag(emojiName);
                emojisUsed[emojiName] = (emojisUsed[emojiName] === undefined ? 0 : emojisUsed[emojiName]) + 1;
            }

            resultStr += inputText.substring(currentIndexInInput, match.value.index);
            resultStr += reInjectText;
            currentIndexInInput = match.value.index + match.value[0].length;
        }
        resultStr += inputText.substring(currentIndexInInput, inputText.length);
        if (!resultStr.endsWith('&nbsp;')) {
            //a characer of some sort is requred to get emoji at the end of a message to display correctly
            // don't ask me why
            // also don't ask me why it's not needed anymore
            // resultStr += '&nbsp;';
        }
        return resultStr;
    }

    function emojifyMessageDiv(div, validEmojis, emojisUsed) {
        crawlTree(div, (leaf) => {
            leaf.innerHTML = injectEmojiImages(leaf.innerHTML, validEmojis, emojisUsed);
        });
        div.classList.add(emojiClass);
    }

    function typeInInput(text){
        const editorWindow = document.getElementsByClassName('ts-edit-box').item(0);
        const textContainer = editorWindow.getElementsByClassName('cke_editable').item(0).firstElementChild;
        if(textContainer.innerHTML.contains('br')){
            textContainer.innerHTML = '';
        }
        textContainer.innerText = textContainer.innerText + text;
    }

    function generateCloseHeader(closeListener){
        const closeHeader = document.createElement('div');
        closeHeader.style.textAlign = 'end';
        const closeOption = document.createElement('span');
        closeOption.innerText = 'Close';
        closeOption.style.fontSize = '1.2em';
        closeOption.style.fontWeight = '700';
        closeOption.style.cursor = 'pointer';
        closeOption.addEventListener('click', (event) => {
            closeListener(event);
        });
        closeHeader.appendChild(closeOption);
        return closeHeader;
    }

    function generateFilterBox(onFilterChange, debounce, onFilterSelected){
        const inputBox = document.createElement('input');
        let lastTimeout = 0;

        inputBox.addEventListener('input', event => {
            window.clearTimeout(lastTimeout);
            lastTimeout = window.setTimeout(() => {
                var filterValue = inputBox.value;
                onFilterChange(filterValue);
            }, debounce);
        });

        inputBox.addEventListener('keydown', event => {
            if(event.key === 'Enter'){
                onFilterSelected(inputBox.value);
            }
        });

        return inputBox;
    }

    function filterEmoji(emojiName, filterText){
        return emojiName.contains(filterText);
    }

    function createEmojiGrid(emojiList, emojiSelectedListener, closeListener) {
        const table = document.createElement('div');
        table.classList = 'emoji-flex-table';

        let emojiFilterChangeListeners = [];
        const onClose = (event) => {
            filterBox.value = '';
            emojiFilterChangeListeners.forEach(onchange => onchange(''));
            closeListener(event);
        };
        const filterBox = generateFilterBox(newFilter => {
            emojiFilterChangeListeners.forEach(onchange => onchange(newFilter));
            
            emojiTableContainer.scrollTop = emojiTableContainer.scrollHeight;
        }, 500, selectedFilter => {
            var emoji = emojiList.find(emoji => emoji.contains(selectedFilter));
            emojiSelectedListener(null, emoji);
            onClose();
        });
        emojiFilterChangeListeners = emojiList.map(emoji => {
            const emojiElement = createElementFromHTML(createImgTag(emoji, 'preview'));
            emojiElement.addEventListener('click', (event) => {
                emojiSelectedListener(event, emoji);
                onClose(event);
            });
            table.appendChild(emojiElement);
            return (newFilter) => {
                emojiElement.style.display = filterEmoji(emoji, newFilter) ? 'block' : 'none';
            };
        });

        const outputT = document.createElement('div');
        outputT.className = 'emoji-popup';

        const emojiTableContainer = document.createElement('div');
        emojiTableContainer.className = 'emoji-flex-table-container';
        emojiTableContainer.appendChild(table);

        outputT.appendChild(emojiTableContainer);
        outputT.appendChild(filterBox);
        outputT.appendChild(generateCloseHeader(onClose));

        const onOpen = () => {
            outputT.style.display = 'block';
            emojiTableContainer.scrollTop = emojiTableContainer.scrollHeight;
            filterBox.focus();
        };
        return {
            element: outputT,
            onOpen,
            onClose
        };
    }

    function getEmojiPreviewButtonList() {
        return $('input-extension-emoji > button:not(.' + emojiClass + ')').toArray();
    }
    
    function injectPreviewButtons(emojiList){
        var emojiButtons = getEmojiPreviewButtonList();
        emojiButtons.forEach(button => {
            injectPreviewButton(button, emojiList);
        });
    }

    function injectPreviewButton(previousPreviewButton, emojiList) {
        previousPreviewButton.classList.add(emojiClass);
        // Clone the control to disconnect all event listeners
        var emojiCloned = previousPreviewButton.cloneNode(true);
        var buttonContainer = previousPreviewButton.parentNode;
        buttonContainer.replaceChild(emojiCloned, previousPreviewButton);
        
        var open = false;
        var {element: emojiTable, onOpen, onClose} = createEmojiGrid(emojiList, (event, emoji) => {
            typeInInput(':'+emoji+':')
        }, (event) => {
            emojiTable.style.display = 'none';
            open = false;
        });
        buttonContainer.appendChild(emojiTable);

        emojiCloned.addEventListener('click', () => {
            if(open){
                onClose();
                open = false;
            } else {
                onOpen();
                open = true;
            }
        });
    }

    var CssInject = `
.emoji-img {
    height: 2em !important;
    display: inline-block;
    position: static !important;
}
.emoji-popup {
    background: #C8C8C8;
    position: absolute;
    z-index: 1000;
    left: 100px;
    bottom: 30px;
    font-size: 1.4rem;
    display: none;
    color: black; //dark mode makes all text white
}
.emoji-flex-table {
    display: flex;
    flex-flow: row wrap-reverse;
    justify-content: flex-start;
    align-items: flex-end;
    width: 500px;
}
.emoji-flex-table-container {
    max-height: 200px;
    overflow-y: scroll;
}
.emoji-flex-table .emoji-img {
    cursor: pointer;
}
        `;

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
            var emojisUsed = {};
            setInterval(
                () => {
                    var messageList = getMessageContentList();
                    messageList.forEach(div => emojifyMessageDiv(div, emojis, emojisUsed));
                    injectPreviewButtons(emojis);
                },
                2000
            );
            setInterval(
                () => {
                    if(Object.keys(emojisUsed).length <= 0){
                        return;
                    }
                    postEmojiUsages(emojisUsed).then(posted => {
                    });
                    emojisUsed = {};
                },
                10000
            )
        });
    }

    init();
}