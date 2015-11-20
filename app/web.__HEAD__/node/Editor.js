'use strict'

var Editor = {
  controller: function() {
    this.body = m.prop('')
    this.preview = function(ev) {
      console.log('form submitted')
      ev.preventDefault()
      m.redraw.strategy('none')

      preview(this.body())
    }.bind(this)

    var $previewBox = null
    var preview = function(text) {
      console.log('preview Handler')
      if ($previewBox) {
        $previewBox.html(markx(text))
      }
    }

    var ctrl = this
    this.markItUp = function() {
      return function(el, isInit) {
        if (!isInit) {
          $('textarea', el).markItUp(myMarkxSettings, {previewHandler: preview, afterInsert: function(h) {
              ctrl.body(h.textarea.value)
            }})
          $previewBox = $('<div class="preview"></div>').insertBefore($('.markItUpHeader', el))
        }
      }
    }
  },
  view: function(ctrl) {
    return m('form', {onsubmit: ctrl.preview}, [
      m.component(Form.TextArea, {label: 'Node', value: ctrl.body, config: ctrl.markItUp()}),
      m.component(Form.Button, {type: 'submit', value: '预览'})
    ])
  }
}

