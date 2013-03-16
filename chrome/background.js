chrome.extension.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.getPatterns) {
            sendResponse({
                "/SemanticSugar/adroll": [
                    "/public/j/lib/build/",
                    "/public/c/"
                ]
            });
        }
    }
);
