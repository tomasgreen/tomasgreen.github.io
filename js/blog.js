$(document).ready(function () {
	if (('ontouchstart' in document.documentElement)) {
		document.documentElement.className += ' touch';
	}
	var busy = false;
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
	var updateChevrons = function () {
		if (currentPage == numerOfPages) $('.up').hide();
		else $('.up').show();
		if (currentPage == 1) $('.down').hide();
		else $('.down').show();
	};
	var resetSize = function () {
		$('body').css('max-width', $(window).innerWidth() + 'px');
		$('body').css('max-height', $(window).innerHeight() + 'px');
		$('body').css('width', $(window).innerWidth() + 'px');
		$('body').css('height', $(window).innerHeight() + 'px');
		$('section').width($(window).innerWidth());
		$('section').height($(window).innerHeight());
		$('article').centerize();
	};
	$('section').each(function (i) {
		$(this).attr('id', numerOfPages - i);
	});
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
		/*
		$prevPage.removeClass('fadeIn').addClass('fadeOut');
		$nextPage.removeClass('fadeOut').css('display', 'block').addClass('fadeIn');
		*/
		if (direction == 'down') {
			$prevPage.addClass('current moveToTop');
			$nextPage.addClass('current moveFromBottom');
		} else {
			$prevPage.addClass('current moveToBottom');
			$nextPage.addClass('current moveFromTop');
		}
		$nextPage.on('webkitAnimationEnd', function (event) {
			busy = false;
			$nextPage.removeClass('moveToTop moveFromBottom moveToBottom moveFromTop');
			$nextPage.addClass('current');
			$nextPage.off('webkitAnimationEnd');
		});
		$prevPage.on('webkitAnimationEnd', function (event) {
			busy = false;
			$prevPage.removeClass('moveToTop moveFromBottom moveToBottom moveFromTop');
			$prevPage.removeClass('current');
			$prevPage.off('webkitAnimationEnd');
		});
		resetSize();
		updateChevrons();
	};
	$('#' + currentPage).addClass('current');
	$('#' + currentPage).lazyLoad();
	resetSize();
	updateChevrons();
	$(window).resize(function () {
		resetSize();
	});
	$(document).keydown(function (e) {
		if (e.keyCode == 38) {
			changePage('up');
			return false;
		} else if (e.keyCode == 40 || e.keyCode == 32) {
			changePage('down');
			return false;
		}
	});
	$('.up').click(function () {
		changePage('up');
	});
	$('.down').click(function () {
		changePage('down');
	});
});