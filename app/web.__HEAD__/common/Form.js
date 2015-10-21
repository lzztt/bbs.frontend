'use strict';

var Form = (function() {
  var autoFocus = function(form) {
    $('input:first', form).focus(); // first element autofocus
  };

  var Input = {
    view: function(ctrl, data) {
      return m('fieldset', {config: data.config}, [
        m('label', {for : data.name}, data.label),
        m('input', {type: data.type, name: data.name, value: data.value(), onchange: function() {
            data.value(this.value);
            m.redraw.strategy("none"); // do not redraw view
          }})
      ]);
    }
  };

  var Captcha = {
    controller: function() {
      this.visible = false;
      var captcha = this;
      this.config = function(el) {
        $(el).hide().prev(':has(input)').find('input:first').focus(function() {
          if (!captcha.visible) {
            captcha.visible = true;
            var getCaptcha = function() {
              return '/api/captcha/' + Math.random().toString().slice(2);
            };
            $(el).show().append('<div class="captcha"><img alt="图形验证未能正确显示，请刷新" src="' + getCaptcha() + '"><br><a onclick="this.previousSibling.src=getCaptcha()">看不清，换一张</a></div>');
          }
        });
      };
    },
    view: function(ctrl, data) {
      return m.component(Input, {type: 'text', label: '下边图片的内容是什么？', name: 'captcha', value: data.value, config: ctrl.config});
    }
  };

  return {
    Input: Input,
    Captcha: Captcha,
    autoFocus: autoFocus,
  };
})();

