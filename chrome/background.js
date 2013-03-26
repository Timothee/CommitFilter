if (!localStorage.hasOwnProperty('commit_filters')) {
    localStorage['commit_filters'] = "{}";
}
chrome.extension.onMessage.addListener(
        function(request, sender, sendResponse) {
            switch(request.action) {
                case 'getPatterns':
                    var response = JSON.parse(localStorage['commit_filters']);
                    if (!$.isEmptyObject(response)) {
                        sendResponse(response);
                    }
                    break;
                case 'saveFilter':
                    var filters = JSON.parse(localStorage['commit_filters']);
                    var repoRegex = request.repoRegex;
                    var fileRegex = request.fileRegex;
                    if (!filters.hasOwnProperty(repoRegex)) {
                        filters[repoRegex] = [fileRegex];
                    } else if (!_.contains(filters[repoRegex], fileRegex)) {
                        filters[repoRegex].push(fileRegex);
                    }
                    localStorage['commit_filters'] = JSON.stringify(filters);
                    sendResponse(filters);
                    break;
            }
        }
        );
