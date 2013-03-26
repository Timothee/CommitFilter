chrome.extension.onMessage.addListener(
    function(request, sender, sendResponse) {
				switch(request.action) {
					case 'getPatterns':
            sendResponse(JSON.parse(localStorage['commit_filters']));
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
