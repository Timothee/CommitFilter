chrome.extension.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.getPatterns) {
            sendResponse(JSON.parse(localStorage['commit_filters']));
        }
    }
);
