$(document).ready(function() {
    var currentRepo = $(".js-current-repository").first().attr('href');

    modifyInterface();
    getPatternsAndProcess();

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
        $(file).find('.save').click(saveFilter);
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

    function saveFilter(e) {
        e.preventDefault();
        var repoRegex = $(this).siblings('[name=repo_regex]').val();
        var fileRegex = $(this).siblings('[name=file_regex]').val();
        chrome.extension.sendMessage({action: "saveFilter", repoRegex: repoRegex,
            fileRegex: fileRegex}, _.bind(function() {
                $(this).parents('.filter-form').slideUp();
                $(this).parents('.file').find('.filter-button').removeClass('disabled');
                getPatternsAndProcess();
            }, e.target));
    }

    function getPatternsAndProcess() {
        chrome.extension.sendMessage({action: "getPatterns"}, processPatterns);
    }

    function processPatterns(response) {
        _.each(response, matchRepo);
        // reset scroll position to what it should be once files have been hidden
        if (document.location.hash) {
            $(document.location.hash)[0].scrollIntoView();
        }
    }

    function makeARegex(pattern) {
        return new RegExp("^" + pattern.replace(/([^\*])(\*)([^\*])/g, "$1[^\/]*$3").replace(/\*\*/g, ".*") + "$");
    }

    function matchRepo(filePatterns, repoPattern) {
        try {
            var repoRegex = makeARegex(repoPattern);
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
                var regex = makeARegex(filePattern);
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

});
