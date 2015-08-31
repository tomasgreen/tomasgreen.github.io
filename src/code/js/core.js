/*(function () {
    'use strict';
    this.ScrollThrottle = function (cb,delay) {
        if(delay === undefined) delay = 200;
        var instance = this,didScroll = false;
        var scrollInterval = setInterval(function () {
            if (!didScroll) return;
            didScroll = false;
            cb();
        },delay);
        instance.scrollEvent = function () {
            didScroll = true;
        };
        instance.destroy = function () {
            window.removeEventListener("scroll", instance.scrollEvent);
            if(scrollInterval) clearInterval(scrollInterval);
        };
        window.addEventListener("scroll", instance.scrollEvent);
    };
}).call(this);
(function () {
	'use strict';
	var el = document.getElementById('nav');
	var header = document.querySelector('header');
	function addShadow(){
		var h = header.offsetHeight-el.offsetHeight;
		if(document.body.scrollTop > 0) el.classList.add('nav-shadow');
		else el.classList.remove('nav-shadow');
	}
	new ScrollThrottle(addShadow);
	addShadow();
}).call(this);
*/