interface StorageData {
	apiUrl: string
}

//Make sure the payload is injected only once per context at most
// @ts-ignore
if (window.SECRET_EMOJI_KEY != "set") {
	// @ts-ignore
  window.SECRET_EMOJI_KEY = "set";
	// @ts-ignore
  if (window.EMOJI_API) {
    // if this is an injection into the electron app
		// @ts-ignore
    console.log("EMOJI API SET:" + window.EMOJI_API);
    setTimeout(() => {
			// @ts-ignore
      inject(window.EMOJI_API, window);
    }, 1000);
		// @ts-ignore
  } else if (window.chrome && window.chrome.storage) {
    function breakIntoTopPageScope(javascriptString: string) {
      const script = document.createElement("script");
      script.setAttribute("type", "text/javascript");
      script.innerHTML = javascriptString;

      const header = document.getElementsByTagName("head")[0];
      header.appendChild(script);
    }
    // if we are in the chrome extension
		// @ts-ignore
    chrome.storage.sync.get("api-url", (data) => {
      setTimeout(() => {
        const EMOJI_URL = data["api-url"];
        //we need to break into the top-level scope to make use of the JQuery-lite utility that already exists in ms-teams
        breakIntoTopPageScope(
          inject.toString() + ";inject('" + EMOJI_URL + "');"
        );
      }, 1000);
    });
  }
}

