// import("header.js");

;(function($, undefined) {

	$.keynav = {
		el: [],
		reset: function() {
			$.keynav.el = [];
		},

		reg: function(e,onClass,offClass) {
			e.pos = $.keynav.getPos(e);
			e.onClass = onClass;
			e.offClass = offClass;
			e.onmouseover = function (e) { $.keynav.setActive(this); };
			$.keynav.el.push(e);
		},

		setActive: function(e, fromKeyb) {
			var $cur = $($.keynav.getCurrent()),
					$e   = $(e);

			// Blur away from current element
			$cur.trigger('blur');

			for(var i=0; i < $.keynav.el.length; i++) {
				var tmp = $.keynav.el[i];
				$(tmp).removeClass(tmp.onClass).addClass(tmp.offClass);
			}

			// Set new element active and trigger the focus event
			$e.removeClass(e.offClass)
				.addClass(e.onClass)
				.trigger('focus');

			if (fromKeyb) {
				$e.trigger('keynav:focus');
			}

			$.keynav.currentEl = e;
		},

		// Internal method to grab the currently selected element
		// 
		// Takes no arguments, returns a reference to the current element
		getCurrent: function () {
			var cur = $.keynav.el[0];
			if($.keynav.currentEl) {
				cur = $.keynav.currentEl;
			}
			return cur;
		},

		quad: function(cur,fQuad) {
			var kn = $.keynav;
			var quad = Array();
			for(i=0;i<kn.el.length;i++) {
			var el = kn.el[i];
			if(cur == el) continue;
			if(fQuad((cur.pos.cx - el.pos.cx),(cur.pos.cy - el.pos.cy)))
				quad.push(el);
			}
			return quad;
		},

		activateClosest: function(cur,quad) {
			var closest,
					od = 1000000,
					nd = 0,
					found = false;

			for(i=0;i<quad.length;i++) {
				var e = quad[i];
				nd = Math.sqrt(Math.pow(cur.pos.cx-e.pos.cx,2)+Math.pow(cur.pos.cy-e.pos.cy,2));
				if(nd < od) {
					closest = e;
					od = nd;
					found = true;
				}
			}
			if(found) {
				$.keynav.setActive(closest, true);
			}
		},

		goLeft: function () {
			var cur = $.keynav.getCurrent(), 
					quad = $.keynav.quad(cur,function (dx,dy) { 
											if((dy >= 0) && (Math.abs(dx) - dy) <= 0) {
												return true;	
											}
											else {
												return false;
											}
										});

			$.keynav.activateClosest(cur,quad);
		},

		goRight: function () {
			var cur = $.keynav.getCurrent(), 
					quad = $.keynav.quad(cur,function (dx,dy) { 
											if((dy <= 0) && (Math.abs(dx) + dy) <= 0) {
												return true;	
											}
											else {
												return false;
											}
										});

			$.keynav.activateClosest(cur,quad);
		},

		goUp: function () {
			var cur = $.keynav.getCurrent(), 
					quad = $.keynav.quad(cur,function (dx,dy) { 
											if((dx >= 0) && (Math.abs(dy) - dx) <= 0) {
												return true;	
											}
											else {
												return false;
											}
										});

			$.keynav.activateClosest(cur,quad);
		},

		goDown: function () {
			var cur = $.keynav.getCurrent(), 
					quad = $.keynav.quad(cur,function (dx,dy) { 
											if((dx <= 0) && (Math.abs(dy) + dx) <= 0) {
												return true;	
											}
											else {
												return false;
											}
										});

			$.keynav.activateClosest(cur,quad);
		},

		activate: function () {
			$($.keynav.currentEl).trigger('click');
		},

		/**
		 * This function was taken from Stefan's exellent interface plugin
		 * http://www.eyecon.ro/interface/
		 * 
		 * I included it in this library's namespace because the functions aren't
		 * quite the same.
		 */
		getPos: function (e) {
			var cx,cy,
					l = 0,
					t  = 0,
					w = $.keynav.intval($.css(e,'width')),
					h = $.keynav.intval($.css(e,'height'));
			while (e.offsetParent){
					l += e.offsetLeft + (e.currentStyle?$.keynav.intval(e.currentStyle.borderLeftWidth):0);
					t += e.offsetTop  + (e.currentStyle?$.keynav.intval(e.currentStyle.borderTopWidth):0);
					e = e.offsetParent;
			}
			l += e.offsetLeft + (e.currentStyle?$.keynav.intval(e.currentStyle.borderLeftWidth):0);
			t += e.offsetTop  + (e.currentStyle?$.keynav.intval(e.currentStyle.borderTopWidth):0);
			cx = Math.round(t+(h/2));
			cy = Math.round(l+(w/2));
			return {x:l, y:t, w:w, h:h, cx:cx, cy:cy};
		},

		intval: function (v) {
			var v = parseInt(v);
			return isNaN(v) ? 0 : v;
		}
	}

  $.fn.keynav = function (onClass,offClass) {
	  //Initialization
	  var kn = $.keynav;
	  if(!$.keynav.init || $.keynav.init === false) {
		  $.keynav.el = [];

		  $(document).keydown(function(e) {
				var key = 0;
				if (e == null) {
					key = event.keyCode;
				} else { // mozilla
					key = e.which;
				}
				switch(key) {
					case 37: 
						$.keynav.goLeft();
						break;
					case 38: 
						$.keynav.goUp();
						break;
					case 39: 
						$.keynav.goRight();
						break;
					case 40: 
						$.keynav.goDown();
						break;
					case 13: 
						$.keynav.activate();
						break;
				}
		  });
		  $.keynav.init = true;
	  }

	  return this.each(function() {
			$.keynav.reg(this,onClass,offClass);
	  });
  }

  $.fn.keynav_sethover = function(onClass,offClass) {
	  return this.each(function() {
			this.onClass = onClass;
			this.offClass = offClass;
	  });
  }
})(jQuery)
