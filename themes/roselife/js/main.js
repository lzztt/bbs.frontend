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

window.addEventListener('load', function () {
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
           fetch(uri)
             .then((response) => response.json())
             .then((data) => {
               for (var prop in data) {
                 $(".ajax_" + prop, container).html(data[prop]);
               }
             });
         }
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
      }

      $(".attach_images > figure").click(function (e) {
        e.preventDefault();
        if ($(window).width() < 600) {
          return;
        }

        var figure = this.cloneNode(true);
        figure.style.margin = 0;
        window.app.popup(figure);
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
