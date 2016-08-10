"use strict";

var Form = (function() {
  var isArray = Array.isArray || function(object) {
    return type.call(object) === "[object Array]";
  };

  var autoFocus = function(form) {
    $("input:first, textarea:first", form).focus(); // first element autofocus
  };

  /*
   * data {
   *  label, text
   *  value: m.prop() getter-setter
   *  config: element config function, optional
   * }
   */
  var Input = {
    view: function(ctrl, data) {
      return m("fieldset", data.config ? {
        config: data.config
      } : null, [
        data.label ? m("label", data.label) : null,
        m("input", {
          type: data.type,
          value: data.value(),
          onchange: function(ev) {
            data.value(ev.target.value);
            m.redraw.strategy("none"); // do not redraw view
          }
        })
      ]);
    }
  };

  /*
   * data {
   *  label, text
   *  value: m.prop() getter-setter
   *  config: element config function, optional
   * }
   */
  var Captcha = {
    controller: function() {
      console.log("# Captcha.controller");

      var getCaptchaURI = function() {
        return "/api/captcha/" + Math.random().toString().slice(2);
      };

      var captcha = this;
      this.config = function(el, isInit) {
        console.log("Captcha.controller.config");
        $(el).hide();
        if (!isInit) {
          console.log("Captcha.controller.config: isInit=false");
          $(el).prev(":has(input)").find("input:first").focus(function() {
            console.log("captch:input:prev focused");
            if (!$(el).is(":visible")) {
              $("<div class="captcha"><img alt="图形验证未能正确显示，请刷新" src="" + getCaptchaURI() + ""><br><a style="cursor: pointer;">看不清，换一张</a></div>")
                .appendTo($(el).show())
                .find("a")
                .click(function(ev) {
                  $(this.parentNode).find("img").attr("src", getCaptchaURI());
                });
            }
          });
        }
      };
    },
    view: function(ctrl, data) {
      console.log("# Captcha.view");
      return m.component(Input, {
        type: "text",
        label: "下边图片的内容是什么？",
        value: data.value,
        config: ctrl.config
      });
    }
  };

  /*
   * read-only text:
   * data {
   *  label, text
   *  value: a function: m.prop() getter-setter,
   *        or [an array of] text, (virtual) element
   *  config: element config function, optional
   * }
   */
  var Text = {
    view: function(ctrl, data) {
      var value = typeof data.value === "function" ? data.value() : data.value;
      return m("fieldset", data.config ? {
        config: data.config
      } : null, [
        data.label ? m("label", data.label) : null,
        value
      ]);
    }
  }

  /*
   * data {
   *  label, text
   *  value: m.prop() getter-setter
   *  config: element config function, optional
   * }
   */
  var TextArea = {
    view: function(ctrl, data) {
      return m("fieldset", data.config ? {
        config: data.config
      } : null, [
        data.label ? m("label", data.label) : null,
        m("textarea", {
          value: data.value(),
          onchange: function(ev) {
            data.value(ev.target.value);
            m.redraw.strategy("none"); // do not redraw view
          }
        })
      ]);
    }
  };

  var Button = {
    view: function(ctrl, data) {
      if (isArray(data)) {
        return m("fieldset", data.map(function(b) {
          return m("button", b.type ? {
            type: b.type
          } : null, b.value);
        }));
      } else {
        return m("fieldset", m("button", data.type ? {
          type: data.type
        } : null, data.value));
      }
    }
  };

  var FileUploader = {
    controller: function() {
      console.log("# FileUploader.controller");

      var getCaptchaURI = function() {
        return "/api/captcha/" + Math.random().toString().slice(2);
      };

      var captcha = this;
      this.config = function(el, isInit) {
        console.log("FileUploader.controller.config");
        $(el).hide();
        if (!isInit) {
          console.log("FileUploader.controller.config: isInit=false");
        }
      };
    },
    view: function(ctrl, data) {

    }
  };

  return {
    Input: Input,
    Captcha: Captcha,
    Text: Text,
    TextArea: TextArea,
    Button: Button,
    autoFocus: autoFocus,
  };
})();
