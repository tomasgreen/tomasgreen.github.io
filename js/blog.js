$(document).ready(function () {
	var numerOfPages = $('section').length;
	var currentPage = parseInt(window.location.hash.substr(1)) || numerOfPages;
	if (currentPage > numerOfPages) {
		currentPage = numerOfPages;
		window.location.hash = '#' + currentPage;
	}
	$.fn.centerize = function () {
		$(this).each(function () {
			var $obj = $(this);
			$obj.css('margin-top', parseInt(($obj.parent().outerHeight() - $obj.outerHeight()) / 2) + 'px');
		});
	};
	$.fn.lazyLoad = function () {
		var $obj = $(this);
		if ($obj.attr('data-bg')) {
			$obj.css('background-image', 'url(' + $obj.attr('data-bg') + ')');
			$obj.attr('data-bg', '');
		}
	};
	var resetSize = function () {
		$('section').width($(window).innerWidth());
		$('section').height($(window).innerHeight());
		$('article').centerize();
	};
	$('section').each(function (i) {
		$(this).attr('id', numerOfPages - i);
	});
	var busy = false;
	var changePage = function (direction) {
		var nextPage = 1;
		if (direction == 'up') nextPage = currentPage + 1;
		else if (direction == 'down') nextPage = currentPage - 1;
		if (nextPage < 1 || nextPage > numerOfPages || busy) return;
		busy = true;
		var $prevPage = $('#' + currentPage);
		var $nextPage = $('#' + nextPage);
		currentPage = nextPage;
		window.location.hash = '#' + currentPage;
		$nextPage.lazyLoad();
		$prevPage.removeClass('fadeIn').addClass('fadeOut');
		$nextPage.removeClass('fadeOut').css('display', 'block').addClass('fadeIn');
		resetSize();
		setTimeout(function () {
			busy = false;
		}, 1500);
	};
	$('#' + currentPage).css('display', 'block');
	$('#' + currentPage).lazyLoad();
	resetSize();
	$(window).resize(function () {
		resetSize();
	});
	var ts;
	$(document).bind('touchstart', function (e) {
		ts = e.originalEvent.touches[0].clientY;
		return false;
	});
	$(document).bind('touchend', function (e) {
		var te = e.originalEvent.changedTouches[0].clientY;
		if (ts > te + 5) {
			changePage('down');
		} else if (ts < te - 5) {
			changePage('up');
		}
		return false;
	});
	$(document).bind('DOMMouseScroll', function (e) {
		changePage((e.originalEvent.detail > 0) ? 'down' : 'up');
		return false;
	});
	$(document).bind('mousewheel', function (e) {
		changePage((e.originalEvent.wheelDelta < 0) ? 'down' : 'up');
		return false;
	});
});