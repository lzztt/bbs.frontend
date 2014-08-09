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

   $('.image_slider').imageSlider();

   // ajax_load container
   $('.ajax_load').each(function() {
      var container = $(this);
      var uri = container.attr('data-ajax');
      if (uri) {
         $.getJSON(uri, function(data) {
            for (var prop in data)
            {
               $('.ajax_' + prop, container).html(data[prop]);
            }
         });
      }
   });

   // menu
   $('nav#page_navbar ul.sf-menu').superfish();

   // navbar
   var hasToggler = false, logo = $('a#logo'), navbar = $('nav#page_navbar');

   navbarToggler = function()
   {
      if (navbar.css('display') === 'none')
      {
         if (!hasToggler)
         {
            logo.on('click', function(e) {
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
            logo.off('click');
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


   // responsive table header
   $('table').each(function() {
      var headers = new Array();
      $('th', this).each(function() {
         headers.push(this.innerHTML);
      });
      if (headers.length > 0) {
         $('tbody tr', this).each(function() {
            var tds = $('td', this);
            for (i = 0; i < tds.length; i++) {
               $(tds.get(i)).attr('data-header', headers[i]);
            }
         });
      }
   });
});