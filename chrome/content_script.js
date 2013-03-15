$(document).ready(function() {
	$('.file .meta').each(function(i, elt) {
		if (/\/public\/j\/lib\/build\//.test($(this).data('path')) ||
            /\/public\/c\//.test($(this).data('path'))) {
			$(this).siblings('.data').css('display', 'none');
			console.log('hiding a file');
		}
	});
	console.log('boo');
});
