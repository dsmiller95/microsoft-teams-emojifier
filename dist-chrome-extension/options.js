let urlSubmit = document.getElementById('submit');
let urlInput = document.getElementById('url');

chrome.storage.sync.get('api-url', function (data) {
    urlInput.value = data['api-url'];
});

urlSubmit.onclick = function (element) {
    var url = urlInput.value;
    chrome.storage.sync.set({ 'api-url': url });
    console.log(url);
};