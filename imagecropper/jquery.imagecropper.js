// simple image slider
// developped by ikki

(function($) {
  "use strict";

  var serialize = function(obj) {
    var str = [];
    for (var p in obj) {
      if (obj.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      }
    }
    return str.join("&");
  }

  var post = function(url, data) {
    var newName = 'John Smith',
      xhr = new XMLHttpRequest();

    xhr.open('POST', encodeURI(url), true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send(serialize(data));
  }

  $.fn.imageCropper = function(options) {

    // options.
    var settings = $.extend({
      defaultImage: null,
      windowHeight: 120,
      windowWidth: 120,
      uploadURL: null,
      uploadName: 'base64Image'
    }, options);

    var cropper = $(this),
      fgImage = null,
      bgImage = null,
      origImage = document.createElement("IMG"),
      tools = $('<div class="tools"><button class="zoomin"><span class="icon-resize-full"></span></button><button class="zoomout"><span class="icon-resize-small"></span></button><button class="crop"><span class="icon-ok"></span></button><button class="reset"><span class="icon-cancel"></span></button></div>');

    // move image
    function move(e) {
      e.preventDefault(); // disable selection
      var event = (e.originalEvent.touches || e.originalEvent.changedTouches) ? e.originalEvent.touches[0] || e.originalEvent.changedTouches[0] : e;

      var top = fgImage.offset().top,
        left = fgImage.offset().left,
        cursor_y = event.pageY,
        cursor_x = event.pageX,
        max_y = cropper.offset().top,
        max_x = cropper.offset().left,
        min_y = max_y + settings.windowHeight - fgImage.innerHeight(),
        min_x = max_x + settings.windowWidth - fgImage.innerWidth();

      fgImage.on({
        'dragstart mousemove touchmove': function(e) {
          e.stopImmediatePropagation()
          e.preventDefault();

          var event = (e.originalEvent.touches || e.originalEvent.changedTouches) ? e.originalEvent.touches[0] || e.originalEvent.changedTouches[0] : e;

          var imgTop = event.pageY - cursor_y + top,
            imgLeft = event.pageX - cursor_x + left;

          // boundary checking
          if (imgTop < min_y) {
            imgTop = min_y;
          } else if (imgTop > max_y) {
            imgTop = max_y;
          }
          // boundary checking
          if (imgLeft < min_x) {
            imgLeft = min_x;
          } else if (imgLeft > max_x) {
            imgLeft = max_x;
          }

          fgImage.offset({
            top: imgTop,
            left: imgLeft
          });
          bgImage.offset({
            top: imgTop,
            left: imgLeft
          });
        },
        'dragend mouseup touchend': function() {
          fgImage.off('mousemove touchmove');
        }
      });
    };

    // load image
    function load(e) {
      if (this.height < settings.windowHeight || this.width < settings.windowWidth) {
        alert("图片尺寸太小，最小图片尺寸为 " + settings.windowWidth + "x" + settings.windowHeight + " 像素");
        return;
      }

      if (settings.windowHeight == this.height && settings.windowWidth == this.width) {
        // exact size, display image directly
        if (!bgImage) {
          bgImage = $('<img class="bg-image">').css('width', settings.windowWidth).css('height', settings.windowHeight).attr('src', this.src).prependTo(cropper);
        } else {
          bgImage.attr('src', this.src);
        }
        // upload to server
        if (settings.uploadURL) {
          var image = {};
          image[settings.uploadName] = this.src;
          post(settings.uploadURL, image);
        }
      } else {
        // not exact size, need to zoom and crop
        // image size adjust ratio
        var ratio = Math.max(settings.windowHeight / this.height, settings.windowWidth / this.width);
        if (ratio > 0.9) {
          // not adjusting
          ratio = 1
        } else {
          // adjust to 1.1 times window size
          ratio = ratio * 1.1;
        }

        var imgHeight = this.height * ratio,
          imgWidth = this.width * ratio,
          imgTop = cropper.offset().top + (settings.windowHeight - imgHeight) / 2,
          imgLeft = cropper.offset().left + (settings.windowWdith - imgWidth) / 2;

        // add the image
        if (!bgImage) {
          bgImage = $('<img class="bg-image">').attr('src', this.src).css('opacity', 0.2).prependTo(cropper);
        } else {
          bgImage.attr('src', this.src).css('opacity', 0.2);
        }

        cropper.append('<div class="crop-window"><img class="fg-image" src="' + this.src + '"></div>');
        fgImage = cropper.find('img.fg-image');

        // set image size and position
        fgImage.css('height', imgHeight).css('width', imgWidth);
        bgImage.css('height', imgHeight).css('width', imgWidth);

        fgImage.offset({
          top: imgTop,
          left: imgLeft
        });
        bgImage.offset({
          top: imgTop,
          left: imgLeft
        });
        fgImage.on('mousedown touchstart', move);

        // add tool bar
        tools.appendTo(cropper).css('position', 'absolute').offset({
          top: cropper.offset().top + settings.windowHeight,
          left: cropper.offset().left
        });
      }
    }

    // zoom image
    function zoom(ratio) {
      if (!fgImage) {
        return;
      }
      var height = fgImage.innerHeight(),
        width = fgImage.innerWidth(),
        newHeight = height * ratio,
        newWidth = width * ratio;

      if (ratio < 1) {
        // boundary checking
        if (newHeight < settings.windowHeight) {
          newHeight = settings.windowHeight;
          ratio = newHeight / height;
          newWidth = width * ratio;
        }
        if (newWidth < settings.windowWidth) {
          newWidth = settings.windowWidth;
          ratio = newWidth / width;
          newHeight = height * ratio;
        }
      }

      var windowTop = cropper.offset().top,
        windowLeft = cropper.offset().left,
        center_y = windowTop + cropper.innerHeight() / 2,
        center_x = windowLeft + cropper.innerWidth() / 2,
        imgTop = center_y + (fgImage.offset().top - center_y) * ratio,
        imgLeft = center_x + (fgImage.offset().left - center_x) * ratio;

      if (ratio < 1) {
        // boundary checking
        if (imgTop > windowTop) {
          imgTop = windowTop;
        }
        if (imgLeft > windowLeft) {
          imgLeft = windowLeft;
        }
      }

      fgImage.css('height', newHeight).css('width', newWidth);
      fgImage.offset({
        top: imgTop,
        left: imgLeft
      });

      bgImage.css('height', newHeight).css('width', newWidth);
      bgImage.offset({
        top: imgTop,
        left: imgLeft
      });
    }

    // crop image
    function crop() {
      if (!fgImage) {
        return;
      }
      // crop
      var canvas = document.createElement('canvas'),
        ratio = origImage.width / fgImage.innerWidth(),
        orig_x = (cropper.offset().left - fgImage.offset().left) * ratio,
        orig_y = (cropper.offset().top - fgImage.offset().top) * ratio;

      canvas.width = settings.windowWidth * ratio;
      canvas.height = settings.windowHeight * ratio;
      canvas.getContext('2d').drawImage(origImage, orig_x, orig_y, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);

      // resize
      var finalImage = document.createElement('canvas');
      finalImage.width = settings.windowWidth;
      finalImage.height = settings.windowHeight;

      // finalImage.getContext('2d').drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, settings.windowWidth, settings.windowHeight);
      window.pica.resizeCanvas(canvas, finalImage, function(err) {
        if (err) {
          alert("图片缩放失败: " + err);
          return;
        }
        // remove cropper element
        origImage = null;
        origImage = document.createElement("IMG")
        var img_data = finalImage.toDataURL('image/png');
        bgImage.css('width', settings.windowWidth).css('height', settings.windowHeight).css('opacity', 1).attr('src', img_data).offset({
          top: cropper.offset().top,
          left: cropper.offset().left
        });
        cropper.find('div.crop-window').remove();
        tools.detach();

        // upload to server
        if (settings.uploadURL) {
          var image = {};
          image[settings.uploadName] = img_data;
          post(settings.uploadURL, image);
        }
      });
    }

    function init() {
      if (settings.defaultImage) {
        bgImage = $('<img class="bg-image">').attr('src', settings.defaultImage).css('width', settings.windowWidth).css('height', settings.windowHeight).prependTo(cropper);
      }
      $('<input type="file" name="image">').appendTo(cropper).on('change', function(e) {
        var file = e.originalEvent.target.files[0];

        var reader = new FileReader();

        reader.onload = function(e) {
          // load the image
          origImage.onload = load;
          origImage.src = e.target.result;
        };

        reader.readAsDataURL(file);
      });
    }

    // main function starts here
    cropper.css('width', settings.windowWidth).css('height', settings.windowHeight);
    init();

    // bind tool actions
    tools.find('.zoomin').on('click', function(e) {
      zoom(1.1);
    });
    tools.find('.zoomout').on('click', function(e) {
      zoom(0.9);
    });
    tools.find('.crop').on('click', function(e) {
      crop();
    });
    tools.find('.reset').on('click', function(e) {
      tools.detach();
      cropper.empty();
      init();
    });

    // not chaining
    // return this;
  };
}(jQuery));
