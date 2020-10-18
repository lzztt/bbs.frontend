window.addEventListener("load", function () {
  var showPage = function (uid) {
    // image slider
    $(".image_slider").imageSlider();

    // ajax_load container
    $(".ajax_load").each(function () {
      var container = $(this);
      var uri = container.attr("data-ajax");
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

    var showGuestPage = function () {
      $(".v_guest").show();
      $('[class*="v_user"]').remove();
    };

    var showUserPage = function () {
      $(".v_guest").remove();
      $(".v_user").show();
      $('[class*="v_user_"]').hide();
      $(".v_user_" + uid).show();

      var role = cache.get("role");
      if (role && role instanceof Array) {
        for (var i = 0; i < role.length; ++i) {
          $(".v_user_" + role[i]).show();
        }
      }
      var username = cache.get("username");
      if (username) {
        $("#username").text(username);
      }
    };

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
    } else {
      showGuestPage();
    }
  };

  const cache = {
    get: (key) => {
      const value = localStorage.getItem(key);
      if (value == null) {
        return null;
      } else {
        return JSON.parse(value);
      }
    },
  };

  showPage(cache.get("uid"));
});
