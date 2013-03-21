$(document).ready(function() {
    var currentRepo = $(".js-current-repository").first().attr('href');

    chrome.extension.sendMessage({getPatterns: true}, processPatterns);

    function processPatterns(response) {
        _.each(response, matchRepo);
				addFilterButtons();
    }

    function matchRepo(filePatterns, repoPattern) {
				try {
						var repoRegex = new RegExp(repoPattern);
						if (repoRegex.test(currentRepo)) {
								console.log('repo match');
								var files = $(".file");
								_.each(files, function(file) {
										matchFile(file, filePatterns);
								});
						}
				}
				catch (e) {
					console.log(e);
				}
    }

    function matchFile(file, filePatterns) {
        _.each(filePatterns, function(filePattern) {
						try {
								var regex = new RegExp(filePattern);
								if (regex.test($(file).find('.meta').data('path'))) {
										console.log('match file');
										hideFile(file);
								}
						}
						catch (e) {
								console.log(e);
						}
        });
    }

    function hideFile(file) {
				if (!$(file).hasClass('filtered')) {
      		  $(file).find('.data').css('display', 'none');
      		  $(file).append("<div class='filter_notice'>This file has been filtered out. <a href='#' class='unfilter'>Click to display.</a></div>");
      		  $(file).find('.unfilter').bind('click', displayFile);
						$(file).addClass('filtered');
      		  console.log(file);
				}
    }

    function displayFile(e) {
        e.preventDefault();
        $(this).parent().parent().find('.data').css('display', 'block');
        $(this).parent().remove();
    }

		function addFilterButtons() {
				var files = $('.file');
				_.each(files, function(file) {
						if (!$(file).hasClass('filtered')) {
								$(file).find('.actions .button-group').prepend('<a class="minibutton">Filter</a>');
								$(file).find('.minibutton').click(function(e) {
									console.log(e);
									console.log(this);
								});
						}
				});
		}
});
