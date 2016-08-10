"use strict";

var MarkxEditor = {
  controller: function() {
    var self = this;

    var $previewBox = null;

    this.preview = function(value) {
      return function(ev) {
        console.log("form submited");
        ev.preventDefault();
        ev.stopPropagation();
        ev.stopImmediatePropagation();
        m.redraw.strategy("none");

        preview(value());
      };
    };


    var preview = function(text) {
      console.log("preview Handler");
      if ($previewBox) {
        $previewBox.html(markx(text));
      }
    }


    this.markItUp = function(el, isInit) {
      if (!isInit) {
        $("textarea", el).markItUp(myMarkxSettings, {
          previewHandler: preview
        });
        $previewBox = $("<div class='preview'></div>").insertBefore($(".markItUpHeader", el));
      }
    }
  },
  /*
   * data.value: m.prop() getter-setter
   */
  view: function(ctrl, data) {
    return m("form", {
      onsubmit: data.submit,
      onreset: data.cancel,
      config: Form.autoFocus
    }, [
      data.title ? m.component(Form.Input, {
        label: "标题",
        value: data.title
      }) : null,
      m.component(Form.TextArea, {
        label: "正文",
        value: data.body,
        config: ctrl.markItUp
      }),
      m.component(Form.FileUploader, {
        files: data.files
      }),
      m.component(Form.Button, data.cancel ? [{
        type: "submit",
        value: "发布"
      }, {
        type: "reset",
        value: "取消"
      }] : {
        type: "submit",
        value: "发布"
      })
    ]);
  }
};
