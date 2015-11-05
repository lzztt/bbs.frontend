'use strict';

var Editor = {
  controller: function() {
    this.body = m.prop('');
    this.preview = function(ev) {
      console.log('form submitted');
      ev.preventDefault();
      m.redraw.strategy('none');

      var html = markx(this.body());
      console.log(html);
      var previewBox = $(ev.target.parentNode).find('div#preview');
      if (previewBox.length === 0) {
        previewBox = $('<div id="preview"></div>').appendTo(ev.target.parentNode)
      }
      previewBox.html(html);
    }.bind(this);
    this.markItUp = function() {
      var $previewBox = null;

      return function(el, isInit) {
        if (!isInit) {
          $('textarea', el).markItUp(myMarkxSettings, {previewHandler: function(text) {
              console.log('preview Handler');
              $previewBox.html(markx(text));
            }});
          $previewBox = $('<div id="preview"></div>').appendTo(el);
        }
      };
    };
  },
  view: function(ctrl) {
    return m('form', {onsubmit: ctrl.preview}, [
      m.component(Form.TextArea, {label: 'Node', value: ctrl.body, config: ctrl.markItUp()}),
      m.component(Form.Button, {type: 'submit', value: '预览'})
    ]);
  }
};

