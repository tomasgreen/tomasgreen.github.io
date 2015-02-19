var _animationEndEvents = 'webkitAnimationEnd mozAnimationEnd msAnimationEnd oAnimationEnd animationend',
	_animationStartEvents = 'webkitAnimationStart mozAnimationStart msAnimationStart oAnimationStart animationstart';

function _each(o, func) {
	if (!o || (o.length === 0 && o != window)) return;
	if (!o.length) func(o);
	else Array.prototype.forEach.call(o, function (el, i) {
		func(el);
	});
}

function _one(el, events, func, useCapture) {
	_on(el, events, function (ev) {
		func(ev);
		_off(el, events, func);
	}, useCapture);
}

function _on(els, events, func, useCapture) {
	_each(els, function (el) {
		var ev = events.split(' ');
		for (var e in ev) el.addEventListener(ev[e], func, useCapture);
	});
}

function _off(els, events, func) {
	_each(els, function (el) {
		var ev = events.split(' ');
		for (var e in ev) el.removeEventListener(ev[e], func);
	});
}

function _addClass(els, cls) {
	_each(els, function (el) {
		if (el.classList) {
			var arr = cls.split(' ');
			for (var i in arr) el.classList.add(arr[i]);
		} else el.className += ' ' + cls;
	});
}

function _removeClass(els, cls) {
	_each(els, function (el) {
		if (el.classList) {
			var arr = cls.split(' ');
			for (var i in arr) el.classList.remove(arr[i]);
		} else el.className = el.className.replace(new RegExp('(^|\\b)' + cls.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
	});
}

function _animateCSS(el, cls, start, end) {
	if (start) _one(el, _animationStartEvents, start);
	_one(el, _animationEndEvents, function (ev) {
		_removeClass(el, cls);
		if (end) end(ev);
	});
	_addClass(el, cls);
}
Date.prototype.getWeek = function () {
	var d = new Date(this);
	d.setHours(0, 0, 0);
	d.setDate(d.getDate() + 4 - (d.getDay() || 7));
	var yearStart = new Date(d.getFullYear(), 0, 1);
	return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
};

Date.prototype.format = function () {
	var string = this.getFullYear() + "-";
	string += (this.getMonth() < 9 ? "0" + (this.getMonth() + 1) : (this.getMonth() + 1)) + "-";
	string += (this.getDate() < 9 ? "0" + this.getDate() : this.getDate());
	return string;
};

Date.prototype.setWeek = function (w, y) {
	if (y === undefined) y = this.getFullYear();
	var simple = new Date(y, 0, 1 + (w - 1) * 7);
	var dow = simple.getDay();
	var ISOweekStart = simple;
	if (dow <= 4)
		ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
	else
		ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
	this.setFullYear(ISOweekStart.getFullYear());
	this.setMonth(ISOweekStart.getMonth());
	this.setDate(ISOweekStart.getDate());
};
/*
http://stackoverflow.com/questions/16590500/javascript-calculate-date-from-week-number
*/
(function () {
	'use strict';
	document.addEventListener('DOMContentLoaded', function () {
		if (navigator.userAgent.match(/(iPad|iPhone|iPod)/g)) document.body.style.height = '80vh';

		var date = new Date(),
			weekEl = document.querySelector('.week'),
			dateEl = document.querySelector('.date'),
			infoEl = document.querySelector('.info');

		function setSpan() {
			if (isNaN(date)) return;
			var starts = new Date(date);
			starts.setWeek(date.getWeek());
			var ends = new Date(starts);
			ends.setDate(ends.getDate() + 6);
			infoEl.innerHTML = "<small>" + starts.format() + " to " + ends.format() + "</small>";
			_animateCSS(infoEl, 'animate');
		}

		weekEl.value = date.getWeek();
		dateEl.value = date.format();
		setSpan();
		_animateCSS(weekEl, 'animate');

		_on(dateEl, 'change', function (ev) {
			date = new Date(dateEl.value);
			weekEl.value = isNaN(date) ? '?' : date.getWeek();
			_animateCSS(weekEl, 'animate');
			setSpan()
		}, false);

		_on(weekEl, 'change', function (ev) {
			date.setWeek(parseInt(weekEl.value, 10));
			dateEl.value = isNaN(date) ? '?' : date.format();
			_animateCSS(dateEl, 'animate');
			setSpan()
		}, false);
	});
}).call(this);