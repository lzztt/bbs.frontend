/*!
 * jQuery Cookie Plugin v1.4.1
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2006, 2014 Klaus Hartl
 * Released under the MIT license
 */
(function (factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD
		define(['jquery'], factory);
	} else if (typeof exports === 'object') {
		// CommonJS
		factory(require('jquery'));
	} else {
		// Browser globals
		factory(jQuery);
	}
}(function ($) {

	var pluses = /\+/g;

	function encode(s) {
		return config.raw ? s : encodeURIComponent(s);
	}

	function decode(s) {
		return config.raw ? s : decodeURIComponent(s);
	}

	function stringifyCookieValue(value) {
		return encode(config.json ? JSON.stringify(value) : String(value));
	}

	function parseCookieValue(s) {
		if (s.indexOf('"') === 0) {
			// This is a quoted cookie as according to RFC2068, unescape...
			s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
		}

		try {
			// Replace server-side written pluses with spaces.
			// If we can't decode the cookie, ignore it, it's unusable.
			// If we can't parse the cookie, ignore it, it's unusable.
			s = decodeURIComponent(s.replace(pluses, ' '));
			return config.json ? JSON.parse(s) : s;
		} catch(e) {}
	}

	function read(s, converter) {
		var value = config.raw ? s : parseCookieValue(s);
		return $.isFunction(converter) ? converter(value) : value;
	}

	var config = $.cookie = function (key, value, options) {

		// Write

		if (arguments.length > 1 && !$.isFunction(value)) {
			options = $.extend({}, config.defaults, options);

			if (typeof options.expires === 'number') {
				var days = options.expires, t = options.expires = new Date();
				t.setTime(+t + days * 864e+5);
			}

			return (document.cookie = [
				encode(key), '=', stringifyCookieValue(value),
				options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
				options.path    ? '; path=' + options.path : '',
				options.domain  ? '; domain=' + options.domain : '',
				options.secure  ? '; secure' : ''
			].join(''));
		}

		// Read

		var result = key ? undefined : {};

		// To prevent the for loop in the first place assign an empty array
		// in case there are no cookies at all. Also prevents odd result when
		// calling $.cookie().
		var cookies = document.cookie ? document.cookie.split('; ') : [];

		for (var i = 0, l = cookies.length; i < l; i++) {
			var parts = cookies[i].split('=');
			var name = decode(parts.shift());
			var cookie = parts.join('=');

			if (key && key === name) {
				// If second argument (value) is a function it's a converter...
				result = read(cookie, value);
				break;
			}

			// Prevent storing a cookie that we couldn't decode.
			if (!key && (cookie = read(cookie)) !== undefined) {
				result[name] = cookie;
			}
		}

		return result;
	};

	config.defaults = {};

	$.removeCookie = function (key, options) {
		if ($.cookie(key) === undefined) {
			return false;
		}

		// Must not alter options, thus extending a fresh object...
		$.cookie(key, '', $.extend({}, options, { expires: -1 }));
		return !$.cookie(key);
	};

}));
// simple image slider
// developped by ikki

(function ($) {
   "use strict";

   $.fn.imageSlider = function (options) {

      // options.
      var settings = $.extend({
         fadeTime: 1000,
         switchTime: 5000
      }, options);

      var images = new Array();
      $('ul li', this).each(function () {
         images.push({
            img: $(this).attr('data-img'),
            title: $(this).html(),
            uri: $(this).attr('data-href')
         });
      });

      if (images.length > 0)
      {
         var image_total = images.length;
         var current = 0;
         var canvas = $(this);
         var image = $('<a></a>').prependTo(canvas);
         var title = $('<span></span>').prependTo(image);
         var bgSwitch = function () {
            // set backgroud
            canvas.css('background-image', "url('" + images[current].img + "')");

            // move to next image
            current = (current != (image_total - 1) ? current + 1 : 0);

            image.fadeOut(settings.fadeTime, function () {
               image.css('background-image', "url('" + images[current].img + "')");
               image.fadeIn(settings.fadeTime);
               image.attr('href', images[current].uri);
               title.text(images[current].title);
            });
         };

         var bgSlider = setInterval(bgSwitch, settings.switchTime);
         // display first image
         image.css('background-image', "url('" + images[current].img + "')");
         image.attr('href', images[current].uri);
         title.text(images[current].title);
      }

      // chaining
      return this;
   };
}(jQuery));/*!
 * hoverIntent v1.8.0 // 2014.06.29 // jQuery v1.9.1+
 * http://cherne.net/brian/resources/jquery.hoverIntent.html
 *
 * You may use hoverIntent under the terms of the MIT license. Basically that
 * means you are free to use hoverIntent as long as this header is left intact.
 * Copyright 2007, 2014 Brian Cherne
 */
 
/* hoverIntent is similar to jQuery's built-in "hover" method except that
 * instead of firing the handlerIn function immediately, hoverIntent checks
 * to see if the user's mouse has slowed down (beneath the sensitivity
 * threshold) before firing the event. The handlerOut function is only
 * called after a matching handlerIn.
 *
 * // basic usage ... just like .hover()
 * .hoverIntent( handlerIn, handlerOut )
 * .hoverIntent( handlerInOut )
 *
 * // basic usage ... with event delegation!
 * .hoverIntent( handlerIn, handlerOut, selector )
 * .hoverIntent( handlerInOut, selector )
 *
 * // using a basic configuration object
 * .hoverIntent( config )
 *
 * @param  handlerIn   function OR configuration object
 * @param  handlerOut  function OR selector for delegation OR undefined
 * @param  selector    selector OR undefined
 * @author Brian Cherne <brian(at)cherne(dot)net>
 */
(function($) {
    $.fn.hoverIntent = function(handlerIn,handlerOut,selector) {

        // default configuration values
        var cfg = {
            interval: 100,
            sensitivity: 6,
            timeout: 0
        };

        if ( typeof handlerIn === "object" ) {
            cfg = $.extend(cfg, handlerIn );
        } else if ($.isFunction(handlerOut)) {
            cfg = $.extend(cfg, { over: handlerIn, out: handlerOut, selector: selector } );
        } else {
            cfg = $.extend(cfg, { over: handlerIn, out: handlerIn, selector: handlerOut } );
        }

        // instantiate variables
        // cX, cY = current X and Y position of mouse, updated by mousemove event
        // pX, pY = previous X and Y position of mouse, set by mouseover and polling interval
        var cX, cY, pX, pY;

        // A private function for getting mouse position
        var track = function(ev) {
            cX = ev.pageX;
            cY = ev.pageY;
        };

        // A private function for comparing current and previous mouse position
        var compare = function(ev,ob) {
            ob.hoverIntent_t = clearTimeout(ob.hoverIntent_t);
            // compare mouse positions to see if they've crossed the threshold
            if ( Math.sqrt( (pX-cX)*(pX-cX) + (pY-cY)*(pY-cY) ) < cfg.sensitivity ) {
                $(ob).off("mousemove.hoverIntent",track);
                // set hoverIntent state to true (so mouseOut can be called)
                ob.hoverIntent_s = true;
                return cfg.over.apply(ob,[ev]);
            } else {
                // set previous coordinates for next time
                pX = cX; pY = cY;
                // use self-calling timeout, guarantees intervals are spaced out properly (avoids JavaScript timer bugs)
                ob.hoverIntent_t = setTimeout( function(){compare(ev, ob);} , cfg.interval );
            }
        };

        // A private function for delaying the mouseOut function
        var delay = function(ev,ob) {
            ob.hoverIntent_t = clearTimeout(ob.hoverIntent_t);
            ob.hoverIntent_s = false;
            return cfg.out.apply(ob,[ev]);
        };

        // A private function for handling mouse 'hovering'
        var handleHover = function(e) {
            // copy objects to be passed into t (required for event object to be passed in IE)
            var ev = $.extend({},e);
            var ob = this;

            // cancel hoverIntent timer if it exists
            if (ob.hoverIntent_t) { ob.hoverIntent_t = clearTimeout(ob.hoverIntent_t); }

            // if e.type === "mouseenter"
            if (e.type === "mouseenter") {
                // set "previous" X and Y position based on initial entry point
                pX = ev.pageX; pY = ev.pageY;
                // update "current" X and Y position based on mousemove
                $(ob).on("mousemove.hoverIntent",track);
                // start polling interval (self-calling timeout) to compare mouse coordinates over time
                if (!ob.hoverIntent_s) { ob.hoverIntent_t = setTimeout( function(){compare(ev,ob);} , cfg.interval );}

                // else e.type == "mouseleave"
            } else {
                // unbind expensive mousemove event
                $(ob).off("mousemove.hoverIntent",track);
                // if hoverIntent state is true, then call the mouseOut function after the specified delay
                if (ob.hoverIntent_s) { ob.hoverIntent_t = setTimeout( function(){delay(ev,ob);} , cfg.timeout );}
            }
        };

        // listen for mouseenter and mouseleave
        return this.on({'mouseenter.hoverIntent':handleHover,'mouseleave.hoverIntent':handleHover}, cfg.selector);
    };
})(jQuery);
/*
 * v1.7.4
 * jQuery Superfish Menu Plugin
 * Copyright (c) 2013 Joel Birch
 *
 * Dual licensed under the MIT and GPL licenses:
 *	http://www.opensource.org/licenses/mit-license.php
 *	http://www.gnu.org/licenses/gpl.html
 */

