/*
 * jQuery.upload v1.0.2
 *
 * Copyright (c) 2010 lagos
 * Dual licensed under the MIT and GPL licenses.
 *
 * http://lagoscript.org
 */
(function($) {

  var uuid = 0;

  $.fn.upload = function(url, data, callback) {
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

    form.submit(function() {
      iframe.on('load', function() {
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

        setTimeout(function() {
          iframe.remove();
          if (callback) {
            callback.call(self, res);
          }
        }, 0);
      });
    }).submit();

    //return this;
  };

  function createInputs(data) {
    return $.map(param(data), function(param) {
      return $(document.createElement('input')).attr('type', 'hidden').attr('name', param.name).attr('value', param.value);
    });
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
      $.each(data, function(name) {
        if ($.isArray(this)) {
          $.each(this, function() {
            add(name, this);
          });
        }
        else {
          add(name, $.isFunction(this) ? this() : this);
        }
      });
    }
    else if (typeof data === 'string') {
      $.each(data.split('&'), function() {
        var param = $.map(this.split('='), function(v) {
          return decodeURIComponent(v.replace(/\+/g, ' '));
        });

        add(param[0], param[1]);
      });
    }

    return params;
  }
})(jQuery);
