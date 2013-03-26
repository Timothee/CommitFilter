$(document).ready(function() {
    var currentRepo = $(".js-current-repository").first().attr('href');

		modifyInterface();
    chrome.extension.sendMessage({getPatterns: true}, processPatterns);

		function modifyInterface() {
			var files = $('.file');
			_.each(files, function(file) {
					addFilterButton(file);
					addNewFilterForm(file);
					addFilteredNotice(file);
			});
		}

		function addFilterButton(file) {
			$(file).find('.actions .button-group').prepend('<a class="minibutton filter-button">Filter</a>');
			$(file).find('.filter-button').click(showNewFilterForm);
		}

		function addNewFilterForm(file) {
			var currentFile = currentFilePath(file);
			$(file).find('.meta').after("<div class='filter-form'>" +
																	"<form>" +
																	"<label for='repo_regex'>Repo:</label>" +
																	"<input type='text' name='repo_regex' value='" + currentRepo + "'/>" +
																	"<label for='file_regex'>File:</label>" +
																	"<input type='text' name='file_regex' value='" + currentFile + "'/>" +
																	"<a class='minibutton save'>Save</a>" +
																	"<a class='minibutton cancel'>Cancel</a>" +
																	"</form>" +
																	"<div class='tip'>Type <b>*</b> to match any string for that directory level and <b>**</b> to potentially match multiple directory levels.</div>" +
																	"</div>");
			$(file).find('.cancel').click(hideNewFilterForm);
			$(file).find('.filter-form').hide();
		}

		function addFilteredNotice(file) {
			$(file).append("<div class='filter-notice'>This file has been filtered out. <a href='#' class='unfilter'>Click to display.</a></div>");
			$(file).find('.unfilter').bind('click', displayFile);
		}

		function currentFilePath(file) {
			return $(file).find('.meta').data('path');
		}

    function processPatterns(response) {
        _.each(response, matchRepo);
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
			$(file).addClass('filtered');
			$(file).find('.filter-button').remove();
    }

    function displayFile(e) {
        e.preventDefault();
				$(this).parents('.file').addClass('displayed');
    }

		function addFilterButtons() {
				var files = $('.file');
				_.each(files, function(file) {
						if (!$(file).hasClass('filtered')) {
								$(file).find('.actions .button-group').prepend('<a class="minibutton">Filter</a>');
								$(file).find('.minibutton').click(showNewFilter);
						}
				});
		}

		function showNewFilter() {
			console.log(this);
			var meta = $(this).parents('.meta');
			var currentFile = meta.data('path');
			meta.after("<div class='new-filter'><input type='text' value='" + currentRepo + "'/><span class='file-regex'>" + currentFile + "</span></div>");

		}

		function showNewFilterForm(e) {
			e.preventDefault();
			$(this).parents('.meta').siblings('.filter-form').slideDown();
			$(this).addClass('disabled');
		}

		function hideNewFilterForm(e) {
			e.preventDefault();
			$(this).parents('.filter-form').slideUp();
			$(this).parents('.file').find('.filter-button').removeClass('disabled');
		}

		function saveFilter() {

		}
});
