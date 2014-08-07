// simple image slider
// developped by ikki

(function($) {
   $.fn.imageSlider = function(options) {

      // options.
      var settings = $.extend({
         fadeTime: 1000,
         switchTime: 5000
      }, options);

      var images = new Array();
      $('ul li', this).each(function() {
         images.push({
            img: $(this).attr('data-img'),
            title: $(this).html(),
            url: $(this).attr('data-href')
         });
      });

      if (images.length > 0)
      {
         var image_total = images.length;
         var current = 0;
         var canvas = $(this);
         var image = $('<a></a>').prependTo(canvas);
         var bgSwitch = function() {
            // set backgroud
            canvas.css('background-image', "url('" + images[current].img + "')");

            // move to next image
            current = (current != (image_total - 1) ? current + 1 : 0);

            image.fadeOut(settings.fadeTime, function() {
               image.css('background-image', "url('" + images[current].img + "')");
               image.fadeIn(settings.fadeTime);
            });
         };

         bgSlider = setInterval(bgSwitch, settings.switchTime);
         // display first image
         image.css('background-image', "url('" + images[current].img + "')");
      }
   };
}(jQuery));