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
      console.log('# Captcha.controller');

      var getCaptchaURI = function() {
        return '/api/captcha/' + Math.random().toString().slice(2);
      };

      var captcha = this;
      this.config = function(el, isInit) {
        console.log('Captcha.controller.config');
        $(el).hide();
        if (!isInit) {
          console.log('Captcha.controller.config: isInit=false');
          $(el).prev(':has(input)').find('input:first').focus(function() {
            console.log('captch:input:prev focused');
            if (!$(el).is(':visible')) {
              $('<div class="captcha"><img alt="图形验证未能正确显示，请刷新" src="' + getCaptchaURI() + '"><br><a style="cursor: pointer;">看不清，换一张</a></div>')
                .appendTo($(el).show())
                .find('a')
                .click(function(ev) {
                  $(this.parentNode).find('img').attr('src', getCaptchaURI());
                });
            }
          });
        }
      };
    },
    view: function(ctrl, data) {
      console.log('# Captcha.view');
      return m.component(Input, {type: 'text', label: '下边图片的内容是什么？', name: 'captcha', value: data.value, config: ctrl.config});
    }
  };

  return {
    Input: Input,
    Captcha: Captcha,
    autoFocus: autoFocus,
  };
})();

