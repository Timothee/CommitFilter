$(document).ready(function() {
	$('#filters').val(localStorage['commit_filters']);
	$('#save').click(function() {
		console.log('saving');
		localStorage['commit_filters'] = $('#filters').val();
	});
});

