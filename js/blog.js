$.fn.centerize = function () {
	$(this).each(function () {
		var $obj = $(this);
		$obj.css('margin-top', parseInt(($obj.parent().outerHeight() - $obj.outerHeight()) / 2) + 'px');
	});
};
$.fn.lazyLoad = function () {
	var $obj = $(this);
	if ($obj.attr('data-bg')) {
		var i = new Image();
		i.onload = function () {
			$obj.css('background-image', 'url(' + i.src + ')');
			$obj.attr('data-bg', '');
		};
		i.src = $obj.attr('data-bg');
	}
};
$.fn.absoluteSize = function (width, height) {
	var $obj = $(this);
	$obj.css('max-width', width + 'px');
	$obj.css('max-height', height + 'px');
	$obj.css('width', width + 'px');
	$obj.css('height', height + 'px');
	$obj.css('min-width', width + 'px');
	$obj.css('min-height', height + 'px');
};
$(document).ready(function () {
	if (('ontouchstart' in document.documentElement)) {
		document.documentElement.className += ' touch';
	}
	var nextPageBusy = false;
	var prevPageBusy = false;
	var numerOfPages = $('section').length;
	var currentPage = parseInt(window.location.hash.substr(1)) || numerOfPages;
	if (currentPage > numerOfPages) {
		currentPage = numerOfPages;
		window.location.hash = '#' + currentPage;
	}
	var updateChevrons = function () {
		if (currentPage == numerOfPages) $('.up').hide();
		else $('.up').show();
		if (currentPage == 1) $('.down').hide();
		else $('.down').show();
	};
	var resetSize = function () {
		$('body').absoluteSize($(window).innerWidth(), $(window).innerHeight());
		$('section').absoluteSize($(window).innerWidth(), $(window).innerHeight());
		$('article').centerize();
	};
	var busy = function () {
		return (prevPageBusy || nextPageBusy);
	};
	$('section').each(function (i) {
		$(this).attr('id', numerOfPages - i);
	});
	var changePage = function (direction) {
		var nextPage = 1;
		nextPage = (direction == 'up') ? currentPage + 1 : currentPage - 1;
		if (nextPage < 1 || nextPage > numerOfPages || busy()) return;
		var $prevPage = $('#' + currentPage);
		var $nextPage = $('#' + nextPage);
		nextPageBusy = true;
		prevPageBusy = true;
		currentPage = nextPage;
		window.location.hash = '#' + currentPage;
		$nextPage.lazyLoad();
		if (direction == 'down') {
			$prevPage.addClass('current moveToTop');
			$nextPage.addClass('current moveFromBottom');
		} else {
			$prevPage.addClass('current moveToBottom');
			$nextPage.addClass('current moveFromTop');
		}
		$nextPage.on('webkitAnimationEnd', function (event) {
			nextPageBusy = false;
			$nextPage.removeClass('moveToTop moveFromBottom moveToBottom moveFromTop');
			$nextPage.addClass('current');
			$nextPage.off('webkitAnimationEnd');
		});
		$prevPage.on('webkitAnimationEnd', function (event) {
			prevPageBusy = false;
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
	var ts;
	var lastScroll = new Date();
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
		if (new Date() - lastScroll < 40) {
			lastScroll = new Date();
			return;
		}
		lastScroll = new Date();
		changePage((e.originalEvent.detail > 0) ? 'down' : 'up');
		e.preventDefault();
		return false;
	});
	$(document).bind('mousewheel', function (e) {
		if (new Date() - lastScroll < 40) {
			lastScroll = new Date();
			return;
		}
		lastScroll = new Date();
		changePage((e.originalEvent.wheelDelta < 0) ? 'down' : 'up');
		e.preventDefault();
		return false;
	});
});