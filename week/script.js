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
		if (navigator.userAgent.match(/(iPad|iPhone|iPod)/g)) {
			document.querySelector('.main').style.height = '80vh';
		}

		var date = new Date(),
			weekEl = document.querySelector('.week'),
			dateEl = document.querySelector('.date'),
			yearEl = document.querySelector('.year'),
			infoEl = document.querySelector('.info');

		function setSpan() {
			if (isNaN(date)) return;
			var start = new Date(date);
			start.setWeek(date.getWeek(), yearEl.value);
			var end = new Date(start);
			end.setDate(end.getDate() + 6);
			var html = start.format() + ' → ' + end.format();
			if (infoEl.textContent != html) {
				infoEl.textContent = html;
				_animateCSS(infoEl, 'animate');
			}

		}
		yearEl.value = yearEl.lastValue = date.getFullYear();
		weekEl.value = weekEl.lastValue = date.getWeek();
		dateEl.value = dateEl.lastValue = date.format();
		setSpan();

		_animateCSS(weekEl, 'animate');
		_animateCSS(yearEl, 'animate');
		_animateCSS(dateEl, 'animate');

		_on(dateEl, 'keyup', function (ev) {
			if (dateEl.value.length < 10 || dateEl.lastValue == dateEl.value) return;
			dateEl.lastValue = dateEl.value;
			date = new Date(dateEl.value);
			updateYear();
			updateWeek();
			setSpan();
		}, false);
		_on(weekEl, 'keyup', function (ev) {
			if (weekEl.value > 53 || weekEl.value < 1 || weekEl.lastValue == weekEl.value) return;
			if (isNaN(date)) date = new Date();
			weekEl.lastValue = weekEl.value;
			date.setWeek(parseInt(weekEl.value, 10), yearEl.value);
			updateDate();
			setSpan();
		}, false);

		_on(yearEl, 'keyup', function (ev) {
			if (yearEl.value.length < 4 || yearEl.lastValue == yearEl.value) return;
			date.setFullYear(yearEl.value);
			yearEl.lastValue = yearEl.value;
			updateWeek();
			updateDate();
			setSpan();
		}, false);

		function updateDate() {
			if (isNaN(date) || dateEl.lastValue == date.format()) return;

			dateEl.value = dateEl.lastValue = isNaN(date) ? '?' : date.format();
			_animateCSS(dateEl, 'animate');
		}

		function updateWeek() {
			if (isNaN(date) || weekEl.lastValue == date.getWeek()) return;

			weekEl.value = weekEl.lastValue = isNaN(date) ? '?' : date.getWeek();
			_animateCSS(weekEl, 'animate');
		}

		function updateYear() {
			if (isNaN(date) || yearEl.lastValue == date.getFullYear()) return;

			yearEl.value = yearEl.lastValue = date.getFullYear();
			_animateCSS(yearEl, 'animate');
		}
	});
}).call(this);