(function ($) {
	"use strict";

	var methods = (function () {
		// private properties and methods go here
		var c = {
				bcClass: 'sf-breadcrumb',
				menuClass: 'sf-js-enabled',
				anchorClass: 'sf-with-ul',
				menuArrowClass: 'sf-arrows'
			},
			ios = (function () {
				var ios = /iPhone|iPad|iPod/i.test(navigator.userAgent);
				if (ios) {
					// iOS clicks only bubble as far as body children
					$(window).load(function () {
						$('body').children().on('click', $.noop);
					});
				}
				return ios;
			})(),
			wp7 = (function () {
				var style = document.documentElement.style;
				return ('behavior' in style && 'fill' in style && /iemobile/i.test(navigator.userAgent));
			})(),
			toggleMenuClasses = function ($menu, o) {
				var classes = c.menuClass;
				if (o.cssArrows) {
					classes += ' ' + c.menuArrowClass;
				}
				$menu.toggleClass(classes);
			},
			setPathToCurrent = function ($menu, o) {
				return $menu.find('li.' + o.pathClass).slice(0, o.pathLevels)
					.addClass(o.hoverClass + ' ' + c.bcClass)
						.filter(function () {
							return ($(this).children(o.popUpSelector).hide().show().length);
						}).removeClass(o.pathClass);
			},
			toggleAnchorClass = function ($li) {
				$li.children('a').toggleClass(c.anchorClass);
			},
			toggleTouchAction = function ($menu) {
				var touchAction = $menu.css('ms-touch-action');
				touchAction = (touchAction === 'pan-y') ? 'auto' : 'pan-y';
				$menu.css('ms-touch-action', touchAction);
			},
			applyHandlers = function ($menu, o) {
				var targets = 'li:has(' + o.popUpSelector + ')';
				if ($.fn.hoverIntent && !o.disableHI) {
					$menu.hoverIntent(over, out, targets);
				}
				else {
					$menu
						.on('mouseenter.superfish', targets, over)
						.on('mouseleave.superfish', targets, out);
				}
				var touchevent = 'MSPointerDown.superfish';
				if (!ios) {
					touchevent += ' touchend.superfish';
				}
				if (wp7) {
					touchevent += ' mousedown.superfish';
				}
				$menu
					.on('focusin.superfish', 'li', over)
					.on('focusout.superfish', 'li', out)
					.on(touchevent, 'a', o, touchHandler);
			},
			touchHandler = function (e) {
				var $this = $(this),
					$ul = $this.siblings(e.data.popUpSelector);

				if ($ul.length > 0 && $ul.is(':hidden')) {
					$this.one('click.superfish', false);
					if (e.type === 'MSPointerDown') {
						$this.trigger('focus');
					} else {
						$.proxy(over, $this.parent('li'))();
					}
				}
			},
			over = function () {
				var $this = $(this),
					o = getOptions($this);
				clearTimeout(o.sfTimer);
				$this.siblings().superfish('hide').end().superfish('show');
			},
			out = function () {
				var $this = $(this),
					o = getOptions($this);
				if (ios) {
					$.proxy(close, $this, o)();
				}
				else {
					clearTimeout(o.sfTimer);
					o.sfTimer = setTimeout($.proxy(close, $this, o), o.delay);
				}
			},
			close = function (o) {
				o.retainPath = ($.inArray(this[0], o.$path) > -1);
				this.superfish('hide');

				if (!this.parents('.' + o.hoverClass).length) {
					o.onIdle.call(getMenu(this));
					if (o.$path.length) {
						$.proxy(over, o.$path)();
					}
				}
			},
			getMenu = function ($el) {
				return $el.closest('.' + c.menuClass);
			},
			getOptions = function ($el) {
				return getMenu($el).data('sf-options');
			};

		return {
			// public methods
			hide: function (instant) {
				if (this.length) {
					var $this = this,
						o = getOptions($this);
					if (!o) {
						return this;
					}
					var not = (o.retainPath === true) ? o.$path : '',
						$ul = $this.find('li.' + o.hoverClass).add(this).not(not).removeClass(o.hoverClass).children(o.popUpSelector),
						speed = o.speedOut;

					if (instant) {
						$ul.show();
						speed = 0;
					}
					o.retainPath = false;
					o.onBeforeHide.call($ul);
					$ul.stop(true, true).animate(o.animationOut, speed, function () {
						var $this = $(this);
						o.onHide.call($this);
					});
				}
				return this;
			},
			show: function () {
				var o = getOptions(this);
				if (!o) {
					return this;
				}
				var $this = this.addClass(o.hoverClass),
					$ul = $this.children(o.popUpSelector);

				o.onBeforeShow.call($ul);
				$ul.stop(true, true).animate(o.animation, o.speed, function () {
					o.onShow.call($ul);
				});
				return this;
			},
			destroy: function () {
				return this.each(function () {
					var $this = $(this),
						o = $this.data('sf-options'),
						$hasPopUp;
					if (!o) {
						return false;
					}
					$hasPopUp = $this.find(o.popUpSelector).parent('li');
					clearTimeout(o.sfTimer);
					toggleMenuClasses($this, o);
					toggleAnchorClass($hasPopUp);
					toggleTouchAction($this);
					// remove event handlers
					$this.off('.superfish').off('.hoverIntent');
					// clear animation's inline display style
					$hasPopUp.children(o.popUpSelector).attr('style', function (i, style) {
						return style.replace(/display[^;]+;?/g, '');
					});
					// reset 'current' path classes
					o.$path.removeClass(o.hoverClass + ' ' + c.bcClass).addClass(o.pathClass);
					$this.find('.' + o.hoverClass).removeClass(o.hoverClass);
					o.onDestroy.call($this);
					$this.removeData('sf-options');
				});
			},
			init: function (op) {
				return this.each(function () {
					var $this = $(this);
					if ($this.data('sf-options')) {
						return false;
					}
					var o = $.extend({}, $.fn.superfish.defaults, op),
						$hasPopUp = $this.find(o.popUpSelector).parent('li');
					o.$path = setPathToCurrent($this, o);

					$this.data('sf-options', o);

					toggleMenuClasses($this, o);
					toggleAnchorClass($hasPopUp);
					toggleTouchAction($this);
					applyHandlers($this, o);

					$hasPopUp.not('.' + c.bcClass).superfish('hide', true);

					o.onInit.call(this);
				});
			}
		};
	})();

	$.fn.superfish = function (method, args) {
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		}
		else if (typeof method === 'object' || ! method) {
			return methods.init.apply(this, arguments);
		}
		else {
			return $.error('Method ' +  method + ' does not exist on jQuery.fn.superfish');
		}
	};

	$.fn.superfish.defaults = {
		popUpSelector: 'ul', // within menu context
		hoverClass: 'sfHover',
		pathClass: 'overrideThisToUse',
		pathLevels: 1,
		delay: 800,
		animation: {opacity: 'show'},
		animationOut: {opacity: 'hide'},
		speed: 'normal',
		speedOut: 'fast',
		cssArrows: true,
		disableHI: false,
		onInit: $.noop,
		onBeforeShow: $.noop,
		onShow: $.noop,
		onBeforeHide: $.noop,
		onHide: $.noop,
		onIdle: $.noop,
		onDestroy: $.noop
	};

})(jQuery);
// ----------------------------------------------------------------------------
// markItUp! Universal MarkUp Engine, JQuery plugin
// v 1.1.x
// Dual licensed under the MIT and GPL licenses.
// ----------------------------------------------------------------------------
// Copyright (C) 2007-2012 Jay Salvat
// http://markitup.jaysalvat.com/
// ----------------------------------------------------------------------------
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
// ----------------------------------------------------------------------------
(function($) {
	$.fn.markItUp = function(settings, extraSettings) {
		var method, params, options, ctrlKey, shiftKey, altKey; ctrlKey = shiftKey = altKey = false;

		if (typeof settings == 'string') {
			method = settings;
			params = extraSettings;
		} 

		options = {	id:						'',
					nameSpace:				'',
					root:					'',
					previewHandler:			false,
					previewInWindow:		'', // 'width=800, height=600, resizable=yes, scrollbars=yes'
					previewInElement:		'',
					previewAutoRefresh:		true,
					previewPosition:		'after',
					previewTemplatePath:	'~/templates/preview.html',
					previewParser:			false,
					previewParserPath:		'',
					previewParserVar:		'data',
					resizeHandle:			true,
					beforeInsert:			'',
					afterInsert:			'',
					onEnter:				{},
					onShiftEnter:			{},
					onCtrlEnter:			{},
					onTab:					{},
					markupSet:			[	{ /* set */ } ]
				};
		$.extend(options, settings, extraSettings);

		// compute markItUp! path
		if (!options.root) {
			$('script').each(function(a, tag) {
				miuScript = $(tag).get(0).src.match(/(.*)jquery\.markitup(\.pack)?\.js$/);
				if (miuScript !== null) {
					options.root = miuScript[1];
				}
			});
		}

		// Quick patch to keep compatibility with jQuery 1.9
		var uaMatch = function(ua) {
			ua = ua.toLowerCase();

			var match = /(chrome)[ \/]([\w.]+)/.exec(ua) ||
				/(webkit)[ \/]([\w.]+)/.exec(ua) ||
				/(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) ||
				/(msie) ([\w.]+)/.exec(ua) ||
				ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) ||
				[];

			return {
				browser: match[ 1 ] || "",
				version: match[ 2 ] || "0"
			};
		};
		var matched = uaMatch( navigator.userAgent );
		var browser = {};

		if (matched.browser) {
			browser[matched.browser] = true;
			browser.version = matched.version;
		}
		if (browser.chrome) {
			browser.webkit = true;
		} else if (browser.webkit) {
			browser.safari = true;
		}

		return this.each(function() {
			var $$, textarea, levels, scrollPosition, caretPosition, caretOffset,
				clicked, hash, header, footer, previewWindow, template, iFrame, abort;
			$$ = $(this);
			textarea = this;
			levels = [];
			abort = false;
			scrollPosition = caretPosition = 0;
			caretOffset = -1;

			options.previewParserPath = localize(options.previewParserPath);
			options.previewTemplatePath = localize(options.previewTemplatePath);

			if (method) {
				switch(method) {
					case 'remove':
						remove();
					break;
					case 'insert':
						markup(params);
					break;
					default: 
						$.error('Method ' +  method + ' does not exist on jQuery.markItUp');
				}
				return;
			}

			// apply the computed path to ~/
			function localize(data, inText) {
				if (inText) {
					return 	data.replace(/("|')~\//g, "$1"+options.root);
				}
				return 	data.replace(/^~\//, options.root);
			}

			// init and build editor
			function init() {
				id = ''; nameSpace = '';
				if (options.id) {
					id = 'id="'+options.id+'"';
				} else if ($$.attr("id")) {
					id = 'id="markItUp'+($$.attr("id").substr(0, 1).toUpperCase())+($$.attr("id").substr(1))+'"';

				}
				if (options.nameSpace) {
					nameSpace = 'class="'+options.nameSpace+'"';
				}
				$$.wrap('<div '+nameSpace+'></div>');
				$$.wrap('<div '+id+' class="markItUp"></div>');
				$$.wrap('<div class="markItUpContainer"></div>');
				$$.addClass("markItUpEditor");

				// add the header before the textarea
				header = $('<div class="markItUpHeader"></div>').insertBefore($$);
				$(dropMenus(options.markupSet)).appendTo(header);

				// add the footer after the textarea
				footer = $('<div class="markItUpFooter"></div>').insertAfter($$);

				// add the resize handle after textarea
				if (options.resizeHandle === true && browser.safari !== true) {
					resizeHandle = $('<div class="markItUpResizeHandle"></div>')
						.insertAfter($$)
						.bind("mousedown.markItUp", function(e) {
							var h = $$.height(), y = e.clientY, mouseMove, mouseUp;
							mouseMove = function(e) {
								$$.css("height", Math.max(20, e.clientY+h-y)+"px");
								return false;
							};
							mouseUp = function(e) {
								$("html").unbind("mousemove.markItUp", mouseMove).unbind("mouseup.markItUp", mouseUp);
								return false;
							};
							$("html").bind("mousemove.markItUp", mouseMove).bind("mouseup.markItUp", mouseUp);
					});
					footer.append(resizeHandle);
				}

				// listen key events
				$$.bind('keydown.markItUp', keyPressed).bind('keyup', keyPressed);
				
				// bind an event to catch external calls
				$$.bind("insertion.markItUp", function(e, settings) {
					if (settings.target !== false) {
						get();
					}
					if (textarea === $.markItUp.focused) {
						markup(settings);
					}
				});

				// remember the last focus
				$$.bind('focus.markItUp', function() {
					$.markItUp.focused = this;
				});

				if (options.previewInElement) {
					refreshPreview();
				}
			}
                  
         // added by ikki, to strip html tags for link titles
			function stripHTML(html)
			{
			   var tmp = document.createElement("DIV");
			   tmp.innerHTML = html;
			   return tmp.textContent||tmp.innerText;
			}

			// recursively build header with dropMenus from markupset
			function dropMenus(markupSet) {
				var ul = $('<ul></ul>'), i = 0;
				$('li:hover > ul', ul).css('display', 'block');
				$.each(markupSet, function() {
					var button = this, t = '', title, li, j;
					//title = (button.key) ? (button.name||'')+' [Ctrl+'+button.key+']' : (button.name||'');
                              title = (button.key) ? (stripHTML(button.name)||'')+' [Ctrl+'+button.key+']' : (stripHTML(button.name)||'');
					key   = (button.key) ? 'accesskey="'+button.key+'"' : '';
					if (button.separator) {
						li = $('<li class="markItUpSeparator">'+(button.separator||'')+'</li>').appendTo(ul);
					} else {
						i++;
						for (j = levels.length -1; j >= 0; j--) {
							t += levels[j]+"-";
						}
						li = $('<li class="markItUpButton markItUpButton'+t+(i)+' '+(button.className||'')+'"><a href="" '+key+' title="'+title+'">'+(button.name||'')+'</a></li>')
						.bind("contextmenu.markItUp", function() { // prevent contextmenu on mac and allow ctrl+click
							return false;
						}).bind('click.markItUp', function(e) {
							e.preventDefault();
						}).bind("focusin.markItUp", function(){
                            $$.focus();
						}).bind('mouseup', function() {
							if (button.call) {
								eval(button.call)();
							}
							setTimeout(function() { markup(button) },1);
							return false;
						}).bind('mouseenter.markItUp', function() {
								$('> ul', this).show();
								$(document).one('click', function() { // close dropmenu if click outside
										$('ul ul', header).hide();
									}
								);
						}).bind('mouseleave.markItUp', function() {
								$('> ul', this).hide();
						}).appendTo(ul);
						if (button.dropMenu) {
							levels.push(i);
							$(li).addClass('markItUpDropMenu').append(dropMenus(button.dropMenu));
						}
					}
				}); 
				levels.pop();
				return ul;
			}

			// markItUp! markups
			function magicMarkups(string) {
				if (string) {
					string = string.toString();
					string = string.replace(/\(\!\(([\s\S]*?)\)\!\)/g,
						function(x, a) {
							var b = a.split('|!|');
							if (altKey === true) {
								return (b[1] !== undefined) ? b[1] : b[0];
							} else {
								return (b[1] === undefined) ? "" : b[0];
							}
						}
					);
					// [![prompt]!], [![prompt:!:value]!]
					string = string.replace(/\[\!\[([\s\S]*?)\]\!\]/g,
						function(x, a) {
							var b = a.split(':!:');
							if (abort === true) {
								return false;
							}
							value = prompt(b[0], (b[1]) ? b[1] : '');
							if (value === null) {
								abort = true;
							}
							return value;
						}
					);
					return string;
				}
				return "";
			}

			// prepare action
			function prepare(action) {
				if ($.isFunction(action)) {
					action = action(hash);
				}
				return magicMarkups(action);
			}

			// build block to insert
			function build(string) {
				var openWith 			= prepare(clicked.openWith);
				var placeHolder 		= prepare(clicked.placeHolder);
				var replaceWith 		= prepare(clicked.replaceWith);
				var closeWith 			= prepare(clicked.closeWith);
				var openBlockWith 		= prepare(clicked.openBlockWith);
				var closeBlockWith 		= prepare(clicked.closeBlockWith);
				var multiline 			= clicked.multiline;
				
				if (replaceWith !== "") {
					block = openWith + replaceWith + closeWith;
				} else if (selection === '' && placeHolder !== '') {
					block = openWith + placeHolder + closeWith;
				} else {
					string = string || selection;

					var lines = [string], blocks = [];
					
					if (multiline === true) {
						lines = string.split(/\r?\n/);
					}
					
					for (var l = 0; l < lines.length; l++) {
						line = lines[l];
						var trailingSpaces;
						if (trailingSpaces = line.match(/ *$/)) {
							blocks.push(openWith + line.replace(/ *$/g, '') + closeWith + trailingSpaces);
						} else {
							blocks.push(openWith + line + closeWith);
						}
					}
					
					block = blocks.join("\n");
				}

				block = openBlockWith + block + closeBlockWith;

				return {	block:block, 
							openBlockWith:openBlockWith,
							openWith:openWith, 
							replaceWith:replaceWith, 
							placeHolder:placeHolder,
							closeWith:closeWith,
							closeBlockWith:closeBlockWith
					};
			}

			// define markup to insert
			function markup(button) {
				var len, j, n, i;
				hash = clicked = button;
				get();
				$.extend(hash, {	line:"", 
						 			root:options.root,
									textarea:textarea, 
									selection:(selection||''), 
									caretPosition:caretPosition,
									ctrlKey:ctrlKey, 
									shiftKey:shiftKey, 
									altKey:altKey
								}
							);
				// callbacks before insertion
				prepare(options.beforeInsert);
				prepare(clicked.beforeInsert);
				if ((ctrlKey === true && shiftKey === true) || button.multiline === true) {
					prepare(clicked.beforeMultiInsert);
				}			
				$.extend(hash, { line:1 });

				if ((ctrlKey === true && shiftKey === true)) {
					lines = selection.split(/\r?\n/);
					for (j = 0, n = lines.length, i = 0; i < n; i++) {
						if ($.trim(lines[i]) !== '') {
							$.extend(hash, { line:++j, selection:lines[i] } );
							lines[i] = build(lines[i]).block;
						} else {
							lines[i] = "";
						}
					}

					string = { block:lines.join('\n')};
					start = caretPosition;
					len = string.block.length + ((browser.opera) ? n-1 : 0);
				} else if (ctrlKey === true) {
					string = build(selection);
					start = caretPosition + string.openWith.length;
					len = string.block.length - string.openWith.length - string.closeWith.length;
					len = len - (string.block.match(/ $/) ? 1 : 0);
					len -= fixIeBug(string.block);
				} else if (shiftKey === true) {
					string = build(selection);
					start = caretPosition;
					len = string.block.length;
					len -= fixIeBug(string.block);
				} else {
					string = build(selection);
					start = caretPosition + string.block.length ;
					len = 0;
					start -= fixIeBug(string.block);
				}
				if ((selection === '' && string.replaceWith === '')) {
					caretOffset += fixOperaBug(string.block);
					
					start = caretPosition + string.openBlockWith.length + string.openWith.length;
					len = string.block.length - string.openBlockWith.length - string.openWith.length - string.closeWith.length - string.closeBlockWith.length;

					caretOffset = $$.val().substring(caretPosition,  $$.val().length).length;
					caretOffset -= fixOperaBug($$.val().substring(0, caretPosition));
				}
				$.extend(hash, { caretPosition:caretPosition, scrollPosition:scrollPosition } );

				if (string.block !== selection && abort === false) {
					insert(string.block);
					set(start, len);
				} else {
					caretOffset = -1;
				}
				get();

				$.extend(hash, { line:'', selection:selection });

				// callbacks after insertion
				if ((ctrlKey === true && shiftKey === true) || button.multiline === true) {
					prepare(clicked.afterMultiInsert);
				}
				prepare(clicked.afterInsert);
				prepare(options.afterInsert);

				// refresh preview if opened
				if (previewWindow && options.previewAutoRefresh) {
					refreshPreview(); 
				}
																									
				// reinit keyevent
				shiftKey = altKey = ctrlKey = abort = false;
			}

			// Substract linefeed in Opera
			function fixOperaBug(string) {
				if (browser.opera) {
					return string.length - string.replace(/\n*/g, '').length;
				}
				return 0;
			}
			// Substract linefeed in IE
			function fixIeBug(string) {
				if (browser.msie) {
					return string.length - string.replace(/\r*/g, '').length;
				}
				return 0;
			}
				
			// add markup
			function insert(block) {	
				if (document.selection) {
					var newSelection = document.selection.createRange();
					newSelection.text = block;
				} else {
					textarea.value =  textarea.value.substring(0, caretPosition)  + block + textarea.value.substring(caretPosition + selection.length, textarea.value.length);
				}
			}

			// set a selection
			function set(start, len) {
				if (textarea.createTextRange){
					// quick fix to make it work on Opera 9.5
					if (browser.opera && browser.version >= 9.5 && len == 0) {
						return false;
					}
					range = textarea.createTextRange();
					range.collapse(true);
					range.moveStart('character', start); 
					range.moveEnd('character', len); 
					range.select();
				} else if (textarea.setSelectionRange ){
					textarea.setSelectionRange(start, start + len);
				}
				textarea.scrollTop = scrollPosition;
				textarea.focus();
			}

			// get the selection
			function get() {
				textarea.focus();

				scrollPosition = textarea.scrollTop;
				if (document.selection) {
					selection = document.selection.createRange().text;
					if (browser.msie) { // ie
						var range = document.selection.createRange(), rangeCopy = range.duplicate();
						rangeCopy.moveToElementText(textarea);
						caretPosition = -1;
						while(rangeCopy.inRange(range)) {
							rangeCopy.moveStart('character');
							caretPosition ++;
						}
					} else { // opera
						caretPosition = textarea.selectionStart;
					}
				} else { // gecko & webkit
					caretPosition = textarea.selectionStart;

					selection = textarea.value.substring(caretPosition, textarea.selectionEnd);
				} 
				return selection;
			}

			// open preview window
			function preview() {
            return; //do nothing, just disable this function
				if (typeof options.previewHandler === 'function') {
					previewWindow = true;
				} else if (options.previewInElement) {
					previewWindow = $(options.previewInElement);
				} else if (!previewWindow || previewWindow.closed) {
					if (options.previewInWindow) {
						previewWindow = window.open('', 'preview', options.previewInWindow);
						$(window).unload(function() {
							previewWindow.close();
						});
					} else {
						iFrame = $('<iframe class="markItUpPreviewFrame"></iframe>');
						if (options.previewPosition == 'after') {
							iFrame.insertAfter(footer);
						} else {
							iFrame.insertBefore(header);
						}	
						previewWindow = iFrame[iFrame.length - 1].contentWindow || frame[iFrame.length - 1];
					}
				} else if (altKey === true) {
					if (iFrame) {
						iFrame.remove();
					} else {
						previewWindow.close();
					}
					previewWindow = iFrame = false;
				}
				if (!options.previewAutoRefresh) {
					refreshPreview(); 
				}
				if (options.previewInWindow) {
					previewWindow.focus();
				}
			}

			// refresh Preview window
			function refreshPreview() {
 				renderPreview();
			}

			function renderPreview() {
				var phtml;
				if (options.previewHandler && typeof options.previewHandler === 'function') {
					options.previewHandler( $$.val() );
				} else if (options.previewParser && typeof options.previewParser === 'function') {
					var data = options.previewParser( $$.val() );
					writeInPreview(localize(data, 1) ); 
				} else if (options.previewParserPath !== '') {
					$.ajax({
						type: 'POST',
						dataType: 'text',
						global: false,
						url: options.previewParserPath,
						data: options.previewParserVar+'='+encodeURIComponent($$.val()),
						success: function(data) {
							writeInPreview( localize(data, 1) ); 
						}
					});
				} else {
					if (!template) {
						$.ajax({
							url: options.previewTemplatePath,
							dataType: 'text',
							global: false,
							success: function(data) {
								writeInPreview( localize(data, 1).replace(/<!-- content -->/g, $$.val()) );
							}
						});
					}
				}
				return false;
			}
			
			function writeInPreview(data) {
				if (options.previewInElement) {
					$(options.previewInElement).html(data);
				} else if (previewWindow && previewWindow.document) {			
					try {
						sp = previewWindow.document.documentElement.scrollTop
					} catch(e) {
						sp = 0;
					}	
					previewWindow.document.open();
					previewWindow.document.write(data);
					previewWindow.document.close();
					previewWindow.document.documentElement.scrollTop = sp;
				}
			}
			
			// set keys pressed
			function keyPressed(e) { 
				shiftKey = e.shiftKey;
				altKey = e.altKey;
				ctrlKey = (!(e.altKey && e.ctrlKey)) ? (e.ctrlKey || e.metaKey) : false;

				if (e.type === 'keydown') {
					if (ctrlKey === true) {
						li = $('a[accesskey="'+((e.keyCode == 13) ? '\\n' : String.fromCharCode(e.keyCode))+'"]', header).parent('li');
						if (li.length !== 0) {
							ctrlKey = false;
							setTimeout(function() {
								li.triggerHandler('mouseup');
							},1);
							return false;
						}
					}
					if (e.keyCode === 13 || e.keyCode === 10) { // Enter key
						if (ctrlKey === true) {  // Enter + Ctrl
							ctrlKey = false;
							markup(options.onCtrlEnter);
							return options.onCtrlEnter.keepDefault;
						} else if (shiftKey === true) { // Enter + Shift
							shiftKey = false;
							markup(options.onShiftEnter);
							return options.onShiftEnter.keepDefault;
						} else { // only Enter
							markup(options.onEnter);
							return options.onEnter.keepDefault;
						}
					}
					if (e.keyCode === 9) { // Tab key
						if (shiftKey == true || ctrlKey == true || altKey == true) {
							return false; 
						}
						if (caretOffset !== -1) {
							get();
							caretOffset = $$.val().length - caretOffset;
							set(caretOffset, 0);
							caretOffset = -1;
							return false;
						} else {
							markup(options.onTab);
							return options.onTab.keepDefault;
						}
					}
				}
			}

			function remove() {
				$$.unbind(".markItUp").removeClass('markItUpEditor');
				$$.parent('div').parent('div.markItUp').parent('div').replaceWith($$);
				$$.data('markItUp', null);
			}

			init();
		});
	};

	$.fn.markItUpRemove = function() {
		return this.each(function() {
				$(this).markItUp('remove');
			}
		);
	};

	$.markItUp = function(settings) {
		var options = { target:false };
		$.extend(options, settings);
		if (options.target) {
			return $(options.target).each(function() {
				$(this).focus();
				$(this).trigger('insertion', [options]);
			});
		} else {
			$('textarea').trigger('insertion', [options]);
		}
	};
})(jQuery);
// ----------------------------------------------------------------------------
// markItUp!
// ----------------------------------------------------------------------------
// Copyright (C) 2008 Jay Salvat
// http://markitup.jaysalvat.com/
// ----------------------------------------------------------------------------
// BBCode tags example
// http://en.wikipedia.org/wiki/Bbcode
// ----------------------------------------------------------------------------
// Feel free to add more tags
// ----------------------------------------------------------------------------
var myBBCodeSettings = {
	// previewParserPath:	'', // path to your BBCode parser
	markupSet: [
		{name:'Bold', key:'B', openWith:'[b]', closeWith:'[/b]'},
		{name:'Italic', key:'I', openWith:'[i]', closeWith:'[/i]'},
		{name:'Underline', key:'U', openWith:'[u]', closeWith:'[/u]'},
		{name:'Strikethrough', openWith:'[s]', closeWith:'[/s]'},
		{name:'Font Size', openWith:'[size=[![Font size]!]]', closeWith:'[/size]',
		dropMenu :[
			{name:'<span style="line-height:16px;font-size:120%">Big</span>', openWith:'[size=120%]', closeWith:'[/size]' },
			{name:'<span style="line-height:16px;font-size:100%">Normal</span>', openWith:'[size=100%]', closeWith:'[/size]' },
			{name:'<span style="line-height:16px;font-size:80%">Small</span>', openWith:'[size=80%]', closeWith:'[/size]' }
		]},
		{	name:'Font Color', 
			className:'colors', 
			openWith:'[color=[![Font Color]!]]', 
			closeWith:'[/color]', 
				dropMenu: [
					{name:'Yellow',	openWith:'[color=yellow]', 	closeWith:'[/color]', className:'col1-1' },
					{name:'Orange',	openWith:'[color=orange]', 	closeWith:'[/color]', className:'col1-2' },
					{name:'Red', 	openWith:'[color=red]', 	closeWith:'[/color]', className:'col1-3' },
					
					{name:'Blue', 	openWith:'[color=blue]', 	closeWith:'[/color]', className:'col2-1' },
					{name:'Purple', openWith:'[color=purple]', 	closeWith:'[/color]', className:'col2-2' },
					{name:'Green', 	openWith:'[color=green]', 	closeWith:'[/color]', className:'col2-3' },
					
					{name:'White', 	openWith:'[color=white]', 	closeWith:'[/color]', className:'col3-1' },
					{name:'Gray', 	openWith:'[color=gray]', 	closeWith:'[/color]', className:'col3-2' },
					{name:'Black',	openWith:'[color=black]', 	closeWith:'[/color]', className:'col3-3' }
				]
		},
		{	name:'Font Background Color', 
			className:'bgcolors', 
			openWith:'[bgcolor=[![Font Background Color]!]]', 
			closeWith:'[/bgcolor]', 
				dropMenu: [
					{name:'Yellow',	openWith:'[bgcolor=yellow]', 	closeWith:'[/bgcolor]', className:'col1-1' },
					{name:'Orange',	openWith:'[bgcolor=orange]', 	closeWith:'[/bgcolor]', className:'col1-2' },
					{name:'Red', 	openWith:'[bgcolor=red]', 	closeWith:'[/bgcolor]', className:'col1-3' },
					
					{name:'Blue', 	openWith:'[bgcolor=blue]', 	closeWith:'[/bgcolor]', className:'col2-1' },
					{name:'Purple', openWith:'[bgcolor=purple]', 	closeWith:'[/bgcolor]', className:'col2-2' },
					{name:'Green', 	openWith:'[bgcolor=green]', 	closeWith:'[/bgcolor]', className:'col2-3' },
					
					{name:'White', 	openWith:'[bgcolor=white]', 	closeWith:'[/bgcolor]', className:'col3-1' },
					{name:'Gray', 	openWith:'[bgcolor=gray]', 	closeWith:'[/bgcolor]', className:'col3-2' },
					{name:'Black',	openWith:'[bgcolor=black]', 	closeWith:'[/bgcolor]', className:'col3-3' }
				]
		},
		{separator:' ' },
		{name:'Picture', key:'P', replaceWith:'[img][![Image url]!][/img]'},
		{name:'Link', key:'L', openWith:'[url=[![Link url]!]]', closeWith:'[/url]', placeHolder:'Your text to link here...'},
		{name:'YouTube Video', openWith:'[youtube]', closeWith:'[/youtube]'},
		{separator:' ' },
		{name:'Bulleted list', openWith:'[list]\n', closeWith:'\n[/list]'},
		{name:'Numeric list', openWith:'[list=[![Starting number]!]]\n', closeWith:'\n[/list]'}, 
		{name:'List item', openWith:'[*] '},
		{separator:' ' },
		{name:'Quotes', openWith:'[quote]', closeWith:'[/quote]'},
		{name:'Code', openWith:'[code]', closeWith:'[/code]'}, 
		{separator:' ' },
		{name:'Clean', replaceWith:function(markitup) { return markitup.selection.replace(/\[(.*?)\]/g, "") } },
		// {name:'Preview', className:"preview", call:'preview' },
		// {name:'Help', className:"help", call:'preview' }
	]
};
/*
 * jQuery.upload v1.0.2
 *
 * Copyright (c) 2010 lagos
 * Dual licensed under the MIT and GPL licenses.
 *
 * http://lagoscript.org
 */
(function ($) {

   var uuid = 0;

   $.fn.upload = function (url, data, callback) {
      var $this = this,
          inputs,
          iframeName = 'jquery_upload' + ++uuid,
          iframe = $('<iframe name="' + iframeName + '" style="position:absolute;top:-9999px" />').appendTo('body'),
          form = '<form target="' + iframeName + '" method="post" action="' + url + '" enctype="multipart/form-data" accept-charset="UTF-8"></form>';

      if ($.isFunction(data)) {
         callback = data;
         data = {};
      }

      form = $this.wrap(form).parent('form');
      inputs = createInputs(data);
      inputs = inputs ? $(inputs).appendTo(form) : null;

      form.submit(function () {
         iframe.on('load', function () {
            var res;
            try {
               res = $.parseJSON(iframe.contents().text());
            }
            catch (e) {
               alert('上传文件失败，请换用其他浏览器上传文件。错误信息:' + e.message);
               submitBug({msg: e.message, data: iframe.contents().text()});
            }

            //form.remove();
            if (inputs) {
               inputs.remove();
            }
            $this.unwrap();

            //setTimeout(function() {
            iframe.remove();
            if (callback) {
               callback.call(self, res);
            }
            //}, 0);
         });
      }).submit();

      //return this;
   };

   function createInputs(data) {
      return $.map(param(data), function (param) {
         return '<input type="hidden" name="' + param.name + '" value="' + param.value + '"/>';
      }).join('');
   }

   function param(data) {
      if ($.isArray(data)) {
         return data;
      }
      var params = [];

      function add(name, value) {
         params.push({name: name, value: value});
      }

      if (typeof data === 'object') {
         $.each(data, function (name) {
            if ($.isArray(this)) {
               $.each(this, function () {
                  add(name, this);
               });
            } else {
               add(name, $.isFunction(this) ? this() : this);
            }
         });
      } else if (typeof data === 'string') {
         $.each(data.split('&'), function () {
            var param = $.map(this.split('='), function (v) {
               return decodeURIComponent(v.replace(/\+/g, ' '));
            });

            add(param[0], param[1]);
         });
      }

      return params;
   }
})(jQuery);
function submitBug(msg) {
   $.post('/api/bug?action=post', msg);
}

var session = {
   set: function (key, value) {
      if (value == null) {
         sessionStorage.removeItem(key);
      }
      else {
         sessionStorage.setItem(key, JSON.stringify(value));
      }
   },
   get: function (key) {
      var value = sessionStorage.getItem(key);
      if (value == null) {
         return null;
      }
      else {
         return JSON.parse(value);
      }
   },
   remove: function (key) {
      sessionStorage.removeItem(key);
   },
   clear: function () {
      sessionStorage.clear();
   }
};

var cache = {
   set: function (key, value) {
      if (value == null) {
         localStorage.removeItem(key);
      }
      else {
         localStorage.setItem(key, JSON.stringify(value));
      }
   },
   get: function (key) {
      var value = localStorage.getItem(key);
      if (value == null) {
         return null;
      }
      else {
         return JSON.parse(value);
      }
   },
   remove: function (key) {
      localStorage.removeItem(key);
   },
   clear: function () {
      localStorage.clear();
   }
};

var validateResponse = function (data) {
   if (!data) {
      alert('服务器没有响应');
      return false;
   }
   else {
      if (data.error) {
         alert(data.error);
         return false;
      }
   }
   return true;
};

$(document).ready(function () {
   var loadSession = function (data) {
      if (data.sessionID) {
         cache.set('sessionID', data.sessionID);
         cache.set('uid', data.uid);
         if (data.uid > 0) {
            cache.set('username', data.username);
            cache.set('role', data.role);
         }
         if (data.pm > 0) {
            session.set('pm', data.pm);
         }
         return data.uid;
      }
      else {
         if (data.error) {
            alert(data.error);
         }
         else {
            alert('对话加载失败');
         }
         return 0;
      }
   };

   var showPage = function (uid) {
      // image slider
      $('.image_slider').imageSlider();

      // ajax_load container
      $('.ajax_load').each(function () {
         var container = $(this);
         var uri = container.attr('data-ajax');
         if (uri) {
            $.getJSON(uri, function (data) {
               for (var prop in data)
               {
                  $('.ajax_' + prop, container).html(data[prop]);
               }
            });
         }
      });

      // menu
      $('nav#page_navbar ul.sf-menu').superfish();

      // navbar toggler
      var hasToggler = false, toggler = $('div.nav_mobile > a.icon-menu'), navbar = $('nav#page_navbar');
      var navbarToggler = function ()
      {
         if (navbar.css('display') === 'none')
         {
            if (!hasToggler)
            {
               toggler.on('click', function (e) {
                  e.preventDefault();
                  navbar.toggleClass('hidden');
               });
               hasToggler = true;
            }
         }
         else
         {
            if (hasToggler)
            {
               toggler.off('click');
               hasToggler = false;
            }
            if (!navbar.hasClass('hidden'))
            {
               navbar.addClass('hidden');
            }
         }
      }

      navbarToggler();
      $(window).resize(navbarToggler);

      $('div.nav_mobile a.icon-left-big').click(function (e) {
         e.preventDefault();
         window.history.back();
      });

      $('div.nav_mobile a.icon-right-big').click(function (e) {
         e.preventDefault();
         window.history.forward();
      });

      $('div.nav_mobile a.icon-cw').click(function (e) {
         e.preventDefault();
         location.reload();
      });

      // responsive table header
      var addTableHeader = function (table) {
         var headers = new Array();
         $('th', table).each(function () {
            headers.push(this.innerHTML);
         });
         if (headers.length > 0) {
            $('tbody tr', table).each(function () {
               var tds = $('td', this);
               for (i = 0; i < tds.length; i++) {
                  $(tds.get(i)).attr('data-header', headers[i]);
               }
            });
         }
      };
      $('table').each(function () {
         addTableHeader(this);
      });

      var showGuestPage = function () {
         $('.v_guest').show();
         $('[class*="v_user"]').remove();
      };
      var showUserPage = function () {
         $('.v_guest').remove();
         $('.v_user').show();
         $('[class*="v_user_"]').hide()
         $('.v_user_' + uid).show();

         var role = cache.get('role');
         if (role && role instanceof Array)
         {
            for (var i = 0; i < role.length; ++i)
            {
               $('.v_user_' + role[i]).show();
            }
         }
         var username = cache.get('username');
         if (username)
         {
            $('#username').text(username);
         }

         // check pm every 5 minutes
         var pmCheckTime = cache.get('pmCheckTime');
         if( !pmCheckTime || Date.now() > pmCheckTime + 300000)
         {
            $.get('/api/message/new', function (data) {
               if (data.count && data.count > 0) {
                  $("a#pm").append('<span style="color:red;"> (' + data.count + ')<span>');
               }
            });
            cache.set('pmCheckTime', Date.now());
         }

         // node page
         var editorForm = $('#bbcode_editor');
         if (editorForm.length)
         {
            var editorBody = $('#bbcode_editor textarea'),
                editorTitle = $('#bbcode_editor .node_title'),
                fileTable = $('#file_list'),
                fileTableBody = $('tbody', fileTable);

            editorBody.markItUp(myBBCodeSettings);

            // button actions
            $('button.report').click(function (e) {
               var reason = prompt("请管理员审查本贴，原因如下 (目前只支持举报QQ骗子和办假学位证)：", "本贴疑似骗子贴/办证贴");
               if (reason) {
                  $.ajax({
                     type: "POST",
                     url: '/api/report',
                     data: $(this).attr('data-action') + "&reason=" + encodeURIComponent(reason),
                     success: function (data) {
                        if (data && "error" in data) {
                           alert("举报失败: " + data.error + " :(");
                        } else {
                           alert("举报成功，谢谢您为维护良好信息交流环境做出的努力！");
                        }
                     },
                     error: function() {
                        alert("系统错误，举报失败 :(");
                     }
                  });
               }
            });

            $('button.delete').click(function (e) {
               var answer = confirm("此操作不可恢复，您确认要删除该内容吗？");
               if (answer)
               {
                  window.location = $(this).attr('data-action');
               }
            });

            $('button.reply').click(function (e) {
               editorForm.attr('action', $(this).attr('data-action'));
               editorTitle.hide();
               fileTable.hide();
               fileTableBody.children().remove();

               editorBody.val('').focus();

               window.scrollTo(0, editorForm.offset().top);
            });

            $('button.quote').click(function (e) {
               editorForm.attr('action', $(this).attr('data-action'));
               editorTitle.hide();
               fileTable.hide();
               fileTableBody.children().remove();
               var data = $($(this).attr('data-raw'));
               var author = data.find('pre.username').html(),
                   quoteText = '[quote="' + author + '"]' + data.find('pre.body').html() + '[/quote]\n';
               editorBody.val('').focus();
               $.markItUp({
                  replaceWith: quoteText
               });

               window.scrollTo(0, editorForm.offset().top);
            });

            var updateFileTable = function (files) {
               for (var i = 0; i < files.length; i++) {
                  var fid = files[i].fid ? files[i].fid : files[i].path,
                      imageExt = new Array('jpeg', 'gif', 'png'),
                      fileExt = files[i].path.split('.').pop(),
                      bbcode;

                  if (imageExt.indexOf(fileExt) >= 0) {
                     bbcode = '[img]' + files[i].path + '[/img]';
                  }
                  else {
                     bbcode = '[file="' + files[i].path + '"]' + files[i].name + '[/file]';
                  }

                  var row = '<tr><td><input type="text" name="files[' + fid + '][name]" value="' + files[i].name + '"><input type="hidden" name="files[' + fid + '][path]" value="' + files[i].path + '"></td>' +
                      '<td>' + bbcode + '</td><td><button type="button" class="file_delete">删除</button></td></tr>';
                  fileTableBody.append(row);
               }
               addTableHeader(fileTable);
            }

            $('button.edit').click(function (e) {
               var action = $(this).attr('data-action');
               editorForm.attr('action', action);
               if (action.split('/')[1] == 'node')
               {
                  editorTitle.show();
               }
               else
               {
                  editorTitle.hide();
               }

               fileTableBody.children().remove();
               var data = $($(this).attr('data-raw'));
               var files = $.parseJSON(data.find('pre.files').html()); // may return null

               if (files instanceof Array && files.length > 0)
               {
                  updateFileTable(files);
                  fileTable.show();
               }
               else
               {
                  fileTable.hide();
               }

               editorBody.val($($(this).attr('data-raw')).find('pre.body').html()).focus();

               window.scrollTo(0, editorForm.offset().top);
            });

            $('button.create_node').click(function (e) {
               editorForm.attr('action', $(this).attr('data-action'));
               editorTitle.show();
               fileTable.hide();
               fileTableBody.children().remove();

               editorBody.val('');
               $('input', editorTitle).val('').focus();

               window.scrollTo(0, editorForm.offset().top);
            });

            $('#file_upload').click(function (e) {
               var file = $('#file_select');
               if (file.val().length > 0)
               {
                  var totalSize = 0, files = file.get(0).files;
                  if (files)
                  {
                     // check count
                     if (files.length > 5)
                     {
                        alert('一次只能上传 5 张图片');
                        return;
                     }
                     // check total file size
                     for (i = 0; i < files.length; i++)
                     {
                        totalSize += files[i].size;
                        if (totalSize > 5242880)
                        {
                           alert('一次只能上传图片的总大小为 5 MB，您只能选择前 ' + i + ' 张图片上传');
                           return;
                        }
                     }
                  }
                  var button = $(this);
                  button.prepend('<span class="spinner"></span>');
                  button.prop("disabled", true);

                  file.upload('/api/file?action=post', function (res) {
                     file.val('');
                     button.prop("disabled", false);
                     button.find('span.spinner').remove();
                     if (res) {
                        try {
                           if (res.error && res.error.length > 0) {
                              var msg = '';
                              if (Object.prototype.toString.call(res.error) === '[object Array]') {
                                 for (var i = 0; i < res.error.length; i++) {
                                    msg = msg + res.error[i].name + ' : ' + res.error[i].error + "\n";
                                 }
                              }
                              else // string
                              {
                                 msg = res.error;
                              }
                              alert(msg);
                           }

                           if (res.saved && res.saved.length > 0) {
                              updateFileTable(res.saved);
                              fileTable.show();
                           }
                        }
                        catch (e)
                        {
                           alert('上传文件失败，请换用其他浏览器上传文件。错误信息:' + e.message);
                           submitBug({msg: e.message, data: res});
                        }
                     }
                  });
               }
            });

            $('#file_clear').click(function () {
               $('#file_select').val('');
            });

            fileTable.on("click", ".file_delete", function (e) {
               //$(".file_delete", fileTable).live("click", function(e) {
               var row = this.parentNode.parentNode;
               var table = row.parentNode.parentNode;
               table.deleteRow(row.rowIndex);
               if (table.rows.length <= 1)
               {
                  fileTable.hide();
               }
            });

            $('#bbcode_editor button:submit').click(function (e) {
               if ($('#file_select').val())
               {
                  alert('请先上传或清空选中的文件');
                  e.preventDefault();
               }
            });

            $('button.bookmark').click(function () {
               var button = $(this);
               $.get(button.attr('data-action'), function () {
                  alert('帖子成功加入到您的收藏夹中！');
               });
            });
         }

         // user bookmark page
         var nids = [];
         $('button.edit_bookmark').click(function () {
            var button = $(this);
            if (button.text() == '编辑') {
               button.text('保存');
               $('button.delete_bookmark').show();
            }
            else
            {
               if (nids) {
                  button.prop("disabled", true);
                  $.get('/api/bookmark/' + nids.join() + '?action=delete', function () {
                     button.text('编辑');
                     $('button.delete_bookmark').hide();
                     nids = [];
                     button.prop("disabled", false);
                  });
               }
               else {
                  button.text('编辑');
                  $('button.delete_bookmark').hide();
               }
            }

         });

         $('button.delete_bookmark').click(function () {
            button = $(this);
            nids.push(button.attr('data-nid'));
            button.parent().remove();
         });
      }

      // scroll to top
      var $window = $(window),
          goTopButton = $('#goTop'),
          goTopButtonIsVisible = false;

      var showGoTop = function () {
         goTopButtonIsVisible = true;
         goTopButton.stop().animate({
            bottom: '50px'
         }, 300);
      };
      var hideGoTop = function () {
         goTopButtonIsVisible = false;
         goTopButton.stop().animate({
            bottom: '-100px'
         }, 300);
      };

      var toggleGoTop = function () {
         if ($window.scrollTop() > 300) {
            if (!goTopButtonIsVisible) {
               showGoTop();
            }
         }
         else {
            if (goTopButtonIsVisible) {
               hideGoTop();
            }
         }
      };

      toggleGoTop();
      $window.scroll(toggleGoTop);
      goTopButton.click(function (e) {
         $('html, body').stop().animate({
            scrollTop: 0
         }, 300, hideGoTop);
         e.preventDefault();
      });

      // popup windows
      var popupForms = {
         login: {
            html: '<form accept-charset="UTF-8" autocomplete="on" method="post">'
                + '<fieldset><label class="label">注册邮箱</label><input name="email" type="email" required autofocus></fieldset>'
                + '<fieldset><label class="label">密码</label><input name="password" type="password" required></fieldset>'
                + '<fieldset><button type="submit">登录</button></fieldset></form>',
            handler: '/api/authentication',
            success: function (data) {
               if (validateResponse(data)) {
                  loadSession(data);
                  return '<script>location.reload();</script>';
               }
            }
         },
         changePassword: {
            html: '<form accept-charset="UTF-8" autocomplete="off" method="post">'
                + '<fieldset><label class="label oldpassword">旧密码</label><input name="password_old" type="password" required autofocus></fieldset>'
                + '<fieldset><label class="label">新密码</label><input name="password" type="password" required></fieldset>'
                + '<fieldset><label class="label">确认新密码</label><input name="password2" type="password" required></fieldset>'
                + '<fieldset><button type="submit">更改密码</button></fieldset></form>',
            handler: '/api/user/[uid]?action=put',
            vars: {uid: cache.get('uid')},
            success: function (data) {
               if (validateResponse(data)) {
                  return '密码更改成功。';
               }
            }
         },
         sendPM: {
            html: '<form accept-charset="UTF-8" autocomplete="off" method="post">'
                + '<fieldset><label class="label">收信人</label><a href="/app/user/profile/[uid]">[username]</a><input name="toUID" type="hidden" value="[uid]"></fieldset>'
                + '<fieldset><label class="label">短信正文</label><textarea name="body" required autofocus></textarea></fieldset>'
                + '<fieldset><button type="submit">发送短信</button></fieldset></form>',
            handler: '/api/message',
            success: function (data) {
               if (validateResponse(data)) {
                  return '短信发送成功。';
               }
            }
         }
      };

      var popupbox = $('div#popupbox'),
          messagebox = $('div#messagebox'),
          overlay = $('<div id="overlay"></div>'),
          popupVisible = false;

      overlay.click(function () {
         overlay.detach();
         popupbox.hide()
         popupVisible = false;
      });

      var centerPopupBox = function () {
         popupbox.css('left', $window.scrollLeft() + Math.max(($window.width() - popupbox.outerWidth()) / 2, 0));
         popupbox.css('top', $window.scrollTop() + Math.max(($window.height() - popupbox.outerHeight()) / 2, 0));
      };

      $('a.popup').click(function (e) {
         e.preventDefault();
         var link = $(this);
         var key = link.attr('href').substr(1);

         if (key in popupForms) {
            // add overlay
            if (!jQuery.contains(document, overlay[0])) {
               overlay.insertBefore(popupbox);
            }

            var html = popupForms[key].html;
            var handler = popupForms[key].handler;

            // apply varibles
            var vars = {};
            if ('vars' in popupForms[key]) {
               vars = $.extend(vars, popupForms[key].vars);
            }
            if (link.attr('data-vars')) {
               vars = $.extend(vars, JSON.parse(link.attr('data-vars')));
            }
            if (!$.isEmptyObject(vars)) {
               for (var k in vars) {
                  html = html.replace(new RegExp('\\[' + k + '\\]', 'g'), String(vars[k]));
                  handler = handler.replace(new RegExp('\\[' + k + '\\]', 'g'), String(vars[k]));
               }
            }

            // show popup
            popupbox.html(html).show(0, centerPopupBox);
            popupVisible = true;

            $(window).resize(function () {
               if (popupVisible) {
                  centerPopupBox();
               }
            });

            var form = $('form', popupbox);
            form.submit(function (e) {
               e.preventDefault();
               if (handler) {
                  $.ajax({
                     method: "POST",
                     url: handler,
                     data: form.serialize(),
                     dataType: 'json',
                     success: function (data) {
                        var response = popupForms[key].success(data);
                        if (response) {
                           popupbox.html(response);
                        }
                     },
                     error: function () {
                        alert('错误：提交数据错误');
                     }
                  });
               }
               else
               {
                  alert('错误：无法提交数据');
               }
            });
         }
      });

      if (uid > 0) {
         showUserPage();
      }
      else
      {
         showGuestPage();
      }
   };

   // get uid and urole
   var sessionID = $.cookie('LZXSID');
   if (sessionID == null) {
      // boot as guest
      showPage(0);
   }
   else {
      // cache and session expired, reload client side cache.
      if (sessionID != cache.get('sessionID')) {
         // clear client cache and session
         cache.clear();
         session.clear();
         // boot as guest
         // showPage(0);
         $.get('/api/authentication/' + sessionID, function (data) {
            loadSession(data);
            showPage(cache.get('uid'));
         });
      }
      else {
         showPage(cache.get('uid'));
      }
   }
});
