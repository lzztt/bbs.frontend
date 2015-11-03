'use strict';

var Editor = {
  controller: function() {
    this.body = m.prop('');
    this.preview = function(ev) {
      console.log('form submitted');
      ev.preventDefault();

      var html = markx(this.body());
      console.log(html);
      var previewBox = $(ev.target.parentNode).find('div#preview');
      if (previewBox.length === 0) {
        previewBox = $('<div id="preview"></div>').appendTo(ev.target.parentNode)
      }
      previewBox.html(html);
    }.bind(this);
  },
  view: function(ctrl) {
    return m('form', {onsubmit: ctrl.preview}, [
      m.component(Form.TextArea, {label: 'Node', value: ctrl.body}),
      m.component(Form.Button, {type: 'submit', value: '预览'})
    ]);
  }
};