function inject(emojiApiPath: string | undefined) {
	function getValidEmojis() {
		return new Promise((resolve: (emojis: string[]) => void, _) => {
			$.get(emojiApiPath + "/emojis", (result: string[]) => {
				resolve(result.sort());
			});
		});
	}

	// function postEmojiUsages(emojiUsages) {
	//   return new Promise((resolve, reject) => {
	//     $.post({
	//       url: emojiApiPath + "/emojis/usage",
	//       data: JSON.stringify(emojiUsages),
	//       processData: false,
	//       contentType: "application/json",
	//       success: () => resolve(),
	//     });
	//   });
	// }

	function getMessageContentList() {
		return $(".message-body-content > div:not(." + emojiClass + ")").toArray();
	}

	function createImgTag(emoticonName: string) {
		return (
			'<img class="emoji-img" src="' +
			emojiApiPath +
			"/emoji/" +
			emoticonName +
			'" title="' +
			emoticonName +
			'" loading="lazy">'
		);
	}

	function createElementFromHTML(htmlString: string) {
		var div = document.createElement("div");
		div.innerHTML = htmlString.trim();
		return div.firstChild;
	}

	function crawlTree(htmlElement: Element, handleLeaf: { (leaf: Element): void }) {
		if (htmlElement.childElementCount <= 0) {
			handleLeaf(htmlElement);
			return;
		}
		for (let index = 0; index < htmlElement.children.length; index++) {
			const htmlChildElement = htmlElement.children[index];
			crawlTree(htmlChildElement, handleLeaf);
		}
	}

	var emojiClass = "EMOJIFIER-CHECKED";
	var emojiMatch = /:([\w-]+):/g;
	function injectEmojiImages(inputText: string, validEmojis: string[], emojisUsed: { [x: string]: number; }) {
		var resultStr = "";
		var matches = inputText.matchAll(emojiMatch);
		var currentIndexInInput = 0;

		var match;
		while (!(match = matches.next()).done) {
			var reInjectText = match.value[0];
			if (validEmojis.indexOf(match.value[1]) != -1) {
				const emojiName = match.value[1];
				reInjectText = createImgTag(emojiName);
				emojisUsed[emojiName] =
					(emojisUsed[emojiName] === undefined ? 0 : emojisUsed[emojiName]) + 1;
			}

			resultStr += inputText.substring(currentIndexInInput, match.value.index);
			resultStr += reInjectText;
			if (match.value.index)
				currentIndexInInput = match.value.index + match.value[0].length;
		}
		resultStr += inputText.substring(currentIndexInInput, inputText.length);
		if (!resultStr.endsWith("&nbsp;")) {
			//a characer of some sort is requred to get emoji at the end of a message to display correctly
			// don't ask me why
			// also don't ask me why it's not needed anymore
			// resultStr += '&nbsp;';
		}
		return resultStr;
	}

	function emojifyMessageDiv(div: Element, validEmojis: string[], emojisUsed: { [x: string]: number; }) {
		crawlTree(div, (leaf: Element) => {
			leaf.innerHTML = injectEmojiImages(
				leaf.innerHTML,
				validEmojis,
				emojisUsed
			);
		});
		div.classList.add(emojiClass);
	}

	function typeInInput(text: string) {
		const editorWindow = document.getElementsByClassName("ts-edit-box").item(0);
		if (editorWindow) {
			const textContainer = editorWindow.getElementsByClassName("cke_editable")
				.item(0)?.firstElementChild as HTMLDivElement;
			if (textContainer) {
				if (textContainer.innerHTML.includes("br"))
					textContainer.innerHTML = "";
				textContainer.innerText = textContainer.innerText + text;
			}
		}
	}

	function generateFilterBox(onFilterChange: { (newFilter: any): void; (arg0: string): void; }, debounce: number | undefined, onFilterSelected: { (selectedFilter: any): void; (arg0: string): void; }) {
		const inputBox = document.createElement("input");
		inputBox.placeholder = "🔍  Search"
		let lastTimeout = 0;

		inputBox.addEventListener("input", (_) => {
			window.clearTimeout(lastTimeout);
			lastTimeout = window.setTimeout(() => {
				var filterValue = inputBox.value;
				onFilterChange(filterValue);
			}, debounce);
		});

		inputBox.addEventListener("keydown", (event) => {
			if (event.key === "Enter") {
				onFilterSelected(inputBox.value);
			}
		});

		const inputBoxContainer = document.createElement("div");
		inputBoxContainer.id = "emoji-input-box-container";
		inputBoxContainer.appendChild(inputBox);
		return inputBoxContainer;
	}

	function filterEmoji(emojiName: string, filterText: string) {
		return emojiName.includes(filterText);
	}

	function createEmojiGrid(emojiList: string[],
													 emojiSelectedListener: { (event: Event | null, emoji: string | undefined): void },
													 closeListener: { (event: any): void }) {
		const table = document.createElement("div");
		table.classList.add("emoji-flex-table");

		let emojiFilterChangeListeners: any[] = [];
		const onClose = (event?: Event | undefined) => {
			// FIXME
			//filterBox.value = "";
			emojiFilterChangeListeners.forEach((onchange) => onchange(""));
			closeListener(event);
		};
		const filterBox = generateFilterBox(
			(newFilter: any) => {
				emojiFilterChangeListeners.forEach((onchange) => onchange(newFilter));

				emojiTableContainer.scrollTop = emojiTableContainer.scrollHeight;
			},
			500,
			(selectedFilter: any) => {
				var emoji = emojiList.find((emoji) => emoji.includes(selectedFilter));
				emojiSelectedListener(null, emoji);
				onClose();
			}
		);
		emojiFilterChangeListeners = emojiList.map((emoji) => {
			const emojiElement = createElementFromHTML(
				createImgTag(emoji)
			) as HTMLImageElement;
			if (emojiElement) {
				emojiElement.addEventListener("click", (event) => {
					emojiSelectedListener(event, emoji);
					onClose(event);
				});
				table.appendChild(emojiElement);
				return (newFilter: any) => {
					emojiElement.style.display = filterEmoji(emoji, newFilter)
						? "block"
						: "none";
				};
			}
		});

		const outputT = document.createElement("div");
		outputT.className = "emoji-popup";

		const emojiTableContainer = document.createElement("div");
		emojiTableContainer.className = "emoji-flex-table-container";
		emojiTableContainer.appendChild(table);

		outputT.appendChild(emojiTableContainer);
		outputT.appendChild(filterBox);

		const onOpen = () => {
			outputT.style.display = "block";
			// Turn off watermark since so it doesn't look jumbled when selecting an emoji and no other
			// text has been entered
			document.getElementsByClassName('ts-text-watermark')[0].textContent = "";
			// don't cut off the popover in replies
			for (const element  of document.getElementsByClassName('ts-message-list-item')) {
				(element as HTMLDivElement).style.overflow = "visible";
			}
			emojiTableContainer.scrollTop = emojiTableContainer.scrollHeight;
			(filterBox.firstChild as HTMLInputElement).focus();
		};
		return {
			element: outputT,
			onOpen,
			onClose,
		};
	}

	function getEmojiPreviewButtonList() {
		return $(
			"input-extension-emoji-v2 > button:not(." + emojiClass + ")"
		).toArray();
	}

	function injectPreviewButtons(emojiList: string[]) {
		var emojiButtons = getEmojiPreviewButtonList();
		emojiButtons.forEach((button) => {
			injectPreviewButton(button, emojiList);
		});
	}

	function injectPreviewButton(previousPreviewButton: HTMLElement, emojiList: string[]) {
		previousPreviewButton.classList.add(emojiClass);
		// Clone the control to disconnect all event listeners
		var emojiCloned = previousPreviewButton.cloneNode(true);
		var buttonContainer = previousPreviewButton.parentNode;
		if (buttonContainer)
			buttonContainer.replaceChild(emojiCloned, previousPreviewButton);

		var open = false;
		var {
			element: emojiTable,
			onOpen,
			onClose,
		} = createEmojiGrid(
			emojiList,
			(_: Event | null, emoji: string | undefined) => {
				typeInInput(":" + emoji + ":");
			},
			(_) => {
				emojiTable.style.display = "none";
				open = false;
			}
		);
		if (buttonContainer)
			buttonContainer.appendChild(emojiTable);

		emojiCloned.addEventListener("click", () => {
			if (open) {
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
    height: 24px !important;
    width: 24px !important;
    display: inline-block;
    position: static !important;
}
.emoji-flex-table > .emoji-img {
    margin: 6px 4px;
}
.emoji-popup input {
    width: 100%;
    border: 2px solid #ccc;
    height: 3rem;
}
.emoji-popup {
    background: #FFF;
    position: absolute;
    z-index: 1000;
    left: 100px;
    bottom: 30px;
    font-size: 1.4rem;
    display: none;
    color: black;
    border: 1px solid #ccc;
    border-radius: 6px;
    box-shadow: 0 0 0 1px rgb(232 232 232 / 13%), 0 4px 12px 0 rgb(0 0 0 / 8%);
    padding-top: 4px;
}
.emoji-flex-table {
    display: flex;
    flex-flow: row wrap-reverse;
    justify-content: flex-start;
    align-items: flex-end;
    width: 300px;
}
.emoji-flex-table-container {
    max-height: 294px;
    padding: 12px 0 6px 6px;
    overflow-y: scroll;
}
.emoji-flex-table-container::-webkit-scrollbar {
    display: none;
}
.emoji-flex-table .emoji-img {
    cursor: pointer;
}
#emoji-input-box-container {
    padding: 8px 12px 10px 12px;
    border-top: 1px solid #ccc;
}
`;

	function injectCSS(inputCss: string) {
		var style = document.createElement("style");
		style.innerHTML = inputCss;
		style.setAttribute("style", "text/css");
		document.getElementsByTagName("HEAD")[0].appendChild(style);
	}

	function init() {
		// Disable Teams' :stupit: auto-emoji generation. We can handle our own colons just fine, tyvm
		// @ts-ignore
		teamspace.services.EmoticonPickerHandler.prototype.insertInEditor = function() { };
		injectCSS(CssInject);
		console.log("fetching valid emojis from " + emojiApiPath);
		getValidEmojis().then((emojis: string[]) => {
			console.log(emojis);
			var emojisUsed = {};
			setInterval(() => {
				var messageList = getMessageContentList();
				messageList.forEach((div): void =>
					emojifyMessageDiv(div, emojis, emojisUsed)
				);
				injectPreviewButtons(emojis);
			}, 2000);
			// setInterval(() => {
			//   if (Object.keys(emojisUsed).length <= 0) {
			//     return;
			//   }
			//   postEmojiUsages(emojisUsed).then((posted) => {});
			//   emojisUsed = {};
			// }, 10000);
		});
	}

	init();
}
