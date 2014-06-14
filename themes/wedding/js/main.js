$(document).ready(function() {
   var images = new Array();
   var current = 0;
   var bgSlider = null;
   var canvas = $("#bg");
   var bgStopped = false;
   var fadeTime = 1000;
   var switchTime = 5000;

   var switchImage = function(id) {
      canvas.fadeOut(fadeTime, function() {
         canvas.css('background-image', "url('" + images[id] + "')");
         canvas.fadeIn(fadeTime);
      });
   };

   var bgSwitch = function() {
      current++;
      if (current >= images.length)
      {
         current = 0;
      }
      switchImage(current);
   };

   $('ul.nav li img').each(function(id) {
      images.push(this.src);
      this.onclick = function() {
         switchImage(id);
         current = id;
         if (!bgStopped && bgSlider !== null)
         {
            clearInterval(bgSlider);
            bgSlider = setInterval(bgSwitch, switchTime);
         }
      };
   });

   bgSlider = setInterval(bgSwitch, switchTime);

   $('button#bgswitch').click(function() {
      if (bgSlider === null)
      {
         bgSlider = setInterval(bgSwitch, switchTime);
         $(this).text("停止图片轮播");
         bgStopped = false;
      }
      else
      {
         clearInterval(bgSlider);
         bgSlider = null;
         $(this).text("开始图片轮播");
         bgStopped = true;
      }
   });

   $('div#content').hover(function() {
      if (!bgStopped)
      {
         clearInterval(bgSlider);
         bgSlider = null;
      }
   }, function() {
      if (!bgStopped)
      {
         bgSlider = setInterval(bgSwitch, switchTime);
      }
   })
});

