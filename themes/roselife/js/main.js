$.cookie.defaults = {
   expires: 365,
   path: '/',
   domain: document.domain.split('.').slice(-2).join('.')
};

$(document).ready(function() {
   // get uid and urole
   var uid = $.cookie('uid');

   uid = (!uid) ? 0 : parseInt(uid, 10);
   if (uid < 0)
   {
      uid = 0;
   }

   if (uid > 0) {
      $('.v_guest').remove();
      $('.v_user').show();
      $('.v_user' + uid).show();

      var urole = $.cookie('urole');
      if (urole)
      {
         var role = urole.split('|');
         for (var i = 0; i < role.length; ++i)
         {
            $('.v_user_' + role[i]).show();
         }
      }
   }
   else {
      $('.v_guest').show();
      $('[class*="v_user"]').remove();
   }

   // image slider
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

   // navbar toggler
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

   // for logged-in user
   if (uid > 0)
   {
      var BBEditor = $('.bbcode_editor textarea');
      var titleEditor = $('#edit-title');
      var editorDiv = $('#editor-div');
      var editorForm = $('#editor-form');
      var fileTable = $('#ajax-file-list');
      var fileTableBody = $('tbody', fileTable);
      var TextEditor = $('#TextEditor');

      var pmCount = $.cookie('pmCount');
      if (pmCount > 0)
      {
         $("a#pm").append('<span style="color:red;"> (' + pmCount + ') <span>');
      }

      BBEditor.markItUp(myBBCodeSettings);
   }
});