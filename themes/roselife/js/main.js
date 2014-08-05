var UROLE_GUEST = 'guest',
        UROLE_USER = 'user', // user, user<uid>
        UROLE_ADM = 'adm'; // adm, adm<aid>

$.cookie.defaults = {
   expires: 365,
   path: '/',
   domain: document.domain.split('.').slice(-2).join('.')
};

$(document).ready(function() {
   var urole = $.cookie('urole'),
           uid = $.cookie('uid');
   if (uid == 0 && urole !== UROLE_GUEST)
   {
      urole = UROLE_GUEST;
   }

   if (uid > 0) {
      $('.urole_guest').remove();
      $('.urole_user').show();
      $('.urole_user' + uid).show();

      if (urole.substr(0, 3) === UROLE_ADM)
      {
         if (urole === UROLE_ADM)
         {
            // show adm, adm<aid> elements
            $('[class^=urole_adm]').show();
         }
         else
         {
            // only show adm<aid> elements
            $('.urole_' + urole).show();
         }
      }
   }
   else {
      $('.urole_guest').show();
      $('.urole_user').remove();
   }

   //begin image_slider
   var current = 0;
   var bgSlider = null;
   var canvas = $('#image_slider');
   var image = $('#image');
   var bgStopped = false;
   var fadeTime = 2000;
   var switchTime = 5000;

   var images = $('#image_slider ul li');
   var image_total = images.length;

   var bgSwitch = function() {
      // set backgroud
      canvas.css('background-image', "url('" + $(images.get(current)).attr('data-img') + "')");

      // move to next
      current = (current != image_total ? current + 1 : 0);

      image.fadeOut(fadeTime, function() {
         image.css('background-image', "url('" + $(images.get(current)).attr('data-img') + "')");
         image.fadeIn(fadeTime);
      });

   };

   bgSlider = setInterval(bgSwitch, switchTime);
   bgSwitch();

   // end image_slider
